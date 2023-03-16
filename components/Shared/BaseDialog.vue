<template>
	<div
		class="w-full h-full absolute top-0 left-0 bg-black/30 justify-center items-center flex print:bg-black/0"
		style="z-index: 100">
		<div
			class="bg-white w-3/4 flex flex-col rounded print:w-full"
			style="z-index: 101">
			<div
				class="rounded-t bg-primaria-700 text-white px-2 py-1 flex items-center justify-between print:hidden">
				<span class="text-3xl">{{ titulo }}</span>
				<button
					class="text-white fill-white"
					@click="$emit('cancelar')">
					<img
						src="@/assets/icons/close-w.svg"
						alt="close"
						class="w-7 h-7" />
				</button>
			</div>
			<div class=" flex w-full print:py-0 relative">
        <div class="absolute z-50 bg-gray-700/70 flex w-full h-full justify-center" v-if="carregando">
          <div class="flex items-center justify-center">
            <span class="flex text-4xl bg-white p-2 rounded">Carregando... Favor aguarde!</span>
          </div>
        </div>
        <div class="py-2 w-full">
				  <slot name="corpo"></slot>
        </div>
			</div>
			<div
				class="rounded-b bg-primaria-700 text-white px-2 py-1 flex items-center justify-between print:hidden">
				<slot name="rodape">
					<BotaoCancelar @click="$emit('cancelar')" />
					<slot name="rodape-btn-direito"></slot>
				</slot>
			</div>
		</div>
	</div>
</template>

<script>
	import BotaoCancelar from "~/components/Ui/Buttons/BotaoCancelar.vue"
	import BotaoSalvar from "~/components/Ui/Buttons/BotaoSalvar.vue"
	export default {
		name: "BaseDialog",
		props: {
			titulo: {
				type: String,
				required: true,
				default: "",
			},
      carregando:{
        type: Boolean,
        default: false
      }
		},
		components: {
			BotaoCancelar,
			BotaoSalvar,
		},
	}
</script>

<style scoped></style>
