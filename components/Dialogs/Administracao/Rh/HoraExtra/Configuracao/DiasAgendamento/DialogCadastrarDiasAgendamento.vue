<template>
  <div style="">
    <BaseDialog
      :titulo="dia ? 'EDITAR DIA P/ AGENDAMENTO' :'CADASTRAR DIA P/ AGENDAMENTO'"
      :btnDeletar="!!dia"
      @deletar="deletado()"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="grid grid-cols-2 gap-2 px-2">
          <AppFormInput
            id="data"
            type="date"
            label="Data do agendamento"
            obrigatorio
            :invalido="erros.includes('data')"
            v-model="diaLocal.data" />
          <AppFormInput
            id="data_liberacao"
            type="date"
            label="Data de liberação"
            :invalido="erros.includes('data_liberacao')"
            obrigatorio
            v-model="diaLocal.data_liberacao" />
          <AppFormInput
            id="data_liberacao"
            type="text"
            label="Descrição"
            :invalido="erros.includes('descricao')"
            placeholder="Ex: Recesso de fim de ano"
            obrigatorio
            v-model="diaLocal.descricao"
            class="col-span-2" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex gap-2 items-center">
          <span v-if="mensagemErro" class="text-red-400 text-xl">{{ mensagemErro }}</span>
        <BotaoPadrao texto="salvar" @clique="dia ? editar() : cadastrar()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import { validarFormulario } from "~/mixins/validarFormulario";

export default {
  components: { BotaoPadrao, AppFormInput, BaseDialog },
  props: {
    dia: {
      type: Object,
    }
  },
  data() {
    return {
      diaLocal: {
        data: null,
        data_liberacao: null,
        descricao: null
      },
      mensagemErro: null,
      erros: []
    };
  },
  mounted() {
    if(this.dia){
      this.diaLocal = Object.assign({}, this.dia)
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async cadastrar(){
      this.mensagemErro = null
      let campos = Object.keys(this.diaLocal)
      this.erros = validarFormulario(campos, this.diaLocal)

      if(this.erros.length === 0){
        let usuario_id = this.$auth.user.id
        let { data, data_liberacao, descricao } = this.diaLocal

        let resp = await this.$axios.$post("/hora_extra/dias_agendamento/cadastrar", { data, data_liberacao, descricao, usuario_id })

        if(!resp.falha){
          let dia = resp.dados.dia
          this.$emit("cadastrado", dia)
        }else{
          this.mensagemErro = resp.dados.mensagem
        }
      }
    },
    async editar(){
      this.mensagemErro = null
      let campos = ['descricao', 'data', 'data_liberacao']
      this.erros = validarFormulario(campos, this.diaLocal)

      if (this.erros.length === 0) {
        let usuario_id = this.$auth.user.id
        let { data, data_liberacao, descricao, id } = this.diaLocal

        let resp = await this.$axios.$put("/hora_extra/dias_agendamento/editar", {
          data,
          data_liberacao,
          descricao,
          usuario_id,
          id
        })

        if (!resp.falha) {
          let dia = resp.dados.dia

          this.$emit("editado", dia)
        } else {
          this.mensagemErro = resp.dados.mensagem
        }
      }
    },
    async deletado(){
      let { id } = this.dia

      let resp = await this.$axios.$delete("/hora_extra/dias_agendamento/deletar", { params: {id} })

      if(!resp.falha){
        this.$emit("deletado", id)
      }
    }
  }
};
</script>

<style scoped>

</style>
