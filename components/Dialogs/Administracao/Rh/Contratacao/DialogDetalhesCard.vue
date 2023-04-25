<template>
  <BaseDialog
    :titulo="card && card.id ? 'Detalhes Card - ' + ('000000' + card.id).slice(-6) : ''"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="flex w-full overflow-auto print:overflow-visible px-2 " id="imprimir" style="">
        <div class="grid grid-cols-1 divide-y divide-gray-300 text-lg w-full" v-if="card">
          <div class="bg-primaria-700 text-white p-2 text-lg hidden print:inline">
            <span>{{ card && card.id ? 'Detalhes Card - ' + card.id : '' }}</span>
          </div>
          <span class="py-1 pl-1 bg-gray-300"><strong>Indicação</strong></span>
          <span class="pb-1 pl-1"><strong>Nome: </strong>{{ card.Indicacao ? card.Indicacao.nome : "" }}</span>
          <span class="pb-1 pl-1"><strong>Email: </strong>{{ card.Indicacao ? card.Indicacao.email : "" }}</span>
          <span class="pb-1 pl-1"><strong>Telefone: </strong>{{ card.Indicacao ? card.Indicacao.telefone : "" }}</span>
          <span class="pb-1 pl-1"><strong>CPF: </strong>{{ card.Indicacao ? card.Indicacao.cpf : "" }}</span>
          <span class="pb-1 pl-1"><strong>Quem indicou: </strong>{{ card.Indicacao ? card.Indicacao.indicado_por : "" }}</span>
          <div class="flex ml-1"
               v-if="card.Indicacao && card.Indicacao.url_pdf !== null && card.Indicacao.url_pdf !==''">
            <a
              target="_blank"
              :href="`${urlFile}${card.Indicacao.url_pdf}`"
              v-if="card.Indicacao && card.Indicacao.url_pdf !== null && card.Indicacao.url_pdf !==''"
              class="border-2 border-gray-800 rounded flex px-2 hover:bg-gray-300"
            >
              <img src="@/assets/icons/file-b.svg" alt="" class="w-7 h-7">
              Currículo
            </a>
          </div>

          <span class="py-1 pl-1 bg-gray-300"><strong>Descrição geral</strong></span>
          <span class="pb-1 pl-1"><strong>Função: </strong>{{ card.FuncaoCard ? card.FuncaoCard.nome : "" }}</span>
          <span class="pb-1 pl-1"><strong>Disciplina: </strong>{{card.DisciplinaCard ? card.DisciplinaCard.descricao : "" }}</span>
          <span class="pb-1 pl-1"><strong>Centro de Custo: </strong>{{ card.CentroCustoPEP ? card.CentroCustoPEP.descricao : "" }}</span>
          <span class="pb-1 pl-1" v-if="podeVerSalario"><strong>Salário: </strong>{{ card.salario }}</span>
          <span class="pb-1 pl-1"><strong>Setor: </strong>{{ card.Setor ? card.Setor.nome : "" }}</span>
          <span class="pb-1 pl-1"><strong>Data necessidade: </strong>{{ $dayjs(card.data_necessidade).format("DD/MM/YYYY") }}</span>
          <span class="pb-1 pl-1"><strong>Turno: </strong>{{ card.turno }}</span>
          <span class="pb-1 pl-1"><strong>Entrevista c/ gestor: </strong>{{ card.entrevista_gestor ? "Sim" : "Não" }}</span>
          <span class="pb-1 pl-1"><strong>Tipo de Recrutamento: </strong>{{ card.tipo_recrutamento }}</span>
          <span class="pb-1 pl-1"><strong>Mobilização: </strong>{{ card.mobilizacao }}</span>
          <span class="pb-1 pl-1"><strong>Necessita de Notebook, Computador ou Login : </strong>{{ precisaEquipamentoTi ? "Sim" : "Não" }}</span>
          <span class="py-1 pl-1 bg-gray-300"><strong>NRs</strong></span>
          <template v-for="nr in card.nrs">
            <span class="py-1 pl-2 "><strong>{{ nr.nr + ' - ' + nr.descricao }}</strong></span>
          </template>
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center">
        <BotaoPadrao texto="Gerar PDF" @click="imprimir()">
          <img src="@/assets/icons/printer-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
export default {
  name: "DialogDetalhesCard",
  components:{
    BaseDialog,
    BotaoPadrao
  },
  props:{
    card_id:{
      type: [Number, String],
      required: true
    }
  },
  data(){
    return{
        card: {}
    }
  },
  computed:{
    precisaEquipamentoTi(){
      return this.card.equipamento_card && this.card.equipamento_card.some(o => o.nome === "Notebook/Desktop/Usuário")
    },
    podeVerSalario(){
      let permissoes = ['rh_contratacoes', 'aprovar_card_controle', 'aprovar_card_gerente_area', 'aprovar_card_site_manager']

      return permissoes.some(o => this.$auth.user.permissoes.includes(o)) || this.card.usuario_id === this.$auth.user.id
    },
    urlFile() {
      if (process.env.NODE_ENV === 'production') {
        return "http://siag.agnet.com.br:84/files/"
      } else {
        return "http://localhost:3000/files/"
      }
    }
  },
  async fetch(){
    await this.buscarCard()
  },
  methods:{
    cancelar(){
      this.$emit("cancelar")
    },
    async buscarCard(){
      let id = this.card_id
      let resp = await this.$axios.$get("/contratacao/card/buscar_novo_padrao", {params: {id: id}})

      if(!resp.falha){
        this.card = resp.dados.card
      }
    },
    async imprimir() {
      window.print()
    }
  }
}
</script>

<style scoped>
#imprimir {
  max-height: calc(80vh);
}

@media print {
  #imprimir {
    max-height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
