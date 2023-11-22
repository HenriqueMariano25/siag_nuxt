<template>
  <div class="w-full grid h-fit">
    <div
      class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white">
      <ButtonNavegacao
        titulo="Fila Ambulatorio"
        cor="bg-[#e76f51]"
        link="/filas/ambulatorio">
        <img src="@/assets/icons/queue-w.svg" alt="" class="w-7 h-7">
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Configuração"
        cor="bg-[#e76f51]"
        link="/filas/configuracao">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-7 h-7">
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";

export default {
  components: { ButtonNavegacao }

};
</script>

<style scoped>

</style>
