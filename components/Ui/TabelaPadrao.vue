<template>
	<div class="flex flex-col w-full relative">
		<div
			v-if="overlay"
			class="absolute top-0 left-0 w-full h-full"
			:class="{ [corOverlay]: corOverlay }"
			style="z-index: 101">
			<slot name="overlay"></slot>
		</div>
		<div
			:class="`tabela-container-${this.id}`"
			class="tabela-container"
			:style="'height:' + altura"
			style="overflow-y: auto; overflow-x: auto; max-width: 100%">
			<table
				class="table table-auto"
				style="width: 100%">
				<colgroup>
					<col
						v-for="cab in cabecalhoLocal"
						:key="cab.valor"
						:class="{ [cab.tamanho]: cab.tamanho }" />
				</colgroup>
				<thead>
					<tr class="">
						<th
							v-for="cab in cabecalhoLocal"
							:key="cab.valor"
							:class="{
								[cab.largura]: cab.largura,
								['coluna-fixa-head' + ` left-[${cab.posicao}]`]: cab.fixa,
							}"
							class="uppercase px-3 py-1 text-sm text-white relative">
							<template v-if="cab.valor === 'selecione'">
								<div class="flex items-center">
									<AppFormCheckbox
										id="checkTabelaSelecionandoTodos"
										:valor="true"
										v-model="selecionandoTodos"
										@click="selecionarTodosDados" />
								</div>
							</template>
							<slot
								:name="'header.' + cab.valor"
								v-bind:item="cab">
								<div class="grid">
									<div class="flex justify-between items-center">
										<span class="whitespace-nowrap">{{ cab.nome }}</span>
										<div class="space-x-1 items-center flex ml-1">
											<button
												v-if="cab.ordenar === true"
												@click="ordenar(cab.valor)">
												<svg
													v-if="colunaOrdenada !== cab.valor || tipoOrdenacao !== 'DESC'"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													class="w-5 h-5 hover:fill-blue-600 cursor-pointer"
													:class="{
														'fill-blue-400':
															tipoOrdenacao === 'ASC' && colunaOrdenada === cab.valor,
													}">
													<path
														fill-rule="evenodd"
														d="M12 2.25a.75.75 0 01.75.75v16.19l6.22-6.22a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06l6.22 6.22V3a.75.75 0 01.75-.75z"
														clip-rule="evenodd" />
												</svg>
												<svg
													v-if="tipoOrdenacao === 'DESC' && colunaOrdenada === cab.valor"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													class="w-5 h-5 hover:fill-blue-600 cursor-pointer"
													:class="{
														'fill-blue-400':
															tipoOrdenacao === 'DESC' && colunaOrdenada === cab.valor,
													}">
													<path
														fill-rule="evenodd"
														d="M12 20.25a.75.75 0 01-.75-.75V6.31l-5.47 5.47a.75.75 0 01-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l6.75 6.75a.75.75 0 11-1.06 1.06l-5.47-5.47V19.5a.75.75 0 01-.75.75z"
														clip-rule="evenodd" />
												</svg>
											</button>
											<!--                    @click="-->
											<!--                    filtroAberto !== cab.valor-->
											<!--                    ? (filtroAberto = cab.valor)-->
											<!--                    : (filtroAberto = null)-->
											<!--                    "-->
											<button
												:ref="'icone-filtro-' + cab.valor + '-tabela-' + id"
												:id="'filtro-' + cab.valor + '-tabela-' + id"
												v-if="cab.filtro === true"
												@click="abrirFiltro(cab.valor, $event)"
												:class="{
													'text-blue-400': filtrosAtivos.includes(cab.valor),
												}">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													class="w-5 h-5 hover:fill-blue-400">
													<path
														fill-rule="evenodd"
														d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z"
														clip-rule="evenodd" />
												</svg>
											</button>
										</div>
									</div>
								</div>
								<FiltroMultiSelecao
									:ref="'filtro-' + cab.valor + '-tabela-' + id"
									@filtrarMult="filtrarMult"
									@limparFiltrarMult="limparFiltrarMult"
									v-if="filtroAberto === cab.valor && cab.opcoes && cab.tipoFiltro !== 'data'"
									:cabecalhoNome="cab.nome"
									:cabecalhoValor="cab.valor"
									:mostrar-vazio="cab.mostrarVazio"
									:cabecalhoOpcoes="cab.opcoes" />
								<div
									style="top: 34px"
									:ref="'filtro-' + cab.valor + '-tabela-' + id"
									v-if="filtroAberto === cab.valor && !cab.opcoes && cab.tipoFiltro !== 'data'"
									class="absolute text-start px-2 py-1 rounded-sm shadow-lg bg-white min-w-[300px] border border-gray-200">
									<div
										class="absolute"
										style="
											width: 0;
											height: 0;
											border-left: 10px solid transparent;
											border-right: 10px solid transparent;
											margin-top: -14px;
											border-bottom: 10px solid white;
										"></div>
									<div class="flex items-end">
										<AppFormInput
											:id="'filtro' + cab.nome"
											class="w-full"
											type="text"
											:label="'Buscar por ' + cab.nome"
											:value="valorFiltro(cab.valor)"
											placeholder="Pressione ENTER para buscar"
											@keyup.enter.prevent.stop="
												adicionarFiltro(cab.valor, $event, cab, cab.tipoFiltro)
											" />
									</div>
									<div class="w-full mt-1">
										<button
											@click.prevent.stop="removerFiltro(cab.valor)"
											class="bg-primaria-500 w-full py-1 hover:bg-primaria-700">
											Limpar Filtro
										</button>
									</div>
								</div>

								<!--                FILTRO POR DATA-->
								<div
									style="top: 34px"
									v-if="filtroAberto === cab.valor && cab.tipoFiltro === 'data'"
									class="absolute text-start px-2 py-1 rounded-sm shadow-lg bg-white min-w-[300px] border border-gray-200 text-black">
									<div class="flex flex-col gap-y-2">
										<span>Filtrar por data - {{ cab.nome }}</span>
										<AppFormInput
											:id="'filtroDataInicial' + cab.nome"
											class="w-full"
											type="date"
											label="Data inicial"
											v-model="dataFiltros.dataInicial" />
										<AppFormInput
											:id="'filtroDataFinal' + cab.nome"
											class="w-full"
											type="date"
											label="Data final"
											v-model="dataFiltros.dataFinal" />
										<div class="flex justify-between">
											<BotaoPadrao
												texto="Limpar"
												@clique="limparFiltroData(cab.valor)"></BotaoPadrao>
											<BotaoPadrao
												:disabled="desativarBtnSalvarData"
												texto="Filtrar"
												cor="bg-primaria-500 text-white hover:bg-primaria-700"
												@clique="filtrarData(cab.valor)"></BotaoPadrao>
										</div>
									</div>
								</div>
							</slot>
						</th>
					</tr>
				</thead>
				<tbody
					class="pt-10 overflow-auto !h-2 fonteTabela"
					:style="'height:' + altura">
					<tr v-if="carregando">
						<td :colspan="cabecalhoLocal.length">
							<div class="text-center bg-gray-400 text-3xl py-2">
								<span>
									<strong>CARREGANDO DADOS...</strong>
								</span>
							</div>
						</td>
					</tr>
					<tr v-if="dados.length === 0 && !carregando">
						<td :colspan="cabecalhoLocal.length">
							<div class="text-center bg-gray-300 text-3xl py-2 text-gray-500">
								<span>
									<strong>SEM DADOS ENCONTRADOS!</strong>
								</span>
							</div>
						</td>
					</tr>
					<!--        <template>-->
					<!--          <div class="flex justify-center">-->
					<!--            <AppFormCheckbox-->
					<!--              :id="parseInt(item.id)"-->
					<!--              :valor="item"-->
					<!--              v-model="selecionados"/>-->
					<!--          </div>-->
					<!--        </template>-->
					<template
						v-for="(dado, idx) in dadosPrMostrar"
						v-if="!carregando">
						<tr
							:class="{
								[classPersonalizada]: dado.ativo && dado.ativo === true,
								'!bg-gray-500 !text-white': trAberto === dado.id,
							}"
							class="bg-white cursor-pointer even:bg-neutral-200 hover:bg-gray-600 hover:text-white h-7 whitespace-nowrap"
							:key="dado.id"
							@dblclick.prevent.stop="mostrarDbl(dado, $event)"
							@click="mostrarDetalhes(dado, $event)">
							<td
								v-for="(c, index) in cabecalhoLocal"
								:key="index"
								class="px-3 py-0.5 border border-collapse border-gray-600"
								:class="{
									'text-center': c.centralizar,
									['coluna-fixa-body w-[100px] l-[100px]']: c.fixa,
								}">
								<template v-if="c.valor !== 'selecione'">
									<slot
										:name="'body.' + c.valor"
										v-bind:item="dado"
										v-bind:index="idx">
										<span class="whitespace-nowrap">{{ dado[c.valor] }}</span>
									</slot>
								</template>
								<template v-if="c.valor === 'selecione'">
									<slot
										:name="'body.selecione'"
										v-bind:item="dado">
										<div
											class="flex justify-center"
											v-if="c.valor === 'selecione'">
											<AppFormCheckbox
												:id="'checkTabela' + parseInt(dado.id)"
												:disabled="dado.ativo"
												:valor="dado"
												v-model="selecionados" />
										</div>
									</slot>
								</template>
							</td>
						</tr>

						<td
							:colspan="cabecalhoLocal.length"
							:id="`detalhes-${dado.id}`"
							v-if="trAberto === dado.id && temDetalhes"
							class="bg-blue-200 px-2 py-1 border border-gray-600">
							<slot
								name="detalhes"
								v-bind:item="dado"></slot>
						</td>
					</template>
				</tbody>
			</table>
		</div>
		<div
			class="p-1 border h-16 border-gray-600 flex justify-between items-center bg-white"
			v-if="temRodape">
			<slot name="rodape" />
			<div class="w-full flex justify-center space-x-1 items-center">
				<div>
					<button
						class="bg-slate-400 w-10 h-10 rounded hover:bg-slate-600"
						@click.prevent.stop="anteriorPagina()">
						&lt;
					</button>
				</div>
				<div
					v-for="num of btnsPaginacao"
					:key="num">
					<button
						:class="{ '!bg-blue-500': num === localPagina }"
						class="bg-slate-400 w-10 h-10 rounded hover:bg-blue-600"
						@click.prevent.stop="escolherPagina(num)">
						{{ num }}
					</button>
				</div>
				<div>
					<button
						class="bg-slate-400 w-10 h-10 rounded hover:bg-blue-600"
						@click.prevent.stop="proximaPagina()">
						&gt;
					</button>
				</div>
			</div>

			<div class="flex items-center w-1/4">
				<div>
					<span class="whitespace-nowrap mr-3 text-lg">
						<strong>Total: {{ totalItens }}</strong>
					</span>
				</div>
				<AppFormInput
					label="Itens por Página"
					type="number"
					placeholder="50"
					v-model="localItensPorPagina"
					id="totalItensPagina"
					@keyup.enter="atualizarDados()" />
			</div>
		</div>
	</div>
</template>

<script>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import TableFiltroSimples from "~/components/Ui/TableFiltroSimples.vue"
	import AppTag from "~/components/Ui/AppTag.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"

	import { prepararFiltro } from "~/mixins/prepararFiltro"
	import FiltroMultiSelecao from "~/components/Ui/Tabela/FiltroMultiSelecao.vue"

	export default {
		mixins: [prepararFiltro],
		name: "Tabela",
		props: {
			id: {
				type: String,
				required: true,
			},
			cabecalho: {
				type: Array,
				default: () => [],
				required: true,
			},
			dados: {
				type: Array,
				default: () => [],
				required: true,
			},
			selecionar: {
				type: [Boolean],
				default: false,
			},
			altura: {
				type: String,
				default: "calc(100vh - 180px)",
			},
			itensPorPagina: {
				type: Number,
			},
			pagina: {
				type: Number,
			},
			totalItens: {
				type: Number,
			},
			temDetalhes: {
				type: Boolean,
				default: false,
			},
			carregando: {
				type: Boolean,
				default: false,
			},
			dadosSql: {
				type: Boolean,
				default: false,
			},
			dadosRedis: {
				type: Boolean,
				default: false,
			},
			temRodape: {
				type: Boolean,
				default: true,
			},
			classPersonalizada: {
				type: [String, Boolean],
			},
			corOverlay: {
				type: [String],
			},
			overlay: {
				type: [Boolean],
			},
			limparSelecionar: {
				type: [Boolean, Number, String],
				// default: true,
			},
		},
		components: {
			FiltroMultiSelecao,
			AppFormCheckbox,
			BotaoPadrao,
			AppFormInput,
			TableFiltroSimples,
			AppTag,
		},
		data() {
			return {
				filtros: [],
				filtroAberto: null,
				localItensPorPagina: this.itensPorPagina,
				localPagina: this.pagina,
				trAberto: null,
				multSelecionados: [],
				dataFiltros: {
					dataInicial: null,
					dataFinal: null,
				},
				checkSelecionarTodos: false,
				textoParaFiltro: null,
				filtrosAtivos: [],
				ordem: null,
				colunaOrdenada: null,
				tipoOrdenacao: null,
				selecionados: [],
				selecionandoTodos: false,
				dadosPrMostrar: [],
				indexFim: 50,
			}
		},
		computed: {
			cabecalhoLocal() {
				let cabecalho = new Array(...this.cabecalho)

				if (this.selecionar)
					cabecalho.unshift({ nome: "", valor: "selecione", centralizar: true, largura: "w-10" })

				return cabecalho
			},

			totalPaginas() {
				return Math.ceil(this.totalItens / this.itensPorPagina)
			},

			btnsPaginacao() {
				let btns = []
				let pagina = this.localPagina

				let posicao = -2
				let totalNumBtn = 5
				let cont = 0

				while (cont < totalNumBtn) {
					let btn = pagina + posicao

					if (btn > 0 && btn <= this.totalPaginas) {
						btns.push(btn)
					}

					posicao++
					cont++
				}
				return btns
			},
			desativarBtnSalvarData() {
				let { dataInicial, dataFinal } = this.dataFiltros

				return dataInicial === null || dataInicial === "" || dataFinal === null || dataFinal === ""
			},
		},
		mounted() {
			this.renderizarDados()

			let container = document.querySelector(`.tabela-container-${this.id}`)
			container.addEventListener("scroll", this.rolando)

			document.addEventListener("click", this.verificarCliqueFora)
		},
		destroyed() {
			document.removeEventListener("click", this.verificarCliqueFora)
		},
		methods: {
			verificarCliqueFora(event) {
				let icone = "icone-filtro-" + this.filtroAberto + "-tabela-" + this.id
				let filtro = "filtro-" + this.filtroAberto + "-tabela-" + this.id

				if (filtro) {
					const componente = this.$refs[filtro]
					const componenteIcon = this.$refs[icone]

					if (componente) {
						let clicouDentro
						if (componente[0].$el !== undefined) {
							clicouDentro =
								(componente && componente[0].$el.contains(event.target)) ||
								(componenteIcon && componenteIcon[0].contains(event.target))
						} else {
							clicouDentro =
								(componente && componente[0].contains(event.target)) ||
								(componenteIcon && componenteIcon[0].contains(event.target))
						}

						if (!clicouDentro) {
							this.filtroAberto = null
						}
					}
				}
			},
			abrirFiltro(valor) {
				this.filtroAberto !== valor ? (this.filtroAberto = valor) : (this.filtroAberto = null)
			},
			rolando() {
				const listElm = document.querySelector(`.tabela-container-${this.id}`)

				if (Math.ceil(listElm.scrollTop + listElm.clientHeight + 5) >= listElm.scrollHeight) {
					this.carregarMais()
				}
			},

			carregarMais() {
				if (this.dados.length > this.indexFim) {
					this.indexFim += 50
					this.dadosPrMostrar = [...this.dados].splice(0, this.indexFim)
				}
			},
			valorFiltro(valor) {
				if (this.dadosSql) {
					return ""
				} else if (this.dadosRedis) {
					return this.filtros[valor]
				} else {
					return this.filtros[valor.includes(".") ? `$${valor}$` : valor]
				}
			},

			anteriorPagina() {
				if (this.localPagina - 1 >= 1) {
					this.localPagina -= 1
					this.atualizarDados()
				}
			},

			proximaPagina() {
				if (this.localPagina + 1 <= this.totalPaginas) {
					this.localPagina += 1
					this.atualizarDados()
				}
			},

			escolherPagina(num) {
				this.localPagina = num
				this.atualizarDados()
			},

			atualizarDados() {
				this.localItensPorPagina = parseInt(this.localItensPorPagina)
				let itensPorPagina = parseInt(this.localItensPorPagina)
				let pagina
				let ordem = this.ordem

				if (this.itensPorPagina !== this.localItensPorPagina) {
					this.localPagina = 1
				}
				pagina = this.localPagina

				let filtros
				if (this.dadosSql) {
					filtros = this.filtros
				} else if (this.dadosRedis) {
					filtros = {}
					for (let key of Object.keys(this.filtros)) {
						filtros[key] = this.filtros[key]
					}
				} else {
					let filtrosPrPreparar = this.filtros

					filtros = this.prepararFiltro(filtrosPrPreparar)
				}

				this.indexFim = 50
				this.$emit("itensPorPagina", itensPorPagina)
				this.$emit("pagina", pagina)
				this.$emit("filtros", filtros)
				this.$emit("ordem", ordem)
				this.$emit("atualizar")
			},

			mostrarDetalhes(item, event) {
				if (this.trAberto === item.id) {
					this.trAberto = null
				} else {
					this.trAberto = item.id
				}
			},

			mostrarDbl(item, event) {
				this.$emit("dblclick", item)
			},

			adicionarFiltro(item, event, coluna, tipoFiltro) {
				let valor = event.target.value

				if (!this.filtrosAtivos.includes(item) && valor !== null && valor !== "") {
					this.filtrosAtivos.push(item)
				}

				let colunaTabela = coluna.colunaTabela ? coluna.colunaTabela : coluna.valor
				if (this.dadosSql) {
					if (
						this.filtros.some(
							(o) => o.includes(`LOWER(${colunaTabela})`) || o.includes(colunaTabela),
						)
					) {
						let idx = this.filtros.findIndex((o) => o.includes(`LOWER(${item})`))
						this.filtros.splice(idx, 1)
					}

					if (valor === null || valor === "") {
						let idx = this.filtros.findIndex((o) => o.includes(item))

						this.filtros.splice(idx, 1)
						this.filtrosAtivos.splice(idx, 1)
					} else {
						let filtro

						if (colunaTabela !== null && colunaTabela !== "" && colunaTabela !== undefined) {
							if (tipoFiltro === "inteiro") filtro = `AND ${colunaTabela} = ${valor}`
							else
								filtro = `AND LOWER(${colunaTabela}) LIKE LOWER('%${valor.replace(
									/[^a-zA-Z0-9\s]/g,
									"",
								)}%')`
						} else {
							filtro = `AND LOWER(${item}) LIKE LOWER('%${valor.replace(/[^a-zA-Z0-9\s]/g, "")}%')`
						}
						this.filtros.push(filtro)
					}
				} else if (this.dadosRedis) {
					if (item.includes(".")) {
						let [tabela, valor] = item.split(".")
						this.filtros = Object.assign(this.filtros, {
							[tabela]: { [valor]: event.target.value },
						})
					} else {
						this.filtros[item] = event.target.value
					}
				} else {
					if (item.includes(".")) item = `$${item}$`
					let idxFiltroEncontrado = this.filtros.findIndex((o) =>
						Object.keys(o).some((o) => o === item),
					)

					if (idxFiltroEncontrado >= 0) {
						this.filtros.splice(idxFiltroEncontrado, 1)
					}

					if (valor !== null && valor !== "") {
						this.filtros.push({ [item]: valor })
					} else {
						let idxAtivosEncontrado = this.filtrosAtivos.findIndex((o) => o === item)
						this.filtrosAtivos.splice(idxAtivosEncontrado, 1)
					}
				}
				this.localPagina = 1
				this.filtroAberto = null
				this.atualizarDados()
			},

			removerFiltro(item) {
				if (this.dadosSql) {
					let idx = this.filtros.findIndex((o) => o.includes(item))
					this.filtrosAtivos.splice(idx, 1)
					this.filtros.splice(idx, 1)
				} else if (this.dadosRedis) {
					if (this.filtrosAtivos.includes(item)) {
						let idx = this.filtrosAtivos.findIndex((o) => o === item)
						this.filtrosAtivos.splice(idx, 1)
					}
					let key = item
					if (item.includes(".")) {
						;[key] = item.split(".")
					}

					if (key) {
						delete this.filtros[key]
					}
				} else {
					if (this.filtrosAtivos.includes(item)) {
						let idx = this.filtrosAtivos.findIndex((o) => o === item)
						this.filtrosAtivos.splice(idx, 1)
					}

					if (item.includes(".")) item = `$${item}$`

					let idx = this.filtros.findIndex((o) => Object.keys(o).some((o) => o === item))

					if (idx >= 0) {
						this.filtros.splice(idx, 1)
					}
				}

				this.localPagina = 1
				this.filtroAberto = null
				this.atualizarDados()
			},

			selecionarTodos(opcoes, mostrarVazio) {
				if (!this.checkSelecionarTodos) {
					if (Object.keys(opcoes[0]).includes("id")) {
						this.multSelecionados = opcoes.map((o) => o.id)
						if (mostrarVazio) this.multSelecionados.unshift(null)
					} else {
						this.multSelecionados = opcoes
						if (mostrarVazio) this.multSelecionados.unshift(null)
					}
				} else {
					this.multSelecionados = []
				}
			},

			filtrarMult({ valor, multSelecionados }) {
				this.localPagina = 1
				this.filtroAberto = null

				if (this.dadosSql) {
					if (multSelecionados.length === 0) {
						let idx = this.filtros.findIndex((o) => o.includes(valor))
						this.filtros.splice(idx, 1)
						if (this.filtrosAtivos.includes(valor)) {
							let idx = this.filtrosAtivos.findIndex((o) => o === valor)
							this.filtrosAtivos.splice(idx, 1)
						}
					} else {
						let idx = this.filtros.findIndex((o) => o.includes(valor))
						if (idx >= 0) {
							this.filtros.splice(idx, 1)
						}

						let filtro = ` AND ${valor} IN (${multSelecionados.map((o) => "'" + o + "'")})`

						this.filtros.push(filtro)
					}
				} else if (this.dadosRedis) {
					if (multSelecionados.length === 0) {
						if (this.filtrosAtivos.includes(valor)) {
							let idx = this.filtrosAtivos.findIndex((o) => o === valor)
							this.filtrosAtivos.splice(idx, 1)
						}

						if (valor.includes(".")) {
							let [tabela] = valor.split(".")
							delete this.filtros[tabela]
						} else {
							delete this.filtros[valor]
						}
					} else {
						if (valor.includes(".")) {
							let [tabela, atributo] = valor.split(".")
							this.filtros[tabela] = { [atributo]: multSelecionados }
						} else {
							this.filtros[valor] = multSelecionados
						}
					}
				} else {
					if (multSelecionados.length === 0) {
						let idx = this.filtros.findIndex((o) =>
							Object.keys(o).some((o) => o === "$" + valor + "$"),
						)
						this.filtros.splice(idx, 1)
						if (this.filtrosAtivos.includes(valor)) {
							let idx = this.filtrosAtivos.findIndex((o) => o === valor)
							this.filtrosAtivos.splice(idx, 1)
						}
					} else {
						let idx = this.filtros.findIndex((o) => {
							return Object.keys(o).includes(`$${valor}$`)
						})

						if (idx >= 0) {
							this.filtros.splice(idx, 1)
						}

						let filtro = { ["$" + valor + "$"]: { $or: [...multSelecionados] } }
						this.filtros.push(filtro)
					}
				}

				this.localPagina = 1
				this.filtrosAtivos.push(valor)
				this.filtroAberto = null
				this.atualizarDados()
			},

			limparFiltrarMult({ valor }) {
				this.localPagina = 1
				this.filtroAberto = null
				this.multSelecionados = []

				if (this.filtrosAtivos.includes(valor)) {
					let idx = this.filtrosAtivos.findIndex((o) => o === valor)
					this.filtrosAtivos.splice(idx, 1)
				}

				if (this.dadosSql) {
					let idx = this.filtros.findIndex((o) => o.includes(valor))
					this.filtros.splice(idx, 1)
				} else if (this.dadosRedis) {
					if (valor.includes(".")) {
						let [tabela] = valor.split(".")
						delete this.filtros[tabela]
					} else {
						delete this.filtros[valor]
					}
				} else {
					let idx = this.filtros.findIndex((o) => {
						return Object.keys(o).some((o) => o === "$" + valor + "$")
					})
					this.filtros.splice(idx, 1)
				}

				this.atualizarDados()
			},

			filtrarData(item) {
				if (!this.filtrosAtivos.includes(item)) {
					this.filtrosAtivos.push(item)
				}
				let { dataInicial, dataFinal } = this.dataFiltros

				if (this.dadosRedis) {
					this.filtros[item] = { tipoFiltro: "data", valores: [dataInicial, dataFinal] }
				} else {
					if (item.includes(".")) item = `$${item}$`
					let filtro = { [item]: { $bet: [dataInicial, dataFinal] } }
					this.filtros.push(filtro)
				}

				this.dataFiltros = { dataInicial: null, dataFinal: null }

				this.localPagina = 1
				this.filtroAberto = null
				this.atualizarDados()
			},

			limparFiltroData(item) {
				if (this.filtrosAtivos.includes(item)) {
					let idx = this.filtrosAtivos.findIndex((o) => o === item)
					this.filtrosAtivos.splice(idx, 1)
				}

				if (this.dadosRedis) {
          delete this.filtros[item]
				} else {
					if (item.includes(".")) item = `$${item}$`

					let idx = this.filtros.findIndex((o) => Object.keys(o).some((o) => o === item))

					if (idx >= 0) {
						this.filtros.splice(idx, 1)

					}
				}
        this.dataFiltros = { dataInicial: null, dataFinal: null }
        this.localPagina = 1
        this.filtroAberto = null
        this.atualizarDados()
			},

			opcoesFiltradas(opcoes) {
				let itensFiltrados = opcoes

				if (this.textoParaFiltro !== null && this.textoParaFiltro !== "") {
					if (Object.keys(opcoes[0]).includes("id")) {
						itensFiltrados = opcoes.filter((o) =>
							o.texto.toLowerCase().includes(this.textoParaFiltro.toLowerCase()),
						)
					} else {
						itensFiltrados = opcoes.filter((o) =>
							o.toLowerCase().includes(this.textoParaFiltro.toLowerCase()),
						)
					}
				}

				return itensFiltrados
			},

			ordenar(tituloColuna) {
				if (this.dados.length > 0) {
					if (this.colunaOrdenada !== tituloColuna) {
						this.tipoOrdenacao = null
						this.ordem = null
						this.colunaOrdenada = tituloColuna
					}

					if (this.tipoOrdenacao === null) {
						this.tipoOrdenacao = "ASC"
					} else if (this.tipoOrdenacao === "ASC") {
						this.tipoOrdenacao = "DESC"
					} else if (this.tipoOrdenacao === "DESC") {
						if (this.dadosRedis) {
							this.ordem = {}
						} else {
							this.ordem = null
						}
						this.tipoOrdenacao = null
					}

					if (this.tipoOrdenacao !== null) {
						if (this.dadosSql) {
							this.ordem = tituloColuna
						} else if (this.dadosRedis) {
							this.ordem = { [tituloColuna]: this.tipoOrdenacao }
						} else {
							if (tituloColuna.includes(".")) {
								let tituloDivido = tituloColuna.split(".")
								this.ordem = [tituloDivido[0], tituloDivido[1], this.tipoOrdenacao]
							} else {
								this.ordem = [tituloColuna, this.tipoOrdenacao]
							}
						}
					}
					this.atualizarDados()
				}
			},

			selecionarTodosDados() {
				if (!this.selecionandoTodos) {
					this.selecionados = this.dados.filter((o) => o.ativo !== true)
				} else {
					this.selecionados = []
				}
			},

			renderizarDados() {
				this.dadosPrMostrar = []

				this.indexFim = 50

				if (this.dados.length > 0) {
					this.dadosPrMostrar = [...this.dados].splice(0, this.indexFim)
				}
			},

			limparSelecionados() {
				this.selecionados = []
			},
		},
		watch: {
			pagina(valor) {
				this.localPagina = valor
			},
			selecionados(valor) {
				this.$emit("selecionados", this.selecionados)
			},
			dados() {
				if (this.limparSelecionar === true) {
					this.selecionados = []
				}
				if (this.selecionandoTodos === true) this.selecionandoTodos = false

				this.renderizarDados()
			},
			limparSelecionar(valor) {
				this.selecionados = []
			},
		},
	}
</script>

<style scoped>
	th,
	td {
		border-left: 1px solid rgb(75, 85, 99);
		border-right: 1px solid rgb(75, 85, 99);
	}

	th {
		position: sticky;
		top: 0;
		background-color: rgb(0, 39, 94);
		z-index: 100;
		border-left: 1px solid rgb(75, 85, 99) !important;
		border-right: 1px solid rgb(75, 85, 99);
	}

	/*  tr:hover{
  background-color: rgb(75,85,99) !important;
}*/

	.fonteTabela {
		font-size: 0.8rem;
	}

	.coluna-fixa-head {
		//background-color: red; position: -webkit-sticky !important; position: sticky !important; background-color: #00275e !important;
		left: 0;
		z-index: 60;
	}

	.coluna-fixa-body {
		//background-color: red; position: -webkit-sticky !important; position: sticky !important; background-color: rgb(200, 200, 200); left: 0;
		z-index: 49;
		color: black;
	}

	.coluna-fixa-body:hover {
		//background-color: red; position: -webkit-sticky !important; position: sticky !important; color: white; background-color: rgb(75, 85, 99) !important;
	}
</style>
