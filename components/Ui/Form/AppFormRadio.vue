<template>
	<div class="ml-2 w-full">
		<div class="flex">
			<span :class="{ 'text-red-600': invalido }">
				<strong class="!text-sm">
					{{ titulo
					}}<span
						v-if="obrigatorio"
						class="text-red-600 text-sm"
						>*</span
					>
				</strong>
			</span>
      <AppTooltip v-if="dica" :posicao="dicaPosicao">
        <template v-slot:corpo>
          <img src="@/assets/icons/information-circle-g.svg" alt="" class="w-6 h-6 !z-10" style="z-index: 100 !important;">
        </template>
        <template v-slot:tooltip>
          <div class="min-w-[300px] max-w-full">
            {{ dica }}
          </div>
        </template>
      </AppTooltip>
		</div>
		<div

			v-if="itens.length > 0 && !simNao"

      :class="{'flex gap-2': linha}"
    >
      <div class="" v-for="item in itens">
        <label
          class="flex flex-row items-center gap-1"
          :for="id ? 'inputRadio' + id + item.valor : 'inputRadio' + item.valor">
          <input
            :class="{'input-invalido':invalido}"
            class="cursor-pointer mr-2"
            type="radio"
            :id="id ? 'inputRadio' + id + item.valor : 'inputRadio' + item.valor"
            :value="item.valor"
            v-model="model"
            :disabled="item.disabled || disabled"
            @click.stop />
          {{ item.label }}
        </label>
      </div>
		</div>
		<div v-if="simNao">
			<div>
				<label
					class="flex flex-row items-center gap-1"
					:for="'radio-sim' + id">
					<input
						class="cursor-pointer mr-2"
						type="radio"
						:id="'radio-sim' + id"
						:value="true"
            :disabled="disabled"
						v-model="model"
						@click.stop />
					<span
						:class="{
							'text-red-500 font-bold': invalido,
						}">
						Sim
					</span>
				</label>
			</div>
			<div>
				<label
					class="flex flex-row items-center gap-1"
					:for="'radio-nao' + id">
					<input
						class="cursor-pointer mr-2"
						type="radio"
            :disabled="disabled"
						:id="'radio-nao' + id"
						:value="false"
						v-model="model"
						@click.stop />
					<span
						:class="{
							'text-red-500 font-bold': invalido,
						}">
						Não
					</span>
				</label>
			</div>
		</div>
	</div>
</template>

<script>
	import AppTooltip from "~/components/Ui/AppTooltip.vue";

  export default {
		name: "AppFormRadio",
    components: {AppTooltip},
		props: {
			itens: {
				type: Array,
				default: () => [],
			},
			titulo: {
				type: String,
			},
			value: {
				type: [String, Number, Boolean],
			},
			obrigatorio: {
				type: Boolean,
				default: false,
			},
			simNao: {
				type: Boolean,
				default: false,
			},
			id: {
				type: String,
				default: "",
				required: true,
			},
			invalido: {
				type: Boolean,
				default: false,
			},
			disabled: {
				type: Boolean,
				default: false,
			},
      dica:{
        type: String,
        default: null
      },
      dicaPosicao: {
        type: String,
        default: 'left-0'
      },
      linha:{
        type: Boolean,
        default: false,
      }
		},
		computed: {
			model: {
				get() {
					return this.value
				},
				set(value) {
					this.$emit("input", value)
				},
			},
		},
		data() {
			return {
				localValor: this.value,
			}
		},
		watch: {
			localValor(val) {
				this.localValue = val
				this.$emit("change", val)
			},
			value(val) {
				this.localValue = val
				this.$emit("change", val)
			},
		},
	}
</script>

<style scoped>
	input[type="radio"] {
		-webkit-appearance: none;
		appearance: none;
		background-color: #fff;
		margin: 0;
	}

	input[type="radio"] {
		appearance: none;
		background-color: #fff;
		margin: 0;
		font: inherit;
		color: currentColor;
		width: 1.35em;
		height: 1.35em;
		border: 0.15em solid currentColor;
		border-radius: 100%;
		transform: translateY(-0.075em);
		display: grid;
		place-content: center;
	}

  .input-invalido {
    border: 0.15em solid #c50000 !important;
  }

	input[type="radio"]::before {
		content: "";
		width: 0.8em;
		height: 0.8em;
		transform: scale(0);
		border-radius: 100%;
		transition: 120ms transform ease-in-out;
		box-shadow: inset 1em 1em #09234f;
		transform-origin: bottom left;
	}

	input[type="radio"]:checked::before {
		transform: scale(1);
	}

	input[type="radio"]:focus {
		outline: max(2px, 0.15em) solid currentColor;
		outline-offset: max(2px, 0.15em);
	}

	input[type="radio"]:hover {
		background-color: rgb(200, 200, 200);
	}

	input[type="radio"]:disabled {
		--form-control-color: #545458;
		color: #b3b3bc;
		cursor: not-allowed;
	}
</style>
