<template>
	<BaseDialog
		:titulo="
			avaliacao_id && avaliacao_id ? 'Detalhes - ' + ('000000' + avaliacao_id).slice(-6) : ''
		"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div
				class="flex w-full overflow-auto print:overflow-visible px-2"
				id="imprimir"
				style="height: calc(100vh - 130px)">
				<div
					class="grid grid-cols-1 divide-y divide-gray-300 text-lg w-full"
					v-if="avaliacao">
					<span class="py-1 pl-1 bg-gray-300">
						<strong>FUNCIONÁRIO</strong>
					</span>
					<span class="py-1 pl-1">
						<strong>Nome: </strong>{{ avaliacao.Funcionario ? avaliacao.Funcionario.nome : "" }}
					</span>
					<span class="py-1 pl-1">
						<strong>Matricula: </strong
						>{{ avaliacao.Funcionario ? avaliacao.Funcionario.chapa : "" }}
					</span>
					<span class="py-1 pl-1">
						<strong>Cargo: </strong>{{ avaliacao.Funcionario ? avaliacao.Funcionario.cargo : "" }}
					</span>
					<span class="py-1 pl-1">
						<strong>Formação: </strong
						>{{
							avaliacao.Funcionario && avaliacao.Funcionario.FormacaoDescCargo
								? avaliacao.Funcionario.FormacaoDescCargo.descricao
								: ""
						}}
					</span>
					<span class="py-1 pl-1">
						<strong>Previsão de disponibilidade: </strong
						>{{
							avaliacao.Funcionario && avaliacao.Funcionario.previsao_disponibilidade
								? $dayjs(avaliacao.Funcionario.previsao_disponibilidade).format("MM/YYYY")
								: ""
						}}
					</span>
					<span class="py-1 pl-1 bg-gray-300">
						<strong>CONHECIMENTO</strong>
					</span>
					<span
						class="py-1 pl-1"
						v-for="conhecimento of avaliacao.Funcionario.ConheFuncionarioAvaliacao"
						:key="conhecimento.descricao">
						{{ conhecimento.descricao }}
					</span>
					<span class="py-1 pl-1 bg-gray-300">
						<strong>LOCALIDADE/DISPO. DE TRABALHO</strong>
					</span>
					<span
						class="py-1 pl-1"
						v-for="dispo of avaliacao.Funcionario.DispoTrabalhoAvaliacao"
						:key="dispo.descricao">
						{{ dispo.descricao }}
					</span>
					<span class="py-1 pl-1 bg-gray-300">
						<strong>EXPERIÊNCIAS PROFISSIONAIS</strong>
					</span>
					<div
						class="py-1 px-1 justify-between flex"
						v-for="tipoObra of avaliacao.Funcionario.FuncionarioTemTipoObras">
						<span
							><strong>Obra: </strong
							>{{ tipoObra.TipoObraAvaliacao ? tipoObra.TipoObraAvaliacao.descricao : "" }}</span
						>
						<span
							><strong>Cargo: </strong
							>{{ tipoObra.CargoAvaliacao ? tipoObra.CargoAvaliacao.nome : "" }}</span
						>
						<span><strong>Tempo: </strong>{{ tipoObra.anos ? `${tipoObra.anos} anos` : "" }}</span>
					</div>
					<span class="py-1 pl-1 bg-gray-400">
						<strong>DESCRIÇÃO DO CARGO</strong>
					</span>
					<div class="py-1 px-1 grid grid-cols-12 bg-gray-300">
						<span class="col-span-11">
							<strong>HABILIDADES TÉCNICAS</strong>
						</span>
						<span class="text-center">
							<strong>NOTA</strong>
						</span>
					</div>
          <div class="py-1 px-1 grid grid-cols-12" v-for="habilidade of avaliacao.AvaliacaoTemHabTecnicas">
						<span class="col-span-11">{{
                habilidade.HabilidadeTecnicaAvaliacao
                  ? habilidade.HabilidadeTecnicaAvaliacao.descricao
                  : ""
              }}
            </span>
            <span class="text-center">
              <strong>
              {{ habilidade.nota  ? habilidade.nota : "" }}
                </strong>
            </span>
          </div>
          <div class="py-1 px-1 grid grid-cols-12 bg-gray-300">
						<span class="col-span-11">
							<strong>HABILIDADES COMPORTAMENTAL</strong>
						</span>
            <span class="text-center">
							<strong>NOTA</strong>
						</span>
          </div>
          <div class="py-1 px-1 grid grid-cols-12" v-for="conhecimento of avaliacao.ConheComportamentalAvaliacao">
						<span class="col-span-11">{{
                conhecimento.descricao
                  ? conhecimento.descricao
                  : ""
              }}
            </span>
            <span class="text-center">
              <strong>
              {{ conhecimento.AvaliacaoTemConheComportamental ? conhecimento.AvaliacaoTemConheComportamental.no : "" }}
                </strong>
            </span>
          </div>
				</div>
			</div>
		</template>
	</BaseDialog>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	export default {
		components: { BaseDialog },
		props: {
			avaliacao_id: {
				type: Number,
			},
		},
		data() {
			return {
				avaliacao: null,
			}
		},
		mounted() {
			this.buscarAvaliacao()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarAvaliacao() {
				let avaliacao_id = this.avaliacao_id

				let resp = await this.$axios.$get("/avaliacao_funcionario/buscarAvaliacao/aprovacao", {
					params: { avaliacao_id },
				})

				if (!resp.falha) {
					this.avaliacao = resp.dados.avaliacao
				}
			},
		},
	}
</script>

<style scoped></style>
<script setup></script>
