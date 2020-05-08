<template>
  <v-ons-navigator :page-stack="pageStack">
    <component :is="page" v-for="page in pageStack" :key="page.key" :page-stack="pageStack"></component>
  </v-ons-navigator>
</template>

<script>
import page1 from "./components/Page1";

export default {
  data() {
    return {
      pageStack: [page1]
    };
  },
  mounted() {
    this.$store.dispatch("loadCheck");

    this.$store.subscribe((mutation, state) => {
      if (mutation.type !== "changeId") {
        var newDB = JSON.stringify(state.memoData);
        var oldDB = localStorage.local_memo ? localStorage.local_memo : "";

        if (newDB !== oldDB) {
          localStorage.local_memo = newDB;
        }
      }
    });
  }
};
</script>