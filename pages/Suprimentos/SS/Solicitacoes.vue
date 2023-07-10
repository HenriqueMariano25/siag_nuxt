<template>
	<div class="w-full">
		<div
			class="flex bg-primaria-500 w-full print:hidden menuEtapas"
			style="overflow-x: scroll">
			<button
				class="flex p-2 hover:bg-gray-300 hover:text-black box-border print:hidden text-white"
				:class="{ 'border-t-4 border-black bg-gray-200 !text-black': etapa_id === 0 }"
				@click="etapa_id = 0">
				Todos
			</button>
			<div
				v-for="etapa in etapas"
				:key="etapa.id"
				class="grid grid-flow-col auto-cols-max divide-y-2 divide-amber-50">
				<button
					class="flex py-2 px-3 hover:bg-gray-400 box-border text-white hover:text-black"
					:class="{ 'border-t-4 border-black bg-gray-200 !text-black': etapa_id === etapa.id }"
					@click="etapa_id = etapa.id">
					<span class="whitespace-nowrap">{{ etapa.nome }}</span>
				</button>
			</div>
		</div>
		<div class="print:hidden">
<!--			<div class="flex">-->
				<TabelaPadrao
					:cabecalho="cabecalho"
					:dados="dados"
					@filtros="filtros = $event"
					:itensPorPagina="itensPorPagina"
					@itensPorPagina="itensPorPagina = $event"
					:pagina="pagina"
          @pagina="pagina = $event"
					altura="calc(100vh - 194px)"
					:totalItens="totalItens"
					@atualizar="buscarSolicitacoes()"
					@dblclick="verDetalhesSS"
					:carregando="carregandoTabela"
					:temDetalhes="false">
					<template v-slot:[`body.selecione`]="{ item }">
						<div class="flex justify-center">
							<AppFormCheckbox
								:id="parseInt(item.id)"
								:valor="item"
								v-model="selecionados" />
						</div>
					</template>
					<template v-slot:[`body.situacao`]="{ item }">
						<div class="flex justify-center">
              <div v-if="item.etapa_ss_id === 6" class="bg-green-400 text-black px-2 rounded">
                Finalizado
              </div>
              <div v-else>
                <div
                  v-if="!$dayjs().isAfter(item.data_necessidade, 'day')"
                  class="bg-blue-400 text-black px-2 rounded">
                  No prazo
                </div>
                <div
                  v-if="$dayjs().isAfter(item.data_necessidade, 'day')"
                  class="bg-red-400 text-black px-2 rounded">
                  Atrasado
                </div>
              </div>
						</div>
					</template>
					<template v-slot:[`body.acoes`]="{ item }">
						<BotaoIconeEditar
							v-if="etapa_id !== 1 && etapa_id !== 7"
							@click="
								mostrarDialogProcessarSS = true
								ss = item
							" />
            <template v-if="etapa_id === 1">
              <BotaoPadrao icone v-if="item.Usuario.id === $auth.user.id" @click="
								mostrarDialogCriarSolicitacao = true
								ss_id = item.id
							">
                <img src="@/assets/icons/edit-b.svg" alt="" class="w-6 h-6">
              </BotaoPadrao>
              <div v-else-if="item.Usuario.id !== $auth.user.id" class="flex justify-center">
                <AppTooltip largura="w-[200px]" fundo>
                  <template v-slot:corpo>
                    <div class="flex justify-center">
                      <img src="@/assets/icons/information-circle-g.svg" alt="" class="w-7 h-7 flex">
                    </div>
                  </template>
                  <template v-slot:tooltip>
                    <div>
                      <span>
                        Solicitação criada por outro <strong>SOLICITANTE</strong>, somente o solicitante pode editar essa SS.
                      </span>
                    </div>
                  </template>
                </AppTooltip>
              </div>
            </template>

            <BotaoIconeEditar
              v-if="etapa_id === 7 && $auth.user.permissoes.includes('ss_gerenciamento')"
              @click="
								mostrarDialogAnaliseDemanda = true
								ss = item
							"/>
					</template>
					<template v-slot:[`body.prazo_execucao`]="{ item }">
						<span v-if="item">
							{{ $dayjs(item.data_fim).diff(item.data_inicio, "day") }} dias
						</span>
					</template>
					<template v-slot:[`body.data_necessidade`]="{ item }">
						<span v-if="item">
							{{ $dayjs(item.data_necessidade).format("DD/MM/YYYY") }}
						</span>
					</template>
          <template v-slot:[`body.data_previsao`]="{ item }">
						<span v-if="item">
							{{ calcularPrevisao(item) }}
						</span>
					</template>
					<template v-slot:[`body.EtapaSS.nome`]="{ item }">
						<span v-if="item.EtapaSS && item.EtapaSS.nome">
							<span class="whitespace-nowrap">{{ item.EtapaSS.nome }}</span>
						</span>
					</template>
					<template v-slot:[`body.Usuario.nome`]="{ item }">
						<span
							v-if="item.Usuario"
							class="whitespace-nowrap">
							{{ item.Usuario.nome }}
						</span>
					</template>
          <template v-slot:[`body.comprador.nome`]="{ item }">
						<span
              v-if="item.comprador"
              class="whitespace-nowrap">
							{{ item.comprador.nome }}
						</span>
          </template>
					<template v-slot:[`body.comentarios`]="{ item }">
						<button
							class="flex hover:bg-gray-400 min-w-[235px] p-1"
							v-if="item.ComentarioSS.length > 0"
							@click="
								ss_id = item.id
								mostrarDialogComentariosSS = true
								usuario_ss_id = item.usuario_id
							">
							<img
								src="@/assets/icons/comentarios-b.svg"
								alt="close"
								class="w-6 h-6 mr-2" />
							<span v-if="item.ComentarioSS.at(0).descricao" class="whitespace-nowrap">
								{{ item.ComentarioSS.at(0).descricao.substr(0, 25)
								}}{{ item.ComentarioSS.at(0).descricao.length > 25 ? "..." : "" }}
							</span>
						</button>
					</template>
				</TabelaPadrao>
<!--			</div>-->
		</div>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex items-center w-full">
					<div class="flex w-full justify-between ">
            <div class="flex">
              <BotaoPadrao texto="Gerar Excel" @click="gerarExcel()">
                <img src="@/assets/icons/excel-b.svg" alt="" class="w-7 h-7">
              </BotaoPadrao>
            </div>
            <div class="flex gap-3">
              <BotaoPadrao
                texto="Criar SS"
                @click="mostrarDialogCriarSolicitacao = true">
                <template v-slot>
                  <img
                    src="@/assets/icons/add-b.svg"
                    alt="close"
                    class="w-7 h-7" />
                </template>
              </BotaoPadrao>
              <BotaoPadrao
                v-if="listaSelect.includes(etapa_id)"
                texto="Processar SS"
                :disabled="selecionados.length === 0"
                @click="escolherProcessar()">
                <template v-slot>
                  <img
                    src="@/assets/icons/check-circle-b.svg"
                    alt="close"
                    class="w-6 h-6" />
                </template>
              </BotaoPadrao>
            </div>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarSS
			v-if="mostrarDialogCriarSolicitacao"
			@cancelar="
				mostrarDialogCriarSolicitacao = false
				ss_id = null
			"
			:ss_id="ss_id"
      @cancelado="canceladoSS"
			@adicionado="ssAdicionado"
			@editado="ssEditado" />
		<DialogComentariosSS
			:ss_id="ss_id"
			v-if="mostrarDialogComentariosSS"
      :podeComentar="podeComentar"
			@cancelar="
				mostrarDialogComentariosSS = false
				ss_id = null
			" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogAnaliseDemanda
			:solicitacao="ss"
			v-if="mostrarDialogAnaliseDemanda"
      @negado="negadoSS"
			@cancelar="
				mostrarDialogAnaliseDemanda = false;
			"
			@definido="definidoComprador" />

		<DialogProcessarSS
			:label="labelDialog"
			:placeholder="placeholderDialog"
			:campo="campoDialog"
			:ss="ss"
			v-if="mostrarDialogProcessarSS"
			@processado="processadoSS"
			@negado="negadoSS"
			:typeInput="typeInputDialog"
			:etapa_id="etapa_id"
			@cancelar="
				mostrarDialogProcessarSS = false
				ss = null
			" />

		<DialogProcessarMultSS
			:solicitacoes="selecionados"
			v-if="mostrarDialogProcessarMultSS"
      :etapa_id="etapa_id"
			@processado="processadoSS"
      @negado="negadoSS"
			@cancelar="mostrarDialogProcessarMultSS = false"
			:pularProxEtapa="pularProxEtapa" />

		<DialogDetalhesSS
			v-if="mostrarDialogDetalhesSS"
			@cancelar="
				mostrarDialogDetalhesSS = false
				ss_id = null
			"
			:ss_id="ss_id" />
	</div>
</template>

<script>
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCriarSS from "~/components/Dialogs/Suprimentos/SS/DialogCriarSS.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	// import AppTabela from "~/components/Ui/AppTabela.vue"
  import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
	import DialogComentariosSS from "~/components/Dialogs/Suprimentos/SS/DialogComentariosSS.vue"
	import BotaoIconeEditar from "~/components/Ui/Buttons/BotaoIconeEditar.vue"
	import DialogAnaliseDemanda from "~/components/Dialogs/Suprimentos/SS/DialogAnaliseDemanda.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import DialogProcessarSS from "~/components/Dialogs/Suprimentos/SS/DialogProcessarSS.vue"
	import DialogProcessarMultSS from "~/components/Dialogs/Suprimentos/SS/DialogProcessarMultSS.vue"
	import DialogDetalhesSS from "~/components/Dialogs/Suprimentos/SS/DialogDetalhesSS.vue"

	import { buscarEtapaSS } from "@/mixins/buscarInformacoes"
  import gerarExcel from "~/functions/gerarExcel";
  import AppTooltip from "~/components/Ui/AppTooltip.vue";
	export default {
		mixins: [buscarEtapaSS],
		name: "Solicitacoes",
		components: {
      AppTooltip,
			RodapePagina,
			BotaoPadrao,
			DialogCriarSS,
			AppAlerta,
      TabelaPadrao,
			DialogComentariosSS,
			BotaoIconeEditar,
			DialogAnaliseDemanda,
			AppFormCheckbox,
			DialogProcessarSS,
			DialogProcessarMultSS,
			DialogDetalhesSS,
		},
		data() {
			return {
				mostrarDialogCriarSolicitacao: false,
				mostrarDialogComentariosSS: false,
				mostrarDialogAnaliseDemanda: false,
				ss_id: null,
				ss: null,
				mostrarAlerta: false,
				textoAlerta: "",
				dados: [],
				filtros: {},
				itensPorPagina: 50,
				pagina: 1,
				totalItens: 0,
				selecionados: [],
				etapas: [],
				etapa_id: null,
				placeholderDialog: null,
				labelDialog: null,
				campoDialog: null,
				mostrarDialogProcessarSS: false,
				mostrarDialogProcessarMultSS: false,
				pularProxEtapa: false,
				typeInputDialog: "text",
				mostrarDialogDetalhesSS: false,
				carregandoTabela: false,
        usuario_ss_id: false,
			}
		},
		computed: {
			listaAcao() {
				let permissoes = this.$auth.user ? this.$auth.user.permissoes : []

				if (permissoes.includes("ss_gerenciamento")) {
					return [7, 8, 10, 13, 14, 15, 16, 17, 23, 24]
				}

				if (permissoes.includes("ss_sap")) {
					return [8]
				}

				if (permissoes.includes("ss_comprador")) {
					return [10, 13, 14, 15, 16]
				}

				if (permissoes.includes("ss_juridico")) {
					return [10, 13, 14, 15, 16, 23, 24]
				}

				return []
			},
			listaSelect() {
        let permissoes = this.$auth.user ? this.$auth.user.permissoes : []

				if (permissoes.includes("ss_gerenciamento")) {
					return [9, 11, 12, 18, 19, 20, 21, 22]
				}

				if (permissoes.includes("ss_comprador")) {
					return [9, 11, 12]
				}

				if (permissoes.includes("ss_juridico")) {
					return [18, 19, 20, 21, 22]
				}

				return []
			},
			cabecalho() {
				let cabecalho = [
					{
						nome: "Num.",
						valor: "numero_acompanhamento",
						filtro: true,
						centralizar: true,
					},
					{ nome: "Situação", valor: "situacao", centralizar: true },
					{ nome: "Natureza Operação", valor: "natureza_operacao", filtro: true },
					{ nome: "Tipo Solicitação", valor: "tipo_solicitacao", filtro: true },
					{ nome: "Prazo de Execução", valor: "prazo_execucao" },
					{ nome: "Necessidade", valor: "data_necessidade", filtro: true },
					{ nome: "Previsão", valor: "data_previsao", filtro: true },
					{ nome: "Etapa", valor: "EtapaSS.nome", filtro: true },
					{ nome: "Comprador", valor: "comprador.nome", filtro: true },
					{ nome: "Solicitante", valor: "Usuario.nome", filtro: true },
					{ nome: "Comentários", valor: "comentarios", filtro: false },
				]

				if (this.listaAcao.includes(this.etapa_id)) {
					cabecalho.unshift({ nome: "", valor: "acoes", centralizar: true, largura: "w-8" })
				}

        if (this.listaSelect.includes(this.etapa_id)) {
					cabecalho.unshift({ nome: "", valor: "selecione", centralizar: true, largura: "w-10" })
				}

				if (this.etapa_id === 1) {
					cabecalho.unshift({ nome: "", valor: "acoes", centralizar: true, largura: "w-8" })
				}
				return cabecalho
			},
      podeComentar(){
        let permissoes = this.$auth.user ? this.$auth.user.permissoes : []

        let permEspeciais = [
          "ss_comprador",
          "ss_gerenciamento",
          "ss_sap",
          "ss_juridico",
        ]

        return permEspeciais.some(i => permissoes.includes(i)) || this.usuario_ss_id == this.$auth.user.id
      }
		},
		async mounted() {
			this.etapas = await this.buscarEtapaSS()
			this.etapa_id = 0

			await this.buscarSolicitacoes()
		},
		methods: {
			async ssAdicionado() {
				this.mostrarDialogCriarSolicitacao = false
				this.mostrarAlerta = true
				this.textoAlerta = "Solicitação criada com sucesso!"
			},
			async ssEditado(id) {
				this.mostrarDialogCriarSolicitacao = false
				this.mostrarAlerta = true
				this.textoAlerta = "Solicitação editada com sucesso!"

				let index = this.dados.findIndex((o) => (o.id = id))

				this.dados.splice(index, 1)
			},
			cancelar() {
				this.card_id = null
				this.mostrarDialogCriarCard = false
			},
			recebendoFiltro(filtros) {
				this.filtros = filtros
			},
			escolherProcessar() {
				if (this.etapa_id === 7) this.mostrarDialogAnaliseDemanda = true
				if (this.listaSelect.includes(this.etapa_id) && this.etapa_id !== 7 ) this.mostrarDialogProcessarMultSS = true
			},
			async buscarSolicitacoes() {
				this.carregandoTabela = true
				let filtros = Object.assign({}, this.filtros)

				let etapa_id = this.etapa_id
				if (etapa_id !== 0) {
					filtros["etapa_ss_id"] = etapa_id
				}

				if (etapa_id === 0) {
					delete filtros["etapa_ss_id"]
				}

				let permissoes = this.$auth.user ? this.$auth.user.permissoes : []

        let permEspeciais = [
          "ss_comprador",
          "ss_gerenciamento",
          "ss_sap",
          "ss_juridico",
          "aprovar_ss_site_manager",
          "aprovar_ss_controle"
        ]

        let temPermissao = permEspeciais.some(i => permissoes.includes(i))

        if(!temPermissao)
          filtros['setor_id'] = this.$auth.user.setor_id

				let resp = await this.$axios.$get("/suprimentos/ss/buscar_todas", {
					params: {
						filtros: filtros,
						page: this.pagina - 1,
						size: this.itensPorPagina,
					},
				})

				if (!resp.falha) {
					let SSs = resp.dados.SSs
          let total = resp.dados.total

					this.dados = SSs
					this.totalItens = total
					this.carregandoTabela = false
				}
			},
			async definidoComprador(ss) {
				// for (let ss of SSs) {
					let index = this.dados.findIndex((obj) => {
						return (obj.id = ss)
					})
					this.dados.splice(index, 1)
				// }

				this.mostrarDialogAnaliseDemanda = false
				this.mostrarAlerta = true
				this.textoAlerta = "Comprador definido com sucesso!"
				this.selecionados = []
			},
			async processadoSS(solicitacoes) {
				for (let ss of solicitacoes) {
					let index = this.dados.findIndex((obj) => {
						return (obj.id = ss)
					})
					this.dados.splice(index, 1)
				}

				this.mostrarDialogProcessarSS = false
				this.mostrarDialogProcessarMultSS = false
				this.mostrarAlerta = true
				this.textoAlerta = "Solicitação processada com sucesso!"
				this.ss = null
				this.selecionados = []
			},

      async negadoSS(solicitacoes){
        for (let ss of solicitacoes) {
          let index = this.dados.findIndex((obj) => (obj.id = ss))
          this.dados.splice(index, 1)

          this.mostrarDialogProcessarSS = false
          this.mostrarDialogAnaliseDemanda = false
          this.mostrarDialogProcessarMultSS = false
          this.mostrarAlerta = true
          this.textoAlerta = "Solicitação negada com sucesso!"
          this.ss = null
          this.selecionados = []
        }
      },
      async canceladoSS(id){
        this.mostrarDialogCriarSolicitacao = false
        this.mostrarAlerta = true
        this.textoAlerta = "Solicitação cancelada com sucesso!"

        let index = this.dados.findIndex((o) => (o.id = id))

        this.dados.splice(index, 1)
      },

			verDetalhesSS(dados) {
				this.ss_id = dados.id
				this.mostrarDialogDetalhesSS = true
			},

      async gerarExcel(){
        let dados = this.dados

        let cabecalho = [
          "Acompanhamento",
          "Situação",
          "Nat. Operação",
          "Tipo Solicitação",
          "Prazo de Execução",
          "Necessidade",
          "Etapa",
          "Comprador",
          "Solicitante",
          "Aprov. Controle",
          "Aprov. Gestor",
          "Aprov. Site Manager",
          "Fornecedores",
          "Abrangência Escopo"
        ]
        let nomeArquivo

        nomeArquivo = "solicitacoes_servico"

        let itens = []
        for (let item of dados) {
          let temp = []
          temp.push(item.numero_acompanhamento ? item.numero_acompanhamento : "")
          temp.push(item.etapa_ss_id === 6 ? 'Finalizado' : !this.$dayjs().isAfter(item.data_necessidade, 'day') ? 'No prazo' : 'Atrasado')
          temp.push(item.natureza_operacao ? item.natureza_operacao : "")
          temp.push(item.tipo_solicitacao ? item.tipo_solicitacao : "")
          temp.push(item.data_fim ? `${this.$dayjs(item.data_fim).diff(item.data_inicio, "day")} dias` : "")
          temp.push(item.data_necessidade ? this.$dayjs(item.data_necessidade).format("DD/MM/YYYY") : "")
          temp.push(item.EtapaSS ? item.EtapaSS.nome : "")
          temp.push(item.comprador ? item.comprador.nome : "")
          temp.push(item.Usuario ? item.Usuario.nome : "")
          temp.push(item.data_aprov_controle ? this.$dayjs(item.data_aprov_controle).format("DD/MM/YYYY") : "")
          temp.push(item.data_aprov_setor ? this.$dayjs(item.data_aprov_setor).format("DD/MM/YYYY") : "")
          temp.push(item.data_aprov_site_manager ? this.$dayjs(item.data_aprov_site_manager).format("DD/MM/YYYY") : "")
          temp.push(item.FornecedorSS.length > 0 ? item.FornecedorSS.map(o => o.nome).join("; ") : "")
          temp.push(item.abrangencia_escopo ? item.abrangencia_escopo : "")
          itens.push(temp)
        }

        gerarExcel(cabecalho, itens, nomeArquivo)
        this.gerandoExcelMeusAgendamentos = false
      },


      calcularPrevisao(item) {
        if(item.natureza_operacao === 'urgente' && item.data_aprov_site_manager)
          return `${this.$dayjs(item.data_aprov_site_manager).add(28, 'day').format("DD/MM/YYYY")}`
        else if(item.natureza_operacao === 'maquina parada' && item.data_aprov_setor)
          return `${this.$dayjs(item.data_aprov_setor).add(14, 'day').format("DD/MM/YYYY")}`
        else if (item.natureza_operacao === 'normal' && item.data_aprov_setor)
          return `${this.$dayjs(item.data_aprov_setor).add(45, 'day').format("DD/MM/YYYY")}`

        return ""
      },
		},
		watch: {
			etapa_id(valor) {
				this.buscarSolicitacoes()
				this.typeInputDialog = "text"

				if (valor === 8) {
					this.labelDialog = "N° da requisição SAP"
					this.campoDialog = "n_contrato_sap"
				} else if (valor === 9) {
					this.pularProxEtapa = true
				} else if (valor === 10) {
					this.labelDialog = "N° da Carta Convite"
					this.campoDialog = "n_carta_convite"
				} else if (valor === 13) {
					this.labelDialog = "Data de Recebimento PATEC"
					this.campoDialog = "data_patec"
					this.typeInputDialog = "date"
				} else if (valor === 14) {
					this.labelDialog = "Data de Negociação"
					this.campoDialog = "data_negociacao"
					this.typeInputDialog = "date"
				} else if (valor === 15) {
					this.labelDialog = "Data de MCO"
					this.campoDialog = "data_mco"
					this.typeInputDialog = "date"
				} else if (valor === 16) {
					this.labelDialog = "Nº Pedido de Compra"
					this.campoDialog = "numero_pedido_compra"
				} else if (valor === 17) {
					this.labelDialog = "Handover"
					this.campoDialog = "data_envio_handover"
					this.typeInputDialog = "date"
				} else if (valor === 24) {
					this.labelDialog = "N° Contrato Juridico"
					this.campoDialog = "n_contrato_juridico"
				} else if (valor === 25) {
					this.labelDialog = "N° Contrato SAP - Data da Aprovação"
					this.campoDialog = "n_contrato_sap"
				} else {
					this.labelDialog = null
					this.campoDialog = null
					this.pularProxEtapa = false
					this.typeInputDialog = "text"
				}

        this.selecionados = []
			},
		},
	}
</script>

<style>
	.menuEtapas::-webkit-scrollbar {
		width: 12px;
	}
	.menuEtapas::-webkit-scrollbar-track {
		background-color: #898989;
	}

	.menuEtapas::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background-color: #0b1b36;
		border: 1px solid white;
	}
</style>
