<template>
  <div>
    <BaseDialog
      largura="w-6/12"
      titulo="CADASTRAR PROCEDÊNCIA"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2">
          <AppFormInput id="procedencia" type="text" label="Procedência" v-model="nome" uppercase
                        placeholder="Ex: UTENT" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex items-center gap-2">
          <span class="text-red-400 text-bold" v-if="jaCriado">Já existe essa procedência!</span>
          <BotaoPadrao texto="salvar" @clique="cadastrarProcedencia()">
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
    async cadastrarProcedencia() {
      this.jaCriado = false
      let nome = this.nome
      let resp = await this.$axios.$post("/ti/procedencia/cadastrar", { nome })

      if (!resp.falha) {
        let { procedencia, criado } = resp.dados

        if (!criado) {
          this.jaCriado = true
        } else {
          this.$store.commit("ti/localInstalacaoTI/ATUALIZAR_MARCAS_TI", {
            procedencia
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
