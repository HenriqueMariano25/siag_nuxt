<template>
  <div class="w-full grid grid-cols-1 h-fit gap-y-2">
    <div
      class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white">
      <ButtonNavegacao titulo="Solicitações" cor="bg-[#264653]" link="psp/solicitacoes">
        <img src="@/assets/icons/travel-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Configurações" cor="bg-[#264653]" link="psp/configuracoes">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue"
import AppTabs from "~/components/Ui/AppTabs.vue"
import AppFormInput from "~/components/Ui/AppFormInput.vue"
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

export default {
  name: "index",
  components: {
    ButtonNavegacao,
    AppTabs,
    AppFormInput,
    BotaoPadrao,
  },
  data() {
    return {
    }
  },
}
</script>

<style scoped></style>
