<template>
	<button
		class="px-3 py-2 flex space-x-2 rounded-sm uppercase hover:bg-gray-400"
		:class="{ [cor]: cor, '!bg-gray-400 cursor-default text-gray-500': disabled }"
		@click.stop.prevent="!disabled ? $emit('click'): ''">
		<slot></slot>
		<span>{{ texto }}</span>
	</button>
</template>

<script>
	export default {
		name: "BotaoPadrao",
		props: {
			texto: {
				type: String,
				required: true,
				default: "",
			},
			cor: {
				type: String,
				default: "bg-gray-100",
			},
			disabled: {
				type: Boolean,
				default: false,
			},
		},
	}
</script>

<style scoped></style>
