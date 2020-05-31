<template>
  <div class="login">
 
  <h3>Log in to Zoomlinks (guest,guest)</h3>
  <div >

   <div class="place-form grid-2cols sb_form" style="width: 20em;" >
      <form name="login ">
        <div class="label" >
            User name:
        </div>
        <div>
            <input name="userName" v-model="userName" placeholder="User name"  >
        </div>

        <div  class="label" > Password:</div>
        <div title="At least 6 characters, and at least one number">
            <input type="password" name="password" v-model="password"  
            placeholder="password"  ></div>

        <div> </div>
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
                }
                else {
                    this.loginStatus = "Login FAILED: " + reply.message;
                    this.$parent.loggedInStatus = "Not Logged In";
                    this.$parent.loggedInName = "";
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
    top:        20px;
    width:      30%;
    min-width:  470px;
    left:       5%;
    color:      var(--bt-form-color);
    margin:     10px;
    padding:    10px;
    text-align: center;
}

.place-form {
    position:   relative;
    top:        0px;
    left:       8em;
}

.place-error {
    position:   relative;
    top:        2em;
    left:       0em;
}

.grid-2cols {
     grid-template-columns:  auto  auto;
}

.sb_form {
    padding-top:        1em;
    background-color:   var(--bt-table-backgroud) ;
}

input {
    position:       relative;
    line-height:    normal;
    background-color: white;
    padding-left:   5px;
    height:         1.4em;
}

.label {
    float:          right;
    text-align:     right;
/*    color:          var(--bt-text-color);*/
}

</style>
