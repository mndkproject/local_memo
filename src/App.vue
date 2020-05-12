<template>
  <v-ons-navigator :page-stack="pageStack">
    <component
      :is="page"
      v-for="page in pageStack"
      :key="page.key"
      :page-stack="pageStack"
      :page="page"
    ></component>
  </v-ons-navigator>
</template>

<style>
.list,
.darkmode .list-header,
.darkmode .list-item__center {
  background-color: transparent;
  background-image: none;
}

.darkmode .list-item {
  color: #aaa;
}

.darkmode .toolbar,
.darkmode .card {
  background-color: #333;
  color: #aaa;
}

.darkmode .card__content {
  color: #aaa;
}

.darkmode .page__background {
  background-color: #222;
  color: #aaa;
}

.darkmode .alert-dialog {
  background-color: #222;
  color: #aaa;
}

.darkmode .dialog-container {
  background-color: #222;
  color: #aaa;
}

.darkmode .alert-dialog-title {
  color: #888;
}

.darkmode .alert-dialog-button {
  color: #888;
}

.darkmode .alert-dialog-content {
  color: #aaa;
}

.darkmode .search-input {
  background-color: #222;
  color: #aaa;
}

.darkmode #memo-list .list-item--memo {
  background-color: #3a3a3a;
  color: #aaa;
}

ons-fab.fab {
  background-color: #2779c0;
  color: #fafafa;
}

.darkmode .edit-area {
  background-color: #1a1a1a;
  color: #aaa;
}
</style>

<script>
import page1 from "./components/Page1";
import firebase from "firebase";

export default {
  data() {
    return {
      pageStack: [page1]
    };
  },
  mounted() {
    document.body.className = this.$store.state.memoData.themeColor
      ? "darkmode"
      : "";
  },
  destroyed() {
    this.$store.dispatch("snapshotCheck", "stop");
  },
  created() {
    this.$store.dispatch("isLoadCheck", true);
    this.$store.dispatch("loadCheck");

    //起動時とアカウント変更したら毎回呼び出される
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (
          user.providerData[0].providerId === "password" &&
          !user.emailVerified
        ) {
          console.log("仮認証中だよ");
          this.$store.dispatch("authAccountCheck", {
            signin: false,
            mail: user.email,
            provider: user.providerData[0].providerId,
            uid: user.uid
          });
        } else {
          console.log("ログインしてるよ");
          this.$store.dispatch("authAccountCheck", {
            signin: true,
            mail: user.email,
            provider: user.providerData[0].providerId,
            uid: user.uid
          });

          //クラウド同期処理
          if (this.$store.state.memoData.shareCloud) {
            this.$store.dispatch("snapshotCheck", "start");
          } else {
            this.$store.dispatch("isLoadCheck", false);
          }
        }
      } else {
        console.log("ログインしてないよ");
        this.$store.dispatch("authAccountCheck", {
          signin: false,
          mail: "",
          provider: ""
        });
        this.$store.dispatch("shareCloudCheck", false);
      }
      console.log(JSON.stringify(this.$store.state.memoData.authAccount));
    });

    //if (this.$ons.platform.isIPhone() || this.$ons.platform.isAndroid()) {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      var exitFlag = false;
      history.pushState(null, null, null);
      window.addEventListener("popstate", () => {
        if (this.pageStack.length > 1) {
          this.pageStack.pop();
          history.pushState(null, null, null);
        } else {
          if (exitFlag) {
            history.go(-2);
          } else {
            history.pushState(null, null, null);
            exitFlag = true;
            this.$ons.notification.toast("もう一度押すと終了します", {
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
      history.pushState(null, null, null);
      window.addEventListener("popstate", () => {
        if (this.pageStack.length > 1) {
          this.pageStack.pop();
          history.pushState(null, null, null);
        } else {
          history.go(-1);
          /*
          this.$ons.notification
            .confirm("ページを離脱してよろしいですか？", { title: "" })
            .then(response => {
              if (response) {
                history.go(-1);
              } else {
                history.pushState(null, null, null);
              }
            });
          */
        }
      });
    }
  }
};
</script>