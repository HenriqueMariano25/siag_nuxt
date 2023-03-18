<template>
  <div>
    Login
  </div>
</template>

<script>
export default {
  name: "index",
  layout: "admin",
  created() {
    console.log(this.$auth.loggedIn)
    console.log(this.$auth.user)
  }
}
</script>

<style scoped>

</style>
