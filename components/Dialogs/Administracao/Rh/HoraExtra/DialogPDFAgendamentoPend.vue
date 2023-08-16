<template>
  <div>
    <BaseDialog
      largura="w-10/12"
      titulo="Imprimir agendamentos PENDENTES"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="print:w-[1000px] print:overflow-y-visible h-[550px] print:h-auto flex flex-col w-full overflow-y-auto max-h-[500px] gap-4">
          <div class="p-2 text-xl print:flex items-center gap-5 justify-between border border-black hidden">
            <img src="@/assets/img/logogrande.png" alt="" class="w-[350px]">
            <h1 class="print:text-3xl">AGENDAMENTOS PENDENTES</h1>
            <div class="flex flex-col gap-2">
              <span>{{ $dayjs(data).format("DD/MM/YYYY") }}</span>
              <span>Total: {{ dados.length }}</span>
            </div>
          </div>
          <div class="w-full">
            <table class="table w-full  border-collapse">
              <thead class="bg-gray-300">
              <tr>
                <th class="border border-black">Status</th>
                <th class="border border-black">Matricula</th>
                <th class="border border-black">Nome</th>
                <th class="border border-black">Cargo</th>
                <th class="border border-black">Turno</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="funcionario of dados">
                <td class="border border-black px-2">
                  {{ funcionario.StatusAgendamento ? funcionario.StatusAgendamento.descricao : "" }}
                </td>
                <td class="border border-black px-2">
                  {{ funcionario.chapa }}
                </td>
                <td class="border border-black px-2">{{ funcionario.Funcionario ? funcionario.Funcionario.nome : null }}
                </td>
                <td class="border border-black px-2">{{ funcionario.Funcionario ? funcionario.Funcionario.cargo : null }}
                </td>
                <td class="border border-black px-2">{{ funcionario.turno }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito><div>
        <BotaoPadrao texto="imprimir" @clique="imprimir()">
          <img src="@/assets/icons/printer-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </div></template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  name: "DialogPDFAgendamentoPend",
  components: { BotaoPadrao, BaseDialog },
  props: {
    dados: {
      type: [Array],
    },
    data:{
      type: String
    }
  },
  created() {
    setTimeout(() => {
      this.imprimir()
    }, 800)
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    imprimir(){
      window.print()
    }
  }
}
</script>

<style scoped>

</style>
