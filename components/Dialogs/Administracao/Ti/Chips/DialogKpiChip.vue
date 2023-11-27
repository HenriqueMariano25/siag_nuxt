<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			titulo="Kpi de CHIP"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="relative">
					<div
						id="imprimir"
						class="w-full">
						<div class="bg-primaria-700 p-1 text-white flex justify-between items-center hidden print:flex w-[1800px]">
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
          <div class="bg-red-500 flex w-full h-full bg-white z-10">
            <img alt="graph" v-if="print_mode" class="print:hidden w-100" :src="chart_img" />
          </div>
          <div class="flex w-full h-full grafico-imprimir">

            <div
              class="mt-2 !w-full p-1 !h-full flex print:!flex" :class="{'hidden': print_mode}"
              id="main"
              style="width: 1500px;min-height: 500px"></div>

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
        chart_img: null,
        print_mode: false
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
						series = Array(Object.keys(dados[key]).length).fill({
							type: "bar",
							label: {
								show: true,
								position: "top",
							},
						})
					}

					dadosFormatados.push([key, ...Object.values(dados[key])])
				}

				let myChart = echarts.init(document.getElementById("main"))
				this.myChart = myChart
				let option

				option = {
					legend: {},
					tooltip: {},
					dataset: {
						source: dadosFormatados,
					},
					xAxis: { type: "category" },
					yAxis: { name: "N° de CHip" },
					series: series,
          grid: {
            left: 10,
            right: 2,
            bottom: 0, containLabel: true
          }
				}

				option && myChart.setOption(option)
			},
			async buscarDados() {
				let resp = await this.$axios.$get("/ti/chip/kpi")

				if (!resp.falha) {
					return resp.dados.porSetor
				}
			},
			imprimir() {
        let chart_dom = this.myChart

        this.chart_img = chart_dom.getDataURL()
        this.print_mode = true
        console.log(chart_dom);
        console.log(chart_dom.getWidth());
        let widthOriginal = chart_dom.getWidth()
        let heightOriginal = chart_dom.getHeight()

        chart_dom.resize({ width: 1800, height:900})
        setTimeout(() => {
          window.print()
          chart_dom.resize({ width: widthOriginal, height: heightOriginal })
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
	@media print {
		@page {
      size:  35.7cm 25cm !important;
      margin: 5mm 5mm 5mm 5mm !important;
		}

    .grafico-imprimir{
      //position: absolute !important;
    }
	}
</style>
