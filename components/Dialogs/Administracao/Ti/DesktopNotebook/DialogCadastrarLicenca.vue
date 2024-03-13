<template>
  <div>
    <BaseDialog
      largura="w-8/12"
      titulo="CADASTRAR LICENÇA"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2 grid grid-cols-2 grid-2 gap-2">
          <AppFormInput id="licenca" type="text" label="Nome da licença" v-model="licenca.nome" placeholder="Ex: AUTOCAD 2024" obrigatorio uppercase />
          <AppFormInput id="valor" type="text" label="Valor" v-model="licenca.valor" placeholder="Ex: R$ 300,00"
                        v-money="{ precision: 2, prefix: 'R$ ', decimal: ',', thousands: '.' }" />
          <AppFormRadio
            :itens="opcoes"
            titulo="Tipo de licença"
            id="tipo_licenca"
            obrigatorio
            v-model="licenca.tipo_licenca" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex items-center gap-2">
          <span class="text-red-400 text-bold" v-if="jaCriado">Já existe esse disco!</span>
          <BotaoPadrao texto="salvar" @clique="cadastrarLicenca()">
            <img src="../../../../../assets/icons/save-b.svg" alt="" class="w-7 h-7">
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
import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue";

export default {
  components: { AppFormRadio, BotaoPadrao, AppFormInput, BaseDialog },
  data() {
    return {
      licenca: {
        nome: null,
        valor: null,
        tipo_licenca: null
      },
      opcoes: [
        { label: "Só Desktop/Notebook", valor: "desknote" },
        { label: "Só Funcionário", valor: "funcionario" },
        { label: "Ambos as opções", valor: "ambos" },
      ],
      jaCriado: false
    };
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async cadastrarLicenca() {
      this.jaCriado = false
      let { nome, valor, tipo_licenca } = this.licenca
      let resp = await this.$axios.$post("/ti/licenca/cadastrar", { nome, valor, tipo_licenca })

      if (!resp.falha) {
        let { licenca, criado } = resp.dados

        if (!criado) {
          this.jaCriado = true
        } else {
          this.$store.commit("ti/licencaTI/ATUALIZAR_LICENCAS_TI", {
            licenca
          })
          this.$emit("cadastrado",licenca)
        }
      }
    }
  }
};
</script>

<style scoped>

</style>e
