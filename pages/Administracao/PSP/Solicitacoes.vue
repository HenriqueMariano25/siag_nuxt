<template>
  <div class="w-full">
    <div
      class="flex bg-primaria-500 w-full print:hidden menuEtapas"
      style="overflow-x: scroll">
      <button
        class="flex p-2 hover:bg-gray-300 hover:text-black box-border print:hidden text-white"
        :class="{ 'border-t-4 border-black bg-gray-200 !text-black': etapa_id === 0 }"
        @click="etapa_id = 0">
        Todos
      </button>
      <div
        v-for="etapa in etapas"
        :key="etapa.id"
        class="grid grid-flow-col auto-cols-max divide-y-2 divide-amber-50">
        <button
          class="flex py-2 px-3 hover:bg-gray-400 box-border text-white hover:text-black min-w-[100px] justify-center"
          :class="{ 'border-t-4 border-black bg-gray-200 !text-black': etapa_id === etapa.id }"
          @click="etapa_id = etapa.id">
          <span class="whitespace-nowrap">{{ etapa.nome }}</span>
        </button>
      </div>
    </div>
    <RodapePagina class="print:hidden">
      <template v-slot>
        <div class="flex items-center w-full">
          <div class="flex w-full gap-2 justify-end">
            <BotaoPadrao texto="criar psp" @clique="mostrarDialogCriarPsp = true">
              <img src="@/assets/icons/add-b.svg" alt="" class="w-7 h-7">
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarPsp v-if="mostrarDialogCriarPsp" @cancelar="mostrarDialogCriarPsp = false" />
  </div>
</template>

<script>
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import DialogCriarPsp from "~/components/Dialogs/Administracao/Psp/DialogCriarPsp.vue";
import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue";

export default {
  name: "Psp",
  components: { AppFormRadio, DialogCriarPsp, BotaoPadrao, RodapePagina },
  data() {
    return {
      mostrarDialogCriarPsp: false,
      etapas: [],
      etapa_id: 0
    };
  },
  created() {
    this.buscarEtapas();
  },
  methods: {
    async buscarEtapas() {
      let resp = await this.$axios.$get("/psp/buscar/etapas")

      console.log(resp)

      if(!resp.falha){
        this.etapas = resp.dados.etapas
      }
    }
  }
};
</script>

<style scoped>

</style>
