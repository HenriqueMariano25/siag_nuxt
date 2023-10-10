<template>
	<div>
		<BaseDialog
			:titulo="fila === null ? 'Criar fila' : `Editando fila - ${fila.local}`"
			:carregando="carregando"
			:btnDeletar="fila !== null"
			@deletar="deletarFila"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div
					class="flex flex-col w-full overflow-auto px-2 gap-2"
					style="max-height: calc(80vh)">
					<div
						class="w-full flex gap-x-3 gap-y-3"
						ref="formulario">
						<AppFormInput
							label="Local"
							type="text"
							id="local"
							placeholder="Ex: Ferramentaria"
							:invalido="erros.includes('local')"
							v-model="filaLocal.local" />
					</div>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex gap-2">
              <AppFormInput
                label="N° Inner Fila"
                type="text"
                id="n_inner_fila"
                placeholder="Ex: 1"
                v-model="filaLocal.n_inner_fila" />
              <div class="flex items-end">
                <BotaoPadrao cor="bg-blue-300 hover:!bg-blue-400" @clique="adicionarInnerFila()">
                  <img src="@/assets/icons/add-b.svg" alt="" class="w-7 h-7">
                </BotaoPadrao>
              </div>
              <div class="flex flex-col bg-gray-100 border border-gray-200 p-1 rounded">
                <span class="whitespace-nowrap">Inners p/ Fila</span>
                <div class="flex gap-2">
                  <button v-for="inner of filaLocal.leitores_fila"
                          class="bg-gray-300 border border-gray-400 rounded hover:border-red-400 numero-inner"
                          @dblclick="removerInnerFila(inner)">
                    <span class="texto px-2">{{ inner }}</span>
                    <span class="icone px-1"><img src="@/assets/icons/delete-b.svg" alt="" class="w-6 h-6"></span>
                  </button>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <AppFormInput
                label="N° Inner Atendimento"
                type="text"
                id="n_inner_atendimento"
                placeholder="Ex: 2"
                v-model="filaLocal.n_inner_atendimento" />
              <div class="flex items-end">
                <BotaoPadrao cor="bg-blue-300 hover:!bg-blue-400" @clique="adicionarInnerAtendimento()">
                  <img src="@/assets/icons/add-b.svg" alt="" class="w-7 h-7">
                </BotaoPadrao>
              </div>
              <div class="flex flex-col bg-gray-100 border border-gray-200 p-1 rounded">
                <span class="whitespace-nowrap">Inners p/ Atendimento</span>
                <div class="flex gap-2">
                  <button v-for="inner of filaLocal.leitores_atendimento"
                          class="bg-gray-300 border border-gray-400 rounded hover:border-red-400 numero-inner"
                          @dblclick="removerInnerAtendimento(inner)">
                    <span class="texto px-2">{{ inner }}</span>
                    <span class="icone px-1"><img src="@/assets/icons/delete-b.svg" alt="" class="w-6 h-6"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <div class="flex justify-end">
          <BotaoPadrao texto="Salvar" @clique="fila ? editarFila() : cadastrarFila()">
            <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

	export default {
		components: {
			BaseDialog,
			AppFormInput,
      BotaoPadrao
		},
		props: {
			fila: {
				type: Object,
			},
		},
		data() {
			return {
				filaLocal: {
					local: null,
          n_inner_fila: null,
          n_inner_atendimento: null,
					leitores_fila: [],
					leitores_atendimento: [],
				},
				erros: [],
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
      adicionarInnerFila(){
        let numero = this.filaLocal.n_inner_fila
        this.filaLocal.leitores_fila.push(numero)
        this.filaLocal.n_inner_fila = null
      },
      removerInnerFila(numero){
        let idx = this.filaLocal.leitores_fila.findIndex( o => o === numero)
        if(idx >= 0){
          this.filaLocal.leitores_fila.splice(idx, 1)
        }
      },
      adicionarInnerAtendimento() {
        let numero = this.filaLocal.n_inner_atendimento
        this.filaLocal.leitores_atendimento.push(numero)
        this.filaLocal.n_inner_atendimento = null
      },
      removerInnerAtendimento(numero) {
        let idx = this.filaLocal.leitores_atendimento.findIndex(o => o === numero)
        if (idx >= 0) {
          this.filaLocal.leitores_atendimento.splice(idx, 1)
        }
      },

      async cadastrarFila(){
        console.log("Cadastrado")
      }
		},
	}
</script>

<style scoped>
.numero-inner{
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  display: flex;
}

.texto{
  transition: opacity 0.3s;
  //display: none;
}

.icone {
  display: none;
  //width: 16px;
  //height: 16px;
  //background-size: cover;
  transition: opacity 0.3s;
  //margin-left: -10px;
}

.numero-inner:hover{
  background-color: rgb(252 165 165)
}

.numero-inner:hover .texto{
  opacity: 0;
  display: none;
}

.numero-inner:hover .icone {
  display: block;
  opacity: 1;
}
</style>
