<template>
  <div class="side-item">
    <div class="side-item__btn" @click="themeDialogVisible = true">
      <i class="zmdi zmdi-brightness-6"></i>
      {{ lang.theme }}
    </div>

    <v-ons-alert-dialog :visible.sync="themeDialogVisible" cancelable>
      <span slot="title">Dark Mode</span>
      <v-ons-switch v-model="selectedTheme" @click="selectTheme"></v-ons-switch>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="themeDialogVisible = false;">{{ lang.close }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      themeDialogVisible: false,
      selectedTheme: false
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    }
  },
  mounted() {
    this.selectedTheme = this.$store.state.memoData.themeColor;
  },
  methods: {
    selectTheme() {
      this.$store.dispatch("themeCheck", this.selectedTheme);
      document.body.classList.toggle("darkmode");
      this.themeDialogVisible = false;
    }
  }
};
</script>