<template>
  <div>
		<BaseDialog
			titulo="Confirmar aprovação"
			@cancelar="cancelar()">
			<template v-slot:corpo>
        <div class="px-2">
          <div>
            <TabelaPadrao
              id="aprovarHe"
              :cabecalho="cabecalho"
              :dados="dados"
              :itensPorPagina="itensPorPagina"
              :pagina="pagina"
              :totalItens="totalItens"
              altura="calc(100vh - 335px)"
              :carregando="carregandoTabela"
              :temRodape="false">
              <template v-slot:[`body.status`]="{ item }">
                <div v-if="tipoAprovacao === 'gestorArea'">
                  <div
                    v-if="item.aprovacao_he === null"
                    class="bg-yellow-300 text-black px-2 rounded whitespace-nowrap">
                    Aguardando
                  </div>
                  <div
                    v-if="item.aprovacao_he === true"
                    class="bg-green-400 text-black px-2 rounded whitespace-nowrap">
                    Aprovado
                  </div>
                  <div
                    v-if="item.aprovacao_he === false"
                    class="bg-red-400 text-black px-2 rounded whitespace-nowrap">
                    Negado
                  </div>
                </div>
                <div v-else-if="tipoAprovacao === 'siteManager'">
                  <div
                    v-if="item.aprovacao_situacao === null"
                    class="bg-yellow-300 text-black px-2 rounded whitespace-nowrap">
                    Aguardando
                  </div>
                  <div
                    v-if="item.aprovacao_situacao === true"
                    class="bg-green-400 text-black px-2 rounded whitespace-nowrap">
                    Aprovado
                  </div>
                  <div
                    v-if="item.aprovacao_situacao === false"
                    class="bg-red-400 text-black px-2 rounded whitespace-nowrap">
                    Negado
                  </div>
                </div>

              </template>
              <template v-slot:[`body.Funcionario.nome`]="{ item }">
                <span class="whitespace-nowrap">{{ item.Funcionario.nome }}</span>
              </template>
              <template v-slot:[`body.Funcionario.cargo`]="{ item }">
                <span class="whitespace-nowrap">{{ item.Funcionario.cargo }}</span>
              </template>
              <template v-slot:[`body.Funcionario.hora_extra`]="{ item }">
                {{ horaExtra(item.Funcionario.hora_extra) }}
              </template>
              <template v-slot:[`body.heProjetada`]="{ item }">
                {{ horaExtra(item.hora_extra_projetada) }}
              </template>
            </TabelaPadrao>
          </div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex gap-2 items-center">
          <span class="text-xl">Total de itens: {{ dados.length }}</span>
          <BotaoPadrao texto="Negar" cor="bg-red-500 hover:bg-red-600" @clique="aprovarAgendamentos(false)">
            <img src="@/assets/icons/close-b.svg" alt="" class="w-6 h-6">
          </BotaoPadrao>
          <BotaoPadrao texto="Aprovar" cor="bg-green-500 hover:bg-green-600" @clique="aprovarAgendamentos(true)">
            <img src="@/assets/icons/check-b.svg" alt="" class="w-7 h-6">
          </BotaoPadrao>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

import {horaExtra} from "~/mixins/horaExtra";

export default {
  mixins: [horaExtra],
  components:{
    BaseDialog,
    TabelaPadrao,
    BotaoPadrao
  },
  props: {
    dados: {
      type: [Array]
    },
    tipoAprovacao: {
      type: [String],
    },
    data: {
      type: String
    }
  },
  data() {
    return {
      cabecalho: [
        {nome: "Status", valor: "status", centralizar: true},
        {nome: "HE atual", valor: "Funcionario.hora_extra", centralizar: true},
        {nome: "HE projetada", valor: "heProjetada", centralizar: true},
        {nome: "Matricula", valor: "chapa", centralizar: true},
        {nome: "Nome", valor: "Funcionario.nome"},
        {nome: "Cargo", valor: "Funcionario.cargo"},
      ],
      filtros: [],
      itensPorPagina: 50,
      pagina: 1,
      carregandoTabela: false,
    }
  },
  computed: {
    totalItens() {
      return this.dados.length
    }

  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    async aprovarAgendamentos(aprovacao){
      let agendamentos = this.dados.map(o => o.id )
      let aprovado_por = this.$auth.user.id
      let data = this.data

      let cont = 0
      let agendPrEnviar = []
      let total = 0

      for (let ag of agendamentos) {
        cont += 1
        total += 1
        agendPrEnviar.push(ag)


        if (cont === 5 || total === agendamentos.length) {

          if (this.tipoAprovacao === "gestorArea") {
            await this.$axios.$post("/hora_extra/aprovar/gestor_area", {
              agendamentos: agendPrEnviar,
              data,
              aprovado_por,
              aprovacao
            })

          }else if(this.tipoAprovacao === "siteManager"){
            await this.$axios.$post("/hora_extra/aprovar/site_manager", {
              agendamentos: agendPrEnviar,
              data,
              aprovado_por,
              aprovacao
            })
          }
          cont = 0
          agendPrEnviar = []
        }
      }

      this.$emit("aprovado",  { aprovacao, agendamentos})
    },
  },
}
</script>

<style scoped>

</style>
