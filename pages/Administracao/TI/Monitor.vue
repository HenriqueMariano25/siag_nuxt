<template>
	<div class="w-full print:!-ml-0.5">
		<CabecalhoPagina titulo="MONITOR" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<TabelaPadrao
				id="chips"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				@itensPorPagina="itensPorPagina = $event"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarMonitores"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						icone
						@clique="editarMonitor(item)">
						<img
							src="@/assets/icons/edit-b.svg"
							alt=""
							class="w-6 h-6" />
					</BotaoPadrao>
				</template>
				<template v-slot:[`body.MarcaTI.nome`]="{ item }">
					<span>{{ item.MarcaTI ? item.MarcaTI.nome : "" }}</span>
				</template>
				<template v-slot:[`body.ModeloTI.nome`]="{ item }">
					<span>{{ item.ModeloTI ? item.ModeloTI.nome : "" }}</span>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<div class="w-full flex justify-between">
				<BotaoPadrao texto="excel">
					<img
						src="@/assets/icons/excel-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
				<BotaoPadrao
					texto="cadastrar"
					@clique="mostrarDialogCadastrarMonitor = true">
					<img
						src="@/assets/icons/add-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</RodapePagina>
		<DialogCadastrarMonitor
			v-if="mostrarDialogCadastrarMonitor"
			@cancelar="
				mostrarDialogCadastrarMonitor = false
				monitor = null
			"
			@cadastrado="monitorCadastrado"
			@editado="monitorEditado"
			:monitor="monitor" />
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
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogCadastrarMonitor from "~/components/Dialogs/Administracao/Ti/Monitor/DialogCadastrarMonitor.vue"

	export default {
		components: {
			DialogCadastrarMonitor,
			AppAlerta,
			BotaoPadrao,
			RodapePagina,
			TabelaPadrao,
			CabecalhoPagina,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Patrimônio", valor: "patrimonio", filtro: true, ordenar: true },
					{ nome: "Serial", valor: "serial", filtro: true, ordenar: true },
					{ nome: "Marca", valor: "MarcaTI.nome", ordenar: true, filtro: true },
					{ nome: "Modelo", valor: "ModeloTI.nome", ordenar: true, filtro: true },
					{ nome: "", valor: "historico" },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogCadastrarMonitor: false,
				monitor: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		mounted() {
			this.buscarMonitores()
		},
		methods: {
			async buscarMonitores() {
				let filtros = this.filtros
				let ordem = this.ordem
				let page = this.pagina - 1
				let size = this.itensPorPagina

				let resp = await this.$axios.$get("/ti/monitor/buscarTodos", {
					params: { filtros, ordem, page, size },
				})

				if (!resp.falha) {
					let { monitores, total } = resp.dados
					this.dados = monitores
					this.totalItens = total
				}
			},
			async editarMonitor(item) {
				this.mostrarDialogCadastrarMonitor = true
				this.monitor = item
			},
			async monitorEditado({ monitor, sair }) {
				let idx = this.dados.findIndex((o) => o.id === monitor.id)

				if (idx >= 0) {
					this.dados[idx].patrimonio = monitor.patrimonio
					this.dados[idx].serial = monitor.serial
					this.dados[idx].MarcaTI = monitor.MarcaTI
					this.dados[idx].ModeloTI = monitor.ModeloTI
				}

				if (sair) {
					this.mostrarDialogCadastrarMonitor = false
					this.textoAlerta = "Monitor editado com sucesso!"
					this.mostrarAlerta = true
					this.monitor = null
				}
			},
			async monitorCadastrado({ monitor, sair }) {
				this.dados.push(monitor)
				if (sair) {
					this.mostrarDialogCadastrarMonitor = false
					this.textoAlerta = "Monitor cadastrado com sucesso!"
					this.mostrarAlerta = true
				}
			},
		},
	}
</script>

<style scoped></style>
