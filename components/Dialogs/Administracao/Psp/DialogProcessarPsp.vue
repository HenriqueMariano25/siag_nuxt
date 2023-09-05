<template>
	<div class="w-full">
		<BaseDialog
			titulo="Processar PSPs"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 gap-1 flex flex-col">
					<div class="">
						<table class="w-full table">
							<thead class="bg-primaria-900 text-white">
								<tr>
									<td class="px-1 border border-gray-800">Cód.</td>
									<td class="px-1 border border-gray-800">Funcionário</td>
									<td class="px-1 border border-gray-800">Cargo</td>
									<td class="px-1 border border-gray-800">Setor</td>
									<td class="px-1 border border-gray-800">Motivo</td>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="psp of selecionados"
									class="odd:bg-white even:bg-gray-300">
									<td class="px-1 border border-gray-800">{{ ("00000" + psp.id).slice(-5) }}</td>
									<td class="px-1 border border-gray-800">
										{{ psp.Funcionario ? psp.Funcionario.nome : "" }}
									</td>
									<td class="px-1 border border-gray-800">
										{{ psp.Funcionario ? psp.Funcionario.cargo : "" }}
									</td>
									<td class="px-1 border border-gray-800">
										{{ psp.Funcionario.setor ? psp.Funcionario.setor.nome : "" }}
									</td>
									<td class="px-1 border border-gray-800">{{ psp.motivo }}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div>
						<AppFormTextarea
							id="comentario"
							label="Comentário"
							v-model="comentario" />
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div>
					<BotaoPadrao
						texto="Processar"
						@clique="processar()">
						<img
							src="@/assets/icons/check-circle-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	export default {
		name: "DialogProcessarPsp",
		components: { AppFormTextarea, BotaoPadrao, BaseDialog },
		props: {
			selecionados: {
				type: Array,
			},
		},
		data() {
			return {
				comentario: null,
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async processar() {
				let psps = this.selecionados.map((o) => o.id)
				let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$post("/psp/processar", {
					psps,
					usuario_id,
					comentario: this.comentario,
				})


				console.log(resp)
        if(!resp.falha){
          this.$emit("processado", psps)
        }
			},
		},
	}
</script>

<style scoped></style>
