<template>
	<div
		class="flex fixed bg-cover bg-center bg-no-repeat w-full h-full bg-login justify-center items-center"
		v-on:keyup.enter="login">
		<div class="border border-gray-800 bg-gray-100/[.80] flex flex-col z-10 p-6 h-fit w-1/3">
			<div>
				<img
					src="@/assets/img/logogrande.png"
					alt=""
					class="mb-3" />
			</div>
			<div class="font-bold text-center text-6xl mb-2 text-[#00152D]">
				<h1>SIAG</h1>
			</div>
			<div class="space-y-3">
				<AppFormInput
					type="text"
					placeholder="Ex: henrique.mariano"
					label="Usuário"
					v-model="usuario.usuario"
					id="usuario" />
				<AppFormInput
					type="password"
					label="Senha"
					id="senha"
					v-model="usuario.senha" />
				<div
					class="bg-red-200 text-red-700 p-1 border border-red-800"
					v-if="erro !== null">
					<span v-if="erro === 'server_error'"
						>Erro no servidor, entre em contato com o suporte!</span
					>
					<span v-if="erro === 'invalid_data'">Usuário ou senha incorreto!</span>
					<span v-if="erro === 'invalid_user'">Usuário não encontrado, entre em contato com o suporte!</span>
				</div>
				<div class="text-sm bg-yellow-100 px-2 border border-yellow-300">
					<span>
						<strong>Observação: </strong>O usuário e a senha são os mesmos de acesso ao computador.
					</span>
				</div>
				<div class="w-full">
					<button
						ref="inputUsuario"
						class="p-1 bg-primaria-700 text-white w-full rounded-sm"
						v-on:keyup.enter="login"
						@click.stop.prevent="login">
						ENTRAR
					</button>
				</div>
			</div>
		</div>
		<div class="mt-6 text-center text-lg absolute bottom-0 w-full bg-[#00152D] text-white py-1">
			<span>Desenvolvido por: <strong>Henrique Mariano da Silva</strong></span>
		</div>
	</div>
</template>

<script>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	export default {
		name: "Login",
		layout: "auth",
		components: {
			AppFormInput,
		},
		data() {
			return {
				usuario: {
					usuario: null,
					senha: null,
				},
				erro: null,
			}
		},
		mounted() {
			this.focusInput()
			// this.$refs.inputUsuario.$el.focus();
			// this.$nextTick(() => {
			// This callback will only be called after the
			// DOM has been updated
			// this.$refs.inputUsuario.focus();
			// });
		},
		methods: {
			focusInput() {
				this.$refs.inputUsuario.focus()
			},
			async login() {
				let { usuario, senha } = this.usuario
				this.erro = null

				try {
					let resp = await this.$auth.loginWith("local", {
						data: {
							usuario,
							senha,
						},
					})

					let usuarioBuscado = resp.data.usuario
					if (!usuarioBuscado.setor_id) {
						await this.$router.push("/erro/SemSetor")
					} else {
						await this.$router.push("/")
					}
				} catch (e) {
					if (!e.response) {
						this.erro = "server_error"
					} else {
            this.erro = e.response.data.dados.type
					}
				}
			},
		},
	}
</script>

<style scoped></style>
