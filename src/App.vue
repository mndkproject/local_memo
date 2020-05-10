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

.darkmode .toolbar {
  background-color: #333;
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

.darkmode ons-fab.fab {
  background-color: #2779c0;
  color: #aaa;
}

.darkmode .edit-area {
  background-color: #1a1a1a;
  color: #aaa;
}
</style>

<script>
import page1 from "./components/Page1";

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
  created() {
    this.$store.dispatch("loadCheck");

    this.$store.subscribe((mutation, state) => {
      if (mutation.type !== "changeId") {
        var newDB = JSON.stringify(state.memoData);
        var oldDB = localStorage.local_memo ? localStorage.local_memo : "";

        if (newDB !== oldDB) {
          localStorage.local_memo = newDB;
        }
      }
    });

    var me = this;
    //if (this.$ons.platform.isIPhone() || this.$ons.platform.isAndroid()) {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      var exitFlag = false;
      history.pushState(null, null, null);
      window.addEventListener("popstate", function() {
        if (me.pageStack.length > 1) {
          me.pageStack.pop();
          history.pushState(null, null, null);
        } else {
          if (exitFlag) {
            history.go(-2);
          } else {
            history.pushState(null, null, null);
            exitFlag = true;
            me.$ons.notification.toast("もう一度押すと終了します", {
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
      window.addEventListener("popstate", function() {
        if (me.pageStack.length > 1) {
          me.pageStack.pop();
          history.pushState(null, null, null);
        } else {
          history.go(-1);
          /*
          me.$ons.notification
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