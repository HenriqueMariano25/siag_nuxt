<template>
	<div
		class="relative flex flex-col w-full mt-2"
		style="height: calc(100vh - 175px)">
		<div class="flex p-1.5 bg-white justify-end gap-2 w-full border border-gray-400 shadow">
			<div class="!w-[200px]">
				<AppFormSelectCompleto
					id="turno"
					label="Turno"
					:options="turnos"
					v-model="turno"
					class="grow" />
			</div>
			<div class="flex items-end">
				<BotaoPadrao
					texto="Filtrar"
          @clique="buscarRotas()"
					class="bg-primaria-500 hover:!bg-primaria-700 text-white">
					<img
						src="@/assets/icons/magnifier-w.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</div>
		<!--    <D3BarChart-->
		<!--      v-if="buscouDados"-->
		<!--      :config="chart_config"-->
		<!--      :datum="chart_data"-->
		<!--      :title="chart_title"-->
		<!--    ></D3BarChart>-->
		<div class="bg-white w-full relative" style="height: calc(100vh - 231px)">
<!--			<div class="flex flex-col p-1.5">-->
<!--				<div class="w-[150px] flex flex-col bg-gray-100 border border-gray-300 text-center rounded py-3">-->
<!--					<span class="text-xl whitespace-pre"><strong>Total</strong></span>-->
<!--					<span class="text-3xl">97,5%</span>-->
<!--				</div>-->
<!--			</div>-->
      <div class="mt-0 h-full" >
        <client-only>
          <div
            ref="graOcupacao"
            id="graOcupacao"
            class="flex"></div>
        </client-only>
      </div>

		</div>
	</div>
</template>

<script>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import { buscarTurnos } from "~/mixins/buscarInformacoes"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
  import Chart from "chart.js/auto";

	export default {
		mixins: [buscarTurnos],
		name: "App",
		components: {
			BotaoPadrao,
			AppFormSelectCompleto,
			AppFormInput,
		},
		data() {
			return {
				turnos: [],
				turno: 0,
				buscouDados: false,
				valoresOcupacao: [],
				opcoesOcupacao: {
					chart: {
						height: "100%",
						type: "line",
						stacked: true,

						toolbar: {
							show: true,
						},
						zoom: {
							enabled: false,
						},
            foreColor: '#373d3f',
            redrawOnWindowResize: true,
					},
          grid: {
            show: true,
            borderColor: '#a4bbc7',
          },
					responsive: [
						{
							breakpoint: 480,
							options: {
								legend: {
									position: "bottom",
									offsetX: -10,
									offsetY: 0,
								},
							},
						},
					],

					markers: {
						size: 0,
					},
					title: {
						text: "Ocupação de rotas",
						offsetY: 25,
						align: "top",
						style: {
							color: "#444",
							fontSize: "18px",
							fontWeight: "bold",
						},
					},

					tooltip: {
						shared: true,
						intersect: false,
						y: {
							formatter: function (y) {
								if (typeof y !== "undefined") {
									return y.toFixed(2) + " %"
								}
								return y
							},
						},
					},
          subtitle: {
            text: "",
            align: 'left',
            margin: 10,
            offsetX: 10,
            offsetY: 10,
            floating: false,
            style: {
              fontSize: '32px',
              fontWeight: 'bold',
              fontFamily: undefined,
              color: '#000000',
            },
          },
					plotOptions: {
						bar: {
							columnWidth: "50%",
							horizontal: false,
							dataLabels: {
								total: {
									enabled: true,
                  formatter: function(y) {
                    if (typeof y !== "undefined") {
                      return y.toFixed(0) + " %"
                    }
                    return y
                  },
									style: {
										fontSize: "13px",
										fontWeight: 900,
									},
								},
							},
						},
					},
					xaxis: {
						categories: [],
					},
					yaxis: {
						title: {
							text: "Porcentagem de ocupação",
						},
						min: 0,
						max: 150,
						labels: {
							formatter: (value) => {
								return value.toFixed(0)
							},
						},
            axisBorder: {
              show: true,
              color: '#78909C',
              offsetX: 0,
              offsetY: 0
            },
					},
					legend: {
						position: "top",
						offsetY: -40
					},
					fill: {
						opacity: 1,
					},
				},
        jaBuscou: false,
        totalPorcentagem: 0
			}
		},

		async mounted() {
			let turnos = await this.buscarTurnos()

			this.turnos = turnos.map((o) => {
				return { id: o.descricao, nome: o.descricao }
			})

			this.turnos.unshift({ id: 0, nome: "todos" })
			await this.buscarRotas()
		},
		methods: {
			async buscarRotas() {
        let turno = this.turno
				let resp = await this.$axios.$get("/transporte/rotas/relatorio", { params: { filtros: { turno }}})
				if (!resp.falha) {
					let rotas = resp.dados.rotas
          let totalVagas = 0
          let totalOcupado = 0

          for(let rota of rotas){
            totalVagas = parseInt(totalVagas) + parseInt(rota.ocupacao)
            totalOcupado = parseInt(totalOcupado) + parseInt(rota.total)
          }

          let totalPorcentagem = (( totalOcupado ) / (totalVagas / 100)).toFixed(2)
          if(isNaN(totalPorcentagem)){
            this.totalPorcentagem = 0
          }else{
            this.totalPorcentagem = totalPorcentagem
          }


					this.buscouDados = true

					this.valoresOcupacao = [
						{ name: "Rotas", data: rotas.map((o) => o.porcentagem), type: "bar" },
						{
							name: "Meta",
							type: "line",
							data: [...Array(rotas.length).fill(90)],
						},
					]

					this.opcoesOcupacao.xaxis.categories = rotas.map((o) => o.nome)

          this.opcoesOcupacao.subtitle.text = `Total: ${this.totalPorcentagem}%`

					let valores = this.valoresOcupacao
					let opcoes = Object.assign({}, this.opcoesOcupacao)

          if(this.jaBuscou === false){

            await this.criarGrafico(valores, opcoes)
            this.jaBuscou = true
          }else {
            await this.atualizarGrafico(valores, opcoes)
          }

				}
			},

      async criarGrafico(valores, opcoes){
        const chartContainer = this.$refs.graOcupacao

        const chart = new ApexCharts(chartContainer, {
          ...opcoes,

          series: valores,
        })

        await chart.render()
      },

      async atualizarGrafico(valores, opcoes){
        const chartContainer = this.$refs.graOcupacao

        const chart = await new ApexCharts(chartContainer, {
          ...opcoes,
          series: valores,
        })

        await chart.render()

        await chart.updateOptions({

        })
      }
		},
	}
</script>
