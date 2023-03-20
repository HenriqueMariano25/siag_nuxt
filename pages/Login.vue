<template>
	<div
		class="flex fixed bg-cover bg-center bg-no-repeat w-full h-full bg-login justify-center items-center">
		<div class="border border-gray-800 bg-gray-100/[.80] flex flex-col z-10 p-6 h-fit w-1/3">
			<div class="font-bold text-center text-5xl mb-2">
				<h1>SIAG</h1>
			</div>
			<div class="space-y-3">
				<AppFormInput
					type="text"
					placeholder="henrique.mariano"
					label="Usuário"
					v-model="usuario.usuario"
          id="usuario"
        />
				<AppFormInput
					type="password"
					label="Senha"
          id="senha"
					v-model="usuario.senha" />
        <div class="bg-red-200 text-red-700 p-1 border border-red-800" v-if="erro !== null">
          <span v-if="erro === 'server_error'">Erro no servidor, entre em contato com o suporte!</span>
          <span v-if="erro === 'invalid_data'">Usuário ou senha incorreto!</span>
        </div>
				<div class="w-full">
					<button
						class="p-1 bg-primaria-700 text-white w-full rounded-sm"
						@click.stop.prevent="login">
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
        erro: null
			}
		},
		methods: {
			async login() {
        let {usuario, senha} = this.usuario
        this.erro = null

        console.log("Aqui")

        try {
          let resp = await this.$auth.loginWith('local', {
            data: {
              usuario,
              senha
            },
          })

          console.log(resp)

          await this.$router.push("/")
        } catch (e) {
          if (!e.response) {
            this.erro = "server_error"
          } else {
            if (e.response && e.response.status === 401)
              this.erro = "invalid_data"
          }
        }

        // try {
        //   let resp = await this.$auth.loginWith('local', {
        //     data: {
        //       usuario,
        //       senha
        //     },
        //   })
        //
        //
        //   // let resp = await this.$axios.$post("/usuario/login/", {usuario, senha})
        //   //   .catch(error =>  error.response.data )
        //   //
        //   // if(!resp.falha){
        //   //
        //   //   let token = resp.dados["Authorization"]
        //   //   let usuario = resp.dados.usuario
        //   //
        //   //   let permissoes = usuario.Permissaos.map((a) => a.descricao)
        //   //   usuario.permissoes = permissoes
        //   //
        //   //   this.$store.commit("usuario/DEFINIR_USUARIO_LOGADO", {
        //   //     token: token,
        //   //     usuario,
        //   //   })
        //   //
        //   //   this.$router.push({
        //   //     path: '/'
        //   //   })
        //   // }else{
        //   //   if(resp.dados.type === "invalid_data"){
        //   //     this.erro = "invalid_data"
        //   //   }
        //   // }
        // }catch (e) {
        //   this.erro = "server_error"
        // }
			},
		},
	}
</script>

<style scoped></style>
