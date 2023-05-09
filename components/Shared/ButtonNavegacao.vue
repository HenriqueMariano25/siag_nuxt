<template>
	<NuxtLink :to="link">
		<div :class="cor" class="rounded p-2 py-6">
			<div class="flex justify-center">
				<button class="botaoNavegacao font-bold text-white grid justify-items-center w-100">
					<slot />
					{{ titulo }}
				</button>
			</div>
		</div>
	</NuxtLink>
</template>

<script>
	export default {
		name: "ButtonNavegacao",
		props: {
			titulo: {
				type: String,
				required: true,
			},
      cor:{
        type: String,
        required: true
      },
      link: {
        type: String,
        required: true
      }
		},
	}
</script>

<style scoped>
.botaoNavegacao{
  font-size: 1.8rem;
}

</style>
