<template>
	<div>
		<BaseDialog
			:titulo="centroCustoLocal.id === null ? 'Criar centro de custo' : `Editando centro de custo - ${centroCusto.descricao}`"
			:btnDeletar="centroCustoLocal.id !== null"
			@deletar="deletarCentroCusto()"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 grid grid-cols-12 gap-2 items-center">
					<AppFormInput
						id="codigo"
						type="text"
						label="Código"
						readonly
            class="col-span-3"
						v-model="centroCustoLocal.id" />
					<AppFormInput
						id="numero_pep"
						type="text"
						label="Número PEP"
						placeholder="Ex: WGNA2-1201039028 "
						obrigatorio
            class="col-span-5"
						v-model="centroCustoLocal.numero_pep" />
          <AppFormSelectCompleto
            id="turno"
            label="Turno"
            :options="setores"
            v-model="centroCustoLocal.setor_id"
            class="grow col-span-4" />
					<AppFormInput
            class="col-span-12"
						id="descricao"
						type="text"
						label="Descrição"
            obrigatorio
						placeholder="Ex: MOI GERÊNCIA COMISSIONAMENTO"
						v-model="centroCustoLocal.descricao" />
				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="centroCustoLocal.id === null ? cadastrarCentroCusto() : editarCentroCusto()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
  import { buscarSetores } from "~/mixins/buscarInformacoes";
	export default {
    mixins: [buscarSetores],
		name: "DialogCriarCentroCusto",
		components: { BaseDialog },
		props: {
			centroCusto: {
				type: Object,
			},
		},
		data() {
			return {
				centroCustoLocal: {
					id: null,
					numero_pep: null,
					setor_id: null,
					descricao: null,
				},
				erros: [],
        setores: []
			}
		},
		async created() {
			let setores = await this.buscarSetores()

      this.setores = setores.map(o => {
        return { id: o.id, nome: o.nome }
      })

			if (this.centroCusto) {
				this.centroCustoLocal = Object.assign({}, this.centroCusto)
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

			validarFormulario() {
				this.erros = []

				let camposObrigatorio = [
					"numero_cbo",
					"nome",
					"descricao",
					"tipo_mao_obra",
					"cct",
					"salario",
				]

				for (let campo of camposObrigatorio) {
					if (this.centroCustoLocal[`${campo}`] === null || this.centroCustoLocal[`${campo}`] === "")
						this.erros.push(campo)
				}
			},

      async cadastrarCentroCusto() {
        let { setor_id, numero_pep, descricao } = this.centroCustoLocal;

        this.validarFormulario()

        if (this.erros.length === 0) {

          try {
            let resp = await this.$axios.$post("/contratacao/centro_custo/cadastrar", {
              setor_id, numero_pep, descricao
            })

            let centroCustoCriada = resp.centroCusto
            this.$emit("cadastrado", centroCustoCriada);

          } catch (error) {
            console.log(error);
          }
        }
      },

      async editarCentroCusto() {
        let { setor_id, numero_pep, descricao, id } = this.centroCustoLocal;

        this.validarFormulario()

        if (this.erros.length === 0) {

          try {
            let resp = await this.$axios.$put("/contratacao/centro_custo/editar", {
              setor_id, numero_pep, descricao,
              id,
            })

            let centroCustoEditada = resp.centroCusto
            this.$emit("editado", centroCustoEditada);

          } catch (error) {
            console.log(error);
          }
        }
      },

      async deletarCentroCusto() {
        let { id } = this.centroCustoLocal;
        try {
          await this.$axios.$delete("/contratacao/centro_custo/deletar", { params: { id } })

          this.$emit("deletado", id);
        } catch (error) {
          console.log(error);
        }
      },
		},
	}
</script>

<style scoped></style>
<script setup>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
  import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue";
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
</script>
