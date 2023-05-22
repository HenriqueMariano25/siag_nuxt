<template>
	<div class="w-full flex flex-col gap-y-1 print:-m-3 print:-mt-4">
		<div class="flex bg-white p-1 gap-2 justify-between border border-gray-300 shadow print:hidden">
			<div class="flex">
				<div class="flex items-end gap-2">
					<BotaoPadrao
						texto="imprimir"
						cor="bg-blue-300 !hover:bg-blue-400"
						:disabled="!buscouDados"
						@click="mostrarDialogAgendadosSPresenca = true">
						<img
							src="@/assets/icons/printer-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="Lista de funcionários"
						cor="bg-blue-300 !hover:bg-blue-400"
						:disabled="!buscouDados"
						@click="listaFuncionarios()">
						<img
							src="@/assets/icons/list-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</div>
			<div class="flex gap-2">
				<AppFormInput
					id="data"
					type="date"
					v-model="data"
					label="Data" />
				<div class="flex items-end">
					<BotaoPadrao
						texto="Gerar kpi"
						@click="gerarKpi()"
						cor="bg-gray-900 text-white"></BotaoPadrao>
				</div>
			</div>
		</div>
		<div class="border border-gray-300 shadow relative h-full print:hidden">
			<AppTabs
				:tabs="tabs"
				@tab="tab = $event">
				<template v-slot:[`tab.agend_s_presenca`]="{ item }">
					<div class="flex divide-x divide-gray-800" v-show="buscouDados">
						<div class="w-5/12 flex flex-col items-center">
							<div class="flex w-full gap-2 p-2 justify-center">
								<div
									class="text-center flex flex-col text-xl divide-y divide-gray-800 border border-gray-500 px-2 w-32">
									<span class="p-2">Agendados</span>
									<span class="p-2"
										><strong>{{ agendSPresenca.totalAgend }}</strong></span
									>
								</div>
								<div
									class="text-center flex flex-col text-xl divide-y divide-gray-800 border border-gray-500 h-auto px-2 w-32">
									<span class="p-2">Ausentes</span>
									<span class="p-2"
										><strong>{{ agendSPresenca.totalAusente }}</strong></span
									>
								</div>
								<div
									class="text-center flex flex-col text-xl divide-y divide-gray-800 border border-gray-500 h-auto px-2 w-32">
									<span class="p-2">MOD</span>
									<span class="p-2"
										><strong>{{ agendSPresenca.direto }}</strong></span
									>
								</div>
								<div
									class="text-center flex flex-col text-xl divide-y divide-gray-800 border border-gray-500 h-auto px-2 w-32">
									<span class="p-2">MOI</span>
									<span class="p-2"
										><strong>{{ agendSPresenca.indireto }}</strong></span
									>
								</div>
							</div>
							<div class="w-full h-full flex justify-center items-center">
								<div class="w-[580px] h-[480px]">
									<ApexChart
										class=""
										type="pie"
										:options="opcoesGraSemPresencaPorSetor"
										:series="valoresGraSemPresencaPorSetor"
										id="graSemPresencaPorSetor" />
								</div>
							</div>
						</div>
						<div class="flex w-7/12" style="height: calc(100vh - 130px) ">
							<div class="w-full grid grid-cols-1 divide-y divide-gray-800" >
								<div class="flex w-full grow">
                  <div ref="graSemPresencaQuantSetor" class="flex  w-full !h-[200px]"></div>
								</div>
								<div class="flex h-[300px] w-full ">
                  <div ref="graSemPresencaCargosQuant" class="flex  w-full !h-[200px]"></div>
								</div>
							</div>
						</div>
					</div>
					<div
						class="flex w-full h-full absolute top-0 items-center justify-center bg-gray-700/70 gerandoKpi"
						v-if="gerandoKpi">
						<div class="p-2 bg-gray-800 rounded">
							<h1 class="text-4xl text-white">Gerando KPI, favor aguarde...</h1>
						</div>
					</div>
					<!--					<div-->
					<!--						class="bg-primaria-700 text-white flex w-full justify-between p-1 items-center hidden print:flex">-->
					<!--						<span class="text-sm self-start">Gerado em: {{ $dayjs().format("DD/MM/YYYY") }}</span>-->
					<!--						<span class="text-xl"-->
					<!--							>Agendados Sem Presença - {{ $dayjs(data).format("DD/MM/YYYY") }}-->
					<!--						</span>-->
					<!--						<img-->
					<!--							src="../../../../../assets/img/logoagcnovo.png"-->
					<!--							height="52"-->
					<!--							width="250" />-->
					<!--					</div>-->
					<!--					<div-->
					<!--						class="agend_s_presenca flex-col w-full bg-white divide-y divide-gray-700"-->
					<!--						:class="{ flex: buscouDados === true, hidden: buscouDados === false }">-->
					<!--					</div>-->
				</template>
			</AppTabs>
		</div>
		<DialogImprimirAgendadoSPresenca
			v-if="mostrarDialogAgendadosSPresenca"
			@cancelar="mostrarDialogAgendadosSPresenca = false"
			:dados="dadosGraAgendadoSPresenca" />
	</div>
</template>

<script>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import Chart from "chart.js/auto"
	import gerarExcel from "~/functions/gerarExcel"
	import DialogImprimirAgendadoSPresenca from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialogImprimirAgendadoSPresenca.vue"

	export default {
		components: { DialogImprimirAgendadoSPresenca, AppTabs, BotaoPadrao, AppFormInput },
		data() {
			return {
				mostrarDialogAgendadosSPresenca: false,

				valoresGraSemPresencaPorSetor: [3],
				opcoesGraSemPresencaPorSetor: {
					chart: {
						type: "pie",
					},
					title: {
						text: "Funcionários ausentes por setor",
						align: "center",
					},
					labels: [],
					legend: {
						position: "top",
					},
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
              colors: ["#304758"]
            }
          },
					responsive: [
						{
							breakpoint: 480,
							options: {
								legend: {
									position: "bottom",
								},
							},
						},
					],
				},

				valoresGraSemPresencaQuantSetor: [],
				opcoesGraSemPresencaQuantSetor: {
					chart: {
						type: "bar",
            height: 280,
					},
					title: {
						text: "Funcionários total/ausentes por setor",
						align: "center",
					},
          exporting: {
            enabled: false,
          },
					legend: {
						position: "top",
					},
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
              colors: ["#304758"]
            }
          },
					labels: [],
					responsive: [
						{
							breakpoint: 480,
							options: {
								legend: {
									position: "bottom",
								},
							},
						},
					],
				},

				valoresGraSemPresencaCargosQuant: [],
				opcoesGraSemPresencaCargosQuant: {
					chart: {
						type: "bar",
            height: 280,
					},
					title: {
						text: "Ausencias por função",
						align: "center",
					},
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
              colors: ["#304758"]
            }
          },
					labels: [],
          exporting: {
            enabled: false,
          },
					responsive: [
						{
							breakpoint: 480,
							options: {
								chart: {
									width: 200,
								},
								legend: {
									position: "bottom",
								},
							},
						},
					],
				},

				data: null,
				tabs: [
					{ nome: "Agendados s/ Presença", valor: "agend_s_presenca" },
					{ nome: "Presentes s/ Agendamento", valor: "pres_s_agendamento" },
				],
				agendSPresenca: {
					totalAgend: 0,
					totalAusente: 0,
					direto: 0,
					indireto: 0,
				},
				graficosCriados: false,
				gerandoKpi: false,
				buscouDados: false,
				funcionariosAgendados: [],
			}
		},

		computed: {
			dadosGraAgendadoSPresenca() {
				let agendSPresenca = this.agendSPresenca

				let valoresGraSemPresencaPorSetor = this.valoresGraSemPresencaPorSetor
				let opcoesGraSemPresencaPorSetor = this.opcoesGraSemPresencaPorSetor

				let valoresGraSemPresencaQuantSetor = this.valoresGraSemPresencaQuantSetor
				let opcoesGraSemPresencaQuantSetor = this.opcoesGraSemPresencaQuantSetor

				let valoresGraSemPresencaCargosQuant = this.valoresGraSemPresencaCargosQuant
				let opcoesGraSemPresencaCargosQuant = this.opcoesGraSemPresencaCargosQuant

				return {
					valoresGraSemPresencaPorSetor,
					opcoesGraSemPresencaPorSetor,
					valoresGraSemPresencaQuantSetor,
					opcoesGraSemPresencaQuantSetor,
					valoresGraSemPresencaCargosQuant,
					opcoesGraSemPresencaCargosQuant,
					agendSPresenca,
				}
			},
		},
		methods: {
      async renderizarGraSemPresencaCargosQuant(){

        let opcoes = Object.assign({}, this.opcoesGraSemPresencaCargosQuant)

        let valores = this.valoresGraSemPresencaCargosQuant

        const chartContainer = this.$refs.graSemPresencaCargosQuant;

        const chart = new ApexCharts(chartContainer, {
          ...opcoes,

          series: valores,
        });

        await chart.render();
      },

      async renderizarGraSemPresencaQuantSetor() {

        let opcoes = Object.assign({}, this.opcoesGraSemPresencaQuantSetor)

        let valores = this.valoresGraSemPresencaQuantSetor

        const chartContainer = this.$refs.graSemPresencaQuantSetor;

        const chart = new ApexCharts(chartContainer, {
          ...opcoes,
          series: valores,
        });

        await chart.render();
      },


			async imprimir() {
				// let graSemPresencaPorSetor = document.getElementById('graSemPresencaPorSetor')

				// console.log(graSemPresencaPorSetor)
				// graSemPresencaPorSetor.classList.add('graSemPresencaPorSetorImprimir')
				//
				// divs[0].classList.add("!w-[200px]")
				// divs[1].classList.add("!w-[300px]")

				// for (let div of divs) {
				//   div.classList.add("tamanhoImpressao")
				// }
				setTimeout(function () {
					window.print()

					// for (let div of divs) {
					//   div.classList.remove("tamanhoImpressao")
					// }
				}, 500)
			},

			async listaFuncionarios() {
				let funcionarios = this.funcionariosAgendados

				console.log(this.funcionariosAgendados)

				let cabecalho = ["Nome", "Chapa", "Cargo", "Hora do agendamento"]
				let nomeArquivo

				nomeArquivo = "funcionarios"

				let itens = []
				for (let item of funcionarios) {
					let temp = []
					temp.push(item.Funcionario.nome)
					temp.push(item.chapa)
					temp.push(item.Funcionario.cargo)
					temp.push(this.$dayjs(item.createdAt).format("DD/MM/YYYY HH:mm"))
					itens.push(temp)
				}

				gerarExcel(cabecalho, itens, nomeArquivo)
			},
			async gerarKpi() {
				this.gerandoKpi = true
				let data = this.data

				let resp = await this.$axios.$get("/hora_extra/kpi/presentes_nao_presente", {
					params: { data },
				})

				if (!resp.falha) {
					this.buscouDados = true
					let dados = resp.dados
					console.log(dados)

					this.agendSPresenca.totalAgend = dados.agendamentos.length
					let chapasAgend = dados.agendamentos.map((o) => o.chapa)
					let chapasPresentes = dados.presentes.map((o) => o.chapa)

					// Separa os agendamento sem presença
					let semPresenca = dados.agendamentos.filter((o) => !chapasPresentes.includes(o.chapa))
					console.log("semPresenca")
					console.log(semPresenca)
					this.funcionariosAgendados = semPresenca

					this.agendSPresenca.totalAusente = semPresenca.length
					this.agendSPresenca.direto = semPresenca.filter(
						(o) => o.Funcionario.direto_indireto === "D",
					).length
					this.agendSPresenca.indireto = semPresenca.filter(
						(o) => o.Funcionario.direto_indireto === "I",
					).length

					// Conta a ocorrencia de sem presença por setor
					let semPresSetor = semPresenca.reduce((array, valor) => {
						if (valor.Setor && valor.Setor.nome) {
							if (array[valor.Setor.nome]) {
								array[valor.Setor.nome] += 1
							} else {
								array[valor.Setor.nome] = 1
							}
						}
						return array
					}, {})

					// console.log(semPresSetor)
					this.opcoesGraSemPresencaPorSetor = {
						...this.opcoesGraSemPresencaPorSetor,
						labels: [Object.keys(semPresSetor)],
					}
					this.valoresGraSemPresencaPorSetor = [...Object.values(semPresSetor)]

					// await this.grafSemPresencaPorSetor(semPresSetor)

					// Separa quantidade de sem presença com quantidade de funcionario por setor
					let semPresQuantiFunci = [
						{ data: [], label: "Total de Funcionários", backgroundColor: "#014461" },
						{ data: [], label: "Funcionários ausentes", backgroundColor: "#22AA99" },
					]
					for (let sem of Object.keys(semPresSetor)) {
						// console.log(sem)
						semPresQuantiFunci[0].data.push(dados.funciPorSetor[sem])
						semPresQuantiFunci[1].data.push(semPresSetor[sem])
					}

					// console.log(semPresQuanti)
					this.opcoesGraSemPresencaQuantSetor = {
						...this.opcoesGraSemPresencaQuantSetor,
						xaxis: {
							categories: Object.keys(semPresSetor),
						},
					}

					this.valoresGraSemPresencaQuantSetor = [
						{ name: "Total por setor", group: "totalSetor", data: [...semPresQuantiFunci[0].data] },
						{
							name: "Ausentes por setor",
							group: "ausentesSetor",
							data: [...semPresQuantiFunci[1].data],
						},
					]

					let todosCargos = semPresenca.map((o) => o.Funcionario.cargo)
					// console.log("todosCargos")
					// console.log(todosCargos)

					let cargosContados = todosCargos.reduce((array, valor) => {
						if (array[valor]) {
							array[valor]++
						} else {
							array[valor] = 1
						}
						return array
					}, {})

					this.opcoesGraSemPresencaCargosQuant = {
						...this.opcoesGraSemPresencaCargosQuant,
            yaxis: {
              labels: {
                formatter: function (value) {
                  return Math.floor(value); // Arredonda para o número inteiro mais próximo
                },
              },
            },
						xaxis: {
							categories: Object.keys(cargosContados),
							labels: {
								formatter: function (value) {
									let textoDivido = value.split(" ")
                  textoDivido[0] = textoDivido[0].length > 6 ? `${textoDivido[0].substr(0, 5)}${textoDivido[0].length > 5 ? "." : ""}` : textoDivido[0]
									let textoFinal = textoDivido.join(" ")
									return `${textoFinal}`
								},
								rotate: -45,
                rotateAlways: false
							},
						},
					}



					// console.log(Object.values(cargosContados))

					this.valoresGraSemPresencaCargosQuant = [
						{
							name: "Quant. por cargos",
							group: "quantCargo",
							data: [...Object.values(cargosContados)],
						},
					]

          await this.renderizarGraSemPresencaCargosQuant()
          await this.renderizarGraSemPresencaQuantSetor()

					// Gerar ou atualiza grafico de Quantidade de Funcionarios / ausentes por setor
					// await this.grafSemPresencaQuantSetor(semPresSetor, semPresQuantiFunci)

					// if (this.graficosCriados === false) this.graficosCriados = true

					this.gerandoKpi = false
				}
			},

			async grafSemPresencaPorSetor(itens) {
				let labels = Object.keys(itens)
				let valores = Object.values(itens)

				if (this.graficosCriados === false) {
					const grafSemPresencaPorSetor = document
						.getElementById("grafSemPresencaPorSetor")
						.getContext("2d")

					const meuGrafSemPresencaPorSetor = new Chart(grafSemPresencaPorSetor, {
						type: "pie",
						data: {
							labels,
							datasets: [
								{
									label: "Funcionários por dia",
									data: valores,
									backgroundColor: [
										"#22AA99",
										"#316395",
										"#014461",
										"#DC3912",
										"#AAAA11",
										"#DD4477",
										"#994499",
										"#0099C6",
										"#FFD700",
										"#5C6185",
										"#66AA00",
									],
								},
							],
						},
						options: {
							plugins: {
								tooltips: {
									enabled: false,
								},
								datalabels: {
									anchor: "end",
									align: "start",
									offset: "30",
									formatter: (value, ctx) => {
										let sum = 0
										let dataArr = valores
										dataArr.map((data) => {
											sum += parseFloat(data)
										})
										let percentage = ((value * 100) / sum).toFixed(0) + "%"
										return percentage
									},
									color: "#fff",
								},
								legend: {
									position: "top",
								},
								title: {
									display: true,
									text: "Funcionários ausentes por setor",
								},
							},
							maintainAspectRatio: false,
							scales: {},
							responsive: true,
						},
					})

					meuGrafSemPresencaPorSetor
				} else {
					let chart = Chart.getChart("grafSemPresencaQuantSetor")

					chart.data.datasets[0].data = valores
					chart.data.labels = labels

					chart.update()
				}
			},

			async grafSemPresencaQuantSetor(itens, valores) {
				let labels = Object.keys(itens)

				if (this.graficosCriados === false) {
					const grafSemPresencaQuantSetor = document
						.getElementById("grafSemPresencaQuantSetor")
						.getContext("2d")

					const meuGrafSemPresencaQuantSetor = new Chart(grafSemPresencaQuantSetor, {
						type: "bar",
						data: {
							labels,
							datasets: valores,
						},
						options: {
							plugins: {
								tooltip: {
									callbacks: {
										label: function (context) {
											let titulo = context.dataset.label
											let valor = context.raw
											let idx = context.dataIndex

											if (context.datasetIndex === 1) {
												return `${titulo}: ${valor} - ${
													((valor * 100) / valores[0].data[idx]).toFixed(2) + "%"
												}`
											} else {
												return `${titulo}: ${valor}`
											}
										},
									},
								},
								datalabels: {
									anchor: "end",
									align: "start",
									offset: "-20",
									color: "#000000",
								},
								legend: {
									position: "top",
								},
								title: {
									display: true,
									text: "Quantidade de funcionários / ausentes por setor ",
								},
							},
							maintainAspectRatio: false,
							scales: {},
						},
					})

					meuGrafSemPresencaQuantSetor
				} else {
					let chart = Chart.getChart("meuGrafSemPresencaQuantSetor")

					chart.data.datasets = valores
					chart.data.labels = labels

					chart.update()
				}
			},
		},
	}
</script>

<style scoped>
	.tamanho-relatorio {
		height: calc(100vh - 252px);
		width: 100%;
	}

	.agend_s_presenca {
		height: calc(100vh - 130px);
	}

	.gerandoKpi {
		z-index: 101;
	}

	.tamanhoImpressao:nth-child(1) {
		height: 500px !important;
		width: 400px !important;
	}
	.tamanhoImpressao:nth-child(2) {
		height: 500px !important;
		width: 600px !important;
	}

	@media print {
		.imprimir {
			width: 1050px;
			height: 100%;
			position: fixed;
		}
	}
</style>
