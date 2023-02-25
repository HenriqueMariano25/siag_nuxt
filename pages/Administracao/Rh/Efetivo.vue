<template>
    <div class="grow">
      <AppTabela :cabecalho="cabecalho" :dados="dados" @filtrar="recebendoFiltro" :itensPorPagina="itensPorPagina"
                 :pagina="pagina"
                 :totalItens="totalItens"
                 @atualizar="atualizarDados"
                 :temDetalhes="true">
        <template v-slot:[`body.rota`]="{ item }">
          <span v-if="item.rota" class="whitespace-nowrap">
            {{ item.rota.numero }} - {{ item.rota.local }}
          </span>
        </template>
        <template v-slot:[`body.hora_extra`]="{ item }">
          <span v-if="item.hora_extra" class="whitespace-nowrap">
            {{ horaExtra(item.hora_extra) }}
          </span>
        </template>
        <template v-slot:[`body.data_demissao`]="{ item }">
          <span v-if="item.data_demissao" class="whitespace-nowrap"></span>
        </template>
        <template v-slot:[`body.turno`]="{ item }">
          <span class="whitespace-nowrap" v-if="item.noturno">Noturno</span>
          <span class="whitespace-nowrap" v-if="!item.noturno">Diurno</span>
        </template>
        <template v-slot:detalhes="{ item }">
          <div>
            <span v-if="item.data_demissao"><strong>Data de demissão: </strong>{{$dayjs(item.data_demissao).format('DD/MM/YYYY')}}</span>
          </div>
        </template>
        <template v-slot:rodape>
          <div>
            <div>
<!--              <AppFormSwitch />-->
              <button>
                Demitidos
              </button>
            </div>
          </div>
        </template>
      </AppTabela>
      <RodapePagina>
        <template v-slot>
          <div class="flex items-center">
            <div class="flex">
              <BotaoExcel @click="gerarExcel"/>
            </div>
          </div>
        </template>
      </RodapePagina>
    </div>
</template>

<script>

import AppTabela from "~/components/Ui/AppTabela.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import BotaoExcel from "~/components/Ui/Buttons/BotaoExcel.vue";
// import AppFormSwitch from "~/components/Ui/AppFormSwitch.vue";

import gerarExcel from "~/functions/gerarExcel";
import {horaExtra} from "@/mixins/horaExtra";


export default {
  name: "index",
  mixins: [horaExtra],
  components: {
    AppTabela,
    RodapePagina,
    BotaoExcel,
    // AppFormSwitch
  },
  data() {
    return {
      cabecalho: [
        {nome: 'Matrícula', valor: 'chapa', filtro: true, ordenar: true, centralizar: true},
        {nome: 'Nome', valor: 'nome', filtro: true},
        {nome: 'Hora Extra', valor: 'hora_extra', filtro: true, centralizar: true},
        {nome: "Cargo", valor: "cargo", filtro: true},
        {nome: "Disciplina", valor: "sub_setor", filtro: true},
        {nome: "Setor", valor: "setor", filtro: true},
        {nome: "Encarregado/Lider SAPO", valor: "encarregado_sapo", filtro: true},
        {nome: "Encarregado/Lider Prod.", valor: "encarregado_producao", filtro: true},
        {nome: "Supervisor", valor: "supervisor", filtro: true},
        {nome: "Engenheiro", valor: "engenheiro", filtro: true},
        {nome: "Coordenador", valor: "coordenador", filtro: true},
        {nome: "Gestor", valor: "gestor", filtro: true},
        {nome: "Rota", valor: "rota", filtro: true},
        {nome: "Ponto de Embarque", valor: "ponto_embarque", filtro: true},
        // {nome: "CPF", valor: "cpf", filtro: true},
        {nome: "Turno", valor: "turno", filtro: true},
      ],
      dados: [],
      filtros: [],
      itensPorPagina: 200,
      pagina: 1,
      totalItens: 0
    }
  },
  async fetch(){
    this.dados = this.buscarEfetivo()
  },
  methods:{
    recebendoFiltro(filtros){
      this.filtros = filtros
    },
    async atualizarDados(parametros) {
      let {itensPorPagina, pagina, filtros} = parametros

      if(itensPorPagina)
        this.itensPorPagina = itensPorPagina

      if(pagina)
        this.pagina = pagina

      if(filtros)
        this.filtros = filtros
      this.buscarEfetivo()
    },
    async buscarEfetivo(){
      let funcionarios = await this.$store.state.funcionarios.funcionarios

      if (Object.keys(this.filtros).length > 0) {
        for (let filtro of Object.keys(this.filtros)) {
          let rgx = new RegExp(`${this.filtros[filtro]}`, "gi");

          funcionarios = this.$lodash.filter(funcionarios, o => {
            return rgx.test(o[filtro])
          })
        }
      }

      let off = (this.pagina - 1) * this.itensPorPagina
      let pagedItems = this.$lodash.drop(funcionarios, off).slice(0, this.itensPorPagina);

      this.totalItens = funcionarios.length
      this.dados = pagedItems
    },

    async gerarExcel() {
      this.desativarBotao = true
      let cabecalho = [
        "Hora extra",
        "Matricula",
        "Nome",
        "Cargo",
        "Disciplina",
        "Setor",
        "Encarregado/Lider SAPO",
        "Encarregado/Lider Produção",
        "Supervisor",
        "Engenheiro",
        "Coordenador",
        "Gestor",
        "CPF",
        "Rota",
        "Data de admissão",
        "Data de demissão",
        "Turno",
      ]
      let nomeArquivo

      nomeArquivo = "efetivo"

      let itens = []
      for (let item of this.dados) {
        let temp = []
        temp.push(this.horaExtra(item.hora_extra));
        temp.push(("0000000000" + item.chapa).slice(-10));
        temp.push(item.nome);
        temp.push(item.cargo);
        temp.push(item.sub_setor);
        temp.push(item.setor);
        temp.push(item.encarregado_sapo);
        temp.push(item.encarregado_producao);
        temp.push(item.supervisor);
        temp.push(item.engenheiro);
        temp.push(item.coordenador);
        temp.push(item.gestor);
        temp.push(item.cpf);
        item.rota
          ? temp.push(`${item.rota.numero} - ${item.rota.local}`)
          : temp.push("");
        temp.push(this.$dayjs(item.data_admissao).format("DD/MM/YYYY"));
        item.data_demissao
          ? temp.push(
            this.$dayjs(item.data_demissao).format("DD/MM/YYYY")
          )
          : temp.push("");
        item.noturno
          ? temp.push(
            "Noturno",
          )
          : temp.push("Diurno", item.turno);
        itens.push(temp)
      }

      this.desativarBotao = false
      gerarExcel(cabecalho, itens, nomeArquivo)
    },
  }
}
</script>

<style scoped>

</style>
