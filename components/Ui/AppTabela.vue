<template>
  <div>
    <div
      class="grow w-full"
      :style="'height:' + altura"
      style="overflow-y: auto; overflow-x: auto; width: calc(100vw - 66px)">
      <table class="table table-auto" style="width: 100%">
        <colgroup>
          <col
            v-for="cab in cabecalho"
            :key="cab.valor"
            :class="{ [cab.tamanho]: cab.tamanho }"/>
        </colgroup>
        <thead>
        <tr class="">
          <th
            v-for="cab in cabecalho"
            :key="cab.valor"
            :class="cab.largura"
            class="uppercase px-3 py-1 text-sm text-white relative">
            <slot
              :name="'header.' + cab.valor"
              v-bind:item="cab">
              <div class="grid">
                <div class="flex justify-between items-center">
                  <span class="whitespace-nowrap">{{ cab.nome }}</span>
                  <div class="space-x-1 items-center flex ml-1">
                    <button v-if="cab.ordenar === true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-5 h-5 hover:fill-blue-400 cursor-pointer">
                        <path
                          fill-rule="evenodd"
                          d="M12 2.25a.75.75 0 01.75.75v16.19l6.22-6.22a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06l6.22 6.22V3a.75.75 0 01.75-.75z"
                          clip-rule="evenodd"/>
                      </svg>
                    </button>
                    <button
                      v-if="cab.filtro === true"
                      @click="
													filtroAberto !== cab.valor
														? (filtroAberto = cab.valor)
														: (filtroAberto = null)
												"
                      :class="{ 'text-blue-400': Object.keys(filtros).includes(cab.valor.includes('.') ? `$${cab.valor}$` : cab.valor) }">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-5 h-5 hover:fill-blue-400">
                        <path
                          fill-rule="evenodd"
                          d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z"
                          clip-rule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div
                style="top: 34px"
                v-if="filtroAberto === cab.valor"
                class="absolute text-start px-2 py-1 rounded-sm shadow-lg bg-white min-w-[300px] border border-gray-200">
                <div
                  class="absolute"
                  style="
											width: 0;
											height: 0;
											border-left: 10px solid transparent;
											border-right: 10px solid transparent;
											margin-top: -14px;
											border-bottom: 10px solid white;
										"></div>
                <div class="flex items-end">
                  <AppFormInput
                    :id="'filtro'+cab.nome"
                    class="w-full"
                    type="text"
                    :label="'Buscar por ' + cab.nome"
                    :value="filtros[cab.valor.includes('.') ? `$${cab.valor}$` : cab.valor]"
                    placeholder="Pressione ENTER para buscar"
                    @keyup.enter.prevent.stop="adicionarFiltro(cab.valor, $event)"/>
                </div>
                <div class="w-full mt-1">
                  <button
                    @click.prevent.stop="removerFiltro(cab.valor)"
                    class="bg-primaria-500 w-full py-1 hover:bg-primaria-700">
                    Limpar Filtro
                  </button>
                </div>
              </div>
            </slot>
          </th>
        </tr>
        </thead>
        <tbody
          class="pt-10 overflow-auto !h-10"
          :style="'height:' + altura">
        <tr v-if="carregando">
          <td :colspan="cabecalho.length">
            <div class="text-center bg-gray-400 text-4xl py-2">
                <span>
                  <strong>CARREGANDO DADOS...</strong>
                </span>
            </div>
          </td>
        </tr>
        <template v-for="dado in dados" v-if="!carregando">
          <tr
            :class="{ '!bg-gray-500 !text-white': trAberto === dado.id }"
            class="bg-white cursor-pointer even:bg-neutral-200 hover:bg-gray-600 hover:text-white h-10"
            :key="dado.id"
            @dblclick.prevent.stop="mostrarDbl(dado, $event)"
            @click.prevent.stop="mostrarDetalhes(dado, $event)">
            <td
              v-for="(c, index) in cabecalho"
              :key="index"
              class="px-3 py-0.5 border border-collapse border-gray-600 "
              :class="{ 'text-center': c.centralizar }">
              <slot
                :name="'body.' + c.valor"
                v-bind:item="dado">
                <span class="whitespace-nowrap">{{ dado[c.valor] }}</span>
              </slot>
            </td>
          </tr>

          <td
            :colspan="cabecalho.length"
            :id="`detalhes-${dado.id}`"
            v-if="trAberto === dado.id && temDetalhes"
            class="bg-blue-200 px-2 py-1 border border-gray-600">
            <slot
              name="detalhes"
              v-bind:item="dado"></slot>
          </td>
        </template>
        </tbody>
      </table>
    </div>
    <div class="p-1 border h-16 border-gray-600 flex justify-between items-center bg-white">
      <slot name="rodape"/>
      <div class="w-full flex justify-center space-x-1 items-center">
        <div>
          <button
            class="bg-slate-400 w-10 h-10 rounded hover:bg-slate-600"
            @click.prevent.stop="anteriorPagina()">
            &lt;
          </button>
        </div>
        <div
          v-for="num of btnsPaginacao"
          :key="num">
          <button
            :class="{ '!bg-blue-500': num === localPagina }"
            class="bg-slate-400 w-10 h-10 rounded hover:bg-blue-600"
            @click.prevent.stop="escolherPagina(num)">
            {{ num }}
          </button>
        </div>
        <div>
          <button
            class="bg-slate-400 w-10 h-10 rounded hover:bg-blue-600"
            @click.prevent.stop="proximaPagina()">
            &gt;
          </button>
        </div>
      </div>

      <div class="flex items-center w-1/4">
        <div>
					<span class="whitespace-nowrap mr-3 text-lg">
						<strong>Total: {{ totalItens }}</strong>
					</span>
        </div>
        <AppFormInput
          label="Itens por Página"
          type="number"
          placeholder="50"
          v-model="localItensPorPagina"
          id="totalItensPagina"
          @keyup.enter="atualizarDados"/>
      </div>
    </div>
  </div>
</template>

<script>
import AppFormInput from "~/components/Ui/AppFormInput.vue"
import TableFiltroSimples from "~/components/Ui/TableFiltroSimples.vue"
import AppTag from "~/components/Ui/AppTag.vue"

export default {
  name: "Tabela",
  props: {
    cabecalho: {
      type: Array,
      default: () => [],
      required: true,
    },
    dados: {
      type: Array,
      default: () => [],
      required: true,
    },
    altura: {
      type: String,
      default: "calc(100vh - 136px)",
    },
    itensPorPagina: {
      type: Number,
      required: true,
    },
    pagina: {
      type: Number,
      required: true,
    },
    totalItens: {
      type: Number,
      required: true,
    },
    temDetalhes: {
      type: Boolean,
      default: false,
    },
    carregando: {
      type: Boolean,
      default: false
    }
  },
  components: {
    AppFormInput,
    TableFiltroSimples,
    AppTag,
  },
  data() {
    return {
      filtros: {},
      filtroAberto: null,
      localItensPorPagina: this.itensPorPagina,
      localPagina: this.pagina,
      trAberto: null,
    }
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.totalItens / this.itensPorPagina)
    },

    btnsPaginacao() {
      let btns = []
      let pagina = this.localPagina

      let posicao = -2
      let totalNumBtn = 5
      let cont = 0

      while (cont < totalNumBtn) {
        let btn = pagina + posicao

        if (btn > 0 && btn <= this.totalPaginas) {
          btns.push(btn)
        }

        posicao++
        cont++
      }
      return btns
    },
  },
  methods: {
    filtrar(event, item) {
      let key = item.valor
      let nome = item.nome
      let valor = "" + event.target.value

      let idx = this.filtros.findIndex((o) => o.key === key)

      if (idx >= 0) {
        this.filtros.splice(idx, 1)
      }
      let filtro = {key, valor, nome}

      this.filtros.push(filtro)
      this.$emit("filtrar", this.filtros)
    },

    limpar(item) {
      let key = item.valor
      let idx = this.filtros.findIndex((o) => o.key === key)

      if (idx >= 0) {
        this.filtros.splice(idx, 1)
      }

      this.$emit("filtrar", this.filtros)
    },

    anteriorPagina() {
      if (this.localPagina - 1 >= 1) {
        this.localPagina -= 1
        this.atualizarDados()
      }
    },

    proximaPagina() {
      if (this.localPagina + 1 <= this.totalPaginas) {
        this.localPagina += 1
        this.atualizarDados()
      }
    },

    escolherPagina(num) {
      this.localPagina = num
      this.atualizarDados()
    },

    atualizarDados() {
      this.localItensPorPagina = parseInt(this.localItensPorPagina)
      let itensPorPagina = parseInt(this.localItensPorPagina)
      let pagina

      if (this.itensPorPagina !== this.localItensPorPagina) {
        this.localPagina = 1
      }
      pagina = this.localPagina

      this.$emit("atualizar", {itensPorPagina, pagina})
    },

    mostrarDetalhes(item, event) {
      if (this.trAberto === item.id) {
        this.trAberto = null
      } else {
        this.trAberto = item.id
      }
    },

    mostrarDbl(item, event) {
      this.$emit("dblclick", item)
    },

    adicionarFiltro(item, event) {
      console.log(item)
      console.log(item.includes("."))
      console.log(event)

      if (item.includes(".")) item = `$${item}$`

      let valor = event.target.value
      this.filtros = Object.assign(this.filtros, {[item]: valor})
      let pagina = 1
      this.localPagina = 1
      this.filtroAberto = null

      this.$emit("atualizar", {pagina, filtros: this.filtros})
    },

    removerFiltro(item) {
      if (item.includes(".")) item = `$${item}$`

      delete this.filtros[item]
      let pagina = 1
      this.localPagina = 1
      this.filtroAberto = null

      this.$emit("atualizar", {pagina, filtros: this.filtros})
    },
  },
}
</script>

<style scoped>
th,
td {
  border-left: 1px solid rgb(75, 85, 99);
  border-right: 1px solid rgb(75, 85, 99);
}

th {
  position: sticky;
  top: 0;
  background-color: rgb(0, 39, 94);
  z-index: 100;
  border-left: 1px solid rgb(75, 85, 99) !important;
  border-right: 1px solid rgb(75, 85, 99);
}
</style>
