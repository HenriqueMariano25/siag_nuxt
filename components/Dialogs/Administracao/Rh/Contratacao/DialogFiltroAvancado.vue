<template>
	<BaseDialog
		titulo="Filtros avançados"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div class="px-2">
<!--				<AppFormCheckbox-->
<!--					label="Necessita Notebook, Computador ou Login ?"-->
<!--					id="equipamento_id"-->
<!--					valor="$CardTemEquipamentoCards.equipamento_card_id$:int:1"-->
<!--					v-model="filtros" />-->
				<div>
					<span class="text-xl">Mobilização</span>
					<AppFormCheckbox
						label="Local"
						id="local"
						valor="local"
						v-model="mobilizacao" />
					<AppFormCheckbox
						label="Alojado"
						id="alojado"
						valor="alojado"
						v-model="mobilizacao" />
					<AppFormCheckbox
						label="República"
						id="republica"
						valor="república"
						v-model="mobilizacao" />
					<AppFormCheckbox
						label="Moradia fámiliar"
						id="moradia_familiar"
						valor="moradia fámiliar"
						v-model="mobilizacao" />
				</div>
			</div>
		</template>
		<template v-slot:rodape-btn-direito>
			<BotaoPadrao
				texto="Filtrar"
				@click="filtrar()">
				<img
					src="@/assets/icons/filter-b.svg"
					alt="close"
					class="w-6 h-6" />
			</BotaoPadrao>
		</template>
	</BaseDialog>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	export default {
		name: "DialogFiltroAvancado",
		components: {
			BaseDialog,
			AppFormCheckbox,
			BotaoPadrao,
		},
		data() {
			return {
				filtros: [],
        mobilizacao: []
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			filtrar() {
				let filtrosPrPreparar = this.filtros
        let filtros = {}

        if(this.mobilizacao.length > 0){
          filtros['mobilizacao'] = {$in: this.mobilizacao}
        }

        // console.log(filtrosPrPreparar)
        for(let f of filtrosPrPreparar){
          console.log(f)
          let campos = f.split(":")
          console.log(campos)
          let novoFiltros

          if(campos[1] === 'int')
            // novoFiltros = { [campos[0]]: parseInt(campos[2])}
            filtros[campos[0]] = {$in: [parseInt(campos[2])]}
          else
            filtros[campos[0]] = campos[1]
            // novoFiltros = { [campos[0]]: campos[1]}

          // console.log(novoFiltros)
        }

        console.log(filtros)
        // console.log(this.mobilizacao)

        this.$emit("filtrar", filtros)
      }

				// console.log(filtros)

      //   for(let f of this.filtros){
      //     // console.log(f)
      //     // let key = f.split(":")[0]
      //     //
      //     // console.log(key)
      //
      //     // if(key === 'mobilizacao'){
      //     //   console.log('aqui')
      //     //   filtrosFinais['mobilizacao'] = {$in: `%${filtros[f]}%`}
      //     //   // filtrosProntos['mobilizacao']['$or'].push(f.split(":")[1])
      //     // }
      //     //
      //     // console.log(filtrosProntos)
      //   }
      //
			// 	// this.$emit("filtrar", filtros)
			// },
		},
	}
</script>

<style scoped></style>
