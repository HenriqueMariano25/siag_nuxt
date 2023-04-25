<template>
  <BaseDialog
    titulo="Aprovar SSs"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="grid w-full">
        <div class="flex w-full">
          <table class="flex-col w-full">
            <thead class="bg-red-500">
            <tr class="uppercase px-2 py-1 text-sm text-white relative">
              <th>Num. Acompanhamento</th>
              <th>Natureza Operação</th>
              <th>Tipo de solicitação</th>
              <th>Elemento PEP:</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="ss in sss" :key="ss.id"
                class="bg-white cursor-pointer even:bg-neutral-200 hover:bg-gray-600 hover:text-white">
              <td class="text-center px-1 py-0.5 border border-collapse border-gray-600">{{ ss.numero_acompanhamento }}</td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">{{ ss.natureza_operacao }}</td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">
                {{ ss.tipo_solicitacao }}
              </td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">
                {{ ss.CentroCustoPEP && ss.CentroCustoPEP.descricao ? ss.CentroCustoPEP.descricao : "" }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-2 px-2">
          <AppFormTextarea id="comentario" label="Comentário" placeholder="Comentário opicional" v-model="comentario"/>
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center gap-5 text-black">
        <BotaoPadrao
          texto="Negar SS"
          cor="bg-red-500"
          @click="aprovarSSs(false)"
          :disabled="bloquearBtnNegar">
          <template v-slot>
            <img src="@/assets/icons/close-b.svg" alt="close" class="w-6 h-6"/>
          </template>
        </BotaoPadrao>
        <BotaoPadrao
          texto="Aprovar SS"
          cor="bg-green-500"
          @click="aprovarSSs(true)">
          <template v-slot>
            <img src="@/assets/icons/check-b.svg" alt="close" class="w-7 h-7"/>
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
  name: "DialogAprovarSS",
  components: {
    BaseDialog,
    BotaoPadrao,
    AppFormTextarea

  },
  props: {
    sss: {
      type: Array,
      required: true
    },
    tipoAprovacao: {
      type: String,
      required: true,
    }
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

    async aprovarSSs(aprovacao) {
      let SSs = this.sss.map(ss => (ss.id))
      let usuario_id = this.$auth.user.id
      let comentario = this.comentario

      try{
        let tipo_aprovacao = this.tipoAprovacao

        let resp = await this.$axios.$post("/suprimentos/ss/aprovar_ss", {
          SSs,
          usuario_id,
          tipo_aprovacao,
          aprovacao,
          comentario
        })

        if(!resp.falha){
          this.$emit("aprovado", SSs, aprovacao)
          this.comentario = null
        }
      }catch (e) {
        console.log(e)
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
