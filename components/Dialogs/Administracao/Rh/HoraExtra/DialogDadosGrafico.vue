<template>
	<div>
		<BaseDialog
			:titulo="tipo === 'aprovados' ? 'APROVADOS' : tipo === 'pendente gestor' ? 'PENDENTES DO GESTOR DA ÁREA' : 'PENDEnTES DO SITE MANAGER'"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="overflow-y-auto px-2" style="max-height: calc(100vh - 200px)">
					<TabelaPadrao
						id="chips"
						:cabecalho="cabecalho"
						:dados="dados"
						:itensPorPagina="itensPorPagina"
						:pagina="pagina"
						@pagina="pagina = $event"
						@filtros="filtros = $event"
						:totalItens="totalItens"
            altura="calc(100vh - 379px)"
						:carregando="carregando"
						@atualizar="buscarAgendamentos()">
            <template v-slot:[`body.Funcionario.chapa`]="{ item }">
              <span>{{ item.Funcionario ? item.Funcionario.chapa : ""}}</span>
            </template>
            <template v-slot:[`body.Funcionario.nome`]="{ item }">
              <span>{{ item.Funcionario ? item.Funcionario.nome : ""}}</span>
            </template>
            <template v-slot:[`body.Funcionario.cargo`]="{ item }">
              <span>{{ item.Funcionario ? item.Funcionario.cargo : ""}}</span>
            </template>
            <template v-slot:[`body.Funcionario.setor.nome`]="{ item }">
              <span>{{ item.Funcionario && item.Funcionario.setor ? item.Funcionario.setor.nome : ""}}</span>
            </template>
            <template v-slot:[`body.agendado_por.nome`]="{ item }">
              <span>{{ item.agendado_por ? item.agendado_por.nome : ""}}</span>
            </template>
					</TabelaPadrao>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

	export default {
		components: { BotaoPadrao, TabelaPadrao, BaseDialog },
		props: {
			tipo: {
				type: String,
			},
			data: {
				type: String,
			},
		},
		data() {
			return {
				cabecalho: [
					{ nome: "Matrícula", valor: "Funcionario.chapa", filtro: true, },
					{
						nome: "Nome",
						valor: "Funcionario.nome",
						filtro: true,
					},
					{ nome: "Cargo", valor: "Funcionario.cargo", filtro: true, ordenar: true },
					{ nome: "Setor", valor: "Funcionario.setor.nome", filtro: true, ordenar: true },
					{ nome: "Agendado por", valor: "agendado_por.nome", filtro: true, ordenar: true },
				],
        totalItens: 0,
        dados: [],
        itensPorPagina: 100,
        pagina: 1,
        carregando: true,
        filtros: null,
			}
		},
		mounted() {
			console.log(this.data)
			console.log(this.tipo)
			this.buscarAgendamentos()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarAgendamentos() {
        this.carregando = true

				let resp = await this.$axios.$get("/hora_extra/grafico/buscar_agendamentos", {
					params: { tipo: this.tipo, data: this.data, filtros: this.filtros, page: this.pagina, size: this.itensPorPagina },
				})

				if (!resp.falha) {
					console.log(resp)
          this.carregando = false
          this.dados = resp.dados.agendamentos
          this.totalItens = resp.dados.total
				}
			},
		},
	}
</script>

<style scoped></style>
