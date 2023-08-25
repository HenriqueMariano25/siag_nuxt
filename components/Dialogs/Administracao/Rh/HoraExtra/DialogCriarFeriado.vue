<template>
  <div>
    <BaseDialog
      :titulo="feriado === null ? 'Criar feriado' : `Editando feriado`"
      :btnDeletar="feriado !== null"
      @deletar="deletarFeriado"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2 grid grid-cols-3 gap-3">
          <AppFormInput
            id="descricao"
            type="text"
            v-model="feriadoLocal.descricao"
            label="Descrição"
            :invalido="erros.includes('descricao')"
            placeholder="Ex: Natal"
            class="col-span-2"
            obrigatorio />
          <AppFormInput
            id="data"
            type="date"
            v-model="feriadoLocal.data"
            :invalido="erros.includes('data')"
            label="Data"
            placeholder="Ex: 5"
            obrigatorio />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao
          texto="salvar"
          @clique="feriado === null ? cadastrarFeriado() : editarFeriado()">
          <img
            src="@/assets/icons/save-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";

export default {
  name: "DialogCriarFeriado",
  components: { AppFormInput, BaseDialog, BotaoPadrao },
  props: {
    feriado: {
      type: Object,
    },
  },
  data() {
    return {
      feriadoLocal: {
        descricao: null,
        data: null,
      },
      erros: [],
    }
  },
  created() {
    if (this.feriado) {
      this.feriadoLocal = Object.assign({}, this.feriado)
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    validarFormulario() {
      this.erros = []

      let camposObrigatorio = ["descricao", "data"]

      for (let campo of camposObrigatorio) {
        if (this.feriadoLocal[`${campo}`] === null || this.feriadoLocal[`${campo}`] === "")
          this.erros.push(campo)
      }
    },
    async cadastrarFeriado() {
      let { descricao, data } = this.feriadoLocal

      await this.validarFormulario()

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post("/hora_extra/feriado/cadastrar", {
          data,
          descricao,
        })

        if (!resp.falha) {
          this.$emit("cadastrado", resp.feriado)
        }
      }
    },
    async editarFeriado() {
      let { data, descricao, id } = this.feriadoLocal

      await this.validarFormulario()

      if (this.erros.length === 0) {
        let resp = await this.$axios.$put("/hora_extra/feriado/editar", {
          data,
          descricao,
          id,
        })

        if (!resp.falha) {
          this.$emit("editado", this.feriadoLocal)
        }
      }
    },
    async deletarFeriado() {
      let { id } = this.feriado

      let resp = await this.$axios.$delete("/hora_extra/feriado/deletar", { params: { id } })

      if (!resp.falha) {
        this.$emit("deletado", id)
      }
    }
  },
};
</script>

<style scoped>

</style>
