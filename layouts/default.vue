<template>
  <div class="flex">
    <AppAlerta tipo="alerta" :mostrar="mostrarLocal" @escondeu="mostrarLocal = false">Buscando o efetivo, favor aguarde...</AppAlerta>
    <div class="h-[100vh] print:hidden">
      <MenuLateral/>
    </div>
    <div class="flex p-2 w-full bg-gray-200">
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
