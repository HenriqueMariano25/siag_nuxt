<template>
  <div>
    <BaseDialog
      largura="w-8/12"
      :titulo="tipoObra ? 'EDITAR TIPO DE OBRA' : 'CADASTRAR TIPO DE OBRA'"
      :btn-deletar="!!tipoObra"
      @deletar="deletarTipoObra()"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2">
          <AppFormInput
            id="descricao"
            uppercase
            type="text"
            placeholder="Ex: FERROVIA"
            :invalido="erros.includes('descricao')"
            v-model="tipoObraLocal.descricao"
            label="Tipo de obra" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="tipoObra ? editarTipoObra() : cadastrarTipoObra()">
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
    tipoObra: {
      type: Object,
    }
  },
  data() {
    return {
      tipoObraLocal: {
        descricao: null,
      },
      erros: []
    };
  },
  mounted() {
    if (this.tipoObra) {
      this.tipoObraLocal = Object.assign({}, this.tipoObra)
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    async cadastrarTipoObra() {
      this.erros = validarFormulario(['descricao'], this.tipoObraLocal)

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post("/tipo_obra/cadastrar", {
          ...this.tipoObraLocal
        })

        if (!resp.falha) {
          this.$emit("cadastrado", resp.dados.tipoObra)
        }
      }
    },

    async editarTipoObra() {
      this.erros = validarFormulario(['descricao'], this.tipoObraLocal)

      let { id } = this.tipoObra
      let { descricao } = this.tipoObraLocal

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post(`/tipo_obra/editar`, {
          descricao, id
        })

        if (!resp.falha) {
          this.$emit("editado", resp.dados.tipoObra)
        }
      }
    },

    async deletarTipoObra() {
      let { id } = this.tipoObra

      let resp = await this.$axios.$delete("/tipo_obra/deletar", { params: { id } })

      if (!resp.falha) {
        this.$emit("deletado", id)
      }
    }
  }
};
</script>

<style scoped>

</style>
