<template>
  <div class="w-full grid h-fit">
    <CabecalhoPagina titulo="Serviços Gerais" />
    <div
      class="border grid grid-cols-4 gap-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
      <ButtonNavegacao titulo="Repúblicas" cor="bg-[#264653]" link="servicosGerais/republicas">
        <img src="@/assets/icons/building-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";

export default {
  components: { ButtonNavegacao, CabecalhoPagina }

};
</script>

<style scoped>

</style>
