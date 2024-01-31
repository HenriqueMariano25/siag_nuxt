<template>
  <div>
    <BaseDialog
      largura="w-8/12"
      :titulo="habilidade ? 'EDITAR HAB. TÉCNICA' : 'CADASTRAR HAB. TÉCNICA'"
      :btn-deletar="!!habilidade"
      @deletar="deletarHabilidade()"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2">

          <AppFormTextarea
            id="descricao"
            label="Descrição"
            placeholder="Ex: Conhece tecnicamente o que é exigido do seu cargo"
            :invalido="erros.includes('descricao')"
            v-model="habilidadeLocal.descricao"
            linhas="2"
            :total-caracteres="255"
            class="" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="habilidade ? editarHabilidade() : cadastrarHabilidade()">
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
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";

export default {
  components: { AppFormTextarea, BotaoPadrao, AppFormInput, BaseDialog },
  props: {
    habilidade: {
      type: Object,
    }
  },
  data() {
    return {
      habilidadeLocal: {
        descricao: null,
      },
      erros: []
    };
  },
  mounted() {
    if (this.habilidade) {
      this.habilidadeLocal = Object.assign({}, this.habilidade)
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    async cadastrarHabilidade() {
      this.erros = validarFormulario(['habilidade'], this.habilidadeLocal)

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post("/habilidade_tecnica/cadastrar", {
          ...this.habilidadeLocal
        })

        if (!resp.falha) {
          this.$emit("cadastrado", resp.dados.habilidade)
        }
      }
    },

    async editarHabilidade() {
      this.erros = validarFormulario(['habilidade'], this.habilidadeLocal)

      let { id } = this.habilidade
      let { descricao } = this.habilidadeLocal

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post(`/habilidade_tecnica/editar`, {
          descricao, id
        })

        if (!resp.falha) {
          this.$emit("editado", resp.dados.habilidade)
        }
      }
    },

    async deletarHabilidade() {
      let { id } = this.habilidade

      let resp = await this.$axios.$delete("/habilidade_tecnica/deletar", { params: { id } })

      if (!resp.falha) {
        this.$emit("deletado", id)
      }
    }
  }
};
</script>

<style scoped>

</style>
