<template>
<!--  <div class="bg-red-500 w-[400px] h-10 absolute top-10">-->
<!--    <div>-->
<!--      <h1>Teste</h1>-->
<!--    </div>-->
<!--  </div>-->
    <div
      class="mt-6 mr-10 right-0 flex space-x-2 items-center min-w-[300px] absolute bg-gray-300 rounded border border-gray-400 p-1 text-gray-800">
      <div class="">
        <AppFormInput type="text" :placeholder="'Buscar por '+ nome"/>
      </div>
      <div class="flex">
        <button class="bg-primaria-700 text-white p-2 shadow rounded-3xl">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
               class="w-6 h-6">
            <path fill-rule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                  clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
</template>

<script>
import AppFormInput from "~/components/Ui/AppFormInput.vue";

export default {
  name: "TableFiltroSimples",
  props:{
    nome: {
      type: String,
      required: true,
    }
  },
  components:{
    AppFormInput
  },
  data(){
    return{
      mostrar: false,
    }
  }
}
</script>

<style scoped>

</style>
