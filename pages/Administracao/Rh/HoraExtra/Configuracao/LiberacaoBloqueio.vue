<template>
	<div class="w-full">
		<div>
			<AppTabs
				:tabs="tabs"
				@tab="tab = $event">
				<template v-slot:[`tab.liberar_agendamento`]="{ item }">
					<div class="mt-1 flex flex-col gap-y-2">
						<div class="flex flex-col p-2 bg-white border border-gray-300 gap-2">
							<div class="text-gray-700 bg-blue-300 px-2 text-xl">
								<span>Liberar <strong>USUÁRIO</strong> para <strong>AGENDAMENTO</strong></span>
							</div>
							<div class="flex gap-2">
								<AppFormInput
									id="horaInicioLiberar"
									type="time"
									v-model="liberacaoUsuarioAgendamento.hora_inicio"
									label="Hora inicio" />
								<AppFormInput
									id="horaFimLiberar"
									type="time"
									v-model="liberacaoUsuarioAgendamento.hora_fim"
									label="Hora Fim" />
								<div class="flex items-end">
									<BotaoPadrao
										texto="Liberar"
										:disabled="desativarSalvarLiberarUsuarioAgendamento"
										cor="bg-primaria-300 hover:bg-primaria-500"
										class="text-white"
										@clique="liberarUsuariosAgendamento()">
										<img
											src="../../../../../assets/icons/lock-open-w.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
								</div>
								<div class="flex items-end">
									<span
										v-if="
											!Object.keys(ultimaLiberacaoAgendamento).some(
												(key) => ultimaLiberacaoAgendamento[key] === null || ultimaLiberacaoAgendamento[key] === '',
											)
										">
										Última liberação:
										<strong>{{
                        ultimaLiberacaoAgendamento.data_ultima_liberacao
												? $dayjs(ultimaLiberacaoAgendamento.data_ultima_liberacao).format("DD/MM/YYYY HH:mm")
												: ""
										}}</strong>
										-
										<strong>{{
                        ultimaLiberacaoAgendamento.liberado_por ? ultimaLiberacaoAgendamento.liberado_por.nome : ""
										}}</strong></span
									>
								</div>
							</div>
							<div>
								<TabelaPadrao
									:cabecalho="cabecalhoAgendamento"
									:dados="usuariosAgendamento"
									:itensPorPagina="itensPorPaginaAgendamento"
									:pagina="paginaAgendamento"
									:totalItens="totalItensAgendamento"
									classPersonalizada="!bg-gray-400"
									altura="calc(100vh - 240px)"
									@atualizar="">
									<template v-slot:[`header.checkbox`]>
										<AppFormCheckbox
											id="checkbox-selecionar-todos"
											@click="selecionarTodosLiberacaoAgendamento"
											:valor="true"
											v-model="selecionandoTodosAgendamento" />
									</template>
									<template v-slot:[`body.checkbox`]="{ item }">
										<AppFormCheckbox
											:id="'checkbox' + item.id"
											:valor="item.id"
											v-model="usuariosPrLiberarAgendamento" />
									</template>
									<template v-slot:[`body.Setor.nome`]="{ item }">
										<span class="whitespace-nowrap"> {{ item.Setor.nome }} </span>
									</template>
									<template v-slot:[`body.ultima_liberacao`]="{ item }">
										<span
											class="whitespace-nowrap"
											v-if="
												item.data_liberacao !== null &&
												item.hora_inicio_liberacao !== null &&
												item.hora_fim_liberacao !== null
											">
											{{ $dayjs(item.data_liberacao).format("DD/MM/YYYY") }} -
											{{ item.hora_inicio_liberacao }} a {{ item.hora_fim_liberacao }}
										</span>
									</template>
								</TabelaPadrao>
							</div>
						</div>
					</div>
				</template>
        <template v-slot:[`tab.liberar_aprovacao`]="{ item }">
          <div class="mt-1 flex flex-col gap-y-2">
            <div class="flex flex-col p-2 bg-white border border-gray-300 gap-2">
              <div class="text-gray-700 bg-blue-300 px-2 text-xl">
                <span>Liberar <strong>USUÁRIO</strong> para <strong>APROVAÇÃO</strong></span>
              </div>
              <div class="flex gap-2">
                <AppFormInput
                  id="horaInicioLiberar"
                  type="time"
                  v-model="liberacaoUsuarioAprovacao.hora_inicio"
                  label="Hora inicio" />
                <AppFormInput
                  id="horaFimLiberar"
                  type="time"
                  v-model="liberacaoUsuarioAprovacao.hora_fim"
                  label="Hora Fim" />
                <div class="flex items-end">
                  <BotaoPadrao
                    texto="Liberar"
                    :disabled="desativarSalvarLiberarUsuarioAprovacao"
                    cor="bg-primaria-300 hover:bg-primaria-500"
                    class="text-white"
                    @clique="liberarUsuariosAprovacao()">
                    <img
                      src="../../../../../assets/icons/lock-open-w.svg"
                      alt=""
                      class="w-7 h-7" />
                  </BotaoPadrao>
                </div>
                <div class="flex items-end">
									<span
                    v-if="
											!Object.keys(ultimaLiberacaoAprovacao).some(
												(key) => ultimaLiberacaoAprovacao[key] === null || ultimaLiberacaoAprovacao[key] === '',
											)
										">
										Última liberação:
										<strong>{{
                        ultimaLiberacaoAprovacao.data_ultima_liberacao
                          ? $dayjs(ultimaLiberacaoAprovacao.data_ultima_liberacao).format("DD/MM/YYYY HH:mm")
                          : ""
                      }}</strong>
										-
										<strong>{{
                        ultimaLiberacaoAprovacao.liberado_por ? ultimaLiberacaoAprovacao.liberado_por.nome : ""
                      }}</strong></span
                  >
                </div>
              </div>
              <div>
                <TabelaPadrao
                  :cabecalho="cabecalhoAprovacao"
                  :dados="usuariosAprovacao"
                  :itensPorPagina="itensPorPaginaAprovacao"
                  :pagina="paginaAprovacao"
                  :totalItens="totalItensAprovacao"
                  classPersonalizada="!bg-gray-400"
                  altura="calc(100vh - 240px)"
                  @atualizar="">
                  <template v-slot:[`header.checkbox`]>
                    <AppFormCheckbox
                      id="checkbox-selecionar-todos"
                      @click="selecionarTodosLiberacaoAprovacao"
                      :valor="true"
                      v-model="selecionandoTodosAprovacao" />
                  </template>
                  <template v-slot:[`body.checkbox`]="{ item }">
                    <AppFormCheckbox
                      :id="'checkbox' + item.id"
                      :valor="item.id"
                      v-model="usuariosPrLiberarAprovacao" />
                  </template>
                  <template v-slot:[`body.Setor.nome`]="{ item }">
                    <span class="whitespace-nowrap"> {{ item.Setor.nome }} </span>
                  </template>
                  <template v-slot:[`body.ultima_liberacao`]="{ item }">
										<span
                      class="whitespace-nowrap"
                      v-if="
												item.data_liberacao_aprovacao !== null &&
												item.hora_inicio_liberacao_aprovacao !== null &&
												item.hora_fim_liberacao_aprovacao !== null
											">
											{{ $dayjs(item.data_liberacao_aprovacao).format("DD/MM/YYYY") }} -
											{{ item.hora_inicio_liberacao_aprovacao }} a {{ item.hora_fim_liberacao_aprovacao }}
										</span>
                  </template>
                </TabelaPadrao>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:[`tab.bloquear`]="{ item }">
          <div class="mt-2 gap-2 flex flex-col">
            <div class="flex flex-col p-2 bg-white border border-gray-300 gap-2">
              <div class="text-gray-700 bg-blue-300 px-2 text-xl">
                <span>Bloqueio de <strong>INTERVALO</strong> para agendamento</span>
              </div>
              <div class="flex gap-2">
                <AppFormInput
                  id="dataInicioBloqueio"
                  type="date"
                  v-model="bloqueioIntervalo.data_inicio"
                  label="Data inicio" />
                <AppFormInput
                  id="dataFimBloqueio"
                  type="date"
                  v-model="bloqueioIntervalo.data_fim"
                  label="Data fim" />
                <AppFormInput
                  id="horaInicioBloqueio"
                  type="time"
                  v-model="bloqueioIntervalo.hora_inicio"
                  label="Hora inicio" />
                <AppFormInput
                  id="horaFimBloqueio"
                  type="time"
                  v-model="bloqueioIntervalo.hora_fim"
                  label="Hora fim" />
                <div class="flex items-end">
                  <BotaoPadrao
                    texto="Bloquear"
                    :disabled="desativarSalvarBloquearIntervalo"
                    cor="bg-primaria-300 hover:bg-primaria-500"
                    class="text-white"
                    @clique="salvarBloqueioIntervalor()">
                    <img
                      src="../../../../../assets/icons/lock-w.svg"
                      alt=""
                      class="w-7 h-7" />
                  </BotaoPadrao>
                </div>
              </div>
              <div class="flex flex-col">
                <span class="text-xl text-gray-700" v-if="">Último bloqueio</span>
                <span v-if="ultimoBloqueioHe.data_inicio">
									Inicio:
									<strong>
										{{ $dayjs(ultimoBloqueioHe.data_inicio).format("DD/MM/YYYY") }} -
										{{ ultimoBloqueioHe.hora_inicio }}
									</strong>
								</span>
                <span v-if="ultimoBloqueioHe.data_fim">
									Termino:
									<strong>
										{{ $dayjs(ultimoBloqueioHe.data_fim).format("DD/MM/YYYY") }} -
										{{ ultimoBloqueioHe.hora_fim }}
									</strong>
								</span>
                <span v-if="ultimoBloqueioHe.Usuario">
									Bloqueado por:
									<strong>
										{{ ultimoBloqueioHe.Usuario ? ultimoBloqueioHe.Usuario.nome : "" }}
									</strong>
									em
									<strong>{{
                      $dayjs(ultimoBloqueioHe.createdAt).format("DD/MM/YYYY  HH:mm")
                    }}</strong>
								</span>
              </div>
            </div>
<!--            <div class="flex flex-col p-2 bg-white border border-gray-300 gap-2">-->
<!--              <div class="text-gray-700 bg-blue-300 px-2 text-xl flex gap-2">-->
<!--                <span>Bloqueio de <strong>DIA</strong> para agendamento</span>-->
<!--                <AppTooltip largura="w-[600px]">-->
<!--                  <template v-slot:corpo>-->
<!--                    <img-->
<!--                      src="../../../../../assets/icons/information-circle-g.svg"-->
<!--                      alt=""-->
<!--                      class="w-7 h-7" />-->
<!--                  </template>-->
<!--                  <template v-slot:tooltip>-->
<!--                    <div>-->
<!--                      <p>Bloqueia <strong>DIA</strong> específico para não poder ser agendado.</p>-->
<!--                      <p>-->
<!--                        Ex: Caso tenha um fériado na sexta-feira mas só nesse dia não poderá ter-->
<!--                        hora extra.-->
<!--                      </p>-->
<!--                    </div>-->
<!--                  </template>-->
<!--                </AppTooltip>-->
<!--              </div>-->
<!--              <div class="flex gap-2">-->
<!--                <AppFormInput-->
<!--                  id="diaBloqueioEsquecifico"-->
<!--                  type="date"-->
<!--                  label="Dia do bloqueio" />-->
<!--                <div class="flex items-end">-->
<!--                  <BotaoPadrao texto="Bloquear">-->
<!--                    <img-->
<!--                      src="../../../../../assets/icons/lock-b.svg"-->
<!--                      alt=""-->
<!--                      class="w-7 h-7" />-->
<!--                  </BotaoPadrao>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div>-->
<!--                <span class="text-xl text-gray-700">Dias bloqueados</span>-->
<!--              </div>-->
<!--            </div>-->
          </div>
        </template>
			</AppTabs>
		</div>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
	</div>
</template>

<script setup>
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
import AppFormInput from "~/components/Ui/AppFormInput.vue"
import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import AppTabs from "~/components/Ui/AppTabs.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";
import AppTooltip from "~/components/Ui/AppTooltip.vue";
</script>

<script>

	export default {
		name: "LiberacaoBloqueio",
		data() {
			return {
				tabs: [
					{ nome: "Liberar p/ agendamento", valor: "liberar_agendamento" },
					{ nome: "Liberar p/ aprovação", valor: "liberar_aprovacao" },
					{ nome: "Bloquear", valor: "bloquear" },
				],
				tab: null,
        mostrarAlerta: false,
        textoAlerta: null,

				//Liberar agendamento
				usuariosAgendamento: [],
				usuariosPrLiberarAgendamento: [],
				liberacaoUsuarioAgendamento: {
					hora_inicio: this.$dayjs().format("HH:mm"),
					hora_fim: this.$dayjs().add(15, "minutes").format("HH:mm"),
				},
				ultimaLiberacaoAgendamento: {},
				selecionandoTodosAgendamento: false,
        cabecalhoAgendamento: [
          { nome: "", valor: "checkbox", centralizar: true, largura: "w-10" },
          { nome: "Nome", valor: "nome", filtro: true },
          { nome: "Login", valor: "usuario", filtro: true },
          { nome: "Setor", valor: "Setor.nome", filtro: true },
          { nome: "Última liberação", valor: "ultima_liberacao", filtro: true },
        ],
        filtrosAgendamento: {},
        itensPorPaginaAgendamento: 50,
        totalItensAgendamento: 0,
        paginaAgendamento: 1,

        //Liberar aprovação
        usuariosAprovacao: [],
        usuariosPrLiberarAprovacao: [],
        liberacaoUsuarioAprovacao: {
          hora_inicio: this.$dayjs().format("HH:mm"),
          hora_fim: this.$dayjs().add(15, "minutes").format("HH:mm"),
        },
        ultimaLiberacaoAprovacao: {},
        selecionandoTodosAprovacao: false,
        cabecalhoAprovacao: [
          { nome: "", valor: "checkbox", centralizar: true, largura: "w-10" },
          { nome: "Nome", valor: "nome", filtro: true },
          { nome: "Login", valor: "usuario", filtro: true },
          { nome: "Setor", valor: "Setor.nome", filtro: true },
          { nome: "Última liberação", valor: "ultima_liberacao", filtro: true },
        ],
        filtrosAprovacao: {},
        itensPorPaginaAprovacao: 50,
        totalItensAprovacao: 0,
        paginaAprovacao: 1,


        //Bloqueio
        bloqueioIntervalo: {
          data_inicio: null,
          data_fim: null,
          hora_inicio: null,
          hora_fim: null,
        },
        buscouBloqueio: false,
        ultimoBloqueioHe: {
          data_inicio: null,
          data_fim: null,
          hora_inicio: null,
          hora_fim: null,
        },
			}
		},
    computed: {
      desativarSalvarLiberarUsuarioAgendamento() {
        return Object.keys(this.liberacaoUsuarioAgendamento).some(
          (key) => this.liberacaoUsuarioAgendamento[key] === null || this.liberacaoUsuarioAgendamento[key] === "",
        ) || this.usuariosPrLiberarAgendamento.length <= 0
      },
      desativarSalvarLiberarUsuarioAprovacao() {
        return Object.keys(this.liberacaoUsuarioAprovacao).some(
          (key) => this.liberacaoUsuarioAprovacao[key] === null || this.liberacaoUsuarioAprovacao[key] === "",
        ) || this.usuariosPrLiberarAprovacao.length <= 0
      },
      desativarSalvarBloquearIntervalo() {
        return Object.keys(this.bloqueioIntervalo).some(
          (key) => this.bloqueioIntervalo[key] === null || this.bloqueioIntervalo[key] === "",
        )
      },
    },
    async created() {
      await this.buscarUsuariosAgendamento();
      await this.buscarUsuariosAprovacao();
      await this.buscarBloqueios()
    },
    methods: {
      // LIBERAR AGENDAMENTO
      async buscarUsuariosAgendamento() {
        let filtros = this.filtrosAgendamento

        let resp = await this.$axios.$get("/usuarios/ativos", { params: { filtros }})

        if (!resp.falha) {
          this.usuariosAgendamento = resp.dados.usuarios
          this.totalItens = this.usuariosAgendamento.length
        }
      },
      selecionarTodosLiberacaoAgendamento() {
        if (!this.selecionandoTodosAgendamento) {
          this.usuariosPrLiberarAgendamento = this.usuariosAgendamento.map(o => o.id)
        } else {
          this.usuariosPrLiberarAgendamento = []
        }
      },
      async liberarUsuariosAgendamento() {
        let { hora_inicio, hora_fim } = this.liberacaoUsuarioAgendamento
        let usuario_id = this.$auth.user.id
        let usuarios = this.usuariosPrLiberarAgendamento


        await this.$axios.$post("/hora_extra/configuracao/liberar_usuarios", {
          usuarios,
          usuario_id,
          hora_inicio,
          hora_fim,
        })

        let hoje = this.$dayjs().format("YYYY-MM-DD")

        for (let usuario of usuarios) {
          let idx = this.usuariosAgendamento.findIndex(o => o.id === usuario)
          if (idx >= 0) {
            this.usuariosAgendamento[idx].data_liberacao = hoje
            this.usuariosAgendamento[idx].hora_inicio_liberacao = hora_inicio
            this.usuariosAgendamento[idx].hora_fim_liberacao = hora_fim
          }
        }

        this.ultimaLiberacaoAgendamento.data_ultima_liberacao = this.$dayjs().format("YYYY-MM-DD HH:mm:ss")
        this.ultimaLiberacaoAgendamento.liberado_por = { nome: this.$auth.user.nome }
        this.mostrarAlerta = true
        this.textoAlerta = "Liberação para AGENDAMENTO realizado com sucesso"
      },

      // LIBERAR APROVAÇÃO
      async buscarUsuariosAprovacao() {
        let filtros = this.filtrosAprovacao

        console.log(filtros)
        filtros["$UsuarioPermissaos.Permissao.descricao$"] = 'autorizar_he'

        let resp = await this.$axios.$get("/usuarios/ativos", { params: { filtros } })

        if (!resp.falha) {
          this.usuariosAprovacao = resp.dados.usuarios
          this.totalItens = this.usuariosAprovacao.length
        }
      },
      async liberarUsuariosAprovacao() {
        let { hora_inicio, hora_fim } = this.liberacaoUsuarioAprovacao
        let usuario_id = this.$auth.user.id
        let usuarios = this.usuariosPrLiberarAprovacao


        await this.$axios.$post("/hora_extra/configuracao/liberar_usuarios_aprovacao", {
          usuarios,
          usuario_id,
          hora_inicio,
          hora_fim,
        })

        let hoje = this.$dayjs().format("YYYY-MM-DD")

        for (let usuario of usuarios) {
          let idx = this.usuariosAgendamento.findIndex(o => o.id === usuario)
          if (idx >= 0) {
            this.usuariosAprovacao[idx].data_liberacao_aprovacao = hoje
            this.usuariosAprovacao[idx].hora_inicio_liberacao_aprovacao = hora_inicio
            this.usuariosAprovacao[idx].hora_fim_liberacao_aprovacao = hora_fim
          }
        }

        this.ultimaLiberacaoAprovacao.data_ultima_liberacao = this.$dayjs().format("YYYY-MM-DD HH:mm:ss")
        this.ultimaLiberacaoAprovacao.liberado_por = { nome: this.$auth.user.nome }
        this.mostrarAlerta = true
        this.textoAlerta = "Liberação para APROVAÇÃO realizado com sucesso"
      },
      selecionarTodosLiberacaoAprovacao() {
        if (!this.selecionandoTodosAprovacao) {
          this.usuariosPrLiberarAprovacao = this.usuariosAprovacao.map(o => o.id)
        } else {
          this.usuariosPrLiberarAprovacao = []
        }
      },

      //Bloqueio
      async buscarBloqueios() {
        let resp = await this.$axios.$get("/hora_extra/configuracao/bloqueios")

        if (!resp.falha) {
          let dados = resp.dados

          console.log(dados)

          this.buscouBloqueio = true

          if (dados.bloqueioHE !== null)
            this.ultimoBloqueioHe = dados.bloqueioHE
        }
      },

      async salvarBloqueioIntervalor() {
        let { data_inicio, data_fim, hora_inicio, hora_fim } = this.bloqueioIntervalo

        let bloqueado_por_id = this.$auth.user.id

        let resp = await this.$axios.$post("/hora_extra/configuracao/bloqueio_intervalo", {
          data_inicio,
          data_fim,
          hora_inicio,
          hora_fim,
          bloqueado_por_id,
        })

        if (!resp.falha) {
          console.log(resp)
          let dados = resp.dados.bloqueio
          dados["Usuario"] = { nome: this.$auth.user.nome }

          this.ultimoBloqueioHe = dados

          this.mostrarAlerta = true
          this.textoAlerta = "Bloqueio de Intervalo configurado com sucesso"
        }
      },
    }
	}
</script>

<style scoped></style>
