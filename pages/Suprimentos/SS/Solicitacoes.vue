<template>
	<div class="w-full ">
		<div
			class="flex bg-primaria-500 w-[96.5vw] print:hidden"
			style="overflow-x: scroll">
			<button
				class="flex p-2 hover:bg-gray-300 box-border print:hidden"
				:class="{ 'border-t-4 border-black bg-gray-200': etapa_id === 0 }"
				@click="etapa_id = 0">
				Todos
			</button>
			<div
				v-for="etapa in etapas"
				:key="etapa.id"
				class="grid grid-flow-col auto-cols-max divide-y-2 divide-amber-50">
				<button
					class="flex py-2 px-3 hover:bg-gray-400 box-border"
					:class="{ 'border-t-4 border-black bg-gray-200': etapa_id === etapa.id }"
					@click="etapa_id = etapa.id">
					<span class="whitespace-nowrap">{{ etapa.nome }}</span>
				</button>
			</div>
		</div>
		<div class="print:hidden">
			<div class="flex">
				<AppTabela
					:cabecalho="cabecalho"
					:dados="dados"
					@filtrar="recebendoFiltro"
					:itensPorPagina="itensPorPagina"
					:pagina="pagina"
					altura="calc(100vh - 194px)"
					:totalItens="totalItens"
					@atualizar="atualizarDados"
					@dblclick="verDetalhesSS"
					:temDetalhes="false">
					<template v-slot:[`body.selecione`]="{ item }">
						<div class="flex justify-center">
							<AppFormCheckbox
								:id="parseInt(item.id)"
								:valor="item"
								v-model="selecionados" />
						</div>
					</template>
					<template v-slot:[`body.acoes`]="{ item }">
						<BotaoIconeEditar
							@click="
								mostrarDialogProcessarSS = true
								ss = item
							" />
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
					<template v-slot:[`body.EtapaSS.nome`]="{ item }">
						<span v-if="item.EtapaSS && item.EtapaSS.nome">
							<span class="whitespace-nowrap">{{ item.EtapaSS.nome }}</span>
						</span>
					</template>
					<template v-slot:[`body.solicitante`]="{ item }">
						<span
							v-if="item.Usuario"
							class="whitespace-nowrap">
							{{ item.Usuario.nome }}
						</span>
					</template>
					<template v-slot:[`body.comentarios`]="{ item }">
						<button
							class="flex hover:bg-gray-400 w-full p-1"
							v-if="item.ComentarioSSes.length > 0"
							@click="
								ss_id = item.id
								mostrarDialogComentariosSS = true
							">
							<img
								src="@/assets/icons/comentarios-b.svg"
								alt="close"
								class="w-7 h-7 mr-1" />
							<span v-if="item.ComentarioSSes.at(-1).descricao">
								{{ item.ComentarioSSes.at(-1).descricao.substr(0, 20)
								}}{{ item.ComentarioSSes.at(-1).descricao.length > 20 ? "..." : "" }}
							</span>
						</button>
					</template>
				</AppTabela>
			</div>
		</div>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex items-center w-full">
					<div class="flex w-full justify-end gap-4">
						<BotaoPadrao
							texto="Criar SS"
							@click="mostrarDialogCriarSolicitacao = true">
							<template v-slot>
								<img
									src="@/assets/icons/add-b.svg"
									alt="close"
									class="w-8 h-8" />
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
			</template>
		</RodapePagina>
		<DialogCriarSS
			v-if="mostrarDialogCriarSolicitacao"
			@cancelar="mostrarDialogCriarSolicitacao = false"
			:ss_id="ss_id"
			@adicionado="ssAdicionado" />
		<DialogComentariosSS
			:ss_id="ss_id"
			v-if="mostrarDialogComentariosSS"
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
			:solicitacoes="selecionados"
			v-if="mostrarDialogAnaliseDemanda"
			@cancelar="
				mostrarDialogAnaliseDemanda = false
				selecionados = null
			"
			@definido="definidoComprador" />

		<DialogProcessarSS
			:label="labelDialog"
			:placeholder="placeholderDialog"
			:campo="campoDialog"
			:ss="ss"
			v-if="mostrarDialogProcessarSS"
			@processado="processadoSS"
			:typeInput="typeInputDialog"
			@cancelar="
				mostrarDialogProcessarSS = false
				ss = null
			" />

		<DialogProcessarMultSS
			:solicitacoes="selecionados"
			v-if="mostrarDialogProcessarMultSS"
			@processado="processadoSS"
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
	import AppTabela from "~/components/Ui/AppTabela.vue"
	import DialogComentariosSS from "~/components/Dialogs/Suprimentos/SS/DialogComentariosSS.vue"
	import BotaoIconeEditar from "~/components/Ui/Buttons/BotaoIconeEditar.vue"
	import DialogAnaliseDemanda from "~/components/Dialogs/Suprimentos/SS/DialogAnaliseDemanda.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import DialogProcessarSS from "~/components/Dialogs/Suprimentos/SS/DialogProcessarSS.vue"
	import DialogProcessarMultSS from "~/components/Dialogs/Suprimentos/SS/DialogProcessarMultSS.vue"
	import DialogDetalhesSS from "~/components/Dialogs/Suprimentos/SS/DialogDetalhesSS.vue"

	import { buscarEtapaSS } from "@/mixins/buscarInformacoes"
	export default {
		mixins: [buscarEtapaSS],
		name: "Solicitacoes",
		components: {
			RodapePagina,
			BotaoPadrao,
			DialogCriarSS,
			AppAlerta,
			AppTabela,
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
				filtros: [],
				itensPorPagina: 50,
				pagina: 1,
				totalItens: 0,
				selecionados: [],
				etapas: [],
				etapa_id: null,
				listaAcao: [8, 10, 13, 14, 16, 18, 26, 27],
				listaSelect: [7, 9, 11, 12, 21, 22, 23, 24, 25],
				placeholderDialog: null,
				labelDialog: null,
				campoDialog: null,
				mostrarDialogProcessarSS: false,
				mostrarDialogProcessarMultSS: false,
				pularProxEtapa: false,
				typeInputDialog: "text",
				mostrarDialogDetalhesSS: false,
			}
		},
		computed: {
			cabecalho() {
				let cabecalho = [
					{
						nome: "Num.",
						valor: "numero_acompanhamento",
						filtro: true,
						ordenar: true,
						centralizar: true,
					},
					{ nome: "Situação", valor: "situacao", filtro: true, centralizar: true },
					{ nome: "Natureza Operação", valor: "natureza_operacao", filtro: true },
					{ nome: "Tipo Solicitação", valor: "tipo_solicitacao", filtro: true },
					{ nome: "Prazo de Execução", valor: "prazo_execucao", filtro: true },
					{ nome: "Necessidade", valor: "data_necessidade", filtro: true },
					{ nome: "Etapa", valor: "EtapaSS.nome", filtro: true },
					{ nome: "Solicitante", valor: "solicitante", filtro: true },
					{ nome: "Comentários", valor: "comentarios", filtro: true },
				]

				if (this.listaAcao.includes(this.etapa_id)) {
					cabecalho.unshift({ nome: "", valor: "acoes", centralizar: true })
				} else if (this.listaSelect.includes(this.etapa_id)) {
					cabecalho.unshift({ nome: "", valor: "selecione", centralizar: true })
				}
				// else {
				//   cabecalho.unshift({nome: "", valor: "selecione", centralizar: true})
				// }
				return cabecalho
			},
		},
		async mounted() {
			this.etapas = await this.buscarEtapaSS()
			this.etapa_id = 0
			this.buscarSolicitacoes()
		},
		methods: {
			async ssAdicionado() {
				this.mostrarDialogCriarSolicitacao = false
				this.mostrarAlerta = true
				this.textoAlerta = "Solicitação criada com sucesso!"
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
				if (this.listaSelect.includes(this.etapa_id)) this.mostrarDialogProcessarMultSS = true
			},
			async atualizarDados(parametros) {
				let { itensPorPagina, pagina, filtros } = parametros

				if (itensPorPagina) this.itensPorPagina = itensPorPagina

				if (pagina) this.pagina = pagina

				if (filtros) this.filtros = filtros
				await this.buscarSSs()
			},
			async buscarSolicitacoes() {
				let filtros = {}

				let etapa_id = this.etapa_id
				if (etapa_id !== 0) {
					filtros = { etapa_ss_id: etapa_id }
				} else {
					filtros = {}
				}

				let resp = await this.$axios.$get("/suprimentos/ss/buscar_todas", {
					params: {
						filtros: filtros,
						page: this.pagina - 1,
						size: this.itensPorPagina,
					},
				})

				if (!resp.falha) {
					let SSs = resp.dados.SSs.rows
					this.totalItens = resp.dados.SSs.count
					this.dados = SSs
				}
			},
			async definidoComprador(SSs) {
				for (let ss of SSs) {
					let index = this.dados.findIndex((obj) => {
						return (obj.id = ss)
					})
					this.dados.splice(index, 1)
				}

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
			verDetalhesSS(dados) {
				console.log(dados)

				this.ss_id = dados.id
				this.mostrarDialogDetalhesSS = true
			},
		},
		watch: {
			etapa_id(valor) {
				console.log(valor)
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
				} else if (valor === 16) {
					this.labelDialog = "Nº Pedido de Compra"
					this.campoDialog = "numero_pedido_compra"
				} else if (valor === 18) {
					this.labelDialog = "Handover"
					this.campoDialog = "data_envio_handover"
					this.typeInputDialog = "date"
				} else if (valor === 26) {
					this.labelDialog = "N° Contrato Juridico"
					this.campoDialog = "n_contrato_juridico"
				} else if (valor === 27) {
					this.labelDialog = "N° Contrato SAP"
					this.campoDialog = "n_contrato_sap"
				} else {
					this.labelDialog = null
					this.campoDialog = null
					this.pularProxEtapa = false
					this.typeInputDialog = "text"
				}
			},
		},
	}
</script>

<style scoped></style>
