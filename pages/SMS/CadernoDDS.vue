<template>
	<div class="w-full flex">
		<CabecalhoPagina
			titulo="Caderno de DDS"
			class="print:hidden" />
		<div class="w-full flex flex-col !mt-11 print:hidden">
			<div class="bg-white p-1.5 gap-2 flex flex-col">
				<div class="grid grid-cols-12 gap-2 items-center">
					<AppFormInput
						id="mes"
						type="month"
						label="Mês"
						obrigatorio
						v-model="caderno.mes"
						class="col-span-2" />
					<AppFormSelect
						id="tipoResponsavel"
						label="Tipo do Responsável"
						:options="tiposResponsaveis"
						v-model="caderno.tipoResponsavel"
						obrigatorio
						class="col-span-2" />
					<AppFormSelectCompleto
						style="z-index: 101 !important"
						obrigatorio
						id="responsavel"
						label="Responsável"
						:options="responsaveis"
						v-model="caderno.responsavel"
						:invalido="erros.includes('responsavel')"
						class="col-span-8" />
					<AppFormInput
						id="tarefa"
						type="text"
						label="Tarefa"
						class="col-span-9"
            v-model="caderno.tarefa"
						placeholder="Ex: Concretagem na caldeira" />
          <AppFormInput
            id="repeticao"
            type="number"
            label="N° repetição pagina 3 e 4"
            class="col-span-2"
            v-model="caderno.repeticao"
            placeholder="Ex: 30" />
					<div class="flex self-end">
						<BotaoPadrao
							texto="buscar"
							cor="bg-blue-600 hover:!bg-blue-700"
              :disabled="temCampoVazioReponsavel"
							@click="buscarFuncionariosResponsavel()"
							class="text-white">
							<img
								src="@/assets/icons/magnifier-w.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
				<div class="flex">
					<TabelaPadrao
						:cabecalho="cabecalho"
						:dados="dados"
						:temRodape="false"
						altura="calc(100vh - 253px)"
						@atualizar="buscarFuncionariosResponsavel()"
						:temDetalhes="false">
					</TabelaPadrao>
				</div>
			</div>
		</div>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex justify-end w-full">
					<div class="flex">
						<BotaoPadrao
							class="flex"
							:disabled="temCampoVazio"
							@click="gerarCaderno()"
							texto="Imprimir">
							<img
								src="@/assets/icons/printer-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCadernoDDS
			v-if="mostrarDialogCadernoDDS"
			@cancelar="mostrarDialogCadernoDDS = false"
			:responsavel="responsavel"
      :mes="caderno.mes"
      :funcionarios="dados"
      :repeticao="caderno.repeticao"
      :tarefa="caderno.tarefa"
    />
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import DialogCadernoDDS from "~/components/Dialogs/SMS/DialogCadernoDDS.vue"

	export default {
		name: "CadernoDDS",
		components: {
			DialogCadernoDDS,
			RodapePagina,
			TabelaPadrao,
			AppFormSelectCompleto,
			BotaoPadrao,
			AppFormSelect,
			AppFormInput,
			CabecalhoPagina,
		},
		data() {
			return {
				tiposResponsaveis: [
					{ id: "encarregado_lider_id", nome: "Encarregado" },
					{ id: "supervisor_id", nome: "Supervisor" },
					{ id: "engenheiro_id", nome: "Engenheiro" },
					{ id: "coordenador_id", nome: "Coordenador" },
					{ id: "gestor_id", nome: "Gestor" },
				],
				responsaveis: [],
				caderno: {
					mes: this.$dayjs().add(1, "month").format("YYYY-MM"),
					tipoResponsavel: "encarregado_lider_id",
					responsavel: null,
					tarefa: null,
          repeticao: null
				},
				erros: [],
				cabecalho: [
					{ nome: "Matrícula", valor: "chapa" },
					{ nome: "Nome", valor: "nome" },
					{ nome: "Cargo", valor: "cargo" },
				],
				dados: [],
				buscou: false,
				responsavel: {

				},
				mostrarDialogCadernoDDS: false,
			}
		},
		computed: {
			temCampoVazio() {
				return (
					!this.caderno.mes ||
					!this.caderno.responsavel ||
					!this.caderno.tipoResponsavel ||
					!this.buscou
				)
			},

      temCampoVazioReponsavel(){
        return (
          !this.caderno.responsavel ||
          !this.caderno.tipoResponsavel
        )
      }
		},
		created() {
			this.buscarResponsaveis()
		},
		methods: {
			async buscarResponsaveis() {
				let resp = await this.$axios.$get("/efetivo/buscar_responsaveis")

				if (!resp.falha) {
					let responsaveis = resp.dados.responsaveis

					let options = responsaveis.map((o) => {
						return { id: o.id, nome: o.nome }
					})

					this.responsaveis = options
				}
			},
			async buscarFuncionariosResponsavel() {
				let { tipoResponsavel, responsavel } = this.caderno

				let resp = await this.$axios.$get("/sms/caderno_dds/funcionarios_caderno_dds", {
					params: {
						tipoResponsavel,
						responsavel,
					},
				})

				if (!resp.falha) {
					let { funcionarios, responsavel } = resp.dados

					this.dados = funcionarios
					this.buscou = true
					this.responsavel = responsavel
					console.log(responsavel)
				}
			},
			async gerarCaderno() {
				this.mostrarDialogCadernoDDS = true
			},
		},
	}
</script>

<style scoped></style>
