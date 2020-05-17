<template>
  <v-ons-page modifier="side-menu">
    <v-ons-list>
      <v-ons-list-item @click="toggleSide">
        <div class="right side-menu__close">
          <i class="zmdi zmdi-close-circle"></i>
          {{ lang.close }}
        </div>
      </v-ons-list-item>
      <v-ons-list-item>
        <tool-account></tool-account>
      </v-ons-list-item>
      <v-ons-list-item>
        <tool-share></tool-share>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="center" @click="pagePushTrash()">
          <div class="side-item">
            <div class="side-item__btn">
              <i class="zmdi zmdi-delete"></i>
              {{ lang.trashbox }}
            </div>
          </div>
        </div>
      </v-ons-list-item>
      <v-ons-list-item>
        <tool-theme></tool-theme>
      </v-ons-list-item>
      <v-ons-list-item>
        <tool-lang></tool-lang>
      </v-ons-list-item>
      <v-ons-list-item>
        <tool-other></tool-other>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="center">{{ lang.help }}</div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<style>
.side-menu__close {
  cursor: pointer;
}

.side-menu__close .zmdi-close-circle {
  margin-right: 0.5em;
  color: #aaa;
}

.side-item {
  width: 100%;
}

.side-item__btn {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.side-item__btn--desabled,
.side-item__btn--desabled .zmdi {
  cursor: default;
}

.side-item__btn .zmdi {
  margin-right: 0.5em;
  width: 22px;
  font-size: 22px;
  color: #1e88e5;
  text-align: center;
}
</style>

<script>
import toolTheme from "./toolTheme";
import toolAccount from "./toolAccount";
import toolShare from "./toolShare";
import toolLang from "./toolLang";
import toolOther from "./toolOther";

export default {
  props: ["toggleSide"],
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    }
  },
  methods: {
    pagePushTrash() {
      this.$emit("close-side");
      this.$store.dispatch("otherPagePushCheck", "trash");
    }
  },
  components: {
    toolTheme,
    toolAccount,
    toolShare,
    toolLang,
    toolOther
  }
};
</script>