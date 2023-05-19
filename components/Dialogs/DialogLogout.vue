<template>
  <BaseDialog
    style="z-index: 110"
    titulo=""
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="w-full flex justify-center text-4xl">
        <h1><strong>Tem certeza que deseja sair do SIAG ?</strong></h1>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center gap-5 text-black">
        <BotaoPadrao cor="bg-red-500" @click="sair()"
          texto="Sair">
        </BotaoPadrao>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
export default {
  name: "DialogLogout",
  components:{
    BaseDialog,
    BotaoPadrao
  },
  methods:{
    cancelar(){
      this.$emit("cancelar")

    },
    async sair(){
      await this.$router.push("/login")
      this.$auth.setUser(null)
      await this.$auth.setUserToken(null)
    }
  }
}
</script>

<style scoped>

</style>
