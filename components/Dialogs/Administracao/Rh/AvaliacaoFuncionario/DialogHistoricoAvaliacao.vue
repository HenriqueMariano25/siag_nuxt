<template>
  <BaseDialog
    titulo="Histórico"
    :carregando="carregando"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="flex flex-col w-full relative">
        <div class="grid w-full">
          <div
            class="flex-col w-full px-2 overflow-auto space-y-3 relative"
            style="max-height: calc(70vh)">
            <div
              class="w-full flex-col bg-blue-100 px-1 py-1 border border-blue-200 font-xl"
              v-for="hist in historicos"
              :key="hist.id">
              <div class="flex justify-between">
                <span class="flex">
								  <strong>Usuário: </strong>&nbsp {{ hist.Usuario ? hist.Usuario.nome : "" }}
                </span>
                <span class="flex">
                   {{ $dayjs(hist.createdAt).format("DD/MM/YYYY HH:mm:ss") }}
                </span>
              </div>
              <div class="flex w-full">
              <span class="flex"><strong>Ação:&nbsp</strong></span>
                <pre>{{ hist.acao }}</pre>
              </div>
              <span class="flex"><strong>Comentário:&nbsp </strong> {{ hist.comentario }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue"

export default {
  name: "DialogHistoricoAvaliacao",
  components: {
    BaseDialog,
  },
  props: {
    avaliacao_id: {
      type: [String, Number],
      require: true,
    },
  },
  data() {
    return {
      historicos: [],
      carregando: false
    }
  },
  mounted() {
    this.buscarHistorico()
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarHistorico() {
      this.carregando = true

      if (this.avaliacao_id !== null) {
        let resp = await this.$axios.$get("/avaliacao_funcionario/buscarHistorico", {
          params: { id: this.avaliacao_id },
        })

        if (!resp.falha) {
          this.historicos = resp.dados.historicos
          this.carregando = false
        }
      }
    },
  },
}
</script>

<style scoped>

</style>
