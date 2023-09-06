<template>
	<BaseDialog
		:titulo="psp && psp.id ? 'Detalhes PSP - ' + ('00000' + psp.id).slice(-5) : ''"
		:carregando="carregando"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div
				class="flex w-full overflow-auto print:overflow-visible px-2 max-h-[550px]"
				id="imprimir"
				style="">
				<div
					class="grid grid-cols-1 divide-y divide-gray-300 text-lg w-full"
					v-if="psp">

          <div class="!border-b-2 !border-b-black w-full flex-col hidden print:flex">
            <div class="justify-between flex w-full items-center mb-1">
              <img
                src="@/assets/img/logogrande.png"
                alt=""
                class="w-[250px]" />
              <span>{{ $dayjs().format("DD/MM/YYYY HH:mm") }}</span>
            </div>
            <div class="text-center">
              <span class="text-3xl"><strong>Gestão de Viagem</strong></span>
            </div>
          </div>
					<div class="flex justify-between w-full">
						<span><strong>Código: </strong>{{ ("00000" + psp.id).slice(-5) }}</span>
						<span>
							<strong>Data de solicitação: </strong>
							{{ $dayjs(psp.createdAt).format("DD/MM/YYYY") }}
						</span>
					</div>
					<span class="titulo"><strong>Funcionário</strong></span>
					<span class="">
						<strong>Matricula: </strong>{{ psp.Funcionario ? psp.Funcionario.chapa : "" }}
					</span>
					<span> <strong>Nome: </strong>{{ psp.Funcionario ? psp.Funcionario.nome : "" }} </span>
					<span> <strong>Cargo: </strong>{{ psp.Funcionario ? psp.Funcionario.cargo : "" }} </span>
					<span>
						<strong>Setor: </strong>
						{{ psp.Funcionario && psp.Funcionario.setor ? psp.Funcionario.setor.nome : "" }}
					</span>
					<span> <strong>CPF: </strong>{{ psp.Funcionario ? psp.Funcionario.cpf : "" }} </span>
					<span> <strong>RG: </strong>{{ psp.Funcionario ? psp.Funcionario.rg : "" }} </span>
					<span>
						<strong>Data de Nascimento: </strong>
						{{
							psp.Funcionario ? $dayjs(psp.Funcionario.data_nascimento).format("DD/MM/YYYY") : ""
						}}
					</span>
					<span> <strong>E-mail: </strong>{{ psp.Funcionario ? psp.Funcionario.email : "" }} </span>
					<span>
						<strong>Setor: </strong>
						{{ psp.Funcionario && psp.Funcionario.Turno ? psp.Funcionario.Turno.descricao : "" }}
					</span>
					<span class="titulo"><strong>Viagem</strong></span>
					<div class="flex w-full divide-x divide-gray-400">
						<span class="grow">
							<strong>Data de ida: </strong>
							{{ $dayjs(psp.data_ida).format("DD/MM/YYYY") }}
						</span>
						<span class="grow"
							><strong>Data de Volta: </strong>
							{{ $dayjs(psp.data_volta).format("DD/MM/YYYY") }}
						</span>
					</div>
					<span> <strong>Origem: </strong>{{ psp.origem }} </span>
					<span> <strong>Destino: </strong>{{ psp.destino }} </span>
					<span> <strong>Transporte: </strong>{{ psp.meio_transporte }} </span>
					<span> <strong>Motivo: </strong>{{ psp.motivo }} </span>
					<span>
						<strong>Centro de Custo: </strong>
						{{ psp.CentroCustoPEP.numero_pep }}-{{ psp.CentroCustoPEP.descricao }}
					</span>
					<span>
						<strong>Descrição do Itinerário: </strong>
						{{ psp.descricao_itinerario }}
					</span>
					<span>
						<strong>Solicitado por: </strong>{{ psp.criado_por ? psp.criado_por.nome : "" }}
					</span>
					<span class="titulo"><strong>Aprovações</strong></span>
					<div
						class="grid grid-cols-2 w-full divide-x divide-gray-400"
						v-if="psp.aprovador_gaf && psp.aprovacao_gaf">
						<span class="grow">
							<strong>Aprov. GAF: </strong>
							{{ psp.aprovador_gaf ? psp.aprovador_gaf.nome : "" }}
						</span>
						<span class="grow">
							<strong>Data: </strong>
							{{ $dayjs(psp.data_aprovacao_gaf).format("DD/MM/YYYY") }}
						</span>
					</div>
					<div
						class="grid grid-cols-2 w-full divide-x divide-gray-400"
						v-if="psp.aprovador_rh && psp.aprovacao_rh">
						<span class="grow">
							<strong>Aprov. RH: </strong>
							{{ psp.aprovador_rh ? psp.aprovador_rh.nome : "" }}
						</span>
						<span class="grow">
							<strong>Data: </strong>
							{{ $dayjs(psp.data_aprovacao_rh).format("DD/MM/YYYY") }}
						</span>
					</div>
					<div
						class="grid grid-cols-2 w-full divide-x divide-gray-400"
						v-if="psp.aprovador_coordenador && psp.aprovacao_coordenador">
						<span class="grow">
							<strong>Aprov. Coord.: </strong>
							{{ psp.aprovador_coordenador ? psp.aprovador_coordenador.nome : "" }}
						</span>
						<span class="grow">
							<strong>Data: </strong>
							{{ $dayjs(psp.data_aprovacao_coordenador).format("DD/MM/YYYY") }}
						</span>
					</div>
					<div
						class="grid grid-cols-2 w-full divide-x divide-gray-400"
						v-if="psp.aprovador_gerente_area && psp.aprovacao_gerente_area">
						<span class="grow">
							<strong>Aprov. Gerente: </strong>
							{{ psp.aprovador_gerente_area ? psp.aprovador_gerente_area.nome : "" }}
						</span>
						<span class="grow">
							<strong>Data: </strong>
							{{ $dayjs(psp.aprovacao_gerente_area).format("DD/MM/YYYY") }}
						</span>
					</div>
				</div>
			</div>
		</template>
		<template v-slot:rodape-btn-direito>
			<div class="flex">
				<BotaoPadrao
					texto="imprimir"
					@clique="imprimir()">
					<img
						src="@/assets/icons/printer-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</template>
	</BaseDialog>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		name: "DialogDetalhesPsp",
		components: {
			BotaoPadrao,
			BaseDialog,
		},
		props: {
			psp_id: {
				type: Number,
			},
		},
		data() {
			return {
				carregando: true,
				psp: null,
			}
		},
		created() {
			if (this.psp_id) {
				this.buscarPsp()
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarPsp() {
				let resp = await this.$axios.$get(`/psp/buscar/${this.psp_id}`)

				if (!resp.falha) {
					this.psp = resp.dados.psp
					console.log(resp.dados.psp)
					this.carregando = false
				}
			},
			imprimir() {
				window.print()
			},
		},
	}
</script>

<style scoped>
	span {
		padding: 1px 5px;
	}
	.titulo {
		background-color: #bdbec0;
	}
</style>
