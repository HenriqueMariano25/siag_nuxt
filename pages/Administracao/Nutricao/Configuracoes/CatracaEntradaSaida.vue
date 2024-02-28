<template>
	<div class="w-full">
		<CabecalhoPagina titulo="Catracas de entrada e saída" />
		<div class="!mt-11">
			<AppTabs
				:tabs="tabs"
				@tab="tab = $event">
				<template v-slot:[`tab.entrada`]="{ item }">
					<TabelaPadrao
						id="entrada"
						:cabecalho="cabecalho"
						:dados="dadosEntrada"
						altura="calc(100vh - 335px)"
						:temRodape="false">
						<template v-slot:[`body.acoes`]="{ item }">
							<div v-if="confirmacaoDeletar && catraca_id === item.id" class="flex gap-1">
								<BotaoPadrao
									texto="não"
									cor="bg-red-400 hover:!bg-red-600"
									class="!py-0.5 !px-1"
									@clique="confirmacaoDeletar = false; catraca_id = null">
								</BotaoPadrao>
                <BotaoPadrao
                  texto="sim"
                  cor="bg-green-400 hover:!bg-green-600"
                  class="!py-0.5 !px-1"
                  @clique="deletarCatraca()">
                </BotaoPadrao>
							</div>
							<div
								class="w-7"
								v-else>
								<BotaoPadrao
									icone
									@clique="
										confirmacaoDeletar = true
										catraca_id = item.id
									">
									<img
										src="@/assets/icons/delete-b.svg"
										alt=""
										class="w-5 h-5" />
								</BotaoPadrao>
							</div>
						</template>
					</TabelaPadrao>
				</template>
        <template v-slot:[`tab.saida`]="{ item }">
          <TabelaPadrao
            id="entrada"
            :cabecalho="cabecalho"
            :dados="dadosSaida"
            altura="calc(100vh - 335px)"
            :temRodape="false">
            <template v-slot:[`body.acoes`]="{ item }">
              <div v-if="confirmacaoDeletar && catraca_id === item.id" class="flex gap-1">
                <BotaoPadrao
                  texto="não"
                  cor="bg-red-400 hover:!bg-red-600"
                  class="!py-0.5 !px-1"
                  @clique="confirmacaoDeletar = false; catraca_id = null">
                </BotaoPadrao>
                <BotaoPadrao
                  texto="sim"
                  cor="bg-green-400 hover:!bg-green-600"
                  class="!py-0.5 !px-1"
                  @clique="deletarCatraca()">
                </BotaoPadrao>
              </div>
              <div
                class="w-7"
                v-else>
                <BotaoPadrao
                  icone
                  @clique="
										confirmacaoDeletar = true
										catraca_id = item.id
									">
                  <img
                    src="@/assets/icons/delete-b.svg"
                    alt=""
                    class="w-5 h-5" />
                </BotaoPadrao>
              </div>
            </template>
          </TabelaPadrao>
        </template>
			</AppTabs>
		</div>
		<RodapePagina>
			<div class="w-full flex justify-end">
				<BotaoPadrao
					:texto="tab === 'entrada' ? 'Adicionar Entrada' : 'Adicionar Saída'"
					@clique="cadastrar()">
					<img
						src="@/assets/icons/add-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</RodapePagina>
		<DialogCadastrarCatracaEntradaSaida
			v-if="mostrarDialogCadastrarCatracaEntradaSaida"
			:tipo-cadastro="tipoCadastro"
			@cancelar="mostrarDialogCadastrarCatracaEntradaSaida = false"
			@cadastrado="cadastrado" />
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCadastrarCatracaEntradaSaida from "~/components/Dialogs/Administracao/Nutricao/Configuracoes/CatracaEntradaSaida/DialogCadastrarCatracaEntradaSaida.vue"

	export default {
		components: {
			DialogCadastrarCatracaEntradaSaida,
			BotaoPadrao,
			RodapePagina,
			TabelaPadrao,
			AppTabs,
			CabecalhoPagina,
		},
		data() {
			return {
				tabs: [
					{ nome: "Entrada", valor: "entrada" },
					{ nome: "Saída", valor: "saida" },
				],
				tab: "entrada",
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-8" },
					{ nome: "Número", valor: "numero" },
				],

				//ENTRADA
				dadosEntrada: [],

				//SAIDA
				dadosSaida: [],

				tipoCadastro: null,
				mostrarDialogCadastrarCatracaEntradaSaida: false,
				textoAlerta: null,
				mostrarAlerta: null,
				confirmacaoDeletar: false,
				catraca_id: null,
			}
		},
		async mounted() {
			await this.buscarCatracas()
		},
		methods: {
			async buscarCatracas() {
				let resp = await this.$axios.$get("/nutricao/catracas/buscar")
				if (!resp.falha) {
					let catracas = resp.dados.catracas
					this.dadosEntrada = catracas.filter((o) => o.tipo === "entrada")
					this.dadosSaida = catracas.filter((o) => o.tipo === "saída")
				}
			},
			cadastrar() {
				if (this.tab === "entrada") {
					this.tipoCadastro = "entrada"
				} else {
					this.tipoCadastro = "saída"
				}

				this.mostrarDialogCadastrarCatracaEntradaSaida = true
			},
			cadastrado(catraca) {
				if (catraca.tipo === "entrada") {
					this.dadosEntrada.push(catraca)
				} else {
					this.dadosSaida.push(catraca)
				}

				this.mostrarDialogCadastrarCatracaEntradaSaida = false
				this.textoAlerta = "Catraca cadastrada com sucesso!"
				this.mostrarAlerta = true
			},

      async deletarCatraca(){
        let id = this.catraca_id

        let resp = await this.$axios.$delete("/nutricao/catracas/deletar", { params: { id }})

        if(!resp.falha){
          let idx
          if(this.tab === 'entrada'){
            idx = this.dadosEntrada.findIndex( o => o.id === id)
            if (idx >= 0) {
              this.dadosEntrada.splice(idx, 1)
            }
          }else{
            idx = this.dadosSaida.findIndex( o => o.id === id)
            if (idx >= 0) {
              this.dadosSaida.splice(idx, 1)
            }
          }
        }

        this.textoAlerta = "Catraca deletada com sucesso!"
        this.mostrarAlerta = true
      }
		},
	}
</script>

<style scoped></style>
