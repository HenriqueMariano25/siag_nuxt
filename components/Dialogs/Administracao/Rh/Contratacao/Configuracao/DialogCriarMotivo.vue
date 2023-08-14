<template>
  <div>
    <BaseDialog
      :titulo="motivo === null ? 'Criar motivo' : `Editando motivo`"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2">
          <div><AppFormInput id="descricaoMotivo" type="text" v-model="descricao" label="Descrição" placeholder="Ex: ASO Inapto"/></div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex w-full gap-2 justify-end">
            <BotaoPadrao texto="Deletar" @clique="deletando = !deletando" v-if="!deletando">
              <img src="@/assets/icons/delete-b.svg" alt="" class="w-7 h-7">
            </BotaoPadrao>
            <div class="flex  items-center gap-2 !text-base" v-if="deletando">

              <BotaoPadrao texto="Sim" cor="bg-green-400 hover:!bg-green-500 !p-1"
                           @clique="deletarMotivo()" />
              <span>Tem certeza que deseja remover ?</span>
              <BotaoPadrao texto="Não" cor="bg-red-400 hover:!bg-red-500 !p-1"
                           @clique="deletando = !deletando" />
            </div>
            <div class="flex">
              <BotaoPadrao texto="salvar" @clique="motivo === null ? cadastrarMotivo() : editarMotivo()">
                <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
              </BotaoPadrao>
            </div>
        </div>

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
  data() {
    return {
      descricao: null,
      deletando: false
    };
  },
  props: {
    motivo: {
      type: Number,
      default: null
    }
  },
  created(){
    if(this.motivo !== null){
      this.descricao = this.motivo.descricao
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    async cadastrarMotivo(){
      let descricao = this.descricao

      let resp = await this.$axios.$post("/contratacao/motivo/cadastrar", { descricao})

      if(!resp.falha){
        let { motivo } = resp.dados

        this.$emit("cadastrado", motivo)
      }
    },

    async editarMotivo(){
      let descricao = this.descricao
      let id = this.motivo.id

      let resp = await this.$axios.$post("/contratacao/motivo/editar", { descricao, id })

      if (!resp.falha) {
        // let { motivo } = resp.dados

        this.$emit("editado", { descricao, id})
      }
    },

    async deletarMotivo(){
      let id = this.motivo.id

      let resp = await this.$axios.$delete("/contratacao/motivo/deletar", { params: { id }})

      if(!resp.falha){
        this.$emit("deletado", id)
      }
    }
  },
  watch: {

  }
};
</script>

<style scoped>

</style>
