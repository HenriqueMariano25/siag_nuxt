<template>
  <BaseDialog
    :titulo="'Processar SS - ' + solicitacao.numero_acompanhamento "
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="grid w-full">
        <div class="px-2 space-y-2">
          <AppFormSelect
            class="col-span-2"
            label="Escopo do serviço"
            :options="escopos"
            v-model="processo.escoposs_id"
            id="escoposs_id"/>
          <AppFormTextarea
            type="text"
            label="Abragência do escopo"
            v-model="processo.abrangencia_escopo"
            :total-caracteres="2000"
            id="escopo_servico"/>
          <AppFormSelect
            label="Comprador"
            :options="compradores"
            v-model="processo.comprador"
            id="pep"/>
          <AppFormTextarea
            id="comentario"
            :total-caracteres="255"
            label="Comentário"
            placeholder="Comentário opcional"
            v-model="processo.comentario"
            class=""/>
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center gap-5 text-black w-full justify-between">
        <div>
          <BotaoPadrao texto="Negar SS" cor="bg-red-400 hover:bg-red-600" class="ml-5" @clique="valNegarSS = true"
                       v-if="!valNegarSS" :disabled="bloquearBtnNegar">
            <img src="@/assets/icons/close-b.svg" alt="close" class="w-6 h-6"/>
          </BotaoPadrao>
          <div class="flex items-center text-white ml-5 gap-x-5" v-if="valNegarSS">
            <BotaoPadrao texto="Não" cor="bg-red-400 hover:bg-red-600" @clique="valNegarSS = false"/>
            <span>Tem certeza que deseja negar essa solicitação ?</span>
            <BotaoPadrao texto="Sim" cor="bg-green-400 hover:bg-green-600" @clique="negarSS()"/>
          </div>
        </div>
        <BotaoPadrao
          :disabled="processo.comprador === null"
          texto="Processar SS"
          @clique="processarSS()">
          <template v-slot>
            <img
              src="@/assets/icons/check-b.svg"
              alt="close"
              class="w-7 h-7"/>
          </template>
        </BotaoPadrao>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue"
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
import AppFormInput from "~/components/Ui/AppFormInput.vue";
export default {
  name: "DialogAnaliseDemanda",
  components: {
    AppFormInput,
    BaseDialog,
    BotaoPadrao,
    AppFormTextarea,
    AppFormSelect,
  },
  props: {
    solicitacao: {
      type: [String, Number, Object, Array],
    },
  },
  data() {
    return {
      processo: {
        comentario: null,
        comprador: null,
        escoposs_id: null,
        abrangencia_escopo: null
      },
      compradores: [],
      escopos: [],
      valNegarSS: false
    }
  },
  computed:{
    bloquearBtnNegar(){
      return this.processo.comentario === null || this.processo.comentario === ""
    }
  },
  async created() {
    await this.buscarCompradores()
    await this.buscarEscopoSS()
  },
  async mounted(){
    this.processo.abrangencia_escopo = this.solicitacao.abrangencia_escopo
    this.processo.escoposs_id = this.solicitacao.escoposs_id
  },
  methods:{
    cancelar(){
      this.processo = {
        comentario: null,
        comprador: null
      }
      this.$emit("cancelar")
    },
    async buscarCompradores() {
      let resp = await this.$axios.$get("/suprimentos/ss/compradores")

      if (!resp.falha) {
        let compradores = resp.dados.compradores

        let options = compradores.map((o) => {
          return {id: o.Usuario.id, nome: o.Usuario.nome}
        })

        this.compradores = options
      }
    },

    async buscarEscopoSS() {
      let resp = await this.$axios.$get("/suprimentos/ss/escopos_ss")

      if (!resp.falha) {
        let escoposs = resp.dados.escopos
        let options = escoposs.map((o) => {
          return {
            id: o.id,
            nome: `${o.codigo_tarifa_fiscal} - ${o.numero_servico} - ${o.denominacao}`,
          }
        })

        this.escopos = options
      }
    },

    async processarSS(){
      let definir = this.processo
      let { id} = this.solicitacao
      let usuario_id = this.$auth.user.id

      let resp = await this.$axios
        .$post("/suprimentos/ss/definir_comprador", {
          definir,
          id,
          usuario_id,
        })
      if (!resp.falha) {

        this.$emit("definido", id)
      }
    },

    async negarSS() {
      let {comentario} = this.processo

      console.log(this.solicitacao)

      let solicitacoes = [this.solicitacao.id]
      let usuario_id = this.$auth.user.id

      let resp = await this.$axios.$post('/suprimentos/ss/negar_analise_demanda_ss', {
        comentario,
        solicitacoes,
        usuario_id
      })

      if (!resp.falha) {
        this.processo = {
          comentario: null,
          input: null
        }
        this.$emit('negado',solicitacoes)
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
