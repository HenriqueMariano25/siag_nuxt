<template>
	<div
		class="w-full h-full absolute top-0 left-0 bg-black/50 justify-center items-center flex print:bg-black/0 print:relative"
		style="z-index: 110">
		<div
			class="bg-white flex flex-col rounded print:w-full print:absolute print:bg-red-500"
      :class="{ [largura]: largura }"
			style="z-index: 101">
			<div
				class="rounded-t bg-primaria-700 text-white px-2 py-1 flex items-center justify-between print:hidden">
				<span class="text-3xl">{{ titulo }}</span>
				<button
					class="text-white fill-white"
					@click="$emit('cancelar')">
					<img
						src="@/assets/icons/close-w.svg"
						alt="close"
						class="w-7 h-7" />
				</button>
			</div>
			<div class=" flex w-full print:py-0 relative print:absolute print:top-0">
        <div class="absolute z-50 bg-gray-700/70 flex w-full h-full justify-center" v-if="carregando">
          <div class="flex items-center justify-center">
            <span class="flex text-4xl bg-white p-2 rounded">Carregando... Favor aguarde!</span>
          </div>
        </div>
        <div class="py-2 w-full h-full">
				  <slot name="corpo"></slot>
        </div>
			</div>
			<div
				class="rounded-b bg-primaria-700 text-white px-2 py-1 flex items-center justify-between print:hidden">
				<slot name="rodape">
          <div class="flex items-center">
            <BotaoCancelar @click="$emit('cancelar')"/>
            <slot name="rodape-btn-deletar" v-if="btnDeletar">
              <div>
                <BotaoPadrao texto="Deletar" cor="bg-red-500" class="ml-2" @clique="estaDeletando = !estaDeletando" v-if="!estaDeletando">
                  <template v-slot>
                    <img src="@/assets/icons/delete-b.svg" alt="close" class="w-6 h-6"/>
                  </template>
                </BotaoPadrao>
                <div class="flex items-center ml-2" v-if="estaDeletando" >
                  <BotaoPadrao texto="Não" cor=" bg-red-500" @clique="estaDeletando = false"></BotaoPadrao>
                  <span class="px-2">Certeza que deseja deletar esse item ?</span>
                  <BotaoPadrao texto="Sim" cor="bg-green-500" @clique="deletar"></BotaoPadrao>
                </div>
              </div>
            </slot>
          </div>
					<slot name="rodape-btn-direito"></slot>
				</slot>
			</div>
		</div>
	</div>
</template>

<script>
	import BotaoCancelar from "~/components/Ui/Buttons/BotaoCancelar.vue"
	import BotaoSalvar from "~/components/Ui/Buttons/BotaoSalvar.vue"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
	export default {
		name: "BaseDialog",
		props: {
			titulo: {
				type: String,
				required: true,
				default: "",
			},
      carregando:{
        type: Boolean,
        default: false
      },
      btnDeletar:{
        type: Boolean,
        default: false
      },
      largura:{
        type: String,
        default: 'w-3/4'
      }
		},
		components: {
      BotaoPadrao,
			BotaoCancelar,
			BotaoSalvar,
		},
    data(){
      return{
        estaDeletando: false
      }
    },
    methods:{
      deletar(){
        this.estaDeletando = false
        this.$emit("deletar")
      }
    }
	}
</script>

<style scoped></style>
