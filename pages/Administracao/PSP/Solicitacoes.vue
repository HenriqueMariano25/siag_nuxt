<template>
	<div class="w-full">
		<CabecalhoPagina titulo="SOLICITAÇÕES" />
		<div
			class="flex bg-primaria-500 w-full print:hidden menuEtapas !mt-11"
			style="overflow-x: scroll">
			<button
				class="flex p-2 hover:bg-gray-300 hover:text-black box-border print:hidden text-white min-w-[80px] justify-center"
				:class="{ 'border-t-4 border-black bg-gray-200 !text-black': etapa_psp_id === 0 }"
				@click="etapa_psp_id = 0">
				Todos
			</button>
			<div
				v-for="etapa in etapas"
				:key="etapa.id"
				class="grid grid-flow-col auto-cols-max divide-y-2 divide-amber-50">
				<button
					class="flex py-2 px-3 hover:bg-gray-400 box-border text-white hover:text-black min-w-[100px] justify-center"
					:class="{ 'border-t-4 border-black bg-gray-200 !text-black': etapa_psp_id === etapa.id }"
					@click="etapa_psp_id = etapa.id">
					<span class="whitespace-nowrap">{{ etapa.nome }}</span>
				</button>
			</div>
		</div>
		<div class="print:hidden">
			<TabelaPadrao
				id="pspSolicitacoes"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				@itensPorPagina="itensPorPagina = $event"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 225px)"
				:selecionar="podeProcessar"
				@atualizar="buscarPsps"
				@dblclick="verDetalhesPsp"
				@selecionados="selecionados = $event"
				:limparSelecionar="true"
				:carregando="carregandoTabela">
				<template v-slot:[`body.acao`]="{ item }">
					<div class="min-w-[30px]">
						<BotaoPadrao
							icone
							@clique="editarPsp(item)"
							v-if="item.criado_por.id === $auth.user.id || podeEditarPsp">
							<div class="w-6 h-6">
								<img
									src="@/assets/icons/edit-b.svg"
									alt=""
									class="w-6 h-6" />
							</div>
						</BotaoPadrao>
					</div>
				</template>
				<template v-slot:[`body.Psp.id`]="{ item }">
					<span class="whitespace-nowrap">
						{{ ("00000" + item.id).slice(-5) }}
					</span>
				</template>
				<template v-slot:[`body.EtapaPsp.id`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.EtapaPsp ? item.EtapaPsp.nome : "" }}
					</span>
				</template>
				<template v-slot:[`body.Funcionario.nome`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.Funcionario ? item.Funcionario.nome : "" }}
					</span>
				</template>
				<template v-slot:[`body.Funcionario.cargo`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.Funcionario ? item.Funcionario.cargo : "" }}
					</span>
				</template>
				<template v-slot:[`body.Funcionario.setor.nome`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.Funcionario.setor ? item.Funcionario.setor.nome : "" }}
					</span>
				</template>
				<template v-slot:[`body.data_ida`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.data_ida ? $dayjs(item.data_ida).format("DD/MM/YYYY") : "" }}
					</span>
				</template>
				<template v-slot:[`body.destino`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.destino ? item.destino : "" }}
					</span>
				</template>
				<template v-slot:[`body.criado_por.nome`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.criado_por ? item.criado_por.nome : "" }}
					</span>
				</template>
				<template v-slot:[`body.CentroCustoPEP.descricao`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.CentroCustoPEP ? item.CentroCustoPEP.descricao : "" }}
					</span>
				</template>
				<template v-slot:[`body.PspTemMeioTransporte.meio_transporte`]="{ item }">
					<span class="whitespace-nowrap">
						{{
							item.PspTemMeioTransporte && item.PspTemMeioTransporte.length > 0
								? item.PspTemMeioTransporte[0].meio_transporte
								: item.meio_transporte
						}}
					</span>
					<span>{{
						item.PspTemMeioTransporte &&
						item.PspTemMeioTransporte.length === 0 &&
						item.motivo === "Cotação"
							? "Cotação"
							: ""
					}}</span>
				</template>
				<template v-slot:[`body.historico`]="{ item }">
					<div
						class="bg-blue-200 border border-blue-300 flex gap-2 justify-center items-center py-0.5 text-black hover:bg-blue-300 rounded w-[100px]"
						@click="
							mostrarDialogHistoricoPsp = true
							psp_id = item.id
						">
						<img
							src="@/assets/icons/history-b.svg"
							alt=""
							class="w-6 h-6" />
					</div>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex items-center w-full">
					<div class="flex w-full gap-2 justify-between">
						<div class="flex gap-2">
							<BotaoPadrao
								texto="Gerar Excel"
								@clique="gerarExcel()">
								<img
									src="@/assets/icons/excel-b.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
						<div class="flex gap-2">
							<BotaoPadrao
								texto="criar psp"
								@clique="mostrarDialogCriarPsp = true">
								<img
									src="@/assets/icons/add-b.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
							<BotaoPadrao
								v-if="podeProcessar"
								texto="processar"
								@clique="mostrarDialogProcessarPsp = true">
								<img
									src="@/assets/icons/check-circle-b.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarPsp
			v-if="mostrarDialogCriarPsp"
			@cancelar="
				mostrarDialogCriarPsp = false
				psp_id = null
			"
			:psp_id="psp_id"
			@deletado="deletado"
			@editado="editado"
			@cadastrado="cadastrado" />
		<DialogProcessarPsp
			@rejeitado="rejeitado"
			v-if="mostrarDialogProcessarPsp"
			@cancelar="mostrarDialogProcessarPsp = false"
			@processado="processado"
			:selecionados="selecionados" />
		<DialogDetalhesPsp
			v-if="mostrarDialogDetalhesPsp"
			@cancelar="
				mostrarDialogDetalhesPsp = false
				psp_id = null
			"
			:psp_id="psp_id" />
		<DialogHistoricoPsp
			@cancelar="
				mostrarDialogHistoricoPsp = false
				psp_id = null
			"
			v-if="mostrarDialogHistoricoPsp"
			:psp_id="psp_id" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogEditarPspGerenciamento
			v-if="mostrarDialogEditarPspGerenciamento"
			@cancelar="
				mostrarDialogEditarPspGerenciamento = false
				psp_id = null
			"
			:psp_id="psp_id"
			@editado="solicitanteTrocado" />
	</div>
</template>

<script>
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCriarPsp from "~/components/Dialogs/Administracao/Psp/DialogCriarPsp.vue"
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import DialogProcessarPsp from "~/components/Dialogs/Administracao/Psp/DialogProcessarPsp.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogDetalhesPsp from "~/components/Dialogs/Administracao/Psp/DialogDetalhesPsp.vue"
	import DialogHistoricoPsp from "~/components/Dialogs/Administracao/Psp/DialogHistoricoPsp.vue"
	import gerarExcel from "~/functions/gerarExcel"
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import DialogEditarPspGerenciamento from "~/components/Dialogs/Administracao/Psp/DialogEditarPspGerenciamento.vue"

	export default {
		name: "Psp",
		components: {
			DialogEditarPspGerenciamento,
			CabecalhoPagina,
			DialogHistoricoPsp,
			DialogDetalhesPsp,
			AppAlerta,
			DialogProcessarPsp,
			TabelaPadrao,
			AppFormRadio,
			DialogCriarPsp,
			BotaoPadrao,
			RodapePagina,
		},
		data() {
			return {
				mostrarDialogCriarPsp: false,
				etapas: [],
				etapa_psp_id: 0,
				dados: [],
				filtros: {},
				itensPorPagina: 50,
				pagina: 1,
				card_id: null,
				totalItens: 0,
				selecionados: [],
				carregandoTabela: true,
				mostrarDialogProcessarPsp: false,
				mostrarAlerta: false,
				textoAlerta: null,
				mostrarDialogDetalhesPsp: false,
				psp_id: null,
				mostrarDialogHistoricoPsp: false,
				mostrarDialogEditarPspGerenciamento: false,
			}
		},
		computed: {
			cabecalho() {
				let cabecalho = [
					{
						nome: "Cod.",
						valor: "Psp.id",
						filtro: true,
						centralizar: true,
						ordenar: true,
						tipoFiltro: "inteiro",
					},
					{
						nome: "Etapa",
						valor: "EtapaPsp.id",
						filtro: true,
						mostrarVazio: true,
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
					{ nome: "Funcionário", valor: "Funcionario.nome", filtro: true },
					{ nome: "Cargo", valor: "Funcionario.cargo", filtro: true },
					{ nome: "Setor", valor: "Funcionario.setor.nome", filtro: true },
					{ nome: "Motivo", valor: "motivo", filtro: true },
					{ nome: "Data de ida", valor: "data_ida", filtro: true, tipoFiltro: "data" },
					{ nome: "Destino", valor: "destino", filtro: true },
					{ nome: "Transporte", valor: "PspTemMeioTransporte.meio_transporte", filtro: true },
					{ nome: "Centro Custo", valor: "CentroCustoPEP.descricao", filtro: true },
					{ nome: "Solicitado por", valor: "criado_por.nome", filtro: true },
					{ nome: "Histórico", valor: "historico", filtro: true, largura: "w-[100px]" },
				]

        let permissao = this.$auth.user.permissoes.includes("gerenciamento_psp")

        if(permissao){
          if ((this.etapa_psp_id >= 1 && this.etapa_psp_id <= 7) || this.etapa_psp_id === 10) {
            cabecalho.unshift({ nome: "", valor: "acao", largura: "w-10" })
          }
        }else{
          if ((this.etapa_psp_id >= 1 && this.etapa_psp_id <= 4) || this.etapa_psp_id === 10) {
            cabecalho.unshift({ nome: "", valor: "acao", largura: "w-10" })
          }
        }



				return cabecalho
			},

			podeProcessar() {
				return (
					this.etapa_psp_id >= 5 &&
					this.etapa_psp_id <= 7 &&
					this.$auth.user.permissoes.includes("gerenciamento_psp")
				)
			},

			podeEditarPsp() {
				return this.$auth.user.permissoes.includes("gerenciamento_psp")
			},
		},
		created() {
			this.buscarEtapas()
			this.buscarPsps()
		},
		methods: {
			async buscarEtapas() {
				let resp = await this.$axios.$get("/psp/buscar/etapas")

				if (!resp.falha) {
					this.etapas = resp.dados.etapas
				}
			},

			async buscarPsps() {
				this.carregandoTabela = true
				let filtros = {}
				if (this.etapa_psp_id > 0) {
					filtros["etapa_psp_id"] = this.etapa_psp_id
				} else {
					delete filtros.etapa_psp_id
				}

				if (
					!this.$auth.user.permissoes.includes("gerenciamento_psp") &&
					!this.$auth.user.permissoes.includes("aprovar_psp_rh")
				) {
					filtros["$Funcionario.setor.id$"] = this.$auth.user.setor_id
				}

				filtros = Object.assign(filtros, this.filtros)
				if (Object.keys(filtros).includes("$PspTemMeioTransporte.meio_transporte$")) {
					let valorTransporte = filtros["$PspTemMeioTransporte.meio_transporte$"]

					delete filtros["$PspTemMeioTransporte.meio_transporte$"]

					filtros = Object.assign(filtros, {
						$or: [
							{ "$PspTemMeioTransporte.meio_transporte$": valorTransporte },
							{ meio_transporte: valorTransporte },
						],
					})
				}
				let page = this.pagina
				let size = this.itensPorPagina

				let resp = await this.$axios.$get("/psp/buscar/todas", { params: { filtros, page, size } })

				if (!resp.falha) {
					this.dados = resp.dados.psps
					this.totalItens = resp.dados.total

					this.carregandoTabela = false
				}
			},

			verDetalhesPsp(dados) {
				this.psp_id = dados.id
				this.mostrarDialogDetalhesPsp = true
			},

			async cadastrado(psp) {
				if (this.etapa_psp_id === 0 || this.etapa_psp_id === psp.etapa_psp_id) {
					this.dados.push(psp)
				}
			},

			async editado({ psp, mudaEtapa }) {
				let idx = this.dados.findIndex((o) => o.id === psp.id)

				if (idx >= 0) {
					if (mudaEtapa) {
						this.dados.splice(idx, 1)
					} else {
						this.dados[idx] = Object.assign(this.dados[idx], psp)
					}
				}

				this.psp_id = null

				this.mostrarDialogCriarPsp = false
				this.textoAlerta = "PSP editado com sucesso!"
				this.mostrarAlerta = true
			},

			async deletado(psp_id) {
				let idx = this.dados.findIndex((o) => o.id === psp_id)

				if (idx >= 0) {
					this.dados.splice(idx, 1)
					this.mostrarDialogCriarPsp = false
					this.textoAlerta = "PSP deletada com sucesso!"
					this.mostrarAlerta = true
					this.psp_id = null
				}
			},

			processado(psps) {
				for (let psp of psps) {
					let idx = this.dados.findIndex((o) => o.id === psp)

					if (idx >= 0) {
						this.dados.splice(idx, 1)
					}
				}

				this.textoAlerta = "PSPs processada com sucesso!"
				this.mostrarAlerta = true
				this.mostrarDialogProcessarPsp = false
			},

			rejeitado(psps) {
				for (let psp of psps) {
					let idx = this.dados.findIndex((o) => o.id === psp)

					if (idx >= 0) {
						this.dados.splice(idx, 1)
					}
				}

				this.textoAlerta = "PSPs rejeitadas com sucesso!"
				this.mostrarAlerta = true
				this.mostrarDialogProcessarPsp = false
			},

			editarPsp(item) {
				this.psp_id = item.id

				let permissao = this.$auth.user.permissoes.includes("gerenciamento_psp")

				if (item.etapa_psp_id !== 10) {
					if (permissao) {
						this.mostrarDialogEditarPspGerenciamento = true
					} else {
						this.mostrarDialogCriarPsp = true
					}
				} else {
					this.mostrarDialogCriarPsp = true
				}
			},

			async gerarExcel() {
				let dados = this.dados

				let cabecalho = [
					"Cod.",
					"Etapa",
					"Funcionário",
					"Cargo",
					"Setor",
					"Motivo",
					"Data de ida",
					"data de volta",
					"Destino",
					"Transporte",
					"Centro custo",
					"Solicitado por",
				]
				let nomeArquivo = "psp"

				let itens = []
				for (let item of dados) {
					let temp = []
					temp.push(("00000" + item.id).slice(-5))
					temp.push(item.EtapaPsp ? item.EtapaPsp.nome : "")
					temp.push(item.Funcionario ? item.Funcionario.nome : "")
					temp.push(item.Funcionario ? item.Funcionario.cargo : "")
					temp.push(item.Funcionario.setor ? item.Funcionario.setor.nome : "")
					temp.push(item.motivo ? item.motivo : "")
					temp.push(item.data_ida ? this.$dayjs(item.data_ida).format("DD/MM/YYYY") : "")
					temp.push(item.data_volta ? this.$dayjs(item.data_volta).format("DD/MM/YYYY") : "")
					temp.push(item.destino ? item.destino : "")
					temp.push(
						item.PspTemMeioTransporte.length > 0
							? item.PspTemMeioTransporte[0].meio_transporte
							: item.meio_transporte,
					)
					temp.push(item.CentroCustoPEP ? item.CentroCustoPEP.descricao : "")
					temp.push(item.criado_por ? item.criado_por.nome : "")
					itens.push(temp)
				}

				gerarExcel(cabecalho, itens, nomeArquivo)
			},
      async solicitanteTrocado({ psp }){
        console.log(psp);

        let idx = this.dados.findIndex(o => o.id === psp.id)
        //
        if(idx >= 0){
          this.dados[idx].criado_por = psp.criado_por
          this.dados[idx].data_ida = psp.data_ida
          this.dados[idx].PspTemMeioTransporte = psp.PspTemMeioTransporte
        }
        this.mostrarDialogEditarPspGerenciamento = false
        this.textoAlerta = "PSP editada com sucesso!"
        this.mostrarAlerta = true
      }
		},
		watch: {
			async etapa_psp_id() {
				this.pagina = 1

				await this.buscarPsps()
			},
		},
	}
</script>

<style scoped></style>
