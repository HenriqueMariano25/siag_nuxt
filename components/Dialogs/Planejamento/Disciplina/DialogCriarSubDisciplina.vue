<template>
  <BaseDialog
    :titulo="subDisciplina === null ? 'Criar sub disciplina' : `Editando sub disciplina - ${subDisciplina.descricao}`"
    :carregando="carregando"
    :btnDeletar="subDisciplina !== null"
    @deletar="deletarSubDisciplina"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div
        class="flex w-full px-2"
        style="max-height: calc(80vh)">
        <div
          class="w-full flex gap-x-3 gap-y-3"
          ref="formulario">
          <AppFormInput
            label="Descrição"
            obrigatorio
            class="grow"
            type="text"
            id="descricao"
            placeholder="Ex: Tubulação"
            :invalido="erros.includes('descricao')"
            v-model="subDisciplinaLocal.descricao" />
          <AppFormSelectCompleto
            obrigatorio
            class="grow"
            id="rota"
            label="Disciplina"
            :options="disciplinas"
            :invalido="erros.includes('disciplina_id')"
            v-model="subDisciplinaLocal.disciplina_id"/>
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
import { buscarDisciplina } from "~/mixins/buscarInformacoes";
import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue";

export default defineComponent({
  mixins: [buscarDisciplina],
  name: "DialogCriarSubDisciplina",
  components: { AppFormSelectCompleto, BotaoPadrao, AppFormSelect, AppFormInput, BaseDialog },
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
        disciplina_id: null
      },
      carregando: false,
      erros: [],
      disciplinas: []
    }
  },
  async created() {
    if (this.subDisciplina !== null) {
      this.subDisciplinaLocal = Object.assign({}, this.subDisciplina)
    }

    await this.buscarDisciplinas()
  },
  methods: {
    async buscarDisciplinas() {
      await this.buscarDisciplina()
      let disciplinas = this.$store.state.disciplina.disciplinas

      this.disciplinas = disciplinas.map((o) => {
        return {
          id: o.id,
          nome: `${o.sigla} - ${o.descricao}`,
        }
      })
    },

    cancelar() {
      this.$emit("cancelar")
    },

    validarFormulario() {
      this.erros = []

      let camposObrigatorio = [
        "descricao",
        "disciplina_id"
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
