<template>
  <div class="w-full">
    <CabecalhoPagina titulo="DISPONIBILIDADE DE TRABALHO" />
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
        @atualizar="buscarDisponibilidadeTrabalho()"
        :temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoPadrao
            icone
            @clique="
							disponibilidade = item
							mostrarDialogCriarDisponibilidadeTrabalho = true
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
              @clique="mostrarDialogCriarDisponibilidadeTrabalho = true">
              <img
                src="@/assets/icons/add-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarDisponilidadeTrabalho
      v-if="mostrarDialogCriarDisponibilidadeTrabalho"
      :disponibilidade="disponibilidade"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
      @cancelar="
				mostrarDialogCriarDisponibilidadeTrabalho = false
				disponibilidade = null
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
import DialogCriarDisponilidadeTrabalho
  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DisponibiliadeTrabalho/DialogCriarDisponilidadeTrabalho.vue";

export default {
  components: {
    DialogCriarDisponilidadeTrabalho,
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
      mostrarDialogCriarDisponibilidadeTrabalho: false,
      disponibilidade: null,
      mostrarAlerta: false,
      textoAlerta: null,
    }
  },
  async mounted() {
    await this.buscarDisponibilidadeTrabalho()
  },
  methods: {
    async buscarDisponibilidadeTrabalho() {
      let page = this.pagina - 1
      let size = this.itensPorPagina
      let filtros = this.filtros

      let resp = await this.$axios.$get("/disponibilidade_trabalho/buscarTodos", {
        params: { page, size, filtros },
      })
      if (!resp.falha) {
        let { disponibilidades, total } = resp.dados
        this.dados = disponibilidades
        this.totalItens = total
      }
    },

    cadastrado(disponibilidade) {
      this.dados.push(disponibilidade)
      this.disponibilidade = null

      this.mostrarDialogCriarDisponibilidadeTrabalho = false
      this.textoAlerta = "Disponibilidade cadastrada com sucesso!"
      this.mostrarAlerta = true
    },
    editado(disponibilidade) {
      let idx = this.dados.findIndex((o) => o.id === disponibilidade.id)
      this.disponibilidade = null

      if (idx >= 0) {
        for (let k of Object.keys(disponibilidade)) {
          this.dados[idx][k] = disponibilidade[k]
        }
        this.dados[idx] = Object.assign({}, disponibilidade)
      }

      this.mostrarDialogCriarDisponibilidadeTrabalho = false
      this.textoAlerta = "Disponibilidade editada com sucesso!"
      this.mostrarAlerta = true
    },
    deletado(id) {
      let idx = this.dados.findIndex((o) => o.id === id)
      this.disponibilidade = null

      if (idx >= 0) {
        this.dados.splice(idx, 1)
      }

      this.mostrarDialogCriarDisponibilidadeTrabalho = false
      this.textoAlerta = "Disponibilidade deletado com sucesso!"
      this.mostrarAlerta = true
    },
  },
}
</script>

<style scoped></style>
