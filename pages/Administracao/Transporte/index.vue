<template>
  <div class="w-full grid  h-fit">
    <div class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
      <ButtonNavegacao titulo="Rotas" cor="bg-[#264653]" link="transporte/rotas"
                       v-if="$auth.user.permissoes.includes('transporte')">
        <img src="@/assets/icons/route-w.svg" alt="" class="w-8 h-8">
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
