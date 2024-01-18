<template>
  <div>
    <BaseDialog
      largura="w-8/12"
      :titulo="disponibilidade ? 'EDITAR DISPONIBILIDADE' : 'CADASTRAR DISPONIBILIDADE'"
      :btn-deletar="!!disponibilidade"
      @deletar="deletarDisponibilidade()"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2">
          <AppFormInput
            id="descricao"
            uppercase
            type="text"
            placeholder="Ex: EUROPA"
            :invalido="erros.includes('descricao')"
            v-model="disponibilidadeLocal.descricao"
            label="Local" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="disponibilidade ? editarDisponibilidade() : cadastrarDisponibilidade()">
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
    disponibilidade: {
      type: Object,
    }
  },
  data() {
    return {
      disponibilidadeLocal: {
        descricao: null,
      },
      erros: []
    };
  },
  mounted() {
    if (this.disponibilidade) {
      this.disponibilidadeLocal = Object.assign({}, this.disponibilidade)
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    async cadastrarDisponibilidade() {
      this.erros = validarFormulario(['descricao'], this.disponibilidadeLocal)

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post("/disponibilidade_trabalho/cadastrar", {
          ...this.disponibilidadeLocal
        })

        if (!resp.falha) {
          this.$emit("cadastrado", resp.dados.disponibilidade)
        }
      }
    },

    async editarDisponibilidade() {
      this.erros = validarFormulario(['descricao'], this.disponibilidadeLocal)

      let { id } = this.disponibilidade
      let { descricao } = this.disponibilidadeLocal

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post(`/disponibilidade_trabalho/editar`, {
          descricao, id
        })

        if (!resp.falha) {
          this.$emit("editado", resp.dados.disponibilidade)
        }
      }
    },

    async deletarDisponibilidade() {
      let { id } = this.disponibilidade

      let resp = await this.$axios.$delete("/disponibilidade_trabalho/deletar", { params: { id } })

      if (!resp.falha) {
        this.$emit("deletado", id)
      }
    }
  }
};
</script>

<style scoped>

</style>
