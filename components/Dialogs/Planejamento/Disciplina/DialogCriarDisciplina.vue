<template>
  <div>
    <BaseDialog
      :titulo="disciplina === null ? 'Criar disciplina' : `Editando disciplina - ${disciplina.descricao}`"
      :carregando="carregando"
      :btnDeletar="disciplina !== null"
      @deletar="deletarDisciplina"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div
          class="flex w-full overflow-auto px-2"
          style="max-height: calc(80vh)">
          <div
            class="w-full flex gap-x-3 gap-y-3"
            ref="formulario">
            <AppFormInput
              label="Sigla"
              type="text"
              id="sigla"
              placeholder="Ex: ADM"
              :invalido="erros.includes('sigla')"
              v-model="disciplinaLocal.sigla" />
            <AppFormInput
              label="Descrição"
              class="grow"
              type="text"
              id="descricao"
              placeholder="Ex: Administração"
              :invalido="erros.includes('descricao')"
              v-model="disciplinaLocal.descricao" />
            <AppFormSelect
              label="Setor"
              :options="setores"
              v-model="disciplinaLocal.setor_id"
              :invalido="erros.includes('setor_id')"
              id="motivo"
            />
          </div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex justify-end" >
          <BotaoPadrao texto="Salvar" @clique="disciplina ? editarDisciplina() : cadastrarDisciplina()">
            <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import { buscarSetores } from "~/mixins/buscarInformacoes"
import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default defineComponent({
  mixins: [buscarSetores],
  name: "DialogCriarDisciplina",
  components: { BotaoPadrao, AppFormSelect, AppFormInput, BaseDialog },
  props: {
    disciplina: {
      type: [Object],
      default: null
    }
  },
  data(){
    return{
      disciplinaLocal: {
        sigla: null,
        descricao: null,
        setor_id: null
      },
      carregando: false,
      setores: [],
      erros: []
    }
  },
  created(){
    this.buscarTodosSetores()

    if(this.disciplina !== null){
      this.disciplinaLocal = Object.assign({}, this.disciplina)
    }
  },
  methods: {
    cancelar(){
      this.$emit("cancelar")
    },
    async buscarTodosSetores() {
      let setores = await this.buscarSetores()

      let options = setores.map((o) => {
        return { id: o.id, nome: o.nome }
      })

      this.setores = options
    },

    validarFormulario() {
      this.erros = []

      let camposObrigatorio = [
        "sigla",
        "descricao",
        "setor_id",
      ]

      for (let campo of camposObrigatorio) {
        if (this.disciplinaLocal[`${campo}`] === null || this.disciplinaLocal[`${campo}`] === "") this.erros.push(campo)
      }
    },

    async cadastrarDisciplina(){
      let disciplina = this.disciplinaLocal

      this.validarFormulario()

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post('/planejamento/disciplina/cadastrar', { ...disciplina })
        if(!resp.falha){
          let disciplinaCriada = resp.dados.disciplina

          this.$emit("cadastrado", disciplinaCriada)
        }
      }
    },

    async editarDisciplina(){
      let disciplina = this.disciplinaLocal

      this.validarFormulario()

      if (this.erros.length === 0) {
        let resp = await this.$axios.$put('/planejamento/disciplina/editar', { ...disciplina })
        if (!resp.falha) {
          let disciplinaEditada = resp.dados.disciplina

          this.$emit("editado", disciplinaEditada)
        }
      }

    },
    async deletarDisciplina() {
      let id = this.disciplina.id

      let resp = await this.$axios.$delete("/planejamento/disciplina/deletar", { params: { id } })

      if (!resp.falha) {
        this.$emit("deletado", id)
      }
    }
  }

});
</script>

<style scoped>

</style>
