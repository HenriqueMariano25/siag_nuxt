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
								obrigatorio
								v-model="rotaLocal.veiculo_id"
								id="status"
								:invalido="erros.includes('veiculo_id')" />
							<AppFormSelect
								label="Turno"
								:options="turnos"
								obrigatorio
								v-model="rotaLocal.turno"
								id="status"
								:invalido="erros.includes('turno')" />
              <AppFormRadio
                id="mostrarGrafico"
                simNao
                v-model="rotaLocal.mostrar_grafico"
                :invalido="erros.includes('mostrar_grafico')"
                titulo="Mostrar em relátorios ?" />
						</div>
					</template>
					<template v-slot:[`tab.passageiros`]="{ item }">
						<TabelaPadrao
							:cabecalho="cabecalho"
							:dados="dados"
							:itensPorPagina="itensPorPagina"
							:pagina="pagina"
							@pagina="pagina = $event"
							classPersonalizada="!bg-red-300 hover:!bg-gray-600"
							@filtros="filtros = $event"
							@ordem="ordem = $event"
							:totalItens="totalItens"
							altura="calc(100vh - 279px)"
							@atualizar="buscarFuncionarios"
							:temDetalhes="false">
							<template v-slot:[`body.acoes`]="{ item, index }">
								<div class="flex gap-1">
									<BotaoPadrao
										v-if="funcionario_id !== index"
										@click="funcionario_id = index"
										icone>
										<div class="w-6 h-6 flex items-center justify-center">
											<img
												src="@/assets/icons/delete-b.svg"
												alt=""
												class="w-6 h-6" />
										</div>
									</BotaoPadrao>
									<BotaoPadrao
										v-if="funcionario_id !== index"
										@click="alterarDaRota(item, index)"
										icone>
										<div class="w-6 h-6 flex items-center justify-center">
											<img
												src="@/assets/icons/edit-b.svg"
												alt=""
												class="w-6 h-6" />
										</div>
									</BotaoPadrao>
									<BotaoPadrao
										cor="bg-red-400 hover:!bg-red-500"
										texto="NÃO"
										class="!px-1"
										v-if="funcionario_id === index"
										@click="funcionario_id = null" />
									<BotaoPadrao
										cor="bg-green-400 hover:!bg-green-500"
										texto="SIM"
										class="!px-2"
										v-if="funcionario_id === index"
										@click="item.chapa ? deletarFuncionario(index) : deletarTerceiro(index)" />
								</div>
							</template>
						</TabelaPadrao>
					</template>
				</AppTabs>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex justify-end gap-2 items-center">
					<div
						class="text-red-500 text-xl mr-3"
						v-if="erros.length > 0">
						<span>Campos obrigatórios necessários</span>
					</div>
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
						texto="Terceiro"
						cor="bg-green-400 hover:!bg-green-500"
						v-if="tab === 'passageiros'"
						@click="mostrarDialogAdicionarTerceiro = true">
						<img
							src="@/assets/icons/add-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="Funcionário"
						cor="bg-green-400 hover:!bg-green-500"
						v-if="tab === 'passageiros'"
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
			@cancelar="mostrarDialogAdicionarFuncionario = false"
			@adicionado="adicionadoFuncionario"
			:funcionario="funcionario" />
		<DialogAdicionaTerceiro
			v-if="mostrarDialogAdicionarTerceiro"
			:rota_id="rota.id"
			@cancelar="mostrarDialogAdicionarTerceiro = false"
			@adicionado="adicionadoTerceiro"
			:terceiro="terceiro" />
		<DialogAlterarDaRota
			v-if="mostrarDialogAlterarDaRota"
			:funcionario="funcionario"
			:terceiro="terceiro"
			:rota="rota"
      :index="index"
      @alterado="alterado"
			@cancelar="cancelarAlterarDaRota()" />
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
	import DialogAdicionaTerceiro from "~/components/Dialogs/Administracao/Transporte/DialogAdicionaTerceiro.vue"
	import DialogAlterarDaRota from "~/components/Dialogs/Administracao/Transporte/DialogAlterarDaRota.vue"
  import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue";
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
          mostrar_grafico: null
				},
				carregando: false,
				veiculos: [],
				turnos: [],
				erros: [],
				tabs: [
					{ nome: "Rota", valor: "rota" },
					{ nome: "Passageiros", valor: "passageiros", disabled: !this.rota },
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
				mostrarDialogAdicionarTerceiro: false,
				funcionario: null,
				terceiro: null,
				mostrarAlerta: false,
				textoAlerta: null,
				funcionario_id: null,
				mostrarDialogAlterarDaRota: false,
				index: null,
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

			async buscarFuncionarios() {
				let rota_id = this.rota.id
				let filtros = this.filtros
				let ordem = this.ordem

				let resp = await this.$axios.$get("/transporte/rotas/passageiros/buscar", {
					params: {
						rota_id,
						page: this.pagina - 1,
						size: this.itensPorPagina,
						filtros,
						ordem,
					},
				})

				if (!resp.falha) {
					let { passageiros } = resp.dados

					this.dados = passageiros
					this.verificaPoltronaDuplicada()
				}
			},

			validarFormulario() {
				this.erros = []

				let camposObrigatorio = ["numero", "local", "horario_saida", "veiculo_id", "turno", "mostrar_grafico"]

				for (let campo of camposObrigatorio) {
					if (this.rotaLocal[`${campo}`] === null || this.rotaLocal[`${campo}`] === "")
						this.erros.push(campo)
				}
			},

			verificaPoltronaDuplicada() {
				for (let pass of this.dados) {
					let encontrados = this.dados.filter((o) => o.poltrona === pass.poltrona)
					pass.ativo = encontrados.length > 1;
				}
			},

			async cadastrarRota() {
				this.validarFormulario()

				if (this.erros.length === 0) {
					let rota = this.rotaLocal
					await this.$axios.$post("/transporte/rota", { rota }).then((resp) => {
						let rotaCriada = resp.rota

						this.$emit("cadastrado", rotaCriada)
					})
				}
			},

			async editarRota() {
				this.validarFormulario()

				if (this.erros.length === 0) {
					let rota = this.rotaLocal

					await this.$axios.$put("/transporte/rota", { rota }).then((resp) => {
						let rota = resp.rota

						this.$emit("editado", rota)
					})
				}
			},

			async deletarRota() {
				let { id } = this.rota

				await this.$axios.$delete(`/transporte/rota/${id}`).then(() => {
					this.$emit("deletado", id)
				})
			},

			async adicionadoFuncionario({ funcionario }) {
				this.dados.push(funcionario)

				this.verificaPoltronaDuplicada()

				this.mostrarDialogAdicionarFuncionario = false
				this.textoAlerta = "Funcionário adicionado com sucesso!"
				this.mostrarAlerta = true
			},

			async adicionadoTerceiro(terceiro) {
				this.dados.push(terceiro)

				this.verificaPoltronaDuplicada()

				this.mostrarDialogAdicionarTerceiro = false
				this.textoAlerta = "Terceiro adicionado com sucesso!"
				this.mostrarAlerta = true
			},

			async deletarFuncionario(index) {
				let funcionario_id = this.dados[index].id

				let usuario_id = this.$auth.user.id
				let rota_id = this.rota.id

				let resp = await this.$axios.$post("/transporte/remover/funcionario", {
					funcionario_id,
					usuario_id,
					rota_id,
				})

				if (!resp.falha) {
					let idx = this.dados.findIndex((o) => o.id === funcionario_id)

					this.dados.splice(idx, 1)
					this.textoAlerta = "Funcionário deletado com sucesso!"
					this.mostrarAlerta = true
					this.funcionario_id = null
				}
			},

			async deletarTerceiro(index) {
				let terceiro_id = this.dados[index].id

				let resp = await this.$axios.$put(`/transporte/remover/terceiro/rota/${terceiro_id}`)

				if (!resp.falha) {
					this.dados.splice(index, 1)
					this.textoAlerta = "Terceiro deletado com sucesso!"
					this.mostrarAlerta = true
					this.funcionario_id = null
				}
			},

			cancelarAlterarDaRota() {
				this.mostrarDialogAlterarDaRota = false
				this.funcionario = null
				this.terceiro = null
        this.index = null
			},

			alterarDaRota(item, index) {
        this.index = index
				if (Object.keys(item).includes("cod_empresa")) {
					this.terceiro = item
				} else {
					this.funcionario = item
				}
				this.mostrarDialogAlterarDaRota = true
			},

      alterado(dados){
        let { index, rota_id, ponto_embarque, poltrona } = dados

        if(rota_id){
          this.dados.splice(index, 1)
          this.textoAlerta = "Alteração para outra rota realizado com sucesso!"
        }else{
          this.textoAlerta = "Funcionário/Terceiro editado com sucesso!"
          this.dados[index].ponto_embarque = ponto_embarque
          this.dados[index].poltrona = poltrona
          this.verificaPoltronaDuplicada()
        }

        this.mostrarDialogAlterarDaRota = false

        this.mostrarAlerta = true
        this.funcionario = null
        this.terceiro = null
        this.index = null
      }
		},
	}
</script>

<style scoped></style>
