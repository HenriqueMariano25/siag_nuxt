<template>
  <div class="relative flex flex-col w-full ">
    <div class="flex gap-2 bg-gray-300 px-2 w-full py-1 items-center print:hidden">
      <BotaoPadrao
        texto="Excel"
        @clique="buscarKpiDuracao"
        cor="bg-blue-300 hover:!bg-blue-400">
        <img
          src="@/assets/icons/excel-b.svg"
          alt=""
          class="w-7 h-7" />
      </BotaoPadrao>
      <BotaoPadrao
        texto="imprimir"
        cor="bg-blue-300 hover:!bg-blue-400"
        @clique="gerarKpiDuracao">
        <img
          src="@/assets/icons/graph-b.svg"
          alt=""
          class="w-7 h-7" />
      </BotaoPadrao>
    </div>
    <div id="imprimir" class="h-du">
      <div class="bg-primaria-700 p-1 w-full text-white hidden print:flex justify-between items-center">
        <img
          src="@/assets/img/logoagcnovo.png"
          alt=""
          class="" />
        <div class="flex flex-col">
          <span>Atualização: {{ $dayjs().format("DD/MM/YYYY") }}</span>
          <span
          >Proxima atualização: {{ $dayjs().add(7, "days").format("DD/MM/YYYY") }}</span
          >
        </div>
      </div>
    </div>

    <div class="bg-white w-full relative" style="height: calc(100vh - 111px)">
      <div class="mt-0 h-full w-full flex ">
        <client-only>
          <div
            ref="graDuracao"
            id="graDuracao"
            class="flex imprimindo-tabela"></div>
        </client-only>
      </div>
    </div>
  </div>

</template>

<script>
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import gerarExcel from "~/functions/gerarExcel";

export default {
  name:"GraficoDuracaoEtapa",
  components: { BotaoPadrao },
  data() {
    return {
      valores: [],
      largura: '100%',
      opcoes: {
        chart: {
          height: "100%",
          width: "100%",
          toolbar: {
            show: false,
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
          text: "Duração de Card por etapa",
          offsetY: 20,
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
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
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
            // hideOverlappingLabels: false
          },
        },
        yaxis: {
          title: {
            text: "Dias de duração de cards em cada etapa",
          },
          min: 0,
          // max: 150,
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
          offsetY: -30
        },
        fill: {
          opacity: 1,
        },
      },
      jaBuscou: false
    };
  },
  async mounted() {
    await this.buscarDuracao()
  },
  methods: {
    async buscarDuracao(){
      let resp = await this.$axios.$get("/contratacao/kpi/duracao_card_etapa")

      let { etapas } = resp.dados

      this.valores = [
        { name: "Etapas", data: etapas.map((o) => parseFloat(o.media)), type: "bar" },
      ]

      for(let etapa of etapas){
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
    },
    async criarGrafico(valores, opcoes) {
      const chartContainer = this.$refs.graDuracao

      const chart = new ApexCharts(chartContainer, {
        ...opcoes,

        series: valores,
      })
      console.log(this.opcoes);

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

    async buscarKpiDuracao() {
      let resp = await this.$axios.$get("/contratacao/kpi/duracao_card_etapa")

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

      console.log(this.$dayjs().format("HH:mm:ss"))
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

</style>
