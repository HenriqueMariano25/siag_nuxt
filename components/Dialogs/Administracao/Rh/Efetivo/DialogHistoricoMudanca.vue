<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			titulo="Histórico Mudança"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2">
					<div class="px-2 gap-2 text-xl grid grid-cols-3 bg-gray-300 border-b border-gray-400 text-center">
						<span>
							Chapa: <strong>{{ funcionario.chapa }}</strong>
						</span>
						<span>
							Nome: <strong>{{ funcionario.nome }}</strong>
						</span>
						<span>
							Cargo: <strong>{{ funcionario.cargo }}</strong>
						</span>
					</div>
          <div class="mt-2 flex flex-col gap-2 max-h-[500px] overflow-y-auto">
            <div v-for="mudanca of funcionario.HistoricoMudancaFunc" class="bg-blue-100 p-2 border border-blue-300 rounded ">
              <div class="flex w-full justify-between">
                <span><strong>Editado por: </strong>{{ mudanca.Usuario.nome }}</span>
                <span>{{ $dayjs(mudanca.createdAt).format("DD/MM/YYYY HH:mm:ss") }}</span>
              </div>
              <div class="bg-gray-200 px-2 border border-gray-300 mt-1">
                <span class="text-xl"><strong>Mudança</strong></span>
                <pre>{{ mudanca.mudanca }}</pre>
              </div>
            </div>
          </div>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>
<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"

	import { defineComponent } from "vue"

	export default defineComponent({
		name: "DialogMostrarHistoricoMudanca",
		components: {
			BaseDialog,
		},
		props: {
			funcionario_id: {
				type: Number,
				required: true,
			},
		},
		data() {
			return {
				funcionario: {},
			}
		},
		created() {
			this.buscarFuncionario()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarFuncionario() {
				// console.l
				let funcionario_id = this.funcionario_id

				let resp = await this.$axios.$get("/efetivo/buscar/funcionario", {
					params: { id: funcionario_id },
				})

				if (!resp.falha) {
					let funcionario = resp.dados.funcionario
					this.funcionario = funcionario

					console.log(funcionario)
				}
			},
		},
	})
</script>

<style scoped></style>
