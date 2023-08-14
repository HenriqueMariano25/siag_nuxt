<template>
  <div>
    <BaseDialog
      titulo="Alterar candidato"
      @cancelar="cancelar()">
        <template v-slot:corpo>
          <div class="px-2 flex w-full flex-col gap-2">
              <span class="text-xl">Selecione o motivo da alteração de candidato:</span>
              <AppFormSelect
                label="Motivo da alteração"
                :options="motivos"
                v-model="alteracao.motivo_id"
                id="motivo"
              />
              <AppFormTextarea id="comentario" label="Comentário" placeholder="Comentário opcional"
                               v-model="alteracao.comentario" class="" />
          </div>
        </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="Alterar candidato" @clique="alterarCandido()" :disabled="alteracao.motivo_id === null || alteracao.motivo_id === ''">
          <img src="@/assets/icons/back-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  components: {
    BaseDialog,
    AppFormInput,
    AppFormSelect,
    AppFormTextarea,
    BotaoPadrao
  },
  props: {
    cards: {
      type: [Array],
    }
  },
  data() {
    return {
      motivos: [],
      alteracao: {
        motivo_id: null,
        comentario: null,
      },
      motivo: null
    };
  },
  created(){
    this.buscarMotivos()
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarMotivos(){
      let resp = await this.$axios.$get("/contratacao/motivo/buscarTodos")

      if(!resp.falha){
        let motivos = resp.dados.motivos

        let options = motivos.map((o) => {
          return { id: o.id, nome: o.descricao }
        })

        this.motivos = options
      }
    },
    async alterarCandido(){
      let cards = this.cards.map( o => o.id )
      let usuario_id = this.$auth.user.id
      let { comentario, motivo_id } = this.alteracao

      let resp = await this.$axios.$post("/contratacao/card/alterar_candidato", { cards , usuario_id,
        comentario, motivo_id })

      if(!resp.falha){
        this.$emit("alterouCandidato", cards)
      }
    }
  }
};
</script>

<style scoped>

</style>
