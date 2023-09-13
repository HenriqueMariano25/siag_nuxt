<template>
	<div class="w-full">
		<div
			class="flex bg-primaria-500 w-full print:hidden menuEtapas"
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
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				@itensPorPagina="itensPorPagina = $event"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 194px)"
				:selecionar="podeProcessar"
				@atualizar="buscarPsps"
				@dblclick="verDetalhesPsp"
				@selecionados="selecionados = $event"
				:limparSelecionar="true"
				:carregando="carregandoTabela">
				<template v-slot:[`body.acao`]="{ item }">
					<BotaoPadrao
						icone
						@clique="editarPsp(item)"
						v-if="item.criado_por.id === $auth.user.id || podeEditarPsp">
						<img
							src="@/assets/icons/edit-b.svg"
							alt=""
							class="w-6 h-6" />
					</BotaoPadrao>
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
				<template v-slot:[`body.historico`]="{ item }">
					<div class="w-[120px]">
						<BotaoPadrao
							texto="Historico"
							class="!py-0.5 border border-gray-500"
							@clique="mostrarDialogHistoricoPsp = true; psp_id = item.id "
							>
							<img
								src="@/assets/icons/history-b.svg"
								alt=""
								class="w-6 h-6" />
						</BotaoPadrao>
					</div>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex items-center w-full">
					<div class="flex w-full gap-2 justify-end">
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
			@cancelar="mostrarDialogDetalhesPsp = false"
			:psp_id="psp_id" />
		<DialogHistoricoPsp
			@cancelar="mostrarDialogHistoricoPsp = false"
			v-if="mostrarDialogHistoricoPsp"
			:psp_id="psp_id" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
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

	export default {
		name: "Psp",
		components: {
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
					{ nome: "Data de ida", valor: "data_ida" },
					{ nome: "Destino", valor: "destino", filtro: true },
					{ nome: "Transporte", valor: "meio_transporte", filtro: true },
					{ nome: "Centro Custo", valor: "CentroCustoPEP.descricao", filtro: true },
					{ nome: "Solicitado por", valor: "criado_por.nome", filtro: true },
					{ nome: "Histórico", valor: "historico", filtro: true, largura: "w-[150px]" },
				]

				if ((this.etapa_psp_id >= 1 && this.etapa_psp_id <= 4) ||
        this.etapa_psp_id === 10) {
					cabecalho.unshift({ nome: "", valor: "acao" })
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
				let filtros = this.filtros

				if (this.etapa_psp_id > 0) {
					filtros["etapa_psp_id"] = this.etapa_psp_id
				} else {
					delete filtros.etapa_psp_id
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

			async editado(psp) {
				let idx = this.dados.findIndex((o) => o.id === psp.id)

				if (idx >= 0) {
					this.dados[idx] = Object.assign(this.dados[idx], psp)
				}

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

      rejeitado(psps){
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
				this.mostrarDialogCriarPsp = true
			},
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
