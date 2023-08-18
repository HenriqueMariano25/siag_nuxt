<script>
import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  name: "FiltroMultiSelecao",
  components: { BotaoPadrao, AppFormInput, AppFormCheckbox },
  props: {
    cabecalhoValor: {
      type: [String, Object],
    },
    cabecalhoNome: {
      type: [String, Object],
    },
    cabecalhoOpcoes: {
      type: [Array],
    },
    mostrarVazio: {
      type: [Boolean],
    }
  },
  data() {
    return {
      textoParaFiltro: null,
      multSelecionados: [],
      checkSelecionarTodos: false,
    };
  },
  methods: {
    opcoesFiltradas(opcoes) {
      let itensFiltrados = opcoes

      if (this.textoParaFiltro !== null && this.textoParaFiltro !== "") {
        if (Object.keys(opcoes[0]).includes("id")) {
          itensFiltrados = opcoes.filter((o) =>
            o.texto.toLowerCase().includes(this.textoParaFiltro.toLowerCase()),
          )
        } else {
          itensFiltrados = opcoes.filter((o) =>
            o.toLowerCase().includes(this.textoParaFiltro.toLowerCase()),
          )
        }
      }

      return itensFiltrados
    },
    selecionarTodos(opcoes, mostrarVazio) {
      if (!this.checkSelecionarTodos) {
        if (Object.keys(opcoes[0]).includes("id")) {
          this.multSelecionados = opcoes.map((o) => o.id)
          if (mostrarVazio) this.multSelecionados.unshift(null)
        } else {
          this.multSelecionados = opcoes
          if (mostrarVazio) this.multSelecionados.unshift(null)
        }
      } else {
        this.multSelecionados = []
      }
    },

    filtrarMult(valor) {
      let multSelecionados = this.multSelecionados

      this.$emit("filtrarMult", { valor, multSelecionados })
    },

    limparFiltrarMult(valor) {
      this.$emit("limparFiltrarMult", { valor })
    },
  }
};
</script>

<template>
  <div
    style="top: 34px"
    class="absolute text-start px-2 py-1 rounded-sm shadow-lg bg-white min-w-[300px] border border-gray-200">
    <AppFormInput
      id="filtroMultSelecao"
      class="w-full"
      type="text"
      :label="'Buscar por ' + cabecalhoNome"
      :value="textoParaFiltro"
      v-model="textoParaFiltro"
      placeholder=""
      @keyup.enter.prevent.stop="adicionarFiltro(cabecalhoValor, $event)" />
    <div
      class="text-black gap-y-1 h-[200px] overflow-y-auto border border-gray-400 p-2 mt-2 mb-2">
      <div class="border-b border-gray-800 mb-1 py-1">
        <AppFormCheckbox
          key="todos"
          :id="`filtroCheckTodos-${cabecalhoValor}`"
          :valor="false"
          label="todos"
          v-model="checkSelecionarTodos"
          @click="selecionarTodos(cabecalhoOpcoes, mostrarVazio)"></AppFormCheckbox>
      </div>
      <div class="py-1" v-if="mostrarVazio">
        <AppFormCheckbox
          key="vazios"
          id="filtroCheckVazios"
          :valor="null"
          label="Vazios"
          v-model="multSelecionados"
        ></AppFormCheckbox>
      </div>
      <template v-for="o in opcoesFiltradas(cabecalhoOpcoes)">
        <AppFormCheckbox
          v-if="!Object.keys(o).includes('id')"
          :key="o"
          :id="'filtroCheck' + o"
          :valor="o"
          :label="o"
          v-model="multSelecionados"></AppFormCheckbox>
        <AppFormCheckbox
          v-if="Object.keys(o).includes('id')"
          :key="o.id"
          :id="'filtroCheck' + o.id"
          :valor="o.id"
          :label="o.texto"
          v-model="multSelecionados"></AppFormCheckbox>
      </template>
    </div>
    <div class="w-full gap-2 flex justify-between">
      <BotaoPadrao
        texto="Limpar"
        @clique="limparFiltrarMult(cabecalhoValor)"
        class=" ">
      </BotaoPadrao>
      <BotaoPadrao
        texto="Filtrar"
        cor="bg-primaria-500 hover:bg-primaria-700 text-white"
        class=" "
        @clique="filtrarMult(cabecalhoValor)">
      </BotaoPadrao>
    </div>
  </div>
</template>

<style scoped>

</style>
