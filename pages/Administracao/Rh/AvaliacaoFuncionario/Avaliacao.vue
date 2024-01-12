<template>
  <div class="w-full">
    <CabecalhoPagina titulo="AVALIAÇÃO " />
    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
      <TabelaPadrao
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
        @atualizar="buscarAvaliacao()"
        :temDetalhes="false">
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex justify-end w-full">
          <div class="flex">
            <BotaoPadrao texto="cadastrar" @clique="mostrarDialogCriaAvaliacaoFuncionario = true">
              <img src="@/assets/icons/add-b.svg" alt="" class="w-7 h-7">
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogAvaliacaoFuncionario v-if="mostrarDialogCriaAvaliacaoFuncionario"
                                @cancelar="mostrarDialogCriaAvaliacaoFuncionario = false" />
  </div>
</template>

<script>
import DialogCriarDescricaoCargo
  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DescricaoCargo/DialogCriarDescricaoCargo.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import DialogAvaliacaoFuncionario
  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DialogAvaliacaoFuncionario.vue";

export default {
  components: { DialogAvaliacaoFuncionario, TabelaPadrao, RodapePagina, CabecalhoPagina, BotaoPadrao, DialogCriarDescricaoCargo },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-24" },
        { nome: "Checklist", valor: "checklist", largura: "w-[150px]" },
        { nome: "CGA", valor: "cga", filtro: true, ordenar: true },
        { nome: "Placa", valor: "placa", filtro: true, ordenar: true },
        { nome: "Marca/Modelo", valor: "marca_modelo", filtro: true, ordenar: true },
        { nome: "Setor", valor: "Setor.nome", filtro: true, ordenar: true },
        { nome: "Status", valor: "StatusCarro.descricao", filtro: true, ordenar: true },
        { nome: "Ocuto Pool", valor: "ocultar_pool" },
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      itensPorPagina: 100,
      pagina: 1,
      dados: [],
      mostrarDialogCriaAvaliacaoFuncionario: false
    };
  },
  methods: {
    async buscarAvaliacao() {

    }
  }
};
</script>

<style scoped>

</style>
