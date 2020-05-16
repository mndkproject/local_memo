<template>
  <div class="side-item">
    <div class="side-item__btn" @click="accountDialogVisible = true">
      <i class="zmdi zmdi-account" :class="signinColor"></i>
      {{ lang.account }}
    </div>

    <v-ons-alert-dialog :visible.sync="accountDialogVisible" cancelable>
      <span slot="title">Account</span>
      <template v-if="viewMode === 'emailChange'">
        <p class="auth-decription">{{ lang.decriptionChangeMail }}</p>
        <v-ons-list>
          <v-ons-list-item modifier="nodivider">
            <div class="center">
              <v-ons-input
                placeholder="email"
                type="email"
                float
                v-model="inputChangeEmail"
                @blur="checkEmail"
              ></v-ons-input>
              <p v-if="mailErrorMsg" class="validation">{{ mailErrorMsg }}</p>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="sendMailChangeCheck()">
              <div class="content">
                <i class="zmdi zmdi-email" style="color:#1e88e5;"></i>
                {{ lang.authEmail }}
              </div>
            </v-ons-card>
          </v-ons-list-item>
        </v-ons-list>
      </template>
      <template v-if="viewMode === 'success'">
        <p style="padding: 1em;">
          {{ lang.loggingIn }}:
          <br />
          {{ fbAuth.email }}
        </p>
        <v-ons-button
          modifier="large"
          style="margin-bottom:2em;"
          @click="signOutAuth"
        >{{ lang.logout }}</v-ons-button>
        <v-ons-button modifier="quiet large" @click="changeAuthMail">{{ lang.changeEmail }}</v-ons-button>
        <v-ons-button modifier="quiet large" @click="removeAuth">{{ lang.removeAuth }}</v-ons-button>
      </template>
      <template v-if="viewMode === 'emailVerify'">
        <p>
          {{ lang.verifyProgress }}:
          <br />
          {{ fbAuth.email }}
        </p>
        <v-ons-list modifier="auth-select" key="send-email">
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="mailLinkFlow(fbAuth.email)">
              <div class="content">
                <i class="zmdi zmdi-email" style="color:#1e88e5;"></i>
                {{ lang.sendEmailAgain }}
              </div>
            </v-ons-card>
          </v-ons-list-item>
        </v-ons-list>
        <v-ons-button modifier="quiet">{{ lang.stopProgress }}</v-ons-button>
      </template>
      <template v-if="viewMode === 'email'">
        <p class="auth-decription">{{ lang.decriptionRegisterMail }}</p>
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
                <i class="zmdi zmdi-email" style="color:#1e88e5;"></i>
                {{ lang.authEmail }}
              </div>
            </v-ons-card>
          </v-ons-list-item>
        </v-ons-list>
        <p class="auth-decription">{{ lang.decriptionNoticeMail }}</p>
      </template>
      <template v-if="viewMode === 'init'">
        <p class="auth-decription">{{ lang.decriptionAuthInit }}</p>
        <v-ons-list modifier="auth-select" key="auth-select">
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('google')">
              <div class="content">
                <i class="zmdi zmdi-google" style="color:#dc5246;"></i>
                {{ lang.authWithGoogle }}
              </div>
            </v-ons-card>
          </v-ons-list-item>
          <!--
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('facebook')">
              <div class="content">
                <i class="zmdi zmdi-facebook" style="color:#1774eb;"></i>{{ lang.authWithFacebook }}
              </div>
            </v-ons-card>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('twitter')">
              <div class="content">
                <i class="zmdi zmdi-twitter" style="color:#1d9dec;"></i>{{ lang.authWithTwitter }}
              </div>
            </v-ons-card>
          </v-ons-list-item>
          -->
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="emailAuth">
              <div class="content">
                <i class="zmdi zmdi-email" style="color:#1e88e5;"></i>
                {{ lang.authWithEmail }}
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
  cursor: pointer;
}

.list--auth-select .list-item i {
  width: 2em;
}

.validation {
  color: #ff5722;
  font-size: 70%;
  line-height: 1.4;
}

.side-item__btn .zmdi.auth-signin {
  color: #1e88e5;
}

.side-item__btn .zmdi.auth-signout {
  color: #ccc;
}
</style>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      accountDialogVisible: false,
      inputEmail: "",
      inputPassword: "",
      mailErrorMsg: "",
      isSelectEmailAuth: false,
      inputChangeEmail: "",
      isChangeAuthMail: ""
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    fbAuth() {
      return this.$store.state.fbAuth;
    },
    signinColor() {
      return this.fbAuth.emailVerified ? "auth-signin" : "auth-signout";
    },
    viewMode() {
      if (this.isChangeAuthMail) {
        return "emailChange";
      } else if (this.fbAuth.emailVerified) {
        return "success";
      } else if (this.fbAuth.email !== "") {
        return "emailVerify";
      } else if (this.isSelectEmailAuth) {
        return "email";
      } else {
        return "init";
      }
    }
  },
  methods: {
    selectAuth(target) {
      if (target === "email") {
        if (this.inputEmail === "" || this.inputPassword === "") {
          this.mailErrorMsg = this.lang.inputCheckEmpty;
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
            this.$ons.notification.toast(this.lang.loggedInGoogle, {
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
    changeAuthMail() {
      this.isChangeAuthMail = true;
    },
    emailAuthCancel() {
      if (this.isChangeAuthMail) {
        this.isChangeAuthMail = false;
        this.mailErrorMsg = "";
      } else if (this.isSelectEmailAuth) {
        this.isSelectEmailAuth = false;
        this.mailErrorMsg = "";
      } else {
        this.accountDialogVisible = false;
      }
    },
    checkEmail() {
      var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,100}))$/;
      if (this.inputPassword !== "" && !pattern.test(this.inputEmail)) {
        this.mailErrorMsg = this.lang.inputCheckEmail;
      } else {
        this.mailErrorMsg = "";
      }
    },
    checkPassword() {
      var pattern = /^[a-zA-Z0-9!-/:-@¥[-`{-~]{8,100}$/;
      if (this.inputPassword !== "" && !pattern.test(this.inputPassword)) {
        this.mailErrorMsg = this.lang.inputCheckPassword;
      } else {
        this.mailErrorMsg = "";
      }
    },
    sendMailChangeCheck() {
      console.log("変えるよ！");
    },
    sendMailCheck() {
      //Check if an account has been created
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
            //Account created, password verification
            firebase
              .auth()
              .signInWithEmailAndPassword(this.inputEmail, this.inputPassword)
              .then(result => {
                //Check email link verification
                if (result.user.emailVerified) {
                  //Verification completed
                  this.$ons.notification.toast(this.lang.loggedInEmail, {
                    timeout: 2000
                  });
                  console.log("user login success.");
                } else {
                  //Unauthenticated, to authentication flow
                  this.mailLinkFlow(this.inputEmail);
                }
              })
              .catch(error => {
                var errorMessage = " error: " + error.message;
                this.$ons.notification.toast(errorMessage, { timeout: 2000 });
                console.log(error.message);
              })
              .then(() => {});
          } else {
            //Account not created, account created
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                this.inputEmail,
                this.inputPassword
              )
              .then(() => {
                //Unauthenticated, to authentication flow
                this.mailLinkFlow(this.inputEmail);
              })
              .catch(error => {
                var errorMessage = " error: " + error.message;
                this.$ons.notification.toast(errorMessage, { timeout: 2000 });
                console.log(error.message);
              });
          }
        })
        .catch(error => {
          this.$ons.notification.toast("error: " + error.message, {
            timeout: 2000
          });
          console.log(error.message);
        });
    },
    mailLinkFlow(mail) {
      this.$ons.notification
        .confirm(this.lang.sendEmailConfirm, {
          title: this.lang.confirm,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            //Send confirmation email
            var actionCodeSettings = {
              url:
                process.env.NODE_ENV === "development"
                  ? "http://localhost:8080"
                  : "https://mndkproject.github.io/local_memo/",
              handleCodeInApp: true
            };
            firebase
              .auth()
              .currentUser.sendEmailVerification(actionCodeSettings)
              .then(() => {
                this.$ons.notification.toast(mail + this.lang.sendEmailNotice, {
                  timeout: 2000
                });
              })
              .catch(error => {
                this.$ons.notification.toast("error: " + error.message, {
                  timeout: 2000
                });
                console.log(error.message);
              });
          } else {
            this.$ons.notification.toast(this.lang.sendEmailCancel, {
              timeout: 2000
            });
          }
        });
    },
    signOutAuth() {
      this.$ons.notification
        .confirm(this.lang.logoutConfirm, {
          title: this.lang.confirm,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("shareCloudCheck", false);
            this.$store.dispatch("snapshotCheck", "stop");
            firebase
              .auth()
              .signOut()
              .then(() => {
                this.$ons.notification.alert(this.lang.loggedOut, {
                  title: this.lang.confirm,
                  cancelable: true
                });
                this.accountDialogVisible = false;
              })
              .catch(error => {
                this.$ons.notification.alert("error: " + error.message, {
                  title: this.lang.confirm,
                  cancelable: true
                });
              });
          }
        });
    },
    removeAuth() {
      this.$ons.notification
        .confirm(this.lang.removeAuthConfirm, {
          title: this.lang.confirm,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            //ここに再認証入れる
            this.$store.dispatch("removeAuthCheck").then(() => {
              this.$ons.notification.alert(this.lang.removeAuthNotice, {
                title: this.lang.confirm,
                cancelable: true
              });
              this.accountDialogVisible = false;
            });
          }
        });
    }
  }
};
</script>