<template>
	<div class="w-full">
		<CabecalhoPagina titulo="Centro de custo" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
				:cabecalho="cabecalho"
				:dados="dados"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:temRodape="false"
				altura="calc(100vh - 117px)"
				@atualizar="buscarCentroCusto"
				:temDetalhes="false">
				<template v-slot:[`body.Setor.id`]="{ item }">
					<span
						v-if="item.Setor"
						class="whitespace-nowrap">
						{{ item.Setor.nome }}
					</span>
				</template>
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						class="!p-0.5"
						@clique="
							centroCusto = item
							mostrarDialogCriarCentroCusto = true
						"
						icone>
						<div class="w-5 h-5 flex items-center justify-center">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-5 h-5" />
						</div>
					</BotaoPadrao>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-end w-full">
					<BotaoPadrao
						texto="adicionar"
						@clique="mostrarDialogCriarCentroCusto = true">
						<img
							src="@/assets/icons/add-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarCentroCusto
			v-if="mostrarDialogCriarCentroCusto"
			@cancelar="
				mostrarDialogCriarCentroCusto = false
				centroCusto = null
			"
			:centroCusto="centroCusto"
			@cadastrado="cadastrado"
			@editado="editado"
			@deletado="deletado" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogCriarCentroCusto from "~/components/Dialogs/Administracao/Rh/Contratacao/Configuracao/DialogCriarCentroCusto.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		name: "CentroCusto",
		components: {
			BotaoPadrao,
			DialogCriarCentroCusto,
			AppAlerta,
			RodapePagina,
			CabecalhoPagina,
			TabelaPadrao,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-8" },
					{ nome: "Código", valor: "id", filtro: true, ordenar: true },
					{ nome: "Setor", valor: "Setor.id", filtro: true, ordenar: true },
					{ nome: "Centro de Custo", valor: "numero_pep", filtro: true, ordenar: true },
					{ nome: "Descrição", valor: "descricao", filtro: true, ordenar: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogCriarCentroCusto: false,
				centroCusto: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		async created() {
			await this.buscarCentroCusto()
			console.log(this.dados)
		},
		methods: {
			async buscarCentroCusto() {
				let filtros = this.filtros

				let resp = await this.$axios.$get("/contratacao/centro_custo/buscar/novo_padrao", {
					params: { filtros },
				})

				if (!resp.falha) {
					this.dados = resp.dados.centrosCusto
				}
			},

			async cadastrado(centroCusto) {
				this.dados.push(centroCusto)

				this.textoAlerta = "Centro de custo cadastrada com sucesso!"
				this.mostrarAlerta = true
				this.mostrarDialogCriarCentroCusto = false
			},
			async editado(centroCusto) {
        console.log(centroCusto)

				let idx = this.dados.findIndex((o) => o.id === centroCusto.id)

				if (idx >= 0) {
					this.dados[idx].numero_pep = centroCusto.numero_pep
					this.dados[idx].descricao = centroCusto.descricao
					this.dados[idx].Setor
						? (this.dados[idx].Setor.nome = centroCusto.Setor.nome)
						: (this.dados[idx]["Setor"] = { nome: centroCusto.Setor.nome })
				}

				this.textoAlerta = "Centro de custo editada com sucesso!"
				this.mostrarAlerta = true
				this.centroCusto = null
				this.mostrarDialogCriarCentroCusto = false
			},

			async deletado(id) {
				let idx = this.dados.findIndex((o) => parseInt(o.id) === parseInt(id))

				if (idx >= 0) {
					this.dados.splice(idx, 1)
				}

				this.textoAlerta = "Centro de custo deletada com sucesso!"
				this.mostrarAlerta = true
				this.centroCusto = null
				this.mostrarDialogCriarCentroCusto = false
			},
		},
	}
</script>

<style scoped></style>
