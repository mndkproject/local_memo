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

    <div
      :class="isPC"
      class="edit-area"
      contenteditable="true"
      placeholder="edit..."
      :style="{ fontSize: fontSize + 'rem', borderColor: currentMemo.labelColor }"
      v-html="editnow"
      @input="inputAction"
      id="inputContent"
    ></div>
  </div>
</template>

<style>
#js-note {
  position: fixed;
  top: 44px;
  border-bottom: 5px solid transparent;
  z-index: 10;
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
  position: relative;
  margin: 0 auto;
  padding: 5px;
  padding-top: 44px;
  box-sizing: border-box;
  resize: none;
  width: 100%;
  max-width: 800px;
  height: 75vh;
  line-height: 1.8;
  border: none;
  border-top: 5px solid transparent;
  font: inherit;
  outline: 0;
  overflow-y: auto;
}

.edit-area p {
  position: relative;
  margin: 0;
  line-height: 1.8;
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

[contenteditable="true"]:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block;
  opacity: 0.5;
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

  .edit-link {
    cursor: pointer;
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
      return this.$store.state.editAreaUpdateFlag;
    },
    editContent() {
      return document.getElementById("inputContent");
    }
  },
  created() {
    this.debouncedGetContent = _.debounce(this.getContent, 1000);

    document.execCommand("DefaultParagraphSeparator", false, "p");
  },
  mounted() {
    this.editnow =
      this.currentMemo.content !== "" ? this.currentMemo.content : this.editnow;

    //paste
    this.editContent.addEventListener("paste", function() {
      var text = event.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      event.preventDefault();
    });

    var caretHeight = 0;
    var caretLines = 0;
    this.editContent.addEventListener("click", e => {
      //link
      if (e.path[0].className === "edit-link") {
        if (this.isPC) {
          window.open(e.path[0].href);
        } else {
          this.$ons.notification
            .confirm(this.lang.linkConfirm, {
              title: this.lang.confirm,
              cancelable: true
            })
            .then(res => {
              if (res === 1) {
                window.open(e.path[0].href);
              }
            });
        }
      }

      //caret
      var toolbarHeight = this.$ons.platform.isAndroid() ? 56 : 44;
      caretHeight = e.clientY;
      caretLines = Math.floor(
        (e.clientY -
          (this.editContent.getBoundingClientRect().top + toolbarHeight)) /
          28
      );
    });

    //caret
    var editorHeightDiff = 0;
    var editorHeight = this.editContent.getBoundingClientRect().height;
    window.addEventListener(
      "resize",
      () => {
        editorHeightDiff =
          editorHeight - this.editContent.getBoundingClientRect().height;
        editorHeight = this.editContent.getBoundingClientRect().height;
        if (editorHeightDiff > 0 && editorHeightDiff < caretHeight) {
          var scrollCalc = 28 * caretLines;
          document.getElementById("inputContent").scrollBy(0, scrollCalc);
        }
      },
      false
    );
  },
  watch: {
    currentIndex() {
      this.editnow = this.currentMemo.content;
    },
    editAreaUpdate() {
      this.editnow = this.editAreaUpdate
        ? this.currentMemo.content
        : this.editnow;
      this.$store.dispatch("editAreaUpdateResetCheck");
    }
  },
  methods: {
    getContent() {
      if (this.editContent.innerHTML !== this.currentMemo.content) {
        const linkCheck = function() {
          const anchor = new RegExp("a(?: .+?)?>");
          const urlReg = new RegExp(
            "((https://[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+))",
            "g"
          );
          if (
            this.innerHTML &&
            this.nodeName !== "A" &&
            this.innerHTML.indexOf("https://") !== -1
          ) {
            if (!anchor.test(this.innerHTML)) {
              this.innerHTML = this.innerHTML.replace(
                urlReg,
                '<a href="$1" target="_blank" class="edit-link">$1</a>'
              );
              var range = document.createRange();
              range.setStartAfter(this);
              var sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            }
          } else if (
            this.nodeName === "A" &&
            this.innerHTML.indexOf("https://") !== -1
          ) {
            const newUrl = this.innerHTML;
            this.setAttribute("href", newUrl);
            this.setAttribute("target", "_blank");
            this.className = "edit-link";
          } else if (this.nodeName === "A") {
            this.className = "edit-link";
          }
        };
        const DOMComb = (oParent, oCallback) => {
          if (oParent.hasChildNodes()) {
            for (
              let oNode = oParent.firstChild;
              oNode;
              oNode = oNode.nextSibling
            ) {
              if (
                (oNode.innerHTML === "" && oNode.nodeName !== "BR") ||
                (oNode.innerHTML && !oNode.innerHTML.length)
              ) {
                oNode.remove();
              } else {
                DOMComb(oNode, oCallback);
              }
            }
          }
          oCallback.call(oParent);
        };
        DOMComb(this.editContent, linkCheck);

        const editTitle = this.editContent.innerHTML
          .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
          .slice(0, 24);

        this.$store.dispatch("contentCheck", {
          editContent: this.editContent.innerHTML,
          editTitle: editTitle
        });
      }
    },
    inputAction() {
      this.debouncedGetContent();
    }
  },
  components: {
    toolInfo
  }
};
</script>