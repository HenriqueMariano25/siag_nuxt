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
		<div>
			<TabelaPadrao
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 194px)"
				:selecionar="podeEditar"
				@atualizar="buscarPsps"
				@dblclick="verDetalhesPsp"
				@selecionados="selecionados = $event"
				:limparSelecionar="true"
				:carregando="carregandoTabela"
				:temDetalhes="false">
				<template v-slot:[`body.id`]="{ item }">
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
				<template v-slot:[`body.solicitado_por`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.criado_por ? item.criado_por.nome : "" }}
					</span>
				</template>
				<template v-slot:[`body.CentroCustoPEP.descricao`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.CentroCustoPEP ? item.CentroCustoPEP.descricao : "" }}
					</span>
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
			@cancelar="mostrarDialogCriarPsp = false"
			@cadastrado="cadastrado" />
		<DialogProcessarPsp
			v-if="mostrarDialogProcessarPsp"
			@cancelar="mostrarDialogProcessarPsp = false"
      @processado="processado"
			:selecionados="selecionados" />
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
  import AppAlerta from "~/components/Ui/AppAlerta.vue";

	export default {
		name: "Psp",
		components: {
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
        textoAlerta: null
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
					{ nome: "Funcionário", valor: "Funcionario.nome" },
					{ nome: "Cargo", valor: "Funcionario.cargo" },
					{ nome: "Setor", valor: "Funcionario.setor.nome" },
					{ nome: "Motivo", valor: "motivo" },
					{ nome: "Data de ida", valor: "data_ida" },
					{ nome: "Destino", valor: "destino" },
					{ nome: "Transporte", valor: "meio_transporte" },
					{ nome: "Centro Custo", valor: "CentroCustoPEP.descricao" },
					{ nome: "Solicitado por", valor: "solicitado_por" },
				]

				return cabecalho
			},

			podeEditar() {
				return this.etapa_psp_id >= 5 && this.etapa_psp_id <= 7
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

				let resp = await this.$axios.$get("/psp/buscar/todas", { params: { filtros } })

				if (!resp.falha) {
					this.dados = resp.dados.psps
					this.carregandoTabela = false
				}
			},

			verDetalhesPsp(dados) {
				this.card_id = dados.id
				this.mostrarDialogDetalhesCard = true
			},

			async cadastrado(psp) {
				if (this.etapa_psp_id === 0 || this.etapa_psp_id === psp.etapa_psp_id) {
					this.dados.push(psp)
				}
			},

      processado(psps){
        for(let psp of psps){
          let idx = this.dados.findIndex(o => o.id === psp)

          if(idx >= 0){
            this.dados.splice(idx, 1)
          }
        }

        this.textoAlerta = "PSPs processada com sucesso!"
        this.mostrarAlerta = true
        this.mostrarDialogProcessarPsp = false
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
