<template>
	<NuxtLink :to="link">
		<div
			:class="{ [cor]: cor }"
			class="rounded p-2 shadow h-[125px] botaoNavegacao"
			:id="'botaoNavegacao-' + titulo">
			<div class="flex justify-center items-center h-full">
				<button
					id="botao"
					class="botao font-bold text-white grid justify-items-center w-100 items-center"
					:class="{ textoPequeno: textoPequeno }">
					<slot />
					{{ titulo }}
				</button>
				<div class="detalhes hidden text-white px-2">
					<span>{{ detalhes}}</span>
				</div>
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
			cor: {
				type: String,
				required: true,
			},
			link: {
				type: String,
				required: true,
			},
			textoPequeno: {
				type: Boolean,
				default: false,
			},
			detalhes: {
				type: String,
				default: null,
			},
		},
		mounted() {
			if (this.detalhes !== null) {
				let componente = document.getElementById("botaoNavegacao-" + this.titulo)
				let botao = componente.getElementsByClassName("botao")[0]
				let detalhes = componente.getElementsByClassName("detalhes")[0]
        let timeout;

				componente.addEventListener("mouseenter", function () {
          timeout = setTimeout(() => {
            botao.classList.add("hidden")
            detalhes.classList.remove("hidden")
          }, 1200);
				})

				componente.addEventListener("mouseleave", function () {
					botao.classList.remove("hidden")
					detalhes.classList.add("hidden")
          clearTimeout(timeout);
				})
			}
		},
	}
</script>

<style scoped>
.botaoNavegacao:hover{
  scale: 1.03;
  transition-duration: 0.3s;
}
	.botao {
		font-size: 1.8rem;
	}
	.textoPequeno {
		font-size: 1.3rem;
	}
</style>
