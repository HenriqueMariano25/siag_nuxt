<template>
  <div class="w-full grid  h-fit gap-2">
    <div class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
      <ButtonNavegacao titulo="Agendar" cor="bg-[#264653]" link="/administracao/rh/horaExtra/agendar"
                       v-if="$auth.user.permissoes.includes('horaExtra_rh')">
        <img src="@/assets/icons/clock-check-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="KPIs" cor="bg-[#264653]" link="/administracao/rh/horaExtra/kpis"
                       v-if="$auth.user.permissoes.includes('kpi_hora_extra')">
        <img src="@/assets/icons/graph-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Configurações" cor="bg-[#264653]" link="/administracao/rh/horaExtra/configuracoes"
                       v-if="$auth.user.permissoes.includes('configuracao_hora_extra')">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
    </div>
    <div class="bg-white items-center flex" style="height: calc(100vh - 165px)">
      <div ref="graAgendamento" class="flex w-full"></div>
<!--      <ApexChart-->
<!--        class=""-->
<!--        type="pie"-->
<!--        red="graAgendamento"-->
<!--        :options="opcoesAgendamento"-->
<!--        :series="valoresAgendamento"-->
<!--        id="graAgendamento" />-->
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";

export default {
  components: {ButtonNavegacao},
  data() {
    return {
      valoresAgendamento: [],
      opcoesAgendamento: {
          chart: {
            type: 'bar',
            height: 500,
            stacked: true,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
        title: {
          text: 'Agendamentos de HE aprovadas e pendentes',
          offsetY: 0,
          align: 'top',
          style: {
            color: '#444',
            fontSize: '18px',
            fontWeight: 'bold',
          }
        },
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 10,
              dataLabels: {
                total: {
                  enabled: true,
                  style: {
                    fontSize: '13px',
                    fontWeight: 900
                  }
                }
              }
            },
          },
          xaxis: {
            categories: [],
          },
          legend: {
            position: 'top',
            // offsetY: 40
          },
          fill: {
            opacity: 1
          }
      },
    };
  },
  async created() {
    await this.buscarAgendamentos()
  },
  methods: {
    async buscarAgendamentos() {
      let resp = await this.$axios.$get('/hora_extra/graficos/todos_agendamentos')

      if(!resp.falha){


        let { datas, aprovados, pendentesGestor, pendentesSite } = resp.dados

        this.valoresAgendamento = [{
          name: 'Aprovados',
          data: [...aprovados]
        }, {
          name: 'Sem Aprov. Gestor',
          data: [...pendentesGestor]
        }, {
          name: 'Sem Aprov. Site Manager',
          data: [...pendentesSite]
        }]

        this.opcoesAgendamento.xaxis.categories = [...datas]

        let valores = this.valoresAgendamento
        let opcoes = Object.assign({}, this.opcoesAgendamento)

        const chartContainer = this.$refs.graAgendamento;

        const chart = new ApexCharts(chartContainer, {
          ...opcoes,

          series: valores,
        });

        await chart.render();
      }




    }
  }
}
</script>

<style scoped>

</style>
