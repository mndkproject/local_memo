<template>
  <div>
    <v-ons-toolbar-button @click="selectTrash">
      <i class="zmdi zmdi-delete"></i>
    </v-ons-toolbar-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trashDialogVisible: false
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    tarId() {
      return this.$store.state.currentId;
    }
  },
  methods: {
    selectTrash() {
      this.$ons.notification
        .confirm(this.lang.deleteConfirm, {
          title: this.lang.deleteTtl,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("deletePopCheck", this.tarId);
            this.$ons.notification.toast(this.lang.deleteNotice, {
              timeout: 2000
            });
          }
        });
    }
  }
};
</script>