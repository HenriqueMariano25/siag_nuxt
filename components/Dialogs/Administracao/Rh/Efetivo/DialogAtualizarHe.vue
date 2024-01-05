<template>
	<div>
		<BaseDialog
			largura="w-8/12"
			titulo="Atualizar He"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="flex flex-col w-full gap-2 px-2 relative">
          <div class="absolute bg-gray-900/80 h-full w-full z-70 text-white top-0 left-0 items-center justify-center text-4xl font-bold flex" v-if="mensagem">
            <span>{{ mensagem }}</span>
          </div>
					<div class="w-full flex flex-col gap-2">
						<span class="bg-gray-400 px-1 text-xl font-bold">1° PASSO</span>
            <span class="px-1">Atualiza efetivo e hora extra do <strong>ASM</strong></span>
						<div class="px-2">
							<BotaoPadrao
                @clique="atualizarAsm()"
								texto="atulizar ASM"
								cor="bg-blue-300 hover:bg-blue-400">
								<img
									src="@/assets/icons/rotate-b.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
					</div>
          <div class="flex flex-col gap-2 px-1 -z-10">
            <span class="bg-gray-400 px-1 text-xl font-bold">2° PASSO</span>
            <span class="px-1">Atualiza hora extra do <strong>OITCHAU</strong></span>
					<div class="flex gap-2">
						<AppFormFile
							label="Selecione o arquivo"
							id="arquivo"
							@change="arquivo = $event" />
						<div class="flex self-end">
							<BotaoPadrao
								texto="importar"
								cor="bg-primaria-100 hover:!bg-primaria-200"
								@clique="importarEfetivo()"
								:disabled="!arquivo">
								<img
									src="@/assets/icons/upload-b.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
					</div>
          </div>
				</div>
			</template>
		</BaseDialog>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"

	export default {
		name: "DialogAtualizarHe",
		components: {
			BaseDialog,
		},
		data() {
			return {
				arquivo: null,
        mostrarAlerta: false,
        textoAlerta: null,
        atualizandoAsm: false,
        mensagem: null,
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async importarEfetivo() {
				let arquivo = this.arquivo
				let formData = new FormData()
				formData.append("file", arquivo)
				let resp = await this.$axios.$post("/efetivo/atualizar_he_efetivo", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				if (!resp.falha) {
					this.$emit("atualizado")
				}
			},
      async atualizarAsm(){
        this.atualizandoAsm = true
        this.mensagem = "Atualizando o efetivo pelo ASM"
        let resp = await this.$axios.$post("/efetivo/atualizar_asm")

        if(!resp.falha){
          this.textoAlerta = "Funcionários do ASM atualizado!"
          this.mostrarAlerta = true
          this.atualizandoAsm = false
          this.mensagem = null
        }
      }
		},
	}
</script>

<style scoped></style>
<script setup>
	import AppFormFile from "~/components/Ui/Form/AppFormFile.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
  import AppAlerta from "~/components/Ui/AppAlerta.vue";
</script>
