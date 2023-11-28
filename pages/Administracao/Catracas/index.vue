<template>
  <div class="w-full grid  h-fit">
    <div class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
      <ButtonNavegacao titulo="Acessos" cor="bg-[#264653]" link="catracas/acessos">
        <img src="@/assets/icons/arrows-horizontal-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Permanência no Ref." cor="bg-[#264653]" link="catracas/permanenciaRefeitorio"
                       v-if="$auth.user.permissoes.includes('permanencia_refeitorio_catraca')">
        <img src="@/assets/icons/stopwatch-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Cartões" cor="bg-[#264653]" link="catracas/cartoes">
        <img src="@/assets/icons/id-card-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";

export default {
  name: "index",
  components: { ButtonNavegacao }
};
</script>

<style scoped>

</style>
