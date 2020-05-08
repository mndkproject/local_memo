<template>
  <v-ons-toolbar>
    <div class="left">
      <v-ons-back-button>{{ backLabel }}</v-ons-back-button>
    </div>
    <div class="center">
      <slot></slot>
    </div>
    <div class="right" style="display:flex; justify-content:flex-end;">
      <dialog-sort v-if="sortBtn"></dialog-sort>
      <dialog-size></dialog-size>
    </div>
  </v-ons-toolbar>
</template>

<script>
import dialogSize from "./dialogSize";
import dialogSort from "./dialogSort";

export default {
  props: ["sortBtn", "backLabel"],
  components: { dialogSize, dialogSort }
};
</script>