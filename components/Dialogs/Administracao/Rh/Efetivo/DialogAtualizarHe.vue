<template>
  <div>
    <BaseDialog
			largura="w-8/12"
			titulo="Atualizar He"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="flex flex-col w-full gap-1 px-2">
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
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";

export default {
  name: "DialogAtualizarHe",
  components: {
    BaseDialog
  },
  data() {
    return {
      arquivo: null
    };
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
  }
};
</script>

<style scoped>

</style>
<script setup>
import AppFormFile from "~/components/Ui/Form/AppFormFile.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
</script>
