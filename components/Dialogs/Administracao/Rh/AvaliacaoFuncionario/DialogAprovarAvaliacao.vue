<template>
  <BaseDialog
    titulo="APROVAR AVALIAÇÕES"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="grid w-full">
        <div class="flex w-full">
          <table class="flex-col w-full">
            <thead class="bg-red-500">
            <tr class="uppercase px-2 py-1 text-sm text-white relative">
              <th>Cód.</th>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>Cargo</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="avaliacao in aprovacoes" :key="avaliacao.id"
                class="bg-white cursor-pointer even:bg-neutral-200 hover:bg-gray-600 hover:text-white">
              <td class="text-center px-1 py-0.5 border border-collapse border-gray-600">{{ ("000000" + avaliacao.id).slice(-6)}}</td>
              <td class=" px-1 py-0.5 border border-collapse border-gray-600">{{ avaliacao.Funcionario ? avaliacao.Funcionario.nome : "" }}</td>
              <td class=" px-1 py-0.5 border border-collapse border-gray-600">
                {{ avaliacao.Funcionario ? avaliacao.Funcionario.chapa : "" }}
              </td>
              <td class=" px-1 py-0.5 border border-collapse border-gray-600">
                {{ avaliacao.Funcionario ? avaliacao.Funcionario.cargo : "" }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-2 px-2">
          <AppFormTextarea id="comentario" label="Comentário" placeholder="Comentário opcional" v-model="comentario" />
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center gap-5 text-black">
        <BotaoPadrao
          texto="Aprovar"
          cor="bg-green-500"
          @clique="aprovar()">
          <template v-slot>
            <img src="@/assets/icons/check-b.svg" alt="close" class="w-7 h-7" />
          </template>
        </BotaoPadrao>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";

export default {
  name: "DialogAprovarAvaliacao",
  components: {
    BaseDialog,
    BotaoPadrao,
    AppFormTextarea
  },
  props: {
    aprovacoes: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      comentario: null
    }
  },
  computed: {
    bloquearBtnNegar() {
      return this.comentario === null || this.comentario === ""
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    async aprovar() {
      // let SSs = this.sss.map(ss => (ss.id))
      let avaliacoes = this.aprovacoes.map(o => o.id)
      let usuario_id = this.$auth.user.id
      let comentario = this.comentario

      let resp = await this.$axios.$post("/avaliacao_funcionario/aprovar", { avaliacoes, usuario_id, comentario})

      if(!resp.falha){
          this.$emit("aprovado", { avaliacoes })
      }
    },
  }
}
</script>

<style scoped>
th,
td {
  border-left: 1px solid rgb(75, 85, 99);
  border-right: 1px solid rgb(75, 85, 99);
}

th {
  position: sticky;
  top: 0;
  background-color: rgb(0, 53, 127);
  z-index: 100;
  border-left: 1px solid rgb(75, 85, 99) !important;
  border-right: 1px solid rgb(75, 85, 99);
}
</style>
