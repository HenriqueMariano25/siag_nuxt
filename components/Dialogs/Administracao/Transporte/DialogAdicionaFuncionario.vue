<template>
	<div>
		<BaseDialog
			titulo="Adicionar FUNCIONÁRIO na rota "
			:carregando="carregando"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="min-h-[230px] max-h-[500px] overflow-y-auto px-2 flex flex-col w-full gap-2">
					<div class="p-1 bg-gray-200 border border-gray-400 gap-1 flex flex-col">
						<div class="text-lg px-1">
							<span
								class="px-1"
								style="border-bottom: 2px solid #00275e"
								>Busque o funcionário para ser adicionado</span
							>
						</div>
						<div class="flex gap-2 w-full items-center">
							<AppFormSelectCompleto
								altura="95px"
								class="grow"
								id="funcionario"
								label="Funcionário"
								:options="funcionarios"
								v-model="funcionarioLocal.funcionario_id"
								:invalido="erros.includes('chapa')" />
							<span>OU</span>
							<AppFormInput
								class="grow"
								label="Matricula"
								type="text"
								id="matricula"
								placeholder="Ex: 1950007307"
								:invalido="erros.includes('chapa')"
								v-model="funcionarioLocal.matricula" />
							<div class="flex self-end">
								<BotaoPadrao
									texto="Buscar"
									cor="bg-blue-300 hover:!bg-blue-400"
									@click="buscarFuncionario()">
									<img
										src="@/assets/icons/magnifier-b.svg"
										alt=""
										class="w-7 h-7" />
								</BotaoPadrao>
							</div>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-y-1 gap-x-2 bg-blue-100 border border-blue-300 p-1">
						<span
							class="col-span-2 px-1 text-gray-700"
							v-if="!buscouFuncionario"
							><strong>Primeiro busque um funcionário</strong></span
						>
						<span class="px-1"
							>Nome: <strong>{{ funcionarioLocal.nome }}</strong>
						</span>
						<span class="px-1"
							>Matrícula
              : <strong>{{ funcionarioLocal.chapa }}</strong>
						</span>

						<div class="flex flex-col text-lg col-span-2">
							<span class="px-1" v-if="funcionarioLocal.rota && funcionarioNaRota === false">
                Rota anterior:
								<strong>
									{{ funcionarioLocal.rota.numero }} - {{ funcionarioLocal.rota.local }}
                </strong>
              </span>
						</div>
						<!--            <span class="px-1 col-span-2">Chapa: <strong>{{ funcionarioLocal.chapa }}</strong> </span>-->
						<AppFormInput
							class="grow"
							:disabled="!buscouFuncionario"
							label="Ponto de embarque"
							type="text"
							id="ponto_embarque"
							placeholder="Ex: Em frente ao Supermercado Sempre Bom"
							v-model="funcionarioLocal.ponto_embarque" />
						<AppFormInput
							class="grow"
							:disabled="!buscouFuncionario"
							label="Poltrona"
							type="text"
							id="poltrona"
							placeholder="Ex: 45"
							v-model="funcionarioLocal.poltrona" />

            <div class="flex flex-col text-lg col-span-2">
              <span v-if="funcionarioLocal.rota && funcionarioNaRota === true" class="text-xl px-2 text-red-700">
                <strong>
                  Esse funcionário já está nessa rota !
                </strong>
              </span>
            </div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<BotaoPadrao
					texto="salvar"
					@click="adicionarFuncionario()"
					:disabled="!buscouFuncionario || funcionarioNaRota ">
					<img
						src="@/assets/icons/save-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	export default {
		components: {
			BotaoPadrao,
			AppFormInput,
			AppFormSelectCompleto,
			BaseDialog,
		},
		props: {
			funcionario: {
				type: Object,
			},
			rota_id: {
				type: Number,
			},
		},
		data() {
			return {
				carregando: false,
				funcionarios: [],
				funcionarioLocal: {
					funcionario_id: null,
					chapa: null,
					matricula: null,
					ponto_embarque: null,
					poltrona: null,
					rota: null,
					id: null,
				},
				erros: [],
				buscouFuncionario: false,
        funcionarioNaRota: false
			}
		},
		created() {
			this.buscarFuncionarios()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarFuncionarios() {
				let resp = await this.$axios.$get("/efetivo/buscar/nomes")

				if (!resp.falha) {
					console.log(resp)
					let funcionarios = resp.dados.funcionarios
					this.funcionarios = funcionarios.map((o) => {
						return { id: o.chapa, nome: o.nome }
					})
				}
			},
			async buscarFuncionario() {
				let chapa
				if (this.funcionarioLocal.funcionario_id !== null)
					chapa = this.funcionarioLocal.funcionario_id
				else if (this.funcionarioLocal.matricula !== null) chapa = this.funcionarioLocal.matricula

				let resp = await this.$axios.$get("/efetivo/buscar/funcionario_rota", { params: { chapa } })

				if (!resp.falha) {
					this.buscouFuncionario = true

          console.log(resp)
					this.funcionarioLocal = Object.assign(this.funcionarioLocal, resp.dados.funcionario)
          if(this.funcionarioLocal.rota.id === this.rota_id){
            this.funcionarioNaRota = true
          }else{
            this.funcionarioNaRota = false
          }
				}
			},
			async adicionarFuncionario() {
				let rota_id = this.rota_id
				let { chapa , ponto_embarque, poltrona } = this.funcionarioLocal
        let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$post("/transporte/adicionar/funcionario", {
					rota_id,
          chapa,
					ponto_embarque,
					poltrona,
          usuario_id
				})

        if(!resp.falha){
          this.$emit("adicionado", { funcionario: this.funcionarioLocal})
          this.textoAlerta = "Rota cadastrada com sucesso!"
          this.mostrarAlerta = true
        }
			},
		},
		watch: {},
	}
</script>

<style scoped></style>
