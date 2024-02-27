<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			titulo="Editar motivo"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="w-full px-2">
					<div class="w-full max-h-[400px] overflow-y-auto overflow-x-auto">
						<table class="w-full overflow-x-auto table-auto">
							<thead class="bg-blue-900 text-white">
								<tr>
									<th class="border border-gray-700">Matrícula</th>
									<th class="border border-gray-700">Nome</th>
									<th class="border border-gray-700">Cargo</th>
									<th class="border border-gray-700">Motivo</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="agendamento of agendamentos">
									<td class="text-center border border-gray-700 px-1.5">{{ agendamento.Funcionario ? agendamento.Funcionario.chapa : "" }}</td>
									<td class="border border-gray-700 px-1.5 whitespace-nowrap">{{ agendamento.Funcionario ? agendamento.Funcionario.nome : "" }}</td>
									<td class="border border-gray-700 px-1.5 whitespace-nowrap">{{ agendamento.Funcionario ? agendamento.Funcionario.cargo : "" }}</td>
									<td class="border border-gray-700 px-1.5 whitespace-nowrap">{{ agendamento.motivo }}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<AppFormInput
						id="motivo"
						type="text"
						v-model="motivo"
            label="motivo"
						placeholder="Ex: Apoio a produção" />
				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <div>
          <BotaoPadrao texto="salvar" @clique="editarMotivo()">
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
		components: { BotaoPadrao, AppFormInput, BaseDialog },
		props: {
			agendamentos: {
				type: Array,
			},
		},
		data() {
			return {
				motivo: null,
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
      async editarMotivo(){
        let agendamentos = this.agendamentos.map(o => o.id)
        let motivo = this.motivo

        let resp = await this.$axios.$put("/hora_extra/motivo/editar", { agendamentos, motivo })
        if(!resp.falha){
          this.$emit("motivoEditado", { agendamentos, motivo})
        }
      }
		},
	}
</script>

<style scoped></style>
