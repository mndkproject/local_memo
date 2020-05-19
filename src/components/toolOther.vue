<template>
  <div class="side-item">
    <div class="side-item__btn" @click="otherDialogVisible = true">
      <i class="zmdi zmdi-settings"></i>
      {{ lang.other }}
    </div>

    <v-ons-alert-dialog :visible.sync="otherDialogVisible" cancelable modifier="other">
      <span slot="title">{{ lang.other }}</span>
      <v-ons-list modifier="other-dialog">
        <v-ons-list-item tappable @click="removeDialog('label')">
          <div class="left">
            <i class="zmdi zmdi-palette"></i>
          </div>
          <div class="center">{{ lang.lavelRemove }}</div>
        </v-ons-list-item>
        <v-ons-list-item tappable @click="removeDialog('fav')">
          <div class="left">
            <i class="zmdi zmdi-labels"></i>
          </div>
          <div class="center">{{ lang.favRemove }}</div>
        </v-ons-list-item>
        <v-ons-list-item tappable @click="removeDialog('mark')">
          <div class="left">
            <i class="zmdi zmdi-check-all"></i>
          </div>
          <div class="center">{{ lang.markRemove }}</div>
        </v-ons-list-item>
        <v-ons-list-item tappable @click="removeDialog('local')">
          <div class="left">
            <i class="zmdi zmdi-blur"></i>
          </div>
          <div class="center">{{ lang.localRemove }}</div>
        </v-ons-list-item>
      </v-ons-list>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="otherDialogVisible = false;">{{ lang.close }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<style>
.alert-dialog--other .list-item {
  cursor: pointer;
  padding: 0;
}

.alert-dialog--other .list-item--material__left {
  min-width: 44px;
}
</style>

<script>
export default {
  data() {
    return {
      otherDialogVisible: false,
      comfirmTxt: "",
      ttlTxt: "",
      dispatchTarget: "",
      noticeTxt: ""
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    }
  },
  methods: {
    removeDialog(target) {
      switch (target) {
        case "label":
          this.comfirmTxt = this.lang.labelRemoveConfirm;
          this.ttlTxt = this.lang.labelRemove;
          this.dispatchTarget = "labelRemoveCheck";
          this.noticeTxt = this.lang.labelRemoveNotice;
          this.otherDialogVisible = true;
          break;
        case "fav":
          this.comfirmTxt = this.lang.favRemoveConfirm;
          this.ttlTxt = this.lang.favRemove;
          this.dispatchTarget = "favRemoveCheck";
          this.noticeTxt = this.lang.favRemoveNotice;
          this.otherDialogVisible = true;
          break;
        case "mark":
          this.comfirmTxt = this.lang.markRemoveConfirm;
          this.ttlTxt = this.lang.markRemove;
          this.dispatchTarget = "markRemoveCheck";
          this.noticeTxt = this.lang.markRemoveNotice;
          this.otherDialogVisible = true;
          break;
        case "local":
          this.comfirmTxt = this.lang.localRemoveConfirm;
          this.ttlTxt = this.lang.localRemove;
          this.dispatchTarget = "localRemoveCheck";
          this.noticeTxt = this.lang.localRemoveNotice;
          this.otherDialogVisible = true;
          break;
        default:
          return;
      }
      this.$ons.notification
        .confirm(this.comfirmTxt, {
          title: this.ttlTxt,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            this.$store.dispatch(this.dispatchTarget, this.targetId);
            this.$ons.notification
              .toast(this.noticeTxt, {
                timeout: 2000
              })
              .then(() => {
                this.comfirmTxt = "";
                this.ttlTxt = "";
                this.dispatchTarget = "";
                this.noticeTxt = "";
              });
          }
        });
      this.dialogVisible = false;
    }
  }
};
</script>