import Vue from 'vue'
import Vuex from 'vuex'
import _ from "lodash"
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { lang } from './modules/lang';

Vue.use(Vuex)
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  snapshotState: null,
  state: {
    memoData: {
      memoList: [],
      fontSize: "1",
      memoSort: { key: "create_at", order: "desc" },
      filterColor: "",
      themeColor: "",
      shareCloud: false,
      selectLang: "",
      syncAt: 0
    },
    currentId: "",
    labelColors: [
      "transparent",
      "#e91e63",
      "#ff5722",
      "#ffeb3b",
      "#8bc34a",
      "#03a9f4",
      "#673ab7"
    ],
    filterWord: "",
    fbAuth: {
      uid: "",
      email: "",
      emailVerified: "",
      providerId: "",
      reauthenticate: false
    },
    otherPageMoved: "",
    deletePop: "",
    isProgress: false,
    editAreaUpdateFlag: false
  },
  getters: {
    computedList: (state) => {
      var result = state.memoData.memoList;

      //Color filter
      if (state.memoData.filterColor !== "" && state.memoData.filterColor !== undefined) {
        result = result.filter(item => item.labelColor === state.memoData.filterColor)
      }

      //Word filter
      if (state.filterWord !== "") {
        var testWords = new RegExp(state.filterWord.split(/\s+/).join("|"), "m");
        result = result.filter(item => testWords.test(item.content))
      }

      //sort
      result = _.orderBy(result, state.memoData.memoSort.key, state.memoData.memoSort.order);

      //Favorite
      var favList = result.filter(item => item.favorite);
      var notFavList = result.filter(item => !item.favorite);
      return favList.concat(notFavList);
    },
    sortedList: (state, getters) => {
      //Exclusion delete
      return getters.computedList.filter(item => !item.delete);
    },
    deletedList: (state, getters) => {
      //Exclusion not delete
      return getters.computedList.filter(item => item.delete && item.content !== "");
    },
    currentIndex: (state) => {
      return state.memoData.memoList.findIndex(el => el.id == state.currentId)
    }
  },
  mutations: {
    save(state, targetId) {
      if (state.memoData.shareCloud) {
        const db = firebase.firestore();
        var localSyncList = [];
        var localSync = typeof state.memoData.syncAt === "number" ? state.memoData.syncAt : 0;

        if (targetId === "sync") {
          localSyncList = state.memoData.memoList.filter(item => item.updated_at > localSync);
        } else if (targetId) {
          var targetIndex = state.memoData.memoList.findIndex(item => item.id === targetId);
          if (state.memoData.memoList[targetIndex].updated_at > localSync) {
            localSyncList.push(state.memoData.memoList[targetIndex]);
          }
        }
        if (localSyncList.length > 0) {
          (async () => {
            try {
              const batch = db.batch();
              for (let i = 0; i < localSyncList.length; i++) {
                batch.set(
                  db.collection("memos").doc(state.fbAuth.uid).collection("data").doc(localSyncList[i].id),
                  localSyncList[i]
                )
              }
              batch.set(
                db.collection("memos").doc(state.fbAuth.uid),
                { syncAt: new Date().getTime() }
              )
              await batch.commit()
            } catch (err) {
              console.log(`Error: ${JSON.stringify(err)}`)
            }
          })()
        }
      }

      //ターゲットがなんであれローカル保存は一括でされる
      var newDB = JSON.stringify(state.memoData);
      var oldDB = localStorage.local_memo ? localStorage.local_memo : "";
      if (newDB !== oldDB) {
        localStorage.local_memo = newDB;
      }
    },
    load(state, db) {
      if (db) {
        state.memoData = db;
      }
    },
    addData(state, newId) {
      state.memoData.memoList.push({
        id: newId,
        content: "",
        title: "",
        create_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        labelColor: state.memoData.filterColor !== "" ? state.memoData.filterColor : "transparent",
        mark: "",
        delete: false,
        favorite: false
      });
    },
    copyData(state, payload) {
      var ID = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
      state.memoData.memoList.push({
        id: ID,
        content: state.memoData.memoList[payload.index].content,
        title: state.memoData.memoList[payload.index].content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
          .slice(0, 24),
        create_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        labelColor: state.memoData.memoList[payload.index].labelColor,
        mark: state.memoData.memoList[payload.index].mark ? state.memoData.memoList[payload.index].mark : "",
        delete: false,
        favorite: false
      });
    },
    restorationData(state, payload) {
      state.memoData.memoList[payload.index].updated_at = new Date().getTime();
      state.memoData.memoList[payload.index].delete = false;
    },
    deleteData(state, payload) {
      state.memoData.memoList[payload.index].updated_at = new Date().getTime();
      state.memoData.memoList[payload.index].delete = true;
    },
    erasureData(state, payload) {
      state.memoData.memoList[payload.index].updated_at = new Date().getTime();
      state.memoData.memoList[payload.index].content = "";
      state.memoData.memoList[payload.index].title = "";
      state.memoData.memoList[payload.index].favorite = false;
      state.memoData.memoList[payload.index].mark = "";
      state.memoData.memoList[payload.index].labelColor = "transparent";
      state.memoData.memoList[payload.index].delete = true;
    },
    changeLabel(state, payload) {
      state.memoData.memoList[payload.index].updated_at = new Date().getTime();
      state.memoData.memoList[payload.index].labelColor = payload.color;
    },
    toggleFavorite(state, payload) {
      state.memoData.memoList[payload.index].updated_at = new Date().getTime();
      state.memoData.memoList[payload.index].favorite = !state.memoData.memoList[payload.index].favorite;
    },
    setMark(state, payload) {
      state.memoData.memoList[payload.index].updated_at = new Date().getTime();
      state.memoData.memoList[payload.index].mark = payload.num;
    },
    changeContent(state, payload) {
      state.memoData.memoList[payload.index].updated_at = new Date().getTime();
      state.memoData.memoList[payload.index].content = payload.newContent;
      state.memoData.memoList[payload.index].title = payload.newTitle;
    },
    contentSync(state, cloudData) {
      var localIndex = state.memoData.memoList.findIndex(localItem => localItem.id === cloudData.id);

      /* ここから形式変更対応用、後で消す */
      cloudData.updated_at = new Date(cloudData.updated_at).getTime();
      cloudData.create_at = new Date(cloudData.create_at).getTime();
      /* ここまで形式変更対応用、後で消す */

      if (localIndex === -1) {
        state.memoData.memoList.push(cloudData);
      } else if (state.memoData.memoList[localIndex].updated_at < cloudData.updated_at) {
        state.memoData.memoList[localIndex].updated_at = cloudData.updated_at;
        state.memoData.memoList[localIndex].content = cloudData.content;
        state.memoData.memoList[localIndex].title = cloudData.title;
        state.memoData.memoList[localIndex].favorite = cloudData.favorite;
        state.memoData.memoList[localIndex].mark = cloudData.mark;
        state.memoData.memoList[localIndex].labelColor = cloudData.labelColor;
        state.memoData.memoList[localIndex].delete = cloudData.delete;
        if (cloudData.id === state.currentId) {
          state.editAreaUpdateFlag = true;
        }
      }
    },
    syncAtChange(state, time) {
      state.memoData.syncAt = time ? time : 0;
    },
    fbAuthChange(state, user) {
      if (user !== "") {
        state.fbAuth.uid = user.uid;
        state.fbAuth.email = user.email;
        state.fbAuth.emailVerified = user.emailVerified;
        state.fbAuth.providerId = user.providerData[0].providerId;
      } else {
        state.fbAuth.uid = "";
        state.fbAuth.email = "";
        state.fbAuth.emailVerified = "";
        state.fbAuth.providerId = "";
      }
    },
    reauthenticateGet(state) {
      state.fbAuth.reauthenticate = true;
    },
    changeId(state, id) {
      state.currentId = id;
    },
    changeSort(state, sort) {
      state.memoData.memoSort = sort;
    },
    changeSize(state, size) {
      state.memoData.fontSize = size;
    },
    changeLang(state, lang) {
      state.memoData.selectLang = lang;
    },
    changeFilter(state, color) {
      state.memoData.filterColor = color;
    },
    changeWordFilter(state, word) {
      state.filterWord = word;
    },
    changeTheme(state, theme) {
      state.memoData.themeColor = theme;
    },
    shareCloudChange(state, isShare) {
      state.memoData.shareCloud = isShare;
    },
    otherPagePush(state, page) {
      state.otherPageMoved = page;
    },
    deletePop(state, targetId) {
      state.deletePop = targetId;
    },
    isProgressChange(state, boo) {
      state.isProgress = boo;
    },
    editAreaUpdateReset(state) {
      state.editAreaUpdateFlag = false;
    }
  },
  actions: {
    loadCheck({ commit }) {
      const DB_PARSE = (localStorage.local_memo) ? JSON.parse(localStorage.local_memo.replace(',"["', '')) : "";
      let db = "";

      if (DB_PARSE !== "") {
        db = DB_PARSE;
      }

      /* ここから形式変更の対応用、公開時には消す */
      if (db.memoList) {
        db.memoList.forEach(item => {
          item.updated_at = new Date(item.updated_at).getTime();
          item.create_at = new Date(item.create_at).getTime();
          if (!Object.prototype.hasOwnProperty.call(item, "delete")) {
            item.delete = false;
          }
          if (!Object.prototype.hasOwnProperty.call(item, "mark")) {
            item.mark = "";
          }
          if (!Object.prototype.hasOwnProperty.call(item, "labelColor")) {
            item.labelColor = "transparent";
          }
          if (!Object.prototype.hasOwnProperty.call(item, "favorite")) {
            item.favorite = false;
          }
          if (!Object.prototype.hasOwnProperty.call(item, "title") && item.content) {
            item.title = item.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
              .slice(0, 24);
          }
        });
      }
      /* ここまで形式変更の対応用、公開時には消す */

      if (db !== "") {
        commit('load', db);
      }
    },
    addCheck({ commit, state, getters }) {
      if (!state.memoData.memoList[getters.currentIndex]) {
        var newId = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
        commit('addData', newId);
        commit('changeId', newId);
        commit('save', newId);
      }
    },
    copyCheck({ commit, state }, id) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === id);
      if (targetIndex) {
        commit('copyData', { index: targetIndex });
        commit('save', id);
      }
    },
    restorationCheck({ commit, state }, id) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === id);
      if (targetIndex) {
        commit('restorationData', { index: targetIndex });
        commit('save', id);
      }
    },
    deleteCheck({ commit, state }, id) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === id);
      if (targetIndex) {
        commit('deleteData', { index: targetIndex });
        commit('save', id);
        commit('changeId', "");
      }
    },
    erasureCheck({ commit, state }, id) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === id);
      if (targetIndex) {
        commit('erasureData', { index: targetIndex });
        commit('save', id);
      }
    },
    localRemoveCheck({ commit, state }) {
      state.memoData.memoList.forEach((item, index) => {
        if (item.content !== "") {
          commit('erasureData', { index: index });
        }
      });
      commit('syncAtChange', 0);
      commit('save', "sync");
      commit('changeId', "");
    },
    emptyCheck({ dispatch, state }) {
      state.memoData.memoList.forEach(item => {
        if (item.delete !== true && item.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "") === "" && item.id !== state.currentId) {
          dispatch('deleteCheck', item.id);
        }
        if (item.delete === true && new Date().getTime() - Number(item.updated_at) > 2592000000) {
          dispatch('erasureCheck', item.id);
        }
      });
    },
    labelCheck({ commit, state }, get) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === get.id);
      if (targetIndex) {
        commit('changeLabel', { index: targetIndex, color: get.color });
        commit('save', get.id);
      }
    },
    labelRemoveCheck({ commit, state }) {
      state.memoData.memoList.forEach((item, index) => {
        if (item.labelColor !== "" && item.labelColor !== "transparent") {
          commit('changeLabel', { index: index, color: "transparent" });
        }
      });
      commit('save', "sync");
    },
    favoriteCheck({ commit, state }, id) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === id);
      if (targetIndex) {
        commit('toggleFavorite', { index: targetIndex });
        commit('save', id);
      }
    },
    favRemoveCheck({ commit, state }) {
      state.memoData.memoList.forEach((item, index) => {
        if (item.favorite === true) {
          commit('toggleFavorite', { index: index });
        }
      });
      commit('save', "sync");
    },
    setMarkCheck({ commit, state, getters }, num) {
      commit('setMark', { index: getters.currentIndex, num: num });
      commit('save', state.currentId);
    },
    markRemoveCheck({ commit, state }) {
      state.memoData.memoList.forEach((item, index) => {
        if (item.mark !== "") {
          commit('setMark', { index: index, num: "" });
        }
      });
      commit('save', "sync");
    },
    contentCheck({ commit, state, getters }, newContent) {
      var payload = { index: getters.currentIndex, newContent: newContent.editContent, newTitle: newContent.editTitle };
      commit('changeContent', payload);
      commit('save', state.currentId);
    },
    snapshotCheck({ commit, state }, flag) {
      if (flag === "start") {
        if (this.snapshotState) {
          console.warn('It was already watched.', this.snapshotState)
          this.snapshotState()
          this.snapshotState = null
        }
        var db = firebase.firestore();
        var localSync = typeof state.memoData.syncAt === "number" ? state.memoData.syncAt : 0;
        this.snapshotState = db.collection("memos").doc(state.fbAuth.uid).collection("data").where("updated_at", ">", localSync)
          .onSnapshot(querySnapshot => {
            querySnapshot.forEach(queryDocSnapshot => {
              if (!queryDocSnapshot.metadata.hasPendingWrites) {
                commit('contentSync', queryDocSnapshot.data());
              }
            });
            (async () => {
              var cloudData = await db.collection("memos").doc(state.fbAuth.uid).get()
                .then(doc => {
                  if (!doc.exists) {
                    console.log('No such document!');
                  } else {
                    return doc.data();
                  }
                })
                .catch(err => {
                  console.log('Error getting document', err);
                });
              try {
                var cloudSync = await cloudData.syncAt;
              } catch (err) {
                console.log(`Error: ${JSON.stringify(err)}`)
                cloudSync = 0;
              }
              if (typeof cloudSync === "number") {
                commit('save', "sync");
                commit('syncAtChange', cloudSync);
                commit('save', false);
              }
            })()
          });
      } else if (flag === "stop") {
        if (this.snapshotState) {
          this.snapshotState()
          this.snapshotState = null
        }
      }
    },
    fbAuthCheck({ commit }, user) {
      commit('fbAuthChange', user);
    },
    reauthenticateCheck({ commit }, pw) {
      return new Promise(resolve => {
        var user = firebase.auth().currentUser;
        var credential = firebase.auth.EmailAuthProvider.credential(user.email, pw);
        user.reauthenticateWithCredential(credential).then(() => {
          commit('reauthenticateGet');
          resolve();
        }).catch(error => {
          resolve(error);
        });
      });
    },
    removeAuthCheck({ dispatch, commit, state }) {
      return new Promise(resolve => {
        if (state.fbAuth.reauthenticate) {
          //Cloud data deletion process
          const db = firebase.firestore();
          db.collection("memos").doc(state.fbAuth.uid).get()
            .then(doc => {
              if (doc.exists) {
                dispatch("shareCloudCheck", false);
                dispatch("snapshotCheck", "stop");

                (async () => {
                  try {
                    const batch = db.batch()
                    const listSplit = (array, n) => array.reduce((a, c, i) => i % n == 0 ? [...a, [c]] : [...a.slice(0, -1), [...a[a.length - 1], c]], []);
                    const deleteLists = listSplit(db.collection("memos").doc(state.fbAuth.uid).collection("data"), 500);
                    for (let i = 0; i < deleteLists.length; i++) {
                      deleteLists[i].foreach(data => {
                        batch.delete(data);
                      });
                      await batch.commit();
                    }
                    batch.delete(
                      db.collection("memos").doc(state.fbAuth.uid)
                    )
                    await batch.commit();

                    await db.app.delete();
                  } catch (err) {
                    console.log(`Error: ${JSON.stringify(err)}`)
                  }
                })()
              } else {
                console.log("No such document!");
              }
            })
            .catch(error => {
              console.log("Error getting document:", error);
            })
            .then(() => {
              //Authentication information deletion processing
              firebase.auth().currentUser.delete()
                .then(() => {
                  commit('fbAuthChange', "");
                  resolve();
                })
                .catch(error => {
                  console.log("An error happened:", error);
                });
            });
        } else {
          console.log("re-authenticate false");
        }
      });
    },
    changeEmailCheck({ commit }, mail) {
      return new Promise(resolve => {
        var actionCodeSettings = {
          url:
            process.env.NODE_ENV === "development"
              ? "http://localhost:8080"
              : "https://mndkproject.github.io/local_memo/",
          handleCodeInApp: true
        };
        firebase.auth().currentUser().verifyBeforeUpdateEmail(mail, actionCodeSettings).then(() => {
          commit('isProgressChange', false);
          resolve();
        }).catch(error => {
          commit('isProgressChange', false);
          resolve(error);
        });
      });
    },
    changePasswordCheck({ commit }, pw) {
      return new Promise(resolve => {
        firebase.auth().currentUser().updatePassword(pw).then(() => {
          commit('isProgressChange', false);
          resolve();
        }).catch(error => {
          commit('isProgressChange', false);
          resolve(error);
        });
      });
    },
    resetPasswordCheck({ commit }, mail) {
      return new Promise(resolve => {
        var actionCodeSettings = {
          url:
            process.env.NODE_ENV === "development"
              ? "http://localhost:8080"
              : "https://mndkproject.github.io/local_memo/",
          handleCodeInApp: true
        };
        firebase.auth().sendPasswordResetEmail(mail, actionCodeSettings).then(() => {
          commit('isProgressChange', false);
          resolve();
        }).catch(error => {
          commit('isProgressChange', false);
          resolve(error);
        });
      });
    },
    idCheck({ commit }, id) {
      commit('changeId', id);
    },
    sortCheck({ commit }, sort) {
      if (sort.key && sort.order) {
        commit('changeSort', sort);
        commit('save', false);
      }
    },
    sizeCheck({ commit }, size) {
      if (size) {
        commit('changeSize', size);
        commit('save', false);
      }
    },
    langCheck({ commit }, lang) {
      if (lang) {
        commit('changeLang', lang);
        commit('save', false);
      }
    },
    filterCheck({ commit, state }, color) {
      if (color === "" || state.labelColors.indexOf(color) !== -1) {
        commit('changeFilter', color);
        commit('save', false);
      }
    },
    searchCheck({ commit }, word) {
      commit('changeWordFilter', word);
    },
    themeCheck({ commit }, theme) {
      commit('changeTheme', theme);
      commit('save', false);
    },
    shareCloudCheck({ commit }, isShare) {
      commit('shareCloudChange', isShare);
      commit('save', false);
    },
    otherPageMoveCheck({ commit }, page) {
      commit('changeId', "");
      commit('otherPagePush', page);
    },
    deletePopCheck({ commit }, targetId) {
      commit('deletePop', targetId);
    },
    isProgressCheck({ commit }, boo) {
      commit('isProgressChange', boo);
    },
    editAreaUpdateResetCheck({ commit }) {
      commit("editAreaUpdateReset");
    }
  },
  modules: {
    lang,
  }
})
