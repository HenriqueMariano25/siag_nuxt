<template>
  <BaseDialog
    titulo="Processar Cards"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="grid w-full">
        <div class="flex w-full">
          <table class="flex-col w-full">
            <thead class="">
            <tr class="uppercase px-2 py-1 text-sm text-white relative">
              <th>Cod.</th>
              <th>Função</th>
              <th>Disciplina</th>
              <th>Data Necessidade</th>
              <th>Nome</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="card in cards" :key="card.id"
                class="bg-white cursor-pointer even:bg-neutral-200 hover:bg-gray-600 hover:text-white">
              <td class="text-center px-1 py-0.5 border border-collapse border-gray-600">{{ card.id }}</td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">{{ card.FuncaoCard && card.FuncaoCard.nome ? card.FuncaoCard.nome : "" }}</td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">
                {{ card.DisciplinaCard ? card.DisciplinaCard.descricao : "" }}
              </td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">
                {{ $dayjs(card.data_necessidade).format("DD/MM/YYYY") }}
              </td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">
                {{ card.Indicacao ? card.Indicacao.nome : "" }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-2 px-2 flex gap-2">
          <AppFormTextarea id="comentario" label="Comentário" placeholder="Comentário opicional" v-model="processo.comentario" class="shrink w-4/6"/>
          <AppFormSelect
            label="Etapa"
            :options="etapas"
            v-model="processo.etapa_id"
            :retornarObjeto="true"
            class="w-2/6"
            id="status"/>
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center gap-5 text-black">
        <BotaoPadrao
          :disabled="processo.etapa_id === null || processo.etapa_id === ''"
          texto="Processar Cards"
          @click="processarCards()">
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
import {buscarEtapa} from "@/mixins/buscarInformacoes"

export default {
  name: "DialogProcessarCard",
  mixins: [buscarEtapa],
  components:{
    BaseDialog,
    BotaoPadrao,
    AppFormTextarea,
    AppFormSelect
  },
  props: {
    cards: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      processo: {
        etapa_id: null,
        comentario: null,
      },
      etapas:[]
    }
  },
  async fetch(){
    let etapas = await this.buscarEtapa()

    this.etapas = etapas.slice(3)
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async processarCards(){
      let cards = this.cards.map((card) => card.id)
      let usuario_id = this.$auth.user ? this.$auth.user.id : null

      let { comentario } = this.processo

      let {id: etapa_id, ordem} = this.processo.etapa_id

      await this.$axios.$post("/contratacao/card/processar", {
          cards,
          usuario_id,
          comentario,
          etapa_id,
          ordem
        })
        .then(() => {
          this.$emit("processado", {cards, etapa_id: this.processo.etapa_id})
          this.processo = {
            etapa_id: null,
            comentario: null,
          }
        }
      )
    }
  }
}
</script>

<style scoped>
th,
td {
  border-left: 1px solid rgb(75, 85, 99);
  border-right: 1px solid rgb(75, 85, 99);
}

th {
  position: sticky;
  top: 0;
  background-color: rgb(0, 53, 127);
  z-index: 100;
  border-left: 1px solid rgb(75, 85, 99) !important;
  border-right: 1px solid rgb(75, 85, 99);
}
</style>
