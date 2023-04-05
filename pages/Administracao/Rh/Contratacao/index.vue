<template>
	<div class="w-full grid grid-cols-1 h-fit gap-y-2">
		<div
			class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white">
			<ButtonNavegacao
				titulo="Cards"
				cor="bg-[#264653]"
				link="/administracao/rh/contratacao/cards">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-8 h-8">
					<path
						fill-rule="evenodd"
						d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
						clip-rule="evenodd" />
					<path
						d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
				</svg>
			</ButtonNavegacao>
			<ButtonNavegacao
				titulo="Aprovar Card"
				cor="bg-[#264653]"
				link="/administracao/rh/contratacao/aprovarCard">
				<img
					src="@/assets/icons/person-check-w.svg"
					alt="close"
					class="w-8 h-8" />
			</ButtonNavegacao>
		</div>
		<div class="border border-gray-500 h-full">
			<div
				class="w-full bg-primaria-900 text-white flex flex-row text-center divide-x divide-gray-700 justify-center">
				<button
					class="flex p-2 hover:bg-primaria-700 box-border print:hidden text-white w-full text-center"
					:class="{ 'border-b-4 !border-b-white bg-primaria-500': tipoGrafico === 'porSetor' }"
					@click="tipoGrafico = 'porSetor'">
					<span class="w-full">CARDS POR SETOR</span>
				</button>
				<button
					class="flex p-2 hover:bg-primaria-700 box-border print:hidden text-white w-full text-center"
					:class="{ 'border-b-4 !border-b-white bg-primaria-500': tipoGrafico === 'porEtapa' }"
					@click="tipoGrafico = 'porEtapa'">
					<span class="w-full">CARDS POR ETAPA</span>
				</button>
			</div>
			<div
				v-show="tipoGrafico === 'porSetor'"
				class="">
				<div class="flex bg-gray-200 px-2 py-1 w-full gap-2 items-end text-lg justify-end">
					<span>Selecione o periodo que deseja filtrar o gráfico: </span>
					<AppFormInput
						id="data_inicio"
						type="date"
						v-model="porSetor.dataInicio"
						label="Data Inicial"
						placeholder="Ex: 25/01/2023" />
					<AppFormInput
						id="data_fim"
						type="date"
						v-model="porSetor.dataFim"
						label="Data Final"
						placeholder="Ex: 25/03/2023" />
					<BotaoPadrao
						texto="Filtrar"
						cor="bg-primaria-500"
            :disabled="nPodeFiltrar"
            @click="atualizarGraPorSetor(); atualizarGraPorSetorMaoObra();"
          >
						<img
							src="@/assets/icons/filter-b.svg"
							alt="close"
							class="w-6 h-5" />
					</BotaoPadrao>
				</div>
				<div
					class="w-full h-full bg-white grid grid-cols-2 relative divide-x divide-gray-500"
					style="height: calc(100vh - 270px)">
					<div class="relative h-full w-full">
						<canvas
							id="graPorSetor"
							class="flex"></canvas>
					</div>
          <div class="relative h-full w-full">
            <canvas
              id="graPorSetorMO"
              class="flex"></canvas>
          </div>
				</div>
			</div>
      <div
        v-show="tipoGrafico === 'porEtapa'"
        class="">

        <div
          class="w-full h-full bg-white flex relative divide-x divide-gray-500"
          style="height: calc(100vh - 270px)">
          <div class="relative h-full w-full">
            <canvas
              id="graPorEtapa"
              class="flex"></canvas>
          </div>
        </div>
      </div>
		</div>
	</div>
</template>

<script>
	import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import Chart from "chart.js/auto"
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  Chart.register(ChartDataLabels);

	export default {
		name: "index",
		components: {
			ButtonNavegacao,
			AppTabs,
			AppFormInput,
			BotaoPadrao,
		},
		data() {
			return {
				tipoGrafico: "porSetor",
				porSetor: {
					dataInicio: null,
					dataFim: null,
				},
			}
		},
    computed:{
      nPodeFiltrar(){

        let { dataInicio, dataFim} = this.porSetor
        return dataInicio === null || dataInicio === "" || dataFim === null || dataFim === null
      }
    },
		async mounted() {
			await this.buscarGraficoPorSetor()
			await this.buscarGraficoPorSetorMaoObra()
      await this.buscarGraficoPorEtapa()
		},
		methods: {
			async buscarGraficoPorSetor() {
        let { dataInicio, dataFim } = this.porSetor

				let cards = await this.$axios
					.get("/contratacao/card/dashboard/por_setor", {params: { dataInicio, dataFim }})
					.then((resp) => resp.data.cards)

				let labels = cards.map((o) => o.Setor.nome)
				let valores = cards.map((o) => o.quantidade)

				const graPorSetor = document.getElementById("graPorSetor").getContext('2d');

				const meuGraPorSetor = new Chart(graPorSetor, {
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
                enabled: false
              },
              datalabels: {
                anchor: 'end',
                align: 'start',
                offset: '30',
                formatter: (value, ctx) => {
                  let sum = 0;
                  let dataArr = valores;
                  dataArr.map(data => {
                    sum += parseFloat(data);
                  });
                  let percentage = (value * 100 / sum).toFixed(0) + "%";
                  return percentage;
                },
                color: '#fff',
              },
						  legend: {
						    position: "top",
						  },
						  title: {
						    display: true,
						    text: "Cards abertos por Setor",
						  },
						},
						maintainAspectRatio: false,
						scales: {
						},
					},
				})

				meuGraPorSetor
			},

      async atualizarGraPorSetor(){
        let chart = Chart.getChart("graPorSetor")
        let {dataInicio, dataFim} = this.porSetor

        let cards = await this.$axios
          .get("/contratacao/card/dashboard/por_setor", {params: {dataInicio, dataFim}})
          .then((resp) => resp.data.cards)

        let labels = cards.map((o) => o.Setor.nome)
        let valores = cards.map((o) => o.quantidade)

        chart.data.datasets[0].data = valores
        chart.data.labels = labels

        chart.update()
      },

			async buscarGraficoPorSetorMaoObra() {
        let {dataInicio, dataFim} = this.porSetor

				let resp = await this.$axios
					.$get("/contratacao/card/dashboard/por_mao_obra", {params: {dataInicio, dataFim}})

        if(!resp.falha) {
          let cards = resp.dados.cards

          let contador = {};

          for (let i = 0; i < cards.length; i++) {
            if (contador[cards[i].FuncaoCard.tipo_mao_obra]) {
              contador[cards[i].FuncaoCard.tipo_mao_obra]++; // incrementar o contador se o item já existe
            } else {
              contador[cards[i].FuncaoCard.tipo_mao_obra] = 1; // inicializar o contador se o item ainda não existe
            }
          }

          let novoArray = [];
          for (let item in contador) {
            novoArray.push({item: item, contador: contador[item]});
          }

          let labels = novoArray.map(o => o.item)
          let valores = novoArray.map(o => o.contador)

          const graPorSetorMO = document.getElementById("graPorSetorMO").getContext('2d');

          const meuGraPorSetorMO = new Chart(graPorSetorMO, {
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
                  ],
                },
              ],
            },
            options: {
              plugins: {
                tooltips: {
                  enabled: false
                },
                datalabels: {
                  anchor: 'end',
                  align: 'start',
                  offset: '30',
                  formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = valores;
                    dataArr.map(data => {
                      sum += parseFloat(data);
                    });
                    let percentage = (value * 100 / sum).toFixed(0) + "%";
                    return percentage;
                  },
                  color: '#fff',
                },
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Cards abertos Mão de Obra Direto e Indireto",
                },
              },
              maintainAspectRatio: false,
              scales: {},
            },
          })
				   meuGraPorSetorMO
        }

			},

      async atualizarGraPorSetorMaoObra() {
        let chart = Chart.getChart("graPorSetorMO")
        let {dataInicio, dataFim} = this.porSetor

        let resp = await this.$axios
          .$get("/contratacao/card/dashboard/por_mao_obra", {params: {dataInicio, dataFim}})

        if (!resp.falha) {
          let cards = resp.dados.cards

          let contador = {};

          for (let i = 0; i < cards.length; i++) {
            if (contador[cards[i].FuncaoCard.tipo_mao_obra]) {
              contador[cards[i].FuncaoCard.tipo_mao_obra]++; // incrementar o contador se o item já existe
            } else {
              contador[cards[i].FuncaoCard.tipo_mao_obra] = 1; // inicializar o contador se o item ainda não existe
            }
          }

          let novoArray = [];
          for (let item in contador) {
            novoArray.push({item: item, contador: contador[item]});
          }

          let labels = novoArray.map(o => o.item)
          let valores = novoArray.map(o => o.contador)

          chart.data.datasets[0].data = valores
          chart.data.labels = labels

          chart.update()
        }


      },

      async buscarGraficoPorEtapa(){
        let { etapas } = await this.$axios.$get("/contratacao/card/dashboard/por_etapa")

        let atrasados = []
        let noPrazo = []

        for(let etapa of etapas){
          let cardsNoPrazo = etapa.Cards.filter( o=> this.$dayjs().diff(o.ultima_data, "day") <= etapa.leadtime).length
          let cardsAtrasados = etapa.Cards.filter( o=> this.$dayjs().diff(o.ultima_data, "day") >  etapa.leadtime).length

          atrasados.push(cardsAtrasados);
          noPrazo.push(cardsNoPrazo);
        }

        let labels = etapas.map(o => o.nome)
        let datasets = [
          { label: "No prazo", data: noPrazo, backgroundColor: '#316395', stack: 'Stack 0'  },
          { label: "Atrasado", data: atrasados, backgroundColor: '#DC3912FF', stack: 'Stack 0'  },
        ]

        const graPorEtapa = document.getElementById("graPorEtapa").getContext('2d');

        const meuGraPorEtapa = new Chart(graPorEtapa, {
          type: "bar",
          data: {
            labels,
            datasets: datasets
          },
          options: {
            plugins: {
              tooltips: {
                enabled: false
              },
              datalabels: {
                anchor: 'end',
                align: 'start',
                offset: '10',
                color: '#fff',
              },
              legend: {
                position: "top",
                font: {
                  size: 18,
                  weight: 'bold'
                }
              },
              title: {
                display: true,
                text: "Cards abertos Mão de Obra Direto e Indireto",
              },
            },
            maintainAspectRatio: false,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
                title: {
                  display: true,
                  text: "Total de Cards",
                  font: {
                    size: 18,
                    weight: 'bold'
                  }
                },
              }
            }
          },
        })
        meuGraPorEtapa
      }
		},
	}
</script>

<style scoped></style>
