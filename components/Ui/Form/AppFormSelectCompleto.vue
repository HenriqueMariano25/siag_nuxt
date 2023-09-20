<template>
	<div
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
			class="conteudo"
			:id="'conteudo-' + id">
			<div class="sub-conteudo">
				<div class="busca">
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
				</div>
				<div>
					<ul
						class="lista z-20"
						:style="{ maxHeight: altura }">
						<li
							v-for="op of opcoesFiltradas"
							@click="selecionarOpcao(op, $event)"
							:key="op.key ? op.key : op.id">
							{{ op.nome }}
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

	export default defineComponent({
		name: "AppFormSelectCompleto",
		components: { AppTooltip },
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
				defaut: "170px",
			},
		},
		data() {
			return {
				busca: "",
				texto: "Selecione",
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
		methods: {
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
