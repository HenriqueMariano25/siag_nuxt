<template>
  <div class="w-full">
    <div class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
      <ButtonNavegacao titulo="Avaliação" cor="bg-[#264653]" link="AvaliacaoFuncionario/Avaliacao">
        <img src="@/assets/icons/person-circle-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Configurações" cor="bg-[#264653]" link="AvaliacaoFuncionario/Configuracoes">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
    </div>
    <DialogCriarDescricaoCargo v-if="mostrarDialogCriaDescricaoCargo" @cancelar="mostrarDialogCriaDescricaoCargo = false"/>
    <DialogAvaliacaoFuncionario v-if="mostrarDialogCriaAvaliacaoFuncionario" @cancelar="mostrarDialogCriaAvaliacaoFuncionario = false"/>
  </div>
</template>

<script>
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import DialogCriarDescricaoCargo
  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DescricaoCargo/DialogCriarDescricaoCargo.vue";
import DialogAvaliacaoFuncionario
  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DialogAvaliacaoFuncionario.vue";
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";

export default {
  name: "DescricaoCargo",
  components: { ButtonNavegacao, DialogAvaliacaoFuncionario, DialogCriarDescricaoCargo, BotaoPadrao, RodapePagina },
  data() {
    return {
      mostrarDialogCriaDescricaoCargo: false,
      mostrarDialogCriaAvaliacaoFuncionario: false
    };
  }

};
</script>

<style scoped>

</style>
