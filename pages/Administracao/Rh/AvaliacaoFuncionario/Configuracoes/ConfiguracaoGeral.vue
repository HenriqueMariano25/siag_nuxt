<template>
	<div class="w-full">
		<CabecalhoPagina titulo="CONFIGURAÇÃO GERAL" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<div class="w-full flex flex-col border border-gray-300 p-2 gap-1">
				<div class="bg-blue-300 px-2 text-xl text-gray-700 flex gap-1 items-center">
					<span> Intervalo por <strong>DATA DE ADMISSÃO</strong> para ser avaliados </span>
					<AppTooltip id="intervaloAdmissao">
						<template v-slot:corpo>
							<div>
								<img
									src="@/assets/icons/information-circle-g.svg"
									alt=""
									class="w-6 h-6" />
							</div>
						</template>
						<template v-slot:tooltip>
							<div class="w-[600px] text-start text-sm">
								<span>
									Intervalo entre datas de admissão no qual somente esses funcionários poderam ser
									avaliados.
								</span>
							</div>
						</template>
					</AppTooltip>
				</div>
				<div class="flex w-full justify-between">
					<div class="flex gap-2 items-end">
						<AppFormInput
							id="data_inicio"
							type="date"
							v-model="intervaloAdmissao.data_admissao_inicial"
							:invalido="errosDataAdmissao.includes('data_admissao_inicial')"
							label="Data inicial" />
						<AppFormInput
							id="data_fim"
							type="date"
							v-model="intervaloAdmissao.data_admissao_final"
							:invalido="errosDataAdmissao.includes('data_admissao_final')"
							label="Data final" />
            <span class="font-bold text-red-800 text-xl" v-if="erroIntervaloAdmisao">Data inicial não pode ser maior que data final!</span>
					</div>
					<div class="flex">
						<div class="flex items-end">
							<BotaoPadrao
								@clique="editarDataAdmissao"
								texto="salvar"
								cor="bg-primaria-300 hover:bg-primaria-500"
								class="text-white">
								<img
									src="@/assets/icons/save-w.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
					</div>
				</div>
			</div>
		</div>
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppTooltip from "~/components/Ui/AppTooltip.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import { validarFormulario } from "~/mixins/validarFormulario"

	export default {
		components: { AppAlerta, AppTooltip, BotaoPadrao, AppFormInput, CabecalhoPagina },
		data() {
			return {
        // Intervalo admissao
				intervaloAdmissao: {
					data_admissao_inicial: null,
					data_admissao_final: null,
				},
        errosDataAdmissao: [],
        erroIntervaloAdmisao: false,

				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
    mounted() {
      this.buscarConfiguracao();
    },
		methods: {
      async buscarConfiguracao(){
        let resp = await this.$axios.$get("/avaliacao_funcionario/configuracao/buscar")

        if(!resp.falha){
          let dados = resp.dados.configuracao

          this.intervaloAdmissao = {
            data_admissao_inicial: dados.data_admissao_inicial,
            data_admissao_final: dados.data_admissao_final,
          }
        }
      },
			async editarDataAdmissao() {
				let { data_admissao_inicial, data_admissao_final } = this.intervaloAdmissao
        this.erroIntervaloAdmisao = false

				this.errosDataAdmissao = validarFormulario(
					["data_admissao_inicial", "data_admissao_final"],
					this.intervaloAdmissao,
				)

				if (this.errosDataAdmissao.length === 0) {
          if(data_admissao_inicial > data_admissao_final){
            this.erroIntervaloAdmisao = true
            this.errosDataAdmissao = ["data_admissao_inicial", "data_admissao_final"]
          }else{
            let resp = this.$axios.$post(
              "/avaliacao_funcionario/configuracao/intervalo_admissao/editar",
              { data_admissao_inicial, data_admissao_final },
            )

            if (!resp.falha) {
              this.textoAlerta = "Intervalo de admissão editado com sucesso!"
              this.mostrarAlerta = true
            }
          }
				}
			},
		},
	}
</script>

<style scoped></style>
