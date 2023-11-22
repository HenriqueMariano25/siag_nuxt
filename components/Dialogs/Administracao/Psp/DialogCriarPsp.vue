<template>
	<div class="w-full">
		<BaseDialog
			:titulo="psp_id ? 'Editar PSP' : cadastrou ? 'PSP cadastrada' : 'Criar PSP'"
			:btnDeletar="psp_id !== null && psp_id !== ''"
			@deletar="deletarPsp()"
			:carregando="carregando"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 gap-2 flex flex-col max-h-[550px] overflow-y-auto">
					<div
						v-if="!cadastrou"
						class="flex flex-col gap-1">
						<div class="flex flex-col gap-1 bg-blue-100 border border-blue-300">
							<div class="w-full bg-blue-300 flex text-xl px-1">
								<span>FUNCIONÁRIO</span>
							</div>
							<div class="flex flex-col gap-2 p-1">
								<div class="flex gap-2 items-end">
									<span><strong>Selecione um funcionário: </strong></span>
									<AppFormSelectCompleto
										id="funcionario"
										label="Funcionário"
										:options="funcionarios"
										v-model="psp.funcionario_id"
										:disabled="editandoPsp"
										:readonly="editandoPsp"
										class="grow" />
									<div class="flex self-end">
										<BotaoPadrao
											texto="buscar"
											cor="bg-primaria-200 hover:bg-primaria-500 text-white"
											@clique="buscarFuncionario"
											:disabled="
												psp.funcionario_id === null || psp.funcionario_id === '' || editandoPsp
											">
											<img
												src="@/assets/icons/magnifier-w.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
									</div>
								</div>
								<div class="grid grid-cols-4 gap-2">
									<AppFormInput
										id="funcao"
										type="text"
										label="Função"
										obrigatorio
										disabled
										readonly
										:invalido="erros.includes('cargo')"
										v-model="psp.cargo"
										placeholder="Ex: Programador" />
									<AppFormInput
										id="matricula"
										type="text"
										obrigatorio
										:invalido="erros.includes('chapa')"
										label="Matrícula"
										disabled
										readonly
										v-model="psp.chapa"
										placeholder="Ex: 195009999" />
									<AppFormInput
										id="cpf"
										type="text"
										label="CPF"
										obrigatorio
										disabled
										readonly
										:invalido="erros.includes('cpf')"
										v-model="psp.cpf"
										placeholder="Ex: 123.456.789-12" />
									<AppFormInput
										id="setor"
										type="text"
										label="Setor"
										disabled
										obrigatorio
										:invalido="erros.includes('setor')"
										readonly
										v-model="psp.setor"
										placeholder="Ex: Administração" />
									<AppFormInput
										id="data_admissao"
										type="date"
										label="Data de Admissão"
										disabled
										:invalido="erros.includes('data_admissao')"
										readonly
										obrigatorio
										v-model="psp.data_admissao" />
									<AppFormInput
										id="turno"
										type="text"
										label="Turno"
										:invalido="erros.includes('turno')"
										obrigatorio
										disabled
										readonly
										placeholder="Ex: Diurno"
										v-model="psp.turno" />
									<AppFormInput
										id="rg"
										type="text"
										uppercase
										sem-especiais
										label="RG"
										obrigatorio
										:invalido="erros.includes('rg')"
										placeholder="Ex: 12.345.678-9"
										v-model="psp.rg" />
									<AppFormInput
										id="email"
										type="text"
										label="E-mail"
										:invalido="erros.includes('email')"
										placeholder="Ex: henrique.mariano@agnet.com.br"
										v-model="psp.email" />
									<AppFormInput
										id="celular"
										type="text"
										label="Celular"
										:invalido="erros.includes('celular')"
										v-model="psp.celular"
										mask="['(##)####-####','(##)#####-####']"
										placeholder="Ex: (22) 99123-4567" />
									<AppFormInput
										id="data_nascimento"
										type="date"
										label="Data de Nascimento"
										:invalido="erros.includes('data_nascimento')"
										obrigatorio
										v-model="psp.data_nascimento" />
									<AppFormInput
										id="intervalo"
										type="text"
										label="Intervalo"
										readonly
										placeholder="Ex: 90 dias"
										:invalido="erros.includes('prazo')"
										disabled
										obrigatorio
										v-model="psp.prazo" />
								</div>
								<div
									class="bg-red-300 px-2 flex flex-col"
									v-if="funcionario && (!funcionario.Coordenador || !funcionario.Gestor)">
									<span> Campos necessário no cadastro do Funcionário: </span>
									<span
										class="pl-2"
										v-if="funcionario && !funcionario.Coordenador">
										<strong>Coordenador</strong>
									</span>
									<span
										class="pl-2"
										v-if="funcionario && !funcionario.Gestor">
										<strong>Gestor da Área</strong>
									</span>
								</div>
								<div v-if="funcionario && !funcionario.prazo">
									<span class="bg-red-300 px-2 flex flex-col">
										<strong>
											Funcionário sem intervalo entre folgas de campo, favor procurar o responsável
											pela compra de passagem.
										</strong>
									</span>
								</div>
								<div
									class="bg-sky-200 border border-sky-500"
									v-if="funcionario && funcionario.Psp && funcionario.Psp.length > 0">
									<div class="flex w-full bg-sky-500 px-1 text-lg">
										<span>PSP anterior</span>
									</div>
									<div class="grid grid-cols-2 px-1">
										<span
											><strong>Data de ida: </strong
											>{{ $dayjs(funcionario.Psp[0].data_ida).format("DD/MM/YYYY") }}</span
										>
										<span
											><strong>Data de volta: </strong
											>{{ $dayjs(funcionario.Psp[0].data_volta).format("DD/MM/YYYY") }}</span
										>
									</div>
									<div class="flex w-full bg-sky-500 px-1 text-lg mt-1">
										<span>Previsão próxima PSP</span>
									</div>
									<div
										class="grid grid-cols-2 px-1"
										v-if="funcionario.prazo">
										<span
											><strong>Data prevista de ida: </strong
											>{{
												$dayjs(funcionario.Psp[0].data_volta)
													.add(funcionario.prazo, "day")
													.format("DD/MM/YYYY")
											}}</span
										>
										<span v-if="psp.data_ida">
											<strong>Dias da última volta até a próxima ida: </strong>
											{{ $dayjs(psp.data_ida).diff(funcionario.Psp[0].data_volta, "day") }}
											dias
										</span>
									</div>
									<div
										class="w-full flex justify-center mt-0.5 bg-red-200 border-t-2 border-red-500"
										v-if="
											$dayjs(psp.data_ida).diff(funcionario.Psp[0].data_volta, 'day') <
											funcionario.prazo
										">
										<img
											src="@/assets/icons/alert-triangle-r.svg"
											alt=""
											class="w-7 h-7 flex" />
										<span class="flex text-red-500 text-lg px-1">
											<strong>DATA DE IDA É MENOR DO QUE A DATA PREVISTA</strong>
										</span>
									</div>
								</div>
							</div>
						</div>
						<div class="flex flex-col gap-1 bg-blue-100 border border-blue-300 relative">
							<div
								class="absolute w-full h-full bg-gray-700/70 z-50 text-center justify-center text-4xl text-white items-center flex"
								v-if="
									!funcionario ||
									!funcionario.Coordenador ||
									!funcionario.Gestor ||
									!funcionario.prazo
								">
								<div class="p-3 bg-gray-800 rounded">
									<span v-if="!funcionario"><strong> Selecione um funcionário </strong></span>
									<span
										v-else-if="
											!funcionario.Coordenador || !funcionario.Gestor || !funcionario.prazo
										">
										<strong>Funcionário com informação pendente </strong>
									</span>
								</div>
							</div>
							<div class="">
								<div class="w-full bg-blue-300 flex text-xl px-1">
									<span>PSP</span>
								</div>
								<div class="grid grid-cols-2 gap-2 p-1">
									<div class="flex gap-1 flex-col">
										<AppFormInput
											id="origem"
											type="text"
											label="Origem"
											placeholder="Ex: Grussai, São João da Barra, RJ"
											:invalido="erros.includes('origem')"
											obrigatorio
											v-model="psp.origem" />
										<AppFormInput
											id="destino"
											type="text"
											label="Destino"
											:invalido="erros.includes('destino')"
											placeholder="Ex: Tietê, São Paulo, SP"
											obrigatorio
											v-model="psp.destino" />
									</div>
									<div class="flex gap-1 flex-col">
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
									<AppFormSelectCompleto
										id="centrosCusto"
										label="Centro de Custo"
										:options="centrosCusto"
										:invalido="erros.includes('centro_custo_pep_id')"
										v-model="psp.centro_custo_pep_id"
										class="grow" />
									<div></div>
									<div
										class="grid grid-cols-2 col-span-2 gap-x-2 bg-gray-50 p-1 border border-gray-400">
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
                              <BotaoPadrao icone @clique="removerMeioTransporte(index)">
                                <img src="@/assets/icons/delete-b.svg" alt="" class="w-6 h-6">
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

									<div class="flex flex-col gap-1">
										<AppFormRadio
											:itens="opcoesMotivo"
											titulo="Motivo"
											obrigatorio
											v-model="psp.motivo"
											:invalido="erros.includes('motivo')"
											id="motivo" />
										<AppFormInput
											v-if="motivoOutro"
											id="outros_motivo"
											type="text"
											label="Descrição do motivo"
											obrigatorio
											:invalido="erros.includes('outros_motivo')"
											placeholder="Ex: Descreva o motivo"
											v-model="psp.outros_motivo" />
									</div>
									<div
										class="col-span-2 border border-blue-500 flex flex-col"
										v-if="psp.motivo === 'Mobilização familiar'">
										<span class="bg-blue-500 text-white w-full px-2 py-0.5">Dependentes</span>
										<div class="flex flex-col p-1 gap-1">
											<div class="flex gap-2">
												<AppFormInput
													id="nomeDepente"
													type="text"
													class="grow"
													label="Nome"
													:invalido="errosDependentes.includes('nome')"
													placeholder="Ex: Henrique Mariano"
													obrigatorio
													v-model="dependente.nome" />
												<AppFormInput
													id="cpfDepente"
													type="text"
													class="grow"
													label="CPF"
													mask="###.###.###-##"
													:invalido="errosDependentes.includes('cpf')"
													placeholder="Ex: 123.456.789-12"
													obrigatorio
													v-model="dependente.cpf" />
											</div>
											<div class="flex gap-2">
												<AppFormInput
													id="rgDepente"
													type="text"
													label="RG"
													class="grow"
													:invalido="errosDependentes.includes('rg')"
													placeholder="Ex: 12.345.678-9"
													obrigatorio
													mask="##.###.###-#"
													v-model="dependente.rg" />
												<AppFormInput
													id="dataNascimentoDepente"
													type="date"
													label="Data de Nascimento"
													class="grow"
													:invalido="errosDependentes.includes('data_nascimento')"
													obrigatorio
													v-model="dependente.data_nascimento" />

												<div class="flex items-end">
													<BotaoPadrao
														texto="adicionar"
														cor="bg-blue-400 hover:!bg-blue-500"
														@clique="adicionarDependente()">
														<img
															src="@/assets/icons/add-b.svg"
															alt=""
															class="w-7 h-7" />
													</BotaoPadrao>
												</div>
											</div>
											<div
												v-if="erroSemDependente"
												class="flex">
												<span class="text-lg px-1 bg-red-400 w-full text-gray-800"
													><strong>Adicione pelo menos 1 dependente</strong></span
												>
											</div>
											<div>
												<table
													class="w-full bg-white table"
													v-if="dependentes.length > 0">
													<thead>
														<tr class="bg-primaria-700 text-white">
															<th class="border border-gray-500 px-1">Nome</th>
															<th class="border border-gray-500 px-1">CPF</th>
															<th class="border border-gray-500 px-1">RG</th>
															<th class="border border-gray-500 px-1">Data de Nascimento</th>
															<th class="border border-gray-500 px-1"></th>
														</tr>
													</thead>
													<tbody>
														<tr
															v-for="dependente of dependentes"
															:key="dependente.cpf">
															<td class="border border-gray-500 px-1">{{ dependente.nome }}</td>
															<td class="border border-gray-500 px-1">{{ dependente.cpf }}</td>
															<td class="border border-gray-500 px-1">{{ dependente.rg }}</td>
															<td class="border border-gray-500 px-1">
																{{ $dayjs(dependente.data_nascimento).format("DD/MM/YYYY") }}
															</td>
															<td class="border border-gray-500 px-1 items-center w-10">
																<BotaoPadrao
																	icone
																	@clique="deletarDependente(dependente.cpf)">
																	<img
																		src="@/assets/icons/delete-b.svg"
																		alt=""
																		class="w-6 h-6" />
																</BotaoPadrao>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</div>
									<AppFormTextarea
										class="col-span-2"
										:total-caracteres="1000"
										id="teste"
										label="Descrição do Itinerário"
										v-model="psp.descricao_itinerario" />
								</div>
							</div>
						</div>
					</div>
					<div
						v-if="cadastrou"
						class="flex flex-col gap-0.5">
						<!--          <span class="">PSP criada com sucesso</span>-->
						<span class="text-xl">
							Código da PSP: <strong>{{ ("00000" + psp.id).slice(-5) }}</strong>
						</span>
						<span class="text-xl">
							Motivo: <strong>{{ psp.motivo }}</strong></span
						>
						<span class="text-xl"
							>Data de ida: <strong>{{ $dayjs(psp.data_ida).format("DD/MM/YYYY") }}</strong></span
						>
						<span class="text-xl"
							>Data de volta:
							<strong>{{ $dayjs(psp.data_volta).format("DD/MM/YYYY") }}</strong></span
						>
						<div class="flex flex-col gap-2 w-full border border-gray-500">
							<span class="px-1 bg-blue-300 text-xl">Etapas de aprovação</span>
							<div class="flex items-center gap-4 self-center pb-1">
								<div
									class="flex flex-col justify-center items-center"
									v-if="menor35dias">
									<div class="bg-blue-400 w-7 h-7 rounded-full"></div>
									<span><strong>Gerente GAF</strong></span>
									<span>Validação do Prazo</span>
								</div>
								<div
									class=""
									v-if="menor35dias">
									<img
										src="@/assets/icons/arrow-right-blue.svg"
										alt=""
										class="w-10 h-10" />
								</div>
								<div class="flex flex-col justify-center items-center">
									<div class="bg-blue-400 w-7 h-7 rounded-full"></div>
									<span><strong>RH</strong></span>
									<span>Validação do Destino</span>
								</div>
								<div class="">
									<img
										src="@/assets/icons/arrow-right-blue.svg"
										alt=""
										class="w-10 h-10" />
								</div>
								<div class="flex flex-col justify-center items-center">
									<div class="bg-blue-400 w-7 h-7 rounded-full"></div>
									<span><strong>Coordenador</strong></span>
									<span>{{ funcionario.Coordenador ? funcionario.Coordenador.nome : "" }}</span>
								</div>
								<div class="">
									<img
										src="@/assets/icons/arrow-right-blue.svg"
										alt=""
										class="w-10 h-10" />
								</div>
								<div class="flex flex-col justify-center items-center">
									<div class="bg-blue-400 w-7 h-7 rounded-full"></div>
									<span><strong>Gestor da Área</strong></span>
									<span>{{ funcionario.Gestor ? funcionario.Gestor.nome : "" }}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex">
					<BotaoPadrao
						texto="salvar"
						:disabled="!podeSalvar"
						@clique="psp_id ? editarPsp() : cadastrarPsp()"
						v-if="!cadastrou">
						<img
							src="@/assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="fechar"
						@clique="cancelar()"
						v-if="cadastrou">
						<img
							src="@/assets/icons/back-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"

	export default {
		name: "DialogCriarPsp",
		components: {
			BaseDialog,
		},
		data() {
			return {
				carregando: false,
				psp: {
					id: null,
					funcionario_id: null,
					cargo: null,
					chapa: null,
					data_admissao: null,
					setor: null,
					rg: null,
					celular: null,
					email: null,
					turno: null,
					data_nascimento: null,
					motivo: null,
					outros_motivo: null,
					meio_transporte: null,
					prazo: null,
					origem: null,
					destino: null,
					data_ida: null,
					data_volta: null,
					centro_custo_pep_id: null,
					descricao_itinerario: null,
				},
				funcionarios: [],
				turnos: [],
				opcoesMotivo: [
					{ label: "Baixada", valor: "Baixada" },
					{ label: "Férias", valor: "Férias" },
					{ label: "Mobilização familiar", valor: "Mobilização familiar" },
					{ label: "Outros", valor: "outros" },
				],
				opcoesMeioTransporte: [
					{ nome: "Rodoviário", id: "Rodoviário" },
					{ nome: "Aérea", id: "Aérea" },
					{ nome: "Carro", id: "Carro" },
				],
				centrosCusto: [],
				cadastrou: false,
				mostrarAlerta: false,
				textoAlerta: null,
				erros: [],
				dependente: {
					nome: null,
					cpf: null,
					data_nascimento: null,
					rg: null,
				},
				dependentes: [],
				errosDependentes: [],
				erroSemDependente: false,
				editandoPsp: false,
				funcionario: null,
				textoErroDataIda: null,
				textoErroDataVolta: null,
				podeSalvar: false,
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
		props: {
			psp_id: {
				type: [Object, Number],
			},
		},
		computed: {
			motivoOutro() {
				return this.psp.motivo === "outros"
			},
			menor35dias() {
				if (this.psp.meio_transporte === "Rodoviário") {
					return this.$dayjs(this.psp.data_ida).diff(this.$dayjs(), "day") < 15
				}

				if (this.psp.meio_transporte === "Aérea") {
					this.$dayjs(this.psp.data_ida).diff(this.$dayjs(), "day") < 35
				}

				return false
			},
		},
		async created() {
			await this.buscarFuncionarios()
			await this.buscarTurnos()
			await this.buscarCentrosCusto()

			if (this.psp_id) {
				this.editandoPsp = true
				await this.buscarPsp()
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarPsp() {
				let resp = await this.$axios.$get(`/psp/buscar/${this.psp_id}`)

				if (!resp.falha) {
					let psp = resp.dados.psp
					this.psp.funcionario_id = psp.funcionario_id
					this.psp = Object.assign(this.psp, resp.dados.psp)
          this.meiosTransporte = psp.PspTemMeioTransporte
					await this.buscarFuncionario()
					this.carregando = false
				}
			},
			async buscarFuncionarios() {
				let resp = await this.$axios.$get("/efetivo/buscar_responsaveis")

				if (!resp.falha) {
					let funcionarios = resp.dados.responsaveis

					this.funcionarios = funcionarios.map((o) => {
						return { id: o.id, nome: o.nome }
					})
				}
			},
			async buscarTurnos() {
				let resp = await this.$axios.$get("/efetivo/buscar/turnos")

				if (!resp.falha) {
					let turnos = resp.dados.turnos

					this.turnos = turnos.map((o) => {
						return { id: o.id, nome: o.descricao }
					})
				}
			},
			async buscarFuncionario() {
				let funcionario_id = this.psp.funcionario_id

				let resp = await this.$axios.$get("/psp/buscar/funcionario", {
					params: { id: funcionario_id, data_ida: this.psp.data_ida, psp_id: this.psp.id },
				})

				if (!resp.falha) {
					let funcionario = resp.dados.funcionario
					this.funcionario = funcionario

					let prazo = resp.dados.prazo
					let ultimaPsp = resp.dados.ultimaPsp
					prazo && prazo.prazo ? (this.funcionario.prazo = prazo.prazo) : null

					this.psp.cargo = funcionario.cargo
					this.psp.chapa = funcionario.chapa
					this.psp.cpf = funcionario.cpf
					this.psp.celular = funcionario.celular
					this.psp.email = funcionario.email
					this.psp.rg = funcionario.rg
					this.psp.data_nascimento = funcionario.data_nascimento
						? this.$dayjs(funcionario.data_nascimento).format("YYYY-MM-DD")
						: null
					this.psp.data_admissao = funcionario.data_admissao
						? this.$dayjs(funcionario.data_admissao).format("YYYY-MM-DD")
						: null
					this.psp.turno = funcionario.Turno ? funcionario.Turno.descricao : null
					prazo ? (this.psp.prazo = `${prazo.prazo} dias`) : (this.psp.prazo = null)
					this.psp.setor = funcionario.setor ? funcionario.setor.nome : null

					if (ultimaPsp) {
						this.psp.origem = ultimaPsp.origem
						this.psp.destino = ultimaPsp.destino
						this.psp.centro_custo_pep_id = ultimaPsp.centro_custo_pep_id
						this.psp.meio_transporte = ultimaPsp.meio_transporte
					}

					if (funcionario.Coordenador === null || funcionario.Gestor === null) {
						this.podeSalvar = false
					} else {
						this.podeSalvar = true
					}
				}
			},
			async deletarPsp() {
				let usuario_id = this.$auth.user.id
				let psp_id = this.psp_id

				let resp = await this.$axios.$post("/psp/deletar", { usuario_id, psp_id })

				if (!resp.falha) {
					this.$emit("deletado", psp_id)
				}
			},
			async buscarCentrosCusto() {
				let resp = await this.$axios.$get("/suprimentos/ss/centro_custo/buscarTodos")

				if (!resp.falha) {
					let centrosCusto = resp.dados.centrosCusto
					this.centrosCusto = centrosCusto.map((o) => {
						return { id: o.id, nome: `${o.numero_pep} - ${o.descricao}` }
					})
				}
			},
			validarFormulario() {
				this.erros = []

				let camposObrigatorio = [
					"funcionario_id",
					"cargo",
					"chapa",
					"data_admissao",
					"setor",
					"rg",
					"celular",
					"email",
					"turno",
					"data_nascimento",
					"motivo",
					"prazo",
					"origem",
					"destino",
					"data_ida",
					"data_volta",
					"centro_custo_pep_id",
				]

				if (this.psp.motivo === "outros") {
					camposObrigatorio.push("outros_motivo")
				}

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

				if (this.meiosTransporte.length === 0) this.erros.push("meiosTransporte")

				for (let campo of camposObrigatorio) {
					if (this.psp[`${campo}`] === null || this.psp[`${campo}`] === "") this.erros.push(campo)
				}
			},

			async cadastrarPsp() {
				this.validarFormulario()
				let psp = this.psp
				let usuario_id = this.$auth.user.id
				let dependentes = []
				let meiosTransporte = this.meiosTransporte

				if (psp.motivo === "Mobilização familiar") {
					if (this.dependentes.length <= 0) {
						this.erroSemDependente = true
					} else {
						dependentes = this.dependentes
					}
				} else {
					this.erroSemDependente = false
				}

				if (this.erros.length === 0 && this.erroSemDependente === false) {
					let resp = await this.$axios.$post("/psp/criar", {
						...psp,
						usuario_id,
						dependentes,
						meiosTransporte,
					})
					if (!resp.falha) {
						let pspEncontrada = resp.dados.psp

						this.cadastrou = true
						this.psp.id = pspEncontrada.id
						this.$emit("cadastrado", pspEncontrada)
					}
				}
			},

			async editarPsp() {
				this.validarFormulario()
				let psp = this.psp
				let usuario_id = this.$auth.user.id
				let dependentes = []
				let psp_id = this.psp_id
				let etapa_psp_id = this.psp.etapa_psp_id
        let meiosTransportes = this.meiosTransporte

				if (psp.motivo === "Mobilização familiar") {
					if (this.dependentes.length <= 0) {
						this.erroSemDependente = true
					} else {
						dependentes = this.dependentes
					}
				} else {
					this.erroSemDependente = false
				}

				if (this.erros.length === 0 && this.erroSemDependente === false) {
					let resp = await this.$axios.$post("/psp/editar", {
						...psp,
						usuario_id,
						dependentes,
						psp_id,
            meiosTransportes
					})

					if (!resp.falha) {
						let pspEncontrada = resp.dados.psp
						let mudaEtapa = false

						if (etapa_psp_id === 10) {
							mudaEtapa = true
						}

						this.$emit("editado", { psp: pspEncontrada, mudaEtapa })
					}
				}
			},

			validarDependente() {
				this.errosDependentes = []

				let camposObrigatorio = ["nome", "cpf", "rg", "data_nascimento"]

				for (let campo of camposObrigatorio) {
					if (this.dependente[`${campo}`] === null || this.dependente[`${campo}`] === "")
						this.errosDependentes.push(campo)
				}
			},

			adicionarDependente() {
				this.validarDependente()

				if (this.errosDependentes.length === 0) {
					this.dependentes.push(Object.assign({}, this.dependente))
					for (let k of Object.keys(this.dependente)) {
						this.dependente[k] = null
					}
					this.erroSemDependente = false
				}
			},

			deletarDependente(cpf) {
				let idx = this.dependentes.findIndex((o) => o.cpf === cpf)

				if (idx >= 0) {
					this.dependentes.splice(idx, 1)
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

      removerMeioTransporte(idx){
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
		},
		watch: {
			"psp.origem": function (valor) {
				this.meioTransporte.origem = valor
			},
			"psp.destino": function (valor) {
				this.meioTransporte.destino = valor
			},
		},
	}
</script>

<style scoped></style>
<script setup>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
</script>
