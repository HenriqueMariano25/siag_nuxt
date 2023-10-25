<template>
  <div>
    <BaseDialog
      :titulo="plano === null ? 'Criar plano' : `Editando plano - ${plano.nome}`"
      :btnDeletar="plano !== null"
      @deletar="deletarPlano"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2 grid grid-cols-3 gap-3">
          <AppFormInput
            id="nome"
            type="text"
            v-model="planoLocal.nome"
            label="Nome"
            :invalido="erros.includes('nome')"
            placeholder="Ex: Claro Max 1gb"
            class="col-span-2"
            obrigatorio />
          <AppFormInput
            id="valor"
            type="text"
            v-money="{ precision: 2, prefix: 'R$ ', decimal: ',', thousands: '.' }"
            v-model="planoLocal.valor"
            :invalido="erros.includes('valor')"
            label="Valor"
            placeholder="Ex: 5"
            obrigatorio />
          <AppFormTextarea
            id="descricao"
            label="Descrição"
            placeholder="Descrição do plano"
            v-model="planoLocal.descricao"
            :total-caracteres="1000"
            class="col-span-3" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao
          texto="salvar"
          @clique="plano === null ? cadastrarPlano() : editarPlano()">
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
import BaseDialog from "~/components/Shared/BaseDialog.vue"
import AppFormInput from "~/components/Ui/AppFormInput.vue"
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";

export default {
  name: "DialogCriarPlano",
  components: { AppFormTextarea, BotaoPadrao, AppFormInput, BaseDialog },
  props: {
    plano: {
      type: Object,
    },
  },
  data() {
    return {
      planoLocal: {
        nome: null,
        valor: null,
        descricao: null,
      },
      erros: [],
    }
  },
  created() {
    if (this.plano) {
      this.planoLocal = Object.assign({}, this.plano)
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    validarFormulario() {
      this.erros = []

      let camposObrigatorio = ["nome", "valor", "descricao"]

      for (let campo of camposObrigatorio) {
        let valor = this.planoLocal[`${campo}`].trim()
        if (valor === null || valor === "")
          this.erros.push(campo)
      }
    },
    async cadastrarPlano() {
      let plano = this.planoLocal

      await this.validarFormulario()

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post("/ti/plano/adicionar", { ...plano })

        if (!resp.falha) {
          this.$emit("cadastrado", resp.dados.plano)
        }
      }
    },
    async editarPlano() {
      let plano = this.planoLocal

      await this.validarFormulario()

      if (this.erros.length === 0) {
        let resp = await this.$axios.$put("/ti/plano/editar", { ...plano })

        if (!resp.falha) {
          this.$emit("editado", this.planoLocal)
        }
      }
    },
    async deletarPlano() {
      let { id } = this.plano

      let resp = await this.$axios.$delete(`/ti/plano/deletar/${id}`)

      if (!resp.falha) {
        this.$emit("deletado", id)
      }
    }
  },
}
</script>

<style scoped></style>
