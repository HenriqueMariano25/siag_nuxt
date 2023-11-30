<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			titulo="Kpi de CHIP"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="relative ">
					<div
						id="imprimir"
						class="w-full">
						<div class="bg-primaria-700 p-1 text-white flex justify-between items-center hidden print:flex print:w-[1600px] w-[1800px]">
							<img
								src="@/assets/img/logoagcnovo.png"
								alt=""
								class="" />
							<div class="flex flex-col text-center">
								<span>CHIP POR SETOR</span>
							</div>
							<div class="flex flex-col">
								<span>Atualização: {{ $dayjs().format("DD/MM/YYYY") }}</span>
								<span
									>Proxima atualização: {{ $dayjs().add(30, "days").format("DD/MM/YYYY") }}</span
								>
							</div>
						</div>
					</div>
          <div class="flex gap-1 justify-between px-1 w-full">
            <div class=" text-center ">
              <div class="border border-gray-500 rounded bg-gray-50 shadow flex flex-col p-2 print:mt-2 ">
                <span class="text-xl print:text-4xl">Total de CHIPs</span>
                <span class="font-bold text-4xl print:text-8xl">{{ totalChips }}</span>
              </div>
            </div>

            <div class="flex bg-white z-10">
              <img alt="graph" v-if="print_mode" class="print:hidden w-100 mt-2 p-1" :src="totalPorSetor_img" />
            </div>
              <div
                class="mt-2 p-1 !w-full !h-full flex print:!flex" :class="{'hidden': print_mode}"
                id="totalPorSetor" style="width: 500px;min-height: 200px"
                >
              </div>
          </div>
          <div class="flex w-full h-full bg-white z-10">
            <img alt="graph" v-if="print_mode" class="print:hidden w-100 mt-2 p-1" :src="chart_img" />
          </div>
          <div class="flex w-full h-full grafico-imprimir">
            <div
              class="p-1 !w-full  !h-full flex print:!flex" :class="{'hidden': print_mode}"
              id="main"
              style="width: 1500px;min-height: 300px"></div>

          </div>

				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div>
					<BotaoPadrao
						texto="imprimir"
						@clique="imprimir()">
						<img
							src="@/assets/icons/printer-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import * as echarts from "echarts"
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		name: "DialogKpiChip",
		components: {
			BotaoPadrao,
			BaseDialog,
		},
		data() {
			return {
				myChart: null,
        graficoTotalPorSetor: null,
        chart_img: null,
        totalPorSetor_img: null,
        print_mode: false,
        totalChips: 0,
        totalPorSetor: {}
			}
		},
		mounted() {
			this.montarGrafico()
      let self = this;
      window.addEventListener('afterprint', function() {
        self.print_mode = false;
      });

		},
		// beforeDestroy() {
		// 	this.myChart.dispose()
		// },
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async montarGrafico() {
				let dados = await this.buscarDados()
				let dadosFormatados = []
				let series = []

				for (let key of Object.keys(dados)) {
					if (dadosFormatados.length === 0) {
            dadosFormatados.push(["Planos", ...Object.keys(dados[key])])
						series = Array(Object.keys(dados[key]).length - 1).fill({
							type: "bar",
              stack: 'a',
							label: {
								show: true,
								position: "inside",
                verticalAlign: "middle",
                fontSize: 18,
                fontWeight: 'bold'
							},
						})

            series.push({
              name:"Previsto",
              type: "line",
              lineStyle: {
                width: 4
              },
              label: {
                show: false,
                position: "top",
                fontSize: 18,
                fontWeight: 'bold'
              },
            })
					}

					dadosFormatados.push([key, ...Object.values(dados[key])])
				}

				let myChart = echarts.init(document.getElementById("main"))
				this.myChart = myChart
				let option

        for(let dado of dadosFormatados){
          for(let idx in dado){
            if(idx != dado.length - 1 ){
              if (dado[idx] === 0) {
                dado[idx] = ""
              }
            }
          }
        }

				option = {
          color: ['#f29e4c', '#efea5a', '#83e377', '#0db39e', '#2c699a', '#54478c'],
					legend: {
            textStyle:{
              fontSize: 18
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
					dataset: {
						source: dadosFormatados,
					},
					xAxis: { type: "category", axisLabel: { interval: 0, rotate: 30, fontSize: 16, margin: 12 } },
					yAxis: { name: "N° de Chip", axisLabel: { fontSize: 16 }, nameTextStyle: { fontSize: 16} },
					series: series,
          grid: {
            left: 12,
            right: 2,
            bottom: 0, containLabel: true
          }
				}

				option && myChart.setOption(option)

        await this.gerarGraficoTotalPorSeto()
			},
      async gerarGraficoTotalPorSeto(){
        let quantidade = Object.keys(this.totalPorSetor).map( o=> {
          if(this.totalPorSetor[o] > 0)
            return { value: this.totalPorSetor[o], name: o}})

        let grafico = echarts.init(document.getElementById("totalPorSetor"))
        this.graficoTotalPorSetor = grafico
        let option = {
          title: {
            text: 'Quantidade por setor',
            left: 'center',
            // padding:5
            top: -5

          },
          margin: 20,
          tooltip: {
            trigger: 'item'
          },
          legend: {
            show: false
          },

          label: {
            formatter: '{c} - {b}',
            fontSize: 22,
            alignTo: 'edge',
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: 15,
            rich: {
              time: {
                fontSize: 10,
                color: '#999'
              }
            }
          },
          labelLine: {
            length: 15,
            length2: 0,
            maxSurfaceAngle: 80
          }, itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          series: [
            {
              name: "Quantidade por setor",
              type: 'pie',
              top: 15,
              radius: ['30%', '70%'],
              emphasis: {
                label: {
                  show: true,
                  fontSize: 24,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              },
              data: quantidade
            }
          ]
        }

        option && grafico.setOption(option);

      },
			async buscarDados() {
				let resp = await this.$axios.$get("/ti/chip/kpi")

				if (!resp.falha) {
          this.totalChips = resp.dados.totalChips
          this.totalPorSetor = resp.dados.totalPorSetor

					return resp.dados.porSetor
				}
			},
			imprimir() {
        let chart_dom = this.myChart
        let totalPorSetor = this.graficoTotalPorSetor
        this.print_mode = true

        this.chart_img = chart_dom.getDataURL()
        let widthOriginal = chart_dom.getWidth()
        let heightOriginal = chart_dom.getHeight()

        chart_dom.resize({ width: 1600, height:610})

        this.totalPorSetor_img = totalPorSetor.getDataURL()
        let totalPorSetorwidthOriginal = totalPorSetor.getWidth()
        let totalPorSetorheightOriginal = totalPorSetor.getHeight()

        totalPorSetor.resize({ width: 1400, height: 400 })


        setTimeout(() => {
          window.print()
          chart_dom.resize({ width: widthOriginal, height: heightOriginal })
          totalPorSetor.resize({ width: totalPorSetorwidthOriginal, height: totalPorSetorheightOriginal })
        }, 800)


			},
		},
	}
</script>

<style scoped>
#main,
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

    .grafico-imprimir{
      //position: absolute !important;
    }
	}
</style>
