<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			titulo="RELÁTORIO"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div
					class="px-2 flex flex-col gap-2 overflow-y-auto print:overflow-visible print:!w-[1600px] w-full"
					style="max-height: calc(100vh - 180px)"
					v-if="funcionario">
					<div
						class="absolute top-0 left-0 w-full h-full bg-slate-700 flex justify-center items-center flex-col gap-2 print:hidden"
						style="z-index: 102"
						v-if="print_mode">
						<div class="square-circle-5"></div>
						<span class="text-4xl text-white font-bold">Imprimindo, por favor aguarde...</span>
					</div>
					<div
						id="imprimir"
						class="print:w-[1600px] w-full">
						<div
							class="bg-primaria-700 p-1 text-white flex justify-between items-center hidden print:flex print:w-[1600px] w-[1800px]">
							<img
								src="@/assets/img/logoagcnovo.png"
								alt=""
								class="" />
							<div class="flex flex-col text-center">
								<span>AVALIAÇÃO DO FUNCIONÁRIO</span>
							</div>
							<div class="flex flex-col">
								<span>DATA: {{ $dayjs().format("DD/MM/YYYY") }}</span>
							</div>
						</div>
					</div>
					<div class="flex flex-col w-full gap-2">
						<div class="flex flex-col border-2 border-slate-700 w-full items-center">
							<span class="font-bold text-xl bg-slate-700 text-start text-white w-full px-2">FUNCIONÁRIO AVALIADO</span>
							<div class="flex gap-3 justify-between grow text-xl w-full font-bold px-2">
								<span>{{ funcionario.chapa }}</span>
								<span>{{ funcionario.nome }}</span>
								<span>{{ funcionario.cargo }}</span>
							</div>
						</div>
						<div class="flex gap-3 px-2 justify-between w-full items-center">
							<div class="texto-titulo">
								<span class="titulo"> AVALIADOR </span>
								<span class="texto uppercase" v-if="funcionario.AvaliacaoFuncionario && funcionario.AvaliacaoFuncionario.length > 0">{{
									funcionario.AvaliacaoFuncionario[0].AvaliadoPor
										? funcionario.AvaliacaoFuncionario[0].AvaliadoPor.nome
										: ""
								}}</span>
							</div>
							<div class="texto-titulo">
								<span class="titulo"> DATA AVALIAÇÃO </span>
								<span class="texto"
                      v-if="funcionario.AvaliacaoFuncionario && funcionario.AvaliacaoFuncionario.length > 0">{{ $dayjs(funcionario.AvaliacaoFuncionario[0].avaliado_em).format("DD/MM/YYYY HH:mm") }}</span>
							</div>
							<div class="texto-titulo">
								<span class="titulo"> OBRA </span>
								<span class="texto"> GNA II </span>
							</div>
							<div class="texto-titulo">
								<span class="titulo"> PERÍODO </span>
								<span class="texto"> DESMOB </span>
							</div>
						</div>
					</div>
					<div class="w-full text-white bg-gray-800 py-1 text-center font-bold">
						<span>QUADRO DE CONSOLIDAÇÃO DA AVALIAÇÃO</span>
					</div>
					<div class="w-full flex justify-center gap-4 items-center text-md">
						<span>REFERÊNCIA PARA AS NOTAS RECEBIDAS:</span>
						<div class="flex gap-0.5 items-center">
							<img
								src="@/assets/icons/caret-up-green.svg"
								alt=""
								class="w-6 h-6" />
							<span>3 - Supera</span>
						</div>
						<div class="flex gap-0.5 items-center">
							<img
								src="@/assets/icons/equals-blue.svg"
								alt=""
								class="w-6 h-6" />
							<span>2 - Atende</span>
						</div>
						<div class="flex gap-0.5 items-center">
							<img
								src="@/assets/icons/caret-down-red.svg"
								alt=""
								class="w-6 h-6" />
							<span>1 - Não atende</span>
						</div>
					</div>
					<div class="w-full flex">
						<table class="w-full">
							<thead class="bg-gray-300">
								<tr>
									<th
										class="border border-gray-700 titulo-tabela text-sm"
										:colspan="habComportamentais.length">
										HABILIDADES COMPOTAMENTAIS
									</th>
								</tr>
								<tr class="">
									<th
										class="border border-gray-700"
										v-for="hab of habComportamentais"
										:key="hab.descricao">
										{{ hab.descricao }}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td
										v-for="hab of habComportamentais"
										v-if="funcionario.AvaliacaoFuncionario.length > 0"
										class="border border-gray-700">
										<template v-if="buscarNotaHabCompotamental(hab)">
											<div
												v-if="buscarNotaHabCompotamental(hab) === '3'"
												class="nota-habilidade">
												<img
													src="@/assets/icons/caret-up-green.svg"
													alt=""
													class="w-6 h-6" />
												<span>3</span>
											</div>
											<div
												v-if="buscarNotaHabCompotamental(hab) === '2'"
												class="nota-habilidade">
												<img
													src="@/assets/icons/equals-blue.svg"
													alt=""
													class="w-6 h-6" />
												<span>2</span>
											</div>
											<div
												v-if="buscarNotaHabCompotamental(hab) === '1'"
												class="nota-habilidade">
												<img
													src="@/assets/icons/caret-down-red.svg"
													alt=""
													class="w-6 h-6" />
												<span>1</span>
											</div>
										</template>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="w-full flex">
						<table class="w-full">
							<thead class="bg-gray-300">
								<tr>
									<th
										class="border border-gray-700 titulo-tabela text-sm"
										:colspan="habComportamentais.length">
										HABILIDADES TÉCNICAS
									</th>
								</tr>
								<tr class="">
									<th
										class="border border-gray-700 text-start px-1.5"
										v-for="hab of habTecnicas"
										:key="hab.descricao">
										{{ hab.descricao }}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td
										v-for="hab of habTecnicas"
										v-if="funcionario.AvaliacaoFuncionario.length > 0"
										class="border border-gray-700">
										<template v-if="buscarNotaHabTecnica(hab)">
											<div
												v-if="buscarNotaHabTecnica(hab) === '3'"
												class="nota-habilidade">
												<img
													src="@/assets/icons/caret-up-green.svg"
													alt=""
													class="w-6 h-6" />
												<span>3</span>
											</div>
											<div
												v-if="buscarNotaHabTecnica(hab) === '2'"
												class="nota-habilidade">
												<img
													src="@/assets/icons/equals-blue.svg"
													alt=""
													class="w-6 h-6" />
												<span>2</span>
											</div>
											<div
												v-if="buscarNotaHabTecnica(hab) === '1'"
												class="nota-habilidade">
												<img
													src="@/assets/icons/caret-down-red.svg"
													alt=""
													class="w-6 h-6" />
												<span>1</span>
											</div>
										</template>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="w-full text-white bg-gray-800 py-1 text-center font-bold">
						<span>GRÁFICO CONSOLIDADO DA AVALIAÇÃO</span>
					</div>
					<div class="">
						<div
							class="p-1 !w-full flex"
							id="graficoComportamental"
							style="width: 1500px; min-height: 300px; page-break-after: always"></div>
						<div
							class="p-1 !w-full flex"
							id="graficoTecnica"
							style="width: 1500px; min-height: 300px"></div>
					</div>
					<div class="flex flex-col border border-gray-600">
						<span class="w-full bg-slate-600 text-2xl px-2 text-white">Comentário</span>
						<span
							v-if="funcionario.AvaliacaoFuncionario"
							class="px-2 text-2xl"
							>{{ funcionario.AvaliacaoFuncionario[0].comentario_geral }}</span
						>
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
		props: {
			funcionario_id: {
				type: Number,
			},
		},
		data() {
			return {
				funcionario: {},
				habComportamentais: [],
				habTecnicas: [],
				medias: [],
				graficoComportamental: null,
				graficoTecnica: null,
				print_mode: false,
        isChrome: false,
        isFirefox: false,
			}
		},
		mounted() {
			if (this.funcionario_id) {
				this.buscarRelatorio()
			}

      let navegador = navigator.userAgent

      if (navegador.indexOf("Chrome") !== -1) {
        this.isChrome = true
      } else if (navegador.indexOf("Firefox") !== -1) {
        this.isFirefox = true
      }
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarRelatorio() {
				let id = this.funcionario_id

				let resp = await this.$axios.$get("/avaliacao_funcionario/relatorio/funcionario", {
					params: { id },
				})
				if (!resp.falha) {
					let { funcionario, habComportamentais, habTecnicas, medias } = resp.dados

					this.funcionario = funcionario
					this.habComportamentais = habComportamentais
					this.habTecnicas = habTecnicas
					this.medias = medias

					await this.montarGraficoComportamental()
					await this.montarGraficoTecnica()
				}
			},
			buscarNotaHabCompotamental(hab) {
				let habilidade =
					this.funcionario.AvaliacaoFuncionario[0].AvaliacaoTemConheComportamental.find(
						(o) => o.conhe_comp === hab.id,
					)

				if (habilidade) return habilidade["nota"]

				return ""
			},
			buscarNotaHabTecnica(hab) {
				let habilidade = this.funcionario.AvaliacaoFuncionario[0].AvaliacaoTemHabTecnicas.find(
					(o) => o.habilidade_tecnica === hab.id,
				)

				if (habilidade) return habilidade["nota"]

				return ""
			},
			async montarGraficoComportamental() {
				let habComportamentais = this.habComportamentais
				let dadosFormatados = [["Tipos", "Nota do funcionário", "Média geral", " Média por Cargo"]]
				let series = [
					{
						name: "Nota do funcionário",
						type: "bar",
						label: {
							show: true,
							position: "right",
							verticalAlign: "middle",
							fontSize: 14,
						},
					},
					{
						name: "Média geral",
						type: "bar",
						label: {
							show: true,
							position: "right",
							verticalAlign: "middle",
							fontSize: 14,
						},
					},
					{
						name: "Média por Cargo",
						type: "bar",
						label: {
							show: true,
							position: "right",
							verticalAlign: "middle",
							fontSize: 14,
						},
					},
				]

				for (let hab of habComportamentais) {
					let notas = [hab.descricao]
					notas.push(parseFloat(this.buscarNotaHabCompotamental(hab)).toFixed(1))
					notas.push(
						parseFloat(
							this.medias.comportamental.geral.find(
								(o) => o.conhe_comportamental_avaliacao_id === hab.id,
							)["media"],
						).toFixed(1),
					)
					notas.push(
						parseFloat(
							this.medias.comportamental.cargo.find(
								(o) => o.conhe_comportamental_avaliacao_id === hab.id,
							)["media"],
						).toFixed(1),
					)

					dadosFormatados.push(notas)
				}

				let myChart = echarts.init(document.getElementById("graficoComportamental"))
				this.graficoComportamental = myChart
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
					title: {
						text: "HABILIDADES COMPORTAMENTAIS",
					},
					color: ["#f29e4c", "#efea5a", "#83e377", "#0db39e", "#2c699a", "#54478c"],
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

					dataset: {
						source: dadosFormatados,
					},
					xAxis: {
						type: "value",
						axisLabel: { interval: 0, fontSize: 14, margin: 12 },
						boundaryGap: [0, 0.01],
						max: 3,
					},
					yAxis: {
						type: "category",
						name: "Nota",
						axisLabel: { fontSize: 14, show: true, overflow: "break", width: 300 },
						nameTextStyle: { fontSize: 16 },
					},
					series: series,
					grid: {
						left: 12,
						right: 14,
						bottom: 0,
						containLabel: true,
					},
				}

				option && myChart.setOption(option)
			},
			async montarGraficoTecnica() {
				let habTecnicas = this.habTecnicas

				let dadosFormatados = [["Tipos", "Nota do funcionário", "Média geral", "Média por Cargo"]]
				let series = [
					{
						name: "Nota do funcionário",
						type: "bar",
						label: {
							show: true,
							position: "right",
							verticalAlign: "middle",
							fontSize: 14,
						},
					},
					{
						name: "Média geral",
						type: "bar",
						label: {
							show: true,
							position: "right",
							verticalAlign: "middle",
							fontSize: 14,
						},
					},
					{
						name: "Média por Cargo",
						type: "bar",
						label: {
							show: true,
							position: "right",
							verticalAlign: "middle",
							fontSize: 14,
						},
					},
				]

				for (let hab of habTecnicas) {
					let notas = [hab.descricao]
					notas.push(parseFloat(this.buscarNotaHabTecnica(hab)).toFixed(1))

					notas.push(
						parseFloat(
							this.medias.tecnica.geral.find((o) => o.habilidade_tecnica_avaliacao_id === hab.id)[
								"media"
							],
						).toFixed(1),
					)
					notas.push(
						parseFloat(
							this.medias.tecnica.cargo.find((o) => o.habilidade_tecnica_avaliacao_id === hab.id)[
								"media"
							],
						).toFixed(1),
					)

					dadosFormatados.push(notas)
				}

				let myChart = echarts.init(document.getElementById("graficoTecnica"))
				this.graficoTecnica = myChart
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
					title: {
						text: "HABILIDADES TÉCNICAS",
					},
					color: ["#f29e4c", "#efea5a", "#83e377", "#0db39e", "#2c699a", "#54478c"],
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

					dataset: {
						source: dadosFormatados,
					},
					xAxis: {
						type: "value",
						axisLabel: { interval: 0, fontSize: 14, margin: 12 },
						boundaryGap: [0, 0.01],
						max: 3,
					},
					yAxis: {
						type: "category",
						name: "Nota",
						axisLabel: { fontSize: 14, show: true, overflow: "break", width: 300 },

						nameTextStyle: { fontSize: 16 },
					},
					series: series,
					grid: {
						left: 12,
						right: 14,
						bottom: 0,
						containLabel: true,
					},
				}

				option && myChart.setOption(option)
			},
			async imprimir() {
				let chartDomTecnica = this.graficoTecnica
				let charDomComportamentais = this.graficoComportamental
				this.print_mode = true

				let widthOriginalTecnica = chartDomTecnica.getWidth()
				let heightOriginalTecnica = chartDomTecnica.getHeight()

				let widthOriginalComportametais = charDomComportamentais.getWidth()
				let heightOriginalComportametais = charDomComportamentais.getHeight()

        if (this.isChrome) {
          chartDomTecnica.resize({ width: 1600, height: 590 })
          charDomComportamentais.resize({ width: 1600, height: 590 })
        }else if(this.isFirefox){
          chartDomTecnica.resize({ width: 1600, height: 610 })
          charDomComportamentais.resize({ width: 1600, height: 610 })
        }

				setTimeout(() => {
					window.print()
					chartDomTecnica.resize({ width: widthOriginalTecnica, height: heightOriginalTecnica })
					charDomComportamentais.resize({
						width: widthOriginalComportametais,
						height: heightOriginalComportametais,
					})
					this.print_mode = false
				}, 800)
			},
		},
	}
</script>

<style scoped>
	.texto-titulo {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.titulo {
		font-weight: 700;
		color: #373738;
		//margin-left: 2px;
		font-size: 14px;
	}
	.texto {
		white-space: nowrap;
		font-size: 18px;
	}
	.nota-habilidade {
		display: flex;
		gap: 5px;
		justify-content: center;
		align-items: center;
		font-size: 18px;
	}
	.titulo-tabela {
		color: white;
		background-color: rgb(69, 87, 112);
		padding: 5px 0;
	}

	html,
	body {
		width: 100%;
	}

	@page {
	}

	@media print {
		@page {
			margin: 5mm 5mm 5mm 5mm !important;
		}

		.grafico-imprimir {
			//position: absolute !important;
		}
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
