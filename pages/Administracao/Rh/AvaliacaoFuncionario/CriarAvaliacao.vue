<template>
	<div class="w-full">
		<CabecalhoPagina :titulo="jaIniciado ? 'EDITAR AVALIAÇAO' : 'CRIAR AVALIAÇÃO'" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<AppTabs
				:tabs="tabs"
				@tab="tab = $event">
				<template v-slot:[`tab.funcionario`]="{ item }">
					<div
						class="flex flex-col gap-2 overflow-y-auto"
						style="max-height: calc(100vh - 90px)">
						<div>
							<span class="text-gray-700 text-lg px-2 font-bold"
								>Primeiro preencha os dados do funcionário
							</span>
						</div>
						<div class="grid grid-cols-12 p-1 gap-2 items-center">
							<AppFormSelectCompleto
								id="funcionario_id"
                :disabled="jaIniciado"
                :readonly="jaIniciado"
								v-model="funcionario.funcionario_id"
								label="Funcionário"
								:invalido="erros.includes('funcionario_id')"
								:options="encarregados"
								class="col-span-6" />
							<AppFormInput
								readonly
								disabled
								type="text"
								v-model="funcionario.chapa"
								id="cargo"
								label="Matricula"
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
							<div
								class="col-span-12 flex flex-col px-2 bg-red-200 border-2 border-red-100 text-lg text-gray-900"
								v-if="avaliacaoEncarregado"
								:class="{ '!text-xl text-red-900': erroJaTemAvaliacao }">
								<span>Esse funcionário já tem uma avaliação em aberto</span>
								<span
									>Iniciada por <strong>{{ avaliacaoEncarregado.nome }}</strong> no dia
									<strong>{{
										$dayjs(avaliacaoEncarregado.data).format("DD/MM/YYYY HH:mm")
									}}</strong></span
								>
							</div>
							<AppFormSelectCompleto
								id="formacao"
								v-model="funcionario.formacao_id"
								:invalido="erros.includes('formacao_id')"
								label="Formacação"
								:options="formacoes"
								class="col-span-4" />
							<AppFormInput
								type="number"
								:invalido="erros.includes('anos_experiencia')"
								id="ano_experiencia"
								v-model="funcionario.anos_experiencia"
								label="Anos de Experiencia"
								placeholder="Ex: 3 anos"
								class="col-span-3" />

							<div class="col-span-12 gap-2 grid grid-cols-2">
								<div>
									<table class="border table w-full">
										<thead class="bg-blue-900 text-white">
											<tr class="border border-gray-700">
												<th class="border border-gray-700 px-2 w-full">CONHECIMENTO</th>
												<th class="border border-gray-700 px-2"></th>
											</tr>
										</thead>
										<tbody class="bg-white">
											<tr
												v-for="conhecimento of conhecimentosFuncionario"
												:key="conhecimento.id">
												<td class="border border-gray-700 items-center px-2">
													{{ conhecimento.descricao }}
												</td>
												<td class="border border-gray-700">
													<div class="flex justify-center p-0.5 pt-1">
														<AppFormCheckbox
															label=""
															:id="'checkboxConhecimento' + conhecimento.id"
															:valor="conhecimento.id"
															v-model="funcionario.conhecimentos" />
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div>
									<table class="border table w-full">
										<thead class="bg-blue-900 text-white">
											<tr class="border border-gray-700">
												<th class="border border-gray-700 px-2 w-full">TIPOS DE OBRA</th>
												<th class="border border-gray-700 px-2"></th>
											</tr>
										</thead>
										<tbody class="bg-white">
											<tr
												v-for="item of tiposObra"
												:key="item.id">
												<td class="border border-gray-700 items-center px-2">
													{{ item.descricao }}
												</td>
												<td class="border border-gray-700">
													<div class="flex justify-center items-center p-0.5 pt-1">
														<AppFormCheckbox
															label=""
															:id="'checkboxTipoObra' + item.id"
															:valor="item.id"
															v-model="funcionario.tiposObra" />
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div>
									<table class="border table w-full">
										<thead class="bg-blue-900 text-white">
											<tr class="border border-gray-700">
												<th class="border border-gray-700 px-2 w-full">
													LOCALIDADE/DISPO. DE TRABALHO
												</th>
												<th class="border border-gray-700 px-2"></th>
											</tr>
										</thead>
										<tbody class="bg-white">
											<tr
												v-for="item of disponibilidadesTrabalho"
												:key="item.id">
												<td class="border border-gray-700 items-center px-2">
													{{ item.descricao }}
												</td>
												<td class="border border-gray-700">
													<div class="flex justify-center p-0.5 pt-1">
														<AppFormCheckbox
															label=""
															:id="'checkboxDispoTrabalho' + item.id"
															:valor="item.id"
															v-model="funcionario.dispoTrabalho" />
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<!--            <div class="px-2">-->
						<!--              <span class="text-xl font-bold text-slate-900">Para continuar a avaliação primeiro SALVE os dados do funcionário</span>-->
						<!--            </div>-->
					</div>
				</template>
				<template v-slot:[`tab.descricao_cargo`]="{ item }">
					<div
						class="relative"
						v-if="jaIniciado">
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
				</template>
			</AppTabs>
		</div>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex items-center w-full justify-between">
					<div class="flex gap-2">
						<BotaoPadrao
							texto="voltar"
							@clique="voltar()">
							<img
								src="@/assets/icons/back-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>

						<BotaoPadrao
							texto="deletar"
							v-if="jaIniciado && !estaDeletando"
							@clique="estaDeletando = true"
							cor="bg-red-400 hover:!bg-red-500">
							<img
								src="@/assets/icons/delete-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
            <div v-if="estaDeletando" class="flex items-center">
              <BotaoPadrao texto="Não" cor=" bg-red-500" @clique="estaDeletando = false"></BotaoPadrao>
              <span class="px-2 text-white">Certeza que deseja deletar essa AVALIÇÃO ?</span>
              <BotaoPadrao texto="Sim" cor="bg-green-500" @clique="cancelarAvaliacao()"></BotaoPadrao>
            </div>
					</div>
					<div class="flex gap-2">
						<BotaoPadrao
							texto="SALVAR"
							@clique="iniciarAvaliacao(false)">
							<template v-slot>
								<img
									src="@/assets/icons/save-b.svg"
									alt="close"
									class="w-7 h-7" />
							</template>
						</BotaoPadrao>
						<BotaoPadrao
							texto="SALVAR e SAIR"
							@clique="jaIniciado ? editarAvaliacao(true) : iniciarAvaliacao(true)">
							<template v-slot>
								<img
									src="@/assets/icons/save-b.svg"
									alt="close"
									class="w-7 h-7" />
							</template>
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import { validarFormulario } from "~/mixins/validarFormulario"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"

	export default {
		components: {
			AppAlerta,
			AppFormCheckbox,
			BotaoPadrao,
			RodapePagina,
			AppTabs,
			CabecalhoPagina,
			AppFormInput,
			AppFormSelectCompleto,
			AppFormRadio,
		},
		data() {
			return {
				tab: "funcionario",
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
					dispoTrabalho: [],
				},
				jaIniciado: false,
				conhecimentosFuncionario: [],
				tiposObra: [],
				disponibilidadesTrabalho: [],
				campos: ["funcionario_id", "formacao_id", "anos_experiencia"],
				erros: [],
				avaliacao_id: null,
				mostrarAlerta: false,
				textoAlerta: null,
				avaliacaoEncarregado: null,
				erroJaTemAvaliacao: false,
        estaDeletando: false,
			}
		},
		computed: {
			tabs() {
				return [
					{ nome: "Funcionário", valor: "funcionario" },
					{ nome: "Descrição Cargo", valor: "descricao_cargo", disabled: !this.jaIniciado },
				]
			},
		},
		async mounted() {
			await this.buscarEncarregados()
			await this.buscarFormacoes()
			await this.buscarConheFuncionario()
			await this.buscarTipoObra()
			await this.buscarDisponibilidaTrabalho()

			if (this.$route.params.id) {
				await this.buscarAvaliacao(this.$route.params.id)
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			voltar() {
				this.$router.push({
					name: "Administracao-Rh-AvaliacaoFuncionario-Avaliacoes",
				})
			},
			async buscarEncarregados() {
				let resp = await this.$axios.$get("/avaliacao_funcionario/buscar_encarregados")

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
			async buscarConheFuncionario() {
				let resp = await this.$axios.$get("/conhecimento_funcionario/buscarSimples")

				if (!resp.falha) {
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
			async iniciarAvaliacao(sair) {
				let {
					funcionario_id,
					formacao_id,
					anos_experiencia,
					conhecimentos,
					dispoTrabalho,
					tiposObra,
				} = this.funcionario
        this.erroJaTemAvaliacao = false
				let usuario_id = this.$auth.user.id

				this.erros = validarFormulario(this.campos, this.funcionario)

				if (this.erros.length === 0) {
					if (this.avaliacaoEncarregado) {
						this.erroJaTemAvaliacao = true
					} else {
						let resp = await this.$axios.$post("/avaliacao_funcionario/cadastrar", {
							funcionario_id,
							formacao_id,
							anos_experiencia,
							conhecimentos,
							dispoTrabalho,
							tiposObra,
							usuario_id,
						})

						if (!resp.falha) {
							let avaliacao = resp.dados.avaliacao

							if (sair) {
								await this.$router.push({
									name: "Administracao-Rh-AvaliacaoFuncionario-Avaliacoes",
									params: { acao: "Cadastrado" },
								})
							} else {
								this.avaliacao_id = avaliacao.id
								this.jaIniciado = true
								this.textoAlerta = "Avaliação iniciada com sucesso!"
								this.mostrarAlerta = true
							}
						}
					}
				}
			},
			async editarAvaliacao(sair) {
				let {
					funcionario_id,
					formacao_id,
					anos_experiencia,
					conhecimentos,
					dispoTrabalho,
					tiposObra,
				} = this.funcionario
				let avaliacao_id = this.avaliacao_id
				let usuario_id = this.$auth.user.id

				this.erros = validarFormulario(this.campos, this.funcionario)

				if (this.erros.length === 0) {
					let resp = await this.$axios.$post("/avaliacao_funcionario/editar", {
						funcionario_id,
						formacao_id,
						anos_experiencia,
						conhecimentos,
						dispoTrabalho,
						tiposObra,
						usuario_id,
						avaliacao_id,
					})

					if (!resp.falha) {
						if (sair) {
							await this.$router.push({
								name: "Administracao-Rh-AvaliacaoFuncionario-Avaliacoes",
								params: { acao: "Editado" },
							})
						} else {
							this.jaIniciado = true
							this.textoAlerta = "Avaliação editada com sucesso!"
							this.mostrarAlerta = true
						}
					}
				}
			},
			async buscarAvaliacao(id) {
				let resp = await this.$axios.$get("/avalicao_funcionario/buscarAvaliacao", {
					params: { id },
				})

				if (!resp.falha) {
					let avaliacao = resp.dados.avaliacao

					this.avaliacao_id = avaliacao.id
					this.jaIniciado = true
					let conhecimentos = avaliacao.Funcionario.ConheFuncionarioAvaliacaos
					this.funcionario.conhecimentos = conhecimentos.map((o) => o.id)
					let tiposObra = avaliacao.Funcionario.TipoObraAvaliacaos
					this.funcionario.tiposObra = tiposObra.map((o) => o.id)
					let dispoTrabalho = avaliacao.Funcionario.DispoTrabalhoAvaliacaos
					this.funcionario.dispoTrabalho = dispoTrabalho.map((o) => o.id)

					this.funcionario.funcionario_id = avaliacao.funcionario_id
					this.funcionario.formacao_id = avaliacao.Funcionario.formacao_id
					this.funcionario.anos_experiencia = avaliacao.Funcionario.anos_experiencia
				}
			},
			async cancelarAvaliacao() {
				let id = this.avaliacao_id

				let resp = await this.$axios.$delete(`/avaliacao_funcionario/deletar`, { params: { id } })

				if (!resp.falha) {
					await this.$router.push({
						name: "Administracao-Rh-AvaliacaoFuncionario-Avaliacoes",
						params: { acao: "Deletado", item: id },
					})
				}
			},
		},
		watch: {
			"funcionario.funcionario_id"(valor) {
				if (valor) {
					let idx = this.encarregados.findIndex((o) => o.id === valor)

					let encarregado = this.encarregados[idx]
					this.funcionario.chapa = encarregado.chapa
					this.funcionario.cargo = encarregado.cargo


          if(!this.jaIniciado){

					if (encarregado.AvaliacaoFuncionarios.length > 0) {
						this.avaliacaoEncarregado = {
							nome: encarregado.AvaliacaoFuncionarios[0].AvaliadoPor.nome,
							data: encarregado.AvaliacaoFuncionarios[0].createdAt,
						}
					} else {
						this.avaliacaoEncarregado = null
					}
          }
				}
			},
		},
	}
</script>

<style scoped></style>
