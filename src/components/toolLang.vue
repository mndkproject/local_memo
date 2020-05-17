<template>
  <div class="side-item">
    <div class="side-item__btn" @click="langDialogVisible = true">
      <i class="zmdi zmdi-globe"></i>
      <span>{{ lang.langSetting }}</span>
    </div>

    <v-ons-alert-dialog modifier="rowfooter" :visible.sync="langDialogVisible" cancelable>
      <span slot="title">{{ lang.langSetting }}</span>
      <v-ons-list>
        <v-ons-list-item
          v-for="(item, $index) in langs"
          :key="item.code"
          tappable
          modifier="lang-list"
        >
          <label class="left">
            <v-ons-radio :input-id="'lang-' + $index" :value="item.code" v-model="selectedLang"></v-ons-radio>
          </label>
          <label :for="'lang-' + $index" class="center">{{ item.name }}</label>
        </v-ons-list-item>
      </v-ons-list>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="langDialogVisible = false">{{ lang.close }}</v-ons-alert-dialog-button>
        <v-ons-alert-dialog-button @click="sendLang">{{ lang.ok }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<style>
.list-item--lang-list__center,
.list-item--lang-list__left {
  cursor: pointer;
}
</style>

<script>
export default {
  data() {
    return {
      langDialogVisible: false,
      langs: [
        { code: "ja", name: "日本語" },
        { code: "en", name: "English" }
      ],
      selectedLang: "ja"
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    currentSelectLang() {
      return this.$store.state.memoData.selectLang
        ? this.$store.state.memoData.selectLang
        : "ja";
    }
  },
  mounted() {
    this.selectedLang =
      this.currentSelectLang !== "" ? this.currentSelectLang : "ja";
  },
  watch: {
    langDialogVisible() {
      if (!this.langDialogVisible) {
        this.selectedLang = this.$store.state.memoData.selectLang;
      }
    }
  },
  methods: {
    sendLang() {
      this.$store.dispatch("langCheck", this.selectedLang);
      this.langDialogVisible = false;
    }
  }
};
</script>