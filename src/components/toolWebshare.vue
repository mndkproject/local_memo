<template>
  <div v-if="isWebShare">
    <v-ons-toolbar-button @click="webShare">
      <i class="zmdi zmdi-share"></i>
    </v-ons-toolbar-button>
  </div>
</template>

<script>
export default {
  computed: {
    tarIndex() {
      return this.$store.getters.currentIndex;
    },
    isWebShare() {
      return navigator.share ? true : false;
    }
  },
  methods: {
    webShare() {
      if (this.tarIndex !== "" && this.tarIndex >= 0) {
        navigator
          .share({
            text: this.$store.state.memoData.memoList[this.tarIndex].content
          })
          .then(() => {
            console.log("Successful share");
          })
          .catch(error => {
            console.log("Error sharing:" + error);
          });
      } else {
        this.$ons.notification.toast("データが選択されていません。", {
          timeout: 2000
        });
      }
    }
  }
};
</script>