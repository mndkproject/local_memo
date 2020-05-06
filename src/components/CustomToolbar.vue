<template>
  <v-ons-toolbar>
    <div class="left">
      <v-ons-back-button>{{ backLabel }}</v-ons-back-button>
    </div>
    <div class="center">
      <slot></slot>
    </div>
    <div class="right">
      <dialog-size :change-size="changeSize" :post-font-size="postFontSize"></dialog-size>
    </div>
  </v-ons-toolbar>
</template>

<script>
import dialogSize from "./dialogSize";

export default {
  props: ["backLabel", "changeSize", "postFontSize"],
  components: { dialogSize }
};
</script>