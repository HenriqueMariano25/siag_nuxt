<template>
  <div class="w-full">
    <CabecalhoPagina titulo="FERIADOS" />
    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
      <TabelaPadrao
        id="feriados"
        :cabecalho="cabecalho"
        :dados="dados"
        :itensPorPagina="itensPorPagina"
        :pagina="pagina"
        @pagina="pagina = $event"
        @filtros="filtros = $event"
        :totalItens="totalItens"
        altura="calc(100vh - 179px)"
        @atualizar="buscarFeriados"
        :temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <div class="flex">
            <BotaoPadrao
              @clique="
							  feriado = item
								mostrarDialogCriarFeriado = true
							"
              icone>
              <div class="w-6 h-6 flex items-center justify-center">
                <img
                  src="@/assets/icons/edit-b.svg"
                  alt=""
                  class="w-5 h-5" />
              </div>
            </BotaoPadrao>
          </div>
        </template>
        <template v-slot:[`body.data`]="{ item }">
          <span>{{ $dayjs(item.data).format("DD/MM/YYYY") }}</span>
        </template>
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex justify-end w-full">
          <div class="flex">
            <BotaoPadrao
              class="flex"
              @clique="mostrarDialogCriarFeriado = true"
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
    <DialogCriarFeriado
      v-if="mostrarDialogCriarFeriado"
      @cancelar="mostrarDialogCriarFeriado = false"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
      :feriado="feriado" />
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
  </div>
</template>

<script>
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";
import DialogCriarFeriado from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialogCriarFeriado.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";

export default {
  name: "Feriado",
  components: { TabelaPadrao, DialogCriarFeriado, AppAlerta, BotaoPadrao, CabecalhoPagina, RodapePagina },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-14" },
        { nome: "Descrição", valor: "descricao", filtro: true },
        { nome: "Data", valor: "data" },
      ],
      filtros: {},
      totalItens: 0,
      dados: [],
      itensPorPagina: 100,
      pagina: 1,
      mostrarDialogCriarFeriado: false,
      feriado: null,
      mostrarAlerta: false,
      textoAlerta: null,
    }
  },
  created() {
    this.buscarFeriados()
  },
  methods: {
    async buscarFeriados() {
      let filtros = this.filtros

      let resp = await this.$axios.$get("/hora_extra/feriado/buscarTodos", {
        params: {
          filtros,
        },
      })

      if (!resp.falha) {
        this.dados = resp.dados.feriados
        this.totalItens = this.dados.length
      }
    },
    cadastrado(feriado) {
      this.dados.push(feriado)
      this.mostrarDialogCriarFeriado = false
      this.textoAlerta = "Feriado cadastrado com sucesso!"
      this.mostrarAlerta = true
      this.totalItens += 1
    },
    editado(feriado) {
      let idx = this.dados.findIndex((o) => o.id === feriado.id)
      this.dados[idx].descricao = feriado.descricao
      this.dados[idx].data = feriado.data

      this.feriado = null
      this.mostrarDialogCriarFeriado = false
      this.textoAlerta = "Feriado editado com sucesso!"
      this.mostrarAlerta = true
    },

    deletado(id) {
      let idx = this.dados.findIndex((o) => o.id === id)
      this.dados.splice(idx, 1)

      this.mostrarDialogCriarFeriado = false
      this.textoAlerta = "Feriado deletado com sucesso!"
      this.mostrarAlerta = true
      this.feriado = null
      this.totalItens -= 1
    },
  },
};
</script>

<style scoped>

</style>
