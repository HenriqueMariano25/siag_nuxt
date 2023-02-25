<template>
	<div>
		<div>
			<AppTabela
				:cabecalho="cabecalho"
				:dados="dados"
				@filtrar="recebendoFiltro"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				:totalItens="totalItens"
				@atualizar="atualizarDados"
				:temDetalhes="true">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoIconeEditar @click="editarCard(item)" />
        </template>
        <template v-slot:[`body.Etapa.nome`]="{ item }">
          <span v-if="item.Etapa && item.Etapa.nome">
            {{ item.Etapa.nome}}
          </span>
        </template>
        <template v-slot:[`body.Setor.nome`]="{ item }">
          <span v-if="item.Setor && item.Setor.nome">
            {{ item.Setor.nome}}
          </span>
        </template>
        <template v-slot:[`body.DisciplinaCard.descricao`]="{ item }">
          <span v-if="item.DisciplinaCard && item.DisciplinaCard.descricao">
            {{ item.DisciplinaCard.descricao}}
          </span>
        </template>
        <template v-slot:[`body.CentroCustoPEP.numero_pep`]="{ item }">
          <span v-if="item.CentroCustoPEP && item.CentroCustoPEP.numero_pep">
            {{ item.CentroCustoPEP.numero_pep}}
          </span>
        </template>
        <template v-slot:[`body.FuncaoCard.nome`]="{ item }">
          <span v-if="item.FuncaoCard && item.FuncaoCard.nome">
            {{ item.FuncaoCard.nome}}
          </span>
        </template>
        <template v-slot:[`body.Indicacao.nome`]="{ item }">
          <span v-if="item.Indicacao && item.Indicacao.nome">
            {{ item.Indicacao.nome}}
          </span>
        </template>
        <template v-slot:[`body.data_necessidade`]="{ item }">
          <span v-if="item.data_necessidade">
            {{ $dayjs(item.data_necessidade).format("DD/MM/YYYY") }}
          </span>
        </template>
			</AppTabela>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex items-center w-full">
					<div class="flex w-full justify-end">
						<BotaoPadrao
							texto="Criar Card"
							@click="mostrarDialogCriarCard = true">
							<template v-slot>
								<svg
									width="24px"
									height="24px"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<g
										id="SVGRepo_bgCarrier"
										stroke-width="0"></g>
									<g
										id="SVGRepo_tracerCarrier"
										stroke-linecap="round"
										stroke-linejoin="round"></g>
									<g id="SVGRepo_iconCarrier">
										<path
											d="M4 20V19C4 16.2386 6.23858 14 9 14H12.75M17.5355 13.9645V17.5M17.5355 17.5V21.0355M17.5355 17.5H21.0711M17.5355 17.5H14M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
											stroke="#000000"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"></path>
									</g>
								</svg>
							</template>
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarCard
			v-if="mostrarDialogCriarCard"
      :card_id="card_id"
			@cancelar="cancelar" />
	</div>
</template>

<script>
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCriarCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogCriarCard.vue"
	import AppTabela from "~/components/Ui/AppTabela.vue"
  import BotaoIconeEditar from "~/components/Ui/Buttons/BotaoIconeEditar.vue";
	export default {
		name: "Cards",
		components: {
			RodapePagina,
			BotaoPadrao,
			DialogCriarCard,
			AppTabela,
      BotaoIconeEditar
		},
		data() {
			return {
				mostrarDialogCriarCard: false,
				cabecalho: [
					{ nome: "", valor: "acoes", centralizar: true },
					{ nome: "Etapa", valor: "Etapa.nome", filtro: true, ordenar: true, },
					{ nome: "Cod.", valor: "id", filtro: true, centralizar: true },
					{ nome: "Situação", valor: "situacao", filtro: true, centralizar: true },
					{ nome: "Setor", valor: "Setor.nome", filtro: true },
					{ nome: "Disciplina", valor: "DisciplinaCard.descricao", filtro: true },
					{ nome: "PEP", valor: "CentroCustoPEP.numero_pep", filtro: true },
					{ nome: "Função", valor: "FuncaoCard.nome", filtro: true },
					{ nome: "Nome", valor: "Indicacao.nome", filtro: true },
					{ nome: "Necessidade", valor: "data_necessidade", filtro: true, centralizar: true },
					{ nome: "Previsão Entrega", valor: "previsao_entrega", filtro: true },
					{ nome: "Última data", valor: "ultima_data", filtro: true },
					{ nome: "Comentários", valor: "Comentarios.at(-1).descricao", filtro: true },
				],
				dados: [],
				filtros: [],
				itensPorPagina: 10,
				pagina: 1,
				totalItens: 0,
        card_id: null,
			}
		},
		created() {
			this.buscarCards()
		},
		methods: {
			cancelar() {
				console.log("Cancelando")
				this.card_id = null
				this.mostrarDialogCriarCard = false
			},
			recebendoFiltro(filtros) {
				this.filtros = filtros
			},
			async buscarCards() {
				let resp = await this.$axios.$get("/contratacao/card/buscarPaginados", {
					params: {
						page: this.pagina - 1,
						size: this.itensPorPagina,
					},
				})

				if (!resp.falha) {
					let cards = resp.dados.cards.rows
					this.totalItens = resp.dados.cards.count
					this.dados = cards
				}
			},

			async atualizarDados(parametros) {
				let { itensPorPagina, pagina, filtros } = parametros

				if (itensPorPagina) this.itensPorPagina = itensPorPagina

				if (pagina) this.pagina = pagina

				if (filtros) this.filtros = filtros
				await this.buscarCards()
			},

      editarCard(item){
        console.log(item)
        this.card_id = item.id
        this.mostrarDialogCriarCard = true
      }
		},
	}
</script>

<style scoped></style>
