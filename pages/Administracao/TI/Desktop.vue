<template>
	<div class="w-full print:!-ml-0.5">
		<CabecalhoPagina titulo="DESKTOP" />
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
				:carregando="carregando"
				altura="calc(100vh - 179px)"
				@atualizar="buscarDesktop"
				:temDetalhes="true">
				<template v-slot:[`detalhes`]="{ item }">
					<div class="grid grid-cols-3">
						<span v-if="item.ProcessadorDeskNoteTI"
							>PROCESSADOR: <strong>{{ item.ProcessadorDeskNoteTI.nome }}</strong></span
						>
						<span v-if="item.RamDeskNoteTI"
							>MEMÓRIA RAM: <strong>{{ item.RamDeskNoteTI.nome }}</strong></span
						>
						<span v-if="item.HDDeskNoteTI"
							>DISCO: <strong>{{ item.HDDeskNoteTI.nome }}</strong></span
						>
						<span v-if="item.SistemaOpeDeskNoteTI"
							>SISTEMA OPERACIONAL: <strong>{{ item.SistemaOpeDeskNoteTI.nome }}</strong></span
						>
						<span v-if="item.LocalInstalacaoTI"
							>LOCAL DE INSTALAÇÃO: <strong>{{ item.LocalInstalacaoTI.nome }}</strong></span
						>
						<span v-if="item.lote"
							>LOTE: <strong>{{ item.lote }}</strong></span
						>
						<span v-if="item.data_compra"
							>DATA DE COMPRA:
							<strong>{{ $dayjs(item.data_compra).format("DD/MM/YYYY") }}</strong></span
						>
						<span v-if="item.ultima_verificacao"
							>ÚLTIMA VERIFICAÇÃO T.I:
							<strong>{{ $dayjs(item.ultima_verificacao).format("DD/MM/YYYY") }}</strong></span
						>
						<span v-if="item.data_formatacao"
							>FORMATAÇÃO:
							<strong>{{ $dayjs(item.data_formatacao).format("DD/MM/YYYY") }}</strong></span
						>
						<span
							v-if="item.observacao"
							class="col-span-3"
							>OBSERVAÇÃO: <strong>{{ item.observacao }}</strong></span
						>
						<template v-if="item.MonitorTI.length > 0">
							<div class="col-span-3 border-b border-slate-700"></div>
							<span class="col-span-3 font-xl mt-1"><strong>MONITORES</strong></span>
							<template v-for="monitor of item.MonitorTI">
								<span class="uppercase">
									PATRIMONIO: {{ monitor.patrimonio ? monitor.patrimonio : "" }}
								</span>
								<span class="uppercase">
									MARCA: {{ monitor.MarcaTI ? monitor.MarcaTI.nome : "" }}
								</span>
								<span class="uppercase">SERIAL: {{ monitor.serial ? monitor.serial : "" }} </span>
							</template>
						</template>
					</div>
				</template>
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="w-8">
						<BotaoPadrao
							icone
							@clique="editarDeskNote(item)">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-6 h-6" />
						</BotaoPadrao>
					</div>
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
							class="situacao bg-gray-400"
							v-if="
								item.SituacaoTI &&
								(item.SituacaoTI.descricao === 'PREPARANDO P/ VENDA' ||
									item.SituacaoTI.descricao === 'VENDIDO')
							">
							<span>{{ item.SituacaoTI.descricao }}</span>
						</div>
						<div
							class="situacao bg-blue-400"
							v-if="
								item.funcionario_id === null &&
								item.SituacaoTI.descricao !== 'PREPARANDO P/ VENDA' &&
								item.SituacaoTI.descricao !== 'VENDIDO'
							">
							<span>ESTOQUE</span>
						</div>
					</div>
				</template>
				<template v-slot:[`body.MarcaTI.nome`]="{ item }">
					<span>{{ item.MarcaTI ? item.MarcaTI.nome : "" }}</span>
				</template>
				<template v-slot:[`body.ModeloTI.nome`]="{ item }">
					<span>{{ item.ModeloTI ? item.ModeloTI.nome : "" }}</span>
				</template>
				<template v-slot:[`body.Funcionario.nome`]="{ item }">
					<span
						v-if="item.Funcionario && item.Funcionario.data_demissao"
						class="text-red-700 font-bold hover:!text-red-700 bg-red-100 px-0.5 rounded"
						style="font-size: 16px"
						>{{ item.Funcionario.nome }}</span
					>
					<span v-else>{{ item.Funcionario ? item.Funcionario.nome : "" }}</span>
				</template>
				<template v-slot:[`body.Funcionario.setor.nome`]="{ item }">
					<span>{{
						item.Funcionario && item.Funcionario.setor ? item.Funcionario.setor.nome : ""
					}}</span>
				</template>
				<template v-slot:[`body.ProcedenciaTI.nome`]="{ item }">
					<span>{{ item.ProcedenciaTI ? item.ProcedenciaTI.nome : "" }}</span>
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
				<div class="flex gap-2">
					<BotaoPadrao
						texto="excel"
						@clique="gerarExcel()">
						<img
							src="@/assets/icons/excel-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="Filtro avançado"
						@clique="mostrarFiltroAvancado = true">
						<img
							src="@/assets/icons/filter-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
				<BotaoPadrao
					texto="cadastrar"
					@clique="mostrarFiltroAvancado = true">
					<img
						src="@/assets/icons/add-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</RodapePagina>
		<DialogCadastrarDesktopNotebook
			v-if="mostrarDialogCadastrarDesktopNotebook"
			@cancelar="
				mostrarDialogCadastrarDesktopNotebook = false
				maquina = null
			"
			@cadastrado="desktopCadastrado"
			@editado="desktopEditado"
			@funcionarioTrocado="funcionarioTrocado"
			tipoCadastro="desktop"
			:maquina="maquina" />
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
			modulo="desktop" />
		<FiltroAvancado
			v-if="mostrarFiltroAvancado"
			@cancelar="mostrarFiltroAvancado = false"
			:filtros="filtrosAvancados"
      :jaFiltrado="jaFiltrado"
			@filtrar="filtradoAvancado" />
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCadastrarDesktopNotebook from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarDesktopNotebook.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogHistoricoTI from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogHistoricoTI.vue"
	import gerarExcel from "~/functions/gerarExcel"
	import AppTooltip from "~/components/Ui/AppTooltip.vue"
	import DialogFiltroAvancadoDesktopNotebook from "~/components/Ui/FiltroAvancado.vue"
	import FiltroAvancado from "~/components/Ui/FiltroAvancado.vue"

	export default {
		components: {
			FiltroAvancado,
			DialogFiltroAvancadoDesktopNotebook,
			AppTooltip,
			DialogHistoricoTI,
			AppAlerta,
			DialogCadastrarDesktopNotebook,
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
				mostrarDialogCadastrarDesktopNotebook: false,
				maquina: null,
				mostrarAlerta: false,
				textoAlerta: null,
				mostrarDialogHistoricoTI: false,
				id: null,
				carregando: false,
				mostrarFiltroAvancado: false,
				filtrosAvancados: [
					{ nome: "OBSERVAÇÃO", id: "observacao" },
					{ nome: "SISTEMA OPERACIONAL", id: "$SistemaOpeDeskNoteTI.nome$" },
					{ nome: "PROCESSADOR", id: "$ProcessadorDeskNoteTI.nome$" },
					{ nome: "MEMÓRIA RAM", id: "$RamDeskNoteTI.nome$" },
					{ nome: "DISCO", id: "$HDDeskNoteTI.nome$" },
					{ nome: "LOCAL DE INSTALAÇÃO", id: "$LocalInstalacaoTI.nome$" },
					{ nome: "LOTE", id: "lote" },
					{ nome: "DATA DA COMPRA", id: "data_compra", tipo: "date" },
					{ nome: "ÚLTIMA VERIFICAÇÃO T.I", id: "ultima_verificacao", tipo: "date" },
					{ nome: "DATA DA FORMATAÇÃO", id: "data_formatacao", tipo: "date" },
				],
        jaFiltrado: []
			}
		},
		mounted() {
			this.buscarDesktop()
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
					{ nome: "Hostname", valor: "hostname", filtro: true, ordenar: true },
					{ nome: "Marca", valor: "MarcaTI.nome", ordenar: true, filtro: true },
					{ nome: "Modelo", valor: "ModeloTI.nome", ordenar: true, filtro: true },
					{ nome: "Funcionário", valor: "Funcionario.nome", ordenar: true, filtro: true },
					{ nome: "Setor", valor: "Funcionario.setor.nome", ordenar: true, filtro: true },
					{ nome: "Procedência", valor: "ProcedenciaTI.nome", ordenar: true, filtro: true },
					{ nome: "Histórico", valor: "historico", largura: "w-14" },
				]
			},
		},
		methods: {
			async buscarDesktop() {
				this.carregando = true
				let filtros = this.filtros
				let ordem = this.ordem
				let page = this.pagina - 1
				let size = this.itensPorPagina
				if (Object.keys(filtros).includes("$SituacaoTI.descricao$")) {
					filtros["funcionario_id"] = { ["$or"]: [] }
					let opcoes = filtros["$SituacaoTI.descricao$"]["$or"]
					filtros["$SituacaoTI.descricao$"]["$or"] = []
					if (opcoes.includes("defeito")) {
						filtros["$SituacaoTI.descricao$"]["$or"].push("DEFEITO")
					}
					if (opcoes.includes("manutenção")) {
						filtros["$SituacaoTI.descricao$"]["$or"].push("MANUTENÇÃO")
					}
					if (opcoes.includes("estoque")) {
						filtros["funcionario_id"]["$or"].push(null)
					}
					if (opcoes.includes("em uso")) {
						filtros["funcionario_id"]["$or"].push({ $not: null })
					}
				}

				let resp = await this.$axios.$get("/ti/desktopNotebook/desktops/buscarTodos", {
					params: {
						filtros,
						ordem,
						page,
						size,
					},
				})

				if (!resp.falha) {
					this.dados = resp.dados.desktops
					this.totalItens = resp.dados.total
				}
				this.carregando = false
			},
			async editarDeskNote(item) {
				this.mostrarDialogCadastrarDesktopNotebook = true
				this.maquina = item
			},
			async desktopEditado({ desknote, sair }) {
				let idx = this.dados.findIndex((o) => o.id === desknote.id)
				if (idx >= 0) {
					this.dados[idx].patrimonio = desknote.patrimonio
					this.dados[idx].serial = desknote.serial
					this.dados[idx].hostname = desknote.hostname
					this.dados[idx].MarcaTI = desknote.MarcaTI
					this.dados[idx].ModeloTI = desknote.ModeloTI
					this.dados[idx].ProcedenciaTI = desknote.ProcedenciaTI
					this.dados[idx].SituacaoTI = desknote.SituacaoTI
				}

				if (sair) {
					this.mostrarDialogCadastrarDesktopNotebook = false
					this.textoAlerta = "Desktop editado com sucesso!"
					this.mostrarAlerta = true
					this.maquina = null
				}
			},
			async desktopCadastrado({ desknote, sair }) {
				this.dados.push(desknote)
				if (sair) {
					this.mostrarDialogCadastrarDesktopNotebook = false
					this.textoAlerta = "Desktop cadastrado com sucesso!"
					this.mostrarAlerta = true
				}
			},
			async gerarExcel() {
				let dados = this.dados

				let cabecalho = [
					"Patrimônio",
					"Serial",
					"Hostname",
					"Marca",
					"Modelo",
					"Funcionário",
					"Matricula",
					"Cargo",
					"Setor",
					"Procedência",
					"Processador",
					"Memória RAM",
					"Disco",
					"Sistema Operacional",
					"Local de instalação",
					"Lote",
					"Data de compra",
					"Última verificacao",
					"Formatação",
					"Observação",
				]
				let nomeArquivo = "desktop"

				let itens = []
				for (let item of dados) {
					let temp = []
					temp.push(item.patrimonio ? item.patrimonio : "")
					temp.push(item.serial ? item.serial : "")
					temp.push(item.hostname ? item.hostname : "")
					temp.push(item.MarcaTI ? item.MarcaTI.nome : "")
					temp.push(item.ModeloTI ? item.ModeloTI.nome : "")
					temp.push(item.Funcionario ? item.Funcionario.nome : "")
					temp.push(item.Funcionario ? item.Funcionario.chapa : "")
					temp.push(item.Funcionario ? item.Funcionario.cargo : "")
					temp.push(item.Funcionario && item.Funcionario.setor ? item.Funcionario.setor.nome : "")
					temp.push(item.ProcedenciaTI ? item.ProcedenciaTI.nome : "")
					temp.push(item.ProcessadorDeskNoteTI ? item.ProcessadorDeskNoteTI.nome : "")
					temp.push(item.RamDeskNoteTI ? item.RamDeskNoteTI.nome : "")
					temp.push(item.HDDeskNoteTI ? item.HDDeskNoteTI.nome : "")
					temp.push(item.SistemaOpeDeskNoteTI ? item.SistemaOpeDeskNoteTI.nome : "")
					temp.push(item.LocalInstalacaoTI ? item.LocalInstalacaoTI.nome : "")
					temp.push(item.lote ? item.lote : "")
					temp.push(item.data_compra ? this.$dayjs(item.data_compra).format("DD/MM/YYYY") : "")
					temp.push(
						item.ultima_verificacao
							? this.$dayjs(item.ultima_verificacao).format("DD/MM/YYYY")
							: "",
					)
					temp.push(
						item.data_formatacao ? this.$dayjs(item.data_formatacao).format("DD/MM/YYYY") : "",
					)
					temp.push(item.observacao ? item.observacao : "")
					itens.push(temp)
				}

				gerarExcel(cabecalho, itens, nomeArquivo)
			},

			async funcionarioTrocado({ id, funcionario }) {
				let idx = this.dados.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.dados[idx].Funcionario = funcionario
					if (funcionario === null) {
						this.dados[idx].funcionario_id = null
					} else {
						this.dados[idx].funcionario_id = funcionario.id
					}
				}
			},

			filtradoAvancado({ filtro, filtrosSelecionados }) {
        for(let filtro of this.jaFiltrado){
          if(!filtrosSelecionados.find(o => o.campo ===filtro.campo)){
            delete this.filtros[filtro.campo]
          }
        }

				this.mostrarFiltroAvancado = false
				this.filtros = Object.assign(this.filtros, filtro)
				this.buscarDesktop()
        this.jaFiltrado = new Array(...filtrosSelecionados)
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
