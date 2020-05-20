<template>
  <v-ons-splitter>
    <v-ons-splitter-side
      :page-stack="pageStack"
      width="240px"
      collapse
      side="left"
      :open.sync="openSide"
      id="menu"
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
.radio-button__input,
ons-fab.fab {
  cursor: pointer;
}

.list,
.list-header,
.list-item,
.list-item__left,
.list-item__right,
.list-item__center {
  background-color: transparent;
  background-image: none;
}

.alert-dialog-content {
  max-height: 50vh;
  overflow-y: auto;
  text-align: left;
}

.alert-dialog-content .list .list-item {
  margin: 0;
}

.zmdi {
  font-size: 22px;
}

ons-fab.fab .zmdi {
  font-size: 25px;
}

#memo-list .list-item--memo .zmdi {
  font-size: inherit;
}

ons-input .text-input {
  color: inherit;
  background: none;
}

/* desktop */
@media screen and (min-width: 640px) {
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 50, 0.5);
    border-radius: 10px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
  }

  .alert-dialog-content {
    scrollbar-width: thin;
  }
}
</style>

<script>
import index from "./view/Index";
import Side from "./components/Side";
import firebase from "firebase/app";
import "firebase/auth";

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
    },
    isPC() {
      return !this.$ons.platform.isIPhone() &&
        !this.$ons.platform.isAndroid() &&
        window.innerWidth >= 640
        ? true
        : false;
    }
  },
  mounted() {
    //theme color setting
    document.body.className = this.$store.state.memoData.themeColor
      ? this.$store.state.memoData.themeColor
      : "";

    if (!this.isPC) {
      document.getElementById("menu").setAttribute("swipeable", "");
    }
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
          //Cloud synchronization processing
          if (this.$store.state.memoData.shareCloud) {
            this.$store.dispatch("snapshotCheck", "start");
          }
        }
      } else {
        this.$store.dispatch("fbAuthCheck", "");
        this.$store.dispatch("shareCloudCheck", false);
      }
    });

    //poptate setting
    window.addEventListener("popstate", () => {
      if (this.openSide) {
        this.toggleSide();
        return;
      }
      if (this.pageStack.length > 1) {
        this.pageStack.pop();
      }
    });
  },
  methods: {
    toggleSide() {
      this.openSide = !this.openSide;
    }
  },
  watch: {
    pageStack() {
      var elem = document.getElementById("menu");
      if (this.pageStack.length > 1) {
        elem.removeAttribute("swipeable");
      } else if (!this.isPC) {
        elem.setAttribute("swipeable", "");
      }
    }
  },
  components: { Side }
};
</script>