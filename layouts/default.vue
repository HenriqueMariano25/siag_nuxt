<template>
  <div class="flex">
    <AppAlerta tipo="alerta" :mostrar="mostrarLocal" @escondeu="mostrarLocal = false">Buscando o efetivo, favor aguarde...</AppAlerta>
    <div class="h-[100vh] print:hidden">
      <MenuLateral v-if="$auth.loggedIn"/>
    </div>
    <div class="flex p-2 bg-gray-200 print:bg-white grow relative" style="max-width: calc(100vw - 48px)">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import MenuLateral from "~/components/Menu/MenuLateral.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";

export default {
  name: "DefaultLayout",
  components: {
    MenuLateral,
    AppAlerta
  },
  middleware: ['auth'],
  data(){
    return{
      mostrarLocal: this.$store.state.funcionarios.estaBuscando
    }
  },
  created(){
    console.log()
  },
}
</script>

<style scoped>

</style>
