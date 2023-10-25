<template>
  <div class="w-full grid h-fit">
    <div
      class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white">
      <ButtonNavegacao
        titulo="Chips e Planos"
        cor="bg-[#264653]"
        link="ti/chips">
        <img
          src="@/assets/icons/sim-card-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue"
import GraficoRotas from "~/components/Graphic/Administracao/Transporte/GraficoRotas.vue"

export default {
  components: { ButtonNavegacao },
  data() {
    return {
    }
  },
  created() {
  },
}
</script>

<style scoped></style>
