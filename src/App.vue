<template>
  <v-ons-splitter>
    <v-ons-splitter-side
      :page-stack="pageStack"
      width="240px"
      collapse
      side="left"
      :open.sync="openSide"
    >
      <side :toggleSide="toggleSide" @close-side="toggleSide"></side>
    </v-ons-splitter-side>

    <v-ons-splitter-content>
      <v-ons-navigator :page-stack="pageStack">
        <component
          :is="page"
          v-for="page in pageStack"
          :key="page.key"
          :page-stack="pageStack"
          :page="page"
          :toggleSide="toggleSide"
        ></component>
      </v-ons-navigator>
    </v-ons-splitter-content>
  </v-ons-splitter>
</template>

<style>
@import "./style/theme.css";

.zmdi,
.alert-dialog-button,
.switch__toggle,
.button,
.radio-button,
.radio-button__input {
  cursor: pointer;
}

.list,
.list-header,
.list-item__left,
.list-item__right,
.list-item__center {
  background-color: transparent;
  background-image: none;
}

/* success color */
.mark-icon,
.is-mark {
  color: #37b576;
}

/* background color */
.page__background {
  background-color: #efeff4;
}

/* base color */
.page--side-menu__background {
  background-color: #fafafa;
}

.edit-area {
  background-color: #fafafa;
}

.alert-dialog-content {
  max-height: 50vh;
  overflow-y: auto;
  text-align: left;
}

.alert-dialog-content .list .list-item {
  margin: 0;
}

ons-fab.fab {
  background-color: #0076ff;
  color: #fff;
  cursor: pointer;
}

.search-input {
  background-color: #fafafa;
}
</style>

<script>
import index from "./view/Index";
import Side from "./components/Side";
import firebase from "firebase";

export default {
  data() {
    return {
      pageStack: [index],
      openSide: false
    };
  },
  computed: {
    fbAuth() {
      return this.$store.state.fbAuth;
    },
    lang() {
      return this.$store.getters["lang/currentLang"];
    }
  },
  mounted() {
    //theme color setting
    document.body.className = this.$store.state.memoData.themeColor
      ? "darkmode"
      : "";
  },
  destroyed() {
    this.$store.dispatch("snapshotCheck", "stop");
  },
  created() {
    this.$store.dispatch("loadCheck");

    //Called every time at startup and after changing account
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("fbAuthCheck", user);
        if (
          this.fbAuth &&
          this.fbAuth.providerId === "password" &&
          !this.fbAuth.emailVerified
        ) {
          console.log("Temporary certification in progress");
        } else {
          console.log("Logging in");

          //Cloud synchronization processing
          if (this.$store.state.memoData.shareCloud) {
            this.$store.dispatch("snapshotCheck", "start");
          }
        }
      } else {
        this.$store.dispatch("fbAuthCheck", "");
        console.log("Not logged in");
        this.$store.dispatch("shareCloudCheck", false);
      }
    });

    //poptate setting
    //if (this.$ons.platform.isIPhone() || this.$ons.platform.isAndroid()) {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      var exitFlag = false;
      window.addEventListener("popstate", () => {
        if (this.pageStack.length > 1) {
          history.pushState(null, null, null);
          this.pageStack.pop();
        } else {
          if (exitFlag) {
            history.go(-1);
          } else {
            history.pushState(null, null, null);
            exitFlag = true;
            this.$ons.notification.toast(this.lang.noticeClose, {
              timeout: 2000,
              callback: function(e) {
                if (e === -1) {
                  exitFlag = false;
                }
              }
            });
          }
        }
      });
    } else {
      window.addEventListener("popstate", () => {
        if (this.pageStack.length > 1) {
          this.pageStack.pop();
        }
      });
    }
  },
  methods: {
    toggleSide() {
      this.openSide = !this.openSide;
    }
  },
  components: { Side }
};
</script>