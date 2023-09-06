<template>
	<div class="w-full">
		<div class="flex bg-primaria-500 w-full print:hidden menuEtapas">
			<div
				v-for="etapa in etapas"
				:key="etapa.valor"
				class="grid grid-flow-col auto-cols-max divide-y-2 divide-amber-50">
				<button
					class="flex py-2 px-3 hover:bg-gray-400 box-border text-white hover:text-black min-w-[100px] justify-center"
					:class="{
						'border-t-4 border-black bg-gray-200 !text-black': etapa_psp_id === etapa.valor,
					}"
					@click="etapa_psp_id = etapa.valor">
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
				altura="calc(100vh - 104px)"
				@atualizar="buscarPsps"
				selecionar
        :tem-rodape="false"
				@selecionados="selecionados = $event"
				:limparSelecionar="true"
				:carregando="carregandoTabela"
        :dados-sql="true"
				:temDetalhes="false">
				<template v-slot:[`body.EtapaPsp.id`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item.EtapaPsp ? item.EtapaPsp.nome : "" }}
					</span>
				</template>
				<template v-slot:[`body.Funcionario.nome`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item['Funcionario.nome'] ? item['Funcionario.nome'] : "" }}
					</span>
				</template>
				<template v-slot:[`body.Psp.motivo`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item['Psp.motivo'] ? item['Psp.motivo'] : "" }}
					</span>
				</template>
        <template v-slot:[`body.Funcionario.cargo`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item['Funcionario.cargo'] ? item['Funcionario.cargo'] : "" }}
					</span>
				</template>
				<template v-slot:[`body.Setor.nome`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item['Setor.nome'] ? item['Setor.nome'] : "" }}
					</span>
				</template>
				<template v-slot:[`body.Psp.data_ida`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item['Psp.data_ida'] ? $dayjs(item['Psp.data_ida']).format("DD/MM/YYYY") : "" }}
					</span>
				</template>
        <template v-slot:[`body.Psp.destino`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item['Psp.destino'] ? item['Psp.destino'] : "" }}
					</span>
        </template>
        <template v-slot:[`body.Psp.meio_transporte`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item['Psp.meio_transporte'] ? item['Psp.meio_transporte'] : "" }}
					</span>
        </template>
        <template v-slot:[`body.CentroCustoPEP.descricao`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item['CentroCustoPEP.descricao'] ? item['CentroCustoPEP.descricao'] : "" }}
					</span>
        </template>
        <template v-slot:[`body.Usuario.nome`]="{ item }">
					<span class="whitespace-nowrap">
						{{ item['Usuario.nome'] ? item['Usuario.nome'] : "" }}
					</span>
        </template>
				<template v-slot:[`body.id`]="{ item }">
					<span class="whitespace-nowrap">
						{{ ("00000" + item.id).slice(-5) }}
					</span>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex items-center w-full justify-between">
					<div class="flex">
						<BotaoPadrao
							texto="Gerar excel"
							@clique="gerarExcel()">
							<img
								src="@/assets/icons/excel-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
					<!--          <div class="flex " v-if="tipoAprovacao !== 'controle'">-->
					<BotaoPadrao
						:disabled="selecionados.length <= 0"
						texto="Aprovar Cards"
						@clique="mostrarDialogAprovarPsp = true">
						<template v-slot>
							<img
								src="@/assets/icons/check-b.svg"
								alt="close"
								class="w-7 h-7 fill-red-500" />
						</template>
					</BotaoPadrao>
					<!--          </div>-->
				</div>
			</template>
		</RodapePagina>
		<DialogAprovarPsp
			v-if="mostrarDialogAprovarPsp"
			@cancelar="mostrarDialogAprovarPsp = false"
			:tipoAprovacao="tipoAprovacao"
			@aprovado="aprovado"
			:psps="selecionados" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogAprovarPsp from "~/components/Dialogs/Administracao/Psp/DialogAprovarPsp.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"

	export default {
		name: "Aprovacao",
		components: { AppAlerta, DialogAprovarPsp, BotaoPadrao, RodapePagina, TabelaPadrao },
		data() {
			return {
				etapa_psp_id: null,
				cabecalho: [
					{
						nome: "Cód.",
						valor: "id",
						filtro: true,
						centralizar: true,
						colunaTabela: "Psp.id",
						ordenar: true,
						tipoFiltro: "inteiro",
					},
					{ nome: "Funcionário", valor: "Funcionario.nome", filtro: true },
					{ nome: "Cargo", valor: "Funcionario.cargo", filtro: true },
					{ nome: "Setor", valor: "Setor.nome", filtro: true },
					{ nome: "Motivo", valor: "Psp.motivo", filtro: true },
					{ nome: "Data de ida", valor: "Psp.data_ida" },
					{ nome: "Destino", valor: "Psp.destino", filtro: true },
					{ nome: "Transporte", valor: "Psp.meio_transporte", filtro: true },
					{ nome: "Centro Custo", valor: "CentroCustoPEP.descricao", filtro: true },
					{ nome: "Solicitado por", valor: "Usuario.nome", filtro: true },
				],
				dados: [],
				filtros: [],
				itensPorPagina: 50,
				pagina: 1,
				card_id: null,
				totalItens: 0,
				selecionados: [],
				carregandoTabela: true,
				mostrarDialogAprovarPsp: false,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		computed: {
			etapas() {
				let etapas = []

				let permissoes = this.$auth.user.permissoes.filter((o) => o.includes("aprovar_psp_"))

				if (permissoes.includes("aprovar_psp_gaf")) {
					etapas.push({ nome: "GAF", valor: "1" })
				}

				if (permissoes.includes("aprovar_psp_rh")) {
					etapas.push({ nome: "RH", valor: "2" })
				}

				if (permissoes.includes("aprovar_psp_coordenador")) {
					etapas.push({ nome: "Coordenador", valor: "3" })
				}

				if (permissoes.includes("aprovar_psp_gerente")) {
					etapas.push({ nome: "Gerente Área", valor: "4" })
				}

				return etapas
			},
			tipoAprovacao() {
				if (this.etapa_psp_id === "1") return "GAF"
				else if (this.etapa_psp_id === "2") return "RH"
				else if (this.etapa_psp_id === "3") return "Coordenador"
				else if (this.etapa_psp_id === "4") return "Gerente Área"
			},
		},
		async mounted() {
			this.etapa_psp_id = this.etapas[0].valor

		},
		methods: {
			async buscarPsps() {
				let filtros = [...this.filtros]

				let page = this.pagina
				let size = this.itensPorPagina
        let usuario_id = this.$auth.user.id

        filtros.push(`AND Psp.etapa_psp_id = ${parseInt(this.etapa_psp_id)}`)

				let resp = await this.$axios.$get("/psp/buscar/aprovacao/todas", {
					params: { filtros, page, size, usuario_id },
				})

				if (!resp.falha) {
					this.dados = resp.dados.psps
					this.totalItens = resp.dados.total
					this.carregandoTabela = false
				}
			},

			async aprovado({ aprovacao, psps }) {
				for (let psp of psps) {
					let idx = this.dados.findIndex((o) => o.id === psp)
					if (idx >= 0) {
						this.dados.splice(idx, 1)
					}
				}
				if (aprovacao) {
					this.textoAlerta = "PSPs aprovadas com sucesso!"
				} else {
					this.textoAlerta = "PSPs negadas com sucesso!"
				}

				this.mostrarAlerta = true
				this.mostrarDialogAprovarPsp = false
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
