<template>
  <div class="login">

   <div class="place-form" style="width: 20em;" >
      <form name="login " class="grid-2cols sb_form" autofill="off" v-on:submit.prevent >
        <label> User name: </label>
        <div>
            <input name="userName" v-model="userName" placeholder="User name" autocomplete="off" >
        </div>

        <label> Password:</label>
        <div title="At least 6 characters, and at least one number">
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
                if( reply.status == "success") {
                    this.loginStatus = "";
                    this.$parent.loggedInStatus = "Logged in as " + this.userName;
                    this.$parent.loggedInName = this.userName;
                    this.$parent.renderApp = "addLink";
                    this.$parent.userEmail = reply.data.userEmail;
                }
                else {
                    this.loginStatus = "Login FAILED: " + reply.message;
                    this.$parent.loggedInStatus = "Not Logged In";
                    this.$parent.loggedInName = "";
                    this.$parent.userEmail = "";
                }
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( error );
                this.networkError = "Network: " + error;
            });
        }
  },
  props: {
    msg: String,
    topbarMsg: String
  },
  data() {
      return {
        userName: "",
        password: "",
        loginStatus: "",
        networkError: ""
      }
  }
}



</script>

<style scoped>

.login {
    position:   relative;
    min-width:  470px;
    color:      var(--bt-form-color);
    margin:     10px;
    padding:    10px;
    text-align: center;
}

.place-form {
    position:   relative;
    top:        2em;
    left:       24%;
}

.place-error {
    position:   relative;
    left:       1px;
    top:        2em;
}

</style>
