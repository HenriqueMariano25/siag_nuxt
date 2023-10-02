<template>
	<div
		class="flex fixed bg-cover bg-center bg-no-repeat w-full h-full bg-gray-500 justify-center items-center">
		<div class="border border-gray-800 bg-gray-100/[.80] flex flex-col z-10 p-6 h-fit w-1/3">
			<div class="font-bold text-center text-5xl mb-2">
				<h1>SIAG - ADMIN</h1>
			</div>
			<div class="space-y-3">
				<AppFormInput
					type="text"
					placeholder="henrique.mariano"
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
					<span v-if="erro === 'server_error'">
						Erro no servidor, entre em contato com o suporte!
					</span>
					<span v-if="erro === 'invalid_data'">Usuário ou senha incorreto!</span>
					<span v-if="erro === 'invalid_access'">Não tem permissão para acessar essa página!</span>
				</div>
				<div class="w-full">
					<button
						class="p-1 bg-primaria-700 text-white w-full rounded-sm"
						@click="login">
						ENTRAR
					</button>
				</div>
			</div>
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
		methods: {
			async login() {
				let { usuario, senha } = this.usuario

				try {
					let resp = await this.$auth.loginWith("localAdmin", {
						data: {
							usuario,
							senha,
						},
					})

					this.$router.push("/admin")
				} catch (e) {
					if (!e.response) {
						this.erro = "server_error"
					} else {
						if (e.response && e.response.status === 401) this.erro = "invalid_data"

						if (e.response.data.type === "invalid_access") this.erro = "invalid_access"
					}
				}

				// await this.$axios
				//   .post("/usuario/admin/login/", {usuario, senha})
				//   .then((resp) => {
				//     console.log(resp)
				//
				//     let token = resp.data["Authorization"];
				//     let usuario = resp.data.usuario;
				//
				//     // let permissoes = usuario.Permissaos.map((a) => a.descricao)
				//     // usuario.permissoes = permissoes
				//
				//     this.$store.commit("usuario/DEFINIR_USUARIO_LOGADO", {
				//       token: token,
				//       usuario,
				//     })
				//
				//     this.$router.push({
				//       path: '/admin'
				//     })
				//   })
			},
		},
	}
</script>

<style scoped></style>
