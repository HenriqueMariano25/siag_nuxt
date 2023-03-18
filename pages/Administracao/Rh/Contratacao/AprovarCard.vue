<template>
	<div class="">
		<div class="flex w-full bg-primaria-900 h-14 flex text-white">
			<button
				@click="tipoAprovacao = 'controle'"
				class="px-4 hover:bg-blue-600"
				v-if="
					$auth.user &&
					$auth.user.permissoes.includes('aprovar_card_controle')
				"
				:class="{ 'border-b-4 border-b-white': tipoAprovacao === 'controle' }">
				Controle
			</button>
			<button
				@click="tipoAprovacao = 'gestor_area'"
				class="px-4 hover:bg-blue-600"
				v-if="
					$auth.user &&
					$auth.user.permissoes.includes('aprovar_card_gerente_area')
				"
				:class="{ 'border-b-4 border-b-white': tipoAprovacao === 'gestor_area' }">
				Gestor Área
			</button>
			<button
				@click="tipoAprovacao = 'site_manager'"
				class="px-4 hover:bg-blue-600"
				v-if="
					$auth.user &&
					$auth.user.includes('aprovar_card_site_manager')
				"
				:class="{ 'border-b-4 border-b-white': tipoAprovacao === 'site_manager' }">
				Site Manager
			</button>
		</div>
		<div class="">
			<AppTabela
				:cabecalho="cabecalho"
				:dados="dados"
				@filtrar="recebendoFiltro"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				:totalItens="totalItens"
				altura="calc(100vh - 190px)"
				@atualizar="atualizarDados"
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
					<BotaoIcone
						@click="
							card = item
							mostrarDialogAprovControleCard = true
						">
						<img
							src="@/assets/icons/check-circle-b.svg"
							alt="close"
							class="w-6 h-6" />
					</BotaoIcone>
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
              class="w-7 h-7 mr-1"/>
            <span v-if="item.Comentarios.at(-1).descricao">
							{{
                item.Comentarios.at(-1).descricao.substr(0, 20)
              }}{{ item.Comentarios.at(-1).descricao.length > 20 ? "..." : "" }}
						</span>
          </button>
        </template>
			</AppTabela>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex items-center w-full" v-if="tipoAprovacao !== 'controle'">
					<div class="flex w-full justify-end">
						<BotaoPadrao
							:disabled="selecionados.length <= 0"
							texto="Aprovar Cards"
							@click="mostrarDialogAprovarCard = true">
							<template v-slot>
								<img
									src="@/assets/icons/check-b.svg"
									alt="close"
									class="w-7 h-7 fill-red-500" />
							</template>
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogAprovarCard
			v-if="mostrarDialogAprovarCard"
			:cards="selecionados"
			:tipoAprovacao="tipoAprovacao"
			@aprovado="aprovado"
			@cancelar="mostrarDialogAprovarCard = false" />
		<DialogAprovControleCard
			:card="card"
			v-if="mostrarDialogAprovControleCard"
      @aprovado="aprovado"
			@cancelar="
				mostrarDialogAprovControleCard = false
				card = null
			" />
    <DialogComentariosCard
      :card_id="card_id"
      v-if="mostrarDialogComentariosCard"
      @cancelar="
				mostrarDialogComentariosCard = false
				card_id = null
			"/>
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import AppTabela from "~/components/Ui/AppTabela.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogAprovarCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogAprovarCard.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import BotaoIcone from "~/components/Ui/Buttons/BotaoIcone.vue"
	import DialogAprovControleCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogAprovControleCard.vue";
  import DialogComentariosCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogComentariosCard.vue";

	export default {
		name: "AprovarCard",
		components: {
			AppTabela,
			AppFormCheckbox,
			RodapePagina,
			BotaoPadrao,
			DialogAprovarCard,
			AppAlerta,
			BotaoIcone,
      DialogAprovControleCard,
      DialogComentariosCard
		},
		data() {
			return {
				dados: [],
				filtros: [],
				itensPorPagina: 10,
				pagina: 1,
				totalItens: 0,
				tipoAprovacao: null,
				tiposAprovacao: [],
				selecionados: [],
				mostrarDialogAprovarCard: false,
				mostrarAlerta: false,
				textoAlerta: "",
        mostrarDialogAprovControleCard: false,
				card: null,
        mostrarDialogComentariosCard: false,
        card_id: null,
			}
		},
		created() {
			if (this.$auth.user) {
				let todasPermissoes = this.$auth.user.permissoes

				if (todasPermissoes.includes("aprovar_card_controle")) {
					this.tiposAprovacao.push("controle")
					this.tipoAprovacao === null ? (this.tipoAprovacao = "controle") : false
				}

				if (todasPermissoes.includes("aprovar_card_gerente_area")) {
					this.tiposAprovacao.push("gestor_area")
					this.tipoAprovacao === null ? (this.tipoAprovacao = "gestor_area") : false
				}

				if (todasPermissoes.includes("aprovar_card_site_manager")) {
					this.tiposAprovacao.push("site_manager")
					this.tipoAprovacao === null ? (this.tipoAprovacao = "site_manager") : false
				}
			}
			this.buscarCards()
		},
		computed: {
			cabecalho() {
				let cabecalho = [
					{ nome: "Etapa", valor: "Etapa.nome", filtro: true, ordenar: true },
					{ nome: "Cod.", valor: "id", filtro: true, centralizar: true },
					{ nome: "Situação", valor: "situacao", filtro: true, centralizar: true },
					{ nome: "Setor", valor: "Setor.nome", filtro: true },
					{ nome: "Disciplina", valor: "DisciplinaCard.descricao", filtro: true },
					{ nome: "PEP", valor: "CentroCustoPEP.numero_pep", filtro: true },
					{ nome: "Função", valor: "FuncaoCard.nome", filtro: true },
					{ nome: "Nome", valor: "Indicacao.nome", filtro: true },
					{ nome: "Necessidade", valor: "data_necessidade", filtro: true, centralizar: true },
					{ nome: "Última data", valor: "ultima_data", filtro: true },
					{ nome: "Comentários", valor: "comentarios", filtro: true },
				]

				if (this.tipoAprovacao === "controle") {
					cabecalho.unshift({ nome: "", valor: "acoes", centralizar: true })
				} else {
					cabecalho.unshift({ nome: "", valor: "selecione", centralizar: true })
				}
				return cabecalho
			},
		},
		methods: {
			async buscarCards() {
				let setor_id = this.$auth.user.setor_id
				this.selecionados = []

				let resp = await this.$axios.$get("/contratacao/card/aprovacao/buscarPaginados", {
					params: {
						tipoAprovacao: this.tipoAprovacao,
						page: this.pagina - 1,
						size: this.itensPorPagina,
						setor_id,
					},
				})

				if (!resp.falha) {
					let cards = resp.dados.cards.rows
					this.totalItens = resp.dados.cards.count
					this.dados = cards
				}
			},

			recebendoFiltro(filtros) {
				this.filtros = filtros
			},

			async atualizarDados(parametros) {
				let { itensPorPagina, pagina, filtros } = parametros

				if (itensPorPagina) this.itensPorPagina = itensPorPagina

				if (pagina) this.pagina = pagina

				if (filtros) this.filtros = filtros
				await this.buscarCards()
			},

			async aprovado(cards, aprovacao) {
        this.mostrarDialogAprovarCard = false
        this.mostrarDialogAprovControleCard = false

				for (let card of cards) {
					let index = this.dados.findIndex((obj) => {
						return obj.id === card
					})

					this.dados.splice(index, 1)
				}
				this.mostrarAlerta = true
				this.textoAlerta = aprovacao ? "Cards aprovados com sucesso!" : "Cards negados com sucesso!"
				this.selecionados = []
			},
		},
		watch: {
			tipoAprovacao() {
				this.buscarCards()
			},
		},
	}
</script>

<style scoped></style>
