<template>
  <div>
  <BaseDialog
    :btnDeletar="false"
    :titulo="usuario_id === null ? 'Criar usuário' : `Editando usuário`"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="gap-y-2 flex flex-col">
        <div class="flex w-full bg-primaria-500 text-center">
          <button
            class="w-full text-center p-2 hover:bg-gray-300 hover:text-black box-border print:hidden text-white"
            :class="{ 'border-t-4 border-black bg-gray-200 !text-black': tab === 0 }"
            @click="tab = 0">
            <span>Dados</span>
          </button>
          <button
            class="w-full p-2 hover:bg-gray-300 hover:text-black box-border print:hidden text-white"
            :class="{ 'border-t-4 border-black bg-gray-200 !text-black': tab === 1 }"
            @click="tab = 1">
            Permissões
          </button>
        </div>
        <div class="px-2 grid grid-cols-2 gap-2" v-show="tab === 0">
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
          <AppFormSelect id="setor" obrigatorio :options="setores" label="Setor" v-model="usuario.setor_id"/>
          <AppFormSelect id="funcao" obrigatorio :options="funcoes" label="Função" v-model="usuario.funcao_id"/>
          <AppFormSelect id="status" obrigatorio :options="statusUsuario" label="Status"
                         v-model="usuario.status_usuario_id"/>
        </div>
        <div class="flex flex-col px-2 w-full relative gap-y-1" v-show="tab===1">
          <div class="flex w-full gap-2 ">
            <AppFormSelect id="status" obrigatorio :options="permissoes" label="Permissão"
                           v-model="permissao_id" class="w-full flex"/>
            <BotaoPadrao cor="bg-primaria-500 hover:bg-primaria-700" @click="adicionarPermissao()">
              <img src="@/assets/icons/add-b.svg" alt="" class="w-6 h-6 ">
            </BotaoPadrao>
          </div>
          <div class="flex flex-col gap-y-1 max-h-[500px]" style="overflow: auto">
            <template v-for="p in usuario.Permissaos">
              <div class="flex items-center  bg-gray-200">
                <div class="w-full pl-2">
                  {{ p.descricao }}
                </div>
                <div>
                  <BotaoPadrao @click="deletarPermissao(p.UsuarioPermissao.id)">
                    <img src="@/assets/icons/delete-b.svg" alt="" class="w-7 h-7">
                  </BotaoPadrao>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex gap-2">
        <BotaoPadrao texto="resetar senha" @click="resetarSenha()" v-if="usuario_id !== null">
          <img src="@/assets/icons/lock-open-b.svg" alt="salvar" class="w-6 h-6">
        </BotaoPadrao>
        <BotaoPadrao texto="salvar" @click="usuario_id !== null ? editarUsuario() : criarUsuario()">
          <img src="@/assets/icons/save-b.svg" alt="salvar" class="w-7 h-7">
        </BotaoPadrao>
      </div>
    </template>

  </BaseDialog>
  <AppAlerta
    tipo="sucesso"
    :mostrar="mostrarAlerta"
    @escondeu="mostrarAlerta = false">
    {{ textoAlerta }}
  </AppAlerta>
  </div>
</template>

<script>
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppTabela from "~/components/Ui/AppTabela.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";

export default {
  name: "DialogCriarUsuario",
  components: {AppAlerta, BotaoPadrao, AppFormSelect, AppFormInput, BaseDialog, AppFormTextarea, AppTabela},
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
      },
      tab:0,
      permissoes: [],
      permissao_id: null,
      textoAlerta: "",
      mostrarAlerta: false,
    }
  },
  created(){

    this.buscarDadosCriacao()
    if(this.usuario_id !== null)
      this.buscarUsuario()

    this.buscarPermissoes()
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
      if(!resp.falha){
        let usuario = resp.usuario

        this.$emit("cadastrado", usuario)
      }
    },

    async buscarUsuario(){
      let usuario_id = this.usuario_id

      let resp = await this.$axios.$get(`/usuario/${usuario_id}/novo_padrao`)

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

    async resetarSenha(){
      let {id} = this.usuario

      await this.$axios.$put("/usuario/resetar_senha", { usuario_id: id })
      this.mostrarAlerta = true
      this.textoAlerta = "Senha resetada com sucesso!"
    },

    async buscarPermissoes(){
      let { permissoes } = await this.$axios.$get("/permissoes")

      this.permissoes = permissoes.map((o) => {
        return {id: o.id, nome: o.descricao}
      })
    },

    async adicionarPermissao(){
      let permissao_id = this.permissao_id
      let usuario_id = this.usuario.id

      let permissao = await this.$axios
        .$post("/usuario/permissao", {permissao_id, usuario_id}).then( resp => resp.usuarioPermissao)

      let { descricao } = permissao.Permissao
      let permissaoNova = { descricao, UsuarioPermissao: { id: permissao.id } }
      this.usuario.Permissaos.push(permissaoNova)

      this.mostrarAlerta = true;
      this.textoAlerta = "Permissão adicionada com sucesso!";
      this.permissao_id = null
    },

    async deletarPermissao(permissao_id){
      try{
        await this.$axios.$delete(`/usuario/permissao/${permissao_id}`)

        let idx = this.usuario.Permissaos.findIndex((obj) => obj.id === permissao_id)

        this.usuario.Permissaos.splice(idx, 1)
        this.mostrarAlerta = true;
        this.textoAlerta = "Permissão removida com sucesso!";
      }catch (e) {
       console.log(e)
      }
    }
  }
}
</script>

<style scoped>

</style>
