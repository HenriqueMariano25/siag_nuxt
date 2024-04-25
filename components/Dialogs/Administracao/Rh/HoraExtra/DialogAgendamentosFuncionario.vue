<template>
	<div>
		<BaseDialog
			titulo="Agendamentos"
			@cancelar="cancelar()">
			<template v-slot:corpo>
        <div class="overflow-y-auto" style="max-height: calc(100vh - 150px)">
          <div class="grid grid-cols-3 gap-2 px-2" v-if="agendamentos.length > 0">
            <div
              v-for="agend of agendamentos"
              class="border border-gray-900 p-1 w-full">
              <div class="justify-center flex">
							<span class="text-center font-bold text-xl mb-1 w-full">
								{{ $dayjs(agend.data).format("DD/MM/YYYY") }}
							</span>
              </div>
              <div class="w-full flex justify-center font-bold">
                <span>{{ agend.StatusAgendamento.descricao }}</span>
              </div>
              <div class="flex flex-col">
                <span class="titulo"> Motivo </span>
                <span class="texto">{{ agend.motivo }}</span>
              </div>
              <div class="flex flex-col">
                <span class="titulo">Agendado por</span>
                <span class="texto">{{ agend.agendado_por.nome }}</span>
              </div>
            </div>
          </div>
          <div class="flex justify-center text-2xl text-gray-700 font-bold" v-else>
            <span>SEM AGENDAMENTOS NESSA COMPENTÊNCIA</span>
          </div>
        </div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"

	export default {
		components: { BaseDialog },
		props: {
			matricula: {
				type: String,
			},
		},
		data() {
			return {
				agendamentos: [],
			}
		},
		mounted() {
			if (this.matricula) {
				this.buscarAgendamentos()
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarAgendamentos() {
				let resp = await this.$axios.$get("/hora_extra/funcionario/buscar_agendamentos", {
					params: { matricula: this.matricula },
				})

				if (!resp.falha) {
					console.log(resp.dados.agendamentos)
					this.agendamentos = resp.dados.agendamentos
				}
			},
		},
	}
</script>

<style scoped>
	.titulo {
		margin-left: 8px;
		font-size: 14px;
		color: #2f2f2f;
		font-weight: 600;
	}
	.texto {
		font-size: 16px;
	}
</style>
