<template>
	<div>
		<BaseDialog
			titulo="Importar arquivo"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="flex flex-col gap-2 px-2">
					<div class=" flex justify-between h-full">
						<div class="flex gap-2">
							<AppFormFile
								label="Selecione o arquivo"
								id="arquivo"
								@change="arquivo = $event" />
							<div class="flex self-end">
								<BotaoPadrao
									texto="importar"
									cor="bg-primaria-100 hover:bg-primaria-200"
									@clique="importarEfetivo()"
									:disabled="!arquivo">
									<img
										src="@/assets/icons/upload-b.svg"
										alt=""
										class="w-7 h-7" />
								</BotaoPadrao>
							</div>
						</div>
						<div
							class="flex items-center h-full"
							v-if="configuracao">
							<span>
								Última importação:
								<strong>
									{{ $dayjs(configuracao.data_importacao_bloq_he).format("DD/MM/YYYY HH:mm:ss") }} -
									{{ configuracao.importado_por ? configuracao.importado_por.nome : "" }}
								</strong>
							</span>
						</div>
					</div>
          <div class="text-center flex gap-2 w-full justify-center items-center bg-red-100 border border-red-200">
             <img src="@/assets/icons/alert-triangle-r.svg" alt="" class="w-7 h-7">
            <span class="font-bold">IMPORTANTE: TENHA CERTEZA QUE A PRIMEIRA COLUNA DO EXCEL SÃO AS MATRÍCULAS DOS FUNCIONÁRIOS A SEREM BLOQUEADOS.</span>
          </div>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormFile from "~/components/Ui/Form/AppFormFile.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		components: { BotaoPadrao, AppFormFile, BaseDialog },
		data() {
			return {
				arquivo: null,
				configuracao: null,
			}
		},
		mounted() {
			this.buscarConfiguracaoHe()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarConfiguracaoHe() {
				let resp = await this.$axios.$get("/hora_extra/configuracao/buscar_bloqueio_falta_atestado")

				if (!resp.falha) {
					this.configuracao = resp.dados.configuracao
				}
			},
			async importarEfetivo() {
				let arquivo = this.arquivo
				let formData = new FormData()
				let usuario_id = this.$auth.user.id

				let rawData = {
					usuario_id: usuario_id,
				}

				rawData = JSON.stringify(rawData)
				formData.append("data", rawData)

				formData.append("file", arquivo)
				let resp = await this.$axios.$post("/hora_extra/bloquear_falta_atestado", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				if (!resp.falha) {
					this.$emit("importado")
				}
			},
		},
	}
</script>

<style scoped></style>
