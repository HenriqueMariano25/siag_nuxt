<template>
	<div class="w-full">
		<CabecalhoPagina titulo="NRs" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
        id="nrs"
				:cabecalho="cabecalho"
				:dados="dados"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:temRodape="false"
				altura="calc(100vh - 117px)"
				@atualizar="buscarNRs"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						class="!p-0.5"
						@clique="
							nr = item
							mostrarDialogCriarNRs = true
						"
						icone>
						<div class="w-7 h-7 flex items-center justify-center">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-6 h-6" />
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
						@clique="mostrarDialogCriarNRs = true">
						<img
							src="@/assets/icons/add-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarNRs
			v-if="mostrarDialogCriarNRs"
			@cancelar="
				mostrarDialogCriarNRs = false
				nr = null
			"
			:nr="nr"
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
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCriarNRs from "~/components/Dialogs/Administracao/Rh/Contratacao/Configuracao/DialogCriarNRs.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"

	export default {
		name: "NRs",
		components: {
			AppAlerta,
			DialogCriarNRs,
			BotaoPadrao,
			RodapePagina,
			TabelaPadrao,
			CabecalhoPagina,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-8" },
					{ nome: "NR", valor: "nr", filtro: true, ordenar: true },
					{ nome: "Descrição", valor: "descricao", filtro: true, ordenar: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogCriarNRs: false,
				nr: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		async created() {
			await this.buscarNRs()
		},
		methods: {
			async buscarNRs() {
				let filtros = this.filtros

				let resp = await this.$axios.$get("/contratacao/nrs/buscar/novo_padrao", {
					params: { filtros },
				})

				if (!resp.falha) {
					this.dados = resp.dados.nrs
				}
			},
			async cadastrado(nr) {
				this.dados.push(nr)

				this.textoAlerta = "NR cadastrada com sucesso !"
				this.mostrarAlerta = true
				this.mostrarDialogCriarNRs = false
			},
			async editado(nr) {
				let idx = this.dados.findIndex((o) => o.id === nr.id)

				if (idx >= 0) {
					this.dados[idx].nr = nr.nr
					this.dados[idx].descricao = nr.descricao
				}

				this.textoAlerta = "NR editada com sucesso !"
				this.mostrarAlerta = true
				this.nr = null
				this.mostrarDialogCriarNRs = false
			},
			async deletado(id) {
				let idx = this.dados.findIndex((o) => o.id === id)

				if (idx >= 0) {
					this.dados.splice(idx, 1)
				}

				this.textoAlerta = "NR deletada com sucesso !"
				this.mostrarAlerta = true
				this.nr = null
				this.mostrarDialogCriarNRs = false
			},
		},
	}
</script>

<style scoped></style>
