<template>
	<button
		class="px-3 py-1.5 flex space-x-2 rounded-sm uppercase  items-center text-black z-50 "
		:class="{ [cor]: cor,'!bg-gray-400 cursor-default !text-gray-500 hover:!bg-gray-400': disabled, 'bg-transparent hover:!bg-gray-100 !rounded-xl !p-1 w-8' : icone }"
		@click.prevent.stop="!disabled ? $emit('clique'): ''">
		<slot></slot>
		<span v-if="texto" class="whitespace-nowrap">{{ texto }}</span>
	</button>
</template>

<script>
	export default {
		name: "BotaoPadrao",
		props: {
			texto: {
				type: String,
				default: "",
			},
			cor: {
				type: String,
				default: "bg-gray-100 hover:bg-gray-300",
			},
			disabled: {
				type: Boolean,
				default: false,
			},
      icone:{
        type: Boolean,
        default: false
      }
		},
	}
</script>

<style scoped></style>
