<template>
  <div class="bg-white shadow-lg w-full p-2 rounded-sm">
    <form>
      <div class="grid grid-cols-3 gap-5">
        <AppFormInput placeholder="Ex: 3" label="Quantidade" type="number" />
        <AppFormSelect label="Status" :options="[]"/>
        <AppFormInput label="Setor" type="text" :readonly="true" :disabled:="true"/>
        <AppFormSelect label="Centro de Custo" :options="[]" />
        <AppFormSelect label="Função" :options="[]" />
        <AppFormSelect label="Disciplina" :options="[]" />
        <AppFormInput  label="Data de necesisdade" type="date" />
        <AppFormSelect label="Função" :options="[]"/>
        <AppFormInput placeholder="R$ 2345,67" label="Sálario" type="text" />
      </div>
    </form>
  </div>
</template>

<script>

import AppFormInput from "~/components/Ui/AppFormInput.vue";
import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
export default {
  name: "CriarCard",
  components: {
    AppFormInput,
    AppFormSelect
  },
  data(){
    return{
      card: {
        quantidade: 1,
        status: null,
        setor_id: null,
        centro_custo_pep_id: null,
        funcao_id: null,
        disciplina_id: null,
        data_necessidade: null,
        salario: null,
        turno: null,
        tipo_recrutamento: null,
        mobilizacao: null,
        entrevista_gestor: false,
        tem_indicacao: false,
        indicacao: {
          nome: null,
          telefone: null,
          email: null,
          indicado_por: null,
          pdf: null,
          url_pdf: null,
        },
        nrs: [],
        equipamentos: [],
        comentario: null,
        avaliar_ingles: false,
        teste_especificos: false,
        confidencial: false,
        equipamento_ti: null,
      },
    }
  }
}
</script>

<style scoped>

</style>
