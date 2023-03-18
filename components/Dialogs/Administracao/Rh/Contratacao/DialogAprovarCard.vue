<template>
  <BaseDialog
    titulo="Aprovar Cards"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="grid w-full">
        <div class="flex w-full">
          <table class="flex-col w-full">
            <thead class="bg-red-500">
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
              <td class="px-1 py-0.5 border border-collapse border-gray-600">{{ card.FuncaoCard.nome }}</td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">{{ card.DisciplinaCard ? card.DisciplinaCard.descricao: "" }}</td>
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
        <div class="mt-2 px-2">
          <AppFormTextarea id="comentario" label="Comentário" placeholder="Comentário opicional" v-model="comentario"/>
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center gap-5 text-black">
        <BotaoPadrao
          texto="Negar Cards"
          cor="bg-red-500"
          @click="aprovarCard(false)">
          <template v-slot>
            <img src="@/assets/icons/close-b.svg" alt="close" class="w-6 h-6"/>
          </template>
        </BotaoPadrao>
        <BotaoPadrao
          texto="Aprovar Cards"
          cor="bg-green-500"
          @click="aprovarCard(true)">
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
export default {
  name: "DialogAprovarCard",
  components: {
    BaseDialog,
    BotaoPadrao,
    AppFormTextarea

  },
  props:{
    cards:{
      type: Array,
      required: true
    },
    tipoAprovacao: {
      type: String,
      required: true,
    }
  },
  data(){
    return{
      comentario: null
    }
  },
  methods: {
    cancelar(){
      this.$emit("cancelar")
    },

    async aprovarCard(aprovacao) {
      let cards = this.cards.map((card) => card.id)

      let usuario_id = this.$auth.user.id

      let tipo_aprovacao = this.tipoAprovacao

      if (tipo_aprovacao === "gestor_area") {
        await this.$axios.$post("/contratacao/card/aprovacao/gestor_area", {
          cards: cards,
          aprovacao: aprovacao,
          usuario_id,
          comentario: this.comentario,
        })
      }

      if (tipo_aprovacao === "site_manager") {
        await this.$axios.$post("/contratacao/card/aprovacao/site_manager", {
          cards: cards,
          aprovacao: aprovacao,
          usuario_id,
          comentario: this.comentario,
        })
      }

      this.$emit("aprovado", cards, aprovacao)
      this.comentario = null
    },
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
