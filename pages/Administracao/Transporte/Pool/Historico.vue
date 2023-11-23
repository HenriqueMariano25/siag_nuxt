<template>
  <div class="w-full">
    <CabecalhoPagina titulo="HISTÓRICO POOL" />
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
        @atualizar="buscarPools"
        :temDetalhes="false">
        <template v-slot:[`body.Carro.cga`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.Carro.cga }}
					</span>
        </template>
        <template v-slot:[`body.Funcionario.nome`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.Funcionario ? item.Funcionario.nome : "" }}
					</span>
        </template>
        <template v-slot:[`body.Setor.nome`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.Setor ? item.Setor.nome : "" }}
					</span>
        </template>
        <template v-slot:[`body.SubSetorPool.nome`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.SubSetorPool ? item.SubSetorPool.sub_setor : "" }}
					</span>
        </template>
        <template v-slot:[`body.AtendimentoPool.local`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.AtendimentoPool ? item.AtendimentoPool.local : "" }}
					</span>
        </template>
        <template v-slot:[`body.MotivoPool.motivo`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.MotivoPool ? item.MotivoPool.motivo : "" }}
					</span>
        </template>
        <template v-slot:[`body.data_inicial`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ $dayjs(item.data_inicial).format("DD/MM/YYYY")}} {{ item.hora_inicial }}
					</span>
        </template>
        <template v-slot:[`body.data_final`]="{ item }">
					<span
            class="whitespace-nowrap" v-if="item.data_final">
						{{ $dayjs(item.data_final).format("DD/MM/YYYY")}} {{ item.hora_final }}
					</span>
        </template>
        <template v-slot:[`body.StatusPool.descricao`]="{ item }">
					<span
            class="whitespace-nowrap uppercase">
						{{ item.StatusPool.descricao }}
					</span>
        </template>
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex justify-between w-full">
          <div class="flex">
            <BotaoPadrao texto="Voltar" @clique="$router.push('/administracao/transporte/pool')">
              <img
                src="@/assets/icons/back-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>
          </div>
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

export default {
  components: { RodapePagina, BotaoPadrao, TabelaPadrao, CabecalhoPagina },
  data() {
    return {
      cabecalho: [
        { nome: "Status", valor: "StatusPool.descricao", filtro: true, ordenar: true },
        { nome: "CGA", valor: "Carro.cga", filtro: true, ordenar: true, centralizar: true },
        { nome: "Funcionário", valor: "Funcionario.nome", filtro: true, ordenar: true },
        { nome: "Setor", valor: "Setor.nome", filtro: true, ordenar: true },
        { nome: "SubSetor", valor: "SubSetorPool.sub_setor", filtro: true, ordenar: true },
        { nome: "Atendimento", valor: "AtendimentoPool.local", filtro: true, ordenar: true },
        { nome: "Motivo", valor: "MotivoPool.motivo", filtro: true, ordenar: true },
        { nome: "Data inicial", valor: "data_inicial", filtro: true, ordenar: true },
        { nome: "Data final", valor: "data_final", filtro: true, ordenar: true },
        { nome: "KM inicial", valor: "km_inicial", filtro: true, ordenar: true },
        { nome: "KM final", valor: "km_final", filtro: true, ordenar: true },
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      itensPorPagina: 100,
      pagina: 1,
      dados: [],
    };
  },
  mounted() {
    this.buscarPools();
  },
  methods: {
    async buscarPools() {
      let resp = await this.$axios.$get("/pool/buscarTodos")

      console.log(resp);
      if(!resp.falha){
        this.dados = resp.dados.pools
      }

    }
  }
};
</script>

<style scoped>

</style>
