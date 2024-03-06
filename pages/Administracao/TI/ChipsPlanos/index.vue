<template>
  <div class="w-full grid h-fit">
    <CabecalhoPagina titulo="CHIPS E PLANOS" />
    <div
      class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
      <ButtonNavegacao
        titulo="Chips"
        cor="bg-[#264653]"
        link="chipsPlanos/chips">
        <img
          src="@/assets/icons/sim-card-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Configurações"
        cor="bg-[#264653]"
        link="chipsPlanos/configuracoes">
        <img
          src="@/assets/icons/cog-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue"
import GraficoRotas from "~/components/Graphic/Administracao/Transporte/GraficoRotas.vue"
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

export default {
  components: { CabecalhoPagina, ButtonNavegacao },
  data() {
    return {}
  },
  created() {
  },
}
</script>

<style scoped></style>
