<template>
  <div class="w-full">
    <CabecalhoPagina titulo="HABILIDADE TÉCNICA" />
    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
      <TabelaPadrao
        id="habilidade"
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
        @atualizar="buscarHabilidade()"
        :temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoPadrao
            icone
            @clique="
							habilidade = item
							mostrarDialogCriarHabilidadeTecnica = true
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
              @clique="mostrarDialogCriarHabilidadeTecnica = true">
              <img
                src="@/assets/icons/add-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarHabilidadeTecnica
      v-if="mostrarDialogCriarHabilidadeTecnica"
      :habilidade="habilidade"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
      @cancelar="
				mostrarDialogCriarHabilidadeTecnica = false
				habilidade = null
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
import DialogCriarHabilidadeTecnica
  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/HabilidadeTecnica/DialogCriarHabilidadeTecnica.vue";

export default {
  components: {
    DialogCriarHabilidadeTecnica,
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
      mostrarDialogCriarHabilidadeTecnica: false,
      habilidade: null,
      mostrarAlerta: false,
      textoAlerta: null,
    }
  },
  async mounted() {
    await this.buscarHabilidadesTecnica()
  },
  methods: {
    async buscarHabilidadesTecnica() {
      let page = this.pagina - 1
      let size = this.itensPorPagina
      let filtros = this.filtros

      let resp = await this.$axios.$get("/habilidade_tecnica/buscarTodos", {
        params: { page, size, filtros },
      })
      if (!resp.falha) {
        let { habilidades, total } = resp.dados
        this.dados = habilidades
        this.totalItens = total
      }
    },

    cadastrado(habilidade) {
      this.dados.push(habilidade)
      this.habilidade = null

      this.mostrarDialogCriarHabilidadeTecnica = false
      this.textoAlerta = "Hab. Técnica cadastrada com sucesso!"
      this.totalItens += 1
      this.mostrarAlerta = true
    },
    editado(habilidade) {
      let idx = this.dados.findIndex((o) => o.id === habilidade.id)
      this.habilidade = null

      if (idx >= 0) {
        for (let k of Object.keys(habilidade)) {
          this.dados[idx][k] = habilidade[k]
        }
        this.dados[idx] = Object.assign({}, habilidade)
      }

      this.mostrarDialogCriarHabilidadeTecnica = false
      this.textoAlerta = "Hab. Técnica editada com sucesso!"
      this.mostrarAlerta = true
    },
    deletado(id) {
      let idx = this.dados.findIndex((o) => o.id === id)
      this.habilidade = null

      if (idx >= 0) {
        this.dados.splice(idx, 1)
        this.totalItens -= 1
      }


      this.mostrarDialogCriarHabilidadeTecnica = false
      this.textoAlerta = "Hab. Técnica deletado com sucesso!"
      this.mostrarAlerta = true
    },
  },
}
</script>

<style scoped></style>
