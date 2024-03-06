<template>
  <div class="w-full">
    <CabecalhoPagina titulo="CARTÕES" />
    <div class="relative">
      <div class="flex w-full mt-11 ">
        <TabelaPadrao
          id="cartoes"
          :cabecalho="cabecalho"
          :dados="dados"
          :itensPorPagina="itensPorPagina"
          :pagina="pagina"
          dadosSql
          @pagina="pagina = $event"
          @filtros="filtros = $event"
          @ordem="ordem = $event"
          :totalItens="totalItens"
          @itensPorPagina="itensPorPagina = $event"
          altura="calc(100vh - 180px)"
          @atualizar="buscarCartoes()"
          :temDetalhes="false">
          <template v-slot:[`body.PDA.Descricao`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Perfil }}
						</span>
          </template>
          <template v-slot:[`body.func.Matricula`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Matricula }}
						</span>
          </template>
          <template v-slot:[`body.func.Nome`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Nome }}
						</span>
          </template>
          <template v-slot:[`body.depa.Descricao`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Funcao }}
						</span>
          </template>
          <template v-slot:[`body.empr.Descricao`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Empresa }}
						</span>
          </template>
          <template v-slot:[`body.cart.NUM_CARTAO`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Cartao }}
						</span>
          </template>
        </TabelaPadrao>
      </div>

      <div
        class="absolute w-full h-full bg-black/80 text-white top-0 border border-black text-center items-center flex flex-col justify-center gap-3"
        style="z-index: 102"
        v-if="buscandoDados">
        <div class="square-circle-5"></div>
        <span class="text-4xl font-bold">BUSCANDO DADOS, FAVOR AGUARDE</span>
      </div>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex items-center gap-2 w-full">
          <BotaoPadrao texto="Excel" @clique="gerarExcel()" :disabled="buscandoDados">
            <img src="@/assets/icons/excel-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
    </RodapePagina>
    </div>
</template>

<script>
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import gerarExcel from "~/functions/gerarExcel";

export default {
  name: "Cartoes",
  components: { TabelaPadrao, RodapePagina, BotaoPadrao, CabecalhoPagina },
  data() {
    return {
      filtros: [],
      ordem: null,
      totalItens: 0,
      dados: [],
      itensPorPagina: 100,
      pagina: 1,
      buscandoDados: false,
    };
  },
  computed: {
    cabecalho() {
      return [
        { nome: "Matricula", valor: "func.Matricula", filtro: true },
        { nome: "Nome", valor: "func.Nome", filtro: true },
        { nome: "Cargo", valor: "depa.Descricao", filtro: true },
        { nome: "Cartão", valor: "cart.NUM_CARTAO", filtro: true },
        { nome: "Empresa", valor: "empr.Descricao", filtro: true },
        { nome: "Perfil", valor: "PDA.Descricao", filtro: true },
      ]
    }
  },
  async created() {
    await this.buscarCartoes();
  },
  methods: {
    async buscarCartoes() {
      this.buscandoDados = true
      let page = this.pagina
      let size = this.itensPorPagina
      let filtros = this.filtros

      let resp = await this.$axios.$get("/catraca/cartoes/novo_padrao", { params: { size, page, filtros }})

      if(!resp.falha){
        this.dados = resp.dados.cartoes
        this.totalItens = resp.dados.total
        this.buscandoDados = false
      }
    },
    async gerarExcel(){
      let dados = this.dados

      let cabecalho = [
        "Matrícula",
        "Nome",
        "Cargo",
        "Cartão",
        "Empresa",
        "Perfil",
      ]
      let nomeArquivo = "cartoes"

      let itens = []
      for (let item of dados) {
        let temp = []
        temp.push(item.Matricula)
        temp.push(item.Nome)
        temp.push(item.Funcao)
        temp.push(item.Cartao)
        temp.push(item.Empresa)
        temp.push(item.Perfil)
        itens.push(temp)
      }

      gerarExcel(cabecalho, itens, nomeArquivo)
    }
  }
};
</script>

<style scoped>
.square-circle-5 {
  width: 65px;
  aspect-ratio: 1;
  position: relative;
}

.square-circle-5:before,
.square-circle-5:after {
  content: "";
  position: absolute;
  border-radius: 50px;
  box-shadow: 0 0 0 3px inset #fff;
  animation: sc5 2.5s infinite;
}

.square-circle-5:after {
  animation-delay: -1.25s;
  border-radius: 0;
}

@keyframes sc5 {
  0% {
    inset: 0 35px 35px 0;
  }
  12.5% {
    inset: 0 35px 0 0;
  }
  25% {
    inset: 35px 35px 0 0;
  }
  37.5% {
    inset: 35px 0 0 0;
  }
  50% {
    inset: 35px 0 0 35px;
  }
  62.5% {
    inset: 0 0 0 35px;
  }
  75% {
    inset: 0 0 35px 35px;
  }
  87.5% {
    inset: 0 0 35px 0;
  }
  100% {
    inset: 0 35px 35px 0;
  }
}
</style>
