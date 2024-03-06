<template>
	<div class="w-full">
    <CabecalhoPagina titulo="CONFIGURAÇÕES" />
		<div  class="!mt-11">
			<div class="flex flex-col gap-y-2">
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
									@clique="salvarIntervaloAgendamento">
									<img
										src="../../../../../assets/icons/save-w.svg"
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
												estaNoIntevaloAprovacao(dia.dia) || diasIntervaloAprovacao.includes(dia),
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
											intervaloAprovacao.horaAbertura ? `- ${intervaloAprovacao.horaAbertura}` : ""
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
									@clique="salvarIntervaloAprovacao()"
									class="text-white">
									<img
										src="../../../../../assets/icons/save-w.svg"
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
									@clique="salvarDataFolha()"
									class="text-white">
									<img
										src="../../../../../assets/icons/save-w.svg"
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
									src="../../../../../assets/icons/information-circle-g.svg"
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
										Limite máximo de hora extra para conseguir agendar, passando desse limite não
										será realizado o <strong>agendamento</strong>.
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
								@clique="salvarLimiteHe"
								cor="bg-primaria-300 hover:bg-primaria-500">
								<img
									src="../../../../../assets/icons/save-w.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
					</div>
				</div>
			</div>
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
  import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

	export default {
		components: {
      CabecalhoPagina,
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
					hora_fim: null,
				},
				ultimaLiberacao: {},
				selecionandoTodos: false,
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

			desativarSalvarLiberarUsuario() {
				return (
					Object.keys(this.liberacaoUsuario).some(
						(key) => this.liberacaoUsuario[key] === null || this.liberacaoUsuario[key] === "",
					) || this.usuariosPrLiberar.length <= 0
				)
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
				let diasIntervalo = this.diasIntervalo.map((o) => o.dia)

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
				let diasIntervaloAprovacao = this.diasIntervaloAprovacao.map((o) => o.dia)

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
		},

		watch: {
			"folha.diaAbertura"(valor) {
				if (valor > 31) this.folha.diaAbertura = 31
			},
		},
	}
</script>

<style scoped></style>
