<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			titulo="KPI de Rotas"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="relative">
					<div
						class="w-full h-full absolute bg-slate-700 z-10 justify-center items-center flex flex-col print:hidden"
						v-if="imprimindo">
						<div class="square-circle-5"></div>
						<span class="text-4xl text-white font-bold">Imprimindo, por favor aguarde...</span>
					</div>
					<div
						class="max-h-[700px] overflow-y-auto print:overflow-visible flex flex-col gap-2 px-2">
						<div
							id="imprimir"
							class="w-full hidden print:flex">
							<div
								class="bg-primaria-700 p-1 text-white flex justify-between items-center print:flex print:w-[1600px] w-[1800px]">
								<img
									src="@/assets/img/logoagcnovo.png"
									alt=""
									class="" />
								<div class="flex flex-col text-center">
									<span>TRANSPORTE - GNA II</span>
								</div>
								<div class="flex flex-col">
									<span>Atualização: {{ $dayjs().format("DD/MM/YYYY") }}</span>
									<span>
										Proxima atualização: {{ $dayjs().add(7, "days").format("DD/MM/YYYY") }}
									</span>
								</div>
							</div>
						</div>
						<div class="grafico">
							<div class="flex w-full items-center print:w-[1600px]">
								<div class="flex flex-col text-center border border-gray-600 p-3 text-3xl rounded">
									<span>TOTAL</span>
									<span>
										<strong>{{ porcentagemDiurno.toFixed(2) }} %</strong>
									</span>
								</div>
								<span class="text-2xl grow text-center"
									>TAXA DE OCUPAÇÃO <strong>DIURNA</strong></span
								>
								<div
									class="flex flex-col text-center border border-gray-600 p-2 text-xl rounded self-start">
									<span>N° de Rotas</span>
									<span>
										<strong>{{ totalRotasDiurno }}</strong>
									</span>
								</div>
							</div>
							<div
								class="p-1 !w-full !h-full flex print:!flex"
								id="rotasDiurno"
								style="width: 1500px; min-height: 400px"></div>
						</div>
						<div
							id="imprimir"
							class="w-full hidden print:flex">
							<div
								class="bg-primaria-700 p-1 text-white flex justify-between items-center print:flex print:w-[1600px] w-[1800px]">
								<img
									src="@/assets/img/logoagcnovo.png"
									alt=""
									class="" />
								<div class="flex flex-col text-center">
									<span>TRANSPORTE - GNA II</span>
								</div>
								<div class="flex flex-col">
									<span>Atualização: {{ $dayjs().format("DD/MM/YYYY") }}</span>
									<span>
										Proxima atualização: {{ $dayjs().add(7, "days").format("DD/MM/YYYY") }}
									</span>
								</div>
							</div>
						</div>
						<div class="grafico">
							<div class="flex w-full items-center print:w-[1600px]">
								<div class="flex flex-col text-center border border-gray-600 p-3 text-3xl rounded">
									<span>TOTAL</span>
									<span>
										<strong>{{ porcentagemNoturno.toFixed(2) }} %</strong>
									</span>
								</div>
								<span class="text-2xl grow text-center">
									TAXA DE OCUPAÇÃO <strong>NOTURNA</strong>
								</span>
								<div
									class="flex flex-col text-center border border-gray-600 p-2 text-xl rounded self-start">
									<span>N° de Rotas</span>
									<span>
										<strong>{{ totalRotasNoturno }}</strong>
									</span>
								</div>
							</div>
							<div
								class="p-1 !w-full !h-full flex print:!flex"
								id="rotasNoturno"
								style="width: 1500px; min-height: 400px"></div>
						</div>
						<div
							id="imprimir"
							class="w-full hidden print:flex">
							<div
								class="bg-primaria-700 p-1 text-white flex justify-between items-center print:flex print:w-[1600px] w-[1800px]">
								<img
									src="@/assets/img/logoagcnovo.png"
									alt=""
									class="" />
								<div class="flex flex-col text-center">
									<span>TRANSPORTE - GNA II</span>
								</div>
								<div class="flex flex-col">
									<span>Atualização: {{ $dayjs().format("DD/MM/YYYY") }}</span>
									<span>
										Proxima atualização: {{ $dayjs().add(7, "days").format("DD/MM/YYYY") }}
									</span>
								</div>
							</div>
						</div>
						<div class="grafico">
							<div class="flex w-full items-center print:w-[1600px]">
								<div class="flex flex-col text-center border border-gray-600 p-3 text-3xl rounded">
									<span>TOTAL</span>
									<span>
										<strong>{{ porcentagemGeral.toFixed(2) }} %</strong>
									</span>
								</div>
								<span class="text-2xl grow text-center">
									TAXA DE OCUPAÇÃO <strong>GERAL</strong>
								</span>
								<div
									class="flex flex-col text-center border border-gray-600 p-2 text-xl rounded self-start">
									<span>N° de Rotas</span>
									<span>
										<strong>{{ totalRotas }}</strong>
									</span>
								</div>
							</div>
							<div
								class="p-1 !w-full !h-full flex print:!flex"
								id="rotasGeral"
								style="width: 1500px; min-height: 400px"></div>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<BotaoPadrao
					texto="imprimir"
					@clique="imprimir()">
					<img
						src="@/assets/icons/printer-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import * as echarts from "echarts"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		components: { BotaoPadrao, BaseDialog },
		data() {
			return {
				option: {
					color: ["#184e77", "#52b69a"],
					legend: {
						textStyle: {
							fontSize: 18,
						},
					},
					tooltip: {
						trigger: "axis",
						axisPointer: {
							type: "cross",
							crossStyle: {
								color: "#999",
							},
						},
					},
					xAxis: {
						name: "N° da rota",
						type: "category",
						axisLabel: { interval: 0, rotate: 30, fontSize: 16, margin: 12 },
						data: [],
						splitArea: {
							show: true,
							areaStyle: {
								color: ["rgba(255,255,255, 0.5)", "rgba(190,190,190, 0.5)"],
							},
						},
					},
					yAxis: {
						name: "Porcentagem",
						type: "value",
						axisLabel: {
							fontSize: 16,
							formatter: function (value) {
								return value + "%"
							},
						},
						nameTextStyle: { fontSize: 16 },
						max: 100,
					},
					series: [
						{
							data: [],
							type: "bar",
							label: {
								show: true,
								position: "outside",
								fontWeight: "600",
								fontSize: 14,
								formatter: (params) => {
									return parseInt(params.value) > 0 ? params.value : ""
								},
							},
						},
						{
							name: "Meta",
							data: [],
							type: "line",
							lineStyle: {
								width: 5,
							},
							symbol: "none",
							xAxis: {
								boundaryGap: false,
							},
						},
					],
					grid: {
						left: 12,
						right: 2,
						bottom: 0,
						containLabel: true,
					},
				},
				graficoRotasGeral: null,
				graficoRotasDiurno: null,
				graficoRotasNoturno: null,
				totalRotas: 0,
				totalRotasDiurno: 0,
				totalRotasNoturno: 0,
				porcentagemGeral: 0,
				porcentagemDiurno: 0,
				porcentagemNoturno: 0,
				imprimindo: false,
			}
		},
		mounted() {
			this.buscarRotas()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarRotas() {
				let resp = await this.$axios.$get("/transporte/rotas/relatorio", {
					params: { filtros: { turno: 0 } },
				})

				if (!resp.falha) {
					let { rotas } = resp.dados

					let rotasDiurno = rotas.filter((o) => o.turno === "diurno")
					let rotasNoturno = rotas.filter((o) => o.turno === "noturno")
					this.totalRotas = rotas.length
					this.totalRotasDiurno = rotasDiurno.length
					this.totalRotasNoturno = rotasNoturno.length

					this.porcentagemDiurno =
						rotasDiurno.reduce((resultado, valor) => resultado + parseFloat(valor.porcentagem), 0) /
						rotasDiurno.length
					this.porcentagemNoturno =
						rotasNoturno.reduce(
							(resultado, valor) => resultado + parseFloat(valor.porcentagem),
							0,
						) / rotasNoturno.length
					this.porcentagemGeral =
						rotas.reduce((resultado, valor) => resultado + parseFloat(valor.porcentagem), 0) /
						rotas.length

					let graficoRotasDiurno = echarts.init(document.getElementById("rotasDiurno"))
					this.graficoRotasDiurno = graficoRotasDiurno
					let optionDiurno = Object.assign({}, this.option)
					optionDiurno.xAxis.data = rotasDiurno.map((o) => o.nome)
					optionDiurno.color[0] = "#00b4d8"
					optionDiurno.series[0].data = rotasDiurno.map((o) => parseFloat(o.porcentagem).toFixed(1))
					optionDiurno.series[1].data = rotasDiurno.map(() => 90)

					optionDiurno && graficoRotasDiurno.setOption(optionDiurno)

					let graficoRotasNoturno = echarts.init(document.getElementById("rotasNoturno"))
					this.graficoRotasNoturno = graficoRotasNoturno
					let optionNoturno = Object.assign({}, this.option)
					optionDiurno.color[0] = "#184e77"
					optionNoturno.xAxis.data = rotasNoturno.map((o) => o.nome)
					optionNoturno.series[0].data = rotasNoturno.map((o) =>
						parseFloat(o.porcentagem).toFixed(1),
					)
					optionNoturno.series[1].data = rotasNoturno.map(() => 90)

					optionNoturno && graficoRotasNoturno.setOption(optionNoturno)

					let graficoRotasGeral = echarts.init(document.getElementById("rotasGeral"))
					this.graficoRotasGeral = graficoRotasGeral
					let optionGeral = Object.assign({}, this.option)
					optionGeral.xAxis.data = rotas.map((o) => o.nome)
					optionGeral.series[0].data = rotas.map((o) => {
						return {
							value: parseFloat(o.porcentagem).toFixed(1),
							itemStyle: {
								color: o.turno === "diurno" ? "#00b4d8" : "noturno" ? "#184e77" : "#df1c1c",
							},
						}
					})
					optionGeral.series[1].data = rotas.map(() => 90)

					optionGeral && graficoRotasGeral.setOption(optionGeral)
				}
			},
			imprimir() {
				this.imprimindo = true
				let graficoDiurno = this.graficoRotasDiurno
				let graficoNotuno = this.graficoRotasNoturno
				let graficoGeral = this.graficoRotasGeral

				let tamanhosDiurno = {
					width: graficoDiurno.getWidth(),
					height: graficoDiurno.getHeight(),
				}

				let tamanhosNoturno = {
					width: graficoDiurno.getWidth(),
					height: graficoNotuno.getHeight(),
				}

				let tamanhosGeral = {
					width: graficoGeral.getWidth(),
					height: graficoGeral.getHeight(),
				}

				graficoDiurno.resize({ width: 1600, height: 900 })
				graficoNotuno.resize({ width: 1600, height: 900 })
				graficoGeral.resize({ width: 1600, height: 900 })

				setTimeout(() => {
					window.print()
					graficoDiurno.resize({ width: tamanhosDiurno.width, height: tamanhosDiurno.height })
					graficoNotuno.resize({ width: tamanhosNoturno.width, height: tamanhosNoturno.height })
					graficoGeral.resize({ width: tamanhosGeral.width, height: tamanhosGeral.height })
					this.imprimindo = false
				}, 800)
			},
		},
	}
</script>

<style scoped>
	#imprimir {
		page-break-before: always;
	}
	.grafico {
		border: 1px solid black;
		padding: 0.25rem;
	}

	.square-circle-5 {
		width: 65px;
		aspect-ratio: 1;
		position: relative;
	}

	.square-circle-5:before,
	.square-circle-5:after {
		content: "";
		position: absolute;
		border-radius: 50px;
		box-shadow: 0 0 0 3px inset #fff;
		animation: sc5 2.5s infinite;
	}

	.square-circle-5:after {
		animation-delay: -1.25s;
		border-radius: 0;
	}

	@keyframes sc5 {
		0% {
			inset: 0 35px 35px 0;
		}
		12.5% {
			inset: 0 35px 0 0;
		}
		25% {
			inset: 35px 35px 0 0;
		}
		37.5% {
			inset: 35px 0 0 0;
		}
		50% {
			inset: 35px 0 0 35px;
		}
		62.5% {
			inset: 0 0 0 35px;
		}
		75% {
			inset: 0 0 35px 35px;
		}
		87.5% {
			inset: 0 0 35px 0;
		}
		100% {
			inset: 0 35px 35px 0;
		}
	}
</style>
