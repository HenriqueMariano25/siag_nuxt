<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			titulo="Imprimindo caderno de DDS"
			:carregando="carregando"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div
					class="print:w-[1000px] overflow-y-auto print:overflow-y-visible h-[550px] gap-2 print:gap-0 print:h-auto flex flex-col">
					<div class="flex flex-col pagina-1 border border-black p-1 print:h-[1453px]">
						<div class="flex">
							<img
								src="@/assets/img/logoagcnovo.png"
								alt="logo"
								class="w-[200px]" />
						</div>
						<div
							class="text-center"
							style="font-size: 64px">
							<span><strong>LISTA DE PRESENÇA</strong></span>
						</div>
						<div
							class="text-center"
							style="font-size: 30px">
							<span>DDS - DÍALOGO DIÁRIO DE SEGURANÇA</span>
						</div>
						<div
							class="text-center"
							style="font-size: 64px">
							<span
								><strong>{{ $dayjs(mes).format("MMMM/YYYY") }}</strong></span
							>
						</div>
						<div
							class=""
							style="font-size: 28px">
							<span><strong>RESPONSÁVEL: </strong>{{ responsavel.nome }}</span>
						</div>
						<div
							style="font-size: 24px"
							class="w-full flex justify-end print:mt-[200px]">
							<div class="w-5/12 flex">
								<span>
									Favor entregar o caderno de DDS ao setor de <strong>TREINAMENTO</strong> a cada
									final do mês. Só será entregue o do mês posterior mediante a entrega do anterior.
								</span>
							</div>
						</div>
						<div
							class="print:mt-[60px] px-2  print:h-[500px]"
              v-if="recado"
							style="font-size: 26px">
							<span>{{ recado.substr(0, 500)  }}{{ recado.length > 500 ? "..." : ""
                }}</span>
<!--							<span>{{ recado }}</span>-->
						</div>
						<div
							class="flex border border-black items-center p-1 print:mt-[180px]"
							style="font-size: 20px">
							<div class="flex">
								<img
									src="@/assets/img/img_lideranca.png"
									alt=""
									class="w-[200px]" />
							</div>
							<div class="grow justify-center flex">
								<div class="flex flex-col text-center w-[800px] print:w-[650px]">
									<span style="font-size: 22px"><strong>Dedique-se a Gente</strong></span>
									<span style="font-size: 16px"> "Gastar” tempo com gente; </span>
									<span style="font-size: 16px">Formar um time campeão (equipe vencedora);</span>
									<span style="font-size: 16px">Atrair, recrutar e desenvolver gente boa;</span>
									<span style="font-size: 16px">
										Seremos julgados pela qualidade dos nossos times;
									</span>
									<span style="font-size: 16px">
										Cuidar de gente é responsabilidade intransferível;
									</span>
									<span style="font-size: 16px">
										Desenvolver já um sucessor melhor que nós mesmos;
									</span>
									<span style="font-size: 16px">
										Sempre buscar e compartilhar informações com o time.;
									</span>
								</div>
							</div>
						</div>
					</div>
					<div
						class="flex flex-col pagina-2 border border-black print:h-[1469px] break-before-page">
						<div class="border-b border-black flex items-center text-center">
							<div class="p-2 border-r border-black flex">
								<img
									src="@/assets/img/logoagcnovo.png"
									alt="logo"
									class="w-[200px]" />
							</div>
							<div
								class="justify-center flex grow font-bold"
								style="font-size: 24px">
								<h3>DDS - DIÁLOGO DIÁRIO DE SEGURANÇA</h3>
							</div>
						</div>
						<div class="px-2 py-1 border-b border-black">
							<span>ÁREA/ENCARREGADO:</span>
						</div>
						<div>
							<table class="w-full tabela">
								<tr class="">
									<th style="">Data</th>
									<th colspan="2">
										<div>
											<div class="border-b border-black"><span>N° do tema</span></div>
											<div>
												<span>Previsto</span>
												<span>Realizado</span>
											</div>
										</div>
									</th>
									<th>(Escreva abaixo o TEMA do DDS que foi divulgado no dia)</th>
								</tr>
								<tr
									v-for="x of 31"
									:key="x">
									<td
										class="text-center py-1 linha-tabela-dia"
										style="font-size: 20px">
										{{ ("00" + x).slice(-2) }}/{{ $dayjs(mes).format("MM") }}/{{
											$dayjs().format("YYYY")
										}}
									</td>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							</table>
						</div>
						<div class="text-center flex flex-col mt-[65px] justify-center w-full">
							<div
								class="justify-center mt-2 mb-2 border-t border-black flex w-[400px] text-center self-center text-xl">
								<span>Assinatura do Responsável da Equipe</span>
							</div>
						</div>
					</div>
					<div v-for="rep in parseInt(repeticaoValidada)">
						<div
							class="flex flex-col pagina-3 border border-black print:h-[1468px] break-before-page">
							<div class="border-b border-black flex items-center text-center">
								<div class="p-2 border-r border-black flex">
									<img
										src="@/assets/img/logoagcnovo.png"
										alt="logo"
										class="w-[200px]" />
								</div>
								<div
									class="justify-center flex flex-col grow font-bold"
									style="font-size: 18px">
									<h3>DDS - DIÁLOGO DIÁRIO DE SEGURANÇA</h3>
									<h3>DATA: ___/___/___</h3>
								</div>
							</div>
							<div class="flex px-2 py-1 border-b border-black justify-between">
								<span><strong>Cliente: </strong>GNA</span>
								<span><strong>Empreendimento: </strong>UTE GNA II</span>
							</div>
							<div class="flex items-center border-b border-black">
								<div class="p-1">Emociograma</div>
								<div class="border-l border-black grow divide-y divide-black">
									<div class="flex gap-3 items-center py-2 border-black px-2">
										<img
											src="@/assets/icons/emoticon-smile-b.svg"
											alt=""
											class="w-7 h-7" />
										<span><strong>Bom</strong></span>
										<span>O empregado está apto para praticar suas atividades diárias.</span>
									</div>
									<div class="flex gap-3 items-center py-2 border-b border-black px-2">
										<img
											src="@/assets/icons/emoticon-sad-b.svg"
											alt=""
											class="w-7 h-7" />
										<span><strong>Ruim</strong></span>
										<span>
											O supervisor/encarregado deverá conversar com o empregado, em caso extremo não
											executar a atividade, remanejar para uma atividade de menor risco, ou
											encaminhar ao serviço médico.
										</span>
									</div>
								</div>
							</div>
							<div class="text-center border-b border-black">
								<span style="font-size: 20px"
									><strong
										>Reconheço ter participado do Diálogo Diário de Segurança - DDS</strong
									></span
								>
							</div>
							<div>
								<table class="w-full tabela">
									<tr class="">
										<th style="">Quant.</th>
										<th>Nome</th>
										<th>Função</th>
										<th style="width: 100px">Matrícula</th>
										<th colspan="2">Como estou</th>
										<th style="width: 200px">Assinatura</th>
									</tr>
									<tr
										v-for="(funcionario, index) in funcionarios.slice(0, 30)"
										:key="funcionario.chapa"
										style="height: 10px; font-size: 12px">
										<td
											class="text-center"
											style="width: 60px">
											<strong>{{ index + 1 }}</strong>
										</td>
										<td
											style="width: 320px"
											class="pl-2">
											{{ funcionario.nome }}
										</td>
										<td
											class="text-center espacamento-borda"
											style="width: 180px">
											{{ funcionario.cargo }}
										</td>
										<td class="text-center">
											{{ funcionario.chapa }}
										</td>
										<td
											class=""
											style="width: 40px">
											<img
												src="@/assets/icons/emoticon-smile-b.svg"
												alt=""
												class="w-9 h-9" />
										</td>
										<td
											class=""
											style="width: 40px">
											<img
												src="@/assets/icons/emoticon-sad-b.svg"
												alt=""
												class="w-9 h-9" />
										</td>
										<td></td>
									</tr>
									<tr
										v-for="index in restanteCampos"
										:key="index"
										class="font-normal">
										<td
											class="text-center"
											style="width: 60px">
											<strong>{{ index + funcionarios.length }}</strong>
										</td>
										<td
											style="width: 340px"
											class="pl-2"></td>
										<td
											class="text-center espacamento-borda"
											style="width: 180px"></td>
										<td class="text-center"></td>
										<td
											class=""
											style="width: 40px">
											<img
												src="@/assets/icons/emoticon-smile-b.svg"
												alt=""
												class="w-9 h-9" />
										</td>
										<td
											class=""
											style="width: 40px">
											<img
												src="@/assets/icons/emoticon-sad-b.svg"
												alt=""
												class="w-9 h-9" />
										</td>
										<td></td>
									</tr>
								</table>
							</div>
						</div>
						<div
							class="flex flex-col pagina-4 border border-black print:h-[1461px] break-before-page">
							<div class="border-b border-black flex items-center text-center">
								<div class="p-2 border-r border-black flex">
									<img
										src="@/assets/img/logoagcnovo.png"
										alt="logo"
										class="w-[200px]" />
								</div>
								<div
									class="justify-center flex flex-col grow font-bold border-r border-black"
									style="font-size: 18px">
									<h3>DDS - DIÁLOGO DIÁRIO DE SEGURANÇA</h3>
									<h3>DATA: ___/___/___</h3>
								</div>
								<div class="px-2 flex">Revisão: 0</div>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-6">
									<span><strong>Cliente:</strong></span
									><span> GNA</span>
								</div>
								<div class="col-span-6 text-end">
									<span><strong>Empreendimento:</strong></span
									><span>UTE GNA II</span>
								</div>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-8">
									<span><strong>Tarefa / Atividade a ser executada:</strong> {{ tarefa }}</span>
								</div>
								<div class="col-span-4 flex">
									<div class="mr-[90px]">
										<span><strong>AR N°:</strong></span>
									</div>
									<div>
										<span><strong>REVISÃO:</strong></span>
									</div>
								</div>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-10">
									<span><strong>Local da atividade:</strong></span>
								</div>
								<div class="col-span-2 pl-1">
									<span><strong>Carga horária:</strong></span
									><span> 0,15 m</span>
								</div>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-8">
									<span><strong>Disciplina:</strong></span>
								</div>
								<div class="col-span-4 pl-1">
									<span><strong>Engenheiro:</strong></span>
								</div>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-8">
									<span><strong>Responsável pela equipe:</strong></span>
									<span>{{ responsavel.nome }}</span>
								</div>
								<div class="col-span-4 pl-1">
									<span><strong>Supervisor Direto:</strong></span>
								</div>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-10">
									<span><strong>Nome da Empresa Subcontrada (Quando Necessário):</strong></span>
								</div>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-10">
									<span><strong>ASSUNTOS ABORDADOS:</strong></span>
								</div>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-10">
									<span><strong>Assuntos diversos:</strong></span>
								</div>
							</div>
							<div
								class="flex flex-col text-center border-b border-black"
								style="font-size: 12px">
								<span
									>ANTES DE INICIAR A(S) ATIVIDADE(S) VERIFIQUE AS CONDIÇÕES DO AMBIENTE DE
									TRABALHO.</span
								>
								<span>SOMENTE INICIE AS ATIVIDADES APÓS O TRATAMENTO DAS NÃO CONFORMIDADES!</span>
								<span>"SE NÃO FOR SEGURO NÃO FAÇA E NÃO DEIXE QUE OS OUTROS FAÇAM"</span>
							</div>
							<div>
								<table
									class="tabela"
									style="font-size: 13.5px">
									<tr style="font-size: 14px">
										<th colspan="2">LDT - LIBERAÇÃO DIÁRIA DE TRABALHO</th>
										<th>C</th>
										<th>NC</th>
										<th>NA</th>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											1
										</td>
										<td class="espacamento-borda">
											O assunto abordado no DDS está relacionado com o planejamento da atividade do
											dia ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											2
										</td>
										<td class="espacamento-borda">Todos os colaboradores assinaram o DDS ?</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											3
										</td>
										<td class="espacamento-borda">
											A equipe esté ciente do planejamento das atividade do dia e foi orientada pelo
											encarregado em como realizá-las?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											4
										</td>
										<td class="espacamento-borda">
											A AR está disponível na frente de trabalho contemplando todas as etapas da
											atividade ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											5
										</td>
										<td class="espacamento-borda">
											A atividade será realizada conforme previsto na AR ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											6
										</td>
										<td class="espacamento-borda">
											<strong>
												A equipe de trabalho recebeu treinamento e assinou a AR da atividade a ser
												executada ?
											</strong>
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											7
										</td>
										<td class="espacamento-borda">
											O controle dos riscos previsto na AR estão disponíveis na área de trabalho ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											8
										</td>
										<td class="espacamento-borda">
											O local da realização da atividade foir inspecinado encontram-se seguros e
											adequados ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											9
										</td>
										<td class="espacamento-borda">
											Os acessos (caminho seguro, escadas, rampas e passarelas) a área de vivência,
											vala, andaimes, estruturas de concreto, estrutura metalica etc.) encontram-se
											desobstruídos e em condições adequadas de uso ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											10
										</td>
										<td class="espacamento-borda">
											Os profissionais da equipe estão portando o crachá de autorização para
											trabalho ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											11
										</td>
										<td class="espacamento-borda">
											As pessoas que necessitam realizar o trabalho em altura receberam treinamento
											específico na NR35, e estão portando o selo de aferição de Pressão Arterial
											dentro do prazo de validade ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											12
										</td>
										<td class="espacamento-borda">
											Existe placa verde de identificação de liberação dos andaimes de acesso ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											13
										</td>
										<td class="espacamento-borda">
											Os recursos necessários para a realização da atividade foram previstos e estão
											disponíveis? (Ex: máquinas, equipamentos, veículos e ferramentas);
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											14
										</td>
										<td class="espacamento-borda">
											As máquinas, equipamentos, veículos leves, onibus e ferramentas manuais foram
											inspecionados e identificados com a etiqueta de inspeção na cor do trimestre ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											15
										</td>
										<td class="espacamento-borda">
											Há necessidade de proteções coletivas para a realização da atividade? (Ex:
											biombos, lonas anti-chamas ou anteparos de proteção para evitar a projeção
											partículas)
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											16
										</td>
										<td class="espacamento-borda">
											As extensões e cabos energizados estão sinalizados, protegidos e fora de
											contato com o chão e estruturar metálicas?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											17
										</td>
										<td class="espacamento-borda">
											As escavações existentes na(s) frente(s) de serviço(s) estão sinalizadas e
											protegidas com guarda corpo rígido? Afastado com metade da profundidade das
											escavação ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											18
										</td>
										<td class="espacamento-borda">
											O material escavado retirado da escavação, está afastado da crista do talude
											com no minimo a distancia da metade da profundidade das escavação
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											19
										</td>
										<td class="espacamento-borda">
											Os EPI's de todos os colaboradores estão em boas condições de uso e são
											apropriados para a realização da atividade ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											20
										</td>
										<td class="espacamento-borda">
											Foi verificada a necessidade de isolar e sinalizar o local de trabalho?
											(Atividade em altura, Movimentação de cargas, Escavação mecanizada e Testes de
											Comissionamento)
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											21
										</td>
										<td class="espacamento-borda">
											A equipe foi orientada a preencher o Check-List dos equipamentos antes de
											iniciar as atividades?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											22
										</td>
										<td class="espacamento-borda">
											Foi verificada a necessidade de utilizar agente extintor para a atividade?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											23
										</td>
										<td class="espacamento-borda">
											<strong>
												O encarregado/responsável da frente de serviço possui a FISPQ dos produtos
												químicos utilizados na sua atividade?
											</strong>
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											24
										</td>
										<td class="espacamento-borda">
											<strong>
												O encarregadi/responsável avaliou a FISPQ antes de iniciar a atividade?
											</strong>
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											25
										</td>
										<td class="espacamento-borda">
											<strong>
												O encarregado/responsável orientou sua equipe quanto as informações contidas
												na FISPQ?
											</strong>
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											26
										</td>
										<td class="espacamento-borda">
											<strong>
												A equipe sabe a localização do kit de mitigação ambiental mais próximo da
												atividade?
											</strong>
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											27
										</td>
										<td class="espacamento-borda">
											<strong> A frente de serviço está limpa e organizada? </strong>
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											28
										</td>
										<td class="espacamento-borda">
											Existe PTE(Permissão de Trabalho Especial) para as atividades de: trabalho em
											altura, movimentação de carga, escavação, serviço em eletricidade, trabalho a
											quente, teste hidrostástico?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											29
										</td>
										<td class="espacamento-borda">
											Foi verificado que os vergalhões/Agulhas estão protegidos com os "capacetes"
											plásticos e os pregos retirados e/ou rebatidos das madeiras?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											30
										</td>
										<td class="espacamento-borda">
											A área a ser executada atividade possui iluminação adequada em todos os seus
											pontos, inclusive nas áreas adjacentes (caminho seguro, banheiro, etc);
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											31
										</td>
										<td class="espacamento-borda">
											Todos os funcionários estão como o emociograma com status BOM? Caso RUIM,
											descrever a tratativa nas anotações gerais.
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
								</table>
							</div>
							<!--							<div>-->
							<!--								<div-->
							<!--									class="flex flex-col text-center border-b border-black"-->
							<!--									style="font-size: 13px">-->
							<!--									<span><strong>ENCERRAMENTO DA(S) ATIVIDADE(S)</strong></span>-->
							<!--								</div>-->
							<!--							</div>-->
							<div>
								<table
									class="tabela"
									style="font-size: 13.5px">
									<tr style="font-size: 14px">
										<th colspan="2">ENCERRAMENTO DA(S) ATIVIDADE(S)</th>
										<th>SIM</th>
										<th>NÃO</th>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											1
										</td>
										<td class="espacamento-borda">
											Os resíduos foram dispostos nos coletores corretos ?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											2
										</td>
										<td class="espacamento-borda">
											As ferramentas foram desligadas e guardadas nos malões e/ou ferramentaria?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
									<tr
										style="height: 20px"
										class="font-media-tabela">
										<td
											style="width: 35px"
											class="text-center">
											3
										</td>
										<td class="espacamento-borda">
											A área de trabalho está organizada para o início das atividades no próximo dia
											?
										</td>
										<td style="width: 45px"></td>
										<td style="width: 45px"></td>
									</tr>
								</table>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-10">
									<span><strong>Detalhar oportunidade de melhoria(s):</strong></span>
								</div>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-10">
									<span><strong>ANOTAÇÕES GERAIS:</strong></span>
								</div>
							</div>
							<div class="grid grid-cols-12 divide-x divide-black px-1 border-b border-black">
								<div class="col-span-10">
									<span>Responsáveis pela equipe:</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div>
					<BotaoPadrao
						texto="IMPRIMIR"
						@click="imprimir()">
						<img
							src="@/assets/icons/printer-b.svg"
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
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		name: "DialogCadernoDDS",
		components: { BotaoPadrao, BaseDialog },
		props: {
			responsavel: { type: Object },
			mes: { type: String },
			funcionarios: { type: [String, Array] },
			repeticao: { type: [Number, String] },
			tarefa: { type: [String] },
			recado: { type: [String] },
		},
		data() {
			return {
				carregando: false,
			}
		},
		computed: {
			restanteCampos() {
				return 30 - this.funcionarios.slice(0, 30).length
			},

			restanteCamposSegunda() {
				return 30 - this.funcionarios.slice(30).length
			},

			repeticaoValidada() {
				if (this.repeticao) {
					if (this.repeticao <= 1) {
						return 1
					} else {
						return this.repeticao
					}
				}

				return 1
			},
		},
		created() {
			this.imprimir()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			imprimir() {
				setTimeout(() => {
					window.print()
				}, 800)
			},
		},
	}
</script>

<style scoped>
	.tabela th {
		border-left: 1px solid;
		border-right: 1px solid;
		border-bottom: 1px solid;
	}

	.tabela td {
		border: 1px solid;
	}

	.tabela {
		border-collapse: collapse;
		width: 100%;
	}
	.assinatura-responsavel {
		font-size: 20px;
		border-top: 1px solid black;
		//padding-left: 100px;
		//padding-right: 100px;
	}
</style>
