<template>
  <div class="w-full grid gap-2 overflow-y-auto h-fit">
    <CabecalhoPagina titulo="HORA EXTRA" />
    <div class="border grid grid-cols-4 gap-2 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11 ">
      <ButtonNavegacao titulo="Agendar" cor="bg-[#264653]" link="/administracao/rh/horaExtra/agendar"
                       v-if="$auth.user.permissoes.includes('horaExtra_rh')">
        <img src="@/assets/icons/clock-check-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Terceiros" cor="bg-[#264653]" link="/administracao/rh/horaExtra/terceiros">
        <img src="@/assets/icons/constructor-w.svg" alt="" class="w-8 h-8"
             v-if="$auth.user.permissoes.includes('horaExtra_rh')">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Bloqueados" cor="bg-[#264653]" link="/administracao/rh/horaExtra/bloqueados"
                       v-if="$auth.user.permissoes.includes('bloqueados_hora_extra')">
        <img src="@/assets/icons/blocked-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="KPIs" cor="bg-[#264653]" link="/administracao/rh/horaExtra/kpis"
                       v-if="$auth.user.permissoes.includes('kpi_hora_extra')">
        <img src="@/assets/icons/graph-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Configuração" cor="bg-[#264653]" link="/administracao/rh/horaExtra/configuracao"
                       v-if="$auth.user.permissoes.includes('configuracao_hora_extra')">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
    </div>
    <div
      class="p-1 flex border  bg-white"
      id="grafico"
      style="min-height: 300px; height: calc(100vh - 350px)"></div>
    <DialogDadosGrafico v-if="mostrarDialogDadosGrafico" @cancelar="mostrarDialogDadosGrafico = false" :tipo="tipo" :data="data"/>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import * as echarts from "echarts";
import DialogDadosGrafico from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialogDadosGrafico.vue";

export default {
  components: { DialogDadosGrafico, CabecalhoPagina, ButtonNavegacao},
  data() {
    return {
      valoresAgendamento: [],
      tipo: null,
      data: null,
      mostrarDialogDadosGrafico: false
    };
  },
  async mounted() {
    await this.buscarAgendamentos()
  },
  methods: {
    async buscarAgendamentos() {
      let resp = await this.$axios.$get('/hora_extra/graficos/todos_agendamentos')

      if(!resp.falha){
        let { datas, aprovados, pendentesGestor, pendentesSite } = resp.dados

        let series = [
          {
            data: aprovados,
            type: "bar",
            stack: "a",
            name: "Aprovados",
            label: {
              show: true,
              position: 'inside',
              fontWeight: 'bold',
              fontSize: 16,
              formatter: ({ data }) => data > 0 ? data : ""
            },
            triggerLineEvent: true,
          },
          {
            data: pendentesGestor,
            type: "bar",
            stack: "a",
            name: "Pend. Gestor Área",
            label: {
              show: true,
              position: 'inside',
              fontWeight: 'bold',
              fontSize: 16,
              formatter: ({ data }) => data > 0 ? data : ""
            },
            triggerLineEvent: true,
          },
          {
            data: pendentesSite,
            type: "bar",
            stack: "a",
            name: "Pend. Site Manager",
            label: {
              show: true,
              position: 'inside',
              fontWeight: 'bold',
              fontSize: 16,
              formatter: ({ data }) => data > 0 ? data : ""
            },
            triggerLineEvent: true,
          },
        ]

        let myChart = echarts.init(document.getElementById("grafico"))
        this.graficoBarra = myChart
        let option

        option = {
          color: ["#008FFB", "#00E396", "#FEB019"],
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
            text: "Agendamentos de HE aprovadas e pendentes",
          },
          xAxis: {
            type: "category",
            data: datas,
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

        let page = this
        myChart.on('click', 'series', function(params) {
          let tipo = params.seriesName
          page.tipo = tipo === "Aprovados" ? "aprovados" : tipo === "Pend. Gestor Área" ? "pendente gestor" : "pendente site"
          page.data = params.name

          page.mostrarDialogDadosGrafico = true;
        });
      }
    },
  }
}
</script>

<style scoped>

</style>
