<template>
	<div class="w-full grow gap-y-2 flex flex-col">
		<div class="flex flex-col p-1 bg-white gap-2 border border-gray-300 shadow print:hidden">
			<div class="text-gray-600">
				<span>
					Selecione uma data abaixo e preencha todos os campos para realizar o agendamento:
				</span>
			</div>
			<div class="flex gap-1">
				<div class="flex items-center">
					<AppTooltip>
						<template v-slot:corpo>
              <div class="w-8 h-7">
                <img
                  src="../../../../assets/icons/information-circle-g.svg"
                  alt=""
                  class="w-7 h-7" />
              </div>

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
        <div class="flex gap-2 overflow-x-auto">
          <div
            class=""
            v-for="dia of diasPrAgendamento"
            :key="dia.data">
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

			</div>
			<div class="flex gap-1">
				<!--        {{ agendamento.data }}-->
				<AppFormSelect
          obrigatorio
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
						v-if="noIntervalo"
						texto="Agendar"
						cor="!hover:bg-blue-900 bg-blue-800"
						@clique="agendar()"
						:disabled="desabilitarBotoes"
						class="text-white">
						<img
							src="../../../../assets/icons/save-w.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<AppTooltip
						posicao="right-0"
						v-if="!noIntervalo">
						<template v-slot:corpo>
							<BotaoPadrao
								texto="Bloqueado"
								cor="bg-gray-900 hover:bg-gray-900"
								class="text-white">
								<img
									src="@/assets/icons/lock-w.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</template>
						<template v-slot:tooltip>
							<div class="w-[400px]">
								<p class="text-red-500 text-2xl">Fora do horário de agendamento</p>
								<p>Hórario de agendamento:</p>
								<p>
									<strong>{{ horarioAgendamento }}</strong>
								</p>
							</div>
						</template>
					</AppTooltip>
				</div>
			</div>
		</div>
		<TabelaPadrao
			class="print:hidden"
			:cabecalho="cabecalho"
			:dados="dados"
			:itensPorPagina="itensPorPagina"
			:pagina="pagina"
			@pagina="pagina = $event"
			@itensPorPagina="itensPorPagina = $event"
			:totalItens="totalItens"
			@filtros="filtros = $event"
			@ordem="ordem = $event"
			classPersonalizada="!bg-gray-400"
			altura="calc(100vh - 277px)"
			:dados-redis="true"
			@atualizar="buscarFuncionarios()"
			:carregando="carregandoTabela"
			corOverlay="!bg-gray-600/70"
			:limparSelecionar="limparSelecionar"
			selecionar
			@selecionados="funcionariosSelecionados = $event"
			:overlay="agendamento.data === null || agendamento.data === ''">
			<template v-slot:[`body.selecione`]="{ item }">
				<AppTooltip
					alinhamento="direita"
					v-if="temCamposVazio(item)"
					:id="item.id">
					<template v-slot:corpo>
						<div
							class="w-6 h-6"
							v-if="temCamposVazio(item)">
							<img
								src="@/assets/icons/information-circle-g.svg"
								alt=""
								class="w-6 h-6" />
						</div>
					</template>
					<template v-slot:tooltip>
						<div class="w-[500px] text-start text-md">
							<span>
								Para poder agendar esse colaborador é preciso preencher
								<strong> Encarregado e Turno </strong>
							</span>
						</div>
					</template>
				</AppTooltip>
				<div v-else>
					<AppFormCheckbox
						:id="'checkTabela' + parseInt(item.id)"
						:disabled="item.ativo"
						:valor="item"
						v-model="funcionariosSelecionados" />
				</div>
			</template>
			<template v-slot:[`overlay`]="{}">
				<div class="text-white flex items-center justify-center h-full w-full text-3xl">
					<div class="bg-gray-800 p-2 rounded bg-">
						<h1><strong>Selecione uma data para desbloquear a tabela</strong></h1>
					</div>
				</div>
			</template>
			<template v-slot:[`body.rota`]="{ item }">
				<span
					v-if="item.rota"
					class="whitespace-nowrap">
					{{ item.rota.numero }} - {{ item.rota.local }}
				</span>
			</template>
			<template v-slot:[`body.EncarregadoLider.nome`]="{ item }">
				<span
					v-if="item.EncarregadoLider"
					class="whitespace-nowrap">
					{{ item.EncarregadoLider.nome }}
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
				<span
					class="whitespace-nowrap"
					:class="{
						'font-bold  text-yellow-500': item.hora_extra >= 24 && item.hora_extra < 33.99,
						'font-bold  text-amber-700': item.hora_extra >= 34 && item.hora_extra < 39.99,
						'font-bold  text-red-600': item.hora_extra >= 40,
					}">
					{{ horaExtra(item.hora_extra_projetada) }}
				</span>
			</template>
			<template v-slot:[`body.Turno.descricao`]="{ item }">
				<span v-if="item.Turno">
					{{ item.Turno.descricao }}
				</span>
			</template>
			<template v-slot:[`body.acoes`]="{ item }">
				<div
					class="w-6 h-6 hover:bg-gray-200 rounded"
					@click="editarFuncionario(item)">
					<img
						src="@/assets/icons/edit-b.svg"
						alt=""
						class="w-6 h-6" />
				</div>
			</template>
		</TabelaPadrao>
		<div class="bg-red-500 flex">
			<RodapePagina
				@fechar="mostrarSelecionados = false"
				class="print:hidden"
				detalhes
				tituloDetalhes="Selecionados"
				:mostrar="mostrarSelecionados">
				<template v-slot:detalhes>
					<div class="flex w-full p-1 overflow-y-auto max-h-[215px]">
						<table class="table w-full border-collapse border border-slate-500 text-sm bg-white">
							<thead class="bg-blue-200">
								<tr class="uppercase">
									<th class="border border-slate-500">Matrícula</th>
									<th class="border border-slate-500">Nome</th>
									<th class="border border-slate-500">Cargo</th>
									<th class="border border-slate-500">Encarregado/Lider</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="funcionario of funcionariosSelecionados"
									:key="funcionario.id">
									<td class="text-center border border-slate-500">{{ funcionario.chapa }}</td>
									<td class="border border-slate-500 pl-1">{{ funcionario.nome }}</td>
									<td class="border border-slate-500 pl-1">{{ funcionario.cargo }}</td>
									<td class="border border-slate-500 pl-1">
										{{ funcionario.EncarregadoLider ? funcionario.EncarregadoLider.nome : null }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</template>
				<div class="flex w-full justify-between">
					<div class="flex gap-2 items-center">
						<AppBadge
							cor="!bg-red-400"
							corFonte="bg-white"
							:texto="
								funcionariosSelecionados.length === 0 ? null : funcionariosSelecionados.length
							">
							<BotaoPadrao
								texto="Selecionados"
								@clique="mostrarSelecionados = !mostrarSelecionados"
								:disabled="agendamento.data === null || agendamento.data === ''" />
						</AppBadge>
					</div>
					<div class="flex gap-2">
						<BotaoPadrao
							texto="Aprovar HE"
							v-if="
								$auth.user.permissoes.includes('autorizar_he') ||
								$auth.user.permissoes.includes('autorizar_he_situacao')
							"
							@clique="mostrarDialogAprovarHe = true">
							<img
								src="../../../../assets/icons/check-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
						<BotaoPadrao
							texto="Agendamentos"
							@clique="mostrarDialogAgendamentos = true">
							<img
								src="../../../../assets/icons/list-check-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</RodapePagina>
		</div>

		<AppAlerta
			:mostrar="mostrarAlerta"
			:tipo="tipoAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogAgendamentos
			:noIntervalo="noIntervalo"
			v-if="mostrarDialogAgendamentos"
			@cancelar="mostrarDialogAgendamentos = false" />
		<DialogAprovarHE
			:liberado="podeAprovar()"
			v-if="mostrarDialogAprovarHe"
			@cancelar="mostrarDialogAprovarHe = false" />
		<DialogEditarFuncionario
			v-if="mostrarDialogEditarFuncionario"
			@cancelar="
				mostrarDialogEditarFuncionario = false
				funcionario = null
			"
			:funcionario="funcionario"
			@editado="editadoFuncionario" />
	</div>
</template>

<script>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
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
	import DialogEditarEfetivo from "~/components/Dialogs/Administracao/Rh/Efetivo/DialogEditarEfetivo.vue"
	import DialogEditarFuncionario from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialogEditarFuncionario.vue"

	export default {
		mixins: [horaExtra],
		name: "HoraExtra",
		components: {
			DialogEditarFuncionario,
			AppTooltip,
			AppBadge,
			AppTag,
			DialogAprovarHE,
			DialogAgendamentos,
			AppAlerta,
			AppFormCheckbox,
			TabelaPadrao,
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
					{ nome: "HE atual", valor: "hora_extra", centralizar: true, ordenar: true },
					{ nome: "HE projetada", valor: "hora_extra_projetada", centralizar: true },
					{ nome: "Matrícula", valor: "chapa", filtro: true, centralizar: true },
					{ nome: "Nome", valor: "nome", filtro: true, colunaTabela: "fun.nome" },
					{ nome: "Cargo", valor: "cargo", filtro: true },
					{ nome: "Encarregado/Lider", valor: "EncarregadoLider.nome", filtro: true },
					{ nome: "Rota", valor: "rota" },
					{ nome: "Ponto de embarque", valor: "ponto_embarque", filtro: true },
					{ nome: "Turno", valor: "Turno.descricao", filtro: true },
					{ nome: "", valor: "acoes", filtro: true },
				],
				dados: [],
				filtros: {},
				ordem: null,
				itensPorPagina: 200,
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
				configuracaoHE: {},
				noIntervalo: false,
				horaFechamentoAgendamento: null,
				mostrarSelecionados: false,
				limparSelecionar: false,
				agendamentosPorDia: {},
				mostrarDialogEditarFuncionario: false,
				funcionario: null,
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

			estaNoIntevaloAprovacao() {
				let hoje = this.$dayjs()
				let diaInicio = this.configuracaoHE.data_inicio_inter_aprov
				let horaInicio = this.configuracaoHE.hora_inicio_inter_aprov
				let diaFim = this.configuracaoHE.data_fim_inter_aprov
				let horaFim = this.configuracaoHE.hora_fim_inter_aprov

				let diaHoraInicio = hoje
					.day(diaInicio)
					.hour(horaInicio.split(":")[0])
					.minute(horaInicio.split(":")[1])
				let diaHoraFim = hoje.day(diaFim).hour(horaFim.split(":")[0]).minute(horaFim.split(":")[1])
				return hoje.isBetween(diaHoraInicio, diaHoraFim, null, "[]")
			},

			horarioAgendamento() {
				if (Object.keys(this.configuracaoHE).length > 0) {
					let diaInicioAgend = this.configuracaoHE.data_inicio_inter_agend
					let horaInicioAgend = this.configuracaoHE.hora_inicio_inter_agend
					let diaFimAgend = this.configuracaoHE.data_fim_inter_agend
					let horaFimAgend = this.configuracaoHE.hora_fim_inter_agend

					let diaInicio = this.$dayjs().day(diaInicioAgend)
					let diaFim = this.$dayjs().day(diaFimAgend)

					return `${diaInicio.locale("pt-br").format("dddd")} ${horaInicioAgend} até ${diaFim
						.locale("pt-br")
						.format("dddd")} ${horaFimAgend}`
				} else {
					return ""
				}
			},
		},
		async mounted() {
			await this.buscarDiasPrAgendamento()
			await this.buscarConfiguracao()
			await this.buscarFuncionarios()
			await this.podeAprovar()
		},

		methods: {
			editarFuncionario(item) {
				this.funcionario = item
				this.mostrarDialogEditarFuncionario = true
			},

			editadoFuncionario({ id, encarregadoLider, turno }) {
				let idx = this.dados.findIndex((o) => o.id === id)

				if (idx >= 0) {
					this.dados[idx].Turno = turno
					this.dados[idx].EncarregadoLider = encarregadoLider
					this.dados[idx].ativo = false
				}

				this.textoAlerta = "Funcionário editado com sucesso!"
				this.mostrarAlerta = true
				this.mostrarDialogEditarFuncionario = false
			},

			temCamposVazio(item) {
				if (!item.EncarregadoLider || !item.Turno) {
					item["ativo"] = true
					return true
				}

				return false
			},

			podeAprovar() {
				let {
					data_liberacao_aprovacao,
					hora_inicio_liberacao_aprovacao,
					hora_fim_liberacao_aprovacao,
				} = this.$auth.user

				if (this.$dayjs().format("YYYY-MM-DD") === data_liberacao_aprovacao) {
					let diaLiberacao = this.$dayjs(data_liberacao_aprovacao).get("date")
					let inicioIntLiberacao = this.$dayjs()
						.date(diaLiberacao)
						.hour(hora_inicio_liberacao_aprovacao.split(":")[0])
						.minute(hora_inicio_liberacao_aprovacao.split(":")[1])

					let fimIntLiberacao = this.$dayjs()
						.date(diaLiberacao)
						.hour(hora_fim_liberacao_aprovacao.split(":")[0])
						.minute(hora_fim_liberacao_aprovacao.split(":")[1])

					let estaEntre = this.$dayjs().isBetween(inicioIntLiberacao, fimIntLiberacao, null, "[]")
					if (estaEntre) {
						return true
					} else {
						return this.estaNoIntevaloAprovacao
					}
				} else {
					return this.estaNoIntevaloAprovacao
				}
			},

			verificaSeAberto() {
				if (this.verificaDentroIntervalo()) {
					this.noIntervalo = true
					setTimeout(this.verificaSeAberto, 300000)
				} else {
					this.noIntervalo = false
				}
			},

			verificaDentroIntervalo() {
				let hoje = this.$dayjs()
				let diaLiberacaoUsuario = this.$auth.user.data_liberacao

				if (Object.keys(this.configuracaoHE).length > 0) {
					let diaInicio = this.configuracaoHE.data_inicio_inter_agend
					let horaInicio = this.configuracaoHE.hora_inicio_inter_agend
					let diaFim = this.configuracaoHE.data_fim_inter_agend
					let horaFim = this.configuracaoHE.hora_fim_inter_agend

					let diaHoraInicio = hoje
						.day(diaInicio)
						.hour(horaInicio.split(":")[0])
						.minute(horaInicio.split(":")[1])
					let diaHoraFim = hoje
						.day(diaFim)
						.hour(horaFim.split(":")[0])
						.minute(horaFim.split(":")[1])
					let estaEntre = hoje.isBetween(diaHoraInicio, diaHoraFim, null, "[]")

					if (!estaEntre) {
						if (diaLiberacaoUsuario === hoje.format("YYYY-MM-DD")) {
							let horaInicioLiberacao = this.$auth.user.hora_inicio_liberacao
							horaFim = this.$auth.user.hora_fim_liberacao

							let comecoLiberacao = this.$dayjs(diaLiberacaoUsuario)
								.hour(horaInicioLiberacao.split(":")[0])
								.minute(horaInicioLiberacao.split(":")[1])
							let fimLiberacao = this.$dayjs(diaLiberacaoUsuario)
								.hour(horaFim.split(":")[0])
								.minute(horaFim.split(":")[1])

							estaEntre = hoje.isBetween(comecoLiberacao, fimLiberacao, null, "[]")
						}
					}

					this.horaFechamentoAgendamento = horaFim

					return estaEntre
				} else {
					return false
				}
			},

			async buscarDiasPrAgendamento() {
				let resp = await this.$axios.$get("/hora_extra/dias/feriados")

				if (!resp.falha) {
					let feriados = resp.dados.feriados

					const hoje = this.$dayjs()
					const diaSemana = hoje.day()

          console.log(diaSemana);

					let diasAteProximoDomingo = (8 - diaSemana) % 8
          console.log(diasAteProximoDomingo);
					if (diasAteProximoDomingo > 6) diasAteProximoDomingo = 6

					let data = this.$dayjs().format("YYYY-MM-DD")
					const diaFinal = hoje.add(diasAteProximoDomingo, "day").format("YYYY-MM-DD")

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
				let setorId = this.$auth.user.setor_id

				let filtros = this.filtros
				filtros = Object.assign({ ...filtros, setor_id: setorId })
				let ordem = this.ordem

				let resp = await this.$axios.$get("/hora_extra/buscar/funcionarios", {
					params: {
						setorId,
						page: this.pagina - 1,
						size: this.itensPorPagina,
						filtros,
						ordem,
					},
				})

				if (!resp.falha) {
					let funcionarios = resp.dados.funcionarios
					this.totalItens = parseInt(resp.dados.totalItens)
					this.dados = funcionarios
					this.carregandoTabela = false
					if (this.agendamento.data) {
						await this.buscarAgendFuncDia()
					}
				}
			},

			async buscarConfiguracao() {
				let resp = await this.$axios.$get("/hora_extra/configuracao")
				if (!resp.falha) {
					this.configuracaoHE = resp.dados.configuracao
					this.verificaSeAberto()
				}
			},

			// async atualizarDados(parametros) {
			// 	let { itensPorPagina, pagina, filtros, ordem } = parametros

			// 	if (itensPorPagina) this.itensPorPagina = itensPorPagina

			// 	if (pagina) this.pagina = pagina

			// 	if (filtros) this.filtros = filtros

			// 	await this.buscarFuncionarios()
			// },

			async buscarPorTagDia(data) {
				this.agendamento.data = data
				this.limparSelecionar = true
				await this.buscarAgendFuncDia()
			},

			async buscarAgendFuncDia() {
				let { data } = this.agendamento
				let { setor_id } = this.$auth.user

				let agendAtivos = this.dados.filter((o) => o.ativo === true)

				for (let agA of agendAtivos) {
					agA["ativo"] = false
				}

				let agendamentos = []

				if (Object.keys(this.agendamentosPorDia).includes(data)) {
					agendamentos = this.agendamentosPorDia[data]
				} else {
					let resp = await this.$axios.$get("/hora_extra/agendamentos/funcionario/dia", {
						params: { data, setor_id },
					})

					agendamentos = resp.dados.agendamentos

					this.agendamentosPorDia[data] = agendamentos
				}

				let novosDados = new Array(...this.dados)
				for (let ag of agendamentos) {
					let idx = novosDados.findIndex((o) => o.chapa === ag.chapa)

					if (idx >= 0) {
						novosDados[idx]["aprovacao_he"] = ag.aprovacao_he
						novosDados[idx]["precisa_aprovacao_situacao"] = ag.precisa_aprovacao_situacao
						novosDados[idx]["aprovacao_situacao"] = ag.aprovacao_situacao
						novosDados[idx]["ativo"] = true
					}
				}
				this.limparSelecionar = false

				this.dados = novosDados
			},

			async agendar() {
				let { data, turno, motivo } = this.agendamento

				if (this.$dayjs().isAfter(data, "day")) {
					this.mostrarAlerta = true
					this.tipoAlerta = "erro"
					this.textoAlerta = "Não é possivel agendar para dias anteriores !"
				} else {
					this.limparSelecionar = true
					let funcionarios = this.funcionariosSelecionados

					let funcionariosChapa = funcionarios.map((o) => o.chapa)
					let agendado_por_id = this.$auth.user.id
					let novosDados = new Array(...this.dados)

					let cont = 0
					let funcPrEnviar = []
					let total = 0

					for (let chapa of funcionariosChapa) {
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
							let novosAgendados = resp.novosAgendados
							for (let novo of novosAgendados) {
								this.agendamentosPorDia[data].push(novo)
							}

							cont = 0
							funcPrEnviar = []
						}
					}
					this.mostrarAlerta = true
					this.textoAlerta = "Agendamento realizado com sucesso!"
					this.funcionariosSelecionados = []
					this.dados = novosDados
					this.limparSelecionar = false
					await this.buscarAgendFuncDia()
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
