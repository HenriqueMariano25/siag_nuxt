<template>
  <div>
    <BaseDialog
      titulo="Imprimir KPI"
      largura="w-10/12"
      @cancelar="cancelar()">
      <template v-slot:corpo>
      <div class="print:w-[1200px] overflow-y-auto print:overflow-y-visible h-[550px] print:h-auto">
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
        <div class="flex divide-x divide-gray-800" style="page-break-after: always">
          <div class="w-5/12 flex flex-col items-center px-2">
            <div class="w-full h-full flex justify-center items-center px-2">
              <div class="w-[550px]">
                <ApexChart
                  class=""
                  type="donut"
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
        <div
          class="bg-primaria-700 text-white flex w-full justify-between p-1 items-center">
          <span class="text-sm self-start">Gerado em: {{ $dayjs().format("DD/MM/YYYY") }}</span>
          <span class="text-xl"
          >Presentes Sem Agendamento - {{ $dayjs(data).format("DD/MM/YYYY") }}
						</span>
          <img
            src="../../../../../assets/img/logoagcnovo.png"
            height="52"
            width="250" />
        </div>
        <div class="flex divide-y divide-gray-800 ">
          <div class="flex flex-col items-center px-2 w-full divide-y divide-gray-800">
            <div class="w-full h-full flex justify-center items-center px-2 divide-x divide-gray-800">
              <div class="flex">
                <ApexChart
                  class=""
                  type="pie"
                  width="460px"
                  height="280px"
                  :options="dados.opcoesGraSemAgendamentoGeral"
                  :series="dados.valoresGraSemAgendamentoGeral"
                  id="graSemAgendamentoGeral" />
              </div>
              <div class="flex">
                <ApexChart
                  type="bar"
                  width="773px"
                  height="280px"
                  :options="dados.opcoesGraSemAgendamento"
                  :series="dados.valoresGraSemAgendamento"
                  id="graSemAgendamento" />
              </div>
            </div>
            <div>
              <ApexChart
                type="bar"
                width="1225px"
                height="420px"
                :options="dados.opcoesGraSemAgendamentoSetor"
                :series="dados.valoresGraSemAgendamentoSetor"
                id="graSemAgendamentoSetor" />
            </div>
          </div>
        </div>

      </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="imprimir" @click="imprimir()">
          <img src="@/assets/icons/printer-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  components: { BotaoPadrao, BaseDialog},
  props: {
    dados: {
      type: [Object, String, Array],
    },
    data: {
      type: String
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    imprimir(){
      window.print()
    }
  },
}
</script>

<style scoped>

</style>
