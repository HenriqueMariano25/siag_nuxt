<template>
  <div class="w-full grid h-fit">
    <CabecalhoPagina titulo="T.I" />
    <div
      class="border grid grid-cols-4 gap-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
      <ButtonNavegacao
        titulo="Funcionários"
        cor="bg-[#264653]"
        v-if="
					$auth.user.permissoes.includes(
						'prototipo',
					)
				"
        link="ti/Funcionarios">
        <img
          src="@/assets/icons/people-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Desktop"
        cor="bg-[#264653]"
        v-if="
					$auth.user.permissoes.includes(
						'prototipo',
					)
				"
        link="ti/desktop">
        <img
          src="@/assets/icons/desktop-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Notebook"
        cor="bg-[#264653]"
        v-if="
					$auth.user.permissoes.includes(
						'prototipo',
					)
				"
        link="ti/notebook">
        <img
          src="@/assets/icons/notebook-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Monitor"
        v-if="
					$auth.user.permissoes.includes(
						'prototipo',
					)
				"
        cor="bg-[#264653]"
        link="ti/monitor">
        <img
          src="@/assets/icons/monitor-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Equipamento"
        v-if="
					$auth.user.permissoes.includes(
						'prototipo',
					)
				"
        cor="bg-[#264653]"
        link="ti/Equipamento">
        <img
          src="@/assets/icons/mouse-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Chips e Planos"
        cor="bg-[#264653]"
        link="ti/chipsPlanos">
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
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

export default {
  components: { CabecalhoPagina, ButtonNavegacao },
  data() {
    return {
    }
  },
  created() {
  },
}
</script>

<style scoped></style>
