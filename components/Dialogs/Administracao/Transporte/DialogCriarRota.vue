<template>
	<div>
		<BaseDialog
			:titulo="rota === null ? 'Criar rota' : `Editando rota - ${rota.numero}`"
			:carregando="carregando"
			:btnDeletar="rota !== null"
			@deletar="deletarRota"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<AppTabs
					:tabs="tabs"
					@tab="tab = $event">
					<template v-slot:[`tab.rota`]="{ item }">
						<div class="px-2 grid grid-cols-3 gap-2">
							<AppFormInput
								label="Número"
								type="text"
								id="numero"
								placeholder="Ex: 02"
								obrigatorio
								:invalido="erros.includes('numero')"
								v-model="rotaLocal.numero" />
							<AppFormInput
								class="col-span-2"
								label="Local"
								type="text"
								id="local"
								placeholder="Ex: São João da Barra"
								obrigatorio
								:invalido="erros.includes('local')"
								v-model="rotaLocal.local" />
							<AppFormInput
								label="Horário de saída"
								type="time"
								id="horario_saida"
								placeholder="Ex: 02"
								obrigatorio
								:invalido="erros.includes('horario_saida')"
								v-model="rotaLocal.horario_saida" />
							<AppFormSelect
								label="Veículo"
								:options="veiculos"
								v-model="rotaLocal.veiculo_id"
								id="status"
								:invalido="erros.includes('veiculo_id')" />
							<AppFormSelect
								label="Turno"
								:options="turnos"
								v-model="rotaLocal.turno"
								id="status"
								:invalido="erros.includes('turno')" />
						</div>
					</template>
					<template v-slot:[`tab.funcionarios`]="{ item }">
						<TabelaPadrao
							:cabecalho="cabecalho"
							:dados="dados"
							:itensPorPagina="itensPorPagina"
							:pagina="pagina"
							@pagina="pagina = $event"
							@filtros="filtros = $event"
							@ordem="ordem = $event"
							:totalItens="totalItens"
							altura="calc(100vh - 279px)"
							@atualizar="buscarFuncionarios"
							:temDetalhes="false">
							<template v-slot:[`body.acoes`]="{ item }">
								<div class="flex gap-1">
									<BotaoPadrao
                    v-if="funcionario_id !== item.id"
										@click="
											funcionario_id = item.id
										"
										icone>
										<div class="w-6 h-6 flex items-center justify-center">
											<img
												src="@/assets/icons/delete-b.svg"
												alt=""
												class="w-6 h-6" />
										</div>
									</BotaoPadrao>
                  <BotaoPadrao cor="bg-red-400 hover:!bg-red-500" texto="NÃO" class="!px-1"  v-if="funcionario_id === item.id" @click="funcionario_id = null"/>
                  <BotaoPadrao cor="bg-green-400 hover:!bg-green-500" texto="SIM" class="!px-2" v-if="funcionario_id === item.id" @click="deletarFuncionario(item.id)"/>
								</div>
							</template>
						</TabelaPadrao>
					</template>
				</AppTabs>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex justify-end">
					<BotaoPadrao
						texto="Salvar"
						@click="rota ? editarRota() : cadastrarRota()"
						v-if="tab === 'rota'">
						<img
							src="@/assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="Funcionário"
						cor="bg-green-400 hover:!bg-green-500"
						v-if="tab === 'funcionarios'"
						@click="mostrarDialogAdicionarFuncionario = true">
						<img
							src="@/assets/icons/add-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
		<DialogAdicionaFuncionario
			v-if="mostrarDialogAdicionarFuncionario"
			:rota_id="rota.id"
			@cancelar="
				mostrarDialogAdicionarFuncionario = false
				rota = null
			"
			@adicionado="adicionado"
			:funcionario="funcionario" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script setup>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import DialogAdicionaFuncionario from "~/components/Dialogs/Administracao/Transporte/DialogAdicionaFuncionario.vue"
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
</script>

<script>
	import { buscarVeiculos, buscarTurnos } from "~/mixins/buscarInformacoes"

	export default {
		mixins: [buscarVeiculos, buscarTurnos],
		props: {
			rota: {
				type: [Object],
				default: null,
			},
		},
		data() {
			return {
				rotaLocal: {
					numero: null,
					local: null,
					horario_saida: null,
					veiculo_id: null,
					turno: null,
				},
				carregando: false,
				veiculos: [],
				turnos: [],
				erros: [],
				tabs: [
					{ nome: "Rota", valor: "rota" },
					{ nome: "Funcionários", valor: "funcionarios" },
				],
				tab: "rota",
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Mátricula", valor: "chapa", filtro: true, ordenar: true },
					{ nome: "Nome", valor: "nome", filtro: true, ordenar: true },
					{ nome: "Poltrona", valor: "poltrona", filtro: true, ordenar: true },
					{ nome: "Ponto de embarque", valor: "ponto_embarque", filtro: true, ordenar: true },
					{ nome: "Empresa", valor: "empresa", filtro: true, ordenar: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogAdicionarFuncionario: false,
				funcionario: null,
				mostrarAlerta: false,
				textoAlerta: null,
        funcionario_id: null
			}
		},
		async created() {
			let veiculos = await this.buscarVeiculos()
			this.veiculos = veiculos.map((o) => {
				return { id: o.id, nome: o.nome }
			})

			let turnos = await this.buscarTurnos()
			this.turnos = turnos.map((o) => {
				return { id: o.descricao, nome: o.descricao }
			})

			if (this.rota !== null) {
				this.carregando = true
				this.rotaLocal = Object.assign({}, this.rota)
				this.carregando = false
				await this.buscarFuncionarios()
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

			async cadastrarRota() {
				let rota = this.rotaLocal
				await this.$axios.$post("/transporte/rota", { rota }).then((resp) => {
					let rotaCriada = resp.rota

					this.$emit("cadastrado", rotaCriada)
				})
			},

			async editarRota() {
				let rota = this.rotaLocal

				await this.$axios.$put("/transporte/rota", { rota }).then((resp) => {
					let rota = resp.rota

					this.$emit("editado", rota)
				})
			},

			async deletarRota() {
				let { id } = this.rota

				await this.$axios.$delete(`/transporte/rota/${id}`).then(() => {
					this.$emit("deletado", id)
				})
			},

			async buscarFuncionarios() {
				let funcionarios = await this.$axios
					.get("/transporte/rotas/funcionarios", { params: { id: this.rota.id } })
					.then((resp) => resp.data.funcionarios)

				let passageiros
				passageiros = funcionarios

				let terceiros = await this.$axios
					.get("/transporte/terceiros/rota", { params: { rota_id: this.rota.id } })
					.then((resp) => resp.data.terceiros)

				this.dados.push(...terceiros)

				passageiros.sort(function (a, b) {
					if (parseInt(a.poltrona) > parseInt(b.poltrona)) {
						return 1
					}
					if (parseInt(a.poltrona) < parseInt(b.poltrona)) {
						return -1
					}
					return 0
				})

				this.dados = passageiros
				console.log(this.dados)
			},

			async adicionado({ funcionario }) {
				console.log(funcionario)

				this.dados.push(funcionario)

				this.mostrarDialogAdicionarFuncionario = false
				this.textoAlerta = "Funcionário adiciondo com sucesso!"
				this.mostrarAlerta = true
			},

      async deletarFuncionario(funcionario_id){
        let usuario_id = this.$auth.user.id
        let rota_id = this.rota.id

        let resp = await this.$axios.$post("/transporte/remover/funcionario", { funcionario_id, usuario_id, rota_id })

        if(!resp.falha){
          let idx = this.dados.findIndex( o => o.id === funcionario_id)

          this.dados.splice(idx,1)
          this.textoAlerta = "Funcionário deletado com sucesso!"
          this.mostrarAlerta = true
        }
      }
		},
	}
</script>

<style scoped></style>
