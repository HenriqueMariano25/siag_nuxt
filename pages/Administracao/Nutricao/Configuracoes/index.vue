<template>
  <div class="w-full grid  h-fit">
    <div class="border grid grid-cols-4 gap-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
      <ButtonNavegacao titulo="Cat. de entrada e saída" cor="bg-[#264653]" link="configuracoes/catracaEntradaSaida">
        <img src="@/assets/icons/gate-w.svg" alt="" class="w-7 h-7">
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";

export default {
  name: "index",
  components: {
    ButtonNavegacao
  },
}
</script>

<style scoped>

</style>
