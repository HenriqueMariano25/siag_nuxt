<template>
	<div>
		<BaseDialog
			titulo="Importar disciplina"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 grid grid-cols-1 gap-2 divide-y divide-gray-400">
					<div class="flex gap-2">
						<AppFormFile
							label="Selecione o arquivo"
							id="arquivo"
							@change="arquivo = $event" />
						<div class="flex self-end">
							<BotaoPadrao
								texto="importar"
								cor="bg-primaria-100 hover:!bg-primaria-200"
								@click="importarDisciplina()"
								:disabled="!arquivo">
								<img
									src="@/assets/icons/upload-b.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
					</div>
					<div
						class="flex flex-col gap-2 py-2"
						v-if="importou">
						<div class="flex gap-2">
							<AppBadge
								cor="!bg-red-400"
								corFonte="bg-white"
								:texto="erros.length">
								<AppTag
									@click="dados = erros"
									cor="bg-blue-300 hover:bg-blue-400"
									texto="Erros"
									fonte="text-2xl"
									:clicavel="true" />
							</AppBadge>
							<AppBadge
								cor="!bg-red-400"
								corFonte="bg-white"
								:texto="jaCadastrados.length">
								<AppTag
									@click="dados = jaCadastrados"
									cor="bg-blue-300 hover:bg-blue-400"
									texto="Já cadastrados"
									fonte="text-2xl"
									:clicavel="true" />
							</AppBadge>
							<AppBadge
								cor="!bg-red-400"
								corFonte="bg-white"
								:texto="criados.length">
								<AppTag
									@click="dados = criados"
									cor="bg-blue-300 hover:bg-blue-400"
									texto="Novos"
									fonte="text-2xl"
									:clicavel="true" />
							</AppBadge>
						</div>
            <div class="flex flex-col w-full hx-[300px] overflow-y-auto border border-gray-600">
              <div
                v-for="(d, index) of dados"
                :key="index"
                class="even:bg-gray-300 px-2">
                <span>{{ d.Sigla }} - {{ d.Nome }}</span>
              </div>
            </div>

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
	import AppTag from "~/components/Ui/AppTag.vue"
	import AppBadge from "~/components/Ui/AppBadge.vue"

	export default {
		components: { AppBadge, AppTag, BotaoPadrao, AppFormFile, BaseDialog },
		data() {
			return {
				arquivo: null,
				erros: [],
				jaCadastrados: [],
				criados: [],
				dados: [],
				importou: false,
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async importarDisciplina() {
				let arquivo = this.arquivo
				let formData = new FormData()
				formData.append("file", arquivo)
				let resp = await this.$axios.$post("/planejamento/disciplina/importar", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				if (!resp.falha) {
					let { erros, jaCadastrados, criados } = resp.dados

					this.importou = true
					this.erros = erros
					this.jaCadastrados = jaCadastrados
					this.criados = criados
				}
			},
		},
	}
</script>

<style scoped></style>
