<template>
  <BaseDialog
    :titulo="subDisciplina === null ? 'Criar sub disciplina' : `Editando sub disciplina - ${subDisciplina.descricao}`"
    :carregando="carregando"
    :btnDeletar="subDisciplina !== null"
    @deletar="deletarSubDisciplina"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div
        class="flex w-full overflow-auto px-2"
        style="max-height: calc(80vh)">
        <div
          class="w-full flex gap-x-3 gap-y-3"
          ref="formulario">
          <AppFormInput
            label="Descrição"
            class="grow"
            type="text"
            id="descricao"
            placeholder="Ex: Tubulação"
            :invalido="erros.includes('descricao')"
            v-model="subDisciplinaLocal.descricao" />
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex justify-end">
        <BotaoPadrao texto="Salvar" @click="subDisciplina ? editarSubDisciplina() : cadastrarSubDisciplina()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </div>
    </template>
  </BaseDialog>
</template>


<script>
import { defineComponent } from "vue";
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default defineComponent({
  name: "DialogCriarSubDisciplina",
  components: { BotaoPadrao, AppFormSelect, AppFormInput, BaseDialog },
  props: {
    subDisciplina: {
      type: [Object],
      default: null
    }
  },
  data() {
    return {
      subDisciplinaLocal: {
        descricao: null,
      },
      carregando: false,
      erros: []
    }
  },
  created() {
    if (this.subDisciplina !== null) {
      this.subDisciplinaLocal = Object.assign({}, this.subDisciplina)
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    validarFormulario() {
      this.erros = []

      let camposObrigatorio = [
        "descricao",
      ]

      for (let campo of camposObrigatorio) {
        if (this.subDisciplinaLocal[`${campo}`] === null || this.subDisciplinaLocal[`${campo}`] === "") this.erros.push(campo)
      }
    },

    async cadastrarSubDisciplina() {
      let subDisciplina = this.subDisciplinaLocal

      this.validarFormulario()

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post('/planejamento/sub_disciplina/cadastrar', { ...subDisciplina })
        if (!resp.falha) {
          let subDisciplinaCriada = resp.dados.subDisciplina


          this.$emit("cadastrado", subDisciplinaCriada)
        }
      }
    },

    async editarSubDisciplina() {
      let subDisciplina = this.subDisciplinaLocal

      this.validarFormulario()

      if (this.erros.length === 0) {
        let resp = await this.$axios.$put('/planejamento/sub_disciplina/editar', { ...subDisciplina })
        if (!resp.falha) {
          let subDisciplinaEditada = resp.dados.subDisciplina

          this.$emit("editado", subDisciplinaEditada)
        }
      }

    },
    async deletarSubDisciplina() {
      let id = this.subDisciplina.id

      let resp = await this.$axios.$delete("/planejamento/sub_disciplina/deletar", { params: { id } })

      if (!resp.falha) {
        this.$emit("deletado", id)
      }
    }
  }
});
</script>

<style scoped>

</style>
