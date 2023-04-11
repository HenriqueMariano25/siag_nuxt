<template>
  <BaseDialog
    titulo="Processar SS"
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
              <th>Centro de Custo:</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="ss in solicitacoes" :key="ss.id"
                class="bg-white cursor-pointer even:bg-neutral-200 hover:bg-gray-600 hover:text-white">
              <td class="text-center px-1 py-0.5 border border-collapse border-gray-600">{{
                  ss.numero_acompanhamento
                }}
              </td>
              <td class="px-1 py-0.5 border border-collapse border-gray-600">
                {{ ss.natureza_operacao ? ss.natureza_operacao : "" }}
              </td>
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
        <div class="pt-2 px-2 space-y-2">
          <AppFormTextarea
            id="comentario"
            label="Comentário"
            placeholder="Comentário opicional"
            v-model="processo.comentario"
            class=""/>
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center gap-5 text-black w-full justify-between">
        <div>
          <div v-if="etapa_id >= 9 && etapa_id <= 18">
            <BotaoPadrao texto="Negar SS" cor="bg-red-400 hover:bg-red-600" class="ml-5" @click="valNegarSS = true"
                         :disabled="bloquearBtnNegar"
                         v-if="!valNegarSS">
              <img src="@/assets/icons/close-b.svg" alt="close" class="w-6 h-6"/>
            </BotaoPadrao>
            <div class="flex items-center text-white ml-5 gap-x-5" v-if="valNegarSS">
              <BotaoPadrao texto="Não" cor="bg-red-400 hover:bg-red-600" @click="valNegarSS = false"/>
              <span>Tem certeza que deseja negar essa solicitação ?</span>
              <BotaoPadrao texto="Sim" cor="bg-green-400 hover:bg-green-600" @click="negarSS()"/>
            </div>
          </div>
        </div>
        <div class="flex gap-x-2">
          <BotaoPadrao
            v-if="pularProxEtapa"
            :disabled="processo.comprador === null"
            texto="Processar p/ Cotar"
            @click="processarSS(true)">
            <template v-slot>
              <img
                src="@/assets/icons/right-down-b.svg"
                alt="close"
                class="w-6 h-6"/>
            </template>
          </BotaoPadrao>
          <BotaoPadrao
            :disabled="processo.comprador === null"
            texto="Processar SS"
            @click="processarSS(false)">
            <template v-slot>
              <img
                src="@/assets/icons/check-b.svg"
                alt="close"
                class="w-8 h-8"/>
            </template>
          </BotaoPadrao>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";

export default {
  name: "DialogProcessarMultSS",
  components: {
    BaseDialog,
    BotaoPadrao,
    AppFormTextarea,
  },
  props: {
    solicitacoes: {
      type: [String, Number, Object, Array],
    },
    pularProxEtapa: {
      type: [Boolean]
    },
    etapa_id: {
      type: [Number, String]
    }
  },
  data() {
    return {
      processo: {
        comentario: null,
      },
      valNegarSS:false
    }
  },
  computed: {
    bloquearBtnNegar() {
      return this.processo.comentario === null || this.processo.comentario === ""
    }
  },
  methods:{
    cancelar() {
      this.processo = {
        comentario: null,
      }
      this.$emit("cancelar")
    },

    async processarSS(pularEtapa) {
      let { comentario } = this.processo
      let solicitacoes = this.solicitacoes.map((ss) => {
        return ss.id
      })

      let usuario_id = this.$auth.user.id

      let resp = await this.$axios
        .$post("/suprimentos/ss/processar_mult_ss", {
          comentario,
          solicitacoes,
          usuario_id,
          pularEtapa
        })

      if (!resp.falha) {
        this.$emit("processado", solicitacoes)
      }
    },
    async negarSS() {
      let {comentario} = this.processo
      let solicitacoes = this.solicitacoes.map((ss) => {
        return ss.id
      })
      let usuario_id = this.$auth.user.id


      let resp = await this.$axios.$post('/suprimentos/ss/negar_ss', {
        comentario,
        solicitacoes,
        usuario_id
      })

      if (!resp.falha) {
        this.processo = {
          comentario: null,
          input: null
        }
        this.$emit('negado', solicitacoes)
      }

    }
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
