<template>
	<div class="w-full">
		<CabecalhoPagina :titulo="jaIniciado ? 'EDITAR AVALIAÇAO' : 'CRIAR AVALIAÇÃO'" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<AppTabs
				:tabs="tabs"
				@tab="tab = $event">
				<template v-slot:[`tab.funcionario`]="{ item }">
					<div
						class="flex flex-col gap-2 h-full"
						style="height: calc(100vh - 157px)">
						<div class="grid grid-cols-12 p-1 gap-2 items-center">
							<AppFormSelectCompleto
								id="funcionario_id"
								:disabled="jaIniciado"
								:readonly="jaIniciado"
								v-model="funcionario.funcionario_id"
								label="Funcionário"
								obrigatorio
								:invalido="erros.includes('funcionario_id')"
								:options="funcionarios"
								class="col-span-6" />
							<AppFormInput
								readonly
								disabled
								type="text"
								v-model="funcionario.chapa"
								id="cargo"
								label="Matricula"
								placeholder="Ex: 1950000001"
								class="col-span-3" />
							<AppFormInput
								type="text"
								readonly
								disabled
								id="cargo"
								v-model="funcionario.cargo"
								label="Cargo"
								placeholder="Ex: ENCARREGADO DE ALMOXARIFADO"
								class="col-span-3" />
							<div
								class="col-span-12 flex flex-col px-2 bg-red-300 border-2 border-red-100 text-lg text-gray-900"
								v-if="avaliacaoFuncionario && avaliacaoFuncionario.situacao === 'Encontrado'">
								<span class="text-xl "><strong>Esse funcionário já tem uma avaliação em aberto!</strong></span>
								<span>
                  Iniciada por <strong>{{ avaliacaoFuncionario.nome }}</strong> no dia
									<strong>{{
										$dayjs(avaliacaoFuncionario.data).format("DD/MM/YYYY HH:mm")
									}}</strong>
                </span>
							</div>
              <div
                class="col-span-12 flex flex-col px-2 bg-orange-300 border-2 border-orange-100 text-lg text-gray-900"
                v-if="avaliacaoFuncionario && avaliacaoFuncionario.situacao === 'Finalizado'">
                <span><strong>Última avaliação realizada: </strong>{{ $dayjs(avaliacaoFuncionario.data).format("DD/MM/YYYY HH:mm") }}</span>
                <span><strong>Avaliador: </strong>{{ avaliacaoFuncionario.nome }}</span>
                <span><strong>Previsão para próxima avaliação: </strong>{{ $dayjs(avaliacaoFuncionario.data).add(6, 'month').format("DD/MM/YYYY") }}</span>
              </div>
							<AppFormSelectCompleto
								id="formacao"
								v-model="funcionario.formacao_id"
								:invalido="erros.includes('formacao_id')"
								label="Formação"
								obrigatorio
								:options="formacoes"
								class="col-span-4" />
							<AppFormInput
								type="text"
								:invalido="erros.includes('anos_experiencia')"
								id="ano_experiencia"
								:value="anosExperiencia"
								disabled
								readonly
								label="Anos de Experiência"
								placeholder="Ex: 3 anos"
								class="col-span-3" />

							<AppFormInput
								type="month"
								:invalido="erros.includes('previsao_disponibilidade')"
								id="previsao"
								obrigatorio
								v-model="funcionario.previsao_disponibilidade"
								label="Previsão de disponibilidade"
								class="col-span-3" />
							<div class="col-span-12 gap-2 grid grid-cols-2">
								<div class="">
									<table>
										<thead class="bg-blue-900 text-white w-full">
											<tr class="border border-gray-700 font-bold text-center">
												<td class="w-10/12 border border-gray-700 px-2">CONHECIMENTO</td>
												<td class="w-2/12 border border-gray-700 px-2"></td>
											</tr>
										</thead>
										<tbody class="bg-white">
											<tr
												v-for="conhecimento of conhecimentosFuncionario"
												:key="conhecimento.id">
												<td class="border border-gray-700 items-center px-2">
													{{ conhecimento.descricao }}
												</td>
												<td class="border border-gray-700 w-2/12">
													<div class="flex justify-center p-0.5 pt-1">
														<AppFormCheckbox
															label=""
															:id="'checkboxConhecimento' + conhecimento.id"
															:valor="conhecimento.id"
															v-model="funcionario.conhecimentos" />
													</div>
												</td>
											</tr>
										</tbody>
									</table>
									<div class="bg-blue-900 text-white text-center font-bold">
										<span
											>SELECIONADOS: {{ funcionario.conhecimentos.length }}/{{
												conhecimentosFuncionario.length
											}}</span
										>
									</div>
								</div>
								<div>
									<table>
										<thead class="bg-blue-900 text-white w-full">
											<tr class="border border-gray-700 font-bold text-center">
												<td class="w-10/12 border border-gray-700 px-2">
													LOCALIDADE/DISPO. DE TRABALHO
												</td>
												<td class="w-2/12 border border-gray-700 px-2"></td>
											</tr>
										</thead>
										<tbody class="bg-white">
											<tr
												v-for="item of disponibilidadesTrabalho"
												:key="item.id">
												<td class="border border-gray-700 items-center px-2">
													{{ item.descricao }}
												</td>
												<td class="border border-gray-700 w-2/12">
													<div class="flex justify-center p-0.5 pt-1">
														<AppFormCheckbox
															label=""
															:id="'checkboxDispoTrabalho' + item.id"
															:valor="item.id"
															v-model="funcionario.dispoTrabalho" />
													</div>
												</td>
											</tr>
										</tbody>
									</table>
									<div class="bg-blue-900 text-white text-center font-bold">
										<span
											>SELECIONADOS: {{ funcionario.dispoTrabalho.length }}/{{
												disponibilidadesTrabalho.length
											}}</span
										>
									</div>
								</div>
								<div class="col-span-2">
									<div
										class="flex flex-col w-full items-center border border-blue-200 bg-blue-50 gap-1">
										<div
											class="w-full px-2 font-bold bg-blue-200 py-0.5 text-lg border-b border-blue-400">
											<span>Experiências profissionais</span>
										</div>
										<div class="flex gap-2 items-center w-full p-1">
											<AppFormSelectCompleto
												id="tipoObra"
												:options="tiposObra"
												label="Tipo de obra"
												:invalido="errosTipoObra.includes('tipo_obra_avaliacao_id')"
												class="grow"
												v-model="tipoObra.tipo_obra_avaliacao_id" />
											<AppFormSelectCompleto
												id="cargo"
												:options="cargos"
												label="Cargo"
												:invalido="errosTipoObra.includes('cargo_avaliacao_id')"
												class="grow"
												v-model="tipoObra.cargo_avaliacao_id" />
											<AppFormInput
												label="Anos"
												type="number"
												id="anos"
												v-model="tipoObra.anos"
												placeholder="EX: 1"
												obrigatorio
												:invalido="errosTipoObra.includes('anos')" />
											<BotaoPadrao
												cor="bg-blue-300 hover:!bg-blue-400 self-end"
												@clique="adicionarTipoObra()">
												<img
													src="@/assets/icons/add-b.svg"
													alt=""
													class="w-7 h-7" />
											</BotaoPadrao>
										</div>
									</div>
									<div>
										<table>
											<thead class="bg-blue-900 text-white w-full">
												<tr class="border border-gray-700 font-bold text-center">
													<th class="grow px-2 border border-gray-600">Tipo de Obra</th>
													<th class="grow px-2 border border-gray-600">Cargo</th>
													<th class="grow px-2 border border-gray-600">Anos</th>
													<th class="w-1/12 border border-gray-600"></th>
												</tr>
											</thead>
											<tbody>
												<tr
													v-for="(item, index) of funcionario.tiposObra"
													class="border-collapse">
													<td class="grow px-2 border border-gray-600">
														<span>{{ item.tipo_obra }}</span>
													</td>
													<td class="grow px-2 border border-gray-600">
														<span>{{ item.cargo }}</span>
													</td>
													<td class="grow px-2 border border-gray-600">
														<span>{{ item.anos }} anos</span>
													</td>
													<td class="w-1/12 justify-center border border-gray-600">
														<div class="w-full justify-center items-center flex">
															<BotaoPadrao
																icone
																@clique="removerTipoObra(index)">
																<img
																	src="@/assets/icons/delete-b.svg"
																	alt=""
																	class="w-6 h-6" />
															</BotaoPadrao>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
						<!--            <div class="px-2">-->
						<!--              <span class="text-xl font-bold text-slate-900">Para continuar a avaliação primeiro SALVE os dados do funcionário</span>-->
						<!--            </div>-->
					</div>
				</template>
				<template v-slot:[`tab.descricao_cargo`]="{ item }">
					<div class="relative">
						<div class="grid grid-cols-2 gap-2">
							<table class="table w-full">
								<thead class="bg-blue-900 text-white w-full">
									<tr class="border border-gray-500 font-bold text-center">
										<th class="w-10/12 border border-gray-500 px-2">1. Habilidade Técnicas</th>
										<th class="w-2/12 border border-gray-500 px-2">Nota</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td
											colspan="2"
											class="border-gray-500 border bg-slate-300">
											<div class="w-full text-center justify-center flex items-center gap-1.5">
                        <img src="@/assets/icons/information-circle-g.svg" alt="" class="w-7 h-7">
												<div>
													<AppTooltip posicao="left-0">
														<template v-slot:corpo>
															<span class="cursor-pointer hover:!text-blue-900 hover:font-bold"> <strong>1</strong>-Não atende; </span>
														</template>
														<template v-slot:tooltip>
															<div class="w-[400px]">
																<span>Situação em que o avaliado está abaixo do que é esperado para sua posição.</span>
															</div>
														</template>
													</AppTooltip>
												</div>
                        <div>
                          <AppTooltip posicao="right-0">
                            <template v-slot:corpo>
                              <span class="cursor-pointer hover:!text-blue-900 hover:font-bold"> <strong>2</strong>-Atende; </span>
                            </template>
                            <template v-slot:tooltip>
                              <div class="w-[400px]">
                                <span>Situação em que o avaliado entrega o que é esperado para sua posição.</span>
                              </div>
                            </template>
                          </AppTooltip>
                        </div>
                        <div>
                          <AppTooltip posicao="right-0">
                            <template v-slot:corpo>
                              <span class="cursor-pointer hover:!text-blue-900 hover:font-bold"> <strong>3</strong>-Supera; </span>
                            </template>
                            <template v-slot:tooltip>
                              <div class="w-[400px]">
                                <span>Situação em que o avaliado entrega além do que é esperado para sua posição, se destacando constantemente.</span>
                              </div>
                            </template>
                          </AppTooltip>
                        </div>
											</div>
										</td>
									</tr>
									<tr v-for="habilidade of habilidadesTecnicas">
										<td class="w-10/12 border border-gray-500 px-2">
											{{ habilidade.descricao }}
										</td>
										<td class="w-2/12 border border-gray-500 px-2">
											<div class="w-full flex justify-center">
												<input
													type="text"
													v-maska
													class="border border-gray-600 px-3.5 font-bold text-lg w-[40px] rounded"
													data-maska="A"
													:class="{
														'bg-red-200 border border-red-400':
															errosHabTecnicas &&
															(!Object.keys(funcionario.habilidadesTecnicas).includes(
																habilidade.id.toString(),
															) ||
																funcionario.habilidadesTecnicas[habilidade.id.toString()] === ''),
													}"
													v-model="funcionario.habilidadesTecnicas[`${habilidade.id}`]"
													data-maska-tokens="A:[1-3]" />
											</div>
										</td>
									</tr>
								</tbody>
							</table>
							<table class="table w-full">
								<thead class="bg-blue-900 text-white w-full">
									<tr class="border border-gray-300 font-bold text-center">
										<th class="w-10/12 border border-gray-300 px-2">
											2. Habilidade Comportamentais
										</th>
										<th class="w-2/12 border border-gray-300 px-2">Nota</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td
											colspan="2"
											class="border-gray-500 border bg-slate-300">
                      <div class="w-full text-center justify-center flex items-center gap-1.5">
                        <img src="@/assets/icons/information-circle-g.svg" alt="" class="w-7 h-7">
                        <div>
                          <AppTooltip posicao="left-0">
                            <template v-slot:corpo>
                              <span class="cursor-pointer hover:!text-blue-900 hover:font-bold"> <strong>1</strong>-Não atende; </span>
                            </template>
                            <template v-slot:tooltip>
                              <div class="w-[400px]">
                                <span>Situação em que o avaliado está abaixo do que é esperado para sua posição.</span>
                              </div>
                            </template>
                          </AppTooltip>
                        </div>
                        <div>
                          <AppTooltip posicao="right-0">
                            <template v-slot:corpo>
                              <span class="cursor-pointer hover:!text-blue-900 hover:font-bold"> <strong>2</strong>-Atende; </span>
                            </template>
                            <template v-slot:tooltip>
                              <div class="w-[400px]">
                                <span>Situação em que o avaliado entrega o que é esperado para sua posição.</span>
                              </div>
                            </template>
                          </AppTooltip>
                        </div>
                        <div>
                          <AppTooltip posicao="right-0">
                            <template v-slot:corpo>
                              <span class="cursor-pointer hover:!text-blue-900 hover:font-bold"> <strong>3</strong>-Supera; </span>
                            </template>
                            <template v-slot:tooltip>
                              <div class="w-[400px]">
                                <span>Situação em que o avaliado entrega além do que é esperado para sua posição, se destacando constantemente.</span>
                              </div>
                            </template>
                          </AppTooltip>
                        </div>
                      </div>
										</td>
									</tr>
									<tr v-for="conhecimento of conheComportamentais">
										<td class="w-10/12 border border-gray-500 px-2">
											{{ conhecimento.descricao }}
										</td>
										<td class="w-2/12 border border-gray-500 px-2">
											<div class="w-full flex justify-center">
												<input
													type="text"
													v-maska
													class="border border-gray-600 px-3.5 font-bold text-lg w-[40px] rounded"
													data-maska="A"
													:class="{
														'bg-red-200 border border-red-400':
															errosConheComportamental &&
															(!Object.keys(funcionario.conheComportamentais).includes(
																conhecimento.id.toString(),
															) ||
																funcionario.conheComportamentais[conhecimento.id.toString()] ===
																	''),
													}"
													v-model="funcionario.conheComportamentais[`${conhecimento.id}`]"
													data-maska-tokens="A:[1-3]" />
											</div>
										</td>
									</tr>
								</tbody>
							</table>
							<div class="col-span-2 flex flex-col px-2 pb-2">
								<span class="bg-blue-900 text-white font-bold px-2">3. Comentários Gerais</span>
								<AppFormTextarea
									id="observacao"
									:total-caracteres="1000"
									label="Comentários Gerais"
									linhas="2"
									v-model="funcionario.comentario_geral"
									placeholder="Comentário opcional"
									class="col-span-3" />
							</div>
						</div>
					</div>
				</template>
			</AppTabs>
		</div>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex items-center w-full justify-between">
					<div class="flex gap-2">
						<BotaoPadrao
							texto="voltar"
							@clique="voltar()">
							<img
								src="@/assets/icons/back-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>

						<BotaoPadrao
							texto="deletar"
							v-if="jaIniciado && !estaDeletando"
							@clique="estaDeletando = true"
							cor="bg-red-400 hover:!bg-red-500">
							<img
								src="@/assets/icons/delete-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
						<div
							v-if="estaDeletando"
							class="flex items-center">
							<BotaoPadrao
								texto="Não"
								cor=" bg-red-500"
								@clique="estaDeletando = false"></BotaoPadrao>
							<span class="px-2 text-white">Certeza que deseja deletar essa AVALIÇÃO ?</span>
							<BotaoPadrao
								texto="Sim"
								cor="bg-green-500"
								@clique="cancelarAvaliacao()"></BotaoPadrao>
						</div>
					</div>
					<div class="flex gap-2 items-center">
						<span
							class="text-red-400 text-xl font-bold"
							v-if="erros.length > 0 || errosHabTecnicas || errosConheComportamental"
							>Favor preencher todos os campos obrigatórios</span
						>
						<BotaoPadrao
							texto="SALVAR"
              :disabled="(avaliacaoFuncionario && avaliacaoFuncionario.situacao === 'Encontrado') || ( funcionario.funcionario_id === null || funcionario.funcionario_id ==='' )"
							@clique="jaIniciado ? editarAvaliacao(false) : iniciarAvaliacao(false)">
							<template v-slot>
								<img
									src="@/assets/icons/save-b.svg"
									alt="close"
									class="w-7 h-7" />
							</template>
						</BotaoPadrao>
						<BotaoPadrao
							texto="SALVAR e SAIR"
              :disabled="(avaliacaoFuncionario && avaliacaoFuncionario.situacao === 'Encontrado') || ( funcionario.funcionario_id === null || funcionario.funcionario_id ==='' )"
							@clique="jaIniciado ? editarAvaliacao(true) : iniciarAvaliacao(true)">
							<template v-slot>
								<img
									src="@/assets/icons/save-b.svg"
									alt="close"
									class="w-7 h-7" />
							</template>
						</BotaoPadrao>
            <span v-if="avaliacao.status_avaliacao_id === 2 && jaIniciado" class="text-white font-bold">Aguardando aprovação</span>
						<BotaoPadrao
              v-if="avaliacao.status_avaliacao_id === 1 && jaIniciado"
							texto="finalizar"
							@clique="finalizarAvaliacao()">
							<img
								src="@/assets/icons/check-circle-b.svg"
								alt=""
								class="w-6 h-6" />
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
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
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import { validarFormulario } from "~/mixins/validarFormulario"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import AppTooltip from "~/components/Ui/AppTooltip.vue"

	export default {
		components: {
			AppTooltip,
			AppFormTextarea,
			AppAlerta,
			AppFormCheckbox,
			BotaoPadrao,
			RodapePagina,
			AppTabs,
			CabecalhoPagina,
			AppFormInput,
			AppFormSelectCompleto,
			AppFormRadio,
		},
		data() {
			return {
				tab: "funcionario",
        funcionarios: [],
				formacoes: [],
				funcionario: {
					funcionario_id: null,
					chapa: null,
					cargo: null,
					formacao_id: null,
					anos_experiencia: null,
					conhecimentos: [],
					tiposObra: [],
					dispoTrabalho: [],
					previsao_disponibilidade: null,
					habilidadesTecnicas: [],
					conheComportamentais: [],
					comentario_geral: null,
				},
				jaIniciado: false,
				conhecimentosFuncionario: [],
				tiposObra: [],
				disponibilidadesTrabalho: [],
				campos: ["funcionario_id", "formacao_id", "previsao_disponibilidade"],
				erros: [],
				avaliacao_id: null,
				mostrarAlerta: false,
				textoAlerta: null,
        avaliacaoFuncionario: null,
				erroJaTemAvaliacao: false,
				estaDeletando: false,
				cargos: [],
				tipoObra: {
					tipo_obra: null,
					tipo_obra_avaliacao_id: null,
					cargo: null,
					cargo_avaliacao_id: null,
					anos: null,
				},
				errosTipoObra: [],
				habilidadesTecnicas: {},
				conheComportamentais: [],
				errosHabTecnicas: false,
				errosConheComportamental: false,
        avaliacao:{
          status_avaliacao_id: null
        }
			}
		},
		computed: {
			tabs() {
				return [
					{ nome: "Currículo", valor: "funcionario" },
					{ nome: "Avaliação de Desempenho", valor: "descricao_cargo", disabled: !this.jaIniciado },
					// { nome: "Descrição Cargo", valor: "descricao_cargo" },
				]
			},
			anosExperiencia() {
				return this.funcionario.tiposObra.filter(item => item.anos !== null && item.anos !== "").reduce((acc, item) => acc + parseInt(item.anos), 0)
			},
		},
		async mounted() {
			await this.buscarFuncionarios()
			await this.buscarFormacoes()
			await this.buscarConheFuncionario()
			await this.buscarTipoObra()
			await this.buscarDisponibilidaTrabalho()
			await this.buscarCargos()

			//DESCRICAO CARGO
			await this.buscarHabilidadesTecnicas()
			await this.buscarConheComportamental()

			if (this.$route.params.id) {
				await this.buscarAvaliacao(this.$route.params.id)
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			voltar() {
				this.$router.push({
					name: "Administracao-Rh-AvaliacaoFuncionario-Avaliacoes",
				})
			},
			async buscarFuncionarios() {
				let resp = await this.$axios.$get("/avaliacao_funcionario/buscar_funcionarios")

				if (!resp.falha) {
					this.funcionarios = resp.dados.funcionarios
				}
			},
			async buscarFormacoes() {
				let resp = await this.$axios.$get("/descricao_cargo/formacoes")

				if (!resp.falha) {
					let formacoes = resp.dados.formacoes
					this.formacoes = formacoes.map((o) => {
						return { id: o.id, nome: o.descricao }
					})
				}
			},
			async buscarConheFuncionario() {
				let resp = await this.$axios.$get("/conhecimento_funcionario/buscarSimples")

				if (!resp.falha) {
					this.conhecimentosFuncionario = resp.dados.conhecimentos
				}
			},
			async buscarTipoObra() {
				let resp = await this.$axios.$get("/tipo_obra/buscarSimples")

				if (!resp.falha) {
					this.tiposObra = resp.dados.tiposObra.map((o) => {
						return { id: o.id, nome: o.descricao }
					})
				}
			},
			async buscarDisponibilidaTrabalho() {
				let resp = await this.$axios.$get("/disponibilidade_trabalho/buscarSimples")

				if (!resp.falha) {
					this.disponibilidadesTrabalho = resp.dados.disponibilidades
				}
			},
			async buscarCargos() {
				let resp = await this.$axios.$get("/cargo_avaliacao/buscarSimples")

				if (!resp.falha) {
					this.cargos = resp.dados.cargos.map((o) => {
						return { id: o.id, nome: o.nome }
					})
				}
			},
			async iniciarAvaliacao(sair) {
				let {
					funcionario_id,
					formacao_id,
					conhecimentos,
					dispoTrabalho,
					tiposObra,
					previsao_disponibilidade,
				} = this.funcionario
				let usuario_id = this.$auth.user.id
				let anos_experiencia = parseInt(this.anosExperiencia)

				this.erros = validarFormulario(this.campos, this.funcionario)

				if (this.erros.length === 0) {
						let resp = await this.$axios.$post("/avaliacao_funcionario/cadastrar", {
							funcionario_id,
							formacao_id,
							anos_experiencia,
							conhecimentos,
							dispoTrabalho,
							tiposObra,
							usuario_id,
							previsao_disponibilidade,
						})

						if (!resp.falha) {
							let avaliacao = resp.dados.avaliacao

							if (sair) {
								await this.$router.push({
									name: "Administracao-Rh-AvaliacaoFuncionario-Avaliacoes",
									params: { acao: "Cadastrado" },
								})
							} else {
								let dados = resp.dados
								if (dados.tiposObra.length > 0) {
									for (let cadaTipo of dados.tiposObra) {
										let idx = this.funcionario.tiposObra.findIndex(
											(o) =>
												o.tipo_obra_avaliacao_id === cadaTipo.tipo_obra_avaliacao_id &&
												o.cargo_avaliacao_id === cadaTipo.cargo_avaliacao_id,
										)
										if (idx >= 0) {
											this.funcionario.tiposObra[idx].id = cadaTipo.id
										}
									}
								}
								this.avaliacao_id = avaliacao.id
								this.jaIniciado = true
								this.textoAlerta = "Avaliação iniciada com sucesso!"
								this.mostrarAlerta = true
							}
						}

				}
			},
			async editarAvaliacao(sair) {
				let {
					funcionario_id,
					formacao_id,
					conhecimentos,
					dispoTrabalho,
					tiposObra,
					previsao_disponibilidade,
					comentario_geral,
				} = this.funcionario
				let anos_experiencia = parseInt(this.anosExperiencia)
				let avaliacao_id = this.avaliacao_id
				let usuario_id = this.$auth.user.id

				this.erros = validarFormulario(this.campos, this.funcionario)

				if (
					this.erros.length === 0
				) {
          let habilidadesTecnicas = []
          let conheComportamentais = []

          let resp = null

          if(this.tab === 'descricao_cargo'){
            let valoresHab = Object.values(
              this.funcionario.habilidadesTecnicas.filter((o) => o !== "" && o !== null),
            )
            this.errosHabTecnicas = this.habilidadesTecnicas.length > valoresHab.length

            this.errosConheComportamental =
              this.conheComportamentais.length >
              Object.values(this.funcionario.conheComportamentais).length

            if (this.errosHabTecnicas === false &&
              this.errosConheComportamental === false){
              habilidadesTecnicas= Object.keys(this.funcionario.habilidadesTecnicas).map((o) => {
                return { id: parseInt(o), nota: this.funcionario.habilidadesTecnicas[o] }
              })

              conheComportamentais = Object.keys(this.funcionario.conheComportamentais).map((o) => {
                return { id: parseInt(o), nota: this.funcionario.conheComportamentais[o] }
              })

              resp = await this.$axios.$post("/avaliacao_funcionario/editar", {
                funcionario_id,
                formacao_id,
                anos_experiencia,
                conhecimentos,
                dispoTrabalho,
                tiposObra,
                usuario_id,
                avaliacao_id,
                previsao_disponibilidade,
                habilidadesTecnicas,
                conheComportamentais,
                comentario_geral,
              })
            }
          }else{
            resp = await this.$axios.$post("/avaliacao_funcionario/editar", {
              funcionario_id,
              formacao_id,
              anos_experiencia,
              conhecimentos,
              dispoTrabalho,
              tiposObra,
              usuario_id,
              avaliacao_id,
              previsao_disponibilidade,
              habilidadesTecnicas,
              conheComportamentais,
              comentario_geral,
            })
          }




					if (resp && !resp.falha) {
						if (sair) {
							await this.$router.push({
								name: "Administracao-Rh-AvaliacaoFuncionario-Avaliacoes",
								params: { acao: "Editado" },
							})
						} else {
							let dados = resp.dados
							if (dados.tiposObra.length > 0) {
								for (let cadaTipo of dados.tiposObra) {
									let idx = this.funcionario.tiposObra.findIndex(
										(o) =>
											o.tipo_obra_avaliacao_id === cadaTipo.tipo_obra_avaliacao_id &&
											o.cargo_avaliacao_id === cadaTipo.cargo_avaliacao_id,
									)
									if (idx >= 0) {
										this.funcionario.tiposObra[idx].id = cadaTipo.id
									}
								}
							}

							this.jaIniciado = true
							this.textoAlerta = "Avaliação editada com sucesso!"
							this.mostrarAlerta = true
						}
					}
				}
			},
			async finalizarAvaliacao() {
				await this.editarAvaliacao(false)

				this.erros = validarFormulario(this.campos, this.funcionario)

				let valoresHab = Object.values(
					this.funcionario.habilidadesTecnicas.filter((o) => o !== "" && o !== null),
				)
				this.errosHabTecnicas = this.habilidadesTecnicas.length > valoresHab.length

				this.errosConheComportamental =
					this.conheComportamentais.length >
					Object.values(this.funcionario.conheComportamentais).length

				if (
					this.erros.length === 0 &&
					this.errosHabTecnicas === false &&
					this.errosConheComportamental === false
				) {
					let avaliacao_id = this.avaliacao_id
					let usuario_id = this.$auth.user.id
					let resp = await this.$axios.$post("/avaliacao_funcionario/finalizar", {
						avaliacao_id,
						usuario_id,
					})

					if (!resp.falha) {
						let status = resp.dados.status

						await this.$router.push({
							name: "Administracao-Rh-AvaliacaoFuncionario-Avaliacoes",
							params: { acao: "Finalizado", item: avaliacao_id, status },
						})
					}
				}
			},
			async buscarAvaliacao(id) {
				let resp = await this.$axios.$get("/avalicao_funcionario/buscarAvaliacao", {
					params: { id },
				})

				if (!resp.falha) {
					let avaliacao = resp.dados.avaliacao
					this.avaliacao_id = avaliacao.id
					this.jaIniciado = true
					let conhecimentos = avaliacao.Funcionario.ConheFuncionarioAvaliacao
					this.funcionario.conhecimentos = conhecimentos.map((o) => o.id)
					let dispoTrabalho = avaliacao.Funcionario.DispoTrabalhoAvaliacao
					this.funcionario.dispoTrabalho = dispoTrabalho.map((o) => o.id)
					this.funcionario.funcionario_id = avaliacao.funcionario_id
					this.funcionario.formacao_id = avaliacao.Funcionario.formacao_id
					this.funcionario.previsao_disponibilidade = avaliacao.Funcionario.previsao_disponibilidade
					this.funcionario.tiposObra = avaliacao.Funcionario.FuncionarioTemTipoObras.map((o) => {
						return {
							id: o.id,
							tipo_obra: o.TipoObraAvaliacao ? o.TipoObraAvaliacao.descricao : null,
							cargo: o.CargoAvaliacao ? o.CargoAvaliacao.nome : null,
							cargo_avaliacao_id: o.cargo_avaliacao_id,
							tipo_obra_avaliacao_id: o.tipo_obra_avaliacao_id,
							anos: o.anos,
						}
					})

					let habilidadesTecnicas = avaliacao.AvaliacaoTemHabTecnicas
					for (let hab of habilidadesTecnicas) {
						this.funcionario.habilidadesTecnicas[`${hab.habilidade_tecnica_avaliacao_id}`] =
							hab.nota
					}

					let conheComportamentais = avaliacao.AvaliacaoTemConheComportamental
					for (let con of conheComportamentais) {
						this.funcionario.conheComportamentais[`${con.ConheComportamentalAvaliacaoId}`] =
							con.nota
					}

					this.funcionario.comentario_geral = avaliacao.comentario_geral
          this.avaliacao.status_avaliacao_id = avaliacao.status_avaliacao_id
          console.log(avaliacao);
				}
			},
			async cancelarAvaliacao() {
				let id = this.avaliacao_id
				let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$delete(`/avaliacao_funcionario/deletar`, {
					params: { id, usuario_id },
				})

				if (!resp.falha) {
					await this.$router.push({
						name: "Administracao-Rh-AvaliacaoFuncionario-Avaliacoes",
						params: { acao: "Deletado", item: id },
					})
				}
			},
			async adicionarTipoObra() {
				this.errosTipoObra = validarFormulario(
					["tipo_obra_avaliacao_id", "cargo_avaliacao_id", "anos"],
					this.tipoObra,
				)

				if (this.errosTipoObra.length === 0) {
					let tipoObra = this.tipoObra
					tipoObra.tipo_obra = this.tiposObra.find(
						(o) => o.id === tipoObra.tipo_obra_avaliacao_id,
					).nome
					tipoObra.cargo = this.cargos.find((o) => o.id === tipoObra.cargo_avaliacao_id).nome
					this.funcionario.tiposObra.push({ ...tipoObra })

					this.tipoObra = {
						tipo_obra: null,
						tipo_obra_avaliacao_id: null,
						cargo: null,
						cargo_avaliacao_id: null,
						anos: null,
					}
				}
			},
			async removerTipoObra(index) {
				this.funcionario.tiposObra.splice(index, 1)
			},

			async buscarHabilidadesTecnicas() {
				let resp = await this.$axios.$get("/habilidade_tecnica/buscarSimples")

				if (!resp.falha) {
					this.habilidadesTecnicas = resp.dados.habilidades
				}
			},
			async buscarConheComportamental() {
				let resp = await this.$axios.$get("/conhecimento_comportamental/buscarSimples")

				if (!resp.falha) {
					this.conheComportamentais = resp.dados.conhecimentos
				}
			},
		},
		watch: {
			"funcionario.funcionario_id"(valor) {
				if (valor) {
					let idx = this.funcionarios.findIndex((o) => o.id === valor)

					let funcionario = this.funcionarios[idx]

          console.log(funcionario);

					this.funcionario.chapa = funcionario.chapa
					this.funcionario.cargo = funcionario.cargo

					if (!this.jaIniciado) {
						if (funcionario.AvaliacaoFuncionarios.length > 0) {
              let avaliacao = funcionario.AvaliacaoFuncionarios[0]

              console.log(avaliacao)

              if(avaliacao.status_avaliacao_id === 3){
                this.avaliacaoFuncionario = {
                  situacao: "Finalizado",
                  nome: funcionario.AvaliacaoFuncionarios[0].AvaliadoPor.nome,
                  data: funcionario.AvaliacaoFuncionarios[0].createdAt,
                }
              }else{
                this.avaliacaoFuncionario = {
                  situacao: "Encontrado",
                  nome: funcionario.AvaliacaoFuncionarios[0].AvaliadoPor.nome,
                  data: funcionario.AvaliacaoFuncionarios[0].createdAt,
                }
              }
						} else {
							this.avaliacaoFuncionario = null
						}
					}
				}
			},
		},
	}
</script>

<style scoped>
	tbody {
		display: block;
		max-height: 300px;
		overflow: auto;
	}

	thead,
	tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	td,
	th,
	tr {
		border-collapse: collapse;
	}
</style>
