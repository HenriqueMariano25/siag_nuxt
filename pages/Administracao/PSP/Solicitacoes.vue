<template>
  <div>
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
    };
  }
};
</script>

<style scoped>

</style>
