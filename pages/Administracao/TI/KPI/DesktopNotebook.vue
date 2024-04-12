<template>
	<div class="w-full grid h-fit">
		<CabecalhoPagina titulo="KPI DESKTOP/NOTEBOOK" />
		<div
			class="absolute top-0 left-0 w-full h-full bg-slate-700 flex justify-center items-center flex-col gap-2 print:hidden"
			style="z-index: 102"
			v-if="imprimindo">
			<div class="square-circle-5"></div>
			<span class="text-4xl text-white font-bold">Imprimindo, por favor aguarde...</span>
		</div>
		<div
			class="absolute top-0 left-0 w-full h-full bg-blue-400 flex justify-center items-center flex-col gap-2 print:hidden"
			style="z-index: 102"
			v-if="gerandoRelatorio">
			<div class="square-circle-5"></div>
			<span class="text-4xl text-white font-bold">Gerando o relátorio, por favor aguarde...</span>
		</div>

		<div
			class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 p-2 relative"
			id="geral">
			<div class="w-full print:flex hidden">
				<div
					class="bg-primaria-700 p-1 text-white justify-between items-center flex px-2"
					:class="{ 'print:!w-[1800px]': isFirefox, 'print:!w-[1600px]': isChrome }">
					<img
						src="@/assets/img/logoagcnovo.png"
						alt=""
						class="" />
					<div class="flex flex-col text-center">
						<span>QUANTITATIVO DE MÁQUINAS, MONITORES E USUÁRIOS</span>
					</div>
					<div class="flex flex-col">
						<span>Atualização: {{ $dayjs().format("DD/MM/YYYY") }}</span>
						<span> Próxima atualização: {{ $dayjs().date(5).add(30, "days").format("DD/MM/YYYY") }}</span>
					</div>
				</div>
			</div>
			<div
				class="flex gap-2 justify-start"
				:class="{ 'print:!w-[1800px]': isFirefox, 'print:!w-[1400px]': isChrome }">
				<div
					v-if="dados"
					class="flex flex-col gap-2 h-fit border border-gray-900 p-1">
					<div class="total-ativos">
						<span class="titulo-total"> N° de Desktops </span>
						<span class="numero-total">
							{{ valoresDesktop }}
						</span>
					</div>
					<div class="total-ativos">
						<span class="titulo-total"> N° de Notebooks </span>
						<span class="numero-total">
							{{ valoresNotebook }}
						</span>
					</div>
					<div class="total-ativos">
						<span class="titulo-total"> N° de Monitores </span>
						<span class="numero-total">
							{{ valoresMonitor }}
						</span>
					</div>
					<div class="total-ativos">
						<span class="titulo-total"> N° de Usuários </span>
						<span class="numero-total">
							{{ valoresUsuario }}
						</span>
					</div>
				</div>
				<div
					class="p-1 flex border border-gray-900"
					:class="{ 'print:!w-[800px]': isFirefox, 'print:!w-[710px]': isChrome }"
					id="pieTotalAtivo"
					style="min-height: 300px"></div>
				<div
					:class="{ 'print:!w-[800px]': isFirefox, 'print:!w-[710px]': isChrome }"
					class="p-1 flex border border-gray-900"
					id="pieUsuarioPra"
					style="min-height: 300px"></div>
			</div>
			<div
				class="p-1 flex border border-gray-900"
				id="main"
				style="min-height: 300px"></div>
		</div>
		<RodapePagina>
			<div class="w-full flex justify-end">
				<BotaoPadrao
					texto="imprimir"
					@clique="imprimir()">
					<img
						src="@/assets/icons/printer-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</RodapePagina>
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import * as echarts from "echarts"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		components: { BotaoPadrao, RodapePagina, CabecalhoPagina },
		data() {
			return {
				dados: null,
				valoresDesktop: 0,
				valoresNotebook: 0,
				valoresMonitor: 0,
				valoresUsuario: 0,
				valoresPra: 0,
				graficoPieTotalAtivos: null,
				graficoBarra: null,
				graficoPieComparativo: null,
				imprimindo: false,
				gerandoRelatorio: true,
				isChrome: false,
				isFirefox: false,
				isEdge: false,
			}
		},
		mounted() {
			this.buscarKpi()

			let navegador = navigator.userAgent

			if (navegador.indexOf("Chrome") !== -1) {
				this.isChrome = true
			} else if (navegador.indexOf("Firefox") !== -1) {
				this.isFirefox = true
			} else if (navegador.indexOf("Edge") !== -1) {
				this.isEdge = true
			}
		},
		methods: {
			async buscarKpi() {
				let resp = await this.$axios.$get("/ti/kpi/desktop_notebook")

				if (!resp.falha) {
					this.dados = resp.dados.dados

					await this.montarGrafico()
				}
			},
			async montarGrafico() {
				let dados = this.dados
				let dadosFormatados = []

				let setores = dados.map((setor) => Object.keys(setor)[0])
				let valoresDesktop = dados.map((setor) => setor[Object.keys(setor)[0]].desktop)
				this.valoresDesktop = valoresDesktop.reduce((total, numero) => total + numero, 0)

				let valoresNotebook = dados.map((setor) => setor[Object.keys(setor)[0]].notebook)
				this.valoresNotebook = valoresNotebook.reduce((total, numero) => total + numero, 0)

				let valoresMonitor = dados.map((setor) => setor[Object.keys(setor)[0]].monitor)
				this.valoresMonitor = valoresMonitor.reduce((total, numero) => total + numero, 0)

				let valoresUsuario = dados.map((setor) => setor[Object.keys(setor)[0]].usuario)
				this.valoresUsuario = valoresUsuario.reduce((total, numero) => total + numero, 0)

				let valoresPra = dados.map((setor) => setor[Object.keys(setor)[0]].pra)
				this.valoresPra = valoresPra.reduce((total, numero) => total + numero, 0)

				let series = [
					{
						data: valoresDesktop,
						type: "bar",
						stack: "a",
						name: "Desktop",
						label: {
							show: true,
							position: "top",
							formatter: function (params) {
								if (params.seriesType === "bar") {
									return (
										parseInt(valoresDesktop[params.dataIndex]) +
										parseInt(valoresNotebook[params.dataIndex])
									)
								} else {
									return ""
								}
							},
						},
					},
					{
						data: valoresNotebook,
						type: "bar",
						stack: "a",
						name: "Notebook",
						label: {
							show: false,
							position: "top",
						},
					},
					{
						data: valoresMonitor,
						type: "bar",
						name: "Monitor",
						label: {
							show: true,
							position: "top",
							formatter: function (params) {
								if (params.value > 5) {
									return params.value
								} else {
									return ""
								}
							},
						},
					},
					{
						data: valoresUsuario,
						type: "bar",
						name: "Usuario",
						label: {
							show: true,
							position: "top",
						},
					},
					{
						data: valoresPra,
						type: "line",
						name: "Previsto",
					},
				]
				let myChart = echarts.init(document.getElementById("main"))
				this.graficoBarra = myChart
				let option

				for (let dado of dadosFormatados) {
					for (let idx in dado) {
						if (idx != dado.length - 1) {
							if (dado[idx] === 0) {
								dado[idx] = ""
							}
						}
					}
				}

				option = {
					color: ["#f29e4c", "#efea5a", "#83e377", "#0db39e", "#2c699a", "#54478c", "#DF1C1CFF"],
					legend: {
						textStyle: {
							fontSize: 18,
						},
						left: "50%",
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
					title: {
						show: true,
						text: "Quant. de desktop, notebook, monitor e usuários",
					},
					xAxis: {
						type: "category",
						data: setores,
						offset: 5,
						axisTick: {
							length: 10,
						},
						axisLabel: {
							interval: 0,
							rotate: 35,
						},
					},
					yAxis: {
						name: "Total de ativos e usuários",
						axisLabel: { fontSize: 16 },
						nameTextStyle: { fontSize: 16 },
						nameLocation: "middle",
						nameGap: 37,
						min: 0,
					},

					series: series,
					grid: {
						left: 15,
						right: 2,
						bottom: 0,
						containLabel: true,
					},
				}

				option && myChart.setOption(option)
				myChart.resize({ height: 350 })

				//GRAFICO PIE TOTAL DE ATIVOS

				let graficoPie = echarts.init(document.getElementById("pieTotalAtivo"))
				this.graficoPieTotalAtivos = graficoPie
				let seriesGraficoPie = [
					{
						name: "Total de ativos",
						type: "pie",
						radius: ["40%", "70%"],
						label: {
							show: true,
							position: "outer",
							alignTo: "none",
							edgeDistance: "30%",
							bleedMargin: 10,
							distanceToLabelLine: 5,
							formatter: "{b} : {c} - {d}%",
						},
						emphasis: {
							label: {
								show: true,
								fontSize: 18,
								fontWeight: "bold",
							},
						},
						labelLine: {
							show: true,
						},
						data: [
							{ value: this.valoresDesktop, name: "Desktop" },
							{ value: this.valoresNotebook, name: "Notebook" },
							{ value: this.valoresMonitor, name: "Monitor" },
							{ value: this.valoresUsuario, name: "Usuários" },
						],
					},
				]
				let options = {
					color: ["#f29e4c", "#efea5a", "#83e377", "#0db39e", "#2c699a", "#54478c", "#DF1C1CFF"],
					title: {
						text: "Total de ativos",
						left: "left",
					},
					tooltip: {
						trigger: "item",
					},

					legend: {
						orient: "vertical",
						left: "left",
						top: "25px",
					},
					grid: {
						show: false,
						height: "100%",
						width: "auto",
					},
					series: seriesGraficoPie,
				}

				options && graficoPie.setOption(options)
				graficoPie.resize({ width: 710, height: 320 })

				//GRAFICO COMPARANDO USUARIO COM PRA

				let graficoPieUsuarioPra = echarts.init(document.getElementById("pieUsuarioPra"))
				this.graficoPieComparativo = graficoPieUsuarioPra

				let seriesGraficoPieUsuarioPra = [
					{
						name: "Compartivo usuário X previsto",
						type: "pie",
						radius: "50%",
						label: {
							show: true,
							position: "outer",
							alignTo: "none",
							edgeDistance: "30%",
							bleedMargin: 10,
							distanceToLabelLine: 5,
							formatter: "{b} : {c} - {d}%",
						},
						emphasis: {
							label: {
								show: true,
								fontSize: 18,
								fontWeight: "bold",
							},
						},
						labelLine: {
							show: true,
						},
						data: [
							{ value: this.valoresUsuario, name: "Usuários" },
							{ value: this.valoresPra, name: "Previsto" },
						],
					},
				]
				let optionUsuarioPra = {
					color: ["#0db39e", "#2c699a"],
					title: {
						text: "Comparativo usuário X previsto",
						left: "center",
					},
					tooltip: {
						trigger: "item",
					},
					legend: {
						orient: "vertical",
						left: "left",
						top: "25px",
					},
					grid: {
						left: 0,
						right: 0,
						bottom: 0,
						top: 0,
						containLabel: true,
						flexible: true,
					},
					series: seriesGraficoPieUsuarioPra,
				}

				optionUsuarioPra && graficoPieUsuarioPra.setOption(optionUsuarioPra)
				graficoPieUsuarioPra.resize({ width: 650, height: 320 })

				this.gerandoRelatorio = false
			},

			async imprimir() {
				this.imprimindo = true

				let navegador = navigator.userAgent

				let graficoPieTotalAtivos = this.graficoPieTotalAtivos
				let graficoPieComparativo = this.graficoPieComparativo
				let graficoBarra = this.graficoBarra

				let widthOriginalTotalAtivos = graficoPieTotalAtivos.getWidth()
				let heightOriginalTotalAtivos = graficoPieTotalAtivos.getHeight()

				let widthOriginalComparativo = graficoPieComparativo.getWidth()
				let heightOriginalComparativo = graficoPieComparativo.getHeight()

				let widthOriginalBarra = graficoBarra.getWidth()
				let heightOriginalBarra = graficoBarra.getHeight()

				let widthPies
				let heightPies

				let widthBarra
				let heightBarra

				let geral = document.getElementById("geral")

				if (navegador.indexOf("Chrome")) {
					widthPies = 745
					heightPies = 380

					widthBarra = 1570
					heightBarra = 550

					geral.style.width = "1600px"
				} else if (navegador.indexOf("Firefox")) {
					widthPies = 850
					heightPies = 440

					widthBarra = 1750
					heightBarra = 620
					geral.style.width = "1800px"
				}

				graficoPieTotalAtivos.resize({ width: widthPies, height: heightPies })
				graficoPieComparativo.resize({ width: widthPies, height: heightPies })
				graficoBarra.resize({ width: widthBarra, height: heightBarra })

				setTimeout(() => {
          let tituloOriginal = document.title

          document.title = "KPI - Quantitativo de maquinas, monitores e usuarios "
					window.print()

          document.title = tituloOriginal


					graficoPieTotalAtivos.resize({
						width: widthOriginalTotalAtivos,
						height: heightOriginalTotalAtivos,
					})
					graficoPieComparativo.resize({
						width: widthOriginalComparativo,
						height: heightOriginalComparativo,
					})
					graficoBarra.resize({ width: widthOriginalBarra, height: heightOriginalBarra })
					geral.style.width = "100%"
					this.imprimindo = false
				}, 800)
			},
		},
	}
</script>

<style scoped>
	html,
	body {
		width: 100%;
	}

	@page {
	}

	@media print {
		@page {
			margin: 3mm !important;
			size: A4 landscape;
		}

		.grafico-imprimir {
			position: absolute !important;
		}
	}
	.total-ativos {
		border: 1px solid #212121;
		display: flex;
		flex-direction: column;
	}
	.titulo-total {
		background-color: #0b1b36;
		color: white;
		padding: 0 3px;
		white-space: nowrap;
		text-align: center;
	}
	.numero-total {
		text-align: center;
		font-size: 18px;
		font-weight: 600;
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
