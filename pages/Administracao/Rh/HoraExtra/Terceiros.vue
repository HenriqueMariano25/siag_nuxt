<template>
  <div class="w-full flex flex-col gap-2">
    <div class="w-full">
      <div class="w-full flex gap-2 bg-white p-1 items-end">
        <AppFormInput id="data" type="date" label="Data" v-model="agendamento.data" class="grow" obrigatorio/>
        <AppFormSelect
          class="grow"
          obrigatorio
          label="Turno"
          :options="turnos"
          v-model="agendamento.turno"
          id="turno" />
        <AppFormInput id="motivo" type="text" label="Motivo" placeholder="Ex: Apoio da T.I" v-model="agendamento.motivo"
                      obrigatorio
                      class="grow w-6/12" />

          <AppFormInput id="quantidade" type="number" label="Quantidade" placeholder="Ex: 10"
                        obrigatorio
                        v-model="agendamento.quantidade" class="grow " />
          <div class=" flex justify-end items-end  ">
            <BotaoPadrao texto="Agendar" class="bg-primaria-100 hover:bg-primaria-300 text-white" :disabled="temCampoVazio || dataForaAgendamento"
                         @clique="agendar()">
              <img src="@/assets/icons/save-w.svg" alt="" class="w-8 h-8">
            </BotaoPadrao>
          </div>


      </div>
    </div>
    <div>
      <TabelaPadrao
        id="terceiros"
        altura="calc(100vh - 142px)"
        :cabecalho="cabecalho"
        :dados="dados"
        dados-sql
        @filtros="filtros = $event"
        @pagina="pagina = $event"
        @ordem="ordem = $event"
        :itensPorPagina="itensPorPagina"
        @itensPorPagina="itensPorPagina = $event"
        :pagina="pagina"
        :totalItens="totalItens"
        @atualizar="buscarTerceiros"
        @selecionados="selecionados = $event"
        :limparSelecionar="limparSelecionar"
        :tem-rodape="false"
        selecionar>
      </TabelaPadrao>
    </div>
    <div class="bg-red-500 flex">
      <RodapePagina
        class="print:hidden"
      >
        <div class="flex w-full justify-between">
          <div class="flex gap-2 justify-end w-full items-center">
            <span v-if="dataForaAgendamento" class="text-2xl text-red-400">Não é possível agendar para dias anteriores</span>
            <BotaoPadrao
              @clique="mostrarDialogAgendamentosTerceiros = true"
              texto="Agendamentos">
              <img
                src="../../../../assets/icons/list-check-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>
          </div>
        </div>
      </RodapePagina>
    </div>
    <DialogAgendamentosTerceiros v-if="mostrarDialogAgendamentosTerceiros" @cancelar="mostrarDialogAgendamentosTerceiros = false"/>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
  </div>

</template>

<script>
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import AppBadge from "~/components/Ui/AppBadge.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import DialogAgendamentosTerceiros
  from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialogAgendamentosTerceiros.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";

export default {
  name: "Terceiros",
  components: { AppAlerta, DialogAgendamentosTerceiros, RodapePagina, AppBadge, TabelaPadrao, BotaoPadrao, AppFormSelect, AppFormInput },
  data() {
    return {
      agendamento: {
        data: null,
        turno: null,
        motivo: null,
        quantidade : null
      },
      turnos: [],
      terceiros: [],
      cabecalho:[
        { nome: "Nome", valor: "nome" },
      ],
      dados: [],
      filtros: [],
      ordem: null,
      itensPorPagina: 200,
      pagina: 1,
      totalItens: 0,
      selecionados: [],
      mostrarDialogAgendamentosTerceiros: false,
      mostrarAlerta: false,
      textoAlerta: "",
      limparSelecionar: false
    };
  },
  async created() {
    await this.buscarTurnos()
    await this.buscarTerceiros()
  },
  computed: {
    temCampoVazio() {
      return Object.values(this.agendamento).some( o => o===null || o === "");
    },
    dataForaAgendamento(){
      let hoje = this.$dayjs().format("YYYY-MM-DD")

      if(this.agendamento.data !== null && this.agendamento.data !== ""){
        return this.agendamento.data < hoje
      }

      return false
    }
  },
  methods: {
    async buscarTurnos() {
      let resp = await this.$axios.$get("/efetivo/buscar/turnos")

      if (!resp.falha) {
        let turnos = resp.dados.turnos

        this.turnos = turnos.map((o) => {
          return { id: o.descricao, nome: o.descricao }
        })
      }
    },

    async buscarTerceiros(){

      let resp = await this.$axios
        .$get("/hora_extra/terceiros/novo_padrao")

      this.dados = resp.dados.terceiros
    },

    async agendar(){
      this.limparSelecionar = !this.limparSelecionar
      let{ data, turno, motivo, quantidade } = this.agendamento
      let terceiros = this.selecionados.map( o => o.nome)
      let agendado_por_id = this.$auth.user.id

      await this.$axios.$post("/hora_extra/terceiros/agendar/novo_padrao", {
          data,
          turno,
          motivo,
          quantidade,
          terceiros,
          agendado_por_id,
        })

      this.textoAlerta = 'Agendamentos realizados com sucesso!'
      this.mostrarAlerta = true
    }
  }
};
</script>

<style scoped>

</style>
