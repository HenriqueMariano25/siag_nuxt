<template>
  <div class="w-full">
		<CabecalhoPagina titulo="Função" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
				:cabecalho="cabecalho"
				:dados="dados"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:temRodape="false"
				altura="calc(100vh - 117px)"
				@atualizar="buscarFuncoes"
				:temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoPadrao
            class="!p-0.5"
            @clique="
							funcao = item
							mostrarDialogCriarFuncao = true
						"
            icone>
            <div class="w-5 h-5 flex items-center justify-center">
              <img
                src="@/assets/icons/edit-b.svg"
                alt=""
                class="w-5 h-5" />
            </div>
          </BotaoPadrao>
        </template>
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex justify-end w-full">
          <BotaoPadrao
            texto="adicionar"
            @clique="mostrarDialogCriarFuncao = true">
            <img
              src="@/assets/icons/add-b.svg"
              alt=""
              class="w-7 h-7" />
          </BotaoPadrao>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarFuncao
      v-if="mostrarDialogCriarFuncao"
      @cancelar="
				mostrarDialogCriarFuncao = false
				funcao = null
			"
      :funcao="funcao"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado" />
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
  </div>
</template>

<script>

import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";
import DialogCriarFuncao from "~/components/Dialogs/Administracao/Rh/Contratacao/Configuracao/DialogCriarFuncao.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";
export default {
  name: "Funcao",
  components: { RodapePagina, BotaoPadrao, AppAlerta, CabecalhoPagina, TabelaPadrao, DialogCriarFuncao },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-8" },
        { nome: "Código", valor: "id", filtro: true, ordenar: true },
        { nome: "Nome", valor: "nome", filtro: true, ordenar: true },
        { nome: "Tipo Mão de Obra", valor: "tipo_mao_obra", filtro: true, ordenar: true },
        { nome: "Numero CBO", valor: "numero_cbo", filtro: true, ordenar: true },
        { nome: "CCT", valor: "cct", filtro: true, ordenar: true },
        { nome: "Sálario", valor: "salario", filtro: true, ordenar: true },
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      dados: [],
      itensPorPagina: 100,
      pagina: 1,
      mostrarDialogCriarFuncao: false,
      funcao: null,
      mostrarAlerta: false,
      textoAlerta: null,
    }
  },
  async created() {
    await this.buscarFuncoes()
  },
  methods: {
    async buscarFuncoes() {
      let filtros = this.filtros

      let resp = await this.$axios.$get("/contratacao/funcao/buscar/novo_padrao", {
        params: { filtros },
      })

      if (!resp.falha) {
        this.dados = resp.dados.funcoes
      }
    },
    async cadastrado(funcao) {
      this.dados.push(funcao)

      this.textoAlerta = "Função cadastrada com sucesso!"
      this.mostrarAlerta = true
      this.mostrarDialogCriarFuncao = false
    },
    async editado(funcao) {
      let idx = this.dados.findIndex((o) => o.id === funcao.id)

      if (idx >= 0) {
        this.dados[idx].nome = funcao.nome
        this.dados[idx].tipo_mao_obra = funcao.tipo_mao_obra
        this.dados[idx].numero_cbo = funcao.numero_cbo
        this.dados[idx].cct = funcao.cct
        this.dados[idx].salario = funcao.salario
        this.dados[idx].setor = funcao.setor
      }

      this.textoAlerta = "Função editada com sucesso!"
      this.mostrarAlerta = true
      this.funcao = null
      this.mostrarDialogCriarFuncao = false
    },

    async deletado(id) {
      let idx = this.dados.findIndex((o) => parseInt(o.id) === parseInt(id))

      if (idx >= 0) {
        this.dados.splice(idx, 1)
      }

      this.textoAlerta = "Função deletada com sucesso!"
      this.mostrarAlerta = true
      this.funcao = null
      this.mostrarDialogCriarFuncao = false
    },
  }
}
</script>


<style scoped>

</style>
