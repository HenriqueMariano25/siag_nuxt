<template>
  <div>
    <BaseDialog
      titulo="Desagendar agendamentos"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2 gap-y-2 flex flex-col">
          <div class="text-center">
            <h1 class="text-xl text-gray-700">Tem certeza que deseja desagendar os agendamentos abaixo ?</h1>
          </div>
          <div>
            <TabelaPadrao
              :cabecalho="cabecalho"
              :dados="dados"
              altura="calc(100vh - 335px)"
              :carregando="carregandoTabela"
              :temRodape="false">
              <template v-slot:[`body.Funcionario.nome`]="{ item }">
                <span class="whitespace-nowrap">{{ item.Funcionario.nome }}</span>
              </template>
              <template v-slot:[`body.Funcionario.cargo`]="{ item }">
                <span class="whitespace-nowrap">{{ item.Funcionario.cargo }}</span>
              </template>
              <template v-slot:[`body.Funcionario.hora_extra`]="{ item }">
                <span class="whitespace-nowrap">
                  {{ horaExtra(item.Funcionario.hora_extra) }}
                </span>
              </template>
              <template v-slot:[`body.status`]="{ item }">
                <span class="whitespace-nowrap ">
                  {{ item.StatusAgendamento ? item.StatusAgendamento.descricao : "" }}
                </span>
              </template>
            </TabelaPadrao>
          </div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div>
          <BotaoPadrao texto="Desagendar" cor="bg-red-400 hover:bg-red-500" @clique="desagendar()">
            <img src="@/assets/icons/delete-b.svg" alt="" class="w-6 h-6">
          </BotaoPadrao>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import {horaExtra} from "~/mixins/horaExtra";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  mixins: [horaExtra],
  components: {BotaoPadrao, TabelaPadrao, BaseDialog},
  props: {
    dados: {
      type: [Array],
    },
  },
  data() {
    return {
      cabecalho: [
        {nome: "Status", valor: "status"},
        {nome: "Motivo", valor: "motivo" },
        {nome: "HE atual", valor: "Funcionario.hora_extra", centralizar: true},
        {nome: "Matricula", valor: "chapa", centralizar: true},
        {nome: "Nome", valor: "Funcionario.nome"},
        {nome: "Cargo", valor: "Funcionario.cargo"},
      ],
      carregandoTabela: false
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async desagendar(){
      let agendamentos = this.dados.map( o => o.id)

      let resp = await this.$axios.$post("/hora_extra/desagendar", { agendamentos})

      if(!resp.falha){
        this.$emit("desagendado", agendamentos)
      }
    }
  },
}
</script>

<style scoped>

</style>
