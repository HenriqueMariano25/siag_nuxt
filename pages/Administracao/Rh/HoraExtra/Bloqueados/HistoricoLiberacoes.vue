<template>
  <div class="w-full">
    <CabecalhoPagina titulo="HISTÓRICO LIBERAÇÕES" />
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
        @atualizar="buscarHistorico"
        :temDetalhes="false">
        <template v-slot:[`body.Funcionario.nome`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.Funcionario ? item.Funcionario.nome : "" }}
					</span>
        </template>
        <template v-slot:[`body.Funcionario.chapa`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.Funcionario ? item.Funcionario.chapa : "" }}
					</span>
        </template>
        <template v-slot:[`body.Funcionario.cargo`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.Funcionario ? item.Funcionario.cargo : "" }}
					</span>
        </template>
        <template v-slot:[`body.AutorizadoPor.nome`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.AutorizadoPor ? item.AutorizadoPor.nome : "" }}
					</span>
        </template>
        <template v-slot:[`body.Usuario.nome`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.Usuario ? item.Usuario.nome : "" }}
					</span>
        </template>
        <template v-slot:[`body.createdAt`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ $dayjs(item.createadAt).format("DD/MM/YYYY HH:mm:ss") }}
					</span>
        </template>
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex justify-between w-full">
          <div class="flex">
            <BotaoPadrao texto="Voltar" @clique="$router.push('/administracao/rh/horaExtra/bloqueados')">
              <img
                src="@/assets/icons/back-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>

          </div>
          <BotaoPadrao texto="Excel" @clique="gerarExcel()">
            <img src="@/assets/icons/excel-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
    </RodapePagina>
  </div>
</template>

<script>
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import gerarExcel from "~/functions/gerarExcel";

export default {
  components: { RodapePagina, BotaoPadrao, TabelaPadrao, CabecalhoPagina },
  data() {
    return {
      cabecalho: [
        { nome: "Nome", valor: "Funcionario.nome", filtro: true },
        { nome: "Matricula", valor: "Funcionario.chapa", centralizar: true, filtro: true },
        { nome: "Cargo", valor: "Funcionario.cargo", filtro: true },
        { nome: "Autorizado por", valor: "AutorizadoPor.nome", filtro: true },
        { nome: "Usuario", valor: "Usuario.nome", filtro: true },
        { nome: "Data", valor: "createdAt" },
      ],
      dadosOriginais: [],
      dados: [],
      selecionados: [],
      filtros: {},
      ordem: null,
      itensPorPagina: 200,
      totalItens: 0,
      pagina: 1,
    };
  },
  mounted() {
    this.buscarHistorico()
  },
  methods: {
    async buscarHistorico() {
      let filtros = this.filtros
      let page = this.pagina - 1
      let size = this.itensPorPagina

      let resp = await this.$axios.$get("/hora_extra/bloqueados/historico", { params: { filtros, page, size } })

      if(!resp.falha){
        this.dados = resp.dados.liberacoes
        this.totalItens = resp.dados.total
      }
    },
    async gerarExcel() {
      let dados = this.dados
      let cabecalho = [
        "Nome",
        "Matricula",
        "Cargo",
        "Autorizado por",
        "Usuário",
        "Data",
      ]
      let nomeArquivo

      nomeArquivo = "historico_liberacoes"

      let itens = []
      for (let item of dados) {
        let temp = []
        temp.push(item.Funcionario ? item.Funcionario.nome : "")
        temp.push(item.Funcionario ? item.Funcionario.chapa : "")
        temp.push(item.Funcionario ? item.Funcionario.cargo : "")
        temp.push(item.AutorizadoPor ? item.AutorizadoPor.nome : "")
        temp.push(item.Usuario ? item.Usuario.nome : "")
        temp.push(this.$dayjs(item.createadAt).format("DD/MM/YYYY HH:mm:ss"))
        itens.push(temp)
      }

      gerarExcel(cabecalho, itens, nomeArquivo)
    }
  }
};
</script>

<style scoped>

</style>
