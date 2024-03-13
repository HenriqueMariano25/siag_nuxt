<template>
  <div>
    <BaseDialog
      largura="w-8/12"
      titulo="CADASTRAR MODELO"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2">
          <AppFormInput id="modelo" type="text" label="Modelo" v-model="nome" placeholder="Ex: Optiplex 3050" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex items-center gap-2">
          <span class="text-red-400 text-bold" v-if="jaCriado">Já existe essa modelo!</span>
          <BotaoPadrao texto="salvar" @clique="cadastrarModelo()">
            <img src="../../../../../assets/icons/save-b.svg" alt="" class="w-7 h-7">
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
  props: {
    desk_note: {
      type: String,
    }
  },
  data() {
    return {
      nome: null,
      jaCriado: false
    };
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async cadastrarModelo() {
      this.jaCriado = false
      let nome = this.nome
      let desk_note = this.desk_note
      let resp = await this.$axios.$post("/ti/modeloDeskNote/cadastrar", { nome, desk_note })

      if (!resp.falha) {
        let { modelo, criado } = resp.dados

        if (!criado) {
          this.jaCriado = true
        } else {
          this.$store.commit("ti/modeloDeskNoteTI/ATUALIZAR_MODELOS_DESKNOTE_TI", {
            modelo
          })
          this.$emit("cadastrado")
        }
      }
    }
  }
};
</script>

<style scoped>

</style>e
