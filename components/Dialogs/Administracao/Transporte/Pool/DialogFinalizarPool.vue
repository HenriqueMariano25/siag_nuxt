<template>
  <div>
    <BaseDialog
      titulo="Finalizar pool"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="flex flex-col px-2 gap-2">
          <div class="flex flex-col bg-blue-200 p-1">
            <span><strong>Dados da abertura</strong></span>
            <div class="grid grid-cols-3 w-full">
              <span>Data inicial: {{ $dayjs(poolBuscado.data_inicial).format("DD/MM/YYYY")}}</span>
              <span>Hora inicial: {{ poolBuscado.hora_inicial}}</span>
              <span>KM inicial: {{ poolBuscado.km_inicial}}</span>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2 items-center">
            <AppFormInput
              id="data_final"
              type="date"
              label="Data final"
              obrigatorio
              :invalido="erros.includes('data_final')"
              v-model="pool.data_final" />
            <AppFormInput
              id="hora_final"
              type="time"
              label="Hora final"
              obrigatorio
              :invalido="erros.includes('hora_final')"
              v-model="pool.hora_final" />
            <AppFormInput
              id="km_final"
              type="number"
              label="KM final"
              v-model="pool.km_final"
              :texto-invalido="txtInvalidoKmFinal"
              obrigatorio
              :invalido="erros.includes('km_final')"
              placeholder="Ex: 123456" />
            <AppFormTextarea
              label="Observação"
              id="observacao"
              v-model="pool.observacao_final"
              class="col-span-3"
              linhas="1"
              placeholder="Observação opcional" />
          </div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="Finalizar" @clique="finalizarPool()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  name: 'DialogFinalizarPool',
  components: { BotaoPadrao, AppFormTextarea, AppFormInput, BaseDialog },
  props: {
    pool_id: {
      type: Number,
    },
  },
  data() {
    return {
      pool: {
        data_final:this.$dayjs().format("YYYY-MM-DD"),
        hora_final:this.$dayjs().format("HH:mm"),
        km_final: null,
        observacao_final: null
      },
      erros: [],
      poolBuscado: {},
      txtInvalidoKmFinal: null,

    };
  },
  async mounted() {
    if(this.pool_id){
      await this.buscarPool()
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarPool(){
      let resp = await this.$axios.$get("/pool/buscar", {params: { id: this.pool_id}})

      if(!resp.falha){
        let { pool } = resp.dados
       this.poolBuscado = pool
      }
    },
    validarFormulario() {
      this.erros = []

      let camposObrigatorio = [
        "data_final",
        "hora_final",
        "km_final",
      ]

      for (let campo of camposObrigatorio) {
        if (this.pool[`${campo}`] === null || this.pool[`${campo}`] === "") this.erros.push(campo)
      }

      this.validarKmFinal()
    },

    validarKmFinal(){
      this.txtInvalidoKmFinal = null

      if(parseInt(this.pool.km_final) < parseInt(this.poolBuscado.km_inicial)){
        this.erros.push("km_final")
        this.txtInvalidoKmFinal = "Km final menor que inicial"
      }
    },

    async finalizarPool(){
      this.validarFormulario()

      if(this.erros.length === 0){
        let resp = await this.$axios.$post("/pool/finalizar", { ...this.pool, pool_id: this.pool_id })

        if(!resp.falha){

          let { pool } = resp.dados
          console.log(resp);

          this.$emit("poolFinalizado", { pool })
        }
      }
    }
  }
};
</script>

<style scoped>

</style>
