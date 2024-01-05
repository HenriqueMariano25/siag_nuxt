<template>
	<div class="w-full">
		<CabecalhoPagina titulo="Dias p/ agendamento" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarDias()">
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="flex">
						<BotaoPadrao
							@clique="
								dia = item
								mostrarDialogCadastrarDiasAgendamento = true
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
					@clique="mostrarDialogCadastrarDiasAgendamento = true">
					<img
						src="@/assets/icons/add-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</RodapePagina>
		<DialogCadastrarDiasAgendamento
			v-if="mostrarDialogCadastrarDiasAgendamento"
			@cancelar="
				mostrarDialogCadastrarDiasAgendamento = false
				dia = null
			"
			:dia="dia"
			@cadastrado="cadastrado"
			@deletado="deletado"
      @editado="editado"/>
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
	import DialogCadastrarDiasAgendamento from "~/components/Dialogs/Administracao/Rh/HoraExtra/Configuracao/DiasAgendamento/DialogCadastrarDiasAgendamento.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"

	export default {
		components: {
			AppAlerta,
			DialogCadastrarDiasAgendamento,
			RodapePagina,
			TabelaPadrao,
			BotaoPadrao,
			CabecalhoPagina,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Data", valor: "data" },
					{ nome: "Data de liberação", valor: "data_liberacao" },
					{ nome: "Criado por", valor: "Usuario.nome", filtro: true },
					{ nome: "Descrição", valor: "descricao", filtro: true },
				],
				filtros: {},
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogCadastrarDiasAgendamento: false,
				dia: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		async mounted() {
			await this.buscarDias()
		},
		methods: {
			async buscarDias() {
				let filtros = this.filtros
				let page = this.pagina - 1
				let size = this.itensPorPagina

				let resp = await this.$axios.$get("/hora_extra/dias_agendamento/buscar", {
					params: { filtros, page, size },
				})

				if (!resp.falha) {
					let { dias, total } = resp.dados
					this.dados = dias
					this.totalItens = total
				}
			},
			cadastrado(dia) {
				this.dados.push(dia)
				this.mostrarDialogCadastrarDiasAgendamento = false
				this.textoAlerta = "Dia de agendamento cadastrado com sucesso!"
				this.mostrarAlerta = true
			},
      editado(dia){
        console.log(dia);
        let idx = this.dados.findIndex( o => o.id === dia.id)
        if(idx >= 0){
          console.log("entrei aq");
          console.log(this.dados[idx]);
          console.log(dia);
          this.dados[idx] = Object.assign(this.dados[idx], dia)
        }
				this.mostrarDialogCadastrarDiasAgendamento = false
        this.textoAlerta = "Dia de agendamento editado com sucesso!"
        this.mostrarAlerta = true
      },
      deletado(id){
        let idx = this.dados.findIndex(o => o.id === id)

        if (idx >= 0) {
          this.dados.splice(idx, 1)
        }
        this.mostrarDialogCadastrarDiasAgendamento = false
        this.textoAlerta = "Dia de agendamento deletado com sucesso!"
        this.mostrarAlerta = true
      }
		},
	}
</script>

<style scoped></style>
