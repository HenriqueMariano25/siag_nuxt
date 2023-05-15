<template>
	<div class="w-full grow gap-y-2 flex flex-col">
		<div class="flex flex-col p-1 bg-white gap-2 border border-gray-300 shadow">
			<div class="text-gray-600">
				<span
					>Selecione uma data abaixo e preencha todos os campos para realizar o agendamento:</span
				>
			</div>
			<div class="flex gap-2">
				<div class="flex items-center">
					<AppTooltip>
						<template v-slot:corpo>
							<img
								src="@/assets/icons/information-circle-g.svg"
								alt=""
								class="w-7 h-7" />
						</template>
						<template v-slot:tooltip>
							<div class="w-[300px]">
								<span><strong>Tipos de dia da semana</strong></span>
								<div class="flex items-center">
									<div class="h-4 w-4 bg-green-500 rounded-full mr-1 border border-green-700"></div>
									<span>Dia da semana normal</span>
								</div>
								<div class="flex items-center">
									<div
										class="h-4 w-4 bg-yellow-400 rounded-full mr-1 border border-yellow-600"></div>
									<span>Sábado</span>
								</div>
								<div class="flex items-center">
									<div
										class="h-4 w-4 bg-orange-500 rounded-full mr-1 border border-orange-700"></div>
									<span>Domingo ou feriado</span>
								</div>
								<span><strong>Tabela</strong></span>
								<div class="flex items-center">
									<div class="h-4 w-4 bg-gray-500 mr-1 border border-gray-700 rounded"></div>
									<span>Funcionário já tem agendamento</span>
								</div>
							</div>
						</template>
					</AppTooltip>
				</div>
				<div v-for="dia of diasPrAgendamento">
					<AppTag
						@click="buscarPorTagDia(dia.data)"
						cor="text-black bg-gray-200 hover:bg-gray-300 border border-gray-300"
						:class="{ 'bg-gray-800 hover:bg-gray-900 text-white': agendamento.data === dia.data }"
						:texto="$dayjs(dia.data).format('DD/MM') + ' - ' + dia.diaSemana.toUpperCase()"
						fonte="text-xl"
						v-if="dia.tipo === 'normal'"
						:clicavel="true">
						<template v-slot:preTexto>
							<div class="flex items-center">
								<div class="h-4 w-4 bg-green-500 rounded-full mr-1 border border-green-700"></div>
							</div>
						</template>
					</AppTag>
					<AppTag
						@click="buscarPorTagDia(dia.data)"
						cor="bg-gray-200 hover:bg-gray-300 border border-gray-300"
						:class="{ 'bg-gray-800 hover:bg-gray-900 text-white': agendamento.data === dia.data }"
						:texto="$dayjs(dia.data).format('DD/MM') + ' - ' + dia.diaSemana.toUpperCase()"
						fonte="text-xl"
						v-if="dia.tipo === 'sabado'"
						:clicavel="true">
						<template v-slot:preTexto>
							<div class="flex items-center">
								<div class="h-4 w-4 bg-yellow-400 rounded-full mr-1 border border-yellow-600"></div>
							</div>
						</template>
					</AppTag>
					<AppTag
						@click="buscarPorTagDia(dia.data)"
						cor="bg-gray-200 hover:bg-gray-300 border border-gray-300"
						:class="{ 'bg-gray-800 hover:bg-gray-900 text-white': agendamento.data === dia.data }"
						:texto="$dayjs(dia.data).format('DD/MM') + ' - ' + dia.diaSemana.toUpperCase()"
						fonte="text-xl"
						v-if="dia.tipo === 'feriadoDomingo'"
						:clicavel="true">
						<template v-slot:preTexto>
							<div class="flex items-center">
								<div class="h-4 w-4 bg-orange-500 rounded-full mr-1 border border-orange-700"></div>
							</div>
						</template>
					</AppTag>
				</div>
			</div>
			<div class="flex gap-1">
				<AppFormSelect
					label="Turno"
					:options="turnos"
					v-model="agendamento.turno"
					id="pep" />
				<AppFormInput
					class="grow"
					id="data"
					type="text"
					v-model="agendamento.motivo"
					obrigatorio
					label="Motivo"
					placeholder="Ex: Desenvolvimento do novo módulo no SIAG" />
				<div class="flex items-end">
					<BotaoPadrao
						texto="Agendar"
						cor="!hover:bg-blue-900 bg-blue-800"
						@click="agendar()"
						:disabled="desabilitarBotoes"
						class="text-white">
						<img
							src="@/assets/icons/save-w.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</div>
		</div>
		<AppTabela
			:cabecalho="cabecalho"
			:dados="dados"
			:itensPorPagina="itensPorPagina"
			:pagina="pagina"
			:totalItens="totalItens"
			classPersonalizada="!bg-gray-400"
			altura="calc(100vh - 277px)"
			:dadosSql="true"
			@atualizar="atualizarDados"
			:carregando="carregandoTabela"
			corOverlay="!bg-gray-600/70"
			:overlay="agendamento.data === null || agendamento.data === ''"
			:temDetalhes="false">
			<template v-slot:[`overlay`]="{ item }">
				<div class="text-white flex items-center justify-center h-full w-full text-3xl">
					<div class="bg-gray-800 p-2 rounded bg-">
						<h1><strong>Selecione uma data para desbloquear a tabela</strong></h1>
					</div>
				</div>
			</template>
			<template v-slot:[`body.checkbox`]="{ item }">
				<AppFormCheckbox
					:cor="situacaoAgendCheckbox(item)"
					:disabled="item.ativo"
					:id="'checkbox' + item.chapa"
					:valor="item.chapa"
					v-model="funcionariosSelecionados" />
			</template>
			<template v-slot:[`body.rota`]="{ item }">
				<span
					v-if="item.numero || item.local"
					class="whitespace-nowrap">
					{{ item.numero }} - {{ item.local }}
				</span>
			</template>
			<template v-slot:[`body.hora_extra`]="{ item }">
				<span
					class="whitespace-nowrap"
					:class="{
						'font-bold  text-yellow-500': item.hora_extra >= 24 && item.hora_extra < 33.99,
						'font-bold  text-amber-700': item.hora_extra >= 34 && item.hora_extra < 39.99,
						'font-bold  text-red-600': item.hora_extra >= 40,
					}">
					{{ horaExtra(item.hora_extra) }}
				</span>
			</template>
			<template v-slot:[`body.hora_extra_projetada`]="{ item }">
				<span class="whitespace-nowrap" :class="{
						'font-bold  text-yellow-500': item.hora_extra >= 24 && item.hora_extra < 33.99,
						'font-bold  text-amber-700': item.hora_extra >= 34 && item.hora_extra < 39.99,
						'font-bold  text-red-600': item.hora_extra >= 40,
					}">
					{{ horaExtra(item.hora_extra_projetada) }}
				</span>
			</template>
		</AppTabela>
		<div class="bg-red-500 flex">
			<RodapePagina class="print:hidden">
				<div class="flex w-full justify-between">
					<div></div>
					<div class="flex gap-2">
						<BotaoPadrao
							texto="Aprovar HE"
							@click="mostrarDialogAprovarHe = true">
							<img
								src="@/assets/icons/check-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
						<BotaoPadrao
							texto="Agendamentos"
							@click="mostrarDialogAgendamentos = true">
							<img
								src="@/assets/icons/list-check-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</RodapePagina>
		</div>

		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			:tipo="tipoAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogAgendamentos
			v-if="mostrarDialogAgendamentos"
			@cancelar="mostrarDialogAgendamentos = false" />
		<DialogAprovarHE
			v-if="mostrarDialogAprovarHe"
			@cancelar="mostrarDialogAprovarHe = false" />
	</div>
</template>

<script>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppTabela from "~/components/Ui/AppTabela.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import DialogAgendamentos from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialogAgendamentos.vue"
	import DialogAprovarHE from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialogAprovarHE.vue"
	import { horaExtra } from "~/mixins/horaExtra"
	import AppTag from "~/components/Ui/AppTag.vue"
	import AppBadge from "~/components/Ui/AppBadge.vue"
	import AppTooltip from "~/components/Ui/AppTooltip.vue"

	export default {
		mixins: [horaExtra],
		name: "HoraExtra",
		components: {
			AppTooltip,
			AppBadge,
			AppTag,
			DialogAprovarHE,
			DialogAgendamentos,
			AppAlerta,
			AppFormCheckbox,
			AppTabela,
			BotaoPadrao,
			AppFormInput,
			AppFormSelect,
			RodapePagina,
		},
		data() {
			return {
				agendamento: {
					data: null,
					turno: null,
					motivo: null,
				},
				turnos: [
					{ id: "diurno", nome: "Diurno" },
					{ id: "noturno", nome: "Noturno" },
					{ id: "3° turno", nome: "3° turno" },
				],
				cabecalho: [
					{ nome: "", valor: "checkbox", centralizar: true },
					{ nome: "HE atual", valor: "hora_extra", filtro: true, centralizar: true },
					{ nome: "HE projetada", valor: "hora_extra_projetada", filtro: true, centralizar: true },
					{ nome: "Matricula", valor: "chapa", filtro: true, centralizar: true },
					{ nome: "Nome", valor: "nome", filtro: true },
					{ nome: "Cargo", valor: "cargo", filtro: true },
					{ nome: "Encarregado/Lider SAPO", valor: "encarregado_lider_sapo", filtro: true },
					{ nome: "Rota", valor: "rota", filtro: true },
					{ nome: "Ponto de embarque", valor: "ponto_embarque", filtro: true },
				],
				dados: [],
				filtros: [],
				itensPorPagina: 50,
				totalItens: 0,
				pagina: 1,
				funcionariosSelecionados: [],
				carregandoTabela: false,
				mostrarAlerta: false,
				textoAlerta: null,
				tipoAlerta: "sucesso",
				mostrarDialogAgendamentos: false,
				mostrarDialogAprovarHe: false,
				diasPrAgendamento: [],
			}
		},
		computed: {
			desabilitarBotoes() {
				return (
					this.agendamento.data === null ||
					this.agendamento.data === "" ||
					this.agendamento.turno === null ||
					this.agendamento.turno === "" ||
					this.agendamento.motivo === null ||
					this.agendamento.motivo === "" ||
					this.funcionariosSelecionados.length <= 0
				)
			},
			// dataInvalida(){
			//   return !this.$dayjs(this.agendamento.data).isValid() && (this.agendamento.data !== null && this.agendamento.data !== '')
			// }
		},
		created() {
			this.buscarFuncionarios()
			this.buscarDiasPrAgendamento()
		},
		methods: {
			async buscarDiasPrAgendamento() {
				let resp = await this.$axios.$get("/hora_extra/dias/feriados")

				if (!resp.falha) {
					let feriados = resp.dados.feriados
					let data = this.$dayjs().format("YYYY-MM-DD")
					let diaFinal = this.$dayjs().add(5, "day").format("YYYY-MM-DD")
					let dias = []
					let tipoDia = null

					while (data <= diaFinal) {
						if (feriados.includes(data) || this.$dayjs(data).day() === 0) {
							tipoDia = "feriadoDomingo"
						} else if (this.$dayjs(data).day() === 6) {
							tipoDia = "sabado"
						} else {
							tipoDia = "normal"
						}

						let diaSemana = this.$dayjs(data).locale("pt-br").format("dddd")
						dias.push({ data, tipo: tipoDia, diaSemana })
						data = this.$dayjs(data).add(1, "day").format("YYYY-MM-DD")
					}

					this.diasPrAgendamento = dias
				}
			},

			async buscarFuncionarios() {
				this.carregandoTabela = true
				let setorId = this.$auth.user.setor_id

				let resp = await this.$axios.$get("/hora_extra/buscar/funcionarios", {
					params: { setorId, page: this.pagina - 1, size: this.itensPorPagina },
				})

				if (!resp.falha) {
					let funcionarios = resp.dados.funcionarios
					this.totalItens = parseInt(resp.dados.totalItens)
					this.dados = funcionarios
					this.carregandoTabela = false
				}
			},

			async atualizarDados(parametros) {
				let { itensPorPagina, pagina, filtros, ordem } = parametros

				if (itensPorPagina) this.itensPorPagina = itensPorPagina

				if (pagina) this.pagina = pagina

				if (filtros) this.filtros = filtros

				await this.buscarFuncionarios()
			},

			async buscarPorTagDia(data) {
				this.agendamento.data = data
				await this.buscarAgendFuncDia()
			},

			async buscarAgendFuncDia() {
				let { data } = this.agendamento
				let { setor_id } = this.$auth.user

				let agendAtivos = this.dados.filter((o) => o.ativo === true)

				for (let agA of agendAtivos) {
					agA["ativo"] = false
				}

				let resp = await this.$axios.$get("/hora_extra/agendamentos/funcionario/dia", {
					params: { data, setor_id },
				})

				let novosDados = new Array(...this.dados)

				if (!resp.falha) {
					let { agendamentos } = resp.dados

					for (let ag of agendamentos) {
						let idx = novosDados.findIndex((o) => o.chapa === ag.chapa)

						if (idx >= 0) {
							novosDados[idx]["aprovacao_he"] = ag.aprovacao_he
							novosDados[idx]["precisa_aprovacao_situacao"] = ag.precisa_aprovacao_situacao
							novosDados[idx]["aprovacao_situacao"] = ag.aprovacao_situacao
							novosDados[idx]["ativo"] = true
						}
					}

					// let chapas = agendamentos.map(( o => o.chapa ))
					//
					//   let ativos = novosDados.filter(o => chapas.includes(o.chapa))
					//
					// for(let ativo of ativos){
					//  ativo['ativo'] = true
					// }
				}

				this.dados = novosDados
			},

			situacaoAgendCheckbox(item) {
				if (item.ativo) {
					return "!bg-gray-500"
					// if (item.aprovacao_he === false || item.aprovacao_situacao === false) {
					// 	return "!bg-red-300"
					// } else if (
					// 	item.aprovacao_he === true ||
					// 	(item.aprovacao_situacao === true && item.precisa_aprovacao_situacao === true)
					// ) {
					// 	return "!bg-green-300"
					// } else if (
					// 	item.aprovacao_he === null ||
					// 	(item.aprovacao_situacao === null && item.precisa_aprovacao_situacao === true)
					// ) {
					// 	return "!bg-yellow-300"
					// }
				} else {
					return false
				}
			},

			async agendar() {
				let { data, turno, motivo } = this.agendamento

				if (this.$dayjs().isAfter(data, "day")) {
					this.mostrarAlerta = true
					this.tipoAlerta = "erro"
					this.textoAlerta = "Não é possivel agendar para dias anteriores !"
				} else {
					console.log("---------------------------")
					console.log(this.funcionariosSelecionados)

					let funcionarios = this.funcionariosSelecionados
					let agendado_por_id = this.$auth.user.id

					let cont = 0
					let funcPrEnviar = []
					let total = 0

					for (let chapa of funcionarios) {
						funcPrEnviar.push(chapa)
						cont += 1
						total += 1

						if (cont === 5 || total === funcionarios.length) {
							let resp = await this.$axios.$post("/hora_extra/agendar/novo_padrao", {
								chapas: funcPrEnviar,
								data,
								turno,
								motivo,
								agendado_por_id,
							})
							console.log(resp)
							cont = 0
							funcPrEnviar = []
						}
					}
				}
			},
		},
		watch: {
			"agendamento.data"() {
				this.funcionariosSelecionados = []
			},
		},
	}
</script>

<style scoped></style>
