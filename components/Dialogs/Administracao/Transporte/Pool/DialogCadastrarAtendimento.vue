<template>
  <div>
    <BaseDialog
      largura="w-6/12"
      titulo="Cadastrar Atendimento"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2">
          <AppFormInput id="local" type="text" label="Local" v-model="local" placeholder="Ex: Cajueiro"/>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex items-center gap-2">
          <span class="text-red-400 text-bold" v-if="jaCriado">Já existe um atendimento com esse local!</span>
          <BotaoPadrao texto="salvar" @clique="cadastrarAtendimento()">
            <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  components: { BotaoPadrao, AppFormInput, BaseDialog },
  data() {
    return {
      local: null,
      jaCriado: false
    };
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async cadastrarAtendimento(){
      this.jaCriado = false
      let local = this.local
      let resp = await this.$axios.$post("/pool/atendimento/cadastrar", { local })

      if(!resp.falha){
        let { local: localCriado, criado} = resp.dados

        if(!criado){
          this.jaCriado = true
        }else{
          this.$emit("cadastrado", localCriado)
        }
      }
    }
  }
};
</script>

<style scoped>

</style>e
