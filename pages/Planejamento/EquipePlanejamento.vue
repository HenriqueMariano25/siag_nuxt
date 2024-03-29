<template>
	<div class="w-full">
		<CabecalhoPagina titulo="EQUIPE PLANEJAMENTO" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
        id="equipePLanejamento"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarEquipePlanejamento"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						@clique="
							equipePlanejamento = item
							mostrarDialogCriarEquipePlanejamento = true
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
				<template v-slot:[`body.disciplina.descricao`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.disciplina"
						>{{ item.disciplina.descricao }}</span
					>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-end w-full">
					<div class="flex gap-2">
						<BotaoPadrao
							v-if="$auth.user.permissoes.includes('importar_planejamento')"
							class="flex"
							@clique="mostrarDialogImportarEquipePlanejamento = true"
							texto="Importar">
							<img
								src="@/assets/icons/upload-b.svg"
								alt=""
								class="w-6 h-6" />
						</BotaoPadrao>
						<BotaoPadrao
							class="flex"
							@clique="mostrarDialogCriarEquipePlanejamento = true"
							texto="Adicionar">
							<img
								src="@/assets/icons/add-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarEquipePlanejamento
			v-if="mostrarDialogCriarEquipePlanejamento"
			@cancelar="
				mostrarDialogCriarEquipePlanejamento = false
				equipePlanejamento = null
			"
			@cadastrado="cadastrado"
			@editado="editado"
			@deletado="deletado"
			:equipePlanejamento="equipePlanejamento" />
		<DialogImportarEquipePlanejamento
			v-if="mostrarDialogImportarEquipePlanejamento"
			@cancelar="mostrarDialogImportarEquipePlanejamento = false" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import { defineComponent } from "vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import DialogCriarEquipePlanejamento from "~/components/Dialogs/Planejamento/EquipePlanejamento/DialogCriarEquipePlanejamento.vue"
	import DialogImportarEquipePlanejamento from "~/components/Dialogs/Planejamento/EquipePlanejamento/DialogImportarEquipePlanejamento.vue"

	export default defineComponent({
		name: "EquipePlanejamento",
		components: {
			DialogImportarEquipePlanejamento,
			DialogCriarEquipePlanejamento,
			TabelaPadrao,
			CabecalhoPagina,
			AppAlerta,
			BotaoPadrao,
			RodapePagina,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-8" },
					{ nome: "Descrição", valor: "descricao", filtro: true, ordenar: true },
					{ nome: "Disciplina", valor: "disciplina.descricao", filtro: true, ordenar: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 50,
				pagina: 1,
				mostrarDialogCriarEquipePlanejamento: false,
				equipePlanejamento: null,
				mostrarAlerta: false,
				textoAlerta: null,
				mostrarDialogImportarEquipePlanejamento: false,
			}
		},
		created() {
			this.buscarEquipePlanejamento()
		},
		methods: {
			async buscarEquipePlanejamento() {
				let filtros = this.filtros
				let ordem = this.ordem

				let resp = await this.$axios.$get("/planejamento/equipes_planejamento", {
					params: {
						page: this.pagina - 1,
						size: this.itensPorPagina,
						filtros,
						ordem,
					},
				})

				if (!resp.falha) {
					let equipesPlanejamento = resp.dados.equipesPlanejamento
					let total = resp.dados.total

					this.dados = equipesPlanejamento
					this.totalItens = total
				}
			},
			cadastrado(equipePlanejamento) {
				this.dados.push(equipePlanejamento)
				this.mostrarDialogCriarEquipePlanejamento = false
				this.textoAlerta = "Equipe Planejamento cadastrada com sucesso!"
				this.mostrarAlerta = true
				this.totalItens += 1
			},
			editado(equipePlanejamento) {
				let idx = this.dados.findIndex((o) => o.id === equipePlanejamento.id)
				this.dados[idx].descricao = equipePlanejamento.descricao
				this.dados[idx].disciplina_id = equipePlanejamento.disciplina_id
				this.dados[idx].disciplina.descricao = equipePlanejamento.disciplina.descricao
				this.dados[idx].disciplina.id = equipePlanejamento.disciplina.id
				this.equipePlanejamento = null

				this.mostrarDialogCriarEquipePlanejamento = false
				this.textoAlerta = "Equipe Planejamento editada com sucesso!"
				this.mostrarAlerta = true
			},
			deletado(id) {
				let idx = this.dados.findIndex((o) => o.id === id)
				this.dados.splice(idx, 1)
				this.equipePlanejamento = null

				this.mostrarDialogCriarEquipePlanejamento = false
				this.textoAlerta = "Equipe Planejamento deletada com sucesso!"
				this.mostrarAlerta = true
				this.totalItens -= 1
			},
		},
	})
</script>

<style scoped></style>
