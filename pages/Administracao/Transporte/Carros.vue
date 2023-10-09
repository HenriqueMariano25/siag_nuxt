<template>
	<div class="w-full">
		<CabecalhoPagina titulo="CARROS" />
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
				@atualizar="buscarCarros"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="flex gap-2">
						<BotaoPadrao
							icone
							@clique="
								carro = item
								mostrarDialogCriarCarro = true
							">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
						<BotaoPadrao
							icone
							@clique="
								carro = item
								mostrarDialogChecklist = true
							">
							<img
								src="@/assets/icons/checklist-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</template>
				<template v-slot:[`body.checklist`]="{ item }">
					<div v-if="item.ChecklistCarro.length > 0">
						<div v-if="item.ChecklistCarro[0].data_fechamento === null">
							<div
								class="bg-orange-400 tag-checklist"
								v-if="item.ChecklistCarro[0].data_abertura.includes($dayjs().format('YYYY-MM-DD'))">
								<span>Em aberto</span>
							</div>
							<div
								v-else
								class="bg-red-500 tag-checklist">
								<span>Atrasado</span>
							</div>
						</div>
						<div
							class="bg-green-400 tag-checklist"
							v-if="item.ChecklistCarro[0].data_fechamento !== null">
							Concluido
						</div>
					</div>
					<div v-else>
						<div class="bg-blue-300 tag-checklist">Não aberto</div>
					</div>
				</template>
				<template v-slot:[`body.Setor.nome`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.Setor">
						{{ item.Setor.nome }}
					</span>
				</template>
				<template v-slot:[`body.StatusCarro.descricao`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.StatusCarro">
						{{ item.StatusCarro.descricao }}
					</span>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-end w-full">
					<div class="flex">
						<BotaoPadrao
							class="flex"
							@clique="mostrarDialogCriarCarro = true"
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
		<DialogCriarCarro
			v-if="mostrarDialogCriarCarro"
			:carro="carro"
			@cadastrado="carroCadastrado"
			@editado="carroEditado"
			@deletado="carroDeletado"
			@cancelar="
				mostrarDialogCriarCarro = false
				carro = null
			" />
		<DialogChecklist
			v-if="mostrarDialogChecklist"
			@checklistCadastrado="checklistCadastrado"
			@checklistFechado="checklistFechado"
			@cancelar="
				mostrarDialogChecklist = false
				carro = null
			"
			:carro="carro"></DialogChecklist>
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
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCriarCarro from "~/components/Dialogs/Administracao/Transporte/Carros/DialogCriarCarro.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import DialogChecklist from "~/components/Dialogs/Administracao/Transporte/Carros/DialogChecklist.vue"

	export default {
		components: {
			DialogChecklist,
			TabelaPadrao,
			AppAlerta,
			CabecalhoPagina,
			RodapePagina,
			BotaoPadrao,
			DialogCriarCarro,
		},
		data() {
			return {
				mostrarDialogCriarCarro: false,
				carro: null,
				mostrarAlerta: false,
				textoAlerta: null,
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-24" },
					{ nome: "Checklist", valor: "checklist", largura: "w-[150px]" },
					{ nome: "Marca/Modelo", valor: "marca_modelo", filtro: true, ordenar: true },
					{ nome: "Placa", valor: "placa", filtro: true, ordenar: true },
					{ nome: "CGA", valor: "cga", ordenar: true },
					{ nome: "Setor", valor: "Setor.nome", filtro: true, ordenar: true },
					{ nome: "Status", valor: "StatusCarro.descricao", filtro: true, ordenar: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				itensPorPagina: 100,
				pagina: 1,
				dados: [],
				mostrarDialogChecklist: false,
			}
		},
		mounted() {
			this.buscarCarros()
		},
		methods: {
			carroCadastrado(carro) {
				this.dados.push(carro)

				this.mostrarDialogCriarCarro = false
				this.textoAlerta = "Carro cadastrado com sucesso!"
				this.mostrarAlerta = true
			},
			carroEditado(carro) {
				let idx = this.dados.findIndex((o) => o.id === carro.id)

				if (idx >= 0) {
					this.dados[idx] = Object.assign(this.dados[idx], carro)

					this.mostrarDialogCriarCarro = false
					this.textoAlerta = "Carro editado com sucesso!"
					this.mostrarAlerta = true
				}
			},
			carroDeletado(id) {
				let idx = this.dados.findIndex((o) => o.id === id)

				this.dados.splice(idx, 1)

				this.mostrarDialogCriarCarro = false
				this.textoAlerta = "Carro deletado com sucesso!"
				this.mostrarAlerta = true
			},
			async buscarCarros() {
				let resp = await this.$axios.$get("/transporte/carros/buscar_todos")

				if (!resp.falha) {
					this.dados = resp.dados.carros
				}
			},
			async checklistCadastrado(carro_id, checklist) {
				let idx = this.dados.findIndex( o => o.id === carro_id)

        if(idx >= 0){
          this.dados[idx].ChecklistCarro[0].ChecklistCarro = checklist
        }
				// this.mostrarDialogCriarCarro = false
				this.mostrarDialogChecklist = false
				this.textoAlerta = "Checklist cadastrado com sucesso!"
				this.mostrarAlerta = true
			},
			async checklistFechado(carro_id) {
				// let
				// this.mostrarDialogCriarCarro = false
				let idx = this.dados.findIndex((o) => o.id === carro_id)
				if (idx >= 0) {
					this.dados[idx].ChecklistCarro[0].data_fechamento = this.$dayjs().format("YYYY-MM-DD HH:mm:ss")
				}

				this.mostrarDialogChecklist = false
				this.textoAlerta = "Checklist finalizado com sucesso!"
				this.mostrarAlerta = true
			},
		},
	}
</script>

<style scoped>
	.tag-checklist {
		color: black;
		font-weight: 700;
		text-align: center;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		border-radius: 0.25rem;
	}
</style>
