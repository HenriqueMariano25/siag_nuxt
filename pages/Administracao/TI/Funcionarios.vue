<template>
	<div class="w-full print:!-ml-0.5">
		<CabecalhoPagina titulo="FUNCIONÁRIOS" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<TabelaPadrao
				id="funcionario"
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
				@atualizar="buscarFuncionarios"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						icone
						@clique="mostrarDialogEditarFuncionario = true;funcionario_id = item.id">
						<img
							src="@/assets/icons/edit-b.svg"
							alt=""
							class="w-6 h-6" />
					</BotaoPadrao>
				</template>
				<template v-slot:[`body.setor.nome`]="{ item }">
					<span>{{ item.setor ? item.setor.nome : "" }}</span>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<div class="w-full flex justify-start">
				<BotaoPadrao texto="excel">
					<img
						src="@/assets/icons/excel-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</RodapePagina>
		<DialogEditarFuncionario
			v-if="mostrarDialogEditarFuncionario"
			@cancelar="
				mostrarDialogEditarFuncionario = false
				funcionario_id = null
			"
			:funcionario_id="funcionario_id" />
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
	import DialogCadastrarEquipamento from "~/components/Dialogs/Administracao/Ti/Equipamento/DialogCadastrarEquipamento.vue"
	import DialogEditarFuncionario from "~/components/Dialogs/Administracao/Ti/Funcionarios/DialogEditarFuncionario.vue"

	export default {
		components: {
			DialogEditarFuncionario,
			DialogCadastrarEquipamento,
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
					{ nome: "Matricula", valor: "chapa", filtro: true, ordenar: true, centralizar: true },
					{ nome: "Nome", valor: "nome", filtro: true, ordenar: true },
					{ nome: "Cargo", valor: "cargo", filtro: true, ordenar: true },
					{ nome: "Setor", valor: "setor.nome", ordenar: true, filtro: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogEditarFuncionario: false,
				equipamento: null,
				mostrarAlerta: false,
				textoAlerta: null,
				funcionario_id: null,
        carregando: true
			}
		},
		mounted() {
			this.buscarFuncionarios()
		},
		methods: {
			async buscarFuncionarios() {
        this.carregando = true
				let filtros = this.filtros
				let ordem = this.ordem
				let page = this.pagina - 1
				let size = this.itensPorPagina

				let resp = await this.$axios.$get("/ti/funcionarios/buscarTodos", {
					params: { filtros, ordem, page, size },
				})

				if (!resp.falha) {
					let { funcionarios, total } = resp.dados
					this.dados = funcionarios
					this.totalItens = total
				}

        this.carregando = false
			},
			async editarEquipamento(item) {
				this.mostrarDialogCadastrarEquipamento = true
				this.equipamento = item
			},
			async equipamentoEditado({ equipamento, sair }) {
				let idx = this.dados.findIndex((o) => o.id === equipamento.id)

				if (idx >= 0) {
					this.dados[idx].nome = equipamento.nome
					this.dados[idx].marca = equipamento.marca
					this.dados[idx].modelo = equipamento.modelo
				}

				if (sair) {
					this.mostrarDialogCadastrarEquipamento = false
					this.textoAlerta = "Equipamento editado com sucesso!"
					this.mostrarAlerta = true
					this.equipamento = null
				}
			},
			async equipamentoCadastrado({ equipamento, sair }) {
				this.dados.push(equipamento)
				if (sair) {
					this.mostrarDialogCadastrarEquipamento = false
					this.textoAlerta = "Equipamento cadastrado com sucesso!"
					this.mostrarAlerta = true
				}
			},
		},
	}
</script>

<style scoped></style>
