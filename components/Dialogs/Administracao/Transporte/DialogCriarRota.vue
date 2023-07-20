<template>
	<div>
		<BaseDialog
			:titulo="rota === null ? 'Criar rota' : `Editando rota - ${rota.numero}`"
			:carregando="carregando"
			:btnDeletar="rota !== null"
			@deletar="deletarRota"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 grid grid-cols-3 gap-2">
					<AppFormInput
						label="Número"
						type="text"
						id="numero"
						placeholder="Ex: 02"
						obrigatorio
						:invalido="erros.includes('numero')"
						v-model="rotaLocal.numero" />
					<AppFormInput
            class="col-span-2"
						label="Local"
						type="text"
						id="local"
						placeholder="Ex: São João da Barra"
						obrigatorio
						:invalido="erros.includes('local')"
						v-model="rotaLocal.local" />
					<AppFormInput
						label="Horário de saída"
						type="time"
						id="horario_saida"
						placeholder="Ex: 02"
						obrigatorio
						:invalido="erros.includes('horario_saida')"
						v-model="rotaLocal.horario_saida" />
					<AppFormSelect
						label="Veículo"
						:options="veiculos"
						v-model="rotaLocal.veiculo_id"
						id="status"
						:invalido="erros.includes('veiculo_id')" />
					<AppFormSelect
						label="Turno"
						:options="turnos"
						v-model="rotaLocal.turno"
						id="status"
						:invalido="erros.includes('turno')" />
				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <div class="flex justify-end">
          <BotaoPadrao texto="Salvar" @click="rota ? editarRota() : cadastrarRota()">
            <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import { buscarVeiculos, buscarTurnos } from "~/mixins/buscarInformacoes"

	export default {
		mixins: [buscarVeiculos, buscarTurnos],
		components: {
			BaseDialog,
		},
		props: {
			rota: {
				type: [Object],
				default: null,
			},
		},
		data() {
			return {
				rotaLocal: {
          numero: null,
          local: null,
          horario_saida: null,
          veiculo_id: null,
          turno: null
				},
				carregando: false,
				veiculos: [],
				turnos: [],
				erros: [],
			}
		},
		async created() {
			let veiculos = await this.buscarVeiculos()
			this.veiculos = veiculos.map((o) => {
				return { id: o.id, nome: o.nome }
			})

			let turnos = await this.buscarTurnos()
			this.turnos = turnos.map((o) => {
				return { id: o.descricao, nome: o.descricao }
			})

      if (this.rota !== null) {
        this.carregando = true
        this.rotaLocal = Object.assign({}, this.rota)
        this.carregando = false
      }
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
      async cadastrarRota() {
        let rota = this.rotaLocal;
        await this.$axios
          .$post("/transporte/rota", { rota })
          .then((resp) => {
            let rotaCriada = resp.rota;

            this.$emit("cadastrado", rotaCriada);
          });
      },

      async editarRota() {
        let rota = this.rotaLocal;

        await this.$axios
          .$put("/transporte/rota", { rota })
          .then((resp) => {
            let rota = resp.rota;

            this.$emit("editado", rota);
          });
      },

      async deletarRota() {
        let { id } = this.rota;

        await this.$axios.$delete(`/transporte/rota/${id}`).then(() => {
          this.$emit("deletado", id);
        });
      },
		},
	}
</script>

<style scoped></style>
<script setup>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
</script>
