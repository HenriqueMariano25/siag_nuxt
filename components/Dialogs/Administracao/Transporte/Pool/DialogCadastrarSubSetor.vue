<template>
  <div>
    <BaseDialog
      largura="w-6/12"
      titulo="Cadastrar Sub Setor"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2 flex gap-2 w-full items-center">
          <AppFormInput id="subSetor" type="text" label="Sub Setor" v-model="subSetor.sub_setor" placeholder="Ex: Transporte" obrigatorio
                        :invalido="erros.includes('sub_setor')"/>
          <AppFormSelectCompleto
            style="z-index: 101 !important"
            obrigatorio
            id="setor"
            label="Setor"
            :options="setores"
            v-model="subSetor.setor_id"
            class="grow"
            :invalido="erros.includes('setor_id')" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex items-center gap-2">
          <BotaoPadrao texto="salvar" @clique="cadastrarSubSetor()">
            <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue";
import { buscarSetores} from "~/mixins/buscarInformacoes";

export default {
  mixins: [buscarSetores],
  components: { AppFormSelectCompleto, BotaoPadrao, AppFormInput, BaseDialog },
  data() {
    return {
      subSetor:{
      sub_setor: null,
      setor_id: null,
      },
      jaCriado: false,
      setores: [],
      erros: []
    };
  },
  async created() {
   let setores = await this.buscarSetores()
    this.setores = setores.map( o => { return { id: o.id, nome: o.nome }})
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    validarFormulario() {
      this.erros = []

      let camposObrigatorio = ["sub_setor", "setor_id"]

      for (let campo of camposObrigatorio) {
        if (this.subSetor[`${campo}`] === null || this.subSetor[`${campo}`] === "")
          this.erros.push(campo)
      }
    },

    async cadastrarSubSetor() {
      this.validarFormulario()

      if(this.erros.length === 0){
        let { sub_setor, setor_id }  = this.subSetor
        let resp = await this.$axios.$post("/pool/subSetor/cadastrar", { sub_setor, setor_id })

        if (!resp.falha) {
          let { criado } = resp.dados
          this.$emit("cadastrado", criado)
        }
      }
    }
  }
};
</script>

<style scoped>

</style>e
