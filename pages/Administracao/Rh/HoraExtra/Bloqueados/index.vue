<template>
  <div class="w-full">
    <CabecalhoPagina titulo="BLOQUEADOS" />
    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
      <TabelaPadrao
        class="print:hidden"
        :cabecalho="cabecalho"
        :dados="dados"
        :itensPorPagina="itensPorPagina"
        :pagina="pagina"
        @pagina="pagina = $event"
        @itensPorPagina="itensPorPagina = $event"
        :totalItens="totalItens"
        @filtros="filtros = $event"
        @ordem="ordem = $event"
        classPersonalizada="!bg-gray-400"
        altura="calc(100vh - 181px)"
        :dados-redis="true"
        :carregando="carregando"
        @atualizar="filtrarBloqueados()"
        selecionar
        @selecionados="selecionados = $event"
      >
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <div class="flex w-full justify-between">
        <BotaoPadrao texto="Historico" @clique="$router.push('bloqueados/historicoLiberacoes')">
          <img src="../../../../../assets/icons/list-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
        <BotaoPadrao texto="Liberar" @clique="mostrarDialogLiberarBloqueados = true" :disabled="selecionados.length ===0">
          <img src="../../../../../assets/icons/check-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </div>
    </RodapePagina>
    <DialogLiberarBloqueados v-if="mostrarDialogLiberarBloqueados" @cancelar="mostrarDialogLiberarBloqueados = false" :selecionados="selecionados" @liberados="liberados"/>
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
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import DialogLiberarBloqueados
  from "~/components/Dialogs/Administracao/Rh/HoraExtra/Bloqueados/DialogLiberarBloqueados.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";

export default {
  components: { AppAlerta, DialogLiberarBloqueados, BotaoPadrao, RodapePagina, TabelaPadrao, CabecalhoPagina },
  data() {
    return {
      cabecalho: [
        { nome: "Nome", valor: "nome", filtro: true },
        { nome: "Matricula", valor: "matricula", centralizar: true, filtro: true },
        { nome: "Cargo", valor: "cargo", filtro: true },
        { nome: "Encarregado/Lider", valor: "encarregadoLider", filtro: true },
        { nome: "Setor", valor: "setor", filtro: true },
      ],
      dadosOriginais: [],
      dados: [],
      selecionados: [],
      filtros: {},
      ordem: null,
      itensPorPagina: 200,
      totalItens: 0,
      pagina: 1,
      carregando: false,
      mostrarDialogLiberarBloqueados: false,
      mostrarAlerta: false,
      textoAlerta: null
    };
  },
  mounted() {
    this.buscarBloqueados();
  },
  methods: {
    async buscarBloqueados() {
      this.carregando = true
      let resp = await this.$axios.$get("/hora_extra/bloqueados/buscar")

      if(!resp.falha){
        this.dados = resp.dados.funcionarios
        this.dadosOriginais = resp.dados.funcionarios
        console.log(this.dados);
        this.carregando =false
      }
    },

    async liberados(bloqueados){
      for(let bloq of bloqueados){
        let idx = this.dados.findIndex( o=> o.matricula === bloq.matricula)

        if(idx >= 0){
          this.dados.splice(idx, 1)
        }
      }

      this.textoAlerta = "Funcionários liberados com sucesso!"
      this.mostrarAlerta = true
      this.mostrarDialogLiberarBloqueados = false
    },

    async filtrarBloqueados(){
      let dados = [...this.dadosOriginais]

      for(let key of Object.keys(this.filtros)){
        dados = dados.filter(o => o[key].toLowerCase().includes(this.filtros[key].toLowerCase()))
      }

      this.dados = dados
    }
  }
};
</script>

<style scoped>

</style>
