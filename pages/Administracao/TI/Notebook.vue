<template>
	<div class="w-full print:!-ml-0.5">
		<CabecalhoPagina titulo="NOTEBOOK" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<TabelaPadrao
				id="chips"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:carregando="carregando"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarNotebook"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						icone
						@clique="editarDeskNote(item)">
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
				<template v-slot:[`body.Funcionario.nome`]="{ item }">
					<span>{{ item.Funcionario ? item.Funcionario.nome : "" }}</span>
				</template>
				<template v-slot:[`body.historico`]="{ item }">
					<div
						class="bg-blue-200 border border-blue-300 flex gap-2 justify-center items-center py-0.5 text-black hover:bg-blue-300"
						@click="
							mostrarDialogHistoricoTI = true
							id = item.id
						">
						<img
							src="@/assets/icons/history-b.svg"
							alt=""
							class="w-6 h-6" />
						<span>HISTÓRICO</span>
					</div>
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
					@clique="mostrarDialogCadastrarDesktopNotebook = true">
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
			@cadastrado="notebookCadastrado"
			@editado="notebookEditado"
			tipoCadastro="notebook"
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
			modulo="notebook" />
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

	export default {
		components: {
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
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Patrimônio", valor: "patrimonio", filtro: true, ordenar: true },
					{ nome: "Serial", valor: "serial", ordenar: true, filtro: true },
					{ nome: "Hostname", valor: "hostname", ordenar: true, filtro: true },
					{ nome: "Marca", valor: "MarcaTI.nome", ordenar: true, filtro: true },
					{ nome: "Modelo", valor: "ModeloTI.nome", ordenar: true, filtro: true },
					{ nome: "Funcionário", valor: "Funcionario.nome", ordenar: true, filtro: true },
					{ nome: "", valor: "historico" },
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
			}
		},
		mounted() {
			this.buscarNotebook()
		},
		methods: {
			async buscarNotebook() {
				this.carregando = true
				let filtros = this.filtros
				let ordem = this.ordem
				let page = this.pagina - 1
				let size = this.itensPorPagina
				let resp = await this.$axios.$get("/ti/desktopNotebook/notebooks/buscarTodos", {
					params: {
						filtros,
						ordem,
						page,
						size,
					},
				})

				if (!resp.falha) {
					this.dados = resp.dados.notebooks
				}

				this.carregando = false
			},
			async editarDeskNote(item) {
				this.mostrarDialogCadastrarDesktopNotebook = true
				this.maquina = item
			},
			async notebookEditado() {
				this.mostrarDialogCadastrarDesktopNotebook = false
				this.textoAlerta = "Notebook editado com sucesso!"
				this.mostrarAlerta = true
				this.maquina = null
			},
			async notebookCadastrado({ desknote, sair }) {
				this.dados.push(desknote)
				if (sair) {
					this.mostrarDialogCadastrarDesktopNotebook = false
					this.textoAlerta = "Notebook cadastrado com sucesso!"
					this.mostrarAlerta = true
				}
			},
		},
	}
</script>

<style scoped></style>
