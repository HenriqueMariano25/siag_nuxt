<template>
  <BaseDialog
    :btnDeletar="usuario_id"
    @deletar="deletarUsuario"
    :titulo="usuario_id === null ? 'Criar usuário' : `Editando usuário`"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="px-2 grid grid-cols-2 gap-2">
        <AppFormInput
          label="Nome"
          placeholder="Nome"
          type="text"
          obrigatorio
          v-model="usuario.nome"
          id="nome"/>
        <AppFormInput
          label="Usuário"
          placeholder="Usuário"
          type="text"
          obrigatorio
          v-model="usuario.usuario"
          id="usuario"/>
        <AppFormInput
          label="E-mail"
          placeholder="E-mail"
          type="text"
          obrigatorio
          v-model="usuario.email"
          id="email"/>
        <AppFormSelect id="setor" obrigatorio :options="setores" label="Setor" v-model="usuario.setor_id" />
        <AppFormSelect id="funcao" obrigatorio :options="funcoes" label="Função" v-model="usuario.funcao_id"/>
        <AppFormSelect id="status" obrigatorio :options="statusUsuario" label="Status" v-model="usuario.status_usuario_id"/>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <BotaoPadrao texto="salvar" @click="usuario_id !== null ? editarUsuario() : criarUsuario()">
        <img src="@/assets/icons/save-b.svg" alt="salvar" class="w-7 h-7">
      </BotaoPadrao>
      <BotaoPadrao texto="resetar " @click="usuario_id !== null ? editarUsuario() : criarUsuario()">
        <img src="@/assets/icons/save-b.svg" alt="salvar" class="w-7 h-7">
      </BotaoPadrao>
    </template>
  </BaseDialog>
</template>

<script>
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  name: "DialogCriarUsuario",
  components: {BotaoPadrao, AppFormSelect, AppFormInput, BaseDialog, AppFormTextarea},
  props: {
    usuario_id: {
      type: [Number, String],
      default: null
    }
  },
  data(){
    return{
      setores: [],
      funcoes: [],
      statusUsuario: [],
      usuario: {
        nome: null,
        usuario: null,
        email: null,
        setor_id: null,
        funcao_id: null,
        status_usuario_id:null
      }
    }
  },
  created(){

    this.buscarDadosCriacao()
    if(this.usuario_id !== null)
      this.buscarUsuario()
  },
  methods:{
    cancelar(){
      this.$emit("cancelar")
    },

    async buscarDadosCriacao() {
      let resp =  await this.$axios.$get("/usuario/dados_criacao")
        let {setores, funcoes, statusUsuario} = resp;

        let novosSetores = setores.map((o) => {
          return {id: o.id, nome: o.nome}
        })

      let novasFuncoes = funcoes.map((o) => {
        return {id: o.id, nome: o.descricao}
      })

      let novosStatus = statusUsuario.map((o) => {
        return {id: o.id, nome: o.descricao}
      })

        this.setores = novosSetores;
        this.funcoes = novasFuncoes;
        this.statusUsuario = novosStatus;
    },

    async criarUsuario(){
      let usuario = this.usuario;
      let resp = await this.$axios.$post("/usuario/novo_padrao", {usuario})

      console.log(resp)

      if(!resp.falha){
        let usuario = resp.usuario

        this.$emit("cadastrado", usuario)
      }
    },

    async buscarUsuario(){
      let usuario_id = this.usuario_id

      let resp = await this.$axios.$get(`/usuario/${usuario_id}/novo_padrao`)

      console.log(resp)
      if(!resp.falha){
        this.usuario = resp.dados.usuario
      }
    },

    async editarUsuario(){
      let usuario = this.usuario

      let resp = await this.$axios.$put(`/usuario/${usuario.id}/novo_padrao`, { usuario })

      if(!resp.falha){
        let usuario = resp.dados.usuario

        this.$emit("editado", usuario)
      }
    },

    async deletarUsuario(){
      console.log('deletando usuarioo')
    }
  }
}
</script>

<style scoped>

</style>
