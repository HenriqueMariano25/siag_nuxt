<template>
	<div class="w-full">
		<div class="bg-primaria-500 px-2 py-1 flex w-full items-center justify-between mb-2">
			<span class="text-2xl text-white font-bold">CHECKLISTS</span>
      <div class="flex gap-2 items-center">
        <span class="text-white"><strong>Última atualização: {{ ultimaAtualizacao }}</strong></span>
        <BotaoPadrao texto="Atualizar" @clique="visualizarChecklists()">
          <img
            src="@/assets/icons/rotate-b.svg"
            alt=""
            class="w-6 h-6" />
        </BotaoPadrao>
        <BotaoPadrao texto="voltar" @clique="$router.push('carros')">
          <img
            src="@/assets/icons/back-b.svg"
            alt=""
            class="w-6 h-6" />
        </BotaoPadrao>
      </div>
		</div>
		<div class="px-2 grid grid-cols-6 gap-3">
			<div
				v-for="carro of carros"
				:key="carro.id"
				class="flex text-center rounded flex-col shadow-md shadow-black/30 text-xl border border-slate-500 bg-slate-100">
				<div class="p-2 flex flex-col">
					<span class="font-bold">CGA-{{ carro.cga }}</span>
					<span>{{ carro.placa }}</span>
				</div>
				<div
					:class="[corCarro(carro).cor]"
					class="rounded-b py-1">
					<span class="uppercase font-bold">
						{{ corCarro(carro).texto }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		components: { BotaoPadrao, CabecalhoPagina },
		layout: "auth",
		data() {
			return {
				carros: [],
        ultimaAtualizacao: null
			}
		},
		async mounted() {
      await this.visualizarChecklists()

      this.interval = setInterval(() => {
        this.visualizarChecklists()
      }, 1800000);
		},
    beforeDestroy() {
      clearInterval(this.interval);
    },
		methods: {
			async visualizarChecklists() {
				let resp = await this.$axios.$get("/transporte/checklists/visualizacao")
				if (!resp.falha) {
					this.carros = resp.dados.carros
				}
        this.ultimaAtualizacao = this.$dayjs().format('HH:mm:ss')
			},
			corCarro(carro) {
				if (carro.ChecklistCarro.length > 0) {
					if (carro.ChecklistCarro[0].data_fechamento === null) {
						if (carro.ChecklistCarro[0].data_abertura.includes(this.$dayjs().format("YYYY-MM-DD")))
							return { texto: "em aberto", cor: "bg-orange-400" }
						else return { texto: "atrasado", cor: "bg-red-500" }
					}
					if (carro.ChecklistCarro[0].data_fechamento !== null)
						return { texto: "concluído", cor: "bg-green-400" }
				} else {
					return { texto: "não aberto", cor: "bg-blue-300" }
				}
			},
		},
	}
</script>

<style scoped></style>
