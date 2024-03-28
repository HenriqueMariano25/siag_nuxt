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
				:temDetalhes="true">
				<template v-slot:[`detalhes`]="{ item }">
					<div class="grid grid-cols-3">
						<span v-if="item.LocalInstalacaoTI"
							>LOCAL DE INSTALAÇÃO: <strong>{{ item.LocalInstalacaoTI.nome }}</strong></span
						>
						<span
							v-if="item.observacao"
							class="col-span-3"
							>OBSERVAÇÃO: <strong>{{ item.observacao }}</strong></span
						>
					</div>
				</template>
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="w-8">
						<BotaoPadrao
							icone
							@clique="editarMonitor(item)">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-6 h-6" />
						</BotaoPadrao>
					</div>
				</template>
				<template v-slot:[`body.MarcaTI.nome`]="{ item }">
					<span>{{ item.MarcaTI ? item.MarcaTI.nome : "" }}</span>
				</template>
				<template v-slot:[`body.SituacaoTI.descricao`]="{ item }">
					<div class="flex gap-1">
						<div
							class="situacao bg-red-400"
							v-if="item.SituacaoTI && item.SituacaoTI.descricao === 'DEFEITO'">
							<span>DEFEITO</span>
						</div>
						<div
							class="situacao bg-orange-400"
							v-if="item.SituacaoTI && item.SituacaoTI.descricao === 'MANUTENÇÃO'">
							<span>MANUTENÇÃO</span>
						</div>
						<div
							class="situacao bg-green-400"
							v-if="item.funcionario_id !== null">
							<span>EM USO</span>
						</div>
						<div
							class="situacao bg-blue-400"
							v-if="item.funcionario_id === null">
							<span>ESTOQUE</span>
						</div>
					</div>
				</template>
				<template v-slot:[`body.ModeloTI.nome`]="{ item }">
					<span>{{ item.ModeloTI ? item.ModeloTI.nome : "" }}</span>
				</template>
				<template v-slot:[`body.Funcionario.nome`]="{ item }">
					<span>{{ item.Funcionario ? item.Funcionario.nome : "" }}</span>
				</template>
				<template v-slot:[`body.Funcionario.setor.nome`]="{ item }">
					<span>{{
						item.Funcionario && item.Funcionario.setor ? item.Funcionario.setor.nome : ""
					}}</span>
				</template>
				<template v-slot:[`body.historico`]="{ item }">
					<div
						class="bg-blue-200 border border-blue-300 flex gap-2 justify-center items-center py-0.5 text-black hover:bg-blue-300 rounded w-[100px]"
						@click="
							mostrarDialogHistoricoTI = true
							id = item.id
						">
						<img
							src="@/assets/icons/history-b.svg"
							alt=""
							class="w-6 h-6" />
					</div>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<div class="w-full flex justify-between">
				<BotaoPadrao
					texto="excel"
					@clique="gerarExcel()">
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
			@funcionarioTrocado="funcionarioTrocado"
			:monitor="monitor" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogHistoricoTI
			v-if="mostrarDialogHistoricoTI"
			@cancelar="
				mostrarDialogHistoricoTI = false
				id = null
			"
			:id="id"
			modulo="monitor" />
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogCadastrarMonitor from "~/components/Dialogs/Administracao/Ti/Monitor/DialogCadastrarMonitor.vue"
	import DialogHistoricoTI from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogHistoricoTI.vue"
	import gerarExcel from "~/functions/gerarExcel"

	export default {
		components: {
			DialogHistoricoTI,
			DialogCadastrarMonitor,
			AppAlerta,
			BotaoPadrao,
			RodapePagina,
			TabelaPadrao,
			CabecalhoPagina,
		},
		data() {
			return {
				opcoesSituacao: [
					{ id: "defeito", texto: "defeito" },
					{ id: "manutenção", texto: "manutenção" },
					{ id: "em uso", texto: "em uso" },
					{ id: "estoque", texto: "estoque" },
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
				mostrarDialogHistoricoTI: false,
				id: null,
				textoAlerta: null,
			}
		},
		computed: {
			cabecalho() {
				return [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{
						nome: "Situação",
						valor: "SituacaoTI.descricao",
						largura: "w-14",
						filtro: true,
						opcoes: this.opcoesSituacao,
					},
					{ nome: "Patrimônio", valor: "patrimonio", filtro: true, ordenar: true },
					{ nome: "Serial", valor: "serial", filtro: true, ordenar: true },
					{ nome: "Marca", valor: "MarcaTI.nome", ordenar: true, filtro: true },
					{ nome: "Modelo", valor: "ModeloTI.nome", ordenar: true, filtro: true },
					{ nome: "Funcionário", valor: "Funcionario.nome", ordenar: true, filtro: true },
					{ nome: "Setor", valor: "Funcionario.setor.nome", ordenar: true, filtro: true },
					{ nome: "Histórico", valor: "historico", largura: "w-14" },
				]
			},
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

				if (Object.keys(filtros).includes("$SituacaoTI.descricao$")) {
					filtros["funcionario_id"] = { ["$or"]: [] }
					let opcoes = filtros["$SituacaoTI.descricao$"]["$or"]
					console.log(opcoes)
					filtros["$SituacaoTI.descricao$"]["$or"] = []
					if (opcoes.includes("defeito")) {
						filtros["$SituacaoTI.descricao$"]["$or"].push("DEFEITO")
					}
					if (opcoes.includes("manutenção")) {
						filtros["$SituacaoTI.descricao$"]["$or"].push("MANUTENÇÃO")
					}
					console.log(filtros)
					if (opcoes.includes("estoque")) {
						filtros["funcionario_id"]["$or"].push(null)
					}
					if (opcoes.includes("em uso")) {
						filtros["funcionario_id"]["$or"].push({ $not: null })
					}
				}
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
					this.dados[idx].SituacaoTI = monitor.SituacaoTI
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
			async gerarExcel() {
				let dados = this.dados

				let cabecalho = [
					"Patrimônio",
					"Serial",
					"Marca",
					"Modelo",
					"Funcionário",
					"Matricula",
					"Cargo",
					"Setor",
					"Local de instalação",
					"Observação",
				]
				let nomeArquivo = "monitor"

				let itens = []
				for (let item of dados) {
					let temp = []
					temp.push(item.patrimonio ? item.patrimonio : "")
					temp.push(item.serial ? item.serial : "")
					temp.push(item.MarcaTI ? item.MarcaTI.nome : "")
					temp.push(item.ModeloTI ? item.ModeloTI.nome : "")
					temp.push(item.Funcionario ? item.Funcionario.nome : "")
					temp.push(item.Funcionario ? item.Funcionario.chapa : "")
					temp.push(item.Funcionario ? item.Funcionario.cargo : "")
					temp.push(item.Funcionario && item.Funcionario.setor ? item.Funcionario.setor.nome : "")
					temp.push(item.LocalInstalacaoTI ? item.LocalInstalacaoTI.nome : "")
					temp.push(item.observacao ? item.observacao : "")
					itens.push(temp)
				}

				gerarExcel(cabecalho, itens, nomeArquivo)
			},

			async funcionarioTrocado({ id, funcionario }) {
				let idx = this.dados.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.dados[idx].Funcionario = funcionario
          if(funcionario === null){
            this.dados[idx].funcionario_id = null
          }else{
            this.dados[idx].funcionario_id = funcionario.id
          }
				}
			},
		},
	}
</script>

<style scoped>
	.situacao {
		padding: 2px 5px;
		border-radius: 5px;
		color: black;
		font-weight: 500;
		white-space: nowrap;
	}
</style>
