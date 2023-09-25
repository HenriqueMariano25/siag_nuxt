<template>
	<div class="relative geral">
		<div
			:id="'tooltip-' + id"
			class="corpo flex items-center"
			:class="{ 'hover:bg-gray-200 rounded-xl p-0.5': fundo }">
			<slot name="corpo"> </slot>
		</div>
		<div
			class="bg-gray-900/90 absolute flex p-2 rounded text-white tooltip direito"
			:class="{ [largura]: largura, [posicao]: posicao, [alinhamento]: alinhamento }"
			style="z-index: 105"
			:style="alinhamento === 'direita' ? 'margin-left: ' + widthCorpo + 'px' : ''">
			<slot name="tooltip"> </slot>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			id: {
				type: [String, Number],
				default: "local",
			},
			largura: {
				type: [String],
			},
			posicao: {
				type: [String],
				default: "left-0",
			},
			fundo: {
				type: [Boolean],
				default: false,
			},
			alinhamento: {
				type: [String],
			},
		},
		data() {
			return {
				widthCorpo: null,
			}
		},
		mounted() {
			let tooltip = document.getElementById("tooltip-" + this.id)
			this.widthCorpo = tooltip.offsetWidth
		},
	}
</script>

<style scoped>
	.geral {
	}

	.tooltip {
		visibility: hidden;
	}

	.geral:hover .tooltip {
		visibility: visible;
	}

	.direita {
		top: 0;
	}
</style>
