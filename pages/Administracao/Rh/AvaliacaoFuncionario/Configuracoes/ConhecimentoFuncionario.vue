<template>
  <div class="w-full">
    <CabecalhoPagina titulo="CONHECIMENTO DO FUNCIONÁRIO" />
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
        @atualizar="buscarConhecimentos()"
        :temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoPadrao
            icone
            @clique="
							conhecimento = item
							mostrarDialogCriaConhecimentoFuncionario = true
						">
            <img
              src="@/assets/icons/edit-b.svg"
              alt=""
              class="w-6 h-6" />
          </BotaoPadrao>
        </template>
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex justify-end w-full">
          <div class="flex">
            <BotaoPadrao
              texto="cadastrar"
              @clique="mostrarDialogCriaConhecimentoFuncionario = true">
              <img
                src="@/assets/icons/add-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarConhecimentoFuncionario
      v-if="mostrarDialogCriaConhecimentoFuncionario"
      :conhecimento="conhecimento"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
      @cancelar="
				mostrarDialogCriaConhecimentoFuncionario = false
				conhecimento = null
			" />
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
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
import RodapePagina from "~/components/Shared/RodapePagina.vue"
import AppAlerta from "~/components/Ui/AppAlerta.vue"
import DialogCriarConhecimentoFuncionario
  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/ConhecimentoFuncionario/DialogCriarConhecimentoFuncionario.vue";

export default {
  components: {
    DialogCriarConhecimentoFuncionario,
    AppAlerta,
    RodapePagina,
    BotaoPadrao,
    TabelaPadrao,
    CabecalhoPagina,
  },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-14" },
        { nome: "Descrição", valor: "descricao" },
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      itensPorPagina: 100,
      pagina: 1,
      dados: [],
      mostrarDialogCriaConhecimentoFuncionario: false,
      conhecimento: null,
      mostrarAlerta: false,
      textoAlerta: null,
    }
  },
  async mounted() {
    await this.buscarConhecimentos()
  },
  methods: {
    async buscarConhecimentos() {
      let page = this.pagina - 1
      let size = this.itensPorPagina
      let filtros = this.filtros

      let resp = await this.$axios.$get("/conhecimento_funcionario/buscarTodos", {
        params: { page, size, filtros },
      })
      if (!resp.falha) {
        let { conhecimetosFuncionario, total } = resp.dados
        this.dados = conhecimetosFuncionario
        this.totalItens = total
      }
    },

    cadastrado(conhecimento) {
      this.dados.push(conhecimento)
      this.conhecimento = null

      this.mostrarDialogCriaConhecimentoFuncionario = false
      this.textoAlerta = "Conhe. funcionário cadastrada com sucesso!"
      this.mostrarAlerta = true
    },
    editado(conhecimento) {
      let idx = this.dados.findIndex((o) => o.id === conhecimento.id)
      this.conhecimento = null

      if (idx >= 0) {
        for (let k of Object.keys(conhecimento)) {
          this.dados[idx][k] = conhecimento[k]
        }
        this.dados[idx] = Object.assign({}, conhecimento)
      }

      this.mostrarDialogCriaConhecimentoFuncionario = false
      this.textoAlerta = "Conhe. funcionário editada com sucesso!"
      this.mostrarAlerta = true
    },
    deletado(id) {
      let idx = this.dados.findIndex((o) => o.id === id)
      this.conhecimento = null

      if (idx >= 0) {
        this.dados.splice(idx, 1)
      }

      this.mostrarDialogCriaConhecimentoFuncionario = false
      this.textoAlerta = "Conhe. funcionário deletado com sucesso!"
      this.mostrarAlerta = true
    },
  },
}
</script>

<style scoped></style>
