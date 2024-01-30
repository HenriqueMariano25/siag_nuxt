<template>
  <div class="w-full">
    <CabecalhoPagina titulo="CARGOS DA AVALIAÇÃO" />
    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
      <TabelaPadrao
        id="cargo"
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
        @atualizar="buscarCargos()"
        :temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoPadrao
            icone
            @clique="
							cargo = item
							mostrarDialogCriarCargo = true
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
              @clique="mostrarDialogCriarCargo = true">
              <img
                src="@/assets/icons/add-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarCargo
      v-if="mostrarDialogCriarCargo"
      :cargo="cargo"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
      @cancelar="
				mostrarDialogCriarCargo = false
				cargo = null
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
import DialogCriarCargo from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/Cargo/DialogCriarCargo.vue";

export default {
  components: {
    DialogCriarCargo,
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
        { nome: "Nome", valor: "nome" },
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      itensPorPagina: 100,
      pagina: 1,
      dados: [],
      mostrarDialogCriarCargo: false,
      cargo: null,
      mostrarAlerta: false,
      textoAlerta: null,
    }
  },
  async mounted() {
    await this.buscarCargos()
  },
  methods: {
    async buscarCargos() {
      let page = this.pagina - 1
      let size = this.itensPorPagina
      let filtros = this.filtros

      let resp = await this.$axios.$get("/cargo_avaliacao/buscarTodos", {
        params: { page, size, filtros },
      })
      if (!resp.falha) {
        let { cargos, total } = resp.dados
        this.dados = cargos
        this.totalItens = total
      }
    },

    cadastrado(cargo) {
      this.dados.push(cargo)
      this.cargo = null

      this.mostrarDialogCriarCargo = false
      this.textoAlerta = "Cargo cadastrada com sucesso!"
      this.mostrarAlerta = true
    },
    editado(cargo) {
      let idx = this.dados.findIndex((o) => o.id === cargo.id)
      this.cargo = null

      if (idx >= 0) {
        for (let k of Object.keys(cargo)) {
          this.dados[idx][k] = cargo[k]
        }
        this.dados[idx] = Object.assign({}, cargo)
      }

      this.mostrarDialogCriarCargo = false
      this.textoAlerta = "Cargo editada com sucesso!"
      this.mostrarAlerta = true
    },
    deletado(id) {
      let idx = this.dados.findIndex((o) => o.id === id)
      this.cargo = null

      if (idx >= 0) {
        this.dados.splice(idx, 1)
      }

      this.mostrarDialogCriarCargo = false
      this.textoAlerta = "Cargo deletado com sucesso!"
      this.mostrarAlerta = true
    },
  },
}
</script>

<style scoped></style>
