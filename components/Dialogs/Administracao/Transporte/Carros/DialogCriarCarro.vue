<template>
	<div>
		<BaseDialog
			:titulo="carro === null ? 'Criar carro' : `Editando carro`"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 grid grid-cols-2 gap-2">
					<AppFormInput
						label="Marca/Modelo"
						type="text"
						obrigatorio
            placeholder="Ex: Volkswagen/Fusca"
						id="marca_modelo"
						v-model="carroLocal.marca_modelo" />
					<AppFormInput
						label="Placa"
						type="text"
						obrigatorio
            placeholder="Ex: ABC1D23 ou ABC-1234"
						id="placa"
						v-model="carroLocal.placa" />
					<AppFormInput
						label="CGA"
						mask="####"
						type="number"
						placeholder="Ex: 1234"
						obrigatorio
						id="cga"
						v-model="carroLocal.cga" />
					<AppFormSelectCompleto
						id="setore"
						label="Setor"
						:options="setores"
						obrigatorio
						v-model="carroLocal.setor_id" />
				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="cadastrarCarro()">
          <img src="../../../../../assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import { buscarSetores } from "~/mixins/buscarInformacoes"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

	export default {
		mixins: [buscarSetores],
		components: { BotaoPadrao, BaseDialog, AppFormInput, AppFormSelectCompleto },
		props: {
			carro: {
				type: [Object],
			},
		},
		data() {
			return {
				carroLocal: {
					marca_modelo: null,
					placa: null,
					cga: null,
					setor_id: null,
				},
				setores: [],
			}
		},
		async mounted() {
			let setores = await this.buscarSetores()
			this.setores = setores.map((o) => {
				return { id: o.id, nome: o.nome }
			})
		},
		methods: {
      cancelar(){
        this.$emit("cancelar")
      },
      async cadastrarCarro(){
        // let { marca_modelo, placa, cga, setor_id } = this.carroLocal
        //
        // try {
        //
        // }catch (e){
        //
        // }

        this.$emit("cadastrado")
      },
    },
	}
</script>

<style></style>
