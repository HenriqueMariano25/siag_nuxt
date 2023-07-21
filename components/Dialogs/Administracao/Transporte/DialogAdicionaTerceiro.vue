<template>
  <div>
		<BaseDialog
			titulo="Adicionar TERCEIRO na rota "
			:carregando="carregando"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="min-h-[200px] max-h-[500px] overflow-y-auto px-2 flex flex-col w-full gap-2">
          <div class="grid grid-cols-4 gap-2 items-end">
            <AppFormSelectCompleto
              altura="95px"
              class="col-span-1"
              id="funcionario"
              label="Empresa"
              :options="terceiros"
              v-model="terceiroLocal.empresa"
              :invalido="erros.includes('empresa')" />
            <AppFormInput
              class="col-span-3"
              label="Nome"
              type="text"
              id="nome"
              placeholder="Ex: Henrique Mariano"
              :invalido="erros.includes('nome')"
              v-model="terceiroLocal.nome" />
            <AppFormInput
              class="col-span-1"
              label="Poltrona"
              type="text"
              id="poltrona"
              placeholder="Ex: 25"
              :invalido="erros.includes('poltrona')"
              v-model="terceiroLocal.poltrona" />
            <AppFormInput
              class="col-span-3"
              label="Ponto de Embarque"
              type="text"
              id="ponto_embarque"
              placeholder="Ex: Rua do Sesc"
              :invalido="erros.includes('ponto_embarque')"
              v-model="terceiroLocal.ponto_embarque" />
          </div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @click="salvarTerceiros()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import { buscarTerceiros } from "~/mixins/buscarInformacoes";
import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
</script>

<script>
export default {
  mixins: [buscarTerceiros],
  props: {
    terceiro: {
      type: Object,
    },
    rota_id: {
      type: Number,
    },
  },
  data() {
    return {
      carregando: false,
      terceiros: [],
      terceiroLocal: {
        empresa: null,
        nome: null,
        poltrona: null,
        ponto_embarque: null,
        id: null,
      },
      erros: [],
      // buscouFuncionario: false,
    }
  },
  async created() {
    let terceiros = await this.buscarTerceiros()

    this.terceiros = terceiros.map(o => { return {id: { cod_empresa: o.COD_EMPRESA, empresa: o.nome }, nome: o.nome, key: o.COD_EMPRESA}})
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    validarFormulario() {
      this.erros = []

      let camposObrigatorio = [
        "empresa",
        "nome",
        "poltrona",
        "ponto_embarque",
      ]

      for (let campo of camposObrigatorio) {
        if (this.terceiroLocal[`${campo}`] === null || this.terceiroLocal[`${campo}`] === "") this.erros.push(campo)
      }
    },

    async salvarTerceiros(){
      this.validarFormulario()

      if(this.erros.length === 0){
        let { empresa: empresa, cod_empresa: cod_empresa } = this.terceiroLocal.empresa

        let terceiro = Object.assign({}, this.terceiroLocal)

        terceiro['empresa'] = empresa
        terceiro.cod_empresa = cod_empresa
        terceiro.rota_id = this.rota_id

        let resp = await this.$axios.$post("/transporte/adicionar/terceiros", { funcionario: terceiro })
        let { funcionario } = resp.dados

        this.$emit("adicionado", funcionario)

      }
    }
  }
};
</script>

<style scoped>

</style>
