<template>
  <div class="relative flex flex-col w-full ">
    <div class="flex gap-2 bg-gray-300 px-2 w-full py-1 items-center print:hidden justify-between">
      <div class="flex gap-2">
        <BotaoPadrao
          texto="Excel"
          @clique="buscarKpiDuracaoExcel"
          :disabled="mostrarSemCards || carregando"
          cor="bg-blue-300 hover:!bg-blue-400">
          <img
            src="@/assets/icons/excel-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
        <BotaoPadrao
          texto="imprimir"
          cor="bg-blue-300 hover:!bg-blue-400"
          :disabled="mostrarSemCards || carregando"
          @clique="gerarKpiDuracao">
          <img
            src="@/assets/icons/graph-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
      </div>
      <div class="flex gap-2 items-end">
        <span class="text-lg">Buscar por intervalo</span>
        <AppFormInput id="data_inicio" type="date" v-model="data_inicio" label="Data inicial"/>
        <AppFormInput id="data_final" type="date" v-model="data_final" label="Data final"/>
        <div class="flex">
          <BotaoPadrao cor="bg-blue-600 hover:!bg-blue-700" @clique="buscarDuracao()">
            <img src="@/assets/icons/magnifier-w.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </div>
    </div>
    <div id="imprimir" class="h-du">
      <div class="bg-primaria-700 p-1 w-full text-white hidden print:flex justify-between items-center">
        <img
          src="@/assets/img/logoagcnovo.png"
          alt=""
          class="" />
        <div class="flex flex-col text-center">

        <span>MÉDIA DE DURAÇÃO DE CARD POR ETAPA
        </span>
          <span v-if="data_inicio || data_final">Intervalo:  {{ data_inicio ? ' A partir: ' + $dayjs(data_inicio).format("DD/MM/YYYY") : "" }}
          {{ data_final ? ' Até: ' + $dayjs(data_final).format("DD/MM/YYYY") : "" }}</span>
        </div>
        <div class="flex flex-col">
          <span>Atualização: {{ $dayjs().format("DD/MM/YYYY") }}</span>
          <span
          >Proxima atualização: {{ $dayjs().add(7, "days").format("DD/MM/YYYY") }}</span
          >
        </div>
      </div>
    </div>

    <div class="bg-white w-full relative" style="height: calc(100vh - 121px)">
      <div class="mt-0 h-full w-full flex " v-show="!mostrarSemCards">
        <client-only>
          <div
            ref="graDuracao"
            id="graDuracao"
            class="flex imprimindo-tabela"></div>
        </client-only>
      </div>
      <div v-if="carregando" class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-900/80 text-6xl font-bold text-white z-50 print:hidden">
        <div class="square-circle-5"></div>
        <span class="text-4xl font-bold">BUSCANDO DADOS, FAVOR AGUARDE</span>
      </div>
      <div class="w-full flex items-center text-gray-600 justify-center text-4xl font-bold h-full" v-show="mostrarSemCards">
        <span>Sem cards encontrados durante esse intervalo!</span>
      </div>
    </div>
  </div>
</template>

<script>
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import gerarExcel from "~/functions/gerarExcel";
import AppFormInput from "~/components/Ui/AppFormInput.vue";

export default {
  name:"GraficoDuracaoEtapa",
  components: { AppFormInput, BotaoPadrao },
  data() {
    return {
      valores: [],
      largura: '100%',
      data_inicio: null,
      data_final: null,
      opcoes: {
        chart: {
          height: "100%",
          width: "100%",
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
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
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ],

        markers: {
          size: 5,
        },
        title: {
          text: "MÉDIA DE DURAÇÃO DE CARD POR ETAPA",
          offsetY: 15,
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
            formatter: function(y) {
              if (typeof y !== "undefined") {
                return y.toFixed(2)
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
        dataLabels: {
          enabled: true,
          offsetY: -10,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          },
          enabledOnSeries: [0]
        },
        stroke: {
          show: true,
          curve: 'smooth',
          width: [0,5],
          dashArray: 0,
        },
        plotOptions: {
          bar: {
            borderRadius: 2,
            columnWidth: "50%",
            dataLabels: {
              total: {
                enabled: true,
                formatter: function(y) {
                  if (typeof y !== "undefined") {
                    return y.toFixed(0)
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
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: true,
            formatter: (val, opt) => {
              let textoCurto = val
              if(val && val.length > 18){
                textoCurto = val.substr(0, 18)
                textoCurto += "..."
              }
              return textoCurto
            },
            minHeight: 105,
          },
        },
        yaxis: {
          title: {
            text: "Dias de duração de cards em cada etapa",
          },
          tickAmount: 6,
          forceNiceScale: true,
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
          offsetY: 0
        },
        fill: {
          opacity: 1,
        },
      },
      jaBuscou: false,
      mostrarSemCards: false,
      carregando: false,
    };
  },
  async mounted() {
    await this.buscarDuracao()
  },
  methods: {
    async buscarDuracao(){
      this.mostrarSemCards = false
      this.carregando = true
      let data_inicio = this.data_inicio
      let data_final = this.data_final
      data_inicio = data_inicio === '' ? null : data_inicio
      data_final = data_final === '' ? null : data_final
      let resp = await this.$axios.$get("/contratacao/kpi/duracao_card_etapa", { params: { data_inicio,  data_final}})
      let { etapas, cards } = resp.dados

      if(cards.length > 0){
        this.valores = [
          { name: "Média", data: etapas.map((o) => parseFloat(o.media)), type: "bar" },
          { name: "Previsto", data: etapas.map((o) => parseFloat(o.leadtime)), type: "line" },
        ]

        for (let etapa of etapas) {
          let primeiraKey = Object.keys(etapa)[0]
          this.opcoes.xaxis.categories.push(etapa[primeiraKey])
        }

        let valores = this.valores
        let opcoes = Object.assign({}, this.opcoes)

        if (this.jaBuscou === false) {
          await this.criarGrafico(valores, opcoes)
          this.jaBuscou = true
        } else {
          await this.atualizarGrafico(valores, opcoes)
        }
      }else{
        this.mostrarSemCards = true
      }

      this.carregando = false
    },
    async criarGrafico(valores, opcoes) {
      const chartContainer = this.$refs.graDuracao

      const chart = new ApexCharts(chartContainer, {
        ...opcoes,

        series: valores,
      });

      await chart.render()
    },
    async atualizarGrafico() {
      let opcoes = this.opcoes
      let valores = this.valores

      const chartContainer = this.$refs.graDuracao

      const chart = await new ApexCharts(chartContainer, {
        ...opcoes,
        series: valores,
      })

      await chart.render()

      await chart.updateOptions({})
    },

    async buscarKpiDuracaoExcel() {
      let data_inicio = this.data_inicio
      let data_final = this.data_final
      data_inicio = data_inicio === '' ? null : data_inicio
      data_final = data_final === '' ? null : data_final

      let resp = await this.$axios.$get("/contratacao/kpi/duracao_card_etapa", { params: { data_inicio, data_final } })

      let { etapas, cards } = resp.dados
      let cabecalho = ["Card"]

      for (let et of etapas) {
        cabecalho.push(Object.values(et)[0])
      }

      let nomeArquivo
      nomeArquivo = "kpi_media_duracao_etapa"

      let itens = []
      for (let item of cards) {
        let temp = []
        temp.push(item.id)
        for (let et of etapas) {
          if (
            item.duracao[Object.keys(et)[0]] !== null &&
            item.duracao[Object.keys(et)[0]] !== undefined
          ) {
            if (Object.keys(item.duracao[Object.keys(et)[0]]).includes("tempo")) {
              temp.push(item.duracao[Object.keys(et)[0]].tempo)
            } else {
              temp.push("")
            }
          } else {
            temp.push("")
          }
        }
        itens.push(temp)
      }
      let etapaMedia = []
      etapaMedia.push("Média")
      for (let etapa of etapas) {
        etapaMedia.push(etapa.media)
      }
      itens.push(etapaMedia)

      gerarExcel(cabecalho, itens, nomeArquivo)
    },
    async gerarKpiDuracao() {
      this.opcoes.chart.width = 1488
      this.opcoes.chart.height = 950
      await this.atualizarGrafico()
      window.print()

      setTimeout( async () => {
        this.opcoes.chart.width = '100%'
        this.opcoes.chart.height = '100%'
        await this.atualizarGrafico()
        }, 1000
      )


    },
  },
  watch: {
    imprimindo(valor) {
      if(valor){
        this.largura = 500
      }
    }
  }
};
</script>

<style scoped>
.imprimindo-tabela{
  width: 100%;
}

#imprimir {
  //max-height: calc(80vh);
}

@media print {
  @page {
    size: landscape;
  }
  #imprimir {
    page-break-before: always;
    width: 1480px !important;
  }

  #imprimir > * {
    page-break-inside: avoid;
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
