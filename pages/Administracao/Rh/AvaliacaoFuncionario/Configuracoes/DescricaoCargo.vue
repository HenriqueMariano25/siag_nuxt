<template>
  <div class="w-full">
    <CabecalhoPagina titulo="DESCRIÇÃO DE CARGO" />
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
        @atualizar="buscarDescricaoCargo()"
        :temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoPadrao icone @clique="descricao = item; mostrarDialogCriaDescricaoCargo = true">
            <img src="@/assets/icons/edit-b.svg" alt="" class="w-6 h-6">
          </BotaoPadrao>
        </template>
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex justify-end w-full">
          <div class="flex">
            <BotaoPadrao texto="cadastrar" @clique="mostrarDialogCriaDescricaoCargo = true">
              <img src="@/assets/icons/add-b.svg" alt="" class="w-7 h-7">
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarDescricaoCargo v-if="mostrarDialogCriaDescricaoCargo"
                               :descricao="descricao"
                               @cadastrado="cadastrado"
                               @editado="editado"
                               @deletado="deletado"
                               @cancelar="mostrarDialogCriaDescricaoCargo = false; descricao = null" />
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
  </div>
</template>

<script>
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import DialogCriarDescricaoCargo
  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DescricaoCargo/DialogCriarDescricaoCargo.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";


export default {
  components: { AppAlerta, DialogCriarDescricaoCargo, RodapePagina, BotaoPadrao, TabelaPadrao, CabecalhoPagina },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-14" },
        { nome: "Titulo", valor: "titulo" },
        { nome: "Missão", valor: "missao", filtro: true, ordenar: true },
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      itensPorPagina: 100,
      pagina: 1,
      dados: [],
      mostrarDialogCriaDescricaoCargo: false,
      descricao: null,
      mostrarAlerta: false,
      textoAlerta: null
    };
  },
  async mounted() {
    await this.buscarDescricaoCargo();
  },
  methods: {
    async buscarDescricaoCargo() {

      let page = this.pagina - 1
      let size = this.itensPorPagina
      let filtros = this.filtros

      let resp = await this.$axios.$get("/descricao_cargo/buscarTodos", { params: { page, size, filtros }})
      if(!resp.falha){
        let { descricoesCargo, total } = resp.dados
        this.dados = descricoesCargo
        this.totalItens = total
      }
    },

    cadastrado(descricao){
      this.dados.push(descricao)
      this.descricao = null

      this.mostrarDialogCriaDescricaoCargo = false
      this.textoAlerta = "Descrição do cargo cadastrada com sucesso!"
      this.mostrarAlerta = true
    },
    editado(descricao){
      let idx = this.dados.findIndex( o=> o.id === descricao.id)
      this.descricao = null

      if(idx >= 0 ){
        for (let k of Object.keys(descricao)) {
          this.dados[idx][k] = descricao[k]
        }
        this.dados[idx] = Object.assign({}, descricao)
      }

      this.mostrarDialogCriaDescricaoCargo = false
      this.textoAlerta = "Descrição do cargo editada com sucesso!"
      this.mostrarAlerta = true
    },
    deletado(id){
      let idx = this.dados.findIndex(o => o.id === id)
      this.descricao = null

      if (idx >= 0) {
        this.dados.splice(idx, 1)
      }

      this.mostrarDialogCriaDescricaoCargo = false
      this.textoAlerta = "Descrição do cargo deletado com sucesso!"
      this.mostrarAlerta = true
    }

  }
};
</script>

<style scoped>

</style>
