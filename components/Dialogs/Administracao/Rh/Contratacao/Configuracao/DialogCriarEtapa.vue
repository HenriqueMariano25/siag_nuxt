<template>
	<div>
		<BaseDialog
			:titulo="etapa_id === null ? 'Criar etapa' : `Editando etapa - ${etapa.nome}`"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<AppTabs
					:tabs="tabs"
					@tab="tab = $event">
					<template v-slot:[`tab.informacoes`]="{ item }">
						<div class="px-2 py-1">
							<div class="grid grid-cols-2 gap-2 h-[500px] overflow-y-auto ">
								<AppFormInput
									id="nome"
									type="text"
									label="Nome"
									placeholder="Ex: Documentação"
									v-model="etapa.nome"
                  :invalido="erros.includes('nome')"
									obrigatorio />
								<AppFormInput
									id="leadtime"
									type="number"
									label="Leadtime (dias)"
									placeholder="Ex: 3"
									v-model="etapa.leadtime"
                  :invalido="erros.includes('leadtime')"
									obrigatorio />
								<AppFormTextarea
									class="col-span-2"
									id="descricao"
                  :total-caracteres="255"
									type="text"
									label="Descrição"
									v-model="etapa.descricao"
                  :invalido="erros.includes('descricao')"
									placeholder="Ex: Analisar documentação entregue pelo candidato" />
                <AppFormRadio
                  id="mostrarKpi"
                  simNao
                  v-model="etapa.visualizar_lista_psp"
                  :invalido="erros.includes('visualizar_list_psp')"
                  titulo="Mostrar em relátorios ?"/>
								<AppFormRadio
									id="solicitanteEditar"
									simNao
                  dicaPosicao="right-0"
									v-model="etapa.editar_psp"
                  :invalido="erros.includes('editar_psp')"
                  dica="Caso o card já tenha alguma aprovação e for editado em qualquer campo que não seja a INDICAÇÃO, o mesmo irá retornar para a 1° etapa de aprovação e necessitará novamente das aprovações."
									titulo="Solicitante pode editar TODOS OS DADOS na etapa ?" />
                <AppFormRadio
                  id="solicitanteEditarIndicacao"
                  simNao
                  v-model="etapa.editar_indicacao"
                  :invalido="erros.includes('editar_indicacao')"
                  titulo="Solicitante pode editar a INDICAÇÃO na etapa ?"/>
								<AppFormRadio
									id="alterarCandidato"
									simNao
									titulo="Pode alterar o candidato ?"
									v-model="etapa.alterar_candidato"
                  dicaPosicao="right-0"
                  :invalido="erros.includes('alterar_candidato')"
									dica="Quando alterar o candidato o Card irá retornar para etapa de RETORNO." />
								<AppFormRadio
									id="podeFinalizar"
									simNao
									titulo="Pode concluir card ?"
									dica="Permiti conclusão/finalização do Card"
                  :invalido="erros.includes('concluir_card')"
									v-model="etapa.concluir_card"/>
                <AppFormRadio
                  id="podeRejeitar"
                  simNao
                  titulo="Pode rejeitar card nessa etapa ?"
                  dica="Permiti rejeitar o Card"
                  :invalido="erros.includes('rejeita_card')"
                  v-model="etapa.rejeita_card" />
                <AppFormRadio
                  id="podeStandby"
                  simNao
                  titulo="Pode mover para o Standby nessa etapa ?"
                  dica="Permiti mover para Standby o Card"
                  :invalido="erros.includes('standby_card')"
                  v-model="etapa.standby_card" />
                <AppFormRadio
                  id="aprovacao"
                  simNao
                  dicaPosicao="right-0"
                  titulo="É etapa de aprovação ?"
                  dica="Cards nas etapas de APROVAÇÃO não podem ser movidos/processados pelo RH"
                  :invalido="erros.includes('precisa_aprovacao')"
                  v-model="etapa.precisa_aprovacao"/>
                <AppFormRadio
                  id="obrigatorioIndicacao"
                  simNao
                  titulo="Obrigatório indicação ?"
                  dica="Se SIM,é obrigatório ter indicação para processar dessa etapa."
                  :invalido="erros.includes('obrigatorio_indicacao')"
                  v-model="etapa.obrigatorio_indicacao"/>
                <AppFormRadio
                  id="voltarEtapa"
                  simNao
                  titulo="Pode retornar para Etapa anterior ?"
                  :invalido="erros.includes('voltar_etapa')"
                  v-model="etapa.voltar_etapa" />
                <div class="col-span-2 grid grid-cols-2 bg-blue-100 border border-blue-200 pb-1">
                  <div class="col-span-2 flex bg-blue-200 px-2 items-center ">
                    <span class="   text-xl"><strong>Configurações únicas em todo o processo</strong></span>
                    <AppTooltip>
                      <template v-slot:corpo>
<!--                        <img src="../../../../../../assets/icons/information-circle-g.svg" alt="" class="w-6 h-6">-->
                        <img src="@/assets/icons/information-circle-g.svg" alt="" class="w-7 h-7">
                      </template>
                      <template v-slot:tooltip>
                        <div class="min-w-[300px] max-w-full">
                          Cada configurações só poderá ser aplicada em uma etapa em todo o processo de CONTRATAÇÃO
                        </div>
                      </template>
                    </AppTooltip>
                  </div>
                  <div>
                    <AppFormRadio
                      id="retorno"
                      simNao
                      :invalido="erros.includes('retorno_processo')"
                      :disabled="etapaRetorno && etapaRetorno.id !== etapa.id"
                      v-model="etapa.retorno_processo"
                      dica="Etapa responsável por retornar quando for clicado para 'ALTERAR O CANDIDATO'"
                      titulo="Etapa de retorno de mundança de candidato ?"/>
                    <span class="text-red-700 ml-2" v-if="etapaRetorno && etapaRetorno.id !== etapa.id"><strong>Selecionada na etapa - {{ etapaRetorno.nome }}</strong></span>
                  </div>
                  <div>
                    <AppFormRadio
                      id="iniciarRh"
                      simNao
                      :disabled="etapaInicioRh && etapaInicioRh.id !== etapa.id"
                      v-model="etapa.iniciar_rh"
                      :invalido="erros.includes('iniciar_rh')"
                      dica="Etapa responsável por indicar que o CARD chegou no RH irá começar a contagem da PREVISÃO DE ENTREGA"
                      titulo="Chegada no RH ?"/>
                    <span class="text-red-700 ml-2" v-if="etapaInicioRh && etapaInicioRh.id !== etapa.id"><strong>Selecionada na etapa - {{ etapaInicioRh.nome }}</strong></span>
                  </div>


                </div>
								<!--            <AppFormRadio id="funcoesEspecificas" simNao titulo="Etapa é função especifica ?" dica="Ao especificar as funções abaixo, o sistema permitirar enviar as etapas especificas para aquela etapa"/>-->
							</div>
						</div>
					</template>
					<template v-slot:[`tab.proximas_etapas`]="{ item }">
						<div class="px-2 flex flex-col">
							<span>Selecione as próximas etapas que seja diferente da próxima na ordem</span>
							<div class="flex items-end gap-2">
								<AppFormSelect
									class="grow"
									id="etapas"
									:options="etapas"
									v-model="proxima_etapa_id"
									label="Etapa" />
								<div>
									<BotaoPadrao
										cor="bg-blue-400 hover:!bg-blue-500"
										@clique="adicionarProximaEtapa()">
										<img
											src="../../../../../../assets/icons/add-b.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
								</div>
							</div>
							<div class="flex gap-y-1 flex-col mt-2 overflow-y-auto max-h-[400px]">
								<div v-for="proxima of proximasEtapas" class="">
									<div class="bg-blue-200 hover:bg-blue-300 px-1 text-xl flex justify-between items-center">
										<span>{{ proxima.ordem }} - {{ proxima.nome }}</span>
                    <div>
                        <div class="flex  items-center gap-2 !text-base" v-if="deletandoProximaEtapa && proximaEtapaId === proxima.id">
                          <BotaoPadrao texto="Sim" cor="bg-green-400 hover:!bg-green-500 !p-1" @clique="deletarProximaEtapa(proxima)" />
                          <span>Tem certeza que deseja remover ?</span>
                          <BotaoPadrao texto="Não" cor="bg-red-400 hover:!bg-red-500 !p-1" @clique="deletandoProximaEtapa = false; proximaEtapaId = null" />
                        </div>
                      <BotaoPadrao class="!p-1" icone @clique="deletandoProximaEtapa = true; proximaEtapaId = proxima.id" v-if="proximaEtapaId !== proxima.id" >
                        <img src="../../../../../../assets/icons/delete-b.svg" alt="" class="w-6 h-6">
                      </BotaoPadrao>
                    </div>
									</div>
								</div>
							</div>
						</div>
					</template>
				</AppTabs>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex gap-2 items-center">
          <div
            class="text-red-500 text-xl mr-3"
            v-if="erros.length > 0">
            <span>Campos obrigatórios necessários</span>
          </div>
					<BotaoPadrao
						texto="salvar"
						@clique="etapa_id === null ? cadastrarEtapa() : editarEtapa()">
						<img
							src="../../../../../../assets/icons/save-b.svg"
							alt="salvar"
							class="w-8 h-8" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import { buscarEtapa } from "~/mixins/buscarInformacoes"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
  import BotaoIconEditar from "~/components/Ui/Buttons/BotaoIconeEditar.vue";
  import AppAlerta from "~/components/Ui/AppAlerta.vue";
  import AppTooltip from "~/components/Ui/AppTooltip.vue";

	export default {
		mixins: [buscarEtapa],
		components: {
      AppTooltip,
      AppAlerta,
      BotaoIconEditar,
			BotaoPadrao,
			AppFormSelect,
			AppTabs,
			AppFormRadio,
			AppFormTextarea,
			AppFormInput,
			BaseDialog,
		},
		data() {
			return {
				tabs: [
					{ nome: "Informações", valor: "informacoes" },
					{ nome: "Próximas etapas", valor: "proximas_etapas" },
				],
				etapas: [],
				etapa: {
					nome: null,
					descricao: null,
					leadtime: null,
					visualizar_lista_psp: null,
					editar_psp: null,
					retorno_processo: null,
					alterar_candidato: null,
					concluir_card: null,
          iniciar_rh: null,
          editar_indicacao: null,
          precisa_aprovacao: null,
          obrigatorio_indicacao: null,
          voltar_etapa: null,
					rejeita_card: null,
					standby_card: null,
				},
				proxima_etapa_id: null,
				proximasEtapas: [],
        mostrarAlerta: false,
        textoAlerta: null,
        deletandoProximaEtapa: false,
        proximaEtapaId: null,
        etapaRetorno: null,
        etapaInicioRh: null,
        erros: []
			}
		},
		props: {
			etapa_id: {
				type: [Number, Array, Object, String],
				default: null,
			},
		},
		async created() {
			await this.buscarEtapas()

			if (this.etapa_id !== null) {
				await this.buscarEtapaPrEdicao()
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

			async buscarEtapas() {
				let etapas = await this.buscarEtapa()

				// console.log(etapas)
				// let etapasFiltradas = etapas

				let novasEtapas = etapas
					.filter((o) => o.id !== this.etapa_id)
					.map((o) => {
						return { id: o.id, nome: `${o.ordem}-${o.nome}` }
					})

				this.etapas = novasEtapas
			},

			async buscarEtapaPrEdicao() {
				let id = this.etapa_id

				let resp = await this.$axios.$get("/contratacao/etapa/buscar", { params: { id } })

				if (!resp.falha) {
					console.log(resp.dados.etapa)
          let dados = resp.dados

					this.etapa = Object.assign(this.etapa, dados.etapa)
					this.proximasEtapas = dados.etapa.ProximasEtapas
          this.etapaRetorno = dados.etapaRetorno
          this.etapaInicioRh = dados.etapaInicioRh

          if(dados.etapaRetorno){
            if(dados.etapaRetorno.id !== this.etapa.id) this.etapa.retorno_processo = false
          }else{
            this.etapa.retorno_processo = false
          }


          if(dados.etapaInicioRh){
            if(dados.etapaInicioRh.id !== this.etapa.id) this.etapa.iniciar_rh = false
          }else{
            this.etapa.iniciar_rh = false
          }
				}
			},

      validarFormulario() {
        this.erros = []

        let camposObrigatorio = [
          "nome",
          "descricao",
          "leadtime",
          "visualizar_lista_psp",
          "editar_psp",
          "editar_indicacao",
          "retorno_processo",
          "alterar_candidato",
          "concluir_card",
          "iniciar_rh",
          "precisa_aprovacao",
          "obrigatorio_indicacao",
          "voltar_etapa",
          "rejeita_card",
          "standby_card",
        ]

        for (let campo of camposObrigatorio) {
          if (this.etapa[`${campo}`] === null || this.etapa[`${campo}`] === "") this.erros.push(campo)
        }
      },

			async cadastrarEtapa() {
				console.log("Teste")
			},

			async editarEtapa() {

        this.validarFormulario()

        if (this.erros.length === 0) {
          let etapa = this.etapa

          let resp = await this.$axios.$put("/contratacao/etapa/editarNovoPadrao", {etapa})

          console.log(resp)

          if (!resp.falha) {
            console.log(resp)
            this.$emit("editado", etapa)

          }
        }
			},

			async adicionarProximaEtapa() {
				let etapa_id_destino = this.proxima_etapa_id
				let etapa_id_origem = this.etapa_id


				let resp = await this.$axios.$post("/contratacao/etapa/adicionar_proxima_etapa", {
					etapa_id_origem,
					etapa_id_destino,
				})

				if (!resp.falha) {
					console.log(resp)
          let dados = resp.dados
          if(dados.criado){
            console.log(dados.etapa)
            this.proximasEtapas.push(dados.etapa)
            this.textoAlerta = "Próxima etapa adicionada com sucesso!"
            this.mostrarAlerta = true
            this.proxima_etapa_id = null
          }
				}
			},

      async deletarProximaEtapa(etapa){
        let etapa_id_origem = this.etapa_id
        let etapa_id_destino = etapa.id

        let resp = await this.$axios.$delete("/contratacao/etapa/deletar_proxima_etapa", { params: {etapa_id_origem,
            etapa_id_destino }})

        if(!resp.falha){
          console.log(resp)
          if(resp.dados.deletado){
            let idx = this.proximasEtapas.findIndex( o => o.id === etapa_id_destino)

            console.log(idx)
            this.proximasEtapas.splice(idx, 1)
            this.textoAlerta = "Próxima etapa removida com sucesso!"
            this.mostrarAlerta = true
          }
        }
      }
		},
	}
</script>

<style scoped></style>
