<template>
  <div class="login">

   <div class="login-form" >
      <form name="login " class="login-2cols sb_form" autofill="off" v-on:submit.prevent >
        <label> User name: </label>
        <div class="input-box" >
            <input name="userName" v-model="userName" placeholder="User name" autocomplete="off" >
        </div>

        <label> Password:</label>
        <div class="input-box" title="At least 6 characters, and at least one number" >
            <input type="password" name="password" v-model="password"  
            placeholder="password"  >
        </div>
        <label> &nbsp; </label>
        <div>
            <button v-on:click="submitUser()" > Log In </button>
        </div>
      </form>
    </div>

    <div class="place-error" >
      <div class="errorMsg">{{networkError}}</div>
      <div class="errorMsg">{{loginStatus}}</div>
    </div>
 
  </div>
</template>


<script>
import restapi from "../restapi.js";

export default {
  name: 'login',
  props: {
    global: Object,
  },
  data() {
      return {
        userName: "",
        password: "",
        loginStatus: "",
        networkError: ""
      }
  },
  methods: {
    submitUser: function (  ) {
        this.networkError = "";
        if( this.userName == "") {
            this.loginStatus = "Please enter a user name."
            return;
        }
        if( this.password == "") {
            this.loginStatus = "Please enter a password."
            return;
        }
        let userInfo = { 
            "userName": this.userName, 
            "password": this.password 
            };

        restapi.post( "/login", userInfo )
        .then(
            response => {
                let reply = response.data;
                console.log( "login reply: ", reply );
                if( reply.status == "success") {
                    this.loginStatus = "";
                    this.global.loggedInName = this.userName;
                    this.global.loggedInStatus = true;
                    this.global.loggedInID = reply.userID;
                    this.global.userEmail = reply.userEmail;
                    this.global.sessionHash = reply.sessionHash;
                    this.global.renderApp = "linkList";
                }
                else {
                    this.loginStatus = "Login problem: " + reply.message;
                    this.global.loggedInStatus = false;
                    this.global.loggedInName = "";
                    this.global.userEmail = "";
                    this.global.sessionHash = null;
                    this.global.activeGroup = null;
                }
                localStorage.setItem("session", JSON.stringify( this.global ));
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( error );
                if( error.toString().includes("Error: timeout of ") ) {
                  error = "Timed out. Server may be offline, please try again later."
                }
                this.networkError = "Network: " + error;
            });
        }
  },
  created: function() {
    this.global.loggedInStatus = false;
    this.global.loggedInName = "";
    this.global.userEmail = "";
    this.global.activeGroup = null;
  }
}

</script>


<style scoped>

.login {
    position:   relative;
    color:      var(--bt-form-color);
}

.login-form {
    position:   relative;
    top:        2em;
    width:      30em;
    max-width:  90vw;
    margin:     auto;
}

.login-2cols {
     display:           grid;
     grid-template-columns:  7em  14em;
     grid-gap:          4px;
}


.place-error {
    position:   relative;
    left:       1px;
    top:        2em;
}

.input-box {
    text-align:     left;
    padding-left:   6px;
}

</style>
