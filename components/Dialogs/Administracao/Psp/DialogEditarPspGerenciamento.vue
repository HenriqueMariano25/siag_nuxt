<template>
	<div>
		<BaseDialog
			:titulo="psp ? 'EDITAR PSP - ' + ('00000' + psp.id).slice(-5) : ''"
			largura="w-10/12"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div
					class="px-2 flex flex-col gap-2"
					v-if="psp">
					<div class="flex flex-col w-full border border-slate-700">
						<span class="px-2 bg-slate-700 text-white font-bold">VIAGEM</span>
						<div class="flex justify-between">
							<div class="cada-texto">
								<span class="titulo">MATRÍCULA</span>
								<span class="texto">{{ psp.Funcionario ? psp.Funcionario.chapa : "" }}</span>
							</div>
							<div class="cada-texto">
								<span class="titulo">NOME</span>
								<span class="texto">{{ psp.Funcionario ? psp.Funcionario.nome : "" }}</span>
							</div>
							<div class="cada-texto">
								<span class="titulo">CARGO</span>
								<span class="texto">{{ psp.Funcionario ? psp.Funcionario.cargo : "" }}</span>
							</div>
						</div>
						<div class="flex justify-between">
							<div class="cada-texto">
								<span class="titulo">DATA DE IDA</span>
								<span class="texto">{{ $dayjs(psp.data_ida).format("DD/MM/YYYY") }}</span>
							</div>
							<div class="cada-texto">
								<span class="titulo">MOTIVO</span>
								<span class="texto">{{ psp.motivo }}</span>
							</div>
							<div class="cada-texto">
								<span class="titulo">DESTINO</span>
								<span class="texto">{{ psp.destino }}</span>
							</div>
						</div>
					</div>
					<div class="flex flex-col border border-slate-700">
						<span class="px-2 bg-slate-700 text-white font-bold text-xl"> EDITAR </span>
						<div class="flex gap-1 flex-wrap px-2 py-2 ">
							<div class="flex flex-col grow border border-gray-400 p-1">
								<span class="text-md">SOLICITANTE ATUAL</span>
								<span class="font-bold text-lg px-2">
									{{ psp.criado_por ? psp.criado_por.nome : "" }}
								</span>
								<div>
									<span class="text-md">NOVO SOLICITANTE</span>
									<AppFormSelectCompleto
										style="z-index: 103 !important"
										class="grow"
										id="marca"
										v-model="psp.usuario_id"
										btn-cadastrar
										label="Usuário"
										:options="usuarios" />
								</div>
							</div>
							<div class="flex flex-col grow border border-gray-400 p-1">
								<AppFormInput
									id="ida"
									type="date"
									label="Data de Ida"
									:invalido="erros.includes('data_ida')"
									placeholder="Ex: Grussai, São João da Barra, RJ"
									obrigatorio
									:texto-invalido="textoErroDataIda"
									v-model="psp.data_ida" />
								<AppFormInput
									id="volta"
									type="date"
									label="Data de Volta"
									:invalido="erros.includes('data_volta')"
									placeholder="Ex: Grussai, São João da Barra, RJ"
									obrigatorio
									:texto-invalido="textoErroDataVolta"
									v-model="psp.data_volta" />
							</div>
              <div
                class="grid grid-cols-2 col-span-2 gap-x-2 bg-gray-50 p-1 border border-gray-400 w-full">
                <span class="font-bold">Meio de Transporte</span>
                <span class="font-bold">Adicionados</span>
                <div class="flex flex-col">
                  <div class="flex flex-col gap-2 bg-blue-200 border border-blue-300 p-1">
                    <div class="grid grid-cols-4 gap-2">
                      <AppFormSelect
                        id=""
                        :options="opcoesMeioTransporte"
                        label="Meio de transporte"
                        :invalido="errosMeioTransporte.includes('meio_transporte')"
                        class="col-span-3"
                        v-model="meioTransporte.meio_transporte" />
                      <AppFormInput
                        id="hora_saida"
                        type="time"
                        label="Hora de partida"
                        v-model="meioTransporte.hora_partida" />
                      <AppFormInput
                        id="meioTransporteOrigem"
                        type="text"
                        label="Origem"
                        class="col-span-2"
                        v-model="meioTransporte.origem"
                        placeholder="Ex: Grussai, São João da Barra, RJ"
                        :invalido="errosMeioTransporte.includes('origem')" />
                      <AppFormInput
                        id="meioTransporteDestino"
                        type="text"
                        label="Destino"
                        class="col-span-2"
                        v-model="meioTransporte.destino"
                        :invalido="errosMeioTransporte.includes('destino')"
                        placeholder="Ex: Tietê,São Paulo, SP" />
                    </div>
                    <div class="flex justify-end">
                      <BotaoPadrao
                        class="!z-10"
                        texto="Salvar"
                        cor="bg-green-400"
                        @clique="adicionarMeioTransporte()">
                        <img
                          src="@/assets/icons/save-b.svg"
                          alt=""
                          class="w-7 h-7" />
                      </BotaoPadrao>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-0.5">
                  <div class="px-2 text-gray-700 font-bold">
												<span v-if="meiosTransporte.length === 0">
													Nenhum meio de transporte adicionado</span
                        >
                  </div>

                  <div
                    class="flex flex-col gap-0.5 w-full"
                    v-for="(meio, index) of meiosTransporte">
                    <div
                      class="!w-full flex justify-center"
                      v-if="index > 0">
                      <img
                        src="@/assets/icons/arrow-down-simple-b.svg"
                        alt=""
                        class="w-4 h-4" />
                    </div>
                    <div class="flex flex-row">
                      <div class="flex flex-col bg-blue-200 border border-blue-300 p-1 grow">
                        <div class="justify-between flex grow">
                          <span class="font-bold text-xl">{{ meio.meio_transporte }}</span>
                          <span
                            class=""
                            v-if="meio.hora_partida">
																<strong>Partida:</strong> {{ meio.hora_partida }}
															</span>
                        </div>
                        <span><strong>De: </strong> {{ meio.origem }}</span>
                        <span><strong>Para: </strong>{{ meio.destino }}</span>
                      </div>
                      <div
                        class="flex flex-col !min-w-12 content-center items-center justify-center !h-full">
                        <div>
                          <BotaoPadrao
                            icone
                            @clique="removerMeioTransporte(index)">
                            <img
                              src="@/assets/icons/delete-b.svg"
                              alt=""
                              class="w-6 h-6" />
                          </BotaoPadrao>
                        </div>
                        <div class="flex">
                          <BotaoPadrao
                            icone
                            @clique="index !== 0 ? mudarPosicao('subir', index) : null"
                            :class="{ 'cursor-default hover:!bg-white': index === 0 }">
                            <img
                              src="@/assets/icons/arrow-up-b.svg"
                              alt=""
                              class="w-6 h-6"
                              v-if="index !== 0" />
                            <img
                              src="@/assets/icons/arrow-up-disabled.svg"
                              alt=""
                              class="w-6 h-6"
                              v-if="index === 0" />
                          </BotaoPadrao>
                        </div>
                        <div class="flex">
                          <BotaoPadrao
                            icone
                            @clique="
																	index !== meiosTransporte.length - 1
																		? mudarPosicao('descer', index)
																		: null
																"
                            :class="{
																	'cursor-default hover:!bg-white':
																		index === meiosTransporte.length - 1,
																}">
                            <img
                              src="@/assets/icons/arrow-down-b.svg"
                              alt=""
                              class="w-6 h-6"
                              v-if="index !== meiosTransporte.length - 1" />
                            <img
                              src="@/assets/icons/arrow-down-disabled.svg"
                              alt=""
                              class="w-6 h-6"
                              v-if="index === meiosTransporte.length - 1" />
                          </BotaoPadrao>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="col-span-2 bg-red-300 border border-red-400 px-2 mt-1 text-center"
                  v-if="erros.includes('meiosTransporte')">
											<span class="text-xl text-red-700"
                      ><strong>Favor cadastre um meio de transporte</strong></span
                      >
                </div>
              </div>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="justify-end w-full flex">
					<BotaoPadrao
						texto="salvar"
						@clique="editarPsp()">
						<img
							src="@/assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
  import AppFormSelect from "~/components/Ui/AppFormSelect.vue";

	export default {
		components: { AppFormSelect, AppFormInput, BotaoPadrao, AppFormSelectCompleto, BaseDialog },
		props: {
			psp_id: {
				type: Number,
				default: null,
			},
		},
		data() {
			return {
				psp: {
					solicitante_id: null,
					data_ida: null,
					data_volta: null,
				},
				erros: [],
				usuarios: [],
				textoErroDataIda: null,
				textoErroDataVolta: null,
        opcoesMeioTransporte: [
          { nome: "Rodoviário", id: "Rodoviário" },
          { nome: "Aérea", id: "Aérea" },
          { nome: "Carro", id: "Carro" },
        ],
        meioTransporte: {
          meio_transporte: null,
          hora_partida: null,
          origem: null,
          destino: null,
        },
        meiosTransporte: [],
        errosMeioTransporte: [],
			}
		},
		mounted() {
			if (this.psp_id !== null) {
				this.buscarPsp()
				this.buscarUsuarios()
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

          this.meiosTransporte = resp.dados.psp.PspTemMeioTransporte
				}
			},
			async buscarUsuarios() {
				let resp = await this.$axios.$get("/usuario/ativos/BuscarTodos/simples")
				if (!resp.falha) {
					let { usuarios } = resp.dados
					this.usuarios = usuarios.map((o) => {
						return { id: o.id, nome: o.nome }
					})
				}
			},
      adicionarMeioTransporte() {
        this.validarFormularioMeioTransporte()

        if (this.errosMeioTransporte.length === 0) {
          this.meiosTransporte.push(this.meioTransporte)

          this.meioTransporte = {
            meio_transporte: null,
            hora_partida: null,
            origem: this.meioTransporte.destino,
            destino: null,
          }
        }
      },
      mudarPosicao(acao, idx) {
        let principal = this.meiosTransporte[idx]
        let secundario
        let idxSecundario

        if (acao === "subir") {
          idxSecundario = idx - 1
          secundario = this.meiosTransporte[idxSecundario]
        }

        if (acao === "descer") {
          idxSecundario = idx + 1
          secundario = this.meiosTransporte[idxSecundario]
        }

        this.meiosTransporte.splice(idx, 1, secundario)
        this.meiosTransporte.splice(idxSecundario, 1, principal)
      },

      removerMeioTransporte(idx) {
        this.meiosTransporte.splice(idx, 1)
      },

      validarFormularioMeioTransporte() {
        this.errosMeioTransporte = []

        let camposObrigatorio = ["meio_transporte", "origem", "destino"]

        for (let campo of camposObrigatorio) {
          if (this.meioTransporte[`${campo}`] === null || this.meioTransporte[`${campo}`] === "")
            this.errosMeioTransporte.push(campo)
        }
      },
      validarFormulario() {
        this.erros = []

        let camposObrigatorio = [
          "funcionario_id",
          "data_ida",
          "data_volta",
        ]

        if (this.$dayjs(this.psp.data_ida).diff(this.$dayjs(), "day") < 0) {
          this.erros.push("data_ida")
          this.textoErroDataIda = "Data de ida não pode ser inferior a data atual"
        }

        if (this.$dayjs(this.psp.data_volta).isBefore(this.$dayjs(), "day")) {
          this.textoErroDataVolta = "Data de volta não pode ser inferior a data atual"
          this.erros.push("data_volta")
        } else {
          if (this.psp.data_ida) {
            if (this.$dayjs(this.psp.data_volta).isBefore(this.$dayjs(this.psp.data_ida), "day")) {
              this.erros.push("data_volta")
              this.textoErroDataVolta = "Data de volta não pode ser inferior a data de ida"
            }
          }
        }

        if (this.meiosTransporte.length === 0) {
          if (this.psp.motivo !== 'Cotação')
            this.erros.push("meiosTransporte")
        }

        for (let campo of camposObrigatorio) {
          if (this.psp[`${campo}`] === null || this.psp[`${campo}`] === "") this.erros.push(campo)
        }
      },

      async editarPsp() {
        this.validarFormulario()
        let {  data_ida, data_volta, usuario_id } = this.psp
        let quem_editou_id = this.$auth.user.id
        let id = this.psp_id
        let meiosTransportes = this.meiosTransporte


        if (this.erros.length === 0) {
          console.log("editando");
          let resp = await this.$axios.$put("/psp/trocarSolicitante", {
            data_ida,
            data_volta,
            quem_editou_id,
            usuario_id,
            id,
            meiosTransportes,
          })

          if (!resp.falha) {
            console.log(meiosTransportes);
            let criadoPorIdx = this.usuarios.findIndex((element) => element.id === usuario_id)
            console.log(criadoPorIdx, this.usuarios[criadoPorIdx]);

            let psp = {
              data_ida,
              PspTemMeioTransporte: [
                {
                  meio_transporte:
                    meiosTransportes[0].meio_transporte
                }
              ],
              criado_por: { nome: this.usuarios[criadoPorIdx].nome, id: usuario_id },
              id
            }
            this.$emit("editado", { psp })
          }
        }
      },
		},
	}
</script>

<style scoped>
	.cada-texto {
		display: flex;
		flex-direction: column;
		padding: 0 0.5rem;
	}
	.titulo {
		font-size: 12px;
		color: #545458;
		margin-left: 6px;
		font-weight: 500;
	}
	.texto {
		font-size: 18px;
		color: #212121;
		font-weight: 600;
		margin-top: -2px;
	}
</style>
