<template>
  <div style="z-index: 102">
		<BaseDialog
			titulo="Agendamentos"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div>
					<div>
						<AppTabs
							:tabs="tabs"
							@tab="tab = $event">
							<template v-slot:[`tab.todos`]="{ item }">
								<div class="px-1 pt-0.5 flex flex-col gap-y-2 ">
									<div
										class="gap-2 justify-end flex w-full border border-gray-300 bg-gray-200 p-1">
                    <div class="flex gap-2">
                      <AppFormInput
                        id="data_aprovados"
                        type="date"
                        v-model="dataTodos"
                        label="Data" />
                      <div class="flex items-end">
                        <BotaoPadrao
                          cor="bg-gray-700 hover:bg-gray-800"
                          :disabled="dataTodos === null || dataTodos === ''"
                          @clique="buscarTodos">
                          <img
                            src="@/assets/icons/magnifier-w.svg"
                            alt=""
                            class="w-6 h-6" />
                        </BotaoPadrao>
                      </div>
                    </div>
                  </div>
                  <div>
                    <TabelaPadrao
                      :cabecalho="cabecalhoTodos"
                      :dados="dadosTodos"
                      altura="calc(100vh - 335px)"
                       :tem-rodape="false"
                      >
                      <template v-slot:[`body.agendado_por.nome`]="{ item }">
												<span class="whitespace-nowrap">{{
                            item.agendado_por ? item.agendado_por.nome : ""
                          }}</span>
                      </template>
                    </TabelaPadrao>
                  </div>
                </div>
              </template>
              <template v-slot:[`tab.meusAgendamentos`]="{ item }">
                <div class="px-1 pt-0.5 flex flex-col gap-y-2 ">
                  <div
                    class="gap-2 justify-end flex w-full border border-gray-300 bg-gray-200 p-1">
                    <div class="flex gap-2">
                      <AppFormInput
                        id="data_meus_agendamentos"
                        type="date"
                        v-model="dataMeus"
                        label="Data" />
                      <div class="flex items-end">
                        <BotaoPadrao
                          cor="bg-gray-700 hover:bg-gray-800"
                          :disabled="dataMeus === null || dataMeus === ''"
                          @clique="buscarMeusAgendamentos">
                          <img
                            src="@/assets/icons/magnifier-w.svg"
                            alt=""
                            class="w-6 h-6" />
                        </BotaoPadrao>
                      </div>
                    </div>
                  </div>
                  <div>
                    <TabelaPadrao
                      :cabecalho="cabecalhoMeus"
                      :dados="dadosMeus"
                      altura="calc(100vh - 335px)"
                      selecionar
                      @selecionados="selecionados = $event"
                      :limparSelecionar="limparSelecionar"

                      :tem-rodape="false"
                    >
                      <template v-slot:[`body.agendado_em`]="{ item }">
												<span class="whitespace-nowrap">{{
                            item.createdAt ? $dayjs(item.createdAt).format("DD/MM/YYYY") : ""
                          }}</span>
                      </template>
                    </TabelaPadrao>
                  </div>
                </div>
              </template>
            </AppTabs>
          </div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div>
          <BotaoPadrao texto="Desagendar" @clique="desagendar()" v-if="tab === 'meusAgendamentos'" :disabled="selecionados.length <= 0">
            <img src="@/assets/icons/delete-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
    </BaseDialog>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppBadge from "~/components/Ui/AppBadge.vue";
import AppTabs from "~/components/Ui/AppTabs.vue";
import AppTag from "~/components/Ui/AppTag.vue";

export default {
  name: "DialogAgendamentosTerceiros",
  components: {
    BaseDialog,
    AppBadge,
    AppTabs,
    AppTag
  },
  data() {
    return {
      tabs: [

          { nome: "Todos", valor: "todos" },
          {
            nome: "Meus agendamento",
            valor: "meusAgendamentos",
          },

      ],
      dataTodos:null,
      cabecalhoTodos: [
        { nome: "Empresa", valor: "nome"},
        { nome: "Quantidade", valor: "quantidade"},
        { nome: "Turno", valor: "turno" },
        { nome: "Motivo", valor: "motivo" },
        { nome: "Agendado por", valor: "agendado_por.nome" },
      ],
      dadosTodos:[],
      selecionados: [],
      dadosMeus: [],
      cabecalhoMeus: [
        { nome: "Empresa", valor: "nome" },
        { nome: "Quantidade", valor: "quantidade" },
        { nome: "Turno", valor: "turno" },
        { nome: "Motivo", valor: "motivo" },
        { nome: "Agendado em", valor: "agendado_em" },
      ],
      dataMeus:null,
      tab: "todos",
      mostrarAlerta: false,
      textoAlerta: "",
      limparSelecionar: false
    };
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarTodos(){
      let data = this.dataTodos

      let resp = await this.$axios.$get("/hora_extra/terceiros/agendados", { params: { data }})

      this.dadosTodos = resp.agendados
    },
    async buscarMeusAgendamentos(){
      let agendado_por_id = this.$auth.user.id
      let data = this.dataMeus

      let resp = await this.$axios.$get("/hora_extra/terceiros/meus_agendados", { params: { data, agendado_por_id } })
      this.dadosMeus = resp.agendados
    },

    async desagendar(){
      this.limparSelecionar = !this.limparSelecionar
      let terceiros = this.selecionados.map( o => o.id)

      let resp = await this.$axios.$post("/hora_extra/terceiros/desagendar",  { terceiros })

      if(!resp.falha){
        for(let id of terceiros){
          let idx = this.dadosMeus.findIndex( o => o.id === id)
          if(idx >= 0)
            this.dadosMeus.splice(idx, 1)
        }
        this.textoAlerta = "Agendamentos deletados com sucesso!"
        this.mostrarAlerta = true
      }
    }
  }
};
</script>

<style scoped>

</style>
<script setup>
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";
</script>
