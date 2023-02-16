<template>
  <div>
<!--    <h1>{{ funcionarios }}</h1>-->
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: 'buscarFuncionarios',
  data(){
    return{
      // funcionarios: []
    }
  },
  async fetch(){
    this.funcionarios = this.$store.state.funcionarios
  },
  methods:{
  },
  watch:{

  }
}
</script>
