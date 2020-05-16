<template>
  <v-ons-toolbar>
    <div class="left">
      <v-ons-toolbar-button v-if="pageKey === 'key_index'" @click="toggleSide">
        <i class="zmdi zmdi-menu"></i>
      </v-ons-toolbar-button>
      <v-ons-back-button>{{ backLabel }}</v-ons-back-button>
      <slot></slot>
    </div>
    <div class="right">
      <tool-search
        :page-stack="pageStack"
        v-if="pageKey === 'key_index' || pageKey === 'key_trash'"
      ></tool-search>
      <tool-filter v-if="pageKey === 'key_index' || pageKey === 'key_trash'"></tool-filter>
      <tool-sort v-if="pageKey === 'key_index' || pageKey === 'key_trash'"></tool-sort>
      <tool-size :page="page"></tool-size>
      <tool-label v-if="pageKey === 'key_editor'"></tool-label>
      <tool-info v-if="pageKey === 'key_editor'"></tool-info>
    </div>
  </v-ons-toolbar>
</template>

<style>
.toolbar > div {
  display: flex;
  align-items: center;
}

.toolbar > .toolbar__right {
  justify-content: flex-end;
}

.back-button {
  margin-right: 1em;
  cursor: pointer;
}
</style>

<script>
import toolSize from "./toolSize";
import toolLabel from "./toolLabel";
import toolSort from "./toolSort";
import toolFilter from "./toolFilter";
import toolInfo from "./toolInfo";
import toolSearch from "./toolSearch";

export default {
  computed: {
    pageKey() {
      return this.page.key;
    },
    openSide() {
      return this.$store.state.openSide;
    }
  },
  props: ["backLabel", "pageStack", "page", "toggleSide"],
  components: {
    toolSize,
    toolLabel,
    toolSort,
    toolFilter,
    toolInfo,
    toolSearch
  }
};
</script>