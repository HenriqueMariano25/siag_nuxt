<template>
	<div>
    <div
      class="flex bg-primaria-500 w-[96.5vw] print:hidden menuEtapas"
      style="overflow-x: scroll">
      <button
        class="flex p-2 hover:bg-gray-300 hover:text-black box-border print:hidden text-white"
        :class="{ 'border-t-4 border-black bg-gray-200 !text-black': etapa_id === 0 }"
        @click="etapa_id = 0">
        Todos
      </button>
      <div
        v-for="etapa in etapas"
        :key="etapa.id"
        class="grid grid-flow-col auto-cols-max divide-y-2 divide-amber-50">
        <button
          class="flex py-2 px-3 hover:bg-gray-400 box-border text-white hover:text-black"
          :class="{ 'border-t-4 border-black bg-gray-200 !text-black': etapa_id === etapa.id }"
          @click="etapa_id = etapa.id">
          <span class="whitespace-nowrap">{{ etapa.nome }}</span>
        </button>
      </div>
    </div>
		<div>
			<AppTabela
				:cabecalho="cabecalho"
				:dados="dados"
				@filtrar="recebendoFiltro"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				:totalItens="totalItens"
        altura="calc(100vh - 194px)"
				@atualizar="atualizarDados"
        :carregando="carregandoTabela"
				:temDetalhes="false">
				<template v-slot:[`body.selecione`]="{ item }">
					<div class="flex justify-center">
						<AppFormCheckbox
							:id="parseInt(item.id)"
							:valor="item"
							v-model="selecionados" />
					</div>
				</template>
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoIconeEditar @click="editarCard(item)" />
				</template>
				<template v-slot:[`body.Etapa.nome`]="{ item }">
					<span v-if="item.Etapa && item.Etapa.nome">
						{{ item.Etapa.nome }}
					</span>
				</template>
				<template v-slot:[`body.Setor.nome`]="{ item }">
					<span v-if="item.Setor && item.Setor.nome">
						{{ item.Setor.nome }}
					</span>
				</template>
				<template v-slot:[`body.DisciplinaCard.descricao`]="{ item }">
					<span v-if="item.DisciplinaCard && item.DisciplinaCard.descricao">
						{{ item.DisciplinaCard.descricao }}
					</span>
				</template>
				<template v-slot:[`body.CentroCustoPEP.numero_pep`]="{ item }">
					<span v-if="item.CentroCustoPEP && item.CentroCustoPEP.numero_pep">
						{{ item.CentroCustoPEP.numero_pep }}
					</span>
				</template>
				<template v-slot:[`body.FuncaoCard.nome`]="{ item }">
					<span v-if="item.FuncaoCard && item.FuncaoCard.nome">
						{{ item.FuncaoCard.nome }}
					</span>
				</template>
				<template v-slot:[`body.Indicacao.nome`]="{ item }">
					<span v-if="item.Indicacao && item.Indicacao.nome">
						{{ item.Indicacao.nome }}
					</span>
				</template>
				<template v-slot:[`body.data_necessidade`]="{ item }">
					<span v-if="item.data_necessidade">
						{{ $dayjs(item.data_necessidade).format("DD/MM/YYYY") }}
					</span>
				</template>
				<template v-slot:[`body.comentarios`]="{ item }">
					<button
						class="flex hover:bg-gray-400 w-full p-1"
						v-if="item.Comentarios.length > 0"
						@click="
							card_id = item.id;
							mostrarDialogComentariosCard = true;
						">
						<img
							src="@/assets/icons/comentarios-b.svg"
							alt="close"
							class="w-7 h-7 mr-1" />

						<span v-if="item.Comentarios.at(-1).descricao">
							{{ item.Comentarios.at(-1).descricao.substr(0, 20)
							}}{{ item.Comentarios.at(-1).descricao.length > 20 ? "..." : "" }}
						</span>
					</button>
				</template>
			</AppTabela>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex items-center w-full">
					<div class="flex w-full justify-end gap-4">
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
						<BotaoPadrao
							texto="Processar Card"
							:disabled="selecionados.length === 0"
							@click="mostrarDialogProcessarCard = true">
							<template v-slot>
								<img
									src="@/assets/icons/check-circle-b.svg"
									alt="close"
									class="w-6 h-6" />
							</template>
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarCard
			v-if="mostrarDialogCriarCard"
			:card_id="card_id"
      @editado="cardEditado"
			@cancelar="cancelar" />
		<DialogProcessarCard
			:cards="selecionados"
			v-if="mostrarDialogProcessarCard"
			@cancelar="mostrarDialogProcessarCard = false"
			@processado="processado" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogComentariosCard
			:card_id="card_id"
			v-if="mostrarDialogComentariosCard"
			@cancelar="
				mostrarDialogComentariosCard = false
				card_id = null
			" />
	</div>
</template>

<script>
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCriarCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogCriarCard.vue"
	import AppTabela from "~/components/Ui/AppTabela.vue"
	import BotaoIconeEditar from "~/components/Ui/Buttons/BotaoIconeEditar.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import DialogProcessarCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogProcessarCard.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogComentariosCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogComentariosCard.vue"
  import {buscarEtapa} from "~/mixins/buscarInformacoes";
	export default {
    mixins: [buscarEtapa],
		name: "Cards",
		components: {
			RodapePagina,
			BotaoPadrao,
			DialogCriarCard,
			AppTabela,
			BotaoIconeEditar,
			AppFormCheckbox,
			DialogProcessarCard,
			AppAlerta,
			DialogComentariosCard,
		},
		data() {
			return {
				mostrarDialogCriarCard: false,
				dados: [],
				filtros: [],
				itensPorPagina: 10,
				pagina: 1,
				totalItens: 0,
				card_id: null,
				selecionados: [],
				mostrarDialogProcessarCard: false,
				mostrarDialogComentariosCard: false,
				mostrarAlerta: false,
				textoAlerta: "",
        etapas: [],
        etapa_id: null,
        carregandoTabela: false
			}
		},
    computed:{
      cabecalho() {
        let cabecalho = [
          {nome: "", valor: "selecione", centralizar: true},
          {nome: "Etapa", valor: "Etapa.nome", filtro: true, ordenar: true},
          {nome: "Cod.", valor: "id", filtro: true, centralizar: true},
          {nome: "Situação", valor: "situacao", filtro: true, centralizar: true},
          {nome: "Setor", valor: "Setor.nome", filtro: true},
          {nome: "Disciplina", valor: "DisciplinaCard.descricao", filtro: true},
          {nome: "PEP", valor: "CentroCustoPEP.numero_pep", filtro: true},
          {nome: "Função", valor: "FuncaoCard.nome", filtro: true},
          {nome: "Nome", valor: "Indicacao.nome", filtro: true},
          {nome: "Necessidade", valor: "data_necessidade", filtro: true, centralizar: true},
          {nome: "Previsão Entrega", valor: "previsao_entrega", filtro: true},
          {nome: "Última data", valor: "ultima_data", filtro: true},
          {nome: "Comentários", valor: "comentarios", filtro: true},
        ]

        // if (this.listaAcao.includes(this.etapa_id)) {
        //   cabecalho.unshift({nome: "", valor: "acoes", centralizar: true, largura: "w-10"})
        // } else if (this.listaSelect.includes(this.etapa_id)) {
        //   cabecalho.unshift({nome: "", valor: "selecione", centralizar: true, largura: "w-10"})
        // }

        if (this.etapa_id !== 0) {
          cabecalho.unshift({nome: "", valor: "acoes", centralizar: true, largura: "w-10"})
        }
        return cabecalho
      },
    },
    async mounted() {
      this.etapas = await this.buscarEtapa()
      this.etapa_id = 0

      await this.buscarCards()
    },
		methods: {
			cancelar() {
				this.card_id = null
				this.mostrarDialogCriarCard = false
			},
			recebendoFiltro(filtros) {
				this.filtros = filtros
			},
			async buscarCards() {
        this.carregandoTabela = true
        let filtros = Object.assign({}, this.filtros)

        let etapa_id = this.etapa_id
        if (etapa_id !== 0) {
          filtros["etapa_id"] = etapa_id
        }

				let resp = await this.$axios.$get("/contratacao/card/buscarPaginados", {
					params: {
						page: this.pagina - 1,
						size: this.itensPorPagina,
            filtros
					},
				})

				if (!resp.falha) {
					let cards = resp.dados.cards.rows
					this.totalItens = resp.dados.cards.count
					this.dados = cards
          this.carregandoTabela = false
				}
			},

			async atualizarDados(parametros) {
				let { itensPorPagina, pagina, filtros } = parametros

				if (itensPorPagina) this.itensPorPagina = itensPorPagina

				if (pagina) this.pagina = pagina

				if (filtros) this.filtros = filtros
				await this.buscarCards()
			},

			editarCard(item) {
				this.card_id = item.id
				this.mostrarDialogCriarCard = true
			},

      cardEditado(dados){
        console.log(dados)

        let idx = this.dados.findIndex(o => o.id === dados.card_id)

        console.log(this.dados[idx])

        if(this.dados[idx].etapa_id !== 1)
          this.dados.splice(idx, 1)
        else
          this.dados[idx].Comentarios.push({ descricao: dados.comentario })

        this.mostrarDialogCriarCard = false
        this.mostrarAlerta = true
        this.textoAlerta = "Card editado com sucesso"
        this.card_id = null
      },

			async processado(dados) {
				let { cards, etapa_id } = dados

				this.mostrarDialogProcessarCard = false
				for (let card of cards) {
					let index = this.dados.findIndex((obj) => {
						return obj.id === card
					})

					this.dados[index].etapa_id = etapa_id.id
					this.dados[index].Etapa = etapa_id

					this.mostrarAlerta = true
					this.textoAlerta = "Cards processados com sucesso!"
					this.selecionados = []
				}
			},
		},
    watch: {
      etapa_id(valor) {
        this.buscarCards()
      }
    },
	}
</script>

<style scoped></style>
