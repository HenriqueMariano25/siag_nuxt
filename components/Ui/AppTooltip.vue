<template>
	<div class="relative geral">
		<div
			:id="'tooltip-' + id"
			class="corpo flex items-center"
			:class="{ 'hover:bg-gray-200 rounded-xl p-0.5': fundo }">
			<slot name="corpo"> </slot>
		</div>
		<div
      v-if="mostrarDica"
			class="bg-gray-900/90 absolute flex p-2 rounded text-white tooltip direito"
			:class="{ [largura]: largura, [posicao]: posicao, [alinhamento]: alinhamento, [`!top-[${altura}px]`]: altura }"
			style="z-index: 105"
      :style=" alinhamento === 'direita' ? 'margin-left: ' + widthCorpo + 'px' : ''"
			>
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
      altura: {
        type: [Number],
        default: null
      },
      mostrarDica: {
        type: Boolean,
        default: true
      }
		},
		data() {
			return {
				widthCorpo: null,
        color: "red",
        alturaLocal: null
			}
		},
		mounted() {
      let tooltip = document.getElementById("tooltip-" + this.id)
      this.widthCorpo = tooltip.offsetWidth

      if(this.altura) {
       this.alturaLocal = `${this.altura}px`
      }

		},
	}
</script>

<style scoped>
	.geral {
	}

	.tooltip {
		visibility: hidden;
    top: v-bind(alturaLocal) ;
	}

	.geral:hover .tooltip {
		visibility: visible;
	}

</style>
