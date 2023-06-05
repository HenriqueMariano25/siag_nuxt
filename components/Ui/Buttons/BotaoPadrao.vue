<template>
	<button
		class="px-3 py-2 flex space-x-2 rounded-sm uppercase  items-center text-black z-50"
		:class="{ [cor]: cor,'!bg-gray-400 cursor-default !text-gray-500 hover:!bg-gray-400': disabled, 'bg-transparent hover:!bg-gray-100 !rounded-full': icone }"
		@click.stop.prevent="!disabled ? $emit('click'): ''">
		<slot></slot>
		<span v-if="texto">{{ texto }}</span>
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
