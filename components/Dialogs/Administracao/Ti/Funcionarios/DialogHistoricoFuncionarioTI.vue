<template>
  <div>
    <BaseDialog
      largura="w-10/12"
      titulo="HISTÓRICO"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="flex flex-col gap-2 w-full px-2">
          <div
            class="flex flex-col w-full gap-2 overflow-y-auto"
            style="max-height: calc(100vh - 300px)">
            <div
              v-for="historico of historicos"
              :key="historico.id"
              class="p-2 bg-slate-200 border border-slate-400 shadow rounded flex w-full flex-col">
              <div class="flex justify-between font-bold text-sm text-slate-700">
                <span>{{ $dayjs(historico.createdAt).format("DD/MM/YYYY HH:mm:ss") }}</span>
                <span>{{ historico.Usuario ? historico.Usuario.nome : "" }}</span>
              </div>
              <span class="mt-2 uppercase">
								<strong>AÇÃO: </strong>{{ historico.AcaoHistoricoFuncionarioTI.nome }}
							</span>
              <span
                class="uppercase"
                v-if="historico.comentario">
								<strong>COMENTÁRIO: </strong>{{ historico.comentario }}
							</span>
              <div
                class=""
                v-if="historico.descricao">
                <span class=""><strong>DESCRIÇÃO: </strong></span>
                <pre class="text-md">{{ historico.descricao }}</pre>
              </div>
            </div>
          </div>
          <div>
            <AppFormTextarea
              id="comentario"
              :total-caracteres="2000"
              label="Comentário"
              placeholder="Comentário opcional"
              v-model="comentario"
              class="" />
          </div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao
          texto="comentar"
          :disabled="!podeComentar"
          @clique="comentar">
          <img
            src="@/assets/icons/comentarios-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
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
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
import AppAlerta from "~/components/Ui/AppAlerta.vue"

export default {
  name: "DialogHistoricoTI",
  components: { AppAlerta, BotaoPadrao, AppFormTextarea, BaseDialog },
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      historicos: [],
      comentario: null,
      mostrarAlerta: false,
      textoAlerta: null,
    }
  },
  computed: {
    podeComentar() {
      return this.comentario !== null && this.comentario.trim() !== ""
    },
  },
  async mounted() {
    await this.buscarHistorico()
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarHistorico() {
      let id = this.id
      let modulo = this.modulo

      let resp = await this.$axios.$get("/ti/historico/funcionario/buscar", { params: { id } })
      if (!resp.falha) {
        let { historicos } = resp.dados
        this.historicos = historicos
      }
    },
    async comentar() {
      let id = this.id
      let modulo = this.modulo
      let usuario_id = this.$auth.user.id
      let comentario = this.comentario

      let resp = await this.$axios.$post("/ti/historico/ativo/comentar", {
        id,
        modulo,
        usuario_id,
        comentario,
      })
      if (!resp.falha) {
        let { historico } = resp.dados
        this.historicos.unshift(historico)
        this.textoAlerta = "Comentário adicionado com sucesso!"
        this.mostrarAlerta = true
        this.comentario = null
      }
    },
  },
}
</script>

<style scoped></style>
