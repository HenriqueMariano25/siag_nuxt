<template>
	<div>
		<BaseDialog
			:titulo="carro === null ? 'Criar carro' : `Editando carro`"
      btn-deletar
      @deletar="deletarCarro"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 grid grid-cols-2 gap-2">
					<AppFormInput
						label="Marca/Modelo"
						type="text"
						obrigatorio
            placeholder="Ex: Volkswagen/Fusca"
						id="marca_modelo"
            :invalido="erros.includes('marca_modelo')"
						v-model="carroLocal.marca_modelo" />
					<AppFormInput
						label="Placa"
						type="text"
						obrigatorio
            placeholder="Ex: ABC1D23 ou ABC-1234"
            :invalido="erros.includes('placa')"
						id="placa"
						v-model="carroLocal.placa" />
					<AppFormInput
						label="CGA"
						mask="####"
						type="number"
						placeholder="Ex: 1234"
						obrigatorio
						id="cga"
            :invalido="erros.includes('cga')"
						v-model="carroLocal.cga" />
					<AppFormSelectCompleto
						id="setore"
						label="Setor"
						:options="setores"
						obrigatorio
            :invalido="erros.includes('setor_id')"
						v-model="carroLocal.setor_id" />
          <AppFormSelectCompleto
            id="status"
            label="Status"
            :options="statusCarro"
            obrigatorio
            :invalido="erros.includes('status_carro_id')"
            v-model="carroLocal.status_carro_id" />
				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="carro ? editarCarro() : cadastrarCarro()">
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
          status_carro_id: 1,
				},
				setores: [],
        statusCarro: [],
        erros: []
			}
		},
		async mounted() {
			let setores = await this.buscarSetores()
			this.setores = setores.map((o) => {
				return { id: o.id, nome: o.nome }
			})
      await this.buscarStatus()

      if(this.carro){
        this.carroLocal = Object.assign({}, this.carro)
      }
		},
		methods: {
      cancelar(){
        this.$emit("cancelar")
      },
      async buscarStatus(){
        let resp = await this.$axios.$get('/transporte/status_carro/buscar')

        if(!resp.falha){
          let status = resp.dados.status

          this.statusCarro = status.map((o) => {
            return { id: o.id, nome: o.descricao }
          })
        }
      },

      limparCampos(campos) {
        for (let key of Object.keys(campos)) {
          if (typeof campos[key] === "string") {
            campos[key] = campos[key].trim()
          }
        }

        return campos
      },

      validarFormulario() {
        this.erros = []

        let camposObrigatorio = [
          "marca_modelo",
          "placa",
          "cga",
          "setor_id",
          "status_carro_id",
        ]

        for (let campo of camposObrigatorio) {
          if (this.carroLocal[`${campo}`] === null || this.carroLocal[`${campo}`] === "")
            this.erros.push(campo)
        }
      },


      async cadastrarCarro(){
        this.carroLocal = this.limparCampos(this.carroLocal)
        this.validarFormulario()

        if(this.erros.length === 0){
          let {
            marca_modelo, placa, cga, setor_id, status_carro_id
          } = this.carroLocal

          try {
            let resp = await this.$axios.$post("/transporte/carro/cadastrar", {
              marca_modelo,
              placa,
              cga,
              setor_id,
              status_carro_id
            })

            if (!resp.falha) {
              let carro = resp.dados.carro

              this.$emit("cadastrado", carro)
            }

          } catch (e) {
            console.log(e);
          }
        }
      },
      async editarCarro(){
        let {
          marca_modelo, placa, cga, setor_id, status_carro_id, id
        } = this.carroLocal

        let resp = await this.$axios.$post("/transporte/carro/editar", {
          id,
          marca_modelo,
          placa,
          cga,
          setor_id,
          status_carro_id
        })

        if (!resp.falha) {
          let carro = resp.dados.carro

          this.$emit("editado", carro)
        }
      },

      async deletarCarro(){
        let { id } = this.carro

        let resp = await this.$axios.$post("/transporte/carro/deletar", {
          id,
        })

        if (!resp.falha) {
          this.$emit("deletado", id )
        }
      }
    },
	}
</script>

<style></style>
