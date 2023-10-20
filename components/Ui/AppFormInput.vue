<template>
	<div class="flex flex-col text-gray-800 relative">
		<div class="flex w-full justify-between relative">
			<label
				:for="'inputPersonalizado' + id"
				class="ml-1.5 text-xs font-medium flex"
				>{{ label }}
				<span
					v-if="obrigatorio"
					class="text-red-700"
					>*</span
				>
				<span
					v-if="disabled"
					class="text-red-600"
					>{{ textoDesabilitado }}</span
				>
			</label>
			<div class=" w-full flex justify-end">
				<span
					class="mr-1.5 text-xs"
					v-if="value && totalCaracteres"
					:class="{ 'text-red-600 font-bold': value.length >= totalCaracteres }"
					>{{ value.length }}/{{ totalCaracteres }}</span
				>
			</div>
		</div>
		<div class="w-full flex items-center">
			<input
				v-maska
				:data-maska="mask"
				:id="'inputPersonalizado' + id"
				:name="'inputPersonalizado' + id"
				:placeholder="placeholder"
				:type="type"
				:value="value"
				:min="min"
				:max="max"
				v-on="inputListeners"
				:required="obrigatorio"
				:class="{
					'pr-10': limparCampo,
					'bg-red-100 border-red-400 focus:ring-red-300': invalido,
					'bg-white border-gray-400 focus:ring-gray-300': !invalido,
					uppercase: uppercase,
				}"
				class="h-9 w-full border rounded-sm px-2 py-1 focus:border-grey-800 focus:outline-none focus:ring disabled:bg-gray-200 read-only:bg-gray-200"
				:readonly="readonly"
				:disabled="disabled" />

			<div
				class="absolute right-1 flex"
				v-if="limparCampo">
				<button
					class="hover:bg-gray-300 p-1 rounded-full text-gray-500"
					@click="limpar()">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
		<div
			class="text-xs text-red-500 ml-2"
			v-if="invalido">
			<span
				><strong>{{ textoInvalido }}</strong></span
			>
		</div>
	</div>
</template>

<script setup></script>
<script>
	export default {
		name: "AppFormInput",
		props: {
			value: {
				type: [String, Number],
				default: undefined,
			},
			label: String,
			placeholder: String,
			type: {
				type: String,
				required: true,
			},
			limparCampo: {
				type: Boolean,
				default: false,
			},
			readonly: {
				type: Boolean,
				default: false,
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			textoDesabilitado: {
				type: String,
				default: "",
			},
			obrigatorio: {
				type: Boolean,
				default: false,
			},
			id: {
				type: String,
				required: true,
				default: "",
			},
			invalido: {
				type: Boolean,
				default: false,
			},
			textoInvalido: {
				type: String,
				default: "",
			},
			uppercase: {
				type: Boolean,
				default: false,
			},
			mask: {
				type: [String, Array, Boolean],
				default: null,
			},
			min: {
				type: Number,
			},
			max: {
				type: Number,
			},
			semEspeciais: {
				type: [Boolean],
				default: false,
			},
			totalCaracteres: {
				type: [Number],
			},
		},
		data() {
			return {
				localValue: this.value,
			}
		},
		computed: {
			inputListeners() {
				const vm = this
				return {
					...this.$listeners,
					input(event) {
						let valor

						if (vm.semEspeciais) {
							const regex = /[^\w\s]/gi
							valor = event.target.value.replace(regex, "")
						} else {
							valor = event.target.value
						}

            if(vm.totalCaracteres){
              if (valor && valor.length > vm.totalCaracteres) {
                valor = valor.substring(0, vm.totalCaracteres);
              }
            }

            event.target.value = valor
						vm.$emit("input", vm.uppercase ? valor.toUpperCase() : valor)
					},
				}
			},
		},
		methods: {
			limpar() {
				this.$emit("limpar")
			},
		},
		watch: {
			value(value) {
				if (this.semEspeciais) {
					const regex = /[^\w\s]/gi
					this.localValue = value.replace(regex, "")
				} else {
					this.localValue = value
				}
			},
		},
	}
</script>

<style scoped></style>
