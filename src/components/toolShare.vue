<template>
  <div class="side-item">
    <div
      class="side-item__btn"
      @click="shareDialogVisible = true"
      v-if="fbAuth.emailVerified === true"
    >
      <i class="zmdi zmdi-cloud" v-if="shareCloud"></i>
      <i class="zmdi zmdi-cloud-outline" :class="signinColor" v-else></i>
      <span>{{ lang.cloud }}</span>
    </div>

    <div class="side-item__btn side-item__btn--desabled" v-else>
      <i class="zmdi zmdi-cloud-outline" :class="signinColor"></i>
      <span :class="signinColor">{{ lang.cloud }}</span>
    </div>

    <v-ons-alert-dialog :visible.sync="shareDialogVisible" cancelable>
      <span slot="title">{{ lang.cloud }}</span>
      <v-ons-list>
        <v-ons-list-item>
          <label class="center" for="switch1">{{ cloudSwitch ? lang.sync : lang.syncNone }}</label>
          <div class="right">
            <v-ons-switch input-id="switch1" v-model="cloudSwitch" @click="checkShare"></v-ons-switch>
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="shareDialogVisible = false">{{ lang.close }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shareDialogVisible: false,
      cloudSwitch: false
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    fbAuth() {
      return this.$store.state.fbAuth;
    },
    shareCloud() {
      return this.$store.state.memoData.shareCloud;
    },
    signinColor() {
      return this.fbAuth.emailVerified ? "auth-signin" : "auth-signout";
    }
  },
  mounted() {
    this.cloudSwitch = this.shareCloud;
  },
  methods: {
    checkShare() {
      if (!this.shareCloud) {
        this.$ons.notification
          .confirm(this.lang.cloudConfirm, {
            title: this.lang.confirm,
            cancelable: true
          })
          .then(response => {
            if (response === 1) {
              this.$store.dispatch("shareCloudCheck", true);
              this.$store.dispatch("snapshotCheck", "start");
              this.$ons.notification.alert(this.lang.cloudStart, {
                title: this.lang.confirm,
                cancelable: true
              });
              this.shareDialogVisible = false;
            } else {
              this.cloudSwitch = false;
            }
          });
      } else {
        this.$ons.notification
          .confirm(this.lang.cloudConfirmStop, {
            title: this.lang.confirm,
            cancelable: true
          })
          .then(response => {
            if (response === 1) {
              this.$store.dispatch("shareCloudCheck", false);
              this.$store.dispatch("snapshotCheck", "stop");
              this.$ons.notification.alert(this.lang.cloudStop, {
                title: this.lang.confirm,
                cancelable: true
              });
              this.shareDialogVisible = false;
            } else {
              this.cloudSwitch = true;
            }
          });
      }
    }
  }
};
</script>