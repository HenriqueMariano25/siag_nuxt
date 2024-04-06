<template>
	<div class="w-full">
		<CabecalhoPagina titulo="BLOQ. FALTA E ATESTADO" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
        ref="tabela"
				id="diasParaAgendamento"
				:cabecalho="cabecalho"
				:dados="dados"
        :carregando="carregando"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
        selecionar
        @selecionados="selecionados = $event"
				@filtros="filtros = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 180px)"
				@atualizar="buscarFuncionarios()">
        <template v-slot:[`body.setor.nome`]="{ item }">
          <span>{{ item.setor ? item.setor.nome : ""}}</span>
        </template>
        <template v-slot:[`body.data_inicio_bloq_he`]="{ item }">
          <span>{{ item.data_inicio_bloq_he ? $dayjs(item.data_inicio_bloq_he).format("DD/MM/YYYY") : ""}}</span>
        </template>
        <template v-slot:[`body.data_fim_bloq_he`]="{ item }">
          <span>{{ item.data_fim_bloq_he ? $dayjs(item.data_fim_bloq_he).format("DD/MM/YYYY") : ""}}</span>
        </template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<div class="w-full justify-between flex">
				<BotaoPadrao
					texto="importar"
					@clique="mostrarDialogImportarFaltaAtestado = true">
					<img
						src="@/assets/icons/upload-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
				<BotaoPadrao
					texto="desbloquear"
          :disabled="selecionados.length <= 0"
					@clique="mostrarDialogConfirmarDesbloqueio = true">
					<img
						src="@/assets/icons/lock-open-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</RodapePagina>
		<DialogImportarFaltaAtestado
			v-if="mostrarDialogImportarFaltaAtestado"
			@cancelar="mostrarDialogImportarFaltaAtestado = false"
			@importado="importado" />
    <DialogConfirmarDesbloqueio v-if="mostrarDialogConfirmarDesbloqueio" @cancelar="mostrarDialogConfirmarDesbloqueio = false" @desbloqueados="desbloqueados" :funcionarios="selecionados"/>
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
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import DialogImportarFaltaAtestado from "~/components/Dialogs/Administracao/Rh/HoraExtra/Configuracao/BloquearFaltaAtestado/DialogImportarFaltaAtestado.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
  import DialogConfirmarDesbloqueio
    from "~/components/Dialogs/Administracao/Rh/HoraExtra/Configuracao/BloquearFaltaAtestado/DialogConfirmarDesbloqueio.vue";

	export default {
		components: {
      DialogConfirmarDesbloqueio,
			TabelaPadrao,
			AppAlerta,
			DialogImportarFaltaAtestado,
			RodapePagina,
			BotaoPadrao,
			CabecalhoPagina,
		},
		data() {
			return {
				mostrarDialogImportarFaltaAtestado: false,
				mostrarAlerta: false,
				textoAlerta: null,
				cabecalho: [
					{ nome: "Matrícula", valor: "chapa", filtro: true, ordenar: true },
					{ nome: "Nome", valor: "nome", filtro: true, ordenar: true },
					{ nome: "Cargo", valor: "cargo", filtro: true, ordenar: true },
					{ nome: "Setor", valor: "setor.nome", filtro: true, ordenar: true },
					{ nome: "Inicio Bloq.", valor: "data_inicio_bloq_he" },
					{ nome: "Fim Bloq.", valor: "data_fim_bloq_he"},
				],
				filtros: {},
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
        carregando: false,
        selecionados: [],
        mostrarDialogConfirmarDesbloqueio: false
			}
		},
    created() {
      this.buscarFuncionarios();
    },
		methods: {
			importado() {
				this.mostrarDialogImportarFaltaAtestado = false
				this.textoAlerta = "Arquivo importado com sucesso!"
				this.mostrarAlerta = true
        this.buscarFuncionarios()
        this.$refs.tabela.limparSelecionados()
			},
			async buscarFuncionarios() {
        this.carregando = true
				let resp = await this.$axios.$get(
					"/hora_extra/configuracao/buscar_funcionarios/bloqueio_falta_atestado",
					{ params: { filtros: this.filtros, page: this.pagina, size: this.itensPorPagina } },
				)

				if (!resp.falha) {
					this.totalItens = resp.dados.total
					this.dados = resp.dados.funcionarios
				}

        this.carregando = false
			},
      desbloqueados(){
        for(let funcionario of this.selecionados){
          let idx = this.dados.findIndex(o => o.id === funcionario.id)

          if(idx > -1){
            this.dados.splice(idx, 1)
          }
        }

        this.totalItens = this.totalItens - this.selecionados.length
        this.$refs.tabela.limparSelecionados()
        this.mostrarDialogConfirmarDesbloqueio = false
        this.textoAlerta = "Funcionários desbloqueados com sucesso!"
        this.mostrarAlerta = true
      }
		},
	}
</script>

<style scoped></style>
