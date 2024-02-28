<template>
  <div class="flex w-full justify-center items-center bg-[url('~/assets/img/comida.jpg')] bg-clip-content bg-origin-content bg-left bg-cover">
    <div class="w-10/12 flex flex-col shadow" >
      <div class="flex w-full bg-primaria-700 px-2 py-1 rounded-t uppercase">
        <span class="text-4xl text-white">{{ nomeRefeicao }}</span>
      </div>
      <div class="w-full py-12 bg-gray-900/80 text-center flex flex-col justify-center items-center gap-2 text-white" v-if="carregando">
        <template v-if="!erro">

        <div class="square-circle-5"></div>
        <span class="text-4xl font-bold">BUSCANDO DADOS, POR FAVOR AGUARDE!</span>
        <span class="text-md">A lentidão se dá pelo grande volume de dados nas catracas e não por conta do SIAG!</span>
        </template>
        <template v-if="erro">
          <span class="text-3xl font-bold text-red-400">ERRO NA BUSCA DOS DADOS, ATUALIZE PARA BUSCAR NOVAMENTE!</span>
        </template>
      </div>
      <div class="bg-white flex w-full divide-x divide-gray-700" v-if="!carregando">
        <div class="p-1 flex flex-col justify-center grow w-full">
          <span class="text-2xl text-center bg-primaria-500 text-white py-1">REFEITÓRIO 1</span>
          <div class="flex flex-col gap-2 divide-y divide-gray-500  justify-center text-center"
               >
            <div class="flex flex-col text-6xl py-4">
              <span>ENTRADAS</span>
              <span>{{ passagensEntrada }}</span>
            </div>
            <div class="flex flex-col text-6xl py-4">
              <span>SAÍDAS</span>
              <span>{{ passagensSaida }}</span>
            </div>
          </div>
        </div>f
      </div>

      <div class="flex w-full bg-primaria-700 px-2 py-1 rounded-b uppercase justify-between">
        <BotaoPadrao texto="voltar" @clique="$router.push('/administracao/nutricao')">
          <img src="@/assets/icons/back-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
        <BotaoPadrao texto="atualizar" :disabled="carregando && !erro" @clique="buscarContagem()">
          <img src="@/assets/icons/rotate-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </div>
    </div>
  </div>
</template>

<script>
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  components: { BotaoPadrao },
  data() {
    return {
      carregando: false,
      horarioInicio: null,
      horarioFim: null,
      passagensEntrada: 0,
      passagensSaida: 0,
      passagensRef2: 0,
      erro: false,
    };
  },
  computed: {
    nomeRefeicao() {
      let horaAgora = this.$dayjs().format("HH:mm");
      let nomeRefeicao;

      if (horaAgora >= "00:00" && horaAgora < "10:30") {
        nomeRefeicao = "Café da manhã";
        this.horarioInicio = '05:00'
        this.horarioFim = '07:30'
      } else if (horaAgora >= "10:30" && horaAgora < "15:00") {
        nomeRefeicao = "Almoço";
        this.horarioInicio = '10:50'
        this.horarioFim = '15:00'
      } else if (horaAgora >= "15:00" && horaAgora < "20:00") {
        nomeRefeicao = "Lanche da tarde";
        this.horarioInicio = '15:20'
        this.horarioFim = '17:30'
      } else if (horaAgora >= "20:00" && horaAgora < "23:59") {
        nomeRefeicao = "Janta";
        this.horarioInicio = '20:00'
        this.horarioFim = '23:30'
      }

      return nomeRefeicao;
    }
  }, mounted() {
    this.buscarContagem();
  },
  methods: {
    async buscarContagem() {
      this.carregando = true
      this.erro = false
      let horarioInicio = this.horarioInicio
      let horarioFim = this.horarioFim

      try {
          let resp = await this.$axios.$get("/nutricao/contagem_refeitorio", { params: { horarioInicio, horarioFim }})

        if(resp){
          this.passagensEntrada = resp.passagensEntrada
          this.passagensSaida = resp.passagensSaida
          this.passagensRef2 = resp.passagensRef2
          this.carregando = false
        }
        this.erro = false
      }catch (e) {
        this.erro = true
      }
    }
  }
};
</script>

<style scoped>
.square-circle-5 {
  width: 65px;
  aspect-ratio: 1;
  position: relative;
}

.square-circle-5:before,
.square-circle-5:after {
  content: "";
  position: absolute;
  border-radius: 50px;
  box-shadow: 0 0 0 3px inset #fff;
  animation: sc5 2.5s infinite;
}

.square-circle-5:after {
  animation-delay: -1.25s;
  border-radius: 0;
}

@keyframes sc5 {
  0% {
    inset: 0 35px 35px 0;
  }
  12.5% {
    inset: 0 35px 0 0;
  }
  25% {
    inset: 35px 35px 0 0;
  }
  37.5% {
    inset: 35px 0 0 0;
  }
  50% {
    inset: 35px 0 0 35px;
  }
  62.5% {
    inset: 0 0 0 35px;
  }
  75% {
    inset: 0 0 35px 35px;
  }
  87.5% {
    inset: 0 0 35px 0;
  }
  100% {
    inset: 0 35px 35px 0;
  }
}
</style>
