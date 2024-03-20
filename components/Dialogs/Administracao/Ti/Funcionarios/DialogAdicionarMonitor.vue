<template>
  <div>
    <BaseDialog
      largura="w-10/12"
      class="uppercase"
      titulo="ADICIONAR MONITOR"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="flex flex-col w-full px-2 gap-2">
          <div class="flex gap-2 w-full">
            <AppFormInput
              type="text"
              @keyup.enter.prevent.stop="buscarMonitor()"
              class="grow"
              uppercase
              v-model="buscaMonitor"
              placeholder="Ex: 1D791M2"
              label="Buscar por patrimônio ou serial"
              id="patrimonio_serial" />
            <div class="flex items-end">
              <BotaoPadrao
                texto="buscar"
                cor="bg-blue-400 hover:!bg-blue-500"
                @clique="buscarMonitor()"
                :disabled="bloquearBuscarMonitor">
                <img
                  src="@/assets/icons/magnifier-b.svg"
                  alt=""
                  class="w-7 h-7" />
              </BotaoPadrao>
            </div>
          </div>
          <div
            v-for="monitor of monitores"
            :key="monitor.id"
            class="border flex flex-col p-2 shadow bg-blue-200 border-blue-300">
            <div class="flex gap-3">
              <div class="flex flex-col grow">
                <div class="flex gap-4">
                  <div class="flex flex-col">
                    <span class="titulo-desknote">SERIAL</span>
                    <span class="texto-desknote">{{ monitor.serial }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="titulo-desknote">PATRIMÔNIO</span>
                    <span class="texto-desknote">{{
                        monitor.patrimonio ? monitor.patrimonio : "-"
                      }}</span>
                  </div>
                </div>
                <div class="px-0.5 font-bold text-slate-700 text-sm flex whitespace-nowrap">
                  <span class="whitespace-nowrap">
										{{ monitor.MarcaTI ? monitor.MarcaTI.nome : "" }} -&nbsp
									</span>
                  <span class="whitespace-nowrap">
										{{ monitor.ModeloTI ? monitor.ModeloTI.nome : "" }}
									</span>
                </div>
              </div>
              <div class="flex">
                <div class="grid grid-cols-1 text-end content-between h-full">
									<span class="text-sm">
										Data de entrega:
										<strong class="text-lg">
											{{ monitor.data_entrega ? $dayjs(monitor.data_entrega).format("DD/MM/YYYY HH:mm:ss") : "" }}
										</strong>
									</span>
                  <span class="text-sm self-end">
										RESPONSÁVEL:
										<strong
                      class="text-lg"
                      :class="{ 'text-green-800': !monitor.Funcionario }">
											{{ monitor.Funcionario ? monitor.Funcionario.nome : "ESTOQUE" }}
										</strong>
									</span>
                </div>
              </div>
              <div class="flex">
                <div class="flex flex-col items-center justify-center h-full gap-1">
                  <BotaoPadrao
                    v-if="monitor_id !== monitor.id"
                    icone
                    @clique="monitor_id = monitor.id"
                    cor="!bg-blue-300 hover:!bg-blue-400">
                    <img
                      src="@/assets/icons/add-b.svg"
                      alt=""
                      class="w-9 h-9" />
                  </BotaoPadrao>
                  <BotaoPadrao
                    v-if="monitor_id === monitor.id"
                    icone
                    @clique="adicionarMonitor(monitor)"
                    cor="!bg-green-400 hover:!bg-green-500">
                    <img
                      src="@/assets/icons/add-b.svg"
                      alt=""
                      class="w-7 h-7" />
                  </BotaoPadrao>
                  <BotaoPadrao
                    v-if="monitor_id === monitor.id"
                    icone
                    @clique="monitor_id = null"
                    cor="!bg-red-300 hover:!bg-red-400">
                    <img
                      src="@/assets/icons/close-b.svg"
                      alt=""
                      class="w-7 h-7" />
                  </BotaoPadrao>
                </div>
              </div>
            </div>
            <div
              class="bg-red-400 w-full px-2 text-center uppercase text-white rounded border border-red-500 py-1 font-bold mt-2"
              v-if="monitor.Funcionario && deskNote_id === monitor.id">
							<span
              >
                Esee monitor já tem um responsável, certeza que deseja fazer a troca
								?
              </span
              >
            </div>
          </div>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue"

export default {
  components: { BaseDialog },
  data() {
    return {
      buscaMonitor: null,
      monitores: [],
      monitor_id: null,
    }
  },
  props: {
    funcionario_id: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    bloquearBuscarMonitor() {
      let busca = this.buscaMonitor ? this.buscaMonitor.trim() : this.buscaMonitor

      return busca === null || busca === ""
    },
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarMonitor() {
      let busca = this.buscaMonitor
      let funcionario_id = this.funcionario_id

      let resp = await this.$axios.$get("/ti/funcionarios/buscarMonitores", {
        params: { busca, funcionario_id },
      })

      if (!resp.falha) {
        this.monitores = resp.dados.monitores
      }
    },
    async adicionarMonitor(monitor) {
      let funcionario_id = this.funcionario_id
      let monitorti_id = monitor.id

      let resp = await this.$axios.$post("/ti/funcionarios/trocarMonitor", {
        funcionario_id,
        monitorti_id,
      })

      if (!resp.falha) {
        monitor.data_entrega = this.$dayjs().format("YYYY-MM-DD HH:mm:ss")
        this.$emit("trocado", monitor)
      }
    },
  },
}
</script>

<style scoped>
.titulo-desknote {
  font-size: 11px;
  text-align: center;
  font-weight: 700;
  color: #545458;
  white-space: nowrap;
}

.texto-desknote {
  font-size: 19px;
  text-align: center;
  font-weight: 700;
  color: #000000;
  white-space: nowrap;
  text-transform: uppercase;
}
</style>
<script setup>
import AppFormInput from "~/components/Ui/AppFormInput.vue"
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
</script>
