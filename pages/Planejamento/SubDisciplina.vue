<template>
	<div class="w-full">
		<CabecalhoPagina titulo="Sub Disciplinas" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarSubDisciplina"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						@click="
							subDisciplina = item
							mostrarDialogCriarSubDisciplina = true
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
        <template v-slot:[`body.Disciplina.descricao`]="{ item }">
          <span v-if="item.Disciplina">{{ item.Disciplina.sigla }} - {{ item.Disciplina.descricao }}</span>
        </template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-end w-full">
					<!--          <div>-->
					<div class="flex">
						<BotaoPadrao
							class="flex"
							@click="mostrarDialogCriarSubDisciplina = true"
							texto="Adicionar">
							<img
								src="@/assets/icons/add-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
					<!--          </div>-->
				</div>
			</template>
		</RodapePagina>
		<DialogCriarSubDisciplina
			v-if="mostrarDialogCriarSubDisciplina"
			@cancelar="
				mostrarDialogCriarSubDisciplina = false
				subDisciplina = null
			"
			@cadastrado="cadastrado"
			@editado="editado"
			@deletado="deletado"
			:subDisciplina="subDisciplina" />
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
	import DialogCriarSubDisciplina from "~/components/Dialogs/Planejamento/Disciplina/DialogCriarSubDisciplina.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import BotaoIconEditar from "~/components/Ui/Buttons/BotaoIconeEditar.vue"

	export default defineComponent({
		name: "SubDisciplina",
		components: {
			BotaoIconEditar,
			AppAlerta,
			DialogCriarSubDisciplina,
			BotaoPadrao,
			RodapePagina,
			TabelaPadrao,
			CabecalhoPagina,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-8" },
					{ nome: "Descrição", valor: "descricao", filtro: true, ordenar: true },
					{ nome: "Disciplina", valor: "Disciplina.descricao", filtro: true, ordenar: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 10,
				dados: [],
				itensPorPagina: 50,
				pagina: 1,
				mostrarDialogCriarSubDisciplina: false,
				subDisciplina: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		created() {
			this.buscarSubDisciplina()
		},
		methods: {
			async buscarSubDisciplina() {
				let filtros = this.filtros
				let ordem = this.ordem

				let resp = await this.$axios.$get("/planejamento/sub_disciplinas", {
					params: {
						page: this.pagina - 1,
						size: this.itensPorPagina,
						filtros,
						ordem,
					},
				})
				if (!resp.falha) {
					let subDisciplinas = resp.dados.subDisciplinas
					let total = resp.dados.total

					this.dados = subDisciplinas
					this.totalItens = total
				}
			},
			cadastrado(subDisciplina) {
				this.dados.push(subDisciplina)
				this.mostrarDialogCriarSubDisciplina = false
				this.textoAlerta = "Sub Disciplina cadastrada com sucesso!"
				this.mostrarAlerta = true
				this.totalItens += 1
			},
			editado(subDisciplina) {
				let idx = this.dados.findIndex((o) => o.id === subDisciplina.id)
				this.dados[idx].descricao = subDisciplina.descricao

        this.subDisciplina = null
				this.mostrarDialogCriarSubDisciplina = false
				this.textoAlerta = "Sub Disciplina editada com sucesso!"
				this.mostrarAlerta = true
			},
			deletado(id) {
				let idx = this.dados.findIndex((o) => o.id === id)
				this.dados.splice(idx, 1)

				this.mostrarDialogCriarSubDisciplina = false
				this.textoAlerta = "Sub Disciplina deletada com sucesso!"
				this.mostrarAlerta = true
        this.subDisciplina = null
				this.totalItens -= 1
			},
		},
	})
</script>

<style scoped></style>
