<template>
	<div class="w-full">
		<CabecalhoPagina titulo="Perfil" />
		<div class="!mt-11 p-1.5 bg-white gap-4 flex flex-col">
			<div class="flex flex-col text-xl">
				<div class="flex">
					<span class="text-2xl px-2 border-b-2 border-gray-600 flex ">Dados do Usuário</span>
				</div>
				<span><strong>Nome: </strong>{{ $auth.user.nome }}</span>
				<span><strong>Usuário: </strong>{{ $auth.user.usuario }}</span>
				<span><strong>E-mail: </strong>{{ $auth.user.email }}</span>
				<span>
					<strong>Data de criação: </strong>
					{{ $dayjs($auth.user.createdAt).format("DD/MM/YYYY") }}
				</span>
				<span><strong>Setor: </strong>{{ $auth.user.Setor ? $auth.user.Setor.nome : null }}</span>
				<div class="flex mt-2">
					<BotaoPadrao
						texto="Alterar Senha"
						cor="bg-primaria-200 hover:!bg-primaria-300"
						class="text-white"
						@clique="mostrarDialogAlterarSenha = true">
						<img
							src="@/assets/icons/lock-open-w.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</div>
			<div class="flex flex-col">
				<div class="flex">
					<span class="text-2xl px-2 border-b-2 border-gray-600 flex">Permissões</span>
				</div>
				<div class="max-h-[372px] overflow-y-auto border border-gray-400 mt-1 flex flex-col p-1">
					<div
						v-for="permissao of $auth.user.permissoes"
						class="px-1 even:!bg-gray-300 odd:!bg-white gap-2 border border-gray-400 text-lg rounded flex flex-col mt-1 first:mt-0 shadow">
						<span>{{ permissao }}</span>
					</div>
				</div>
			</div>
		</div>
		<DialogAlterarSenha
			v-if="mostrarDialogAlterarSenha"
      @senhaAlterada="senhaAlterada()"
			@cancelar="mostrarDialogAlterarSenha = false" />
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
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogAlterarSenha from "~/components/Dialogs/Usuario/DialogAlterarSenha.vue"
  import AppAlerta from "~/components/Ui/AppAlerta.vue";

	export default {
		components: { AppAlerta, BotaoPadrao, CabecalhoPagina, DialogAlterarSenha },
		data() {
			return {
				mostrarDialogAlterarSenha: false,
        mostrarAlerta: false,
        textoAlerta: "",
			}
		},
    methods: {
      senhaAlterada() {
        this.textoAlerta = "Senha alterada com sucesso!"
        this.mostrarAlerta = true
        this.mostrarDialogAlterarSenha = false
      }
    }
	}
</script>

<style scoped></style>
