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
      memoSort: { key: "updated_at", order: "desc" },
      filterColor: "",
      themeColor: "",
      shareCloud: false,
      selectLang: ""
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
    isProgress: false
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
    memoSortArr: (state) => {
      return Object.values(state.memoData.memoSort).join(',')
    },
    currentIndex: (state) => {
      return state.memoData.memoList.findIndex(el => el.id == state.currentId)
    }
  },
  mutations: {
    save(state) {
      var newDB = JSON.stringify(state.memoData);
      var oldDB = localStorage.local_memo ? localStorage.local_memo : "";
      if (state.memoData.shareCloud) {
        var newList = JSON.stringify(state.memoData.memoList);
        var oldList = localStorage.local_memo ? JSON.stringify(JSON.parse(localStorage.local_memo).memoList) : "";
        if (newList !== oldList) {
          firebase.firestore().collection("/memos").doc(state.fbAuth.uid)
            .set({ data: state.memoData.memoList })
            .then(() => {
              console.log("cloud save is dane.");
            })
            .catch(error => {
              console.log("Error : ", error);
            })
        }
      }
      if (newDB !== oldDB) {
        localStorage.local_memo = newDB;
        console.log("local save is dane.");
      } else {
        console.log("local change is none.");
      }
    },
    load(state, db) {
      if (db) {
        state.memoData = db;
      }
    },
    copyData(state, payload) {
      var ID = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
      state.memoData.memoList.push({
        id: ID,
        content: state.memoData.memoList[payload.currentIndex].content,
        create_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        labelColor: state.memoData.memoList[payload.currentIndex].labelColor,
        mark: state.memoData.memoList[payload.currentIndex].mark ? state.memoData.memoList[payload.currentIndex].mark : ""
      });
    },
    deleteData(state, payload) {
      if (state.memoData.memoList[payload.currentIndex].favorite) {
        state.memoData.memoList[payload.currentIndex].favorite = false;
      }
      state.memoData.memoList[payload.currentIndex].updated_at = new Date().getTime();
      Vue.set(state.memoData.memoList[payload.currentIndex], "delete", true);
      state.currentId = "";
    },
    restorationData(state, payload) {
      state.memoData.memoList[payload.currentIndex].updated_at = new Date().getTime();
      state.memoData.memoList[payload.currentIndex].delete = false;
    },
    erasureData(state, payload) {
      state.memoData.memoList[payload.currentIndex].updated_at = new Date().getTime();
      state.memoData.memoList[payload.currentIndex].content = "";
    },
    addData(state) {
      var ID = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
      state.memoData.memoList.push({
        id: ID,
        content: "",
        create_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        labelColor: state.memoData.filterColor !== "" ? state.memoData.filterColor : "transparent"
      });
      state.currentId = ID;
    },
    changeLabel(state, payload) {
      state.memoData.memoList[payload.currentIndex].labelColor = payload.color;
      state.memoData.memoList[payload.currentIndex].updated_at = new Date().getTime();
    },
    toggleFavorite(state, payload) {
      state.memoData.memoList[payload.currentIndex].updated_at = new Date().getTime();
      if (state.memoData.memoList[payload.currentIndex].favorite) {
        Vue.set(state.memoData.memoList[payload.currentIndex], "favorite", false);
      } else {
        Vue.set(state.memoData.memoList[payload.currentIndex], "favorite", true);
      }
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
    changeContent(state, payload) {
      state.memoData.memoList[payload.currentIndex].content = payload.newContent;
      state.memoData.memoList[payload.currentIndex].updated_at = new Date().getTime();
    },
    changeFilter(state, color) {
      state.memoData.filterColor = color;
    },
    filterRemove(state) {
      state.memoData.filterColor = "";
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
    contentSync(state, newData) {
      state.memoData.memoList = newData;
      firebase.firestore().collection("/memos").doc(state.fbAuth.uid)
        .set({ data: newData })
        .then(() => {
          console.log("cloud save is dane.");
        })
        .catch(error => {
          console.log("Error : ", error);
        })
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
    setMark(state, payload) {
      Vue.set(state.memoData.memoList[payload.currentIndex], "mark", payload.num);
    },
    otherPagePush(state, page) {
      state.otherPageMoved = page;
    },
    deletePop(state, targetId) {
      state.deletePop = targetId;
    },
    labelRemove(state) {
      state.memoData.memoList.forEach(item => {
        if (item.labelColor && item.labelColor !== "" && item.labelColor !== "transparent") {
          item.updated_at = new Date().getTime();
          item.labelColor = "";
        }
      });
    },
    favRemove(state) {
      state.memoData.memoList.forEach(item => {
        if (item.favorite && item.favorite === true) {
          item.updated_at = new Date().getTime();
          item.favorite = false;
        }
      });
    },
    markRemove(state) {
      state.memoData.memoList.forEach(item => {
        if (item.mark && item.mark !== "") {
          item.updated_at = new Date().getTime();
          item.mark = "";
        }
      });
    },
    localRemove(state) {
      state.memoData.memoList.forEach(item => {
        if (item.content !== "") {
          item.updated_at = new Date().getTime();
          if (item.favorite && item.favorite === true) {
            item.favorite = false;
          }
          Vue.set(item, "delete", true);
          item.content = "";
        }
      });
      state.currentId = "";
    },
    isProgressChange(state, boo) {
      state.isProgress = boo;
    }
  },
  actions: {
    loadCheck({ commit }) {
      var db = "";

      if (localStorage.local_memo) {
        if (JSON.parse(localStorage.local_memo.replace(',"["', ''))) {
          db = JSON.parse(localStorage.local_memo.replace(',"["', ''));

          //日付形式変更の対応用、公開時には消す
          db.memoList.forEach(item => {
            item.updated_at = new Date(item.updated_at).getTime();
            item.create_at = new Date(item.create_at).getTime();
          });
        }
      }

      if (db !== "") {
        commit('load', db);
      }
    },
    emptyCheck({ commit, state }) {
      var i = 0;
      state.memoData.memoList.forEach(item => {
        var payload = { currentIndex: i };
        if (item.content === "" && item.id !== state.currentId) {
          if (item.delete !== true) {
            commit('deleteData', payload);
          }
        }
        if (item.delete === true && new Date().getTime() - Number(item.updated_at) > 2592000000) {
          commit('erasureData', payload);
        }
        i++;
      });
      /*
      if (getters.currentIndex !== "" && getters.currentIndex !== -1) {
        if (state.memoData.memoList[getters.currentIndex].content === "") {
          var payload = { currentIndex: getters.currentIndex };
          commit('deleteData', payload);
          commit('save');
        }
      }
      */
    },
    copyCheck({ commit, state }, id) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === id);
      if (targetIndex) {
        commit('copyData', { currentIndex: targetIndex });
        commit('save');
      }
    },
    deleteCheck({ commit, state }, id) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === id);
      if (targetIndex) {
        commit('deleteData', { currentIndex: targetIndex });
        commit('save');
      }
    },
    restorationCheck({ commit, state }, id) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === id);
      if (targetIndex) {
        commit('restorationData', { currentIndex: targetIndex });
        commit('save');
      }
    },
    erasureCheck({ commit, state }, id) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === id);
      if (targetIndex) {
        commit('erasureData', { currentIndex: targetIndex });
        commit('save');
      }
    },
    addCheck({ commit, state, getters }) {
      if (!state.memoData.memoList[getters.currentIndex]) {
        commit('addData');
        commit('save');
      }
    },
    labelCheck({ commit, state }, get) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === get.id);
      if (targetIndex) {
        commit('changeLabel', { currentIndex: targetIndex, color: get.color });
        commit('save');
      }
    },
    favoriteCheck({ commit, state }, id) {
      var targetIndex = state.memoData.memoList.findIndex(item => item.id === id);
      if (targetIndex) {
        commit('toggleFavorite', { currentIndex: targetIndex });
        commit('save');
      }
    },
    idCheck({ commit }, id) {
      commit('changeId', id);
    },
    sortCheck({ commit }, sort) {
      if (sort.key && sort.order) {
        commit('changeSort', sort);
        commit('save');
      }
    },
    sizeCheck({ commit }, size) {
      if (size) {
        commit('changeSize', size);
        commit('save');
      }
    },
    contentCheck({ commit, getters }, newContent) {
      var payload = { currentIndex: getters.currentIndex, newContent: newContent };
      commit('changeContent', payload);
      commit('save');
    },
    filterCheck({ commit, state }, color) {
      if (state.memoData.memoList.filter(item => item.labelColor === color).length >= 0) {
        commit('changeFilter', color);
        commit('save');
      }
    },
    filterRemoveCheck({ commit, state }) {
      if (state.memoData.filterColor !== "") {
        commit('filterRemove');
        commit('save');
      }
    },
    searchCheck({ commit }, word) {
      commit('changeWordFilter', word);
    },
    themeCheck({ commit }, theme) {
      commit('changeTheme', theme);
      commit('save');
    },
    shareCloudCheck({ commit }, isShare) {
      commit('shareCloudChange', isShare);
      commit('save');
    },
    contentSyncCheck({ commit, state }, data) {
      var cloudData = data && data !== "" ? data.data : [];
      var update_flag = false;
      let localData = JSON.parse(JSON.stringify(state.memoData.memoList));
      Array.prototype.forEach.call(cloudData, cloudItem => {
        var tarId = cloudItem.id;
        var tarItem = localData.find(
          localItem => localItem.id === tarId
        );

        if (tarItem) {
          //日付形式変更対応用、後で消す
          tarItem.updated_at = new Date(tarItem.updated_at).getTime();
          tarItem.create_at = new Date(tarItem.create_at).getTime();

          var localIndex = localData.findIndex(
            localItem => localItem.id === tarId
          );
          var localUpdate = tarItem.updated_at;
          var cloudUpdate = cloudItem.updated_at;
          if (localUpdate > cloudUpdate) {
            update_flag = true;
          } else if (localUpdate < cloudUpdate) {
            localData[localIndex].content = cloudItem.content;
            localData[localIndex].labelColor = cloudItem.labelColor;
            localData[localIndex].mark = cloudItem.mark;
            localData[localIndex].updated_at = cloudItem.updated_at;
            if (cloudItem.delete) {
              localData[localIndex].delete = cloudItem.delete;
            }
            update_flag = true;
          }
        } else {
          localData.push(cloudItem);
          update_flag = true;
        }
      });
      Array.prototype.forEach.call(localData, resultLocalItem => {
        var resultTarId = resultLocalItem.id;
        var resultTarItem = cloudData.find(
          cloudItem => cloudItem.id === resultTarId
        );
        if (!resultTarItem) {
          update_flag = true;
        }
      });
      if (update_flag) {
        commit("contentSync", localData);
        commit('save');
        update_flag = false;
      }
    },
    snapshotCheck({ dispatch, state }, flag) {
      if (flag === "start") {
        if (this.snapshotState) {
          console.warn('It was already watched.', this.snapshotState)
          this.snapshotState()
          this.snapshotState = null
        }
        this.snapshotState = firebase
          .firestore().collection("/memos").doc(state.fbAuth.uid)
          .onSnapshot(data => {
            var source = data.metadata.hasPendingWrites ? "Local" : "Server";
            if (source === "Server") {
              dispatch('contentSyncCheck', data.data());
            }
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
          firebase.firestore().collection("/memos").doc(state.fbAuth.uid).get()
            .then(doc => {
              if (doc.exists) {
                dispatch("snapshotCheck", "stop");
                firebase.firestore().collection("/memos").doc(state.fbAuth.uid).delete()
                  .then(() => {
                    console.log("Document successfully deleted!");
                  })
                  .catch(error => {
                    console.error("Error removing document: ", error);
                  });
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
        firebase.auth().currentUser.verifyBeforeUpdateEmail(mail, actionCodeSettings).then(() => {
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
        firebase.auth().currentUser.updatePassword(pw).then(() => {
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
    setMarkCheck({ commit, getters }, num) {
      commit('setMark', { currentIndex: getters.currentIndex, num: num });
      commit('save');
    },
    otherPageMoveCheck({ commit }, page) {
      commit('changeId', "");
      commit('otherPagePush', page);
    },
    deletePopCheck({ commit }, targetId) {
      commit('deletePop', targetId);
    },
    langCheck({ commit }, lang) {
      if (lang) {
        commit('changeLang', lang);
        commit('save');
      }
    },
    labelRemoveCheck({ commit }) {
      commit('labelRemove');
      commit('save');
    },
    favRemoveCheck({ commit }) {
      commit('favRemove');
      commit('save');
    },
    markRemoveCheck({ commit }) {
      commit('markRemove');
      commit('save');
    },
    localRemoveCheck({ commit }) {
      commit('localRemove');
      commit('save');
    },
    isProgressCheck({ commit }, boo) {
      commit('isProgressChange', boo);
    }
  },
  modules: {
    lang,
  }
})
