<template>
  <div style="z-index: 102">
    <BaseDialog
      titulo="LIBERAR BLOQUEADOS"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="flex flex-col">
          <TabelaPadrao
            ref="tabela"
            id="aprovacaoHe"
            :cabecalho="cabecalho"
            :dados="selecionados"
            altura="calc(100vh - 335px)"
            :temRodape="false">
          </TabelaPadrao>
          <div class="flex gap-2 flex-col mx-2 p-2 bg-gray-200 border border-gray-300 ">
            <span class="font-bold text-lg">Indique quem liberou os funcionários para hora extra</span>
            <AppFormSelectCompleto
              id="funcionario"
              label="Autorizado por"
              :options="funcionarios"
              v-model="autorizado_por_id"
              class="grow" />
          </div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div>
          <BotaoPadrao texto="Liberar" :disabled="autorizado_por_id === null" @clique="liberar()">
            <img src="@/assets/icons/check-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  name: "DialogLiberarBloqueados",
  components: { BotaoPadrao, AppFormSelectCompleto, TabelaPadrao, BaseDialog },
  props: {
    selecionados: {
      type: Array,
    }
  },
  data() {
    return {
      cabecalho: [
        { nome: "Nome", valor: "nome" },
        { nome: "Matricula", valor: "matricula", centralizar: true, ordenar: true },
        { nome: "Cargo", valor: "cargo", centralizar: true },
        { nome: "Encarregado/Lider", valor: "encarregadoLider" },
        { nome: "Setor", valor: "setor", filtro: true, colunaTabela: "fun.nome" },
      ],
      dados: [],
      funcionarios: [],
      autorizado_por_id: null,
    };
  },
  async mounted() {
    await this.buscarFuncionarios()
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarFuncionarios() {
      let resp = await this.$axios.$get("/efetivo/buscar_responsaveis")

      if (!resp.falha) {
        let funcionarios = resp.dados.responsaveis

        this.funcionarios = funcionarios.map((o) => {
          return { id: o.id, nome: o.nome }
        })
      }
    },
    async liberar(){
      let bloqueados = this.selecionados.map( o=> { return { id: o.id, matricula: o.matricula } })
      let usuario_id = this.$auth.user.id

      let resp = await this.$axios.$post("/hora_extra/bloqueados/liberar", { bloqueados, autorizado_por_id: this.autorizado_por_id,
        usuario_id })
      console.log(resp);
      if(!resp.falha){
        this.$emit("liberados", bloqueados)
      }
    }
  }
};
</script>

<style scoped>

</style>
