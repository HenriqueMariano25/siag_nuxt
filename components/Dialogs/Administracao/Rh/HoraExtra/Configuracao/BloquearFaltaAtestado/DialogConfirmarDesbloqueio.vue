<template>
	<div>
		<BaseDialog
			titulo="Importar arquivo"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="flex flex-col px-2 gap-2">
					<div class="flex w-full max-h-[600px] overflow-y-auto">
						<table class="w-full tabela">
							<thead class="bg-blue-800 text-white">
								<tr>
									<th>Matrícula</th>
									<th>Nome</th>
									<th>Cargo</th>
									<th>Setor</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="funcionario of funcionarios">
									<td>
										{{ funcionario.chapa }}
									</td>
                  <td>
                    {{ funcionario.nome }}
                  </td>
                  <td>
                    {{ funcionario.cargo }}
                  </td>
                  <td>
                    {{ funcionario.setor ? funcionario.setor.nome : null }}
                  </td>
								</tr>
							</tbody>
						</table>
					</div>
          <div class="text-center">
            <span class="text-xl font-bold">CONFIRMAR DESBLOQUEIO DE FUNCIONÁRIOS PARA AGENDAMENTO ?</span>
          </div>
				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao
          texto="desbloquear"
          @clique="desbloquear()">
          <img
            src="@/assets/icons/lock-open-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
      </template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

	export default {
		components: { BotaoPadrao, BaseDialog },
		props: {
			funcionarios: {
				type: Array,
			},
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
      async desbloquear(){
        let funcionarios = this.funcionarios.map(o => o.id)

        let resp = await this.$axios.$post("/hora_extra/configuracao/desbloquear_falta_atestado", { funcionarios })

        if(!resp.falha){
          this.$emit("desbloqueados")
        }
      }
		},
	}
</script>

<style scoped>
.tabela th, .tabela td {
  border: 1px solid #4b5563;
  padding: 0 5px;
}
</style>
