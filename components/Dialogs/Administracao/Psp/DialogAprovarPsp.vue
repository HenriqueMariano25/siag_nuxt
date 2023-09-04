<template>
	<div>
		<BaseDialog
			:titulo="'Aprovar PSP - ' + tipoAprovacao"
			largura="w-10/12"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-1">
					<table class="w-full table">
						<thead class="bg-primaria-500 text-white">
							<tr>
								<th class="border border-gray-700">Cód.</th>
								<th class="border border-gray-700">Funcionário</th>
								<th class="border border-gray-700">Cargo</th>
								<th class="border border-gray-700">Motivo</th>
								<th class="border border-gray-700">Data de Ida</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="psp of psps"
								class="even:bg-gray-300 odd:bg-white">
								<td class="px-1 border border-gray-700">{{ ("00000" + psp.id).slice(-5) }}</td>
								<td class="px-1 border border-gray-700">
									{{ psp.Funcionario ? psp.Funcionario.nome : "" }}
								</td>
								<td class="px-1 border border-gray-700">
									{{ psp.Funcionario ? psp.Funcionario.cargo : "" }}
								</td>
								<td class="px-1 border border-gray-700">{{ psp.motivo ? psp.motivo : "" }}</td>
								<td class="px-1 border border-gray-700">
									{{ psp.data_ida ? $dayjs(psp.data_ida).format("DD/MM/YYYY") : "" }}
								</td>
							</tr>
						</tbody>
					</table>
					<div>
						<AppFormTextarea
							id="comentario"
							label="Comentario"
							v-model="comentario" />
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex gap-2">
					<div>
						<BotaoPadrao
							texto="Negar"
							cor="bg-red-400 hover:!bg-red-500"
							@clique="aprovacao(false)">
							<img
								src="@/assets/icons/close-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
					<div>
						<BotaoPadrao
							texto="Aprovar"
							cor="bg-green-400 hover:!bg-green-500"
							@clique="aprovacao(true)">
							<img
								src="@/assets/icons/check-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
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
		name: "DialogAprovarPsp",
		components: { AppFormTextarea, BotaoPadrao, BaseDialog },
		data() {
			return {
				comentario: null,
			}
		},
		props: {
			psps: {
				type: Array,
			},
			tipoAprovacao: {
				type: String,
			},
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async aprovacao(aprovacao) {
				let usuario_id = this.$auth.user.id
        let psps = this.psps.map( o => o.id )

				let resp = await this.$axios.$post("/psp/aprovacao", {
					aprovacao,
					tipoAprovacao: this.tipoAprovacao,
					comentario: this.comentario,
					usuario_id,
          psps
				})

        if(!resp.falha){
          this.$emit("aprovado", { aprovacao, psps })
        }
			},
		},
	}
</script>

<style scoped></style>
