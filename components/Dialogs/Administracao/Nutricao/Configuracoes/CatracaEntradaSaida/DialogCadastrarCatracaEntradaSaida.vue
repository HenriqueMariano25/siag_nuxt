<template>
  <div>
    <BaseDialog
      :titulo="`CADASTRAR ${tipoCadastro ? tipoCadastro.toUpperCase() : ''}` "
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="w-full px-2">
          <AppFormInput
            type="number"
            placeholder="Ex: 5"
            label="Número da catraca"
            v-model="numero"
            id="numero" />
          <span v-if="erroCadastrado" class="font-bold text-red-600 px-1 text-xl mt-1">Essa catraca já está vinculada a entrada ou saída!</span>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="cadastrar()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  components: { BotaoPadrao, AppFormInput, BaseDialog },
  props: {
    tipoCadastro: {
      type: String,
    }
  },
  data() {
    return {
      numero: null,
      erroCadastrado: false
    };
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async cadastrar(){
      let numero = this.numero
      let tipo = this.tipoCadastro

      let resp = await this.$axios.$post("/nutricao/catracas/cadastrar", { numero, tipo })
      if(!resp.falha){
        console.log(resp);
        if(!resp.dados.foiCriado){
          this.erroCadastrado = true
        }else{
          let catraca = { numero, tipo, id: resp.dados.catraca.id }

          this.$emit("cadastrado", catraca)
        }
      }
    }
  },

};
</script>

<style scoped>

</style>
