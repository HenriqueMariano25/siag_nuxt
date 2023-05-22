<template>
  <div>
    <BaseDialog
      titulo="Imprimir KPI"
      largura="w-10/12"
      @cancelar="cancelar()">
      <template v-slot:corpo>
      <div class="print:w-[1200px] overflow-y-auto print:overflow-y-visible h-[600px] print:h-auto">
        <div
          class="bg-primaria-700 text-white flex w-full justify-between p-1 items-center ">
          <span class="text-sm self-start">Gerado em: {{ $dayjs().format("DD/MM/YYYY") }}</span>
          <span class="text-xl"
          >Agendados Sem Presença - {{ $dayjs(data).format("DD/MM/YYYY") }}
						</span>
          <img
            src="../../../../../assets/img/logoagcnovo.png"
            height="52"
            width="250"/>
        </div>
        <div class="flex divide-x divide-gray-800">
          <div class="w-5/12 flex flex-col items-center px-2">
            <div class="flex w-full gap-2 p-2 justify-center">
              <div
                class="text-center flex flex-col text-md divide-y divide-gray-800 border border-gray-500 px-2 w-32">
                <span class="p-2">Agendados</span>
                <span class="p-2"
                ><strong>{{ dados.agendSPresenca.totalAgend }}</strong></span
                >
              </div>
              <div
                class="text-center flex flex-col text-md divide-y divide-gray-800 border border-gray-500 h-auto px-2 w-32">
                <span class="p-2">Ausentes</span>
                <span class="p-2"
                ><strong>{{ dados.agendSPresenca.totalAusente }}</strong></span
                >
              </div>
              <div
                class="text-center flex flex-col text-md divide-y divide-gray-800 border border-gray-500 h-auto px-2 w-32">
                <span class="p-2">MOD</span>
                <span class="p-2"
                ><strong>{{ dados.agendSPresenca.direto }}</strong></span
                >
              </div>
              <div
                class="text-center flex flex-col text-md divide-y divide-gray-800 border border-gray-500 h-auto px-2 w-32">
                <span class="p-2">MOI</span>
                <span class="p-2"
                ><strong>{{ dados.agendSPresenca.indireto }}</strong></span
                >
              </div>
            </div>
            <div class="w-full h-full flex justify-center items-center px-2">
              <div class="w-[550px]">
                <ApexChart
                  class=""
                  type="pie"
                  :options="dados.opcoesGraSemPresencaPorSetor"
                  :series="dados.valoresGraSemPresencaPorSetor"
                  id="graSemPresencaPorSetor"/>
              </div>
            </div>
          </div>
          <div class="flex w-7/12 ">
            <div class="w-full h-full flex flex-col divide-y divide-gray-800">
              <div class="flex ">
                <ApexChart
                  type="bar"
                  width="700px"
                  height="280px"
                  :options="dados.opcoesGraSemPresencaQuantSetor"
                  :series="dados.valoresGraSemPresencaQuantSetor"
                  id="graSemPresencaQuantSetor"/>
              </div>
              <div class="flex">
                <ApexChart
                  type="bar"
                  width="700px"
                  height="280px"
                  :options="dados.opcoesGraSemPresencaCargosQuant"
                  :series="dados.valoresGraSemPresencaCargosQuant"
                  id="graSemPresencaCargosQuant"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";

export default {
  components: {BaseDialog},
  data() {
    return {
      data: '2023-05-13'
    }
  },
  props: {
    dados: {
      type: [Object, String, Array],
    },
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    }
  },
}
</script>

<style scoped>

</style>
