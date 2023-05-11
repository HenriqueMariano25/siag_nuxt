<template>
	<div
    @click="$emit('click')"
		class="whitespace-nowrap px-1 rounded flex"
		:class="{ [cor]: cor, [fonte]: fonte, 'cursor-pointer': clicavel }">
		<span>{{ texto }}</span>
	</div>
</template>

<script>
	export default {
		name: "AppTag",
		props: {
			texto: {
				type: String,
			},
			cor: {
				type: String,
				default: "bg-emerald-400 hover:bg-emerald-500",
			},
			fonte: {
				type: String,
				default: "text-xl",
			},
			clicavel: {
				type: Boolean,
				default: false,
			},
		},
	}
</script>

<style scoped></style>
