<template>
  <div>
    <BaseDialog
      largura="w-6/12"
      titulo="Cadastrar Motivo"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2">
          <AppFormInput id="motivo" type="text" label="Motivo" v-model="motivo" placeholder="Ex: Levar um colaborador" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex items-center gap-2">
          <span class="text-red-400 text-bold" v-if="jaCriado">Já existe esse motivo!</span>
          <BotaoPadrao texto="salvar" @clique="cadastrarMotivo()">
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
      motivo: null,
      jaCriado: false
    };
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async cadastrarMotivo() {
      this.jaCriado = false
      let motivo = this.motivo
      let resp = await this.$axios.$post("/pool/motivo/cadastrar", { motivo })

      if (!resp.falha) {
        let { motivo: motivoCriado, criado } = resp.dados

        if (!criado) {
          this.jaCriado = true
        } else {
          this.$emit("cadastrado", motivoCriado)
        }
      }
    }
  }
};
</script>

<style scoped>

</style>e
