<template>
  <v-ons-page>
    <custom-toolbar :back-label="backLabelTxt" :page-stack="pageStack" :page="page">{{ lang.edit }}</custom-toolbar>
    <div class="content">
      <edit-area></edit-area>
    </div>
  </v-ons-page>
</template>

<script>
import customToolbar from "../components/CustomToolbar";
import editArea from "../components/editArea";

export default {
  methods: {
    pop() {
      this.pageStack.pop();
    }
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    backLabelTxt() {
      return this.lang.backLabel;
    }
  },
  props: ["pageStack", "page"],
  components: { customToolbar, editArea },
  key: "key_editor"
};
</script>