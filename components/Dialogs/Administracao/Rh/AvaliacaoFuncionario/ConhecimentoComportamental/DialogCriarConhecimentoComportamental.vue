<template>
  <div>
    <BaseDialog
      largura="w-8/12"
      :titulo="conhecimento ? 'EDITAR CONHE. COMPORTAMENTAL' : 'CADASTRAR CONHE. COMPORTAMENTAL'"
      :btn-deletar="!!conhecimento"
      @deletar="deletarConhecimento()"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2">
          <AppFormInput
            id="descricao"
            type="text"
            placeholder="Ex: LIDERANÇA"
            :invalido="erros.includes('descricao')"
            v-model="conhecimentoLocal.descricao"
            label="Nome do Conhecimento" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="conhecimento ? editarConhecimento() : cadastrarConhecimento()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import { validarFormulario } from "~/mixins/validarFormulario";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  components: { BotaoPadrao, AppFormInput, BaseDialog },
  props: {
    conhecimento: {
      type: Object,
    }
  },
  data() {
    return {
      conhecimentoLocal: {
        descricao:null,
      },
      erros: []
    };
  },
  mounted() {
    if(this.conhecimento){
      this.conhecimentoLocal = Object.assign({}, this.conhecimento)
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    async cadastrarConhecimento(){
      this.erros = validarFormulario(['descricao'], this.conhecimentoLocal)

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post("/conhecimento_comportamental/cadastrar", {
          ...this.conhecimentoLocal
        })

        if (!resp.falha) {
          this.$emit("cadastrado", resp.dados.conhecimentoComportamental)
        }
      }
    },

    async editarConhecimento(){
      this.erros = validarFormulario(['descricao'], this.conhecimentoLocal)

      let { id } = this.conhecimento
      let { descricao } = this.conhecimentoLocal

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post(`/conhecimento_comportamental/editar`, {
          descricao, id
        })

        if (!resp.falha) {
          this.$emit("editado", resp.dados.conhecimentoComportamental)
        }
      }
    },

    async deletarConhecimento(){
      let { id } = this.conhecimento

      let resp = await this.$axios.$delete("/conhecimento_comportamental/deletar", { params: {id}})

      if(!resp.falha){
        this.$emit("deletado", id)
      }
    }
  }
};
</script>

<style scoped>

</style>
