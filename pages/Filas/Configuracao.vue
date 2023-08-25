<template>
  <div class="w-full">
<!--    <CabecalhoPagina titulo="Configuracação" />-->
<!--    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">-->
<!--      <TabelaPadrao-->
<!--        :cabecalho="cabecalho"-->
<!--        :dados="dados"-->
<!--        :itensPorPagina="itensPorPagina"-->
<!--        :pagina="pagina"-->
<!--        @pagina="pagina = $event"-->
<!--        @filtros="filtros = $event"-->
<!--        @ordem="ordem = $event"-->
<!--        :totalItens="totalItens"-->
<!--        altura="calc(100vh - 179px)"-->
<!--        @atualizar="buscarFila"-->
<!--        :temDetalhes="false">-->
<!--      </TabelaPadrao>-->
<!--    </div>-->
<!--    <RodapePagina>-->
<!--      <template v-slot>-->
<!--        <div class="flex justify-end w-full">-->
<!--          &lt;!&ndash;          <div>&ndash;&gt;-->
<!--          <div class="flex">-->
<!--            <BotaoPadrao-->
<!--              class="flex"-->
<!--              @clique="mostrarDialogCriarFila = true"-->
<!--              texto="Adicionar">-->
<!--              <img-->
<!--                src="@/assets/icons/add-b.svg"-->
<!--                alt=""-->
<!--                class="w-7 h-7" />-->
<!--            </BotaoPadrao>-->
<!--          </div>-->
<!--          &lt;!&ndash;          </div>&ndash;&gt;-->
<!--        </div>-->
<!--      </template>-->
<!--    </RodapePagina>-->
<!--    <DialogCriarFila-->
<!--      v-if="mostrarDialogCriarFila"-->
<!--      @cancelar="-->
<!--				mostrarDialogCriarFila = false-->
<!--				fila = null-->
<!--			"-->
<!--      @cadastrado="cadastrado"-->
<!--      @editado="editado"-->
<!--      @deletado="deletado"-->
<!--      :fila="fila" />-->
<!--    <AppAlerta-->
<!--      tipo="sucesso"-->
<!--      :mostrar="mostrarAlerta"-->
<!--      @escondeu="mostrarAlerta = false">-->
<!--      {{ textoAlerta }}-->
<!--    </AppAlerta>-->
  </div>
</template>

<script>
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";
// import DialogCriarFila from "~/components/Dialogs/Filas/DialogCriarFila.vue";

export default {
  components: { AppAlerta, TabelaPadrao, BotaoPadrao, RodapePagina, CabecalhoPagina },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-8" },
        { nome: "Local", valor: "local", filtro: true, ordenar: true },
        { nome: "Leitores", valor: "leitores", filtro: true, ordenar: true },
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      dados: [],
      itensPorPagina: 100,
      pagina: 1,
      mostrarDialogCriarFila: false,
      fila: null,
      mostrarAlerta: false,
      textoAlerta: null,
    };
  },
  methods: {
    buscarFila() {

    }
  }
};
</script>

<style scoped>

</style>
