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
      <tool-trash v-if="pageKey === 'key_editor'"></tool-trash>
      <tool-webshare v-if="pageKey === 'key_editor' && isSP"></tool-webshare>
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
import toolTrash from "./toolTrash";
import toolSearch from "./toolSearch";
import toolWebshare from "./toolWebshare";

export default {
  computed: {
    pageKey() {
      return this.page.key;
    },
    openSide() {
      return this.$store.state.openSide;
    },
    isSP() {
      return this.$ons.platform.isIOS() || this.$ons.platform.isAndroid()
        ? true
        : false;
    }
  },
  props: ["backLabel", "pageStack", "page", "toggleSide"],
  components: {
    toolSize,
    toolLabel,
    toolSort,
    toolFilter,
    toolTrash,
    toolSearch,
    toolWebshare
  }
};
</script>