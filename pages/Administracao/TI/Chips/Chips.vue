<template>
  <div class="w-full print:!-ml-0.5">
    <CabecalhoPagina titulo="Chips" />
    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden ">
      <TabelaPadrao
        :cabecalho="cabecalho"
        :dados="dados"
        :itensPorPagina="itensPorPagina"
        :pagina="pagina"
        @pagina="pagina = $event"
        @filtros="filtros = $event"
        @ordem="ordem = $event"
        :totalItens="totalItens"
        altura="calc(100vh - 179px)"
        @atualizar="buscarChips"
        :temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <div class="flex">
            <BotaoPadrao
              @clique="
							chip = item
							mostrarDialogCriarChip = true
						"
              icone>
              <div class="w-7 h-7 flex items-center justify-center">
                <img
                  src="@/assets/icons/edit-b.svg"
                  alt=""
                  class="w-6 h-6" />
              </div>
            </BotaoPadrao>
          </div>
        </template>
        <template v-slot:[`body.data_ativacao`]="{ item }">
					<span
            class="whitespace-nowrap"
            v-if="item.data_ativacao">
						{{ $dayjs(item.data_ativacao).format("DD/MM/YYYY") }}
					</span>
        </template>
        <template v-slot:[`body.PlanoChip.nome`]="{ item }">
					<span
            class="whitespace-nowrap"
            v-if="item.PlanoChip">
						{{ item.PlanoChip.nome }}
					</span>
        </template>
        <template v-slot:[`body.Funcionario.nome`]="{ item }">
					<span
            class="whitespace-nowrap "
            :class="{'bg-red-500 p-1 !text-black rounded': item.Funcionario.data_demissao}"
            v-if="item.Funcionario">
						{{ item.Funcionario.nome }}
					</span>
          <span
            class="whitespace-nowrap bg-green-500 p-1 !text-black rounded shadow"
            v-if="!item.Funcionario">
						EM ESTOQUE
					</span>
        </template>
        <template v-slot:[`body.Funcionario.setor.nome`]="{ item }">
					<span
            class="whitespace-nowrap"
            v-if="item.Funcionario && item.Funcionario.setor">
						{{ item.Funcionario.setor.nome }}
					</span>
        </template>
        <template v-slot:[`body.SituacaoChip.descricao`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.SituacaoChip.descricao }}
					</span>
        </template>
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex justify-between w-full">
          <div class="flex gap-2">
            <BotaoPadrao texto="excel" @clique="gerarExcel()">
              <img src="@/assets/icons/excel-b.svg" alt="" class="w-7 h-7">
            </BotaoPadrao>
            <BotaoPadrao texto="KPI" @clique="mostrarDialogKpiChip = true">
              <img src="@/assets/icons/graph-b.svg" alt="" class="w-7 h-7">
            </BotaoPadrao>
          </div>
          <div class="flex">
            <BotaoPadrao
              class="flex"
              @clique="mostrarDialogCriarChip = true"
              texto="Adicionar">
              <img
                src="@/assets/icons/add-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarChip
      v-if="mostrarDialogCriarChip"
      @cancelar="
				mostrarDialogCriarChip = false
				chip = null
			"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
      :chip="chip" />
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
    <DialogKpiChip v-if="mostrarDialogKpiChip" @cancelar="mostrarDialogKpiChip = false"/>
  </div>
</template>

<script>
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";
import DialogCriarChip from "~/components/Dialogs/Administracao/Ti/Chips/DialogCriarChip.vue";
import gerarExcel from "~/functions/gerarExcel";
import DialogKpiChip from "~/components/Dialogs/Administracao/Ti/Chips/DialogKpiChip.vue";

export default {
  components: { DialogKpiChip, DialogCriarChip, AppAlerta, RodapePagina, BotaoPadrao, CabecalhoPagina, TabelaPadrao },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-14" },
        { nome: "Número", valor: "numero", filtro: true, ordenar: true },
        { nome: "Data Ativação", valor: "data_ativacao" },
        { nome: "SimCard", valor: "sim_card", ordenar: true, filtro: true },
        { nome: "Plano", valor: "PlanoChip.nome", filtro: true, ordenar: true },
        { nome: "Funcionário", valor: "Funcionario.nome", filtro: true, ordenar: true },
        { nome: "Setor", valor: "Funcionario.setor.nome", filtro: true, ordenar: true },
        { nome: "Situação", valor: "SituacaoChip.descricao", filtro: true},
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      dados: [],
      itensPorPagina: 100,
      pagina: 1,
      mostrarDialogCriarChip: false,
      chip: null,
      mostrarAlerta: false,
      textoAlerta: null,
      mostrarDialogKpiChip: false
    }
  },
  created() {
    this.buscarChips()
  },
  methods: {
    async buscarChips() {
      let filtros = this.filtros
      let ordem = this.ordem

      let resp = await this.$axios.$get("/ti/chip/buscarTodos", {
        params: {
          page: this.pagina - 1,
          size: this.itensPorPagina,
          filtros,
          ordem,
        },
      })

      if (!resp.falha) {
        this.dados = resp.dados.chips
        this.totalItens = resp.dados.total
      }
    },
    cadastrado({ chip, sair }) {
      if(sair){
        this.mostrarDialogCriarChip = false
        this.textoAlerta = "Chip cadastrado com sucesso!"
        this.mostrarAlerta = true
      }
      this.chip = chip
      this.dados.push(chip)
      this.totalItens += 1
    },

    editado({ chip, sair }) {
      if(sair){
        this.chip = null
        this.mostrarDialogCriarChip = false
        this.textoAlerta = "Funcionário no chip editado com sucesso!"
        this.mostrarAlerta = true
      }
      let idx = this.dados.findIndex( o => o.id === chip.id)
      if(idx >= 0){
        this.dados[idx] = Object.assign(this.dados[idx], chip)
      }
    },

    deletado(id) {
      let idx = this.dados.findIndex((o) => o.id === id)
      this.dados.splice(idx, 1)

      this.mostrarDialogCriarChip = false
      this.textoAlerta = "Chip deletada com sucesso!"
      this.mostrarAlerta = true
      this.chip = null
      this.totalItens -= 1
    },

    gerarExcel(){
      let dados = this.dados

      let cabecalho = [
        "Número",
        "Data de ativação",
        "SimCard",
        "Plano",
        "Funcionário",
        "Setor",
        "Situação",
      ]
      let nomeArquivo

      nomeArquivo = "chips"

      let itens = []
      for (let item of dados) {
        let temp = []
        temp.push(item.numero ? item.numero : "")
        temp.push(this.$dayjs(item.data_ativacao).format("DD/MM/YYYY"))
        temp.push(item.sim_card ? item.sim_card : "")
        temp.push(item.PlanoChip ? item.PlanoChip.nome : "")
        temp.push(
          item.Funcionario
            ? item.Funcionario.nome
            : "No estoque",
        )
        temp.push(
          item.Funcionario && item.Funcionario.setor
            ? item.Funcionario.setor.nome
            : "",
        )
        temp.push(
          item.SituacaoChip ? item.SituacaoChip.descricao : "",
        )
        itens.push(temp)
      }

      gerarExcel(cabecalho, itens, nomeArquivo)
    }
  },
}
</script>

<style scoped>
@page {
  size: auto;
}
</style>
