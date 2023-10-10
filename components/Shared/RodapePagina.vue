<template>
	<div
		class="absolute h-14 bg-primaria-700 bottom-0 w-full -ml-2 pl-2 pr-2 flex items-center print:hidden"
		style="max-width: 100vw">
		<div class="relative flex w-full">
			<slot />
			<div
				class="absolute top-0 bg-white z-50 w-full rounded-t-lg sombra detalhes"
        :class="{'aberta': mostrar}"
        :style="[cssVars]"
				v-if="detalhes">
				<div class="bg-gray-400 justify-between items-center px-1 rounded-t-lg visivel" :class="{'visivel-aberta ': mostrar}" v-if="mostrarLocal">
					<span class="text-lg">
						{{ tituloDetalhes }}
					</span>
					<BotaoPadrao icone @clique="$emit('fechar')">
						<img
							src="@/assets/icons/close-b.svg"
							alt=""
							class="w-6 h-6" />
					</BotaoPadrao>
				</div>
				<div class="visivel" :class="{'visivel-aberta': mostrar}" v-if="mostrarLocal">
					<slot name="detalhes"> </slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		name: "RodapePagina",
		components: { BotaoPadrao },
		props: {
			detalhes: {
				type: Boolean,
				default: false,
			},
			tituloDetalhes: {
				type: String,
			},
			altura: {
				type: Number,
				default: 250,
			},
      mostrar: {
        type: Boolean,
        default: false
      },

		},
    data() {
      return {
        mostrarLocal: false
      };
    },
    computed: {
      cssVars() {
        return {
          '--altura': `${this.altura}px`,
          '--posicao': `-${this.altura + 8}px`
        }
      }
    },
    watch: {
      mostrar(valor) {
        if(valor === true){
          setTimeout(() => {
            this.mostrarLocal = true;
          }, 270);
        }else{
          this.mostrarLocal = false
        }
      }
    }
	}
</script>

<style scoped>
	.sombra {
		box-shadow: rgba(0, 0, 0, 0.4) 0px -1px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px;
	}

  .detalhes{
    //transition: all 0.4s ;
    transition: all 0.4s ;
    height: 0;
    margin-top: -9px;
    //top: 0;
    //visibility: hidden;
  }

  .aberta{
    height: var(--altura);
    margin-top: var(--posicao);
    border: 1px solid rgb(107 114 128);
  }

  .visivel{
    transition: all 0.4s;
    display: none;
    opacity: 0;
    margin-top:-40px;
  }

  .visivel-aberta{
    opacity: 1;
    visibility: visible;
    margin-top: 0;
    display: flex;
  }
</style>
