<template>
	<div class="w-full">
    <CabecalhoPagina titulo="CARD" />
		<div
			class="flex bg-primaria-500 w-full print:hidden menuEtapas !mt-11"
			style="overflow-x: scroll">
			<button
				class="flex p-2 hover:bg-gray-300 hover:text-black box-border print:hidden text-white"
				:class="{ 'border-t-4 border-black bg-gray-200 !text-black': etapa_id === 0 }"
				@click="
					etapa_id = 0
					etapaAtual = null
					proximaEtapa = null
					anteriorEtapa = null
				">
				Todos
			</button>
			<div
				v-for="etapa in etapas"
				:key="etapa.id"
				class="grid grid-flow-col auto-cols-max divide-y-2 divide-amber-50">
				<button
					class="flex py-2 px-3 hover:bg-gray-400 box-border text-white hover:text-black"
					:class="{ 'border-t-4 border-black bg-gray-200 !text-black': etapa_id === etapa.id }"
					@click="
						etapa_id = etapa.id
						etapaAtual = etapa
						buscarProximaEtapa(etapa.ordem)
					">
					<span class="whitespace-nowrap">{{ etapa.nome }}</span>
				</button>
			</div>
		</div>
		<div class="print:hidden">
			<TabelaPadrao
        id="cards"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
        @itensPorPagina="itensPorPagina = $event"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 224px)"
				:dadosSql="true"
				@atualizar="buscarCards"
				@dblclick="verDetalhesSS"
				:selecionar="
				$auth.user.permissoes.includes('rh_contratacoes') &&
					!this.etapasAprovacao.includes(etapa_id) &&
					etapa_id !== null &&
					etapa_id !== 0 &&
					!this.etapasFinalização.includes(etapa_id)
				"
				@selecionados="selecionados = $event"
				:limparSelecionar="true"
				:carregando="carregandoTabela"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoIconeEditar
						@click="editarCard(item)"
						:disabled="!podeEditarCard(item)" />
				</template>
				<template v-slot:[`body.id`]="{ item }">
					<span class="whitespace-nowrap">{{ ("000000" + item.id).slice(-6) }}</span>
				</template>
				<template v-slot:[`body.Etapa.id`]="{ item }">
					<span
						v-if="item['Etapa.nome']"
						class="whitespace-nowrap">
						{{ item["Etapa.nome"] }}
					</span>
				</template>
				<template v-slot:[`body.Setor.nome`]="{ item }">
					<span
						v-if="item.Setor && item.Setor.nome"
						class="whitespace-nowrap">
						{{ item.Setor.nome }}
					</span>
				</template>
				<template v-slot:[`body.DisciplinaCard.descricao`]="{ item }">
					<span
						v-if="item['DisciplinaCard.descricao']"
						class="whitespace-nowrap">
						{{ item["DisciplinaCard.sigla"] }} - {{ item["DisciplinaCard.descricao"] }}
					</span>
				</template>
				<template v-slot:[`body.CentroCustoPEP.numero_pep`]="{ item }">
					<span
						v-if="item.CentroCustoPEP && item.CentroCustoPEP.numero_pep"
						class="whitespace-nowrap">
						{{ item.CentroCustoPEP.numero_pep }}
					</span>
				</template>
				<template v-slot:[`body.situacao`]="{ item }">
					<div class="flex justify-center gap-1.5">
						<template
							v-if="
								item['Etapa.conclui_processo'] === true ||
								item['Etapa.rejeita_processo'] === true ||
								item['Etapa.standby_processo'] === true
							">
							<div
								v-if="item['Etapa.conclui_processo'] === true"
								class="text-black bg-green-400 px-2 rounded whitespace-nowrap">
								Finalizado
							</div>
							<div
								v-if="item['Etapa.rejeita_processo'] === true"
								class="text-white bg-red-800 px-2 rounded whitespace-nowrap">
								Rejeitado
							</div>
							<div
								v-if="item['Etapa.standby_processo'] === true"
								class="text-black bg-yellow-500 px-2 rounded whitespace-nowrap">
								Stand by
							</div>
						</template>
						<template v-else>
							<template v-if="item['Etapa.conclui_processo'] === false">
								<div
									v-if="!($dayjs().diff(item.ultima_data, 'day') > item['Etapa.leadtime'])"
									class="bg-blue-400 text-black px-2 rounded whitespace-nowrap">
									No prazo
								</div>
								<div
									v-if="$dayjs().diff(item.ultima_data, 'day') > item['Etapa.leadtime']"
									class="bg-red-400 text-black px-2 rounded whitespace-nowrap">
									Atrasado
								</div>
							</template>
							<div
								v-if="item.confidencial === true"
								class="bg-gray-600 text-white px-2 rounded whitespace-nowrap">
								Confidencial
							</div>
						</template>
					</div>
				</template>
				<template v-slot:[`body.FuncaoCard.nome`]="{ item }">
					<span
						v-if="item.FuncaoCard && item.FuncaoCard.nome"
						class="whitespace-nowrap">
						{{ item.FuncaoCard.nome }}
					</span>
				</template>
				<template v-slot:[`body.Indicacao.nome`]="{ item }">
					<span
						v-if="item.Indicacao && item.Indicacao.nome"
						class="whitespace-nowrap">
						{{ item.Indicacao.nome }}
					</span>
				</template>
				<template v-slot:[`body.data_necessidade`]="{ item }">
					<span
						v-if="item.data_necessidade"
						class="whitespace-nowrap">
						{{ $dayjs(item.data_necessidade).format("DD/MM/YYYY") }}
					</span>
				</template>
				<template v-slot:[`body.ultima_data`]="{ item }">
					<span
						v-if="item.ultima_data"
						class="whitespace-nowrap">
						{{ $dayjs(item.ultima_data).format("DD/MM/YYYY") }}
					</span>
				</template>
				<template v-slot:[`body.data_previsao`]="{ item }">
					<span
						v-if="item.data_previsao"
						class="whitespace-nowrap">
						{{ $dayjs(item.data_previsao).add(30, "day").format("DD/MM/YYYY") }}
					</span>
				</template>
				<template v-slot:[`body.Usuario.nome`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item["Usuario.nome"] ? item["Usuario.nome"] : "" }}
					</span>
				</template>
				<template v-slot:[`body.responsavel.nome`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item["Responsavel.nome"] ? item["Responsavel.nome"] : "" }}
					</span>
				</template>
				<template v-slot:[`body.comentarios`]="{ item }">
					<button
						class="flex hover:bg-gray-400 min-w-[230px] p-1"
						@click="
							card_id = item.id
							mostrarDialogComentariosCard = true
						">
						<img
							src="@/assets/icons/comentarios-b.svg"
							alt="close"
							class="w-6 h-6 mr-1" />

						<span
							class="whitespace-nowrap"
							v-if="item['Comentarios.descricao'] !== null && item['Comentarios.descricao'] !== ''">
							{{ item["Comentarios.descricao"].substr(0, 25)
							}}{{ item["Comentarios.descricao"].length > 25 ? "..." : "" }}
						</span>
					</button>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex items-center w-full">
					<div class="flex w-full gap-2">
						<!--            Esconder por enquanto, até finalizar todos os testes-->
						<!--						<BotaoPadrao-->
						<!--							texto="Filtros avançados"-->
						<!--							@click="mostrarDialogFiltroAvancado = true">-->
						<!--							<img-->
						<!--								src="@/assets/icons/filter-b.svg"-->
						<!--								alt="close"-->
						<!--								class="w-6 h-6" />-->
						<!--						</BotaoPadrao>-->
						<BotaoPadrao
							:texto="gerandoExcel ? 'Gerando Excel' : 'Excel'"
							@clique="gerarExcel()"
							:disabled="gerandoExcel">
							<img
								src="@/assets/icons/excel-b.svg"
								alt="excel"
								class="w-6 h-6" />
						</BotaoPadrao>
						<!--						<BotaoPadrao-->
						<!--							:texto="gerandoExcel ? 'Gerando Excel' : 'Excel por etapa'"-->
						<!--							@click="gerarExcelEtapa()"-->
						<!--							:disabled="gerandoExcel">-->
						<!--							<img-->
						<!--								src="@/assets/icons/excel-b.svg"-->
						<!--								alt="excel"-->
						<!--								class="w-6 h-6" />-->
						<!--						</BotaoPadrao>-->
					</div>
					<div class="flex w-full justify-end gap-4">
						<BotaoPadrao
							texto="Criar Card"
							@clique="mostrarDialogCriarCard = true">
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
              v-if="$auth.user.permissoes.includes('rh_contratacoes')"
							@clique="mostrarDialogProcessarCard = true">
							<template v-slot>
								<img
									src="@/assets/icons/check-circle-b.svg"
									alt="close"
									class="w-6 h-6" />
							</template>
						</BotaoPadrao>
						<BotaoPadrao
              v-if="$auth.user.permissoes.includes('rh_contratacoes_editar_funcao')"
							texto="Editar função"
							@clique="mostrarDialogEditarFuncao = true"
							:disabled="podeEditarFuncao">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarCard
			v-if="mostrarDialogCriarCard"
			:card_id="card_id"
			@editado="cardEditado"
			@cadastrado="cardCadastrado"
			@deletado="cardDeletado"
			@cancelar="cancelar" />
		<DialogProcessarCard
			:cards="selecionados"
			v-if="mostrarDialogProcessarCard"
			@cancelar="mostrarDialogProcessarCard = false"
			:etapa="etapaAtual"
			:proximaEtapa="proximaEtapa"
			:anteriorEtapa="anteriorEtapa"
			@alterouCandidato="alterouCandidato"
			@concluido="concluido"
			@rejeitado="rejeitado"
			@standby="standby"
			@retornouStandby="retornouStandby"
			@processado="processado" />
		<DialogEditarFuncao
			v-if="mostrarDialogEditarFuncao"
			@cancelar="mostrarDialogEditarFuncao = false"
      @funcaoEditada="funcaoEditada"
			:cards="selecionados" />
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
		<DialogDetalhesCard
			v-if="mostrarDialogDetalhesCard"
			@cancelar="
				mostrarDialogDetalhesCard = false
				card_id = null
			"
			:card_id="card_id" />
		<DialogFiltroAvancado
			v-show="mostrarDialogFiltroAvancado"
			@cancelar="mostrarDialogFiltroAvancado = false"
			@limparFiltro="limparFiltroAvancado"
			@filtrar="filtrarAvancado" />
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
	import { buscarEtapa, buscarSetores, buscarDisciplinaCard } from "~/mixins/buscarInformacoes"
	import DialogDetalhesCard from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogDetalhesCard.vue"
	import DialogFiltroAvancado from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogFiltroAvancado.vue"
	import { prepararFiltro } from "~/mixins/prepararFiltro"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import gerarExcel from "~/functions/gerarExcel"
	import DialogEditarFuncao from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogEditarFuncao.vue"
  import dialgoConfirmarAprovacao from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialgoConfirmarAprovacao.vue";
  import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
	export default {
		mixins: [buscarEtapa, prepararFiltro, buscarSetores, buscarDisciplinaCard],
		name: "Cards",
		components: {
      CabecalhoPagina,
			DialogEditarFuncao,
			RodapePagina,
			BotaoPadrao,
			DialogCriarCard,
			AppTabela,
			BotaoIconeEditar,
			AppFormCheckbox,
			DialogProcessarCard,
			AppAlerta,
			DialogComentariosCard,
			DialogDetalhesCard,
			DialogFiltroAvancado,
			TabelaPadrao,
		},
		data() {
			return {
				mostrarDialogCriarCard: false,
				dados: [],
				filtros: [],
				itensPorPagina: 100,
				pagina: 1,
				card_id: null,
				totalItens: 0,
				selecionados: [],
				mostrarDialogProcessarCard: false,
				mostrarDialogComentariosCard: false,
				mostrarAlerta: false,
				textoAlerta: "",
				etapas: [],
				etapa_id: null,
				carregandoTabela: false,
				mostrarDialogDetalhesCard: false,
				mostrarDialogFiltroAvancado: false,
				gerandoExcel: false,
				setores: [],
				disciplinas: [],
				etapaAtual: null,
				proximaEtapa: null,
				anteriorEtapa: null,
				etapasAprovacao: [],
				etapasFinalização: [],
				limparSelecionar: 1,
				mostrarDialogEditarFuncao: false,
			}
		},

		computed: {
			cabecalho() {
				let cabecalho = [
					{
						nome: "Cod.",
						valor: "id",
						filtro: true,
						centralizar: true,
						colunaTabela: "card.id",
						ordenar: true,
						tipoFiltro: "inteiro",
					},
					{
						nome: "Etapa",
						valor: "Etapa.id",
						filtro: true,
						// mostrarVazio: true,
						opcoes: Array.from(
							new Set(
								this.etapas
									.filter((item) => {
										return item.nome
									})
									.map((item) => {
										return { id: item.id, texto: item.nome }
									}),
							),
						),
					},
					{ nome: "Situação", valor: "situacao" },
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
					{
						nome: "Previsão Entrega",
						valor: "data_previsao",
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
					{ nome: "Responsável", valor: "responsavel.nome", filtro: true },
					{ nome: "Turno", valor: "turno", filtro: true },
					{ nome: "Comentários", valor: "comentarios" },
				]

				let listaEdicao = [0, 1, 2, 3, 4, 5, 6]

				if (this.$auth.user.permissoes.includes("editar_card_adm_contratacao"))
					listaEdicao = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

				if (listaEdicao.some((o) => this.etapa_id === o)) {
					cabecalho.unshift({ nome: "", valor: "acoes", centralizar: true, largura: "w-10" })
				}

				let listaNaoSelect = [0, 1, 2, 3]

				if (this.$auth.user.permissoes.includes("rh_contratacoes")) {
					// if (!listaNaoSelect.some((o) => this.etapa_id === o)) {
					//   cabecalho.unshift({nome: "", valor: "selecione", centralizar: true, larura: "w-10"})
					// }
				}

				return cabecalho
			},

			isAdminCardRH() {
				return this.$auth.user.permissoes.includes("editar_card_adm_contratacao")
			},

      podeEditarFuncao(){
        let setores = [...new Set(this.selecionados.map( o => o.setor_id))]

        return setores.length !== 1
      }
		},
    created() {
      this.carregandoTabela = true
    },
    async mounted() {

			await this.buscarEtapas()
			this.setores = await this.buscarSetores()
			this.disciplinas = await this.buscarDisciplinaCard()
			this.etapa_id = 0

			await this.buscarCards()
		},
		methods: {
			async buscarEtapas() {
				this.etapas = await this.buscarEtapa()
				this.etapasAprovacao = this.etapas
					.filter((o) => o.precisa_aprovacao === true)
					.map((o) => o.id)
				this.etapasFinalização = this.etapas
					.filter((o) => o.conclui_processo === true)
					.map((o) => o.id)
			},

			buscarProximaEtapa(ordemAtual) {
				let proximaEtapa = this.etapas.filter((o) => parseInt(o.ordem) === parseInt(ordemAtual) + 1)
				let anteriorEtapa = this.etapas.filter(
					(o) => parseInt(o.ordem) === parseInt(ordemAtual) - 1,
				)

				this.proximaEtapa = proximaEtapa[0]
				this.anteriorEtapa = anteriorEtapa[0]
			},

			podeEditarCard(item) {
				let listaEdicao = [1, 2, 3, 4, 5, 6]

				if (this.isAdminCardRH) {
					return this.isAdminCardRH
				} else if (this.$auth.user.id === item.usuario_id) {
					return listaEdicao.some((o) => {
						return o === item.etapa_id
					})
				}
			},

			verDetalhesSS(dados) {
				this.card_id = dados.id
				this.mostrarDialogDetalhesCard = true
			},

			cancelar() {
				this.card_id = null
				this.mostrarDialogCriarCard = false
			},

			async buscarCards() {
				this.carregandoTabela = true
				let usuario_id = this.$auth.user.id
				let filtros = [...this.filtros]

        let etapa_id = this.etapa_id
        if (etapa_id !== 0) {
          filtros.push(` AND etapa.id = ${etapa_id}`)
        } else {
          if (filtros.length === 0) {
            filtros.push(" AND Etapa.id NOT IN ('21','24','25')")
          }
        }

				let confidencial
				let listaPermissoes = [
					"aprovar_card_site_manager",
					"aprovar_card_controle",
					"rh_contratacoes",
				]
				if (listaPermissoes.some((o) => this.$auth.user.permissoes.includes(o))) {
					confidencial = "todos"
					filtros.push(
						` AND (card.confidencial IS NULL OR card.confidencial = false OR card.confidencial = true)`,
					)
				} else {
					confidencial = "setor"
					filtros.push(
						` AND (card.confidencial IS NULL OR card.confidencial = false OR ( card.confidencial = true AND usuario.id = ${usuario_id}))`,
					)
				}

				let filtrosFinais

				if (filtros !== "") {
					filtrosFinais = filtros.join("")
				}

				let resp = await this.$axios.$get("/contratacao/card/buscarPaginados", {
					params: {
						page: this.pagina - 1,
						size: this.itensPorPagina,
						filtros: filtrosFinais,
						usuario_id,
					},
				})

				if (!resp.falha) {
					let cards = resp.dados.cards

					this.carregandoTabela = false
					this.totalItens = resp.dados.totalItens
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

			editarCard(item) {
				this.card_id = item.id
				this.mostrarDialogCriarCard = true
			},

			cardEditado(dados) {
				let idx = this.dados.findIndex((o) => o.id === dados.card_id)

				this.dados[idx] = Object.assign(this.dados[idx], dados.card)
				this.dados[idx]["Comentarios.descricao"] = dados.comentario

				this.mostrarDialogCriarCard = false
				this.mostrarAlerta = true
				this.textoAlerta = "Card editado com sucesso!"
				this.card_id = null
			},

			cardCadastrado() {
				this.mostrarDialogCriarCard = false
				this.mostrarAlerta = true
				this.textoAlerta = "Card cadastrado com sucesso!"
				this.card_id = null
			},

			cardDeletado(card_id) {
				let idx = this.dados.findIndex((o) => o.id === card_id)

				if (idx >= 0) {
					this.mostrarDialogCriarCard = false
					this.mostrarAlerta = true
					this.textoAlerta = "Card deletado com sucesso!"
					this.card_id = null
					this.dados.splice(idx, 1)
				}
			},

			async processado(dados) {
				let { cards, etapa_id } = dados

				this.mostrarDialogProcessarCard = false
				for (let card of cards) {
					let index = this.dados.findIndex((obj) => {
						return obj.id === card
					})

					this.dados.splice(index, 1)
					this.totalItens -= 1
				}
				this.mostrarAlerta = true
				this.textoAlerta = "Cards processados com sucesso!"
				this.selecionados = []
				this.limparSelecionar += 1
			},

			async concluido(cards) {
				this.mostrarDialogProcessarCard = false
				for (let card of cards) {
					let index = this.dados.findIndex((obj) => {
						return obj.id === card
					})

					this.dados.splice(index, 1)
					this.totalItens -= 1
				}
				this.mostrarAlerta = true
				this.textoAlerta = "Cards finalizados com sucesso!"
				this.selecionados = []
				this.limparSelecionar += 1
			},

			async rejeitado(cards) {
				this.mostrarDialogProcessarCard = false
				for (let card of cards) {
					let index = this.dados.findIndex((obj) => {
						return obj.id === card
					})

					this.dados.splice(index, 1)
					this.totalItens -= 1
				}
				this.mostrarAlerta = true
				this.textoAlerta = "Cards rejeitados com sucesso!"
				this.selecionados = []
				this.limparSelecionar += 1
			},

			async standby(cards) {
				this.mostrarDialogProcessarCard = false
				for (let card of cards) {
					let index = this.dados.findIndex((obj) => {
						return obj.id === card
					})

					this.dados.splice(index, 1)
					this.totalItens -= 1
				}
				this.mostrarAlerta = true
				this.textoAlerta = "Cards movidos para Standby com sucesso!"
				this.selecionados = []
				this.limparSelecionar += 1
			},

			async retornouStandby(cards) {
				this.mostrarDialogProcessarCard = false
				for (let card of cards) {
					let index = this.dados.findIndex((obj) => {
						return obj.id === card
					})

					this.dados.splice(index, 1)
					this.totalItens -= 1
				}
				this.mostrarAlerta = true
				this.textoAlerta = "Cards retornados e movidos com sucesso!"
				this.selecionados = []
				this.limparSelecionar += 1
			},

			async alterouCandidato(cards) {
				this.mostrarDialogProcessarCard = false
				this.textoAlerta = "Alteração de candidato realizado com sucesso!"
				this.mostrarAlerta = true

				for (let card of cards) {
					let idx = this.dados.findIndex((o) => o.id === card)

					if (idx >= 0) {
						this.dados.splice(idx, 1)
					}
				}
			},

      async funcaoEditada(cards){
        this.mostrarDialogEditarFuncao = false
        this.textoAlerta = "Alteração de função realizado com sucesso!"
        this.mostrarAlerta = true

        for (let card of cards) {
          let idx = this.dados.findIndex((o) => o.id === card)

          if (idx >= 0) {
            this.dados.splice(idx, 1)
          }
        }
      },

			async filtrarAvancado(filtros) {
				this.mostrarDialogFiltroAvancado = false
				this.filtros = { ...this.filtros, ...filtros }
				let itensPorPagina = this.itensPorPagina
				let pagina = this.pagina

				await this.atualizarDados(itensPorPagina, pagina, filtros)
			},

			async limparFiltroAvancado() {
				this.mostrarDialogFiltroAvancado = false
				let keys = Object.keys(this.filtros)
				for (let i in keys) {
					if (
						keys[i] === "mobilizacao" ||
						keys[i] === "$cardTemEquipamentoCard.equipamento_card_id$"
					) {
						delete this.filtros[keys[i]]
					}
				}

				let filtros = this.filtros
				let itensPorPagina = this.itensPorPagina
				let pagina = this.pagina

				await this.atualizarDados(itensPorPagina, pagina, filtros)
			},

			async gerarExcel() {
        if (this.dados) {
					this.gerandoExcel = true
					let dados = this.dados

					let cabecalho = [
						"Código",
						"Etapa",
						"Ultíma movimentação",
						"Situação",
						"Setor",
						"Disciplina",
						"Nome",
						"CPF",
						"Função",
						"Telefone",
						"Email",
						"Data de criação",
						"Data de Necessidade",
						"Previsão de Entrega",
						"Tipo recrutamente",
						"Responsável",
						"Treinamentos",
						"PEP",
						"Mobilização",
						"Criado por",
						"Turno",
						"Último Comentário",
					]
					let nomeArquivo

					nomeArquivo = "cards"

					let itens = []
					for (let item of dados) {
						let temp = []
						temp.push(("000000" + item.id).slice(-6))
						temp.push(item["Etapa.nome"] ? item["Etapa.nome"] : "")
						temp.push(this.$dayjs(item.ultima_data).format("DD/MM/YYYY"))
						temp.push(
							this.$dayjs().diff(item.ultima_data, "day") <= item["Etapa.leadtime"]
								? "No prazo"
								: "Atrasado",
						)
						temp.push(item["Setor.nome"] ? item["Setor.nome"] : "")
						temp.push(
							item["DisciplinaCard.sigla"]
								? `${item["DisciplinaCard.sigla"]} - ${item["DisciplinaCard.descricao"]}`
								: "",
						)
						temp.push(item["Indicacao.nome"] ? item["Indicacao.nome"] : "")
						temp.push(item["Indicacao.cpf"] ? item["Indicacao.cpf"].replace(/[^\w\s]/gi, "") : "")
						temp.push(item["FuncaoCard.nome"] ? item["FuncaoCard.nome"].trim() : "")
						temp.push(item["Indicacao.telefone"] ? item["Indicacao.telefone"] : "")
						temp.push(item["Indicacao.email"] ? item["Indicacao.email"] : "")
						temp.push(this.$dayjs(item.created_at).format("DD/MM/YYYY"))
						temp.push(this.$dayjs(item.data_necessidade).format("DD/MM/YYYY"))
						temp.push(
							item.data_previsao
								? this.$dayjs(item.data_previsao).add(30, "day").format("DD/MM/YYYY")
								: "",
						)
						temp.push(item.tipo_recrutamento)
						temp.push(item["Responsavel.nome"] ? item["Responsavel.nome"] : "")
						temp.push(item.treinamentos !== null ? item.treinamentos.join("; ") : "")
						temp.push(
							item["CentroCustoPEP.numero_pep"] || item["CentroCustoPEP.descricao"]
								? `${item["CentroCustoPEP.numero_pep"]} - ${item["CentroCustoPEP.descricao"]}`
								: "",
						)
						temp.push(item.mobilizacao)
						temp.push(item["Usuario.nome"] ? item["Usuario.nome"] : "")
						temp.push(item.turno ? item.turno : "")
						item["Comentarios.descricao"] ? temp.push(item["Comentarios.descricao"]) : temp.push("")
						itens.push(temp)
					}

					gerarExcel(cabecalho, itens, nomeArquivo)
					this.gerandoExcel = false
				}
			},

			async gerarExcelEtapa() {
				let resp = await this.$axios.$get("/contratacao/cards/relatorio_tempo_etapa")

				if (!resp.falha) {
					let cards = resp.dados.cards
					let etapas = resp.dados.etapas

					let cabecalho = ["Card"]

					cabecalho.push(...Object.values(etapas))
					let nomeArquivo

					nomeArquivo = "cards"

					let itens = []
					for (let item of cards) {
						let temp = []
						temp.push(("000000" + item.id).slice(-6))
						for (let etapa of Object.keys(etapas)) {
							if (item.etapas[etapa]) {
								temp.push((parseFloat(item.etapas[etapa]) / 24).toFixed(2))
							} else if (item.etapas[etapa] === 0) {
								temp.push("0.04")
							} else {
								temp.push("")
							}
						}
						itens.push(temp)
					}

					gerarExcel(cabecalho, itens, nomeArquivo)
					this.gerandoExcel = false
				}
			},
		},
		watch: {
			async etapa_id() {
				this.pagina = 1

				await this.buscarCards()
			},
		},
	}
</script>

<style scoped>
	.menuEtapas::-webkit-scrollbar {
		width: 12px;
	}

	.menuEtapas::-webkit-scrollbar-track {
		background-color: #898989;
	}

	.menuEtapas::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background-color: #0b1b36;
		border: 1px solid white;
	}
</style>
