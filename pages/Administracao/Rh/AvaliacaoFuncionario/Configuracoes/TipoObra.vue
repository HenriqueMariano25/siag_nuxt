<template>
  <div class="w-full">
    <CabecalhoPagina titulo="TIPO DE OBRA" />
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
        @atualizar="buscarTipoObra()"
        :temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoPadrao
            icone
            @clique="
							tipoObra = item
							mostrarDialogCriarTipoObra = true
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
              @clique="mostrarDialogCriarTipoObra = true">
              <img
                src="@/assets/icons/add-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarTipoObra
      v-if="mostrarDialogCriarTipoObra"
      :tipoObra="tipoObra"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
      @cancelar="
				mostrarDialogCriarTipoObra = false
				tipoObra = null
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
import DialogCriarTipoObra
  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/TipoObra/DialogCriarTipoObra.vue";

export default {
  components: {
    DialogCriarTipoObra,
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
        { nome: "Descrição", valor: "descricao", filtro: true },
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      itensPorPagina: 100,
      pagina: 1,
      dados: [],
      mostrarDialogCriarTipoObra: false,
      tipoObra: null,
      mostrarAlerta: false,
      textoAlerta: null,
    }
  },
  async mounted() {
    await this.buscarTipoObra()
  },
  methods: {
    async buscarTipoObra() {
      let page = this.pagina - 1
      let size = this.itensPorPagina
      let filtros = this.filtros

      let resp = await this.$axios.$get("/tipo_obra/buscarTodos", {
        params: { page, size, filtros },
      })
      if (!resp.falha) {
        let { tiposObra, total } = resp.dados
        this.dados = tiposObra
        this.totalItens = total
      }
    },

    cadastrado(tipoObra) {
      this.dados.push(tipoObra)
      this.tipoObra = null

      this.mostrarDialogCriarTipoObra = false
      this.textoAlerta = "Tipo de obra cadastrada com sucesso!"
      this.mostrarAlerta = true
    },
    editado(tipoObra) {
      let idx = this.dados.findIndex((o) => o.id === tipoObra.id)
      this.tipoObra = null

      if (idx >= 0) {
        for (let k of Object.keys(tipoObra)) {
          this.dados[idx][k] = tipoObra[k]
        }
        this.dados[idx] = Object.assign({}, tipoObra)
      }

      this.mostrarDialogCriarTipoObra = false
      this.textoAlerta = "Tipo de obra editada com sucesso!"
      this.mostrarAlerta = true
    },
    deletado(id) {
      let idx = this.dados.findIndex((o) => o.id === id)
      this.tipoObra = null

      if (idx >= 0) {
        this.dados.splice(idx, 1)
      }

      this.mostrarDialogCriarTipoObra = false
      this.textoAlerta = "Tipo de obra deletado com sucesso!"
      this.mostrarAlerta = true
    },
  },
}
</script>

<style scoped></style>
