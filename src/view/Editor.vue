<template>
  <v-ons-page>
    <custom-toolbar
      :back-label="backLabelTxt"
      :page-stack="pageStack"
      :page="page"
      id="edit-toolbar"
    >{{ lang.edit }}</custom-toolbar>
    <div class="content edit-content">
      <edit-area></edit-area>
    </div>
  </v-ons-page>
</template>

<script>
import customToolbar from "../components/CustomToolbar";
import editArea from "../components/editArea";

export default {
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