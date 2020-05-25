<template>
  <div class="side-item">
    <div class="side-item__btn" @click="accountDialogVisible = true">
      <i class="zmdi zmdi-account" :class="signinColor"></i>
      {{ lang.account }}
    </div>

    <v-ons-alert-dialog modifier="auth-item" :visible.sync="accountDialogVisible" cancelable>
      <span slot="title">{{ lang.account }}</span>
      <template v-if="viewMode === 'emailChange'">
        <p class="auth-decription">{{ lang.decriptionChangeMail }}</p>
        <v-ons-list key="email-change">
          <v-ons-list-item modifier="nodivider" style="padding: 0;">
            <div class="center">
              <v-ons-input
                placeholder="email"
                type="email"
                float
                v-model="inputEmail"
                @blur="checkEmail"
              ></v-ons-input>
              <p v-if="mailErrorMsg" class="validation">{{ mailErrorMsg }}</p>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider" @click="sendMailChangeCheck()">
            <div class="content">
              <i class="zmdi zmdi-email"></i>
              {{ lang.changeEmail }}
            </div>
          </v-ons-list-item>
        </v-ons-list>
      </template>
      <template v-if="viewMode === 'passwordChange'">
        <v-ons-list key="password-change">
          <v-ons-list-item modifier="nodivider" style="padding: 0;">
            <div class="center">
              <v-ons-input
                placeholder="old password"
                type="password"
                float
                v-model="inputPassword"
                @blur="checkPassword"
              ></v-ons-input>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider" style="padding: 0;">
            <div class="center">
              <v-ons-input
                placeholder="new password"
                type="password"
                float
                v-model="inputNewPassword"
                @blur="checkPassword"
              ></v-ons-input>
              <p v-if="mailErrorMsg" class="validation">{{ mailErrorMsg }}</p>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider" @click="sendPwChangeCheck()">
            <div class="content">
              <i class="zmdi zmdi-email"></i>
              {{ lang.changePassword }}
            </div>
          </v-ons-list-item>
        </v-ons-list>
      </template>
      <template v-if="viewMode === 'success'">
        <p style="padding: 0 0 1em;">
          {{ lang.loggingIn }}:
          <br />
          {{ fbAuth.email }}
        </p>
        <div>
          <v-ons-button modifier="large" style="margin-bottom:1em;" @click="signOutAuth">
            <i class="zmdi zmdi-power"></i>
            {{ lang.logout }}
          </v-ons-button>
          <div id="mail-setting">
            <v-ons-button
              modifier="large"
              v-if="fbAuth.providerId === 'password'"
              @click="changeAuthMail"
            >{{ lang.changeEmail }}</v-ons-button>
            <v-ons-button
              modifier="large"
              v-if="fbAuth.providerId === 'password'"
              @click="changeAuthPassword"
            >{{ lang.changePassword }}</v-ons-button>
            <v-ons-button modifier="large" @click="removeAuth">{{ lang.removeAuth }}</v-ons-button>
          </div>
        </div>
      </template>
      <template v-if="viewMode === 'emailVerify'">
        <p>
          {{ lang.verifyProgress }}:
          <br />
          {{ fbAuth.email }}
        </p>
        <v-ons-list key="email-verify">
          <v-ons-list-item modifier="nodivider" @click="mailLinkFlow(fbAuth.email)">
            <div class="content">
              <i class="zmdi zmdi-email"></i>
              {{ lang.sendEmailAgain }}
            </div>
          </v-ons-list-item>
        </v-ons-list>
        <div id="progress-list">
          <v-ons-button modifier="large">{{ lang.stopProgress }}</v-ons-button>
        </div>
        <p class="auth-decription">{{ lang.decriptionChangeMailProgress }}</p>
      </template>
      <template v-if="viewMode === 'email'">
        <p class="auth-decription">{{ lang.decriptionRegisterMail }}</p>
        <v-ons-list key="email">
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
          <v-ons-list-item modifier="nodivider" @click="selectAuth('email')">
            <div class="content">
              <v-ons-button modifier="large">
                <i class="zmdi zmdi-email"></i>
                {{ lang.authEmail }}
              </v-ons-button>
            </div>
          </v-ons-list-item>
        </v-ons-list>
        <div id="reset">
          <v-ons-button modifier="large" @click="resetAuthPassword">{{ lang.resetPassword }}</v-ons-button>
        </div>
        <p class="auth-decription">{{ lang.decriptionNoticeMail }}</p>
      </template>
      <template v-if="viewMode === 'init'">
        <p class="auth-decription">{{ lang.decriptionAuthInit }}</p>
        <v-ons-list key="init">
          <v-ons-list-item modifier="nodivider" @click="selectAuth('google')">
            <div class="content">
              <v-ons-button modifier="large">
                <i class="zmdi zmdi-google"></i>
                {{ lang.authWithGoogle }}
              </v-ons-button>
            </div>
          </v-ons-list-item>
          <!--
          <v-ons-list-item modifier="nodivider" @click="selectAuth('facebook')">
              <div class="content">
                
              <v-ons-button modifier="large">
                <i class="zmdi zmdi-facebook" style="color:#1774eb;"></i>{{ lang.authWithFacebook }}
              </v-ons-button>
              </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider" @click="selectAuth('twitter')">
              <div class="content">
                
              <v-ons-button modifier="large">
                <i class="zmdi zmdi-twitter" style="color:#1d9dec;"></i>{{ lang.authWithTwitter }}
              </v-ons-button>
              </div>
          </v-ons-list-item>
          -->
          <v-ons-list-item modifier="nodivider" @click="emailAuth">
            <div class="content">
              <v-ons-button modifier="large">
                <i class="zmdi zmdi-email"></i>
                {{ lang.authWithEmail }}
              </v-ons-button>
            </div>
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

.validation {
  font-size: 70%;
  line-height: 1.4;
}

.button--sendcheck:not(.button--material) {
  font-size: 100%;
}

.alert-dialog-content.alert-dialog-content--auth-item .list .list-item {
  width: 100%;
  padding: 0;
  margin: 2px 0;
  cursor: pointer;
}

.alert-dialog-content.alert-dialog-content--auth-item .list-item__center {
  padding: 0;
  margin: 5px 0;
}

.alert-dialog-content.alert-dialog-content--auth-item
  .list-item__center
  .content {
  width: 100%;
  height: 100%;
}

.alert-dialog-content.alert-dialog-content--auth-item .button {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 80%;
}

.alert-dialog-content.alert-dialog-content--auth-item #reset .button,
.alert-dialog-content.alert-dialog-content--auth-item #mail-setting .button,
.alert-dialog-content.alert-dialog-content--auth-item #progress-list .button {
  font-size: 13px;
  background: none;
  box-shadow: none;
  justify-content: center;
  color: inherit;
}

.alert-dialog-content.alert-dialog-content--auth-item .button .zmdi {
  margin-right: 0.5em;
}

.alert-dialog-content.alert-dialog-content--auth-item ons-input {
  width: 100%;
}
</style>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data() {
    return {
      accountDialogVisible: false,
      inputEmail: "",
      inputPassword: "",
      inputNewPassword: "",
      mailErrorMsg: "",
      isSelectEmailAuth: false,
      isChangeAuthMail: false,
      ischangeAuthPassword: false
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
      } else if (this.ischangeAuthPassword) {
        return "passwordChange";
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
        this.$store.dispatch("isProgressCheck", true);
        const provider = new firebase.auth().GoogleAuthProvider();
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(() => {
            this.$ons.notification.alert(this.lang.loggedInGoogle, {
              title: this.lang.confirm,
              cancelable: true
            });
          })
          .catch(error => {
            console.log(error.message);
          })
          .finally(() => {
            this.$store.dispatch("isProgressCheck", false);
          });
      }
    },
    emailAuth() {
      this.isSelectEmailAuth = true;
    },
    changeAuthMail() {
      this.isChangeAuthMail = true;
    },
    changeAuthPassword() {
      this.ischangeAuthPassword = true;
    },
    emailAuthCancel() {
      if (this.isChangeAuthMail) {
        this.isChangeAuthMail = false;
        this.mailErrorMsg = "";
      } else if (this.ischangeAuthPassword) {
        this.ischangeAuthPassword = false;
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
      if (this.inputEmail !== "" && !pattern.test(this.inputEmail)) {
        this.mailErrorMsg = this.lang.inputCheckEmail;
      } else {
        this.mailErrorMsg = "";
      }
    },
    checkPassword() {
      var pattern = /^[a-zA-Z0-9!-/:-@¥[-`{-~]{8,100}$/;
      if (
        (this.inputPassword !== "" && !pattern.test(this.inputPassword)) ||
        (this.inputNewPassword !== "" && !pattern.test(this.inputNewPassword))
      ) {
        this.mailErrorMsg = this.lang.inputCheckPassword;
      } else {
        this.mailErrorMsg = "";
      }
    },
    resetAuthPassword() {
      this.$ons.notification
        .prompt(this.lang.resetPasswordInput, {
          title: this.lang.confirm,
          inputType: "text",
          buttonLabels: ["Cancel", "OK"],
          cancelable: true
        })
        .then(mail => {
          if (mail && mail !== "") {
            this.$store.dispatch("isProgressCheck", true);
            this.$store
              .dispatch("resetPasswordCheck", mail)
              .then(res => {
                if (!res) {
                  this.$ons.notification.alert(this.lang.resetPasswordNotice, {
                    title: this.lang.confirm,
                    cancelable: true
                  });
                } else {
                  var errorMsg;
                  switch (res.code) {
                    case "auth/invalid-email":
                      errorMsg = this.lang.resetPasswordErrInvalid;
                      break;
                    case "auth/user-not-found":
                      errorMsg = this.lang.resetPasswordErrNotfound;
                      break;
                    default:
                      errorMsg = this.lang.resetPasswordErrOther;
                      break;
                  }
                  this.$ons.notification.alert(errorMsg, {
                    title: this.lang.confirm,
                    cancelable: true
                  });
                }
              })
              .finally(() => {
                this.$store.dispatch("isProgressCheck", false);
              });
          }
        });
    },
    sendPwChangeCheck() {
      if (this.inputPassword === "" || this.inputNewPassword === "") {
        this.mailErrorMsg = this.lang.inputCheckEmpty;
      }
      if (this.inputPassword === this.inputNewPassword) {
        this.mailErrorMsg = this.lang.inputCheckSame;
      }
      if (this.mailErrorMsg !== "") {
        return;
      }

      this.$ons.notification
        .confirm(this.lang.passwordChangeConfirm, {
          title: this.lang.confirm,
          inputType: "password",
          buttonLabels: ["Cancel", "OK"],
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("isProgressCheck", true);
            this.$store
              .dispatch("reauthenticateCheck", this.inputPassword)
              .then(res => {
                if (!res) {
                  this.$store
                    .dispatch("changePasswordCheck", this.inputNewPassword)
                    .then(() => {
                      this.$ons.notification.alert(
                        this.lang.changePasswordNotice,
                        {
                          title: this.lang.confirm,
                          cancelable: true
                        }
                      );
                      this.ischangeAuthPassword = false;
                      this.accountDialogVisible = false;
                    })
                    .catch(error => {
                      console.log(error.message);
                      this.$ons.notification.alert(
                        this.lang.changePasswordErr,
                        {
                          title: this.lang.confirm,
                          cancelable: true
                        }
                      );
                    });
                } else {
                  var errorMsg;
                  switch (res.code) {
                    case "auth/wrong-password":
                      errorMsg = this.lang.emailErrPw;
                      break;
                    case "auth/too-many-requests":
                      errorMsg = this.lang.emailErrMany;
                      break;
                    default:
                      errorMsg = this.lang.emailErrOther;
                      break;
                  }
                  this.$ons.notification.alert(errorMsg, {
                    title: this.lang.confirm,
                    cancelable: true
                  });
                }
              })
              .finally(() => {
                this.$store.dispatch("isProgressCheck", false);
              });
          }
        });
    },
    sendMailChangeCheck() {
      if (this.inputEmail === "") {
        this.mailErrorMsg = this.lang.inputCheckEmpty;
      }
      if (this.mailErrorMsg !== "") {
        return;
      }

      this.$ons.notification
        .prompt(this.lang.emailChangePwInput, {
          title: this.lang.confirm,
          inputType: "password",
          buttonLabels: ["Cancel", "OK"],
          cancelable: true
        })
        .then(pw => {
          if (pw && pw !== "") {
            this.$store.dispatch("isProgressCheck", true);
            this.$store
              .dispatch("reauthenticateCheck", pw)
              .then(res => {
                if (!res) {
                  this.$store
                    .dispatch("changeEmailCheck", this.inputEmail)
                    .then(() => {
                      this.$ons.notification.alert(
                        this.lang.changeEmailNotice,
                        {
                          title: this.lang.confirm,
                          cancelable: true
                        }
                      );
                      this.isChangeAuthMail = false;
                      this.accountDialogVisible = false;
                    });
                } else {
                  var errorMsg;
                  switch (res.code) {
                    case "auth/wrong-password":
                      errorMsg = this.lang.emailErrPw;
                      break;
                    case "auth/too-many-requests":
                      errorMsg = this.lang.emailErrMany;
                      break;
                    default:
                      errorMsg = this.lang.emailErrOther;
                      break;
                  }
                  this.$ons.notification.alert(errorMsg, {
                    title: this.lang.confirm,
                    cancelable: true
                  });
                }
              })
              .finally(() => {
                this.$store.dispatch("isProgressCheck", false);
              });
          }
        });
    },
    sendMailCheck() {
      //Check if an account has been created
      this.$store.dispatch("isProgressCheck", true);
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
                  this.accountDialogVisible = false;
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
              .finally(() => {
                this.$store.dispatch("isProgressCheck", false);
              });
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
              })
              .finally(() => {
                this.$store.dispatch("isProgressCheck", false);
              });
          }
        })
        .catch(error => {
          this.$ons.notification.toast("error: " + error.message, {
            timeout: 2000
          });
          console.log(error.message);
          this.$store.dispatch("isProgressCheck", false);
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
            this.$store.dispatch("isProgressCheck", true);
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
              })
              .finally(() => {
                this.$store.dispatch("isProgressCheck", false);
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
            this.$store.dispatch("isProgressCheck", true);
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
              })
              .finally(() => {
                this.$store.dispatch("isProgressCheck", false);
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
            this.$ons.notification
              .prompt(this.lang.emailPwInput, {
                title: this.lang.confirm,
                inputType: "password",
                buttonLabels: ["Cancel", "OK"],
                cancelable: true
              })
              .then(pw => {
                if (pw && pw !== "") {
                  this.$store.dispatch("isProgressCheck", true);
                  this.$store
                    .dispatch("reauthenticateCheck", pw)
                    .then(res => {
                      if (!res) {
                        this.$store.dispatch("removeAuthCheck").then(() => {
                          this.$ons.notification.alert(
                            this.lang.removeAuthNotice,
                            {
                              title: this.lang.confirm,
                              cancelable: true
                            }
                          );
                          this.accountDialogVisible = false;
                        });
                      } else {
                        var errorMsg;
                        switch (res.code) {
                          case "auth/wrong-password":
                            errorMsg = this.lang.emailErrPw;
                            break;
                          case "auth/too-many-requests":
                            errorMsg = this.lang.emailErrMany;
                            break;
                          default:
                            errorMsg = this.lang.emailErrOther;
                            break;
                        }
                        this.$ons.notification.alert(errorMsg, {
                          title: this.lang.confirm,
                          cancelable: true
                        });
                      }
                    })
                    .finally(() => {
                      this.$store.dispatch("isProgressCheck", false);
                    });
                }
              });
          }
        });
    }
  }
};
</script>