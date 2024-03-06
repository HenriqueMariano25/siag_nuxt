<template>
  <div class="w-full grid  h-fit">
    <CabecalhoPagina titulo="NUTRIÇÃO" />
    <div class="border grid grid-cols-4 gap-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
      <ButtonNavegacao titulo="Contagem Refeições" cor="bg-[#264653]" link="nutricao/contagemRefeitorio">
        <img src="@/assets/icons/serve-w.svg" alt="" class="w-7 h-7">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Configurações" cor="bg-[#264653]" link="nutricao/configuracoes" v-if="$auth.user.permissoes.includes('nutricao_configuracao')">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-7 h-7">
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

export default {
  name: "index",
  components: {
    CabecalhoPagina,
    ButtonNavegacao
  },
}
</script>

<style scoped>

</style>
