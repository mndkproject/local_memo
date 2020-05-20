<template>
  <div class="edit-box">
    <div class="info-area" id="js-note" :style="{ borderColor: currentMemo.labelColor }">
      <p
        class="update-note"
      >{{ lang.update }}: {{ (new Date(currentMemo.updated_at)).toLocaleString() }}</p>
      <p class="text-count">
        <i class="zmdi zmdi-check-circle mark-icon" v-if="isMark"></i>
        {{ lang.total }}
        <span :class="markClass">{{ chars }}</span>
        {{ markNum ? "/"+markNum : "" }} ({{ lines }}{{ lang.line }} {{ sheets }}{{ lang.sheet }})
        <tool-info></tool-info>
      </p>
    </div>

    <textarea
      :class="isPC"
      class="edit-area"
      v-model="editnow"
      placeholder="edit..."
      :style="{ fontSize: fontSize + 'rem', borderColor: currentMemo.labelColor }"
    ></textarea>
  </div>
</template>

<style>
#js-note {
  position: fixed;
  top: 44px;
  border-bottom: 5px solid transparent;
}

.page--material__content #js-note {
  top: 56px;
}

.info-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 0 1em;
  width: 100%;
  max-width: calc(800px + 2em);
  font-size: 60%;
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 0;
}

.text-count {
  display: flex;
  align-items: center;
  line-height: 1.2;
}

.text-count .toolbar-button {
  padding-right: 0;
  font-size: 22px;
}

.edit-area {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding: 5px;
  padding-top: 44px;
  box-sizing: border-box;
  resize: none;
  width: 100%;
  max-width: 800px;
  height: 75vh;
  line-height: 1.6;
  border: none;
  border-top: 5px solid transparent;
  font: inherit;
}

.page--material__content .edit-area {
  padding-top: 56px;
}

.edit-area--pc {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
}

.zmdi.mark-icon {
  margin-right: 4px;
  cursor: default;
  font-size: inherit;
}

/* desktop */
@media screen and (min-width: 640px) {
  #js-note {
    position: static;
    border-bottom: none;
  }

  .info-area {
    font-size: 80%;
  }

  .edit-area,
  .page--material__content .edit-area {
    padding-top: 5px;
    padding-bottom: 10px;
    scrollbar-width: thin;
  }
}
</style>

<script>
import toolInfo from "./toolInfo";
import _ from "lodash";

export default {
  data() {
    return {
      editnow: ""
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    currentIndex() {
      return this.$store.getters.currentIndex;
    },
    currentMemo() {
      return this.$store.state.memoData.memoList[
        this.$store.getters.currentIndex
      ];
    },
    fontSize() {
      return this.$store.state.memoData.fontSize;
    },
    chars() {
      return String(this.currentMemo.content.length);
    },
    lines() {
      return this.currentMemo.content.split("\n").length;
    },
    sheets() {
      var text = String(this.currentMemo.content);
      var lines = 0;

      var textArray = text.split("\n");

      textArray.forEach(t => {
        if (t.length === 0) {
          lines += 1;
        } else {
          t = t.slice(0, 1) === ("　" || "「") ? t : "　" + t;
          t = t
            .replace("。」", "」")
            .replace(/(\d{2})/g, "0")
            .replace(/[a-zA-Z]{2}/g, "a");

          let start = 0;
          let end = start + 21;
          while (start < t.length) {
            lines++;
            start = t.slice(-1) === ("。" || "、" || "」") ? end : end - 1;
            end = start + 21;
          }
        }
      });

      return ((lines / 20) | 0) + 1;
    },
    isPC() {
      return !this.$ons.platform.isIPhone() &&
        !this.$ons.platform.isAndroid() &&
        window.innerWidth >= 640
        ? true
        : false;
    },
    markNum() {
      return this.currentMemo.mark ? this.currentMemo.mark : "";
    },
    isMark() {
      return (
        this.markNum && this.markNum !== "" && this.chars > Number(this.markNum)
      );
    },
    markClass() {
      return this.isMark ? "is-mark" : "";
    },
    editAreaUpdate() {
      return this.$store.state.editAreaUpdate;
    }
  },
  created() {
    this.debouncedGetContent = _.debounce(this.getContent, 500);
  },
  mounted() {
    this.editnow = this.currentMemo.content;
  },
  watch: {
    editnow() {
      this.debouncedGetContent();
    },
    currentIndex() {
      this.editnow = this.currentMemo.content;
    },
    editAreaUpdate() {
      this.editnow = this.editAreaUpdate
        ? this.currentMemo.content
        : this.editnow;
    }
  },
  methods: {
    getContent() {
      if (this.editnow !== this.currentMemo.content) {
        this.$store.dispatch("contentCheck", this.editnow);
      }
    }
  },
  components: {
    toolInfo
  }
};
</script>