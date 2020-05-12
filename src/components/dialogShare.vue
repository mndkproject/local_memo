<template>
  <div>
    <div v-if="isLoad">
      <v-ons-progress-circular indeterminate></v-ons-progress-circular>
    </div>
    <div v-else>
      <v-ons-toolbar-button @click="shareDialogVisible = true">
        <i class="zmdi zmdi-cloud" v-if="shareCloud"></i>
        <i class="zmdi zmdi-cloud-outline" :class="signinColor" v-else></i>
      </v-ons-toolbar-button>
    </div>

    <v-ons-alert-dialog :visible.sync="shareDialogVisible" cancelable>
      <span slot="title">Cloud</span>
      <template v-if="viewMode === 'success'">
        <ons-list>
          <ons-list-item>
            <label class="center" for="switch1">同期{{ cloudSwitch ? '中' : '解除中' }}</label>
            <div class="right">
              <v-ons-switch input-id="switch1" v-model="cloudSwitch" @click="checkShare"></v-ons-switch>
            </div>
          </ons-list-item>
        </ons-list>
        <p>
          {{ authAccount.mail }}でログイン中
          <br />
          （{{ authAccount.provider }}で認証）
        </p>
        <v-ons-button modifier="quiet" @click="signOutAuth">ログアウト</v-ons-button>
        <v-ons-button modifier="quiet" @click="removeAuth">認証情報をすべて削除</v-ons-button>
      </template>
      <template v-else-if="viewMode === 'email'">
        <p class="auth-decription">認証するメールアドレスと任意のパスワード（8文字以上）を入力してください。</p>
        <v-ons-list modifier="auth-select" key="auth-email">
          <v-ons-list-item modifier="nodivider">
            <div class="center">
              <v-ons-input
                placeholder="email"
                type="email"
                float
                v-model="inputEmail"
                @blur="checkEmail"
              ></v-ons-input>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider">
            <div class="center">
              <v-ons-input
                placeholder="password"
                float
                type="password"
                v-model="inputPassword"
                @blur="checkPassword"
              ></v-ons-input>
              <p v-if="mailErrorMsg" class="validation">{{ mailErrorMsg }}</p>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('email')">
              <div class="content">
                <i class="zmdi zmdi-email" style="color:#1e88e5;"></i>メールアドレスで認証
              </div>
            </v-ons-card>
          </v-ons-list-item>
        </v-ons-list>
        <p
          class="auth-decription"
        >初めて利用する場合は仮認証となり、メールアドレスの確認が必要になります。仮認証後に届く確認メールのリンクを開くことで認証が完了します。</p>
        <p v-if="signinEmail">{{ signinEmail }} で仮認証中</p>
      </template>
      <template v-else>
        <p class="auth-decription">他のデバイスでも使用できるように、データをクラウド上に保存することができます。認証方法を選んでください。</p>
        <v-ons-list modifier="auth-select" key="auth-select">
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('google')">
              <div class="content">
                <i class="zmdi zmdi-google" style="color:#dc5246;"></i>Google認証
              </div>
            </v-ons-card>
          </v-ons-list-item>
          <!--
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('facebook')">
              <div class="content">
                <i class="zmdi zmdi-facebook" style="color:#1774eb;"></i>Facebook認証
              </div>
            </v-ons-card>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('twitter')">
              <div class="content">
                <i class="zmdi zmdi-twitter" style="color:#1d9dec;"></i>Twitter認証
              </div>
            </v-ons-card>
          </v-ons-list-item>
          -->
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="emailAuth">
              <div class="content">
                <i class="zmdi zmdi-email" style="color:#1e88e5;"></i>メールアドレス認証
              </div>
            </v-ons-card>
          </v-ons-list-item>
        </v-ons-list>
      </template>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="emailAuthCancel">Cancel</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<style>
.auth-decription {
  font-size: 70%;
  line-height: 1.4;
}

.button--sendcheck:not(.button--material) {
  font-size: 100%;
}

.list--auth-select .list-item {
  padding-left: 0;
}

.list--auth-select .list-item .list-item__center {
  padding: 0;
}

.card--auth-item {
  width: 100%;
  margin: 2px 5px;
  padding: 0.5em 1em;
}

.list--auth-select .list-item i {
  width: 2em;
}

.validation {
  color: #ff5722;
  font-size: 70%;
  line-height: 1.4;
}

.cloud-signin {
  color: #1e88e5;
}

.cloud-signout {
  color: #ccc;
}
</style>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      shareDialogVisible: false,
      inputEmail: "",
      inputPassword: "",
      mailErrorMsg: "",
      isSelectEmailAuth: false,
      cloudSwitch: false
    };
  },
  computed: {
    signinEmail() {
      return this.$store.state.memoData.signinEmail;
    },
    authAccount() {
      return this.$store.state.memoData.authAccount;
    },
    shareCloud() {
      return this.$store.state.memoData.shareCloud;
    },
    isLoad() {
      return this.$store.state.isLoad;
    },
    signinColor() {
      return this.$store.state.memoData.authAccount.signin
        ? "cloud-signin"
        : "cloud-signout";
    },
    viewMode() {
      if (this.isSelectEmailAuth) {
        return "email";
      } else {
        return this.$store.state.memoData.authAccount.signin
          ? "success"
          : "init";
      }
    }
  },
  mounted() {
    //console.log(JSON.stringify(this.authAccount));
    this.cloudSwitch = this.shareCloud;
  },
  methods: {
    selectAuth(target) {
      if (target === "email") {
        if (this.inputEmail === "" || this.inputPassword === "") {
          this.mailErrorMsg = "入力してください。";
        }
        if (this.mailErrorMsg !== "") {
          return;
        }

        this.sendMailCheck();
      } else if (target === "google") {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(() => {
            this.$ons.notification.toast("Google認証でログインしました。", {
              timeout: 2000
            });
          })
          .catch(error => {
            alert(error.message);
          });
      }
    },
    emailAuth() {
      this.isSelectEmailAuth = true;
    },
    emailAuthCancel() {
      if (this.isSelectEmailAuth) {
        this.isSelectEmailAuth = false;
        this.inputPassword = "";
        this.inputEmail = "";
        this.mailErrorMsg = "";
      } else {
        this.shareDialogVisible = false;
      }
    },
    checkEmail() {
      var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,100}))$/;
      if (this.inputPassword !== "" && !pattern.test(this.inputEmail)) {
        this.mailErrorMsg = "正しいメールアドレスを入力してください。";
      } else {
        this.mailErrorMsg = "";
      }
    },
    checkPassword() {
      var pattern = /^[a-zA-Z0-9!-/:-@¥[-`{-~]{8,100}$/;
      if (this.inputPassword !== "" && !pattern.test(this.inputPassword)) {
        this.mailErrorMsg =
          "パスワードは半角記号英数字8文字以上にしてください。";
      } else {
        this.mailErrorMsg = "";
      }
    },
    sendMailCheck() {
      //アカウント作成済みか確認
      firebase
        .auth()
        .fetchSignInMethodsForEmail(this.inputEmail)
        .then(providers => {
          if (
            providers.findIndex(
              p =>
                p ===
                firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
            ) !== -1
          ) {
            //アカウント作成済み、パスワード照合
            firebase
              .auth()
              .signInWithEmailAndPassword(this.inputEmail, this.inputPassword)
              .then(() => {
                console.log(firebase.auth().currentUser.user.emailVerified);
                //メールリンク照合確認
                if (firebase.auth().currentUser.emailVerified) {
                  //照合完了
                  this.$ons.notification.toast(
                    "メールアドレス認証でログインしました。",
                    {
                      timeout: 2000
                    }
                  );
                  console.log("user login success.");
                } else {
                  //未認証、認証フローへ
                  this.mailLinkFlow();
                }
              })
              .catch(error => {
                var errorMessage =
                  error.message ===
                  "The email address is already in use by another account."
                    ? "このメールアドレスは既にほかのアカウントで使用されています。"
                    : " error: " + error.message;
                this.$ons.notification.toast(
                  "認証時にエラーがしました。" + errorMessage,
                  { timeout: 2000 }
                );
                console.log(error.message);
              });
          } else {
            //アカウント未作成、アカウント作成
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                this.inputEmail,
                this.inputPassword
              )
              .then(() => {
                //メールリンク照合確認
                if (firebase.auth().currentUser.emailVerified) {
                  //照合完了
                  this.$ons.notification.toast(
                    "メールアドレス認証でログインしました。",
                    {
                      timeout: 2000
                    }
                  );
                  console.log("user login success.");
                } else {
                  //未認証、認証フローへ
                  this.mailLinkFlow();
                }
              })
              .catch(error => {
                var errorMessage =
                  error.message ===
                  "The email address is already in use by another account."
                    ? "このメールアドレスは既にほかのアカウントで使用されています。"
                    : " error: " + error.message;
                this.$ons.notification.toast(
                  "認証時にエラーがしました。" + errorMessage,
                  { timeout: 2000 }
                );
                console.log(error.message);
              });
          }
        })
        .catch(error => {
          this.$ons.notification.toast(
            "認証時にエラーがしました。error: " + error.message,
            { timeout: 2000 }
          );
          console.log(error.message);
        });
    },
    mailLinkFlow() {
      this.$ons.notification
        .confirm(
          "まだメール認証は完了していません。認証を完了するために、入力したメールアドレスに確認メールを送信しますか？",
          { title: "確認", cancelable: true }
        )
        .then(response => {
          if (response === 1) {
            //確認メール送信
            var actionCodeSettings = {
              url: "https://mndkproject.github.io/local_memo/?type=signin",
              handleCodeInApp: true
            };
            firebase
              .auth()
              .sendSignInLinkToEmail(this.inputEmail, actionCodeSettings)
              .then(() => {
                //一時保存メールアドレス
                this.$store.dispatch("signinEmailCheck", this.inputEmail);
                this.$ons.notification.toast(
                  this.inputEmail +
                    "に確認メールを送信しました。確認メールのリンクからアクセスして認証を完了してください。",
                  { timeout: 2000 }
                );
              })
              .catch(error => {
                this.$ons.notification.toast(
                  "認証時にエラーがしました。error: " + error.message,
                  { timeout: 2000 }
                );
                console.log(error.message);
              });
          } else {
            this.$store.dispatch("signinEmailCheck", "");
            this.$ons.notification.toast(
              "メールアドレス認証をキャンセルしました。",
              { timeout: 2000 }
            );
          }
        });
    },
    mailLinkCheck() {
      //認証済みアカウントか確認
      firebase
        .auth()
        .fetchSignInMethodsForEmail(this.inputEmail)
        .then(providers => {
          if (
            providers.findIndex(
              p =>
                p === firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
            ) !== -1
          ) {
            //認証済み、パスワード検証へ
            this.sendMailCheck();
          } else {
            //未認証、認証フローへ
            this.mailLinkFlow();
          }
        })
        .catch(error => {
          this.$ons.notification.toast(
            "認証時にエラーがしました。error: " + error.message,
            { timeout: 2000 }
          );
          console.log(error.message);
        });
    },
    signOutAuth() {
      this.$ons.notification
        .confirm(
          "ログアウトするとクラウドの同期も解除されます。本当にログアウトしてよろしいですか？",
          {
            title: "確認",
            cancelable: true
          }
        )
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("snapshotCheck", "stop");
            firebase
              .auth()
              .signOut()
              .then(() => {
                this.$ons.notification.alert("ログアウトしました。", {
                  title: "確認",
                  cancelable: true
                });
                this.shareDialogVisible = false;
              })
              .catch(error => {
                this.$ons.notification.alert(
                  "ログアウト時にエラーが発生しました。",
                  {
                    title: "確認",
                    cancelable: true
                  }
                );
                console.log(`ログアウト時にエラーが発生しました (${error})`);
              });
          }
        });
    },
    removeAuth() {
      this.$ons.notification
        .confirm(
          "認証情報を削除するとクラウドに保存されているデータがすべて削除されます。この操作はもとに戻せません。本当に解除してよろしいですか？",
          {
            title: "確認",
            cancelable: true
          }
        )
        .then(response => {
          if (response === 1) {
            var user = firebase.auth().currentUser;
            if (user != null) {
              //クラウドデータ削除処理
              firebase
                .firestore()
                .collection("/memos")
                .doc(user.uid)
                .get()
                .then(doc => {
                  if (doc.exists) {
                    this.$store.dispatch("snapshotCheck", "stop");
                    firebase
                      .firestore()
                      .collection("/memos")
                      .doc(user.uid)
                      .delete()
                      .then(() => {
                        console.log("Document successfully deleted!");
                      })
                      .catch(error => {
                        console.error("Error removing document: ", error);
                      });
                  } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                  }
                })
                .catch(error => {
                  console.log("Error getting document:", error);
                });
              //認証情報削除処理
              user
                .delete()
                .then(() => {
                  console.log("User successfully deleted!");
                })
                .catch(error => {
                  console.log("An error happened:", error);
                });
              this.$ons.notification.alert("認証情報をすべて削除しました。", {
                title: "確認",
                cancelable: true
              });
              this.shareDialogVisible = false;
            } else {
              console.log("No such user!");
            }
          }
        });
    },
    checkShare() {
      if (!this.shareCloud) {
        this.$ons.notification
          .confirm(
            "同期を開始すると更新日時の新しいデータで上書きされます。同期を開始してよろしいですか？",
            {
              title: "確認",
              cancelable: true
            }
          )
          .then(response => {
            if (response === 1) {
              this.$store.dispatch("shareCloudCheck", true);
              //クラウド同期処理
              this.$store.dispatch("isLoadCheck", true);
              this.$store.dispatch("snapshotCheck", "start");
              this.$ons.notification.alert("同期を開始しました。", {
                title: "確認",
                cancelable: true
              });
              this.shareDialogVisible = false;
            } else {
              this.cloudSwitch = false;
            }
          });
      } else {
        this.$ons.notification
          .confirm(
            "同期を解除すると他のデバイスとの共有ができなくなります。本当に解除してよろしいですか？",
            {
              title: "確認",
              cancelable: true
            }
          )
          .then(response => {
            if (response === 1) {
              this.$store.dispatch("shareCloudCheck", false);
              this.$store.dispatch("snapshotCheck", "stop");
              this.$ons.notification.alert("同期を解除しました。", {
                title: "確認",
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