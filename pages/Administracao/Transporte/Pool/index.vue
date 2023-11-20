<template>
	<div class="w-full">
		<CabecalhoPagina titulo="POOL" />
		<div class="w-full bg-white grid grid-cols-5 gap-2 overflow-y-auto !mt-11 print:hidden p-2">
			<div
				v-for="carro of carros"
				@click="abrirDialogPool(carro)"
				class="flex flex-col bg-white border border-gray-500 rounded shadow-md shadow-black/30 text-center w-full justify-center cursor-pointer card-carro">
				<div class="p-2 flex flex-col">
					<span class="font-bold text-xl">CGA-{{ carro.cga }}</span>
				</div>
				<div
					class="flex text-sm text-center gap-2 w-full justify-center"
					v-if="carro.Pool[0]">
					<span class="uppercase">{{ carro.Pool[0].Funcionario.nome.split(" ")[0] }}</span>
					<span class="text-md uppercase">- {{ carro.Pool[0].AtendimentoPool.local }}</span>
				</div>
				<div
					v-else
					class="text-sm">
					<span>NO ESTACINAMENTO</span>
				</div>
				<div
					class="flex text-center justify-center bg-green-400 rounded-b h-[32px] items-center border-t-2 border-green-500"
					:class="{
						'!bg-blue-400 !border-blue-500': carro.Pool[0] && carro.Pool[0].status_pool_id === 1,
					}">
					<span class="uppercase"
						><strong>{{
							carro.Pool[0] && carro.Pool[0].status_pool_id === 1
								? `Aberto - ${carro.Pool[0].hora_inicial}`
								: "Disponível"
						}}</strong></span
					>
				</div>
			</div>
		</div>
		<RodapePagina>
			<template v-slot>
        <div>
          <BotaoPadrao texto="Histórico" @clique="$router.push('pool/historico')">
            <img src="../../../../assets/icons/list-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
		</RodapePagina>
		<DialogAbrirPool
			v-if="mostrarDialogAbrirPool"
			@cancelar="
				mostrarDialogAbrirPool = false
				carro_id = null
			"
			@poolIniciado="poolIniciado"
			:carro_id="carro_id" />
		<DialogFinalizarPool
			v-if="mostrarDialogFinalizarPool"
			@cancelar="
				mostrarDialogFinalizarPool = false
				pool_id = null
			"
      @poolFinalizado="poolFinalizado"
			:pool_id="pool_id" />
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
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import DialogAbrirPool from "~/components/Dialogs/Administracao/Transporte/Pool/DialogAbrirPool.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogFinalizarPool from "~/components/Dialogs/Administracao/Transporte/Pool/DialogFinalizarPool.vue"

	export default {
		name: "Pool",
		components: {
			DialogFinalizarPool,
			AppAlerta,
			DialogAbrirPool,
			RodapePagina,
			BotaoPadrao,
			AppTabs,
			CabecalhoPagina,
		},
		data() {
			return {
				tabs: [
					{ nome: "Pool", valor: "pool" },
					{ nome: "Historico", valor: "historico" },
				],
				carros: [],
				mostrarDialogAbrirPool: false,
				mostrarDialogFinalizarPool: false,
				carro_id: null,
				mostrarAlerta: false,
				textoAlerta: null,
        pool_id: null,
			}
		},
		mounted() {
			this.buscarCarros()
		},
		methods: {
			async buscarCarros() {
				let resp = await this.$axios.$get("/pool/todosCarros")

				if (!resp.falha) {
					console.log(resp.dados.carros)

					this.carros = resp.dados.carros
				}
			},
			abrirDialogPool(carro) {
				this.carro_id = carro.id

				if (carro.Pool.length === 0) {
					this.mostrarDialogAbrirPool = true
				}else{
          this.pool_id = carro.Pool[0].id
          this.mostrarDialogFinalizarPool = true
        }
			},

			async poolIniciado({ pool, carro_id }) {
				let idx = this.carros.findIndex((o) => o.id === carro_id)

				if (idx >= 0) {
					if (this.carros[idx].Pool) {
						if (this.carros[idx].Pool.length === 0) {
							this.carros[idx].Pool.push(pool)
						} else {
							this.carros[idx].Pool = []
						}
					}
				}

				this.mostrarDialogAbrirPool = false
				this.textoAlerta = "Pool iniciado com sucesso!"
				this.mostrarAlerta = true
			},

      async poolFinalizado({ pool}) {
        console.log(pool);

        let idx = this.carros.findIndex((o) => o.id === pool.carro_id)

        if (idx >= 0) {
              this.carros[idx].Pool = []
          }

        this.mostrarDialogFinalizarPool = false
        this.textoAlerta = "Pool finalizado com sucesso!"
        this.mostrarAlerta = true
      },
		},
	}
</script>

<style scoped>
	.card-carro {
	}

	.card-carro:hover {
		background-color: #d7d7d7;
		border: 1px solid black;
	}
</style>
