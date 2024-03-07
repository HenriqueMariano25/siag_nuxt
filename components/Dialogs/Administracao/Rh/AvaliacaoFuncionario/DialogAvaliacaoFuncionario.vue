<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			titulo="AVALIAR O FUNCIONÁRIO"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 flex flex-col gap-2 overflow-y-auto" style="max-height: calc(100vh - 180px)">
					<div class="grid grid-cols-12 p-1 gap-2 border border-blue-300 bg-blue-100">
						<span class="w-full bg-blue-300 px-2 col-span-12">Funcionário</span>
						<AppFormSelectCompleto
							id="funcionario_id"
							v-model="funcionario.funcionario_id"
							label="Funcionário"
							:options="encarregados"
							class="col-span-6" />
						<AppFormInput
							readonly
							disabled
							type="text"
							v-model="funcionario.chapa"
							id="cargo"
							label="Matrícula"
							placeholder="Ex: 1950000001"
							class="col-span-3" />
						<AppFormInput
							type="text"
							readonly
							disabled
							id="cargo"
							v-model="funcionario.cargo"
							label="Cargo"
							placeholder="Ex: ENCARREGADO DE ALMOXARIFADO"
							class="col-span-3" />
						<AppFormSelectCompleto
							id="formacao"
							v-model="funcionario.formacao_id"
							label="Formação"
							:options="formacoes"
							class="col-span-4" />
						<AppFormInput
							type="number"
							id="ano_experiencia"
							v-model="funcionario.anos_experiencia"
							label="Anos de Experiência"
							placeholder="Ex: 3 anos"
							class="col-span-3" />

            <div class="col-span-12 gap-2 grid grid-cols-2">
              <div>
                <table class="border table w-full">
                  <thead class="bg-blue-900 text-white">
                  <tr class="border border-gray-700">
                    <th class="border border-gray-700 px-2 w-full">CONHECIMENTO</th>
                    <th class="border border-gray-700 px-2">SIM</th>
                    <th class="border border-gray-700 px-2">NÃO</th>
                  </tr>
                  </thead>
                  <tbody class="bg-white">
                  <tr v-for="conhecimento of conhecimentosFuncionario" :key="conhecimento.id">
                    <td class="border border-gray-700 items-center px-2">
                      {{ conhecimento.descricao }}
                    </td>
                    <td class="border border-gray-700">
                      <AppFormRadio
                        :id="'sim_'+conhecimento.descricao"
                        titulo=""
                        :value="conhecimento.id"
                        class="!ml-2.5 mt-[2px] flex"
                        v-model="funcionario.conhecimentos"
                        :itens="[{ label: '', valor: conhecimento.id }]" />
                    </td>
                    <td class="border border-gray-700">
                      <AppFormRadio
                        :id="'nao_'+conhecimento.descricao"
                        titulo=""
                        :value="conhecimento.id"
                        class=" flex !ml-3.5"
                        v-model="funcionario.conhecimentos"
                        :itens="[{ label: '', valor: conhecimento.id }]" />
                    </td>
                  </tr>
                  </tbody>
                </table>
                {{ funcionario.conhecimentos }}
              </div>
              <div>
                <table class="border table w-full">
                  <thead class="bg-blue-900 text-white">
                  <tr class="border border-gray-700">
                    <th class="border border-gray-700 px-2 w-full">TIPOS DE OBRA</th>
                    <th class="border border-gray-700 px-2">SIM</th>
                    <th class="border border-gray-700 px-2">NÃO</th>
                  </tr>
                  </thead>
                  <tbody class="bg-white">
                  <tr v-for="item of tiposObra" :key="item.id">
                    <td class="border border-gray-700 items-center px-2">
                      {{ item.descricao }}
                    </td>
                    <td class="border border-gray-700">
                      <AppFormRadio
                        :id="'sim_'+item.descricao"
                        titulo=""
                        :value="item.id"
                        class="!ml-2.5 mt-[2px] flex"
                        :itens="[{ label: '', valor: item.id }]" />
                    </td>
                    <td class="border border-gray-700">
                      <AppFormRadio
                        :id="'nao_'+item.descricao"
                        titulo=""
                        :value="item.id"
                        class=" flex !ml-3.5"
                        :itens="[{ label: '', valor: item.id }]" />
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table class="border table w-full">
                  <thead class="bg-blue-900 text-white">
                  <tr class="border border-gray-700">
                    <th class="border border-gray-700 px-2 w-full">Localidade/Dispo. de Trabalho</th>
                    <th class="border border-gray-700 px-2">SIM</th>
                    <th class="border border-gray-700 px-2">NÃO</th>
                  </tr>
                  </thead>
                  <tbody class="bg-white">
                  <tr v-for="item of disponibilidadesTrabalho" :key="item.id">
                    <td class="border border-gray-700 items-center px-2">
                      {{ item.descricao }}
                    </td>
                    <td class="border border-gray-700">
                      <AppFormRadio
                        :id="'sim_'+item.descricao"
                        titulo=""
                        :value="item.id"
                        class="!ml-2.5 mt-[2px] flex"
                        :itens="[{ label: '', valor: item.id }]" />
                    </td>
                    <td class="border border-gray-700">
                      <AppFormRadio
                        :id="'nao_'+item.descricao"
                        titulo=""
                        :value="item.id"
                        class=" flex !ml-3.5"
                        :itens="[{ label: '', valor: item.id }]" />
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
					</div>
          <div class="px-2">
            <span class="text-xl font-bold text-slate-900">Para continuar a avaliação primeiro SALVE os dados do funcionário</span>
          </div>
					<div class="relative" v-if="jaIniciado">

						<div class="grid grid-cols-12 p-1 gap-2 border border-blue-300 bg-blue-100">
							<span class="w-full bg-blue-300 px-2 col-span-12">Descrição do Cargo</span>
							<span class="col-span-12">Preencha as colunas NOTA com os valores:</span>
							<div class="col-span-6">
								<table class="w-full table">
									<thead class="bg-blue-900 text-white">
										<tr>
											<th class="border border-gray-700 whitespace-nowrap px-1 w-full">
												Conhecimento Técnico
											</th>
											<th class="border border-gray-700 whitespace-nowrap px-1">Nivel</th>
											<th class="border border-gray-700 whitespace-nowrap px-1">Nota</th>
										</tr>
									</thead>
									<tbody class="bg-white">
										<tr>
											<td
												class="border border-gray-700 text-center bg-gray-200 text-sm"
												colspan="3">
												<span>0-Não avaliado; 1-Não Atende; 2-Atende; 3-Supera</span>
											</td>
										</tr>
										<tr>
											<td class="border border-gray-700 px-1">Pacote Office</td>
											<td class="border border-gray-700 px-1">Básico</td>
											<td class="border border-gray-700 px-1">
												<input
													id="teste"
													type="text"
													class="flex !h-[20px] !w-[40px] grow border border-gray-500 text-center"
													v-maska
													data-maska="#" />
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="col-span-6">
								<table class="w-full table">
									<thead class="bg-blue-900 text-white">
										<tr>
											<th class="border border-gray-700 whitespace-nowrap px-1 w-full">Idiomas</th>
											<th class="border border-gray-700 whitespace-nowrap px-1">Nivel</th>
											<th class="border border-gray-700 whitespace-nowrap px-1">Nota</th>
										</tr>
									</thead>
									<tbody class="bg-white">
										<tr>
											<td
												class="border border-gray-700 text-center bg-gray-200 text-sm"
												colspan="3">
												<span>0-Não avaliado; 1-Não Atende; 2-Atende; 3-Supera</span>
											</td>
										</tr>
										<tr>
											<td class="border border-gray-700 px-1">Inglês</td>
											<td class="border border-gray-700 px-1">Intermediário</td>
											<td class="border border-gray-700 px-1">
												<input
													id="teste"
													type="text"
													class="flex !h-[20px] !w-[40px] grow border border-gray-500 text-center"
													v-maska
													data-maska="#" />
											</td>
										</tr>
										<tr>
											<td class="border border-gray-700 px-1">Espanhol</td>
											<td class="border border-gray-700 px-1">Intermediário</td>
											<td class="border border-gray-700 px-1">
												<input
													id="teste"
													type="text"
													class="flex !h-[20px] !w-[40px] grow border border-gray-500 text-center"
													v-maska
													data-maska="#" />
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="col-span-6">
								<table class="w-full table">
									<thead class="bg-blue-900 text-white">
										<tr>
											<th class="border border-gray-700 whitespace-nowrap px-1 w-full">
												Certificações
											</th>
											<th class="border border-gray-700 whitespace-nowrap px-1">Nivel</th>
											<th class="border border-gray-700 whitespace-nowrap px-1">Nota</th>
										</tr>
									</thead>
									<tbody class="bg-white">
										<tr>
											<td
												class="border border-gray-700 text-center bg-gray-200 text-sm"
												colspan="3">
												<span>0-Não avaliado; 1-Não Atende; 2-Atende; 3-Supera</span>
											</td>
										</tr>
										<tr>
											<td class="border border-gray-700 px-1">Gestão de Material</td>
											<td class="border border-gray-700 px-1">Básico</td>
											<td class="border border-gray-700 px-1">
												<input
													id="teste"
													type="text"
													class="flex !h-[20px] !w-[40px] grow border border-gray-500 text-center"
													v-maska
													data-maska="#" />
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
        <div class="flex w-full justify-end gap-2">

				<BotaoPadrao texto="salvar" @clique="iniciarAvaliacao(false)">
					<img
						src="@/assets/icons/save-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
        <BotaoPadrao texto="salvar e sair" @clique="iniciarAvaliacao(true)">
          <img
            src="@/assets/icons/save-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
        </div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	export default {
		name: "DialogAvaliacaoFuncionario",
		components: {
			BaseDialog,
			AppFormInput,
			AppFormSelectCompleto,
		},
		data() {
			return {
				encarregados: [],
				formacoes: [],
				funcionario: {
					funcionario_id: null,
					chapa: null,
					cargo: null,
					formacao_id: null,
					anos_experiencia: null,
          conhecimentos: [],
          tiposObra: [],
          dispoTrabalho: []
				},
        jaIniciado: false,
        conhecimentosFuncionario: [],
        tiposObra: [],
        disponibilidadesTrabalho:[],
			}
		},
		async mounted() {
			await this.buscarEncarregados()
			await this.buscarFormacoes()
      await this.buscarConheFuncionario()
      await this.buscarTipoObra()
      await this.buscarDisponibilidaTrabalho()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarEncarregados() {
				let resp = await this.$axios.$get("/efetivo/buscar_encarregados")

				if (!resp.falha) {
					this.encarregados = resp.dados.encarregados
				}
			},
			async buscarFormacoes() {
				let resp = await this.$axios.$get("/descricao_cargo/formacoes")

				if (!resp.falha) {
					let formacoes = resp.dados.formacoes
					this.formacoes = formacoes.map((o) => {
						return { id: o.id, nome: o.descricao }
					})
				}
			},
      async buscarConheFuncionario(){
        let resp = await this.$axios.$get("/conhecimento_funcionario/buscarSimples")

        if(!resp.falha){
          this.conhecimentosFuncionario = resp.dados.conhecimentos
        }
      },
      async buscarTipoObra() {
        let resp = await this.$axios.$get("/tipo_obra/buscarSimples")

        if (!resp.falha) {
          this.tiposObra = resp.dados.tiposObra
        }
      },
      async buscarDisponibilidaTrabalho() {
        let resp = await this.$axios.$get("/disponibilidade_trabalho/buscarSimples")

        if (!resp.falha) {
          this.disponibilidadesTrabalho = resp.dados.disponibilidades
        }
      },
      async iniciarAvaliacao(sair){
        let { id } = this.$auth.user
        let { funcionario_id, formacao_id, ano_experiencia } = this.funcionario
      }
		},
		watch: {
			"funcionario.funcionario_id"(valor) {
				if (valor) {
					let idx = this.encarregados.findIndex((o) => o.id === valor)

					let encarregado = this.encarregados[idx]
					this.funcionario.chapa = encarregado.chapa
					this.funcionario.cargo = encarregado.cargo
				}
			},
		},
	}
</script>

<style scoped></style>
<script setup>
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
  import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue";
</script>
