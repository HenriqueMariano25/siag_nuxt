<template>
	<div class="w-full gap-y-2 flex flex-col">
		<div class="flex p-1 bg-white gap-2 border border-gray-300 shadow">
			<AppFormInput
				id="data"
				type="date"
				v-model="agendamento.data"
				obrigatorio
				label="Data" />
			<AppFormSelect
				label="Turno"
				:options="turnos"
				v-model="agendamento.turno"
				id="pep" />
			<AppFormInput
				class="grow"
				id="data"
				type="text"
				v-model="agendamento.motivo"
				obrigatorio
				label="Motivo"
				placeholder="Ex: Desenvolvimento do novo módulo no SIAG" />
			<BotaoPadrao
				texto="Agendar"
				cor="!hover:bg-blue-900 bg-blue-800"
        @click="agendar()"
				class="text-white">
				<img
					src="@/assets/icons/save-w.svg"
					alt=""
					class="w-8 h-8" />
			</BotaoPadrao>
		</div>
		<div>
			<AppTabela
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				:totalItens="totalItens"
				altura="calc(100vh - 194px)"
				:dadosSql="true"
				@atualizar="atualizarDados"
				:carregando="carregandoTabela"
				:temDetalhes="false">
				<template v-slot:[`body.checkbox`]="{ item }">
					<AppFormCheckbox
						:id="'checkbox' + item.id"
						:valor="item.id"
            v-model="funcionariosSelecionados"/>
				</template>
				<template v-slot:[`body.rota`]="{ item }">
					<span
						v-if="item.numero || item.local"
						class="whitespace-nowrap">
						{{ item.numero }} - {{ item.local }}
					</span>
				</template>
			</AppTabela>
		</div>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      :tipo="tipoAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
	</div>
</template>

<script>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppTabela from "~/components/Ui/AppTabela.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
  import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
  import AppAlerta from "~/components/Ui/AppAlerta.vue";

	export default {
		name: "HoraExtra",
		components: {
      AppAlerta,
			AppFormCheckbox,
			AppTabela,
			BotaoPadrao,
			AppFormInput,
      AppFormSelect
		},
		data() {
			return {
				agendamento: {
					data: null,
					turno: null,
					motivo: null,
				},
				turnos: [
					{ id: "diurno", nome: "Diurno" },
					{ id: "noturno", nome: "Noturno" },
					{ id: "3° turno", nome: "3° turno" },
				],
				cabecalho: [
					{ nome: "", valor: "checkbox", centralizar: true },
					{ nome: "Hora Extra", valor: "hora_extra", filtro: true, centralizar: true },
					{ nome: "HE Agendada", valor: "hora_extra_projetada", filtro: true, centralizar: true },
					{ nome: "Matricula", valor: "chapa", filtro: true, centralizar: true },
					{ nome: "Nome", valor: "nome", filtro: true },
					{ nome: "Cargo", valor: "cargo", filtro: true },
					{ nome: "Encarregado/Lider SAPO", valor: "encarregado_lider_sapo", filtro: true },
					{ nome: "Rota", valor: "rota", filtro: true },
					{ nome: "Ponto de embarque", valor: "ponto_embarque", filtro: true },
				],
				dados: [],
				filtros: [],
				itensPorPagina: 50,
        totalItens: 0,
				pagina: 1,
				funcionariosSelecionados: [],
				carregandoTabela: false,
        mostrarAlerta: false,
        textoAlerta: null,
        tipoAlerta: "sucesso"
			}
		},
		created() {
			this.buscarFuncionarios()
		},
		methods: {
			async buscarFuncionarios() {
				this.carregandoTabela = true
				let setorId = this.$auth.user.setor_id

				let resp = await this.$axios.$get("/hora_extra/buscar/funcionarios", {
					params: { setorId, page: this.pagina - 1, size: this.itensPorPagina },
				})

				if (!resp.falha) {
					let funcionarios = resp.dados.funcionarios
					this.totalItens = parseInt(resp.dados.totalItens)
					this.dados = funcionarios
					this.carregandoTabela = false
				}
			},

			async atualizarDados(parametros) {
				let { itensPorPagina, pagina, filtros } = parametros

				if (itensPorPagina) this.itensPorPagina = itensPorPagina

				if (pagina) this.pagina = pagina

				if (filtros) this.filtros = filtros

				await this.buscarFuncionarios()
			},

      async agendar(){
        let {data, turno, motivo} = this.agendamento;

        if (this.$dayjs().isAfter(data, "day")) {
          this.mostrarAlerta = true;
          this.tipoAlerta = "erro";
          this.textoAlerta = "Não é possivel agendar para dias anteriores !";
        }else{
          console.log(this.funcionariosSelecionados)

          let funcionarios = this.funcionariosSelecionados
          let agendado_por_id = this.$auth.user.id;

          let cont = 0
          let funcPrEnviar = []
          let total = 0

          for(let chapa of funcionarios){
            console.log(chapa)
            funcPrEnviar.push(chapa)
            cont += 1
            total += 1

            if(cont === 5 || total === funcionarios.length){
              console.log("Enviar")
            }

          }



          // await this.$axios.$post("/hora_extra/agendar/novo_padrao", { funcionarios, data, turno, motivo, agendado_por_id })


        }
      },
		},
	}
</script>

<style scoped></style>
