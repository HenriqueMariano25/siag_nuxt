<template>
	<div class="w-full">
    <div class="w-full bg-white flex flex-col gap-2 ">
      <TabelaPadrao
        :cabecalho="cabecalho"
        :dados="dados"
        :itensPorPagina="itensPorPagina"
        @itensPorPagina="itensPorPagina = $event"
        :filtros="filtros"
        @filtros="filtros = $event"
        :pagina="pagina"
        id="usuarios"
        @pagina="pagina = $event"
        altura="calc(100vh - 135px)"
        :totalItens="totalItens"
        @atualizar="buscarUsuarios()"
        :carregando="carregando">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoIconeEditar
            @click="
						mostrarDialogCriarUsuario = true
						usuario_id = item.id
					" />
        </template>
        <template v-slot:[`body.nome`]="{ item }">
          <span class="whitespace-nowrap">{{ item.nome }}</span>
        </template>
        <template v-slot:[`body.usuario`]="{ item }">
          <span class="whitespace-nowrap">{{ item.usuario }}</span>
        </template>
        <template v-slot:[`body.Setor.nome`]="{ item }">
          <span class="whitespace-nowrap">{{ item.Setor ? item.Setor.nome : ""  }}</span>
        </template>
        <template v-slot:[`body.StatusUsuario.descricao`]="{ item }">
          <span class="whitespace-nowrap">{{ item.StatusUsuario.descricao }}</span>
        </template>
      </TabelaPadrao>
    </div>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex items-center w-full">
					<div class="flex w-full justify-end gap-4">
						<BotaoPadrao
							texto="Criar usuário"
							@clique="mostrarDialogCriarUsuario = true">
							<template v-slot>
								<img
									src="@/assets/icons/add-b.svg"
									alt="close"
									class="w-7 h-7" />
							</template>
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarUsuario
			v-if="mostrarDialogCriarUsuario"
			@cancelar="mostrarDialogCriarUsuario = false; usuario_id = null"
			@cadastrado="cadastrado"
			@editado="editado"
			:usuario_id="usuario_id" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import BotaoIconeEditar from "~/components/Ui/Buttons/BotaoIconeEditar.vue"
	import DialogCriarUsuario from "~/components/Dialogs/Admin/DialogCriarUsuario.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue";
	export default {
		name: "Usuarios",
		layout: "admin",
		components: {
      TabelaPadrao,
			DialogCriarUsuario,
			BotaoPadrao,
			RodapePagina,
      AppAlerta,
			BotaoIconeEditar,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", centralizar: true, largura: "w-10" },
					{ nome: "Nome", valor: "nome", filtro: true },
					{ nome: "Usuário", valor: "usuario", filtro: true },
					{ nome: "Setor", valor: "Setor.nome", filtro: true },
					{ nome: "Status", valor: "StatusUsuario.descricao" },
				],
				dados: [],
				filtros: {},
				itensPorPagina: 50,
				totalItens: 0,
				pagina: 1,
				carregando: false,
				mostrarDialogCriarUsuario: false,
				usuario_id: null,
				textoAlerta: "",
				mostrarAlerta: false,
			}
		},
		created() {
			this.buscarUsuarios()
		},
		methods: {
			async buscarUsuarios() {
				let page = this.pagina - 1
				let size = this.itensPorPagina
				let filtros = this.filtros

				let resp = await this.$axios.$get("/usuarios/novo_padrao", {
					params: { page, size, filtros },
				})

				if (!resp.falha) {
					this.dados = resp.dados.usuarios
					this.totalItens = resp.dados.total
				}
			},
			async atualizarDados(parametros) {
				let { itensPorPagina, pagina, filtros } = parametros

				if (itensPorPagina) this.itensPorPagina = itensPorPagina

				if (pagina) this.pagina = pagina

				if (filtros) this.filtros = filtros

				await this.buscarUsuarios()
			},

			cadastrado(usuario) {
				this.dados.push(usuario)
				this.mostrarDialogCriarUsuario = false
				this.mostrarAlerta = true
				this.textoAlerta = "Usuário cadastrado com sucesso!"
			},

      editado(usuario) {
        let idx = this.dados.findIndex( o => o.id === usuario.id )

        console.log(idx)

        for(let k of Object.keys(usuario)){
          console.log(k)

          this.dados[idx][k] = usuario[k]
        }
        this.mostrarDialogCriarUsuario = false
        this.mostrarAlerta = true
        this.textoAlerta = "Usuário editado com sucesso!"
      },
		},
	}
</script>

<style scoped></style>
