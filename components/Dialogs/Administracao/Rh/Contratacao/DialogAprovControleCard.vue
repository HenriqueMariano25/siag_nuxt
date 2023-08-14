<template>
  <BaseDialog
    titulo="Processar Card"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="w-full">
        <div class="bg-gray-300 w-full p-2 space-x-5">
          <span>
            <strong>Código: </strong>{{ card ? card.id : ""}}
          </span>
          <span>
            <strong>Função: </strong>{{ card && card.FuncaoCard ? card.FuncaoCard.nome : "" }}
          </span>
        </div>
        <div class="pt-2 px-2 space-y-2">
          <AppFormSelect
            label="Centro de Custo - PEP"
            :options="centrosCusto"
            v-model="processo.pep"
            id="pep"
            />
          <AppFormTextarea id="comentario" label="Comentário" placeholder="Comentário opcional"
                           v-model="processo.comentario" class=""/>
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center gap-5 text-black">
        <BotaoPadrao
          texto="Negar Card"
          cor="bg-red-500"
          @clique="aprovarCardControle(false)">
          <template v-slot>
            <img src="@/assets/icons/close-b.svg" alt="close" class="w-6 h-6"/>
          </template>
        </BotaoPadrao>
        <BotaoPadrao
          texto="Aprovar Card"
          cor="bg-green-500"
          @clique="aprovarCardControle(true)">
          <template v-slot>
            <img src="@/assets/icons/check-b.svg" alt="close" class="w-7 h-7"/>
          </template>
        </BotaoPadrao>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";
import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
export default {
  name: "DialogProcControleCard",
  components: {
    BaseDialog,
    BotaoPadrao,
    AppFormTextarea,
    AppFormSelect
  },
  props: {
    card: {
      type: [String, Number, Object],
    },
  },
  data(){
    return{
      centrosCusto: [],
      processo: {
        comentario: null,
        pep: null,
      }
    }
  },
  async fetch(){
    await this.buscarCentrosCusto()
    this.processo.pep = this.card.centro_custo_pep_id
  },
  methods:{
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarCentrosCusto() {
      let setor_id = this.card.setor_id

      let resp = await this.$axios.$get("/contratacao/centro_custo/por_setor", {
        params: {setor_id},
      })
      if (!resp.falha) {
        let centrosCusto = resp.dados.centrosCusto
        let options = centrosCusto.map((o) => {
          return {id: o.id, nome: `${o.numero_pep} - ${o.descricao}`}
        })

        this.centrosCusto = options
      }
    },
    async aprovarCardControle(aprovacao){
      let { id } = this.card
      let usuario_id = this.$auth.user ? this.$auth.user.id : null

      let {comentario, pep} = this.processo

      await this.$axios.$post("/contratacao/card/aprovacao/controle/pep", {
        id,
        aprovacao: aprovacao,
        usuario_id,
        comentario,
        pep
      })
      let cards = [id]

      this.$emit("aprovado", cards, aprovacao)
      this.processo.comentario = null
    }
  }
}
</script>

<style scoped>

</style>
