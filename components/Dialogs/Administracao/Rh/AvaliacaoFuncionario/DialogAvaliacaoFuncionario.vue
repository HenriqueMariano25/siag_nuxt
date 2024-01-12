<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			titulo="AVALIAR O FUNCIONÁRIO"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 flex flex-col gap-2">
					<div class="grid grid-cols-12 p-1 gap-2 border border-blue-300 bg-blue-100">
						<span class="w-full bg-blue-300 px-2 col-span-12">Funcionário</span>
						<AppFormSelectCompleto
							id="funcionario_id"
							label="Funcionário"
							class="col-span-6" />
						<AppFormInput
							type="text"
							id="cargo"
							label="Matricula"
							placeholder="Ex: 1950000001"
							class="col-span-3" />
						<AppFormInput
							type="text"
							id="cargo"
							label="Cargo"
							placeholder="Ex: ENCARREGADO DE ALMOXARIFADO"
							class="col-span-3" />
						<AppFormInput
							type="text"
							id="formacao"
							label="Formacação"
							placeholder="Ex: Superior"
							class="col-span-3" />
						<AppFormInput
							type="text"
							id="ano_experiencia"
							label="Ano de Experiencia"
							placeholder="Ex: 3 anos"
							class="col-span-3" />
					</div>
					<div class="grid grid-cols-12 p-1 gap-2 border border-blue-300 bg-blue-100">
						<span class="w-full bg-blue-300 px-2 col-span-12">Descrição do Cargo</span>
						<span class="col-span-12">Preencha as colunas NOTA com os valores:</span>
						<div class="col-span-6">
							<table class="w-full table">
								<thead class="bg-blue-900 text-white">
									<tr>
										<th class="border border-gray-700 whitespace-nowrap px-1 w-full">
											Conhecimento Técnico
										</th>
										<th class="border border-gray-700 whitespace-nowrap px-1">Nivel</th>
										<th class="border border-gray-700 whitespace-nowrap px-1">Nota</th>
									</tr>
								</thead>
								<tbody class="bg-white">
									<tr>
										<td
											class="border border-gray-700 text-center bg-gray-200 text-sm"
											colspan="3">
											<span>0-Não avaliado; 1-Não Atende; 2-Atende; 3-Supera</span>
										</td>
									</tr>
									<tr>
										<td class="border border-gray-700 px-1">Pacote Office</td>
										<td class="border border-gray-700 px-1">Básico</td>
										<td class="border border-gray-700 px-1">
											<input
												id="teste"
												type="text"
												class="flex !h-[20px] !w-[40px] grow border border-gray-500 text-center"
												v-maska
												data-maska="#" />
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="col-span-6">
							<table class="w-full table">
								<thead class="bg-blue-900 text-white">
									<tr>
										<th class="border border-gray-700 whitespace-nowrap px-1 w-full">Idiomas</th>
										<th class="border border-gray-700 whitespace-nowrap px-1">Nivel</th>
										<th class="border border-gray-700 whitespace-nowrap px-1">Nota</th>
									</tr>
								</thead>
								<tbody class="bg-white">
									<tr>
										<td
											class="border border-gray-700 text-center bg-gray-200 text-sm"
											colspan="3">
											<span>0-Não avaliado; 1-Não Atende; 2-Atende; 3-Supera</span>
										</td>
									</tr>
									<tr>
										<td class="border border-gray-700 px-1">Inglês</td>
										<td class="border border-gray-700 px-1">Intermediário</td>
										<td class="border border-gray-700 px-1">
											<input
												id="teste"
												type="text"
												class="flex !h-[20px] !w-[40px] grow border border-gray-500 text-center"
												v-maska
												data-maska="#" />
										</td>
									</tr>
									<tr>
										<td class="border border-gray-700 px-1">Espanhol</td>
										<td class="border border-gray-700 px-1">Intermediário</td>
										<td class="border border-gray-700 px-1">
											<input
												id="teste"
												type="text"
												class="flex !h-[20px] !w-[40px] grow border border-gray-500 text-center"
												v-maska
												data-maska="#" />
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="col-span-6">
							<table class="w-full table">
								<thead class="bg-blue-900 text-white">
									<tr>
										<th class="border border-gray-700 whitespace-nowrap px-1 w-full">
											Certificações
										</th>
										<th class="border border-gray-700 whitespace-nowrap px-1">Nivel</th>
										<th class="border border-gray-700 whitespace-nowrap px-1">Nota</th>
									</tr>
								</thead>
								<tbody class="bg-white">
									<tr>
										<td
											class="border border-gray-700 text-center bg-gray-200 text-sm"
											colspan="3">
											<span>0-Não avaliado; 1-Não Atende; 2-Atende; 3-Supera</span>
										</td>
									</tr>
									<tr>
										<td class="border border-gray-700 px-1">Gestão de Material</td>
										<td class="border border-gray-700 px-1">Básico</td>
										<td class="border border-gray-700 px-1">
											<input
												id="teste"
												type="text"
												class="flex !h-[20px] !w-[40px] grow border border-gray-500 text-center"
												v-maska
												data-maska="#" />
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<BotaoPadrao texto="salvar">
					<img
						src="@/assets/icons/save-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	export default {
		name: "DialogAvaliacaoFuncionario",
		components: {
			BaseDialog,
			AppFormInput,
			AppFormSelectCompleto,
		},
		data() {
			return {}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
		},
	}
</script>

<style scoped></style>
<script setup>
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
</script>
