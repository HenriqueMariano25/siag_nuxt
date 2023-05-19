<template>
  <div class="relative geral" >
    <div class="corpo flex items-center">
      <slot name="corpo">

      </slot>
    </div>
    <div class="bg-gray-900/90 absolute flex p-2 rounded text-white tooltip" :class="{ [largura]: largura }">
      <slot name="tooltip">

      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    largura: {
      type: [String],

    }
  }
}
</script>

<style scoped>
.geral{
  z-index: 105;
}

.tooltip{
  visibility: hidden;
}

.geral:hover .tooltip{
  visibility: visible;
}


</style>
