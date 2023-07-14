<template>
	<div class="relative">
		<span
      v-if="texto !== null"
			:class="{ [cor]: cor, [corFonte]: corFonte }"
			class="badge flex items-end rounded-full p-1"
			>{{ texto }}
    </span>
		<slot> </slot>
	</div>
</template>

<script>
	export default {
		props: {
			cor: {
				type: String,
			},
			corFonte: {
				type: String,
			},
			texto: {
				type: [String,Number]
			},
		},
	}
</script>

<style scoped>
	.badge {
    min-width: 28px;
		position: absolute;
		top: -20px;
		right: -10px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		padding: 1px;
		border: 3px solid #f4fdff;
		border-radius: 500px;
		font-size: 12px;
		font-weight: 600;
		text-align: center;
		z-index: 1;
		transition: transform 0.15s;
	}
</style>
