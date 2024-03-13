<template>
	<div>
		<BaseDialog
			largura="w-8/12"
			titulo="CONFIRMAR TROCA"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 w-full flex flex-col gap-2">
					<h1 class="font-bold text-center text-2xl text-red-900">
						TEM CERTEZA QUE DESEJA REALIZAR A TROCA ?
					</h1>
					<div class="flex flex-col px-2 text-xl mb-1">
						<span
							>De:
							<strong :class="{ 'text-green-700': funcionarioOrigem === null }">
								{{
									funcionarioOrigem === null
										? "ESTOQUE"
										: funcionarioOrigem.chapa + " - " + funcionarioOrigem.nome
								}}
							</strong>
						</span>
						<span>
							Para:
							<strong :class="{ 'text-green-700': !funcionarioDestino.nome }">
								{{
									funcionarioDestino.nome
										? funcionarioDestino.chapa + " - " + funcionarioDestino.nome
										: "ESTOQUE"
								}}
							</strong>
						</span>
					</div>
					<div class="border border-gray-700 w-full">
						<span class="px-2 bg-slate-700 text-white text-lg py-1 w-full flex">
							LICENÇAS VINCULADAS
						</span>
						<div
							v-for="licenca of licencas"
							class="px-2 flex flex-col gap-2 bg-gray-200 border-b border-gray-600 last:border-0 text-lg">
							<div>
								<span>{{ licenca.nome }}</span>
							</div>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<BotaoPadrao
					texto="trocar"
					@clique="
						tipoTroca === 'funcionario' ? $emit('trocarFuncionario') : $emit('trocarEstoque')
					">
					<img
						src="@/assets/icons/rotate-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		components: { BotaoPadrao, AppFormInput, BaseDialog },
		props: {
			licencas: {
				type: Array,
			},
			funcionarioOrigem: {
				type: Object,
			},
			funcionarioDestino: {
				type: Object,
			},
			tipoTroca: {
				type: String,
			},
		},
		data() {
			return {
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
		},
	}
</script>

<style scoped></style>
e
