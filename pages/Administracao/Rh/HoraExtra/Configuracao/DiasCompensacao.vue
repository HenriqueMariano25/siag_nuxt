<template>
  <div class="w-full">
    <CabecalhoPagina titulo="DIAS PARA COMPENSAÇÃO" />
    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
      <TabelaPadrao
        id="diasParaCompensacao"
        :cabecalho="cabecalho"
        :dados="dados"
        :itensPorPagina="itensPorPagina"
        :pagina="pagina"
        @pagina="pagina = $event"
        @filtros="filtros = $event"
        :totalItens="totalItens"
        altura="calc(100vh - 179px)"
        :carregando="carregando"
        @atualizar="buscarDias()">
        <template v-slot:[`body.acoes`]="{ item }">
          <div class="flex">
            <BotaoPadrao
              @clique="
								dia = item
								mostrarDialogCadastrarDiaCompensacao = true
							"
              icone>
              <div class="w-6 h-6 flex items-center justify-center">
                <img
                  src="@/assets/icons/edit-b.svg"
                  alt=""
                  class="w-5 h-5" />
              </div>
            </BotaoPadrao>
          </div>
        </template>
        <template v-slot:[`body.data`]="{ item }">
          {{ $dayjs(item.data).format("DD/MM/YYYY") }}
        </template>
        <template v-slot:[`body.data_liberacao`]="{ item }">
          {{ $dayjs(item.data_liberacao).format("DD/MM/YYYY") }}
        </template>
        <template v-slot:[`body.Usuario.nome`]="{ item }">
          {{ item.Usuario ? item.Usuario.nome : "" }}
        </template>
      </TabelaPadrao>
    </div>
    <RodapePagina>
      <div class="w-full justify-end flex">
        <BotaoPadrao
          texto="adicionar"
          @clique="mostrarDialogCadastrarDiaCompensacao = true">
          <img
            src="@/assets/icons/add-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
      </div>
    </RodapePagina>
    <DialogCadastrarDiaCompensacao
      v-if="mostrarDialogCadastrarDiaCompensacao"
      @cancelar="
				mostrarDialogCadastrarDiaCompensacao = false
				dia = null
			"
      :dia="dia"
      @cadastrado="cadastrado"
      @deletado="deletado"
      @editado="editado" />
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
  </div>
</template>

<script>
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
import RodapePagina from "~/components/Shared/RodapePagina.vue"
import DialogCadastrarDiaCompensacao
  from "~/components/Dialogs/Administracao/Rh/HoraExtra/Configuracao/DiaCompensacao/DialogCadastrarDiaCompensacao.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue"

export default {
  components: {
    AppAlerta,
    RodapePagina,
    TabelaPadrao,
    BotaoPadrao,
    CabecalhoPagina,
    DialogCadastrarDiaCompensacao
  },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-14" },
        { nome: "Data", valor: "data" },
        { nome: "Motivo", valor: "motivo", filtro: true },
        { nome: "Criado por", valor: "Usuario.nome", filtro: true },
      ],
      filtros: {},
      totalItens: 0,
      dados: [],
      itensPorPagina: 100,
      pagina: 1,
      mostrarDialogCadastrarDiaCompensacao: false,
      dia: null,
      mostrarAlerta: false,
      textoAlerta: null,
      carregando: true
    }
  },
  async mounted() {
    await this.buscarDias()
  },
  methods: {
    async buscarDias() {
      this.carregando = true
      let filtros = this.filtros
      let page = this.pagina - 1
      let size = this.itensPorPagina

      let resp = await this.$axios.$get("/hora_extra/dia_compensacao/buscar", {
        params: { filtros, page, size },
      })

      if (!resp.falha) {
        let { dias, total } = resp.dados
        this.dados = dias
        this.totalItens = total
        this.carregando = false
      }
    },
    cadastrado(dia) {
      this.dados.push(dia)
      this.mostrarDialogCadastrarDiaCompensacao = false
      this.textoAlerta = "Dia de compensação cadastrado com sucesso!"
      this.mostrarAlerta = true
      this.dia = null
    },
    editado(dia) {
      let idx = this.dados.findIndex(o => o.id === dia.id)
      if (idx >= 0) {
        this.dados[idx] = Object.assign(this.dados[idx], dia)
      }
      this.mostrarDialogCadastrarDiaCompensacao = false
      this.textoAlerta = "Dia de compensação editado com sucesso!"
      this.mostrarAlerta = true
      this.dia = null
    },
    deletado(id) {
      let idx = this.dados.findIndex(o => o.id === id)

      if (idx >= 0) {
        this.dados.splice(idx, 1)
      }
      this.mostrarDialogCadastrarDiaCompensacao = false
      this.textoAlerta = "Dia de compensação deletado com sucesso!"
      this.mostrarAlerta = true
      this.dia = null
    }
  },
}
</script>

<style scoped></style>
