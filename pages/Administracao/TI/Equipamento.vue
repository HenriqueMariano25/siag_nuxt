<template>
  <div class="w-full print:!-ml-0.5">
    <CabecalhoPagina titulo="EQUIPAMENTO" />
    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
      <TabelaPadrao
        id="equipamento"
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
        @atualizar="buscarEquipamentos"
        :temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoPadrao
            icone
            @clique="editarEquipamento(item)">
            <img
              src="@/assets/icons/edit-b.svg"
              alt=""
              class="w-6 h-6" />
          </BotaoPadrao>
        </template>
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <div class="w-full flex justify-between">
        <BotaoPadrao texto="excel" @clique="gerarExcel()">
          <img
            src="@/assets/icons/excel-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
        <BotaoPadrao
          texto="cadastrar"
          @clique="mostrarDialogCadastrarEquipamento = true">
          <img
            src="@/assets/icons/add-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
      </div>
    </RodapePagina>
    <DialogCadastrarEquipamento
      v-if="mostrarDialogCadastrarEquipamento"
      @cancelar="
				mostrarDialogCadastrarEquipamento = false
				equipamento = null
			"
      @cadastrado="equipamentoCadastrado"
      @editado="equipamentoEditado"
      :equipamento="equipamento" />
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
  </div>
</template>

<script>
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
import RodapePagina from "~/components/Shared/RodapePagina.vue"
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
import AppAlerta from "~/components/Ui/AppAlerta.vue"
import DialogCadastrarEquipamento
  from "~/components/Dialogs/Administracao/Ti/Equipamento/DialogCadastrarEquipamento.vue";
import gerarExcel from "~/functions/gerarExcel";

export default {
  components: {
    DialogCadastrarEquipamento,
    AppAlerta,
    BotaoPadrao,
    RodapePagina,
    TabelaPadrao,
    CabecalhoPagina,
  },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-14" },
        { nome: "Nome", valor: "nome", filtro: true, ordenar: true },
        { nome: "Marca", valor: "marca", filtro: true, ordenar: true },
        { nome: "Modelo", valor: "modelo", ordenar: true, filtro: true },
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      dados: [],
      itensPorPagina: 100,
      pagina: 1,
      mostrarDialogCadastrarEquipamento: false,
      equipamento: null,
      mostrarAlerta: false,
      textoAlerta: null,
    }
  },
  mounted() {
    this.buscarEquipamentos()
  },
  methods: {
    async buscarEquipamentos() {
      let filtros = this.filtros
      let ordem = this.ordem
      let page = this.pagina - 1
      let size = this.itensPorPagina

      let resp = await this.$axios.$get("/ti/equipamento/buscarTodos", {
        params: { filtros, ordem, page, size },
      })

      if (!resp.falha) {
        let { equipamentos, total } = resp.dados
        this.dados = equipamentos
        this.totalItens = total
      }
    },
    async editarEquipamento(item) {
      this.mostrarDialogCadastrarEquipamento = true
      this.equipamento = item
    },
    async equipamentoEditado({ equipamento, sair }) {
      let idx = this.dados.findIndex((o) => o.id === equipamento.id)

      if (idx >= 0) {
        this.dados[idx].nome = equipamento.nome
        this.dados[idx].marca = equipamento.marca
        this.dados[idx].modelo = equipamento.modelo
      }

      if (sair) {
        this.mostrarDialogCadastrarEquipamento = false
        this.textoAlerta = "Equipamento editado com sucesso!"
        this.mostrarAlerta = true
        this.equipamento = null
      }
    },
    async equipamentoCadastrado({ equipamento, sair }) {
      this.dados.push(equipamento)
      if (sair) {
        this.mostrarDialogCadastrarEquipamento = false
        this.textoAlerta = "Equipamento cadastrado com sucesso!"
        this.mostrarAlerta = true
      }
    },
    async gerarExcel() {
      let dados = this.dados

      let cabecalho = [
        "Nome",
        "Marca",
        "Modelo",
        "Observação",
      ]
      let nomeArquivo = "equipamento"

      let itens = []
      for (let item of dados) {
        let temp = []
        temp.push(item.nome ? item.nome : "")
        temp.push(item.marca ? item.marca : "")
        temp.push(item.modelo ? item.modelo : "")
        temp.push(item.observacao ? item.observacao : "")
        itens.push(temp)
      }

      gerarExcel(cabecalho, itens, nomeArquivo)
    },
  },
}
</script>

<style scoped></style>
