<template>
	<div class="flex flex-col w-full">
		<div class="flex w-full bg-primaria-700 text-white">
			<span>Ultima atualização: 08:46 18/07/2023</span>
			<span>RH</span>
			<button @click="iniciarFila()">Iniciar</button>
		</div>
		<div class="grid grid-cols-2 gap-2 mt-2">
			<div>
				<div class="p-1 bg-white border border-gray-200">
					<div class="w-full bg-lime-400 text-xl font-bold border-b border-black px-2 text-center">
						<span>Próximo da fila</span>
					</div>
					<div class="bg-gray-300" v-if="fila[0]">
						<!--            <span>Henrique Mariano</span>-->
						<span>{{ fila[0].Funcionario.chapa }} - {{ fila[0].Funcionario.nome }}</span>
						<span>{{ $dayjs(fila[0].entrada_fila).format("DD/MM/YYYY") }}</span>
					</div>
				</div>
				<div>
					<div
						class="w-full bg-yellow-400 text-xl font-bold border-b border-black px-2 text-center">
						<span>Fila</span>
					</div>
          {{ fila }}
					<div
						v-for="(passagem, index) of fila"
						:key="passagem.id">
						<div
							class="funcionario-proximo-lista"
							v-if="passagem.entrada_atendimento == null && index != 0 && passagem">
							<span>{{ passagem.Funcionario.chapa }} - {{ passagem.Funcionario.nome }}</span>
							<span>{{ $dayjs(passagem.entrada_fila).format("DD/MM/YYYY") }}</span>
						</div>
					</div>
				</div>
			</div>
			<div>
				<div>
					<div class="w-full bg-blue-400 text-xl font-bold border-b border-black px-2 text-center">
						Em atendimento
					</div>
          <div
            v-for="(passagem, index) of atendimento"
            :key="passagem.id">
            <div
              class="funcionario-proximo-lista"
              v-if="passagem.entrada_atendimento != null &&
										passagem.saida_atendimento == null">
              <span>{{ passagem.Funcionario.chapa }} - {{ passagem.Funcionario.nome }}</span>
              <span>{{ $dayjs(passagem.entrada_fila).format("DD/MM/YYYY") }}</span>
            </div>
          </div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import io from "socket.io-client"

	export default {
		data() {
			return {
				filaIniciada: false,
				fila: [],
				atendimento: [],
				ultimaAtualizacao: null,
				mostrarRelatorio: false,
			}
		},
		async created() {
			this.socket = io("http://localhost:3000", { autoConnect: false })
			this.socket.connect()

			this.socket.on("connect", () => {
				this.conectado = true
			})

			this.socket.on("atualizarLista", (dados) => {
				console.log(dados)
				for (let func of dados.dados) {
					if (func.entrada_fila != null) {
						this.fila.push(func)
					}

					if (func.entrada_atendimento != null) {
						this.atendimento.push(func)

						let index = this.fila.findIndex((obj) => {
							return obj.id == func.id
						})

						if (index >= 0) {
							this.fila.splice(index, 1)
						}
					}

					if (func.saida_atendimento != null) {
						let index = this.atendimento.findIndex((obj) => {
							return obj.id == func.id
						})

						if (index >= 0) {
							this.atendimento.splice(index, 1)
						}
					}
				}
				this.ultimaAtualizacao = this.$dayjs().format("HH:mm DD/MM/YYYY")
			})
		},

		methods: {
			iniciarFila() {
				this.filaIniciada = true
				console.log("Iniciando fila")
				let dados = { local_id: 4 }
				if (this.conectado) {
					this.socket.emit("buscandoFila", dados)
					console.log(dados)
				}
			},
			reiniciarFila() {
				this.socket.off()
				this.atendimento = []
				this.fila = []
				this.socket.connect()
				this.iniciarFila()
			},
		},
	}
</script>

<style scoped></style>
