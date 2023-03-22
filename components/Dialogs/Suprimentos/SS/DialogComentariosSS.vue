<template>
  <BaseDialog
    :titulo="'Comentários'"
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
              v-for="c in comentarios"
              :key="c.id">
              <div class="flex justify-between">
                <span class="flex">
								  <strong>Usuário: </strong> {{ c.Usuario ? c.Usuario.nome : "" }}
                </span>
                <span class="flex">
                   {{ $dayjs(c.createdAt).format("DD/MM/YYYY HH:mm:ss") }}
                </span>

              </div>

              <span class="flex"><strong>Ação: </strong>{{ c.acao }}</span>
              <span class="flex">
								<strong>Moveu de: </strong>{{ c.etapa_origem ? c.etapa_origem.nome : "" }}
							</span>
              <span class="flex">
								<strong>Moveu para: </strong>
								{{ c.etapa_destino ? c.etapa_destino.nome : "" }}
							</span>
              <div class="flex flex-col bg-gray-300 px-1 border border-gray-400 whitespace-pre-line">
                <span><strong>Comentário: </strong></span>
                <pre class="ml-3">{{ c.descricao }}</pre>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2 px-2" v-if="podeComentar">
          <AppFormTextarea
            id="comentario"
            label="Comentário"
            v-model="comentario"
            placeholder="Caso o solicitante ou o Suprimentos queira escrever algum comentário."/>
        </div>
      </div>
      <AppAlerta
        tipo="sucesso"
        :mostrar="mostrarAlerta"
        @escondeu="mostrarAlerta = false">
        {{ textoAlerta }}
      </AppAlerta>
    </template>
    <template v-slot:rodape-btn-direito>
      <BotaoPadrao texto="Comentar" @click="comentar()" v-if="podeComentar">
        <img
          src="@/assets/icons/add-b.svg"
          alt="btn-add"
          class="w-7 h-7"/>
      </BotaoPadrao>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue"
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
import AppAlerta from "~/components/Ui/AppAlerta.vue";

export default {
  name: "DialogComentariosSS",
  components: {
    BaseDialog,
    BotaoPadrao,
    AppFormTextarea,
    AppAlerta
  },
  props: {
    ss_id: {
      type: [String, Number],
      require: true,
    },
    podeComentar: {
      type: Boolean
    },
  },
  data() {
    return {
      comentarios: [],
      comentario: null,
      mostrarAlerta: false,
      textoAlerta: "",
      carregando: false
    }
  },
  mounted() {
    this.buscarComentarios()
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarComentarios() {
      this.carregando = true

      if (this.ss_id !== null) {
        let resp = await this.$axios.$get("/suprimentos/ss/comentarios/buscar", {
          params: {id: this.ss_id},
        })

        if(!resp.falha){
          this.comentarios = resp.dados.comentarios
          this.carregando = false
        }
      }
    },
    async comentar() {
      let usuario_id = this.$auth.user.id
      let ss_id = this.ss_id
      let comentario = this.comentario

      let resp = await this.$axios.$post('/suprimentos/ss/comentar', {comentario, usuario_id, ss_id})

      if (!resp.falha) {
        let comentarioCriado = resp.dados.comentario

        this.comentarios.unshift(comentarioCriado)
        this.comentario = null

        this.mostrarAlerta = true
        this.textoAlerta = "Comentário enviado com sucesso!"

      }
    }
  },
}
</script>

<style scoped>

</style>
