<template>
	<div class="w-full">
		<div class="flex w-full bg-primaria-900 h-14 flex text-white">
			<button
				@click="tipoAprovacao = 'controle'"
				class="px-4 hover:bg-blue-600"
				v-if="$auth.user && $auth.user.permissoes.includes('aprovar_card_controle')"
				:class="{ 'border-b-4 border-b-white': tipoAprovacao === 'controle' }">
				Controle
			</button>

			<button
				@click="tipoAprovacao = 'gestor_area'"
				class="px-4 hover:bg-blue-600"
				v-if="$auth.user && $auth.user.permissoes.includes('aprovar_card_gerente_area')"
				:class="{ 'border-b-4 border-b-white': tipoAprovacao === 'gestor_area' }">
				Gestor Área
			</button>

			<button
				@click="tipoAprovacao = 'site_manager'"
				class="px-4 hover:bg-blue-600"
				v-if="$auth.user && $auth.user.permissoes.includes('aprovar_card_site_manager')"
				:class="{ 'border-b-4 border-b-white': tipoAprovacao === 'site_manager' }">
				Site Manager
			</button>
		</div>
		<div class="">
			<TabelaPadrao
				:cabecalho="cabecalho"
				:dados="dados"
				@filtrar="recebendoFiltro"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				:totalItens="totalItens"
				altura="calc(100vh - 190px)"
				@atualizar="buscarCards()"
				@dblclick="verDetalhesSS"
				@selecionados="selecionados = $event"
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
					<div class="w-8 h-8 flex items-center">
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
					</div>
				</template>
				<template v-slot:[`body.id`]="{ item }">
					<span class="whitespace-nowrap">{{ ("000000" + item.id).slice(-6) }}</span>
				</template>
				<template v-slot:[`body.Etapa.nome`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.Etapa && item.Etapa.nome">
						{{ item.Etapa.nome }}
					</span>
				</template>
				<template v-slot:[`body.Setor.nome`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.Setor && item.Setor.nome">
						{{ item.Setor.nome }}
					</span>
				</template>
				<template v-slot:[`body.DisciplinaCard.descricao`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.DisciplinaCard && item.DisciplinaCard.descricao">
						{{ item.DisciplinaCard.descricao }}
					</span>
				</template>
				<template v-slot:[`body.CentroCustoPEP.numero_pep`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.CentroCustoPEP && item.CentroCustoPEP.numero_pep">
						{{ item.CentroCustoPEP.numero_pep }}
					</span>
				</template>
				<template v-slot:[`body.FuncaoCard.nome`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.FuncaoCard && item.FuncaoCard.nome">
						{{ item.FuncaoCard.nome }}
					</span>
				</template>
				<template v-slot:[`body.Indicacao.nome`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.Indicacao && item.Indicacao.nome">
						{{ item.Indicacao.nome }}
					</span>
				</template>
				<template v-slot:[`body.data_necessidade`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.data_necessidade">
						{{ $dayjs(item.data_necessidade).format("DD/MM/YYYY") }}
					</span>
				</template>
				<template v-slot:[`body.ultima_data`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.ultima_data">
						{{ $dayjs(item.ultima_data).format("DD/MM/YYYY") }}
					</span>
				</template>
				<template v-slot:[`body.situacao`]="{ item }">
					<div class="flex justify-center gap-1.5">
						<div
							v-if="!($dayjs().diff(item.ultima_data, 'day') > item.Etapa.leadtime)"
							class="bg-blue-400 text-black px-2 rounded whitespace-nowrap">
							No prazo
						</div>
						<div
							v-if="$dayjs().diff(item.ultima_data, 'day') > item.Etapa.leadtime"
							class="bg-red-400 text-black px-2 rounded whitespace-nowrap">
							Atrasado
						</div>
						<div
							v-if="item.confidencial === true"
							class="bg-gray-600 text-white px-2 rounded whitespace-nowrap">
							Confidencial
						</div>
					</div>
				</template>
				<template v-slot:[`body.Usuario.nome`]="{ item }">
					<span
						v-if="item"
						class="whitespace-nowrap">
						{{ item.Usuario ? item.Usuario.nome : "" }}
					</span>
				</template>
				<template v-slot:[`body.comentarios`]="{ item }">
					<button
						class="flex hover:bg-gray-400 w-full p-1 whitespace-nowrap"
						v-if="item.Comentarios.length > 0"
						@click="
							card_id = item.id
							mostrarDialogComentariosCard = true
						">
						<img
							src="@/assets/icons/comentarios-b.svg"
							alt="close"
							class="w-6 h-6 mr-1" />
						<span v-if="item.Comentarios.at(-1).descricao">
							{{ item.Comentarios.at(-1).descricao.substr(0, 20)
							}}{{ item.Comentarios.at(-1).descricao.length > 20 ? "..." : "" }}
						</span>
					</button>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex items-center w-full justify-between">
					<div class="flex gap-2">
						<BotaoPadrao
							texto="Gerar excel"
							@clique="gerarExcel()">
							<img
								src="@/assets/icons/excel-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
						<BotaoPadrao
							texto="últimas aprovações"
							@clique="mostrarDialogUltimaAprovacoes = true">
						</BotaoPadrao>
					</div>
					<div
						class="flex"
						v-if="tipoAprovacao !== 'controle'">
						<BotaoPadrao
							:disabled="selecionados.length <= 0"
							texto="Aprovar Cards"
							@clique="mostrarDialogAprovarCard = true">
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
			" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogDetalhesCard
			v-if="mostrarDialogDetalhesCard"
			@cancelar="
				mostrarDialogDetalhesCard = false
				card_id = null
			"
			:card_id="card_id" />
		<DialogUltimasAprovacoes
			v-if="mostrarDialogUltimaAprovacoes"
			@cancelar="mostrarDialogUltimaAprovacoes = false"
      @voltouAprovacao="voltouAprovacao"
			:tipo-aprovacao="tipoAprovacao" />
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
	import DialogAprovControleCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogAprovControleCard.vue"
	import DialogComentariosCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogComentariosCard.vue"
	import DialogDetalhesCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogDetalhesCard.vue"
	import { buscarSetores, buscarDisciplinaCard, buscarEtapa } from "~/mixins/buscarInformacoes"
	import { prepararFiltro } from "~/mixins/prepararFiltro"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import gerarExcel from "~/functions/gerarExcel"
	import DialogUltimasAprovacoes from "~/components/Dialogs/Administracao/Rh/Contratacao/AprovarCard/DialogUltimasAprovacoes.vue"

	export default {
		mixins: [buscarEtapa, prepararFiltro, buscarSetores, buscarDisciplinaCard],
		name: "AprovarCard",
		components: {
			DialogUltimasAprovacoes,
			DialogDetalhesCard,
			AppTabela,
			AppFormCheckbox,
			RodapePagina,
			BotaoPadrao,
			DialogAprovarCard,
			AppAlerta,
			BotaoIcone,
			DialogAprovControleCard,
			DialogComentariosCard,
			TabelaPadrao,
		},
		data() {
			return {
				dados: [],
				filtros: {},
				ordem: null,
				itensPorPagina: 20,
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
				mostrarDialogDetalhesCard: false,
				setores: [],
				disciplinas: [],
				mostrarDialogUltimaAprovacoes: false,
			}
		},
		async created() {
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
			await this.buscarCards()
			this.setores = await this.buscarSetores()
			this.disciplinas = await this.buscarDisciplinaCard()
		},
		computed: {
			cabecalho() {
				let cabecalho = [
					// { nome: "Etapa", valor: "Etapa.nome", filtro: true, ordenar: true },
					{ nome: "Cod.", valor: "id", filtro: true, centralizar: true },
					{ nome: "Situação", valor: "situacao", centralizar: true },
					{
						nome: "Setor",
						valor: "Setor.nome",
						filtro: true,
						opcoes: Array.from(
							new Set(
								this.setores
									.filter((item) => {
										return item.nome
									})
									.map((item) => `${item.nome}`),
							),
						),
					},
					{
						nome: "Disciplina",
						valor: "DisciplinaCard.descricao",
						filtro: true,
						opcoes: Array.from(
							new Set(
								this.disciplinas
									.filter((item) => {
										return item.descricao
									})
									.map((item) => `${item.descricao}`),
							),
						),
					},
					{ nome: "PEP", valor: "CentroCustoPEP.numero_pep", filtro: true },
					{ nome: "Função", valor: "FuncaoCard.nome", filtro: true },
					{ nome: "Nome", valor: "Indicacao.nome", filtro: true },
					{
						nome: "Necessidade",
						valor: "data_necessidade",
						filtro: true,
						centralizar: true,
						tipoFiltro: "data",
					},
					{ nome: "Criado por", valor: "Usuario.nome", filtro: true },
					{
						nome: "Última data",
						valor: "ultima_data",
						filtro: true,
						centralizar: true,
						tipoFiltro: "data",
					},
					{ nome: "Comentários", valor: "comentarios" },
				]

				if (this.tipoAprovacao === "controle") {
					cabecalho.unshift({ nome: "", valor: "acoes", centralizar: true, largura: "w-12" })
				} else {
					cabecalho.unshift({ nome: "", valor: "selecione", centralizar: true, largura: "w-10" })
				}
				return cabecalho
			},
		},
		methods: {
			async buscarCards() {
				let setor_id = this.$auth.user.setor_id
				let filtros = this.filtros
				this.selecionados = []

				let resp = await this.$axios.$get("/contratacao/card/aprovacao/buscarPaginados", {
					params: {
						filtros,
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

			verDetalhesSS(dados) {
				this.card_id = dados.id
				this.mostrarDialogDetalhesCard = true
			},

			async gerarExcel() {
				let dados = this.dados

				let cabecalho = [
					"Codigo",
					"Situação",
					"Setor",
					"Disciplina",
					"PEP",
					"Função",
					"Nome",
					"Necessidade",
					"Criado por",
					"Última data",
				]
				let nomeArquivo

				nomeArquivo = "aprovacao"

				let itens = []
				for (let item of dados) {
					let temp = []
					temp.push(("000000" + item.id).slice(-6))
					temp.push(
						this.$dayjs().diff(item.ultima_data, "day") <= item.Etapa.leadtime
							? "No prazo"
							: "Atrasado",
					)
					temp.push(item.Setor.nome ? item.Setor.nome : "")
					temp.push(item.DisciplinaCard ? `${item.DisciplinaCard.sigla}` : "")
					temp.push(
						item.CentroCustoPEP
							? `${item.CentroCustoPEP.numero_pep} - ${item.CentroCustoPEP.descricao}`
							: "",
					)
					temp.push(item.FuncaoCard ? item.FuncaoCard.nome.trim() : "")
					temp.push(item.Indicacao ? item.Indicacao.nome : "")
					temp.push(this.$dayjs(item.data_necessidade).format("DD/MM/YYYY"))
					temp.push(item.Usuario ? item.Usuario.nome : "")
					temp.push(this.$dayjs(item.ultima_data).format("DD/MM/YYYY"))

					itens.push(temp)
				}

				gerarExcel(cabecalho, itens, nomeArquivo)
			},

      voltouAprovacao(){
        this.buscarCards()
        this.textoAlerta = "Card voltou para aprovação com sucesso!"
        this.mostrarAlerta = true
        this.mostrarDialogUltimaAprovacoes = false
      }
		},
		watch: {
			tipoAprovacao() {
				this.buscarCards()
			},
		},
	}
</script>

<style scoped></style>
