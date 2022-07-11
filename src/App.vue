<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
let brand = " | Cathay Leasing";
export default {
  name: "App",

  watch: {
    $route(to) {
      document.title = to.meta.title + brand;
    },
  },
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@400&display=swap");
#app {
  font-family: "Kanit", sans-serif;
}

.v-application .primary {
  background-color: #20a8d8 !important;
  border-color: #20a8d8 !important;
}
</style>
