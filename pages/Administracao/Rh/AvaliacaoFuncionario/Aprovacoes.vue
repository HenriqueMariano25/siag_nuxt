<template>
  <div class="w-full">
    <CabecalhoPagina titulo="APROVAÇÕES " />
    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
      <TabelaPadrao
        id="avaliacoes"
        :cabecalho="cabecalho"
        :dados="dados"
        :itensPorPagina="itensPorPagina"
        @itensPorPagina="itensPorPagina = $event"
        :pagina="pagina"
        @pagina="pagina = $event"
        @filtros="filtros = $event"
        @ordem="ordem = $event"
        :totalItens="totalItens"
        altura="calc(100vh - 179px)"
        @atualizar="buscarAprovacoes()"
        :temDetalhes="false">
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex items-center w-full justify-between">
          <div class="flex gap-2">

          </div>
        </div>
      </template>
    </RodapePagina>
  </div>
</template>

<script>
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";

export default {
  components: { RodapePagina, BotaoPadrao, CabecalhoPagina, TabelaPadrao },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-12" },
        { nome: "Cód.", valor: "codigo", largura: "w-[80px]", centralizar: true },
        { nome: "Status", valor: "StatusAvaliacao.descricao", filtro: true, ordenar: true },
        { nome: "Matricula", valor: "Funcionario.chapa" },
        { nome: "Nome", valor: "Funcionario.nome" },
        { nome: "Cargo", valor: "Funcionario.cargo" },
        { nome: "Avaliado por", valor: "AvaliadoPor.nome", filtro: true, ordenar: true },
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      itensPorPagina: 100,
      pagina: 1,
      dados: [],
      mostrarDialogCriaAvaliacaoFuncionario: false,
      mostrarAlerta: false,
      textoAlerta: null,
    };
  },
  methods: {
    buscarAprovacoes() {
      
    }
  }
};
</script>

<style scoped>

</style>
