<template>
  <div class="">
    <div class="flex w-full bg-primaria-900 h-14 flex text-white">
      <button
        @click="tipoAprovacao = 'controle'"
        class="px-4 hover:bg-blue-600"
        v-if="
					$auth.user &&
					$auth.user.permissoes.includes('aprovar_ss_controle')
				"
        :class="{ 'border-b-4 border-b-white': tipoAprovacao === 'controle' }">
        Controle
      </button>
      <button
        @click="tipoAprovacao = 'gestor_area'"
        class="px-4 hover:bg-blue-600"
        v-if="
					$auth.user &&
					$auth.user.permissoes.includes('aprovar_ss_gerente_area')
				"
        :class="{ 'border-b-4 border-b-white': tipoAprovacao === 'gestor_area' }">
        Gestor Área
      </button>
      <button
        @click="tipoAprovacao = 'site_manager'"
        class="px-4 hover:bg-blue-600"
        v-if="
					$auth.user &&
					$auth.user.permissoes.includes('aprovar_ss_site_manager')
				"
        :class="{ 'border-b-4 border-b-white': tipoAprovacao === 'site_manager' }">
        Site Manager
      </button>
    </div>
    <div class="">
      <AppTabela
        :cabecalho="cabecalho"
        :dados="dados"
        @filtrar="recebendoFiltro"
        :itensPorPagina="itensPorPagina"
        :pagina="pagina"
        :totalItens="totalItens"
        altura="calc(100vh - 190px)"
        @atualizar="atualizarDados"
        @dblclick="verDetalhesSS"
        :temDetalhes="false">
        <template v-slot:[`body.selecione`]="{ item }">
          <div class="flex justify-center">
            <AppFormCheckbox
              :id="parseInt(item.id)"
              :valor="item"
              v-model="selecionados"/>
          </div>
        </template>
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoIcone
            @click="
							ss = item
							mostrarDialogAprovControleSS = true
						">
            <img
              src="@/assets/icons/check-circle-b.svg"
              alt="close"
              class="w-6 h-6"/>
          </BotaoIcone>
        </template>
        <template v-slot:[`body.pep`]="{ item }">
					<span v-if="item">
						{{ item }}
					</span>
        </template>
        <template v-slot:[`body.Setor.nome`]="{ item }">
					<span v-if="item.Setor && item.Setor.nome">
						{{ item.Setor.nome }}
					</span>
        </template>
        <template v-slot:[`body.prazo_execucao`]="{ item }">
					<span v-if="item">
						{{ $dayjs(item.data_fim).diff(item.data_inicio, "day") }} dias
					</span>
        </template>
        <template v-slot:[`body.CentroCustoPEP.descricao`]="{ item }">
					<span v-if="item.CentroCustoPEP && item.CentroCustoPEP.descricao">
						{{ item.CentroCustoPEP.descricao }}
					</span>
        </template>
        <template v-slot:[`body.EtapaSS.nome`]="{ item }">
					<span v-if="item.EtapaSS && item.EtapaSS.nome">
						{{ item.EtapaSS.nome }}
					</span>
        </template>
        <template v-slot:[`body.data_necessidade`]="{ item }">
					<span v-if="item.data_necessidade">
						{{ $dayjs(item.data_necessidade).format("DD/MM/YYYY") }}
					</span>
        </template>
        <template v-slot:[`body.comentarios`]="{ item }">
          <button
            class="flex hover:bg-gray-400 w-full p-1"
            v-if="item.ComentarioSS && item.ComentarioSS.length > 0"
            @click="
							ss_id = item.id;
							mostrarDialogComentariosSS = true;
						">
            <img
              src="@/assets/icons/comentarios-b.svg"
              alt="close"
              class="w-7 h-7 mr-1"/>
            <span v-if="item.ComentarioSS.at(0).descricao">
							{{
                item.ComentarioSS.at(0).descricao.substr(0, 25)
              }}{{ item.ComentarioSS.at(0).descricao.length > 25 ? "..." : "" }}
						</span>
          </button>
        </template>
      </AppTabela>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex items-center w-full" v-if="tipoAprovacao !== 'controle'">
          <div class="flex w-full justify-end">
            <BotaoPadrao
              :disabled="selecionados.length <= 0"
              texto="Aprovar SS"
              @click="mostrarDialogAprovarSS = true">
              <template v-slot>
                <img
                  src="@/assets/icons/check-b.svg"
                  alt="close"
                  class="w-7 h-7 fill-red-500"/>
              </template>
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogAprovarSS
      v-if="mostrarDialogAprovarSS"
      :sss="selecionados"
      :tipoAprovacao="tipoAprovacao"
      @aprovado="aprovado"
      @cancelar="mostrarDialogAprovarSS = false"/>
    <DialogAprovControleSS
      :ss="ss"
      v-if="mostrarDialogAprovControleSS"
      @aprovado="aprovado"
      @cancelar="
				mostrarDialogAprovControleSS = false
				ss = null
			"/>
    <DialogComentariosSS
      :ss_id="ss_id"
      v-if="mostrarDialogComentariosSS"
      @cancelar="
				mostrarDialogComentariosSS = false
				ss_id = null
			"/>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
    <DialogDetalhesSS
      v-if="mostrarDialogDetalhesSS"
      @cancelar="mostrarDialogDetalhesSS = false; ss_id = null"
      :ss_id="ss_id"/>
  </div>
</template>

<script>
import AppTabela from "~/components/Ui/AppTabela.vue"
import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
import RodapePagina from "~/components/Shared/RodapePagina.vue"
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
import AppAlerta from "~/components/Ui/AppAlerta.vue"
import BotaoIcone from "~/components/Ui/Buttons/BotaoIcone.vue"
import DialogAprovControleSS from "~/components/Dialogs/Suprimentos/SS/DialogAprovControleSS.vue";
import DialogAprovarSS from "~/components/Dialogs/Suprimentos/SS/DialogAprovarSS.vue";
import DialogComentariosSS from "~/components/Dialogs/Suprimentos/SS/DialogComentariosSS.vue";
import DialogDetalhesSS from "~/components/Dialogs/Suprimentos/SS/DialogDetalhesSS.vue";
export default {
  name: "AprovarSSs",
  components: {
    DialogComentariosSS,
    DialogAprovarSS,
    AppTabela,
    AppFormCheckbox,
    RodapePagina,
    BotaoPadrao,
    AppAlerta,
    BotaoIcone,
    DialogAprovControleSS,
    DialogDetalhesSS
  },
  data() {
    return {
      dados: [],
      filtros: [],
      itensPorPagina: 10,
      pagina: 1,
      totalItens: 0,
      tipoAprovacao: null,
      tiposAprovacao: [],
      selecionados: [],
      mostrarDialogAprovarSS: false,
      mostrarAlerta: false,
      textoAlerta: "",
      mostrarDialogAprovControleSS: false,
      ss: null,
      mostrarDialogComentariosSS: false,
      ss_id: null,
      mostrarDialogDetalhesSS: false,
    }
  },
  created() {
    if (this.$auth.user) {
      let todasPermissoes = this.$auth.user.permissoes

      if (todasPermissoes.includes("aprovar_ss_controle")) {
        this.tiposAprovacao.push("controle")
        this.tipoAprovacao === null ? (this.tipoAprovacao = "controle") : false
      }

      if (todasPermissoes.includes("aprovar_ss_gerente_area")) {
        this.tiposAprovacao.push("gestor_area")
        this.tipoAprovacao === null ? (this.tipoAprovacao = "gestor_area") : false
      }

      if (todasPermissoes.includes("aprovar_ss_site_manager")) {
        this.tiposAprovacao.push("site_manager")
        this.tipoAprovacao === null ? (this.tipoAprovacao = "site_manager") : false
      }
    }
    this.buscarSSs()
  },
  computed: {
    cabecalho() {
      let cabecalho = [
        {nome: "Num. Acompanhamento", valor: "numero_acompanhamento", filtro: true, centralizar: true},
        {nome: "Natureza Operação", valor: "natureza_operacao", filtro: true, ordenar: true},
        {nome: "Tipo de Solicitação", valor: "tipo_solicitacao", filtro: true},
        {nome: "Centro de Custo", valor: "CentroCustoPEP.descricao", filtro: true},
        {nome: "Prazo Execução", valor: "prazo_execucao", filtro: true},
        {nome: "Necessidade", valor: "data_necessidade", filtro: true},
        {nome: "Etapa", valor: "EtapaSS.nome", filtro: true},
        {nome: "Comentários", valor: "comentarios", filtro: true},
      ]

      if (this.tipoAprovacao === "controle") {
        cabecalho.unshift({nome: "", valor: "acoes", centralizar: true})
      } else {
        cabecalho.unshift({nome: "", valor: "selecione", centralizar: true})
      }
      return cabecalho
    },
  },
  methods: {
    async buscarSSs() {
      let setor_id = this.$auth.user.setor_id
      this.selecionados = []

      let resp = await this.$axios.$get("/suprimentos/ss/aprovacao/buscarPaginados", {
        params: {
          tipoAprovacao: this.tipoAprovacao,
          page: this.pagina - 1,
          size: this.itensPorPagina,
          setor_id,
        },
      })

      if (!resp.falha) {
        let SSs = resp.dados.SSs.rows
        this.totalItens = resp.dados.SSs.count
        this.dados = SSs
      }
    },

    verDetalhesSS(dados) {

      this.ss_id = dados.id
      this.mostrarDialogDetalhesSS = true
    },

    recebendoFiltro(filtros) {
      this.filtros = filtros
    },

    async atualizarDados(parametros) {
      let {itensPorPagina, pagina, filtros} = parametros

      if (itensPorPagina) this.itensPorPagina = itensPorPagina

      if (pagina) this.pagina = pagina

      if (filtros) this.filtros = filtros
      await this.buscarSSs()
    },

    async aprovado(SSs, aprovacao) {
      this.mostrarDialogAprovarSS = false
      this.mostrarDialogAprovControleSS = false

      for (let ss of SSs) {
        let index = this.dados.findIndex((obj) => {
          return obj.id === ss
        })

        this.dados.splice(index, 1)
      }
      this.mostrarAlerta = true
      this.textoAlerta = aprovacao ? "SSs aprovadas com sucesso!" : "SSs negadas com sucesso!"
      this.selecionados = []
    },
  },
  watch: {
    tipoAprovacao() {
      this.buscarSSs()
    },
  },
}
</script>

<style scoped>

</style>
