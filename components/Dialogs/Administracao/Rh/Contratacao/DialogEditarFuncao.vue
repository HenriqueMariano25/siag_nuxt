<template>
 <BaseDialog
    titulo="Editando função"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="flex flex-col gap-1.5">
        <span class="px-2 text-red-900">Após a mudança o card retornará para aprovação do <strong>Controle</strong> e após aprovação retorna para etapa que esta atualmente!</span>
        <div class="max-h-[55vh] overflow-y-auto flex w-full border-b border-gray-600">
          <table class="flex-col w-full ">
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
            <tr
              v-for="card in cards"
              :key="card.id"
              class="bg-white cursor-pointer even:bg-neutral-200 hover:bg-gray-600 hover:text-white">
              <td class="text-center px-1 py-0.5 border border-collapse border-gray-600">
                {{ ("000000" + card.id).slice(-6) }}
              </td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">
                {{ card["FuncaoCard.nome"] ? card["FuncaoCard.nome"] : "" }}
              </td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">
                {{ card["DisciplinaCard.descricao"] ? card["DisciplinaCard.descricao"] : "" }}
              </td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">
                {{ $dayjs(card.data_necessidade).format("DD/MM/YYYY") }}
              </td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">
                {{ card["Indicacao.nome"] ? card["Indicacao.nome"] : "" }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="px-1 flex flex-col gap-1">
          <AppFormSelectCompleto
            altura="95px"
            class="grow"
            obrigatorio
            id="funcao"
            label="Nova função"
            :options="funcoes"
            v-model="funcao_id"
             />
          <AppFormTextarea
            id="comentario"
            label="Comentário"
            placeholder="Comentário"
            v-model="comentario"
            :linhas="2"
            class="grow" />
        </div>

      </div>
    </template>
   <template v-slot:rodape-btn-direito>
     <div>
     <BotaoPadrao texto="salvar" :disabled="funcao_id === null || funcao_id === ''" @clique="alterarFuncao">
       <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
     </BotaoPadrao></div>
   </template>
 </BaseDialog>

</template>

<script>

import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";
export default {
  components:{
    AppFormTextarea,
    BotaoPadrao,
    AppFormSelectCompleto,
    BaseDialog
  },
  props: {
    cards: {
      type: Array,
    }
  },
  data() {
    return {
      funcoes: [],
      funcao_id: null,
      comentario: "",
    };
  },
  mounted() {
    this.buscarFuncao()
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarFuncao() {
      let setor_id = this.cards[0].setor_id

      let resp = await this.$axios.$get("/contratacao/funcao/porSetor", { params: { setor_id } })
      if (!resp.falha) {
        let funcoes = resp.dados.funcoes

        this.funcoes = funcoes
      }
    },
    async alterarFuncao(){
      let usuario_id = this.$auth.user.id
      let cards = this.cards.map( o => o.id)
      let funcao_id = this.funcao_id
      let etapa_id = this.cards[0]['Etapa.id']

      let resp = await this.$axios.$post("/contratacao/card/alterar_funcao", { funcao_id, usuario_id, cards, etapa_id, comentario: this.comentario })

      if(!resp.falha){
        this.$emit("funcaoEditada", cards)
      }
    }
  }
};
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
