<template>
  <BaseDialog
    titulo="Editar prazo na funçao"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="px-2 gap-2 flex flex-col">
        <AppFormInput id="funcao" type="text" placeholder="Ex: Programador" label="Função" v-model="funcaoLocal.nome" obrigatorio readonly disabled/>
        <AppFormInput id="prazo" type="number" placeholder="Ex: 35" label="Prazo" v-model="funcaoLocal.prazo" obrigatorio />
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <BotaoPadrao texto="salvar" @clique="salvar" :disabled="temCampoVazio">
        <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
      </BotaoPadrao>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  name: "DialogCriarPrazoPFuncao",
  components:{
    BotaoPadrao,
    AppFormInput,
    BaseDialog
  },
  props:{
    funcao: {
      type: Object
    }
  },
  data() {
    return {
      funcaoLocal: {
        nome: null,
        prazo: null
      }
    };
  },
  computed: {
    temCampoVazio() {
      return Object.values(this.funcaoLocal).includes(null) || Object.values(this.funcaoLocal).includes("");
    }
  },
  created() {
    if(this.funcao){
      this.funcaoLocal.nome = this.funcao.id
      this.funcaoLocal.prazo = this.funcao.prazo ? this.funcao.prazo : null
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async salvar(){
      let { prazo, nome: funcao } = this.funcaoLocal

      let resp = await this.$axios.$post("/psp/configuracoes/editar/prazo_funcao", { prazo, funcao })

      if(!resp.falha){
        this.$emit("editado", { prazo, funcao })
      }
    }
  }
};
</script>


<style scoped>

</style>
