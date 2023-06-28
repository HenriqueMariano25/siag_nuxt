<template>
  <div class="flex">
    <div class="h-[100vh] print:hidden">
      <MenuLateralAdmin/>
    </div>
    <div class="flex p-2 w-full bg-gray-200 relative grow">
      <Nuxt/>
    </div>
  </div>
</template>

<script>
import MenuLateralAdmin from "@/components/Menu/MenuLateralAdmin.vue"
export default {
  name: "admin",
  middleware: ['auth-admin'],
  components:{
    MenuLateralAdmin
  }
}
</script>

<style scoped>

</style>
