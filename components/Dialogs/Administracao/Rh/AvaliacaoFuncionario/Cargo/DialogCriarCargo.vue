<template>
  <div>
    <BaseDialog
      largura="w-8/12"
      :titulo="cargo ? 'EDITAR CARGO' : 'CADASTRAR CARGO'"
      :btn-deletar="!!cargo"
      @deletar="deletarCargo()"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2">
          <AppFormInput
            id="nome"
            type="text"
            uppercase
            sem-especiais
            placeholder="Ex: PROGRAMADOR"
            :invalido="erros.includes('nome')"
            v-model="cargoLocal.nome"
            label="Nome" />
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="cargo ? editarCargo() : cadastrarCargo()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import { validarFormulario } from "~/mixins/validarFormulario";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  components: { BotaoPadrao, AppFormInput, BaseDialog },
  props: {
    cargo: {
      type: Object,
    }
  },
  data() {
    return {
      cargoLocal: {
        nome: null,
      },
      erros: []
    };
  },
  mounted() {
    if (this.cargo) {
      this.cargoLocal = Object.assign({}, this.cargo)
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },

    async cadastrarCargo() {
      this.erros = validarFormulario(['nome'], this.cargoLocal)

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post("/cargo_avaliacao/cadastrar", {
          ...this.cargoLocal
        })

        if (!resp.falha) {
          this.$emit("cadastrado", resp.dados.cargo)
        }
      }
    },

    async editarCargo() {
      this.erros = validarFormulario(['nome'], this.cargoLocal)

      let { id } = this.cargo
      let { nome } = this.cargoLocal

      if (this.erros.length === 0) {
        let resp = await this.$axios.$post(`/cargo_avaliacao/editar`, {
          nome, id
        })

        if (!resp.falha) {
          this.$emit("editado", resp.dados.cargo)
        }
      }
    },

    async deletarCargo() {
      let { id } = this.cargo

      let resp = await this.$axios.$delete("/cargo_avaliacao/deletar", { params: { id } })

      if (!resp.falha) {
        this.$emit("deletado", id)
      }
    }
  }
};
</script>

<style scoped>

</style>
