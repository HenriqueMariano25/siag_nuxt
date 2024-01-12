<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			:titulo="descricao ? 'EDITAR DESCRIÇÃO DO CARGO' : 'CADASTRAR DESCRIÇÃO DO CARGO'"
      :btn-deletar="true"
      @deletar="deletarDescricao()"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="flex flex-col gap-2 px-2 max-h-[550px] overflow-auto">
					<div class="flex flex-col gap-2 bg-blue-100 border border-blue-300 p-1">
						<div class="flex w-full bg-blue-300 px-2 py-1 font-bold">
							<span>DESCRIÇÃO</span>
						</div>
						<AppFormInput
							id="titulo_cargo"
							type="text"
							placeholder="Ex: ENCARREGADO DE ALMOXARIFADO"
							:invalido="erros.includes('titulo')"
							v-model="descricaoCargo.titulo"
							label="Título do cargo" />
						<AppFormTextarea
							id="missao_cargo"
							label="Missão do cargo"
							:invalido="erros.includes('missao')"
							v-model="descricaoCargo.missao"
							placeholder="Ex: Liderar a área de almoxarifado..."
							linhas="2" />
					</div>
					<div class="grid grid-cols-2 gap-2 p-1 bg-blue-100 border border-blue-300">
						<div class="flex w-full bg-blue-300 px-2 py-1 font-bold col-span-2">
							<span>REQUISITOS</span>
						</div>
						<div class="flex flex-col p-1 bg-white border border-blue-200 gap-2">
							<div class="flex w-full bg-blue-300 px-2 py-1 font-bold">
								<span>Mínimo</span>
							</div>
              <AppFormSelect
                id="formacao_min_id"
                label="Formação"
                v-model="descricaoCargo.formacao_min_id"
                :invalido="erros.includes('formacao_min_id')"
                :options="formacoes" />
							<AppFormInput
								id="area"
								type="text"
								v-model="descricaoCargo.area_min"
								:invalido="erros.includes('area_min')"
								label="Área"
								placeholder="Ex: Administração"
								class="grow" />
						</div>
						<div class="flex flex-col p-1 bg-white border border-blue-200 gap-2">
							<div class="flex w-full bg-blue-300 px-2 py-1 font-bold">
								<span>Desejavel</span>
							</div>
              <AppFormSelect
                id="formacao_des_id"
                label="Formação"
                v-model="descricaoCargo.formacao_des_id"
                :invalido="erros.includes('formacao_des_id')"
                :options="formacoes" />
							<AppFormInput
								id="area"
								type="text"
								v-model="descricaoCargo.area_des"
								:invalido="erros.includes('area_des')"
								label="Área"
								placeholder="Ex: Administração"
								class="grow" />
						</div>
					</div>
					<div class="flex flex-col p-1 border border-blue-300 bg-blue-100">
						<span class="w-full bg-blue-300 px-2">Certificações</span>
						<div class="flex gap-2">
							<AppFormInput
								id="certificacao"
								type="text"
								v-model="certificacao.descricao"
								label="Descrição"
								:invalido="errosCertificacao.includes('descricao')"
								placeholder="Ex: Curso Técnico"
								class="grow" />
							<AppFormSelect
								id="nivel_certificacao"
								:invalido="errosCertificacao.includes('nivel')"
								label="Nivel"
								v-model="certificacao.nivel"
								:options="niveis" />
							<div>
								<AppFormRadio
									:linha="true"
									v-model="certificacao.tipo"
									:invalido="errosCertificacao.includes('tipo')"
									:itens="tipos"
									titulo="Tipo"
									id="certificacao" />
							</div>
							<div class="flex items-end">
                <BotaoPadrao
                  v-if="Object.keys(certificacao).includes('id') || certificacao.situacao === 'novo' "
                  @clique="editarCertificacao()"
                  class="!p-1"
                  cor="bg-blue-400 hover:!bg-blue-500">
                  <img
                    src="@/assets/icons/save-b.svg"
                    alt=""
                    class="w-7 h-7" />
                </BotaoPadrao>
								<BotaoPadrao
                  v-else
									@clique="adicionarCertificacao()"
									class="!p-1"
									cor="bg-blue-400 hover:!bg-blue-500">
									<img
										src="@/assets/icons/add-b.svg"
										alt=""
										class="w-7 h-7" />
								</BotaoPadrao>
							</div>
						</div>
						<div
							class="px-1 mt-1"
							v-if="certificacoesVazia">
							<span class="w-full flex bg-red-300 text-red-900 font-bold text-xl px-1"
								>A lista de CERTIFICAÇÃO tem que ter pelo menos 1 item!</span
							>
						</div>
						<div class="w-full mt-1">
							<table
								class="w-full table"
								v-if="certificacoes.length > 0">
								<thead class="bg-blue-900 text-white">
									<tr>
										<th class="border border-gray-700 px-1 w-full">Certificação</th>
										<th class="border border-gray-700 px-1">Nivel</th>
										<th class="border border-gray-700 px-1">Tipo</th>
										<th class="border border-gray-700 px-1"></th>
									</tr>
								</thead>
								<tbody class="bg-white">
									<tr v-for="(cert, index) of certificacoes">
										<td class="border border-gray-700 px-1">{{ cert.descricao }}</td>
										<td class="border border-gray-700 px-1 text-center">
											{{ cert.nivel }}
										</td>
										<td class="border border-gray-700 px-1 text-center">{{ cert.tipo }}</td>
										<td class="border border-gray-700 px-1">
											<div class="w-[56px] flex gap-1">
                        <BotaoPadrao icone @clique="certificacao = Object.assign({index}, cert)">
                          <img src="@/assets/icons/edit-b.svg" alt="" class="w-5 h-5">
                        </BotaoPadrao>
												<BotaoPadrao
													icone
													@clique="removerCertificacao(index)">
													<img
														src="@/assets/icons/delete-b.svg"
														alt=""
														class="w-5 h-5" />
												</BotaoPadrao>

											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div class="flex flex-col p-1 border border-blue-300 bg-blue-100">
						<span class="w-full bg-blue-300 px-2">Conhecimentos Técnicos</span>
						<div class="flex gap-2">
							<AppFormInput
								id="descricao_conhecimento"
								type="text"
								label="Descrição"
								v-model="conhecimento.descricao"
								placeholder="Ex: Microsoft Office"
								:invalido="errosConhecimentos.includes('descricao')"
								class="grow" />
							<AppFormSelect
								id="nivel_conhecimento"
								label="Nivel"
								v-model="conhecimento.nivel"
								:invalido="errosConhecimentos.includes('nivel')"
								:options="niveis" />
							<div>
								<AppFormRadio
									:linha="true"
									v-model="conhecimento.tipo"
									:invalido="errosConhecimentos.includes('tipo')"
									:itens="tipos"
									titulo="Tipo"
									id="tipo_conhecimento" />
							</div>
							<div class="flex items-end">
                <BotaoPadrao
                  v-if="Object.keys(conhecimento).includes('id') || conhecimento.situacao === 'novo' "
                  @clique="editarConhecimento()"
                  class="!p-1"
                  cor="bg-blue-400 hover:!bg-blue-500">
                  <img
                    src="@/assets/icons/save-b.svg"
                    alt=""
                    class="w-7 h-7" />
                </BotaoPadrao>
								<BotaoPadrao
                  v-else
									@clique="adicionarConhecimento()"
									class="!p-1"
									cor="bg-blue-400 hover:!bg-blue-500">
									<img
										src="../../../../../../assets/icons/add-b.svg"
										alt=""
										class="w-7 h-7" />
								</BotaoPadrao>
							</div>
						</div>
						<div
							class="px-1 mt-1"
							v-if="conhecimentosVazio">
							<span class="w-full flex bg-red-300 text-red-900 font-bold text-xl px-1"
								>A lista de CONHECIMENTOS TÉCNICOS tem que ter pelo menos 1 item!</span
							>
						</div>
						<div class="w-full mt-1">
							<table
								class="w-full table"
								v-if="conhecimentos.length > 0">
								<thead class="bg-blue-900 text-white">
									<tr>
										<th class="border border-gray-700 px-1 w-full">Conhecimentos Técnicos</th>
										<th class="border border-gray-700 px-1">Nivel</th>
										<th class="border border-gray-700 px-1">Tipo</th>
										<th class="border border-gray-700 px-1"></th>
									</tr>
								</thead>
								<tbody class="bg-white">
									<tr v-for="(conhe, index) of conhecimentos">
										<td class="border border-gray-700 px-1">{{ conhe.descricao }}</td>
										<td class="border border-gray-700 px-1 text-center">
											{{ conhe.nivel }}
										</td>
										<td class="border border-gray-700 px-1 text-center">{{ conhe.tipo }}</td>
										<td class="border border-gray-700 px-1">
											<div class="w-[56px] flex gap-1">
                        <BotaoPadrao icone @clique="conhecimento = Object.assign({index}, conhe)">
                          <img src="@/assets/icons/edit-b.svg" alt="" class="w-5 h-5">
                        </BotaoPadrao>
												<BotaoPadrao
													icone
													@clique="removerConhecimento(index)">
													<img
														src="@/assets/icons/delete-b.svg"
														alt=""
														class="w-5 h-5" />
												</BotaoPadrao>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<BotaoPadrao
					texto="salvar"
					@clique="descricao ? editarDescricaoCargo() : cadastrarDescricaoCargo()">
					<img
						src="@/assets/icons/save-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	 import { validarFormulario } from "~/mixins/validarFormulario"

	export default {
		name: "DialogCriarDescricaoCargo",
		components: {
			AppFormRadio,
			AppFormSelect,
			BotaoPadrao,
			AppFormTextarea,
			AppFormInput,
			BaseDialog,
		},
    props: {
      descricao: {
        type: Object,
      }
    },
		data() {
			return {
				itensTeste: ["centificacoes", "Teste"],
				itensVazio: [],
				niveis: [
					{ nome: "Básico", id: "Básico" },
					{ nome: "Intermediário", id: "Intermediário" },
					{ nome: "Avançado", id: "Avançado" },
				],
				tipos: [
					{ label: "Mínimo", valor: "Mínimo" },
					{ label: "Desejável", valor: "Desejável" },
				],

	       camposValidacao: ['descricao', 'tipo', 'nivel'],
	       descricaoCargo:{
	         titulo: null,
	         missao: null,
	         formacao_min_id:null,
	         formacao_des_id:null,
	         area_min: null,
	         area_des: null,
	       },
	       erros: [],
	       camposValidacaoDescricao: [
	         'titulo',
	         'missao',
	         'formacao_min_id',
	         'formacao_des_id',
	         'area_min',
	         'area_des',
	       ],

	       //CERTIFICADO
				certificacao: {
					descricao: null,
					nivel: null,
					tipo: null,
				},
				certificacoes: [],
	       errosCertificacao: [],
	       certificacoesVazia: false,

	       //CONHECIMENTO
	       conhecimento: {
	         descricao: null,
	         nivel: null,
	         tipo: null,
	       },
	       conhecimentos: [],
	       errosConhecimentos: [],
	       conhecimentosVazio: false,
        formacoes: []
			}
		},
    async mounted() {
      if(this.descricao){
        await this.buscarDescricaoCargo()
      }
      await this.buscarFormacoes()
    },
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

      async buscarDescricaoCargo(){
        let { id } = this.descricao

        let resp = await this.$axios.$get(`/descricao_cargo/buscar/${id}`)

        if(!resp.falha){
          let descricaoCargo = resp.dados.descricaoCargo

          this.descricaoCargo = Object.assign({}, descricaoCargo)
          this.certificacoes = descricaoCargo.CertificacaoAvaliacao
          this.conhecimentos = descricaoCargo.ConheTecnicoAvaliacao
        }
      },

	     async cadastrarDescricaoCargo() {
	       this.conhecimentosVazio = false
	       this.certificacoesVazia = false

	       let qtdConhecimentos = this.conhecimentos.length
	       if(qtdConhecimentos === 0){
	         this.conhecimentosVazio = true
	       }

	       let qtdCertificacoes=  this.certificacoes.length
	       if(qtdCertificacoes === 0){
	         this.certificacoesVazia = true
	       }

	       let certificacoes = this.certificacoes
	       let conhecimentos = this.conhecimentos

	       this.erros = validarFormulario(this.camposValidacaoDescricao, this.descricaoCargo)

	       if(this.erros.length === 0 && qtdCertificacoes > 0 && qtdConhecimentos > 0){
	          let resp = await this.$axios.$post("/descricao_cargo/cadastrar", { ...this.descricaoCargo, certificacoes,
	            conhecimentos })

           if(!resp.falha){
             this.$emit("cadastrado", resp.dados.descricaoCargo)
           }
	       }
	     },

      async editarDescricaoCargo(){
        this.conhecimentosVazio = false
        this.certificacoesVazia = false

        let qtdConhecimentos = this.conhecimentos.length
        if (qtdConhecimentos === 0) {
          this.conhecimentosVazio = true
        }

        let qtdCertificacoes = this.certificacoes.length
        if (qtdCertificacoes === 0) {
          this.certificacoesVazia = true
        }

        let certificacoes = this.certificacoes
        let conhecimentos = this.conhecimentos

        this.erros = validarFormulario(this.camposValidacaoDescricao, this.descricaoCargo)

        let { id } = this.descricao

        if (this.erros.length === 0 && qtdCertificacoes > 0 && qtdConhecimentos > 0) {
          let resp = await this.$axios.$post(`/descricao_cargo/editar`, {
            ...this.descricaoCargo, certificacoes, id,
            conhecimentos
          })

          if (!resp.falha) {
            this.$emit("editado", resp.dados.descricaoCargo)
          }
        }
      },

      async deletarDescricao() {
        let { id } = this.descricao
        let resp = await this.$axios.$delete("/descricao_cargo/deletar", { params: { id } })

        if (!resp.falha) {
          this.$emit("deletado", id)
        }
      },

      async buscarFormacoes(){
        let resp = await this.$axios.$get("/descricao_cargo/formacoes")

        if(!resp.falha){
         let formacoes = resp.dados.formacoes
          this.formacoes = formacoes.map( o => { return { id: o.id, nome: o.descricao }})
        }
      },

	     //CERTIFICACAO
			adicionarCertificacao() {
	       this.certificacoesVazia = false
	       this.errosCertificacao = validarFormulario(this.camposValidacao, this.certificacao)

				if (this.errosCertificacao.length === 0) {
					this.certificacoes.push({ ...this.certificacao, situacao: "novo"})
					this.certificacao = {
						descricao: null,
						nivel: null,
						tipo: null,
					}
				}
			},
      editarCertificacao(){
        this.certificacoesVazia = false
        this.errosCertificacao = validarFormulario(this.camposValidacao, this.certificacao)

        if (this.errosCertificacao.length === 0) {
          let certificacao = this.certificacao

          for (let k of Object.keys(this.certificacoes[certificacao.index])) {
            this.certificacoes[certificacao.index][k] = certificacao[k]
          }
          this.certificacao = {
            descricao: null,
            nivel: null,
            tipo: null,
          }
        }
      },
	     removerCertificacao(index){
	       this.certificacoes.splice(index, 1)
	     },

	     //CONHECIMENTO
	     adicionarConhecimento() {
	       this.conhecimentosVazio = false
	       this.errosConhecimentos = validarFormulario(this.camposValidacao, this.conhecimento)

	       if (this.errosConhecimentos.length === 0) {
	         this.conhecimentos.push({ ...this.conhecimento, situacao: "novo"})
	         this.conhecimento = {
	           descricao: null,
	           nivel: null,
	           tipo: null,
	         }
	       }
	     },
      editarConhecimento() {
        this.conhecimentosVazio = false
        this.errosConhecimentos = validarFormulario(this.camposValidacao, this.conhecimento)

        if (this.errosConhecimentos.length === 0) {
          let conhecimento = this.conhecimento

          for (let k of Object.keys(this.conhecimentos[conhecimento.index])) {
            this.conhecimentos[conhecimento.index][k] = conhecimento[k]
          }
          this.conhecimento = {
            descricao: null,
            nivel: null,
            tipo: null,
          }
        }
      },
	     removerConhecimento(index) {
	       this.conhecimentos.splice(index, 1)
	     },
		},
	}
</script>

<style scoped></style>
