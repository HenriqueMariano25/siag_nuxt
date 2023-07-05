<template>
	<div class="w-full">
		<div>
			<AppTabs
				:tabs="tabs"
				@tab="tab = $event">
				<template v-slot:[`tab.configuracoes`]="{ item }">
					<div class="mt-1 flex flex-col gap-y-2">
						<div class="flex flex-col bg-white border border-gray-300 p-2 gap-2">
							<span class="text-gray-700 bg-blue-300 px-2 text-xl">
								Intervalo de <strong>AGENDAMENTO</strong> de HE
							</span>
							<div class="flex gap-2 justify-between">
								<div class="flex gap-2 items-end">
									<div class="flex flex-col">
										<span class="text-sm">Dias do agendamento</span>
										<div class="flex items-end gap-2">
											<div
												v-for="dia of diasSemana"
												:key="dia.dia"
												class="bg-primaria-100 hover:bg-primaria-300 hover:text-white p-2 rounded cursor-pointer"
												:class="{
													'bg-primaria-500 text-white':
														estaNoIntevalo(dia.dia) || diasIntervalo.includes(dia),
												}"
												@click="adicionarAoIntervalo(dia)">
												{{ dia.nome }}
											</div>
										</div>
									</div>

									<AppFormInput
										id="horaAbertura"
										type="time"
										label="Hora de abertura"
										v-model="intervalo.horaAbertura" />
									<AppFormInput
										id="horaFechamento"
										type="time"
										label="Hora de fechamento"
										v-model="intervalo.horaFechamento" />
									<div class="flex flex-col">
										<span>
											Dia de abertura:
											<strong>
												{{ diasIntervalo[0] ? diasIntervalo[0].nome : "" }}
												{{ intervalo.horaAbertura ? `- ${intervalo.horaAbertura}` : "" }}
											</strong>
										</span>
										<span>
											Dia de fechamento:
											<strong>
												{{ diasIntervalo[1] ? diasIntervalo[1].nome : ""
												}}{{ intervalo.horaFechamento ? `- ${intervalo.horaFechamento}` : "" }}
											</strong>
										</span>
									</div>
								</div>
								<div class="flex">
									<div class="flex items-end">
										<BotaoPadrao
											:disabled="desativarSalvarIntervalo"
											texto="salvar"
											cor="bg-primaria-300 hover:bg-primaria-500"
											class="text-white"
											@click="salvarIntervaloAgendamento">
											<img
												src="@/assets/icons/save-w.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
									</div>
								</div>
							</div>
						</div>
						<div class="flex flex-col bg-white border border-gray-300 p-2 gap-2">
							<span class="text-gray-700 bg-blue-300 px-2 text-xl">
								Intervalo de <strong>APROVAÇÃO</strong> de HE
							</span>
							<div class="flex gap-2 justify-between">
								<div class="flex gap-2 items-end">
									<div class="flex flex-col">
										<span class="text-sm">Dias da aprovação</span>
										<div class="flex items-end gap-2">
											<div
												v-for="dia of diasSemana"
												:key="dia.dia"
												class="bg-primaria-100 hover:bg-primaria-300 hover:text-white p-2 rounded cursor-pointer"
												:class="{
													'bg-primaria-500 text-white':
														estaNoIntevaloAprovacao(dia.dia) ||
														diasIntervaloAprovacao.includes(dia),
												}"
												@click="adicionarAoIntervaloAprovacao(dia)">
												{{ dia.nome }}
											</div>
										</div>
									</div>

									<AppFormInput
										id="horaAbertura"
										type="time"
										label="Hora de abertura"
										v-model="intervaloAprovacao.horaAbertura" />
									<AppFormInput
										id="horaFechamento"
										type="time"
										label="Hora de fechamento"
										v-model="intervaloAprovacao.horaFechamento" />
									<div class="flex flex-col">
										<span>
											Dia de abertura:
											<strong>
												{{ diasIntervaloAprovacao[0] ? diasIntervaloAprovacao[0].nome : "" }}
												{{
													intervaloAprovacao.horaAbertura
														? `- ${intervaloAprovacao.horaAbertura}`
														: ""
												}}
											</strong>
										</span>
										<span>
											Dia de fechamento:
											<strong>
												{{ diasIntervaloAprovacao[1] ? diasIntervaloAprovacao[1].nome : ""
												}}{{
													intervaloAprovacao.horaFechamento
														? `- ${intervaloAprovacao.horaFechamento}`
														: ""
												}}
											</strong>
										</span>
									</div>
								</div>
								<div class="flex">
									<div class="flex items-end">
										<BotaoPadrao
											:disabled="desativarSalvarIntervaloAprovacao"
											texto="salvar"
											cor="bg-primaria-300 hover:bg-primaria-500"
											@click="salvarIntervaloAprovacao()"
											class="text-white">
											<img
												src="@/assets/icons/save-w.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
									</div>
								</div>
							</div>
						</div>
						<div class="flex flex-col bg-white border border-gray-300 p-2 gap-2">
							<span class="text-gray-700 bg-blue-300 px-2 text-xl">
								Data de abertura e fechamento da Folha
							</span>
							<div class="flex gap-2 justify-between items-end">
								<div>
									<div class="flex gap-2">
										<AppFormInput
											id="diaAberturaFolha"
											type="number"
											label="Dia de abertura da folha"
											:min="1"
											:max="31"
											v-model="folha.diaAbertura" />
										<div class="flex items-end">
											<span v-if="folhaAtual">
												Folha atual: <strong>{{ folhaAtual }}</strong>
											</span>
										</div>
									</div>
								</div>
								<div class="flex items-end">
									<div>
										<BotaoPadrao
											:disabled="desativarSalvarFolha"
											texto="salvar"
											cor="bg-primaria-300 hover:bg-primaria-500"
											@click="salvarDataFolha()"
											class="text-white">
											<img
												src="@/assets/icons/save-w.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
									</div>
								</div>
							</div>
						</div>
						<div class="flex flex-col bg-white border border-gray-300 p-2 gap-2">
							<div class="text-gray-700 bg-blue-300 px-2 text-xl flex gap-2">
								<span>
									Limite de HE para <strong>APROVAÇÃO</strong> do Site Manager e
									<strong>AGENDAMENTO</strong>
								</span>
								<AppTooltip largura="w-[600px]">
									<template v-slot:corpo>
										<img
											src="../../../../assets/icons/information-circle-g.svg"
											alt=""
											class="w-7 h-7" />
									</template>
									<template v-slot:tooltip>
										<div>
											<p>
												Limite máximo de hora extra para sem precisar de
												<strong>aprovação do Site Manager</strong>.
											</p>
											<p>
												Limite máximo de hora extra para conseguir agendar, passando desse limite
												não será realizado o <strong>agendamento</strong>.
											</p>
										</div>
									</template>
								</AppTooltip>
							</div>
							<div class="flex gap-2 justify-between">
								<div class="flex gap-2">
									<AppFormInput
										id="limiteHoraAprovacao"
										type="number"
										label="Limite de HE para aprovação"
										v-model="limiteHe.limite_he_agendamento" />
									<AppFormInput
										id="limiteHoraAgendamento"
										type="number"
										label="Limite de HE para agendamento"
										v-model="limiteHe.limite_hora_extra" />
								</div>
								<div class="flex items-end">
									<BotaoPadrao
										texto="Salvar"
										class="text-white"
										:disabled="desativarSalvarLimiteHE"
										@click="salvarLimiteHe"
										cor="bg-primaria-300 hover:bg-primaria-500">
										<img
											src="@/assets/icons/save-w.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-slot:[`tab.bloquear`]="{ item }">
					<div class="mt-2 gap-2 flex flex-col">
						<div class="flex flex-col p-2 bg-white border border-gray-300 gap-2">
							<div class="text-gray-700 bg-blue-300 px-2 text-xl">
								<span>Bloqueio de <strong>INTERVALO</strong> para agendamento</span>
							</div>
							<div class="flex gap-2">
								<AppFormInput
									id="dataInicioBloqueio"
									type="date"
									v-model="bloqueioIntervalo.data_inicio"
									label="Data inicio" />
								<AppFormInput
									id="dataFimBloqueio"
									type="date"
									v-model="bloqueioIntervalo.data_fim"
									label="Data fim" />
								<AppFormInput
									id="horaInicioBloqueio"
									type="time"
									v-model="bloqueioIntervalo.hora_inicio"
									label="Hora inicio" />
								<AppFormInput
									id="horaFimBloqueio"
									type="time"
									v-model="bloqueioIntervalo.hora_fim"
									label="Hora fim" />
								<div class="flex items-end">
									<BotaoPadrao
										texto="Bloquear"
										:disabled="desativarSalvarBloquearIntervalo"
										cor="bg-primaria-300 hover:bg-primaria-500"
										class="text-white"
										@click="salvarBloqueioIntervalor()">
										<img
											src="@/assets/icons/lock-w.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
								</div>
							</div>
							<div class="flex flex-col">
								<span class="text-xl text-gray-700" v-if="">Último bloqueio</span>
								<span v-if="ultimoBloqueioHe.data_inicio">
									Inicio:
									<strong>
										{{ $dayjs(ultimoBloqueioHe.data_inicio).format("DD/MM/YYYY") }} -
										{{ ultimoBloqueioHe.hora_inicio }}
									</strong>
								</span>
								<span v-if="ultimoBloqueioHe.data_fim">
									Termino:
									<strong>
										{{ $dayjs(ultimoBloqueioHe.data_fim).format("DD/MM/YYYY") }} -
										{{ ultimoBloqueioHe.hora_fim }}
									</strong>
								</span>
								<span v-if="ultimoBloqueioHe.Usuario">
									Bloqueado por:
									<strong>
										{{ ultimoBloqueioHe.Usuario ? ultimoBloqueioHe.Usuario.nome : "" }}
									</strong>
									em
									<strong>{{
										$dayjs(ultimoBloqueioHe.createdAt).format("DD/MM/YYYY  HH:mm")
									}}</strong>
								</span>
							</div>
						</div>
						<div class="flex flex-col p-2 bg-white border border-gray-300 gap-2">
							<div class="text-gray-700 bg-blue-300 px-2 text-xl flex gap-2">
								<span>Bloqueio de <strong>DIA</strong> para agendamento</span>
								<AppTooltip largura="w-[600px]">
									<template v-slot:corpo>
										<img
											src="../../../../assets/icons/information-circle-g.svg"
											alt=""
											class="w-7 h-7" />
									</template>
									<template v-slot:tooltip>
										<div>
											<p>Bloqueia <strong>DIA</strong> específico para não poder ser agendado.</p>
											<p>
												Ex: Caso tenha um fériado na sexta-feira mas só nesse dia não poderá ter
												hora extra.
											</p>
										</div>
									</template>
								</AppTooltip>
							</div>
							<div class="flex gap-2">
								<AppFormInput
									id="diaBloqueioEsquecifico"
									type="date"
									label="Dia do bloqueio" />
								<div class="flex items-end">
									<BotaoPadrao texto="Bloquear">
										<img
											src="@/assets/icons/lock-b.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
								</div>
							</div>
							<div>
								<span class="text-xl text-gray-700">Dias bloqueados</span>
							</div>
						</div>
					</div>
				</template>
				<template v-slot:[`tab.liberar`]="{ item }">
					<div class="mt-2 gap-2 flex flex-col">
						<div class="flex flex-col p-2 bg-white border border-gray-300 gap-2">
							<div class="text-gray-700 bg-blue-300 px-2 text-xl">
								<span>Liberar <strong>USUÁRIO</strong> para agendar</span>
							</div>
							<div class="flex gap-2">
								<AppFormInput
									id="horaInicioLiberar"
									type="time"
                  v-model="liberacaoUsuario.hora_inicio"
									label="Hora inicio" />
								<AppFormInput
									id="horaFimLiberar"
									type="time"
                  v-model="liberacaoUsuario.hora_fim"
									label="Hora Fim" />
								<div class="flex items-end">
									<BotaoPadrao texto="Liberar" :disabled="desativarSalvarLiberarUsuario"
                               cor="bg-primaria-300 hover:bg-primaria-500"
                               class="text-white"
                               @click="liberarUsuarios()"
                  >
										<img
											src="@/assets/icons/lock-open-w.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
								</div>
								<div class="flex items-end">
									<span v-if="!Object.keys(ultimaLiberacao).some( key =>  ultimaLiberacao[key] === null || ultimaLiberacao[key] === '')">
                    Última liberação: <strong>{{ ultimaLiberacao.data_ultima_liberacao ? $dayjs(ultimaLiberacao.data_ultima_liberacao).format("DD/MM/YYYY HH:mm") : ""}}</strong> -
										<strong>{{ ultimaLiberacao.liberado_por ? ultimaLiberacao.liberado_por.nome : "" }}</strong></span
									>
								</div>
							</div>
							<div>
								<AppTabela
									:cabecalho="cabecalho"
									:dados="usuarios"
									:itensPorPagina="itensPorPagina"
									:pagina="pagina"
									:totalItens="totalItens"
									classPersonalizada="!bg-gray-400"
									altura="calc(100vh - 277px)"
									@atualizar="">
                  <template v-slot:[`header.checkbox`]>
                    <AppFormCheckbox
                      id="checkbox-selecionar-todos"
                      @click="selecionarTodosLiberacao"
                      :valor="true"
                      v-model="selecionandoTodos"
                    />
                  </template>
									<template v-slot:[`body.checkbox`]="{ item }">
										<AppFormCheckbox
											:id="'checkbox' + item.id"
											:valor="item.id"
											v-model="usuariosPrLiberar" />
									</template>
									<template v-slot:[`body.Setor.nome`]="{ item }">
										<span class="whitespace-nowrap"> {{ item.Setor.nome }} </span>
									</template>
                  <template v-slot:[`body.ultima_liberacao`]="{ item }">
										<span class="whitespace-nowrap" v-if="item.data_liberacao !== null && item.hora_inicio_liberacao !== null && item.hora_fim_liberacao !== null">
                      {{ $dayjs(item.data_liberacao).format("DD/MM/YYYY") }} - {{ item.hora_inicio_liberacao }} a {{ item.hora_fim_liberacao }}
                    </span>
									</template>
								</AppTabela>
							</div>
						</div>
					</div>
				</template>
			</AppTabs>
		</div>
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppTooltip from "~/components/Ui/AppTooltip.vue"
	import AppTabela from "~/components/Ui/AppTabela.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"

	export default {
		components: {
			AppFormCheckbox,
			AppAlerta,
			AppTabela,
			AppTooltip,
			BotaoPadrao,
			AppFormInput,
			AppTabs,
		},
		data() {
			return {
				tabs: [
					{ nome: "Configurações", valor: "configuracoes" },
					{ nome: "Bloquear", valor: "bloquear" },
					{ nome: "Liberar", valor: "liberar" },
				],
				tab: null,
				diasSemana: [
					{ nome: "Domingo", dia: 0 },
					{ nome: "Segunda", dia: 1 },
					{ nome: "Terça", dia: 2 },
					{ nome: "Quarta", dia: 3 },
					{ nome: "Quinta", dia: 4 },
					{ nome: "Sexta", dia: 5 },
					{ nome: "Sábado", dia: 6 },
				],
				diasIntervalo: [],
				intervalo: { horaAbertura: null, horaFechamento: null },
				diasIntervaloAprovacao: [],
				intervaloAprovacao: { horaAbertura: null, horaFechamento: null },
				folha: { diaAbertura: null },
				limiteHe: { limite_he_agendamento: null, limite_hora_extra: null },
				cabecalho: [
					{ nome: "", valor: "checkbox", centralizar: true, largura: "w-10" },
					{ nome: "Nome", valor: "nome", filtro: true },
					{ nome: "Login", valor: "usuario", filtro: true },
					{ nome: "Setor", valor: "Setor.nome", filtro: true },
					{ nome: "Última liberação", valor: "ultima_liberacao", filtro: true },
				],
				filtros: [],
				itensPorPagina: 50,
				totalItens: 0,
				pagina: 1,
				mostrarAlerta: false,
				textoAlerta: null,

				bloqueioIntervalo: {
					data_inicio: null,
					data_fim: null,
					hora_inicio: null,
					hora_fim: null,
				},
				buscouBloqueio: false,
				ultimoBloqueioHe: {
					data_inicio: null,
					data_fim: null,
					hora_inicio: null,
					hora_fim: null,
				},

				buscouUsuarios: false,
				usuarios: [],
				usuariosPrLiberar: [],
        liberacaoUsuario: {
          hora_inicio: null,
          hora_fim: null
        },
        ultimaLiberacao: {},
        selecionandoTodos: false
			}
		},
		computed: {
			desativarSalvarIntervalo() {
				return (
					this.diasIntervalo.length !== 2 ||
					this.intervalo.horaAbertura === null ||
					this.intervalo.horaAbertura === "" ||
					this.intervalo.horaFechamento === null ||
					this.intervalo.horaFechamento === ""
				)
			},

			desativarSalvarIntervaloAprovacao() {
				return (
					this.diasIntervaloAprovacao.length !== 2 ||
					this.intervaloAprovacao.horaAbertura === null ||
					this.intervaloAprovacao.horaAbertura === "" ||
					this.intervaloAprovacao.horaFechamento === null ||
					this.intervaloAprovacao.horaFechamento === ""
				)
			},

			desativarSalvarFolha() {
				return this.folha.diaAbertura === null || this.folha.diaAbertura === ""
			},

			desativarSalvarLimiteHE() {
				return Object.keys(this.limiteHe).some(
					(o) => this.limiteHe[o] === null || this.limiteHe[o] === "",
				)
			},

			desativarSalvarBloquearIntervalo() {
				return Object.keys(this.bloqueioIntervalo).some(
					(key) => this.bloqueioIntervalo[key] === null || this.bloqueioIntervalo[key] === "",
				)
			},

      desativarSalvarLiberarUsuario(){
        return Object.keys(this.liberacaoUsuario).some(
          (key) => this.liberacaoUsuario[key] === null || this.liberacaoUsuario[key] === "",
        ) || this.usuariosPrLiberar.length <= 0
      },

			folhaAtual() {
				let dia_atual = this.$dayjs().date()
				let diaAbertura = this.folha.diaAbertura
				let data_inicio
				let data_fim

				if (diaAbertura !== null && diaAbertura !== "") {
					if (dia_atual < diaAbertura) {
						data_inicio = this.$dayjs().subtract(1, "month").date(diaAbertura).format("YYYY-MM-DD")
						data_fim = this.$dayjs().date(diaAbertura).subtract(1, "day").format("YYYY-MM-DD")
					} else {
						data_inicio = this.$dayjs().date(diaAbertura).format("YYYY-MM-DD")
						data_fim = this.$dayjs()
							.add(1, "month")
							.date(diaAbertura)
							.subtract(1, "day")
							.format("YYYY-MM-DD")
					}

					return `${this.$dayjs(data_inicio).format("DD/MM/YYYY")} até ${this.$dayjs(
						data_fim,
					).format("DD/MM/YYYY")}`
				}
				return null
			},
		},

		async created() {
			await this.buscarConfiguracao()
		},
		methods: {
			async buscarConfiguracao() {
				let resp = await this.$axios.$get("/hora_extra/configuracao")

				if (!resp.falha) {
					let dados = resp.dados.configuracao

					if (dados.data_inicio_inter_agend !== null && dados.data_fim_inter_agend) {
						this.diasIntervalo = [
							{
								dia: parseInt(dados.data_inicio_inter_agend),
								nome: this.diasSemana.filter(
									(o) => o.dia === parseInt(dados.data_inicio_inter_agend),
								)[0].nome,
							},
							{
								dia: parseInt(dados.data_fim_inter_agend),
								nome: this.diasSemana.filter(
									(o) => o.dia === parseInt(dados.data_fim_inter_agend),
								)[0].nome,
							},
						]
					}
					this.intervalo.horaAbertura = dados.hora_inicio_inter_agend
					this.intervalo.horaFechamento = dados.hora_fim_inter_agend

					if (dados.data_inicio_inter_aprov !== null && dados.data_fim_inter_aprov) {
						this.diasIntervaloAprovacao = [
							{
								dia: parseInt(dados.data_inicio_inter_aprov),
								nome: this.diasSemana.filter(
									(o) => o.dia === parseInt(dados.data_inicio_inter_aprov),
								)[0].nome,
							},
							{
								dia: parseInt(dados.data_fim_inter_aprov),
								nome: this.diasSemana.filter(
									(o) => o.dia === parseInt(dados.data_fim_inter_aprov),
								)[0].nome,
							},
						]
					}
					this.intervaloAprovacao.horaAbertura = dados.hora_inicio_inter_aprov
					this.intervaloAprovacao.horaFechamento = dados.hora_fim_inter_aprov

					this.folha.diaAbertura = dados.data_abertura_folha

					console.log(dados)

					this.limiteHe.limite_hora_extra = dados.limite_hora_extra
					this.limiteHe.limite_he_agendamento = dados.limite_he_agendamento

          this.ultimaLiberacao.data_ultima_liberacao = dados.data_ultima_liberacao
          this.ultimaLiberacao.liberado_por = dados.liberado_por
				}
			},

			// Intervalo de AGENDAMENTO
			estaNoIntevalo(item) {
				if (this.diasIntervalo.length === 2) {
					let diaAbertura = this.diasIntervalo[0].dia
					let diaFechamento = this.diasIntervalo[1].dia

					return this.$dayjs()
						.day(item)
						.isBetween(this.$dayjs().day(diaAbertura), this.$dayjs().day(diaFechamento), null, "[]")
				}
				return false
			},

			async salvarIntervaloAgendamento() {
				let data_inicio_inter_agend = this.diasIntervalo[0].dia
				let data_fim_inter_agend = this.diasIntervalo[1].dia

				let hora_inicio_inter_agend = this.intervalo.horaAbertura
				let hora_fim_inter_agend = this.intervalo.horaFechamento

				let resp = await this.$axios.$post("/hora_extra/configuracao/intervalo_agendamento", {
					data_inicio_inter_agend,
					data_fim_inter_agend,
					hora_inicio_inter_agend,
					hora_fim_inter_agend,
				})

				if (!resp.falha) {
					console.log(resp)
					this.mostrarAlerta = true
					this.textoAlerta = "Intervalo de Agendamento configurado com sucesso!"
				}
			},

			adicionarAoIntervalo(item) {
        let diasIntervalo = this.diasIntervalo.map(o => o.dia)

				if (diasIntervalo.includes(item.dia)) {
					let idx = this.diasIntervalo.findIndex((o) => o.dia === item.dia)

					this.diasIntervalo.splice(idx, 1)
				} else {
					if (this.diasIntervalo.length < 2) {
						this.diasIntervalo.push(item)
						this.diasIntervalo = this.diasIntervalo.sort((a, b) => {
							return a.dia - b.dia
						})
					}
				}
			},

			// Intervalo de APROVACAO

			estaNoIntevaloAprovacao(item) {
				if (this.diasIntervaloAprovacao.length === 2) {
					let diaAbertura = this.diasIntervaloAprovacao[0].dia
					let diaFechamento = this.diasIntervaloAprovacao[1].dia

					return this.$dayjs()
						.day(item)
						.isBetween(this.$dayjs().day(diaAbertura), this.$dayjs().day(diaFechamento), null, "[]")
				}
				return false
			},

			async salvarIntervaloAprovacao() {
				let data_inicio_inter_aprov = this.diasIntervaloAprovacao[0].dia
				let data_fim_inter_aprov = this.diasIntervaloAprovacao[1].dia

				let hora_inicio_inter_aprov = this.intervaloAprovacao.horaAbertura
				let hora_fim_inter_aprov = this.intervaloAprovacao.horaFechamento

				let resp = await this.$axios.$post("/hora_extra/configuracao/intervalo_aprovacao", {
					data_inicio_inter_aprov,
					data_fim_inter_aprov,
					hora_inicio_inter_aprov,
					hora_fim_inter_aprov,
				})

				if (!resp.falha) {
					this.mostrarAlerta = true
					this.textoAlerta = "Intervalo de Aprovação configurado com sucesso!"
				}
			},

			adicionarAoIntervaloAprovacao(item) {
        let diasIntervaloAprovacao = this.diasIntervaloAprovacao.map(o => o.dia)

				if (diasIntervaloAprovacao.includes(item.dia)) {
					let idx = this.diasIntervaloAprovacao.findIndex((o) => o === item)

					this.diasIntervaloAprovacao.splice(idx, 1)
				} else {
					if (this.diasIntervaloAprovacao.length < 2) {
						this.diasIntervaloAprovacao.push(item)
						this.diasIntervaloAprovacao = this.diasIntervaloAprovacao.sort((a, b) => {
							return a.dia - b.dia
						})
					}
				}
			},

			// Data de Abertura FOLHA

			async salvarDataFolha() {
				let data_abertura_folha = this.folha.diaAbertura

				let resp = await this.$axios.$post("/hora_extra/configuracao/data_abertura_folha", {
					data_abertura_folha,
				})

				if (!resp.falha) {
					this.mostrarAlerta = true
					this.textoAlerta = "Data de abertura da Folha configurada com sucesso!"
				}
			},

			// Limite de he para AGENDAMENTO e APROVACAO

			async salvarLimiteHe() {
				let { limite_he_agendamento, limite_hora_extra } = this.limiteHe

				let resp = await this.$axios.$post("/hora_extra/configuracao/limite_he", {
					limite_he_agendamento,
					limite_hora_extra,
				})

				if (!resp.falha) {
					this.mostrarAlerta = true
					this.textoAlerta = "Limite de HE configurada com sucesso!"
				}
			},

			// Bloqueio de INTERVALO para agendamento

			async buscarBloqueios() {
				let resp = await this.$axios.$get("/hora_extra/configuracao/bloqueios")

				if (!resp.falha) {
					let dados = resp.dados

					console.log(dados)

					this.buscouBloqueio = true

          if(dados.bloqueioHE !== null)
            this.ultimoBloqueioHe = dados.bloqueioHE
				}
			},

			async salvarBloqueioIntervalor() {
				let { data_inicio, data_fim, hora_inicio, hora_fim } = this.bloqueioIntervalo

				let bloqueado_por_id = this.$auth.user.id

				let resp = await this.$axios.$post("/hora_extra/configuracao/bloqueio_intervalo", {
					data_inicio,
					data_fim,
					hora_inicio,
					hora_fim,
					bloqueado_por_id,
				})

				if (!resp.falha) {
					console.log(resp)
					let dados = resp.dados.bloqueio
					dados["Usuario"] = { nome: this.$auth.user.nome }

					this.ultimoBloqueioHe = dados

					this.mostrarAlerta = true
					this.textoAlerta = "Bloqueio de Intervalo configurado com sucesso"
				}
			},

			// LIBERAR usuarios

			async buscarUsuarios() {
				let resp = await this.$axios.$get("/usuarios/ativos")

				if (!resp.falha) {
					let usuarios = resp.dados.usuarios

					this.usuarios = usuarios
          this.totalItens = this.usuarios.length
				}
			},

      async liberarUsuarios(){
        let { hora_inicio, hora_fim } = this.liberacaoUsuario
        let usuario_id = this.$auth.user.id
        let usuarios = this.usuariosPrLiberar



        await this.$axios.$post("/hora_extra/configuracao/liberar_usuarios", {
          usuarios,
          usuario_id,
          hora_inicio,
          hora_fim,
        })

        let hoje = this.$dayjs().format("YYYY-MM-DD")

        for(let usuario of usuarios){
          let idx = this.usuarios.findIndex( o => o.id === usuario )
          if(idx >= 0){
            this.usuarios[idx].data_liberacao = hoje
            this.usuarios[idx].hora_inicio_liberacao = hora_inicio
            this.usuarios[idx].hora_fim_liberacao = hora_fim
          }
        }

        this.ultimaLiberacao.data_ultima_liberacao = this.$dayjs().format("YYYY-MM-DD HH:mm:ss")
        this.ultimaLiberacao.liberado_por = { nomme: this.$auth.user.nome }
        this.mostrarAlerta = true
        this.textoAlerta = "Bloqueio de Intervalo configurado com sucesso"
      },

      selecionarTodosLiberacao(){
        if(!this.selecionandoTodos){
          this.usuariosPrLiberar = this.usuarios.map( o => o.id )
        }else{
          this.usuariosPrLiberar = []
        }
      }
		},

		watch: {
			"folha.diaAbertura"(valor) {
				if (valor > 31) this.folha.diaAbertura = 31
			},

			tab(valor) {
				if (valor === "bloquear") {
					if (this.buscouBloqueio === false) {
						this.buscarBloqueios()
					}
				} else if (valor === "liberar") {
					if (this.buscouUsuarios === false) {
						this.buscarUsuarios()
					}
				}
			},
		},
	}
</script>

<style scoped></style>
