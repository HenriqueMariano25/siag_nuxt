<template>
	<div
    :ref="'meuSelectCompleto' + id"
		:id="'wrapper-' + id"
		class="wrapper relative">
		<div class="flex text-xs ml-1.5 mt-1 font-medium">
			<span :class="{ 'text-red-600': invalido }">
				{{ label }}
				<span
					v-if="obrigatorio"
					class="text-red-600 text-sm">
					<strong>*</strong>
				</span>
			</span>
			<AppTooltip
				v-if="dica"
				:posicao="dicaPosicao">
				<template v-slot:corpo>
					<img
						src="@/assets/icons/information-circle-g.svg"
						alt=""
						class="w-5 h-5"
						style="z-index: 100 !important" />
				</template>
				<template v-slot:tooltip>
					<div class="min-w-[300px] max-w-full">
						{{ dica }}
					</div>
				</template>
			</AppTooltip>
		</div>
		<div
      @click="abriOpcoes()"
			class="btn-selecionar cursor-pointer"
			:id="'btn-selecionar-' + id"
			:class="{
				'!border-red-400 !bg-red-100': invalido,
				'!bg-gray-300 !cursor-not-allowed': disabled || readonly,
			}">
			<span>{{ texto }}</span>
			<div class="icone">
				<img
					src="@/assets/icons/down-chevron-b.svg"
					alt=""
					class="w-[22px] h-[22px]" />
			</div>
		</div>
		<div
			class="conteudo shadow"
			:id="'conteudo-' + id">
			<div class="sub-conteudo">
				<div class="busca items-center">
					<img
						src="@/assets/icons/magnifier-g.svg"
						alt=""
						class="w-6 h-6 busca-icone" />
					<input
						type="text"
						placeholder="Busque aqui"
						class="busca-input"
						:value="busca"
						@input="busca = $event.target.value" />
          <AppTooltip v-if="btnCadastrar">
            <template v-slot:corpo>
              <div class="flex items-end">
                <BotaoPadrao
                  @clique="$emit('cadastrar')"
                  cor="bg-blue-400 hover:!bg-blue-500 ml-1.5"
                  class="!p-1">
                  <img
                    src="@/assets/icons/add-b.svg"
                    alt=""
                    class="w-6 h-6" />
                </BotaoPadrao>
              </div>
            </template>
            <template v-slot:tooltip>
              <div class="text-sm whitespace-nowrap">
                <span><strong>{{ tooltipAdd }}</strong></span>
              </div>
            </template>
          </AppTooltip>

				</div>
				<div class="">
					<ul
						class="lista z-20 "
						:style="{ maxHeight: altura }">
						<li
							v-for="op of opcoesFiltradas"
							@click="selecionarOpcao(op, $event)"
							:key="op.key ? op.key : op.id">
              <div class="flex justify-between gap-0.5 items-center">
							<span class="px-1">
                {{ op.nome }}
              </span>
                <div class="flex pl-1 gap-0.5" v-if="itemPrDeletar === op.id">
                  <BotaoPadrao icone class="rounded pr-0" cor="!bg-red-500 hover:!bg-red-600" @clique="deletarItem(op.id)">
                    <img src="@/assets/icons/delete-b.svg" alt="" class="w-5 h-5">
                  </BotaoPadrao>
                  <BotaoPadrao icone cor="!bg-gray-200 hover:!bg-gray-300" @clique="itemPrDeletar = null">
                    <img src="@/assets/icons/close-b.svg" alt="" class="w-5 h-5">
                  </BotaoPadrao>

                </div>
                <div v-if="btnCadastrar && itemPrDeletar !== op.id" class="pl-1">
                  <BotaoPadrao icone @clique="itemPrDeletar=op.id" >
                    <img src="@/assets/icons/delete-b.svg" alt="" class="w-5 h-5">
                  </BotaoPadrao>
                </div>

              </div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { defineComponent } from "vue"
	import AppTooltip from "~/components/Ui/AppTooltip.vue"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

	export default defineComponent({
		name: "AppFormSelectCompleto",
		components: { BotaoPadrao, AppTooltip },
		props: {
			label: String,
			value: {
				type: [String, Number, Object, Boolean],
				default: undefined,
			},
			options: {
				type: Array,
				default: () => [],
			},
			invalido: {
				type: Boolean,
				default: false,
			},
			id: {
				type: [String, Number],
				required: true,
			},
			retornarObjeto: {
				type: Boolean,
				default: false,
			},
			obrigatorio: {
				type: Boolean,
				default: false,
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			readonly: {
				type: Boolean,
				default: false,
			},
			dica: {
				type: String,
				default: "",
			},
			dicaPosicao: {
				type: String,
				default: "left-0",
			},
			altura: {
				type: String,
				default: "170px",
			},
      tooltipAdd: {
				type: String,
				default: "Cadastrar",
			},
      btnCadastrar: {
        type: Boolean,
        default: false
      }
		},
		data() {
			return {
				busca: "",
				texto: "Selecione",
        itemPrDeletar: null,
				// altura: "200px",
			}
		},
		computed: {
			opcoesFiltradas() {
				let busca = this.busca
				if (this.options.length > 0) {
					if (busca === null || busca === "") {
						return this.options
					} else {
						return this.options.filter((item) =>
							item.nome.toLowerCase().includes(busca.toLowerCase()),
						)
					}
				}
			},
			model: {
				get() {
					return this.value
				},
				set(value) {
					this.$emit("input", value)
				},
			},
		},
    mounted() {
      let valor = this.value
      if (valor && valor !== "") {
        let op = this.options.find((o) => o.id === valor)
        if (op) {
          this.texto = op.nome
        }
      } else {
        this.texto = "Selecione"
      }
      document.addEventListener("click", this.verificarCliqueFora)
    },
    destroyed() {
      document.removeEventListener("click", this.verificarCliqueFora)
    },
    methods: {
      verificarCliqueFora(event) {
        let nome = "meuSelectCompleto" + this.id
        const componente = this.$refs[nome]
        this.clicouDentro = componente.contains(event.target)

        if (!this.clicouDentro) {
          const wrapper = document.getElementById("wrapper-" + this.id)
          if (wrapper.classList.contains("active")) {
            wrapper.classList.toggle("active")
          }
        }
      },
      abriOpcoes(){
        if (!this.disabled && !this.readonly) {
          const wrapper = document.getElementById("wrapper-" + this.id)
          const conteudo = document.getElementById("conteudo-" + this.id)
          // const selectCompleto = document.getElementById("btn-selecionar-" + this.id)

          wrapper.classList.toggle("active")

          let posicaoY = conteudo.getBoundingClientRect().top
          let altura = conteudo.getBoundingClientRect().height
          let foraDaPagina = posicaoY + altura >= window.innerHeight

          if (foraDaPagina) {
            conteudo.classList.add("reverso")
          }
        }
      },

			selecionarOpcao(opcao, event) {
				this.$emit("input", opcao.id)
				this.texto = opcao.nome

				const wrapper = document.getElementById("wrapper-" + this.id)
				wrapper.classList.toggle("active")
				event.stopPropagation() // Evita que o evento de clique seja propagado para o elemento pai
			},

      deletarItem(id){
        this.$emit("deletar", { id })
        this.itemPrDeletar = null
      }
		},
		watch: {
			options(valor) {
				if (valor && valor.length > 0) {
					if (this.value !== null && this.value !== "") {
						let op = valor.find((o) => o.id === this.value)
						if (op) {
							this.texto = op.nome
						}
					} else {
						this.texto = "Selecione"
					}
				}
			},
			value(valor) {
				if (valor && valor !== "") {
					let op = this.options.find((o) => o.id === valor)
					if (op) {
						this.texto = op.nome
					}
				} else {
					this.texto = "Selecione"
				}
			},
		},
	})
</script>

<style>
	.wrapper {
		margin-top: -7px;
	}

	.wrapper.active .btn-selecionar .icone {
		transform: rotate(-180deg);
		transition: 0.1s;
	}

	.icone {
		transition: 0.1s;
	}

	.wrapper.active .conteudo {
		display: block;
	}

	.btn-selecionar {
		display: flex;
		padding: 6px 10px 6px 10px;
		border: 1px solid rgb(170, 170, 170);
		justify-content: space-between;
		background-color: #fff;
	}

	.busca {
		position: relative;
		width: 100%;
		display: flex;
	}

	.busca-input {
		padding: 5px 5px 5px 33px;
		width: 100%;
		border: 1px solid rgb(130, 130, 130);
	}

	.busca-icone {
		position: absolute;
		transform: translateY(-50%);
		top: 50%;
		left: 5px;
	}

	.conteudo {
		display: none;
		padding: 3px;
		border: 1px solid rgb(170, 170, 170);
		background-color: #fff;
		position: absolute;
		z-index: 90;
		width: 100%;
		margin-top: -1px;
	}

	.conteudo .lista {
		max-height: 170px;
		overflow-y: auto;
	}

	.lista li {
		padding-left: 2px;
		cursor: pointer;
	}

	.lista li:hover {
		background-color: #88caff;
	}

	.lista::-webkit-scrollbar {
		width: 10px;
	}

	.lista::-webkit-scrollbar-track {
		background-color: #c8c8c8;
		border-radius: 25px;
	}

	.lista::-webkit-scrollbar-thumb {
		background-color: #50aef4;
		border-radius: 25px;
	}

	.reverso {
		bottom: 37px;
		border: 1px solid rgb(170, 170, 170);
	}

	.reverso .sub-conteudo {
		display: flex;
		flex-direction: column-reverse !important;
	}
</style>
