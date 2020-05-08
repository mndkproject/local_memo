<template>
  <v-ons-toolbar>
    <div class="left">
      <v-ons-back-button>{{ backLabel }}</v-ons-back-button>
    </div>
    <div class="center">
      <slot></slot>
    </div>
    <div class="right" style="display:flex; justify-content:flex-end;">
      <search-box v-if="searchBtn" :page-stack="pageStack"></search-box>
      <dialog-filter v-if="filterBtn"></dialog-filter>
      <dialog-sort v-if="sortBtn"></dialog-sort>
      <dialog-label v-if="labelBtn"></dialog-label>
      <dialog-size></dialog-size>
    </div>
  </v-ons-toolbar>
</template>

<script>
import dialogSize from "./dialogSize";
import dialogLabel from "./dialogLabel";
import dialogSort from "./dialogSort";
import dialogFilter from "./dialogFilter";
import searchBox from "./searchBox";

export default {
  props: [
    "sortBtn",
    "labelBtn",
    "filterBtn",
    "searchBtn",
    "backLabel",
    "pageStack"
  ],
  components: { dialogSize, dialogSort, dialogLabel, dialogFilter, searchBox }
};
</script>