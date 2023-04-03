<template>
	<BaseDialog
		:titulo="
			ss_id === null ? 'Criar Solicitação de Serviço' : `Editando Solicitação de Serviço - ${ss_id}`
		"
		:carregando="carregando"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div
				class="flex w-full overflow-auto px-2 relative"
				style="max-height: calc(80vh)">
				<div class="w-full flex-col space-y-2">
					<div class="bg-blue-100 p-2 border border-blue-200 space-y-1">
						<div class="grid grid-cols-3 gap-x-4 gap-y-2">
							<AppFormInput
								label="Código de acompanhamento"
								placeholder="Ex.: ELETR"
								type="text"
								obrigatorio
								id="cod_acompanhamento"
								mask="@@@@@"
								:invalido="erro.includes('numero_acompanhamento')"
								v-model="ss.numero_acompanhamento" />
							<AppFormInput
								label="Data de Emissão"
								type="date"
								obrigatorio
								:readonly="true"
								id="data_emissao"
								:invalido="erro.includes('data_emissao')"
								v-model="ss.data_emissao" />
							<AppFormInput
								label="Data de Necessidade"
								type="date"
								obrigatorio
								id="data_necessidade"
								:invalido="erro.includes('data_necessidade')"
								v-model="ss.data_necessidade" />
							<AppFormSelect
								class="col-span-2"
								obrigatorio
								label="Elemento PEP"
								:options="centrosCusto"
								v-model="ss.centro_custo_pep_id"
								id="centro_custo"
								:invalido="erro.includes('centro_custo_pep_id')" />
							<AppFormInput
								label="Ordem de Serviço"
								type="text"
								id="order_servico"
								placeholder="Opcional"
								v-model="ss.ordem_servico" />
						</div>
						<div class="grid grid-cols-2">
							<AppFormRadio
								:itens="opcoesNaturezaOperacao"
								titulo="Natureza Operação"
								obrigatorio
								v-model="ss.natureza_operacao"
								disabled
								id="natureza_operacao"
								:invalido="erro.includes('natureza_operacao')" />
							<AppFormRadio
								:disabled="!selecionarTipoSolicitacao"
								:itens="opcoesTipoSolicitacao"
								titulo="Tipo de Solicitação"
								obrigatorio
								v-model="ss.tipo_solicitacao"
								id="tipo_solicitacao"
								:invalido="erro.includes('tipo_solicitacao')" />
						</div>
						<div class="grid grid-cols-3 gap-x-4">
							<span class="col-span-3 text-md"
								><strong>1 - PRAZO PARA EXECUÇÃO DO SERVIÇO</strong></span
							>
							<AppFormInput
								label="Data de Ínicio"
								type="date"
								:readonly="true"
								obrigatorio
								id="data_inicio"
								:invalido="erro.includes('data_inicio')"
								v-model="ss.data_inicio" />
							<AppFormInput
								label="Data de Término"
								type="date"
								id="data_fim"
								obrigatorio
								:invalido="erro.includes('data_fim')"
								v-model="ss.data_fim" />
							<AppFormInput
								label="Prazo Total(dias)"
								type="text"
								:readonly="true"
								id="dias_totais"
								obrigatorio
								:invalido="erro.includes('prazo')"
								v-model="ss.prazo" />
						</div>
					</div>
					<div class="flex-col bg-blue-100 p-2 border border-blue-200">
						<span class="col-span-3 text-md"><strong>2 - ESCOPO DOS SERVIÇOS</strong></span>
						<AppFormSelect
							class="col-span-2"
							label="Requisita-se a contratação dos serviços abaixo descrito:"
							:options="escopos"
							v-model="ss.escoposs_id"
							id="escoposs_id"
							:invalido="erro.includes('escoposs_id')" />
					</div>
					<div class="bg-blue-100 p-2 border border-blue-200">
						<div class="flex-col">
							<span class="col-span-3 text-md"><strong>3 - ABRANGÊNCIA DO ESCOPO</strong></span>
							<AppFormTextarea
								id="observacoes_matriz"
								obrigatorio
								label="Abragência do Escopo"
								placeholder="Descrição mais detalhada do escopo selecionado a cima"
								v-model="ss.abrangencia_escopo"
								:invalido="erro.includes('abrangencia_escopo')"
								class="mt-1" />
						</div>
						<div class="grid grid-cols-4 gap-y-1">
							<AppFormCheckbox
								label="ET-Especificação Técnica"
								:valor="true"
								id="et"
								v-model="ss.et" />
							<AppFormCheckbox
								label="MD-Memorial Descritivo"
								:valor="true"
								id="md"
								v-model="ss.md" />
							<AppFormCheckbox
								label="FD-Folha de Dados"
								:valor="true"
								id="fd"
								v-model="ss.fd" />
							<AppFormCheckbox
								label="RFP(Para escopos complexos)"
								:valor="true"
								id="rfp"
								v-model="ss.rfp" />
							<AppFormCheckbox
								label="EAP-Especificação Analítica de Projeto"
								:valor="true"
								id="eap"
								v-model="ss.eap" />
							<AppFormCheckbox
								label="Edital(apenas da parte técnica)"
								:valor="true"
								id="edital"
								v-model="ss.edital" />
							<AppFormCheckbox
								label="Cronograma"
								:valor="true"
								id="cronograma"
								v-model="ss.cronograma" />
							<AppFormCheckbox
								label="Histograma"
								:valor="true"
								id="histograma"
								v-model="ss.histograma" />
						</div>
					</div>
					<div class="flex-col bg-blue-100 p-2 border border-blue-200">
						<span class="col-span-3 text-md">
							<strong>4 - LOCAL DA PRESTAÇÃO DO SERVIÇO</strong>
						</span>
						<div class="flex items-end space-x-2">
							<AppFormRadio
								class="w-2/12 self-start"
								:itens="opcoesLocalPrestacao"
								titulo=""
								v-model="ss.local_prestacao_obra"
								id="local_prestacao_obra"
								:invalido="erro.includes('local_prestacao_obra')" />
							<AppFormInput
								class="w-full mt-4"
								label=""
								placeholder="Avenida Paulista, n° 123, São Paulo"
								type="text"
								id="endereco_prestacao"
								v-model="ss.endereco_prestacao"
								:invalido="erro.includes('endereco_prestacao')"
								:disabled="ss.local_prestacao_obra !== 'fora_obra'" />
						</div>
					</div>
					<div class="bg-blue-100 p-2 border border-blue-200">
						<div class="flex flex-col">
							<span class="text-md w-full"><strong>5 - SUGESTÃO DE FORNECEDORES</strong></span>
							<span class="w-full"
								>A Área Requisitante sugere os seguintes prestadores de serviços (máximo 4
								fornecedores):</span
							>
							<div class="gap-y-2 w-full flex flex-wrap gap-x-4">
								<AppFormInput
									class="w-[49.4%]"
									label="Fornecedor"
									placeholder="Fornecedor"
									type="text"
									id="fornecedor"
									v-model="fornecedor.nome" />
								<AppFormInput
									class="w-[49.4%]"
									label="E-mail"
									placeholder="E-mail"
									type="text"
									id="email"
									v-model="fornecedor.email" />
								<AppFormInput
									class="w-[49.4%]"
									label="Pessoa de contato"
									placeholder="Pessoa de contato"
									type="text"
									id="pessoa_contato"
									v-model="fornecedor.pessoa_contato" />
								<AppFormInput
									class="w-[40.3%]"
									label="Telefone"
									placeholder="Telefone"
									type="text"
									mask="['(##)####-####','(##)#####-####']"
									id="telefone"
									v-model="fornecedor.telefone" />
								<BotaoPadrao
									:disabled="validarAddFornecedor"
									texto="Adicionar"
									cor="bg-[#15536D]"
									class="text-white self-end"
									@click="adicionarFornecedor()">
								</BotaoPadrao>
							</div>
						</div>
						<div class="mt-2">
							<table class="w-full bg-white border border-collapse">
								<thead class="bg-primaria-500 text-white border border-gray-400">
									<tr>
										<th></th>
										<th>Nome</th>
										<th>Telefone</th>
										<th>E-mail</th>
										<th>Pessoa de Contato</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(forn, index) in fornecedores"
										:key="index">
										<td class="border border-gray-400">
											<BotaoIcone
												class="flex"
												@click="removerFornecedor(index)">
												<img
													src="@/assets/icons/delete-b.svg"
													alt="close"
													class="w-6 h-6" />
											</BotaoIcone>
										</td>

										<td class="border border-gray-400 pl-2">{{ forn.nome }}</td>
										<td class="border border-gray-400 pl-2">{{ forn.telefone }}</td>
										<td class="border border-gray-400 pl-2">{{ forn.email }}</td>
										<td class="border border-gray-400 pl-2">{{ forn.pessoa_contato }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div class="flex flex-col bg-blue-100 p-2 border border-blue-200">
						<span class="text-md w-full"
							><strong>6 - PARTICULARIDADES RELATIVAS AOS SERVIÇOS</strong></span
						>
						<span class="w-full"
							>Qualificação da Empresa e/ou Colaboradores (quando aplicável por exigência do
							Cliente)</span
						>
						<AppFormInput
							class="mt-2"
							label="Atestação da Empresa:"
							placeholder="Atestação da Empresa"
							type="text"
							id="atestacao_empresa"
							v-model="ss.atestacao_empresa" />
						<AppFormInput
							class="mt-2"
							label="Currículo dos Colaboradores:"
							placeholder="Currículo dos Colaboradores"
							type="text"
							id="curriculo_colaboradores"
							v-model="ss.curriculo_colaboradores" />
						<AppFormInput
							class="mt-2"
							label="Certificações, licenças, alvarás exigidos:"
							placeholder="Certificações, licenças, alvarás exigidos"
							type="text"
							id="certificacaoes_licencas"
							v-model="ss.certificacaoes_licencas" />
						<AppFormInput
							class="mt-2"
							label="Outros"
							placeholder="Outros"
							type="text"
							id="outros"
							v-model="ss.outros" />
					</div>
					<div class="flex flex-col bg-blue-100 p-2 border border-blue-200">
						<span class="text-md w-full"><strong>7 - MATRIZ DE RESPONSABILIDADES</strong></span>
						<span class="w-full"
							>Qualquer campo que necessite de descrição, informar no campo de observação.</span
						>
						<table class="table-fixed w-full border border-collapse bg-white">
							<thead class="bg-primaria-500 text-white border border-gray-400">
								<tr>
									<th>AG</th>
									<th>FORNECEDOR</th>
									<th>N/A</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.alojamento"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.alojamento"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.alojamento"
											value="na" />
									</td>
									<td><span>Alojamento</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.alimentacao_interna"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.alimentacao_interna"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.alimentacao_interna"
											value="na" />
									</td>
									<td><span>Alimentação Interna</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.alimentacao_externa"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.alimentacao_externa"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.alimentacao_externa"
											value="na" />
									</td>
									<td><span>Alimentação Externa</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.transporte"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.transporte"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.transporte"
											value="na" />
									</td>
									<td><span>Transporte/Vale Transporte</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.cesta_basica"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.cesta_basica"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.cesta_basica"
											value="na" />
									</td>
									<td><span>Cesta Básica</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.plano_odontologico"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.plano_odontologico"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.plano_odontologico"
											value="na" />
									</td>
									<td><span>Plano Odontológico</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.epi"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.epi"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.epi"
											value="na" />
									</td>
									<td><span>EPI's (descrever)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.epc"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.epc"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.epc"
											value="na" />
									</td>
									<td><span>EPC's (descrever)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.despesas_viagem"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.despesas_viagem"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.despesas_viagem"
											value="na" />
									</td>
									<td><span>Despesas de Viagens</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.banheiro_bebedouro"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.banheiro_bebedouro"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.banheiro_bebedouro"
											value="na" />
									</td>
									<td><span>Banheiro Químico e Bebedouro</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.vestiario"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.vestiario"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.vestiario"
											value="na" />
									</td>
									<td><span>Vestiários</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.energia"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.energia"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.energia"
											value="na" />
									</td>
									<td><span>Energia (especificar voltagem)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.agua"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.agua"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.agua"
											value="na" />
									</td>
									<td><span>Água</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.exames_admissionais"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.exames_admissionais"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.exames_admissionais"
											value="na" />
									</td>
									<td><span>Exames Adminissionais</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.cracha_uniforme"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.cracha_uniforme"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.cracha_uniforme"
											value="na" />
									</td>
									<td><span>Crachá e Uniforme(descrever)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.guindaste"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.guindaste"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.guindaste"
											value="na" />
									</td>
									<td><span>Guindastes(especificar)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.andaime"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.andaime"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.andaime"
											value="na" />
									</td>
									<td><span>Andaime(especificar)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.equip_pequeno_porte"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.equip_pequeno_porte"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.equip_pequeno_porte"
											value="na" />
									</td>
									<td><span>Equip. de Pequeno Porte(especificar)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.escritorio"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.escritorio"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.escritorio"
											value="na" />
									</td>
									<td><span>Escritório(especificar espaço)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.mobiliario"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.mobiliario"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.mobiliario"
											value="na" />
									</td>
									<td><span>Mobiliário(descrever)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.seguro"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.seguro"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.seguro"
											value="na" />
									</td>
									<td><span>Seguro(descrever)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.garantias"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.garantias"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.garantias"
											value="na" />
									</td>
									<td><span>Garantias(descrever)</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.veiculos"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.veiculos"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.veiculos"
											value="na" />
									</td>
									<td><span>Veículos</span></td>
								</tr>
								<tr class="text-center border border-gray-400">
									<td>
										<input
											type="radio"
											v-model="matriz.tributos"
											value="ag"
											class="self-center" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.tributos"
											value="fornecedor" />
									</td>
									<td>
										<input
											type="radio"
											v-model="matriz.tributos"
											value="na" />
									</td>
									<td><span>Tributos</span></td>
								</tr>
							</tbody>
						</table>
						<AppFormTextarea
							id="observacoes_matriz"
							label="Observações"
							placeholder="Observações opicionais"
							v-model="ss.observacoes_matriz"
							class="mt-1" />
					</div>
					<div class="grid grid-cols-2 gap-3">
						<div class="bg-blue-100 p-2 border border-blue-200">
							<span class="text-md w-full"><strong>8 - CONDIÇÃO DE TRABALHO</strong></span>
							<AppFormInput
								class="mt-2"
								label="Jornada de Trabalho"
								placeholder="Jornada de Trabalho"
								type="text"
								obrigatorio
								:invalido="erro.includes('jornada_trabalho')"
								id="outros"
								v-model="ss.jornada_trabalho" />
							<table class="border-collapse w-full mt-2 bg-white">
								<tbody>
									<tr class="border border-gray-400">
										<td class="px-2 py-1"><span>É permitidos trabalho noturno ?</span></td>
										<td class="px-2 py-1">
											<input
												type="radio"
												v-model="ss.permitido_trabalho_noturno"
												:value="true"
												id="permitido_trabalho_noturno_sim"
												class="mr-1" />
											<label for="permitido_trabalho_noturno_sim">Sim</label>
										</td>
										<td class="px-2 py-1">
											<input
												type="radio"
												id="permitido_trabalho_noturno_nao"
												v-model="ss.permitido_trabalho_noturno"
												:value="false"
												class="mr-1" /><label for="permitido_trabalho_noturno_nao">Não</label>
										</td>
									</tr>
									<tr class="border border-gray-400">
										<td class="px-2 py-1">
											<span>Permitido trabalho em horário extraordinário (hora extra) ?</span>
										</td>
										<td class="px-2 py-1">
											<input
												type="radio"
												v-model="ss.permitido_hora_extra"
												:value="true"
												id="permitido_hora_extra_sim"
												class="mr-1" /><label for="permitido_hora_extra_sim">Sim</label>
										</td>
										<td class="px-2 py-1">
											<input
												type="radio"
												v-model="ss.permitido_hora_extra"
												:value="false"
												id="permitido_hora_extra_nao"
												class="mr-1" /><label for="permitido_hora_extra_nao">Não</label>
										</td>
									</tr>
									<tr class="border border-gray-400">
										<td class="px-2 py-1">
											<span>Permitido trabalho aos sábados, domingos e/ou feriados ? </span>
										</td>
										<td class="px-2 py-1">
											<input
												type="radio"
												v-model="ss.permitido_sabado_feriado"
												:value="true"
												id="permitido_sabado_feriado_sim"
												class="mr-1" /><label for="permitido_sabado_feriado_sim">Sim</label>
										</td>
										<td class="px-2 py-1">
											<input
												type="radio"
												v-model="ss.permitido_sabado_feriado"
												:value="false"
												id="permitido_sabado_feriado_nao"
												class="mr-1" /><label for="permitido_sabado_feriado_nao">Não</label>
										</td>
									</tr>
								</tbody>
							</table>
							<AppFormTextarea
								id="observacoes_condicao"
								label="Observações"
								placeholder="Observações opicionais"
								v-model="ss.observacoes_condicao"
								class="mt-1" />
						</div>
						<div class="bg-blue-100 p-2 border border-blue-200">
							<span class="text-md w-full"><strong>9 - REQUISITOS DE ACESSO A OBRA</strong></span>
              <AppFormTextarea
                id="exames_necessarios"
                label="Exames e requisitos do SMS necessários"
                placeholder="Exames e requisitos do SMS necessários"
                v-model="ss.exames_necessarios"
                class="mt-2"/>
							<AppFormInput
								class="mt-2"
								label="Prazo para integração(dias)"
								placeholder="Prazo para integração(dias)"
								obrigatorio
								:invalido="erro.includes('prazo_integracao')"
								type="text"
								id="outros"
								v-model="ss.prazo_integracao" />
						</div>
					</div>
					<div class="flex flex-col bg-blue-100 p-2 border border-blue-200">
						<span class="text-md w-full"><strong>10 - ANEXOS</strong></span>
						<span class="text-md w-full"
							><strong
								>Os seguintes documentos deverão ser considerados pelo fornecedor na elaboração da
								sua proposta</strong
							></span
						>
						<span class="w-full"
							>Relacionar desenhos, projetos, normas técnicas, procedimentos ou outros documentos
							complementares que possam contribuir com a definição do escopo dos serviços</span
						>
						<span class="w-full"
							>Os mesmos deveram ser informados aonde se encontram (caminho da pasta ou link) ou
							caso seja por e-mail informar quando e quem enviou.</span
						>
						<AppFormInput
							class="mt-2"
							label="Anexo I:"
							placeholder="Ex.: Histograma | E-mail enviado por henrique.mariano 25/01/2023 07:24"
							type="text"
							id="anexo_i"
							v-model="ss.anexo_i" />
						<AppFormInput
							class="mt-2"
							label="Anexo II:"
							placeholder="Ex.: Cronograma | Pasta na rede C:/Sistemas/GNA2/Administração/T.I/cronograma.pdf"
							type="text"
							id="anexo_ii"
							v-model="ss.anexo_ii" />
						<AppFormInput
							class="mt-2"
							label="Anexo III:"
							placeholder=""
							type="text"
							id="anexo_iii"
							v-model="ss.anexo_iii" />
						<AppFormInput
							class="mt-2"
							label="Anexo IV:"
							placeholder=""
							type="text"
							id="anexo_iv"
							v-model="ss.anexo_iv" />
						<AppFormInput
							class="mt-2"
							label="Anexo V:"
							placeholder=""
							type="text"
							id="anexo_v"
							v-model="ss.anexo_v" />
					</div>
					<div class="bg-blue-100 p-2 border border-blue-200">
						<AppFormTextarea
							id="observacoes_condicao"
							label="Observações"
							placeholder="Observações opicionais"
							v-model="ss.observacoes_geral"
							class="mt-1" />
					</div>
				</div>
			</div>
		</template>
		<template v-slot:rodape-btn-direito>
			<div class="flex items-center justify-end w-full" :class="{'!justify-between': ss_id !== null}">
				<AppConfirmacao
          v-if="ss_id !== null"
					texto="Tem certeza que deseja cancelar essa Solicitação ?"
					textoBtn="Cancelar SS"
					iconeBtn="delete-b.svg"
          @confirmado="cancelarSS()"
        />
				<div class="flex items-center">
					<div
						class="text-red-500 text-xl mr-3"
						v-if="erro.length > 0">
						<span>Campos obrigatórios necessários</span>
					</div>

					<BotaoSalvar @click="ss_id !== null ? editarSS() : adicionarSS()" />
				</div>
			</div>
		</template>
	</BaseDialog>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import BotaoSalvar from "~/components/Ui/Buttons/BotaoSalvar.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import BotaoIcone from "~/components/Ui/Buttons/BotaoIcone.vue"
	import AppConfirmacao from "~/components/Ui/AppConfirmacao.vue"

	export default {
		name: "DialogCriarSS",
		components: {
			BotaoIcone,
			BotaoPadrao,
			BaseDialog,
			BotaoSalvar,
			AppFormInput,
			AppFormSelect,
			AppFormCheckbox,
			AppFormRadio,
			AppFormTextarea,
			AppConfirmacao,
		},
		props: {
			ss_id: {
				type: [String, Number],
			},
		},
		data() {
			return {
				erro: [],
				opcoesNaturezaOperacao: [
					{ label: "Normal", valor: "normal" },
					{ label: "Urgente", valor: "urgente" },
					{ label: "Máquina Parada", valor: "maquina parada" },
				],
				opcoesTipoSolicitacao: [
					{ label: "Solicitação de Serviço PONTUAL (SPOT)", valor: "spot", disabled: true },
					{ label: "Solicitação de Serviço CONTRATO", valor: "contrato" },
					{ label: "Solicitação de Contratação de SUBEMPREITADA", valor: "subempreitada" },
				],
				opcoesLocalPrestacao: [
					{ label: "Na obra", valor: "obra" },
					{ label: "Fora da obra", valor: "fora_obra" },
				],
				selecionarTipoSolicitacao: false,

				fornecedores: [],
				ss: {
					numero_acompanhamento: null,
					data_emissao: this.$dayjs().format("YYYY-MM-DD"),
					data_necessidade: null,
					centro_custo_pep_id: null,
					ordem_servico: null,
					natureza_operacao: null,
					tipo_solicitacao: null,
					data_inicio: null,
					data_fim: null,
					escoposs_id: null,
					abrangencia_escopo: null,
					local_prestacao_obra: null,
					endereco_prestacao: null,
					jornada_trabalho: null,
					atestacao_empresa: null,
					curriculo_colaboradores: null,
					certificacaoes_licencas: null,
					outros: null,
					permitido_trabalho_noturno: true,
					permitido_hora_extra: true,
					permitido_sabado_feriado: true,
					observacoes_geral: null,
					observacoes_condicao: null,
					exames_necessarios: null,
					prazo: null,
					prazo_integracao: null,
					anexo_i: null,
					anexo_ii: null,
					anexo_iii: null,
					anexo_iv: null,
					anexo_v: null,
					observacoes_matriz: null,
					et: null,
					md: null,
					fd: null,
					rfp: null,
					eap: null,
					edital: null,
					cronograma: null,
					histograma: null,
				},
				matriz: {
					alojamento: "fornecedor",
					alimentacao_interna: "ag",
					alimentacao_externa: "fornecedor",
					transporte: "fornecedor",
					cesta_basica: "fornecedor",
					plano_odontologico: "fornecedor",
					epi: "fornecedor",
					epc: "ag",
					despesas_viagem: "fornecedor",
					banheiro_bebedouro: "ag",
					vestiario: "ag",
					energia: "ag",
					agua: "ag",
					exames_admissionais: "fornecedor",
					cracha_uniforme: "fornecedor",
					guindaste: "na",
					andaime: "na",
					equip_pequeno_porte: "na",
					escritorio: "fornecedor",
					mobiliario: "fornecedor",
					seguro: "fornecedor",
					garantias: "fornecedor",
					veiculos: "fornecedor",
					tributos: "fornecedor",
				},
				fornecedor: {
					nome: null,
					email: null,
					pessoa_contato: null,
					telefone: "",
				},
				centrosCusto: [],
				escopos: [],
				carregando: false,
			}
		},
		computed: {
			validarAddFornecedor() {
				return (
					Object.values(this.fornecedor).includes(null) ||
					Object.values(this.fornecedor).includes("") ||
					!(this.fornecedor.telefone.length == 14 || this.fornecedor.telefone.length == 13) ||
					this.fornecedores.length === 4
				)
			},
		},
		async fetch() {
			await this.buscarCentroCusto()
			await this.buscarEscopoSS()

			if (this.ss_id) {
				this.carregando = true
				await this.buscarSolicitacao()
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarCentroCusto() {
				let { centrosCusto } = await this.$axios.$get("/contratacao/centro_custo/buscarTodos")

				let options = centrosCusto.map((o) => {
					return { id: o.id, nome: `${o.numero_pep} - ${o.descricao}` }
				})
				this.centrosCusto = options
			},

			async buscarEscopoSS() {
				let resp = await this.$axios.$get("/suprimentos/ss/escopos_ss")

				if (!resp.falha) {
					let escoposs = resp.dados.escopos
					let options = escoposs.map((o) => {
						return {
							id: o.id,
							nome: `${o.codigo_tarifa_fiscal} - ${o.numero_servico} - ${o.denominacao}`,
						}
					})

					this.escopos = options
				}
			},

			async buscarSolicitacao() {
				this.carregando = true
				let id = this.ss_id

				let resp = await this.$axios.$get(`/suprimentos/ss/${id}`)

				if (!resp.falha) {
					this.ss = Object.assign({}, resp.dados.ss)

					this.fornecedores = this.ss.FornecedorSSes ? this.ss.FornecedorSSes : []
					this.matriz = this.ss.MatrizResponsabilidadeSS ? this.ss.MatrizResponsabilidadeSS : []
					this.carregando = false

					setTimeout(() => {
						this.ss.tipo_solicitacao = resp.dados.ss.tipo_solicitacao
					}, 300)
				}
			},

			adicionarFornecedor() {
				if (this.fornecedores.length < 4) {
					let fornecedor = this.fornecedor

					this.fornecedores.push(fornecedor)

					this.fornecedor = {
						nome: null,
						email: null,
						pessoa_contato: null,
						telefone: "",
					}
				}
			},
			removerFornecedor(index) {
				this.fornecedores.splice(index, 1)
			},

			validarFormulario() {
				this.erro = []

				let camposObrigatorio = [
					"numero_acompanhamento",
					"data_necessidade",
					"centro_custo_pep_id",
					"natureza_operacao",
					"tipo_solicitacao",
					"data_inicio",
					"data_fim",
					"escoposs_id",
					"abrangencia_escopo",
					"mobilizacao",
					"local_prestacao_obra",
					"jornada_trabalho",
					"prazo_integracao",
					"permitido_trabalho_noturno",
					"permitido_hora_extra",
					"permitido_sabado_feriado",
				]

				if (this.ss.local_prestacao_obra === "fora_obra")
					camposObrigatorio.push("endereco_prestacao")

				if (this.ss.data_inicio > this.ss.data_fim || this.ss.data_inicio === this.ss.data_fim)
					this.erro.push("data_fim")

				for (let campo of camposObrigatorio) {
					if (this.ss[`${campo}`] === null || this.ss[`${campo}`] === "") this.erro.push(campo)
				}
			},

			async adicionarSS() {
				this.validarFormulario()

				if (this.erro.length === 0) {
					let setor_id = this.$auth.user.setor_id
					let usuario_id = this.$auth.user.id

					let dados = {
						ss: { ...this.ss, setor_id },
						matriz: this.matriz,
						fornecedores: this.fornecedores,
						usuario_id: usuario_id,
					}
					let resp = await this.$axios.$post("/ss/cadastrar", { ...dados })

					if (!resp.falha) {
						this.$emit("adicionado")
					}
				}
			},
			async editarSS() {
				this.validarFormulario()

				if (this.erro.length === 0) {
					let usuario_id = this.$auth.user.id

					let dados = {
						ss: { ...this.ss },
						matriz: this.matriz,
						fornecedores: this.fornecedores,
						usuario_id: usuario_id,
					}
					let resp = await this.$axios.$put("/suprimentos/ss/editar", { ...dados })

					if (!resp.falha) {
						this.$emit("editado", this.ss.id)
					}
				}
			},
      async cancelarSS(){
        console.log("Cancelando SS")
        console.log(this.ss_id)

        let usuario_id = this.$auth.user.id
        let ss_id = this.ss_id
        console.log(usuario_id)

        let resp = await this.$axios.$post('/suprimentos/ss/cancelar_solicitacao', { ss_id , usuario_id })

        if(!resp.falha){
          this.$emit("cancelado", ss_id)
        }
      }
		},
		watch: {
			"ss.data_necessidade": function (valor) {
				let emissao = this.$dayjs(this.ss.data_emissao)

				let diferenca = this.$dayjs(valor).diff(emissao, "day")

				if (diferenca > 0 && diferenca <= 14) {
					this.ss.natureza_operacao = "maquina parada"
				} else if (diferenca > 14 && diferenca <= 28) {
					this.ss.natureza_operacao = "urgente"
				} else if (diferenca > 28) {
					this.ss.natureza_operacao = "normal"
				}

				this.ss.data_inicio = valor
			},

			"ss.data_inicio": function () {
				let inicio = this.$dayjs(this.ss.data_inicio)
				let fim = this.ss.data_fim != null ? this.$dayjs(this.ss.data_fim) : null

				if (inicio != null && fim != null) {
					let diferenca = this.$dayjs(fim).diff(inicio, "day")

					this.ss.prazo = diferenca

					if (diferenca > 0 && diferenca <= 10) {
						this.ss.tipo_solicitacao = "spot"
						this.selecionarTipoSolicitacao = false
					} else {
						this.ss.tipo_solicitacao = null
						this.selecionarTipoSolicitacao = true
					}
				}
			},

			"ss.data_fim": function () {
				let inicio = this.ss.data_inicio != null ? this.$dayjs(this.ss.data_inicio) : null
				let fim = this.$dayjs(this.ss.data_fim)

				if (inicio != null && fim != null) {
					let diferenca = this.$dayjs(fim).diff(inicio, "day")

					this.ss.prazo = diferenca

					if (diferenca > 0) {
						if (diferenca > 0 && diferenca <= 10) {
							this.ss.tipo_solicitacao = "spot"
							this.selecionarTipoSolicitacao = false
						} else {
							this.ss.tipo_solicitacao = null
							this.selecionarTipoSolicitacao = true
						}
					} else {
						this.ss.tipo_solicitacao = null
						this.selecionarTipoSolicitacao = false
					}
				}
			},
			"ss.numero_acompanhamento": function (valor) {
				this.ss.numero_acompanhamento = valor.toUpperCase()
			},
		},
	}
</script>

<style scoped></style>
