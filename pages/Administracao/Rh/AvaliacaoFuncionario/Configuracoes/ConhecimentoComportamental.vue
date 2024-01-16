<template>
	<div class="w-full">
		<CabecalhoPagina titulo="CONHECIMENTO COMPORTAMENTAL" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<TabelaPadrao
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
				@atualizar="buscarConhecimentos()"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						icone
						@clique="
							conhecimento = item
							mostrarDialogCriaConhecimentoComportamental = true
						">
						<img
							src="@/assets/icons/edit-b.svg"
							alt=""
							class="w-6 h-6" />
					</BotaoPadrao>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-end w-full">
					<div class="flex">
						<BotaoPadrao
							texto="cadastrar"
							@clique="mostrarDialogCriaConhecimentoComportamental = true">
							<img
								src="@/assets/icons/add-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarConhecimentoComportamental
			v-if="mostrarDialogCriaConhecimentoComportamental"
			:conhecimento="conhecimento"
			@cadastrado="cadastrado"
			@editado="editado"
			@deletado="deletado"
			@cancelar="
				mostrarDialogCriaConhecimentoComportamental = false
				conhecimento = null
			" />
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
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogCriarConhecimentoComportamental from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/ConhecimentoComportamental/DialogCriarConhecimentoComportamental.vue"

	export default {
		components: {
			DialogCriarConhecimentoComportamental,
			AppAlerta,
			RodapePagina,
			BotaoPadrao,
			TabelaPadrao,
			CabecalhoPagina,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Descrição", valor: "descricao" },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				itensPorPagina: 100,
				pagina: 1,
				dados: [],
				mostrarDialogCriaConhecimentoComportamental: false,
				conhecimento: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		async mounted() {
			await this.buscarConhecimentos()
		},
		methods: {
			async buscarConhecimentos() {
				let page = this.pagina - 1
				let size = this.itensPorPagina
				let filtros = this.filtros

				let resp = await this.$axios.$get("/conhecimento_comportamental/buscarTodos", {
					params: { page, size, filtros },
				})
				if (!resp.falha) {
					let { conhecimetosComportamental, total } = resp.dados
					this.dados = conhecimetosComportamental
					this.totalItens = total
				}
			},

			cadastrado(conhecimento) {
				this.dados.push(conhecimento)
				this.conhecimento = null

				this.mostrarDialogCriaConhecimentoComportamental = false
				this.textoAlerta = "Conhe. comportamental cadastrada com sucesso!"
				this.mostrarAlerta = true
			},
			editado(conhecimento) {
				let idx = this.dados.findIndex((o) => o.id === conhecimento.id)
				this.conhecimento = null

				if (idx >= 0) {
					for (let k of Object.keys(conhecimento)) {
						this.dados[idx][k] = conhecimento[k]
					}
					this.dados[idx] = Object.assign({}, conhecimento)
				}

				this.mostrarDialogCriaConhecimentoComportamental = false
				this.textoAlerta = "Conhe. comportamental editada com sucesso!"
				this.mostrarAlerta = true
			},
			deletado(id) {
				let idx = this.dados.findIndex((o) => o.id === id)
				this.conhecimento = null

				if (idx >= 0) {
					this.dados.splice(idx, 1)
				}

				this.mostrarDialogCriaConhecimentoComportamental = false
				this.textoAlerta = "Conhe. comportamental deletado com sucesso!"
				this.mostrarAlerta = true
			},
		},
	}
</script>

<style scoped></style>
