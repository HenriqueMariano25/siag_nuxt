<template>
  <BaseDialog
    :btnDeletar="permissao_id"
    @deletar="deletarPermissao"
    :titulo="permissao_id === null ? 'Criar permissão' : `Editando permissão`"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="px-2 flex-col space-y-2">
        <AppFormInput
          label="Descrição"
          type="text"
          obrigatorio
          id="descricao"
          v-model="permissao.descricao"/>
        <AppFormTextarea label="Detalhes" id="detalhes" v-model="permissao.detalhe"/>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
<!--        <BotaoPadrao texto="Deletar" cor="bg-red-500" class="flex">-->
<!--          <template v-slot>-->
<!--            <img src="@/assets/icons/delete-b.svg" alt="close" class="w-6 h-6"/>-->
<!--          </template>-->
<!--        </BotaoPadrao>-->
        <BotaoSalvar class="flex" @click="permissao_id ? editarPermissao() : criarPermissao()"/>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";
import BotaoSalvar from "~/components/Ui/Buttons/BotaoSalvar.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
export default {
  name: "DialogCriarPermissao",
  components:{
    BaseDialog,
    AppFormInput,
    AppFormTextarea,
    BotaoSalvar,
    BotaoPadrao
  },
  props:{
    permissao_id:{
      type: [Number, String],
      default: null
    }
  },
  data(){
    return{
      permissao: {
        descricao: null,
        detalhe: null
      }
    }
  },
  async mounted(){
    if(this.permissao_id !== null){
      await this.buscarPermissao()
    }
  },
  methods:{
    cancelar(){
      this.$emit("cancelar")
    },
    async criarPermissao(){
      let { detalhe, descricao } = this.permissao

      let resp = await this.$axios.$post("/permissao/cadastrar", { detalhe, descricao })

      if(!resp.falha){
        let permissao = resp.dados.permissao

        this.$emit("cadastrado", permissao)
      }

    },
    async editarPermissao(){
      let { id, detalhe, descricao } = this.permissao

      let resp = await this.$axios.$put("/permissao/editar", { id, detalhe, descricao })

      if(!resp.falha){
        this.$emit("editado", this.permissao )
      }
    },
    async buscarPermissao(){
      let id = this.permissao_id

      let resp = await this.$axios.$get(`/permissao/buscar/${id}`)

      if(!resp.falha){
        this.permissao = resp.dados.permissao
      }
    },

    async deletarPermissao(){
      let id  = this.permissao_id

      let resp = await this.$axios.$delete("/permissao/deletar", { params: { id }})

      if(!resp.falha){
        this.$emit("deletado", id)
      }
    }
  }
}
</script>

<style scoped>

</style>
