<template>
  <div class="w-full grid grid-cols-1 h-fit gap-y-2">
    <CabecalhoPagina titulo="CONFIGURAÇÕES" />
    <div
      class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
      <ButtonNavegacao titulo="Prazo p/ função" cor="bg-[#264653]" link="configuracoes/prazoPorFuncao">
        <img src="../../../../assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

export default {
  name: "Configuracoes",
  components: { CabecalhoPagina, ButtonNavegacao }
};
</script>


<style scoped>

</style>
