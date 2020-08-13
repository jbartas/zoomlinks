<template>
<div class="adduser">

  <div class="form_title" >
      Create a New Account
  </div>
  <form class="place-form sb_form" v-on:submit.prevent  >
    <div class="adduser-2cols" >
        <label>email:</label>
        <div class="input-box" >
            <input name="email" v-model="email" v-on:blur="checkData( 'email' )" 
                autocomplete="new-password" />
        </div>

        <label>user name:</label>
        <div class="input-box" title="Name that will be displayed on screens" >
            <input name="newUserName" v-model="newUserName" autocomplete="new-password"
                v-on:blur="checkData( 'newUserName' )" />
        </div>

        <label>desired password:</label>
        <div class="input-box" title="At least 6 characters, and at least one number" >
            <input type="password" name="password" v-model="password" autocomplete="new-password" />
        </div>

        <label>re-enter password:</label>
        <div class="input-box" title="At least 6 characters, and at least one number">
            <input type="password" name="password2" v-model="password2" autocomplete="new-password" />
        </div>

    </div>
    <div class="submit_button" >
        <button  v-on:click="createUser()" > Create account </button>
    </div>
  </form>
  <div class="place-error" >
    <div class="resultMsg" >
        {{pw_message}}
    </div>
    <div class="errorMsg" >
        {{networkError}}
    </div>
    <div class="resultMsg" >
        {{resultStatus}}
    </div>
    <div class="resultMsg url_line" v-on:click="relogin()" >
        {{reLogin}}
    </div>
  </div>

</div>
</template>


<script>
import restapi from "../restapi.js";
const bcrypt = require('bcryptjs');

/* Password hashing:
The password is hashed with bcrypt on the client side (here) before 
submnitting  the REST req to create the user. Thus the server creates 
a record with PW already hashed. 
At login time the password is sent in clear text (hopefully on SSL)
and compared to the hased one by the server. This seems to be the 
best we can do with only bcrypt.
*/
export default {
  name: 'addUser',
  methods: {
      /* Basically the "submit" handler */
      createUser: function  () {
            let url = "/newUser";
            this.networkError = "";   // no error yet
            
            if( this.email == "" || this.newUserName == "" || this.password.length < 6 ) {
                this.networkError = "missing a required field";
                return;
            }

            /* hash the password */
            let hashPW = bcrypt.hashSync( this.password, 10);

            let newuser = {
                "email" :    this.email, 
                "userName" : this.newUserName, 
                "password" : hashPW, 
                "admin" :   false, 
            }
            // eslint-disable-next-line
            console.log( "createUser: url: ", url, ", newuser: " + newuser );

            restapi.post( url, newuser )
            .then( reply => {
                // eslint-disable-next-line
                console.log( "newUser; reply: ", reply );
                this.resultStatus = "New User " + this.newUserName + " created.";
                this.reLogin = "Would you like to log out & back in?";
                this.email = "";
                this.newUserName = "";
                this.password = ""; 
                this.password2 = ""; 
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( error );
                this.networkError = error;
            });
      },
      relogin: function () {
          this.global.renderApp = "login";
      },
      checkData: function ( queryField ) {
            /* method to check a just-entered newUserName or password to 
             * see if it already exists in the database and warn the user if so.
             */
            let url = "/getUserInfo/";
            this.networkError = "";   // no error yet
            console.log( "getUserInfo request url 1: ", url );

            // See if we issue query for newUserName.
            if( queryField == "newUserName"  && this.newUserName != "" ) {
                url += this.newUserName;
            }
            else {
                return;
            }
            console.log( "getUserInfo request url: ", url );

            restapi.get( url )
            .then ( reply => {
                // eslint-disable-next-line
                console.log( "getUserInfo Reply: ", reply );
                if( reply.data.status != "success" ) {
                    // eslint-disable-next-line
                    console.log( "user check: bad user status ", reply.data.message );
                    return;
                }

                /* Fall to here if we got a successly reply to user list, 
                 * That might be zero users...
                 */
                let users = reply.data.userInfo; // array of matching users (should be 0 or 1)
                if( users.length == 0 ) {   // no matching users
                    this.networkError = "";     // user is OK to proceed
                }
                else if( users[0].userName == this.newUserName ) {
                    this.networkError = "User name " + this.newUserName + 
                        " already in use. Name must be unique.";
                    this.newUserName = "";     // clear from screen
                }
                else {
                    // eslint-disable-next-line
                    console.log( "user check: mismatched user name !? ", users[0].userName );
                }
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( error );
                this.networkError = error;
            });
      }
  },
  props: {
    global: Object,
    topbarMsg: String
  },
  data() {
      return {
        email: "",
        newUserName: "",
        password: "",

        statusMsg: "",
        password2: "",       /* for input checking */
        networkError: "",
        pw_message: "",
        resultStatus: "",
        reLogin: ""
      }
  },
  watch: {
    'password2': function(val) {
        if (val == "" ) {
            // remove message if user backed up to start
            this.pw_message= "";
        }
        else if (val == this.password ) {
            this.pw_message= "passwords match";
        }
        else {
            this.pw_message= "passwords don't match yet";
        }
    }
  }
}

</script>


<style>

/* Outer container */
.adduser {
    position:   relative;
    width:      80%;
    left:       10%;
}

.place-form {
    position:   relative;
    top:        1.8em;
    left:       0em;
    max-width:  40em;
    margin:     auto;
}

/* Over-write default 2cols */
.adduser-2cols {
     display:           grid;
     grid-template-columns:  10em  auto;
     grid-gap:          4px;
}

input {
    width:     20em;
    min-width: 12em;
    max-width: 50%;
}

.input-box {
    text-align: left;
    padding-left: 4px;
}

.place-error {
    position:   relative;
    top:        2em;
}

.form_title {
    position:   relative;
    top:        1.5em;
}

.submit_button {
    text-align:     center;
    margin:         1em;
}

button {
    width:          10em;
}

.url_line {
    color:          var(--grid-url-color);
    text-decoration: underline;
    cursor:         pointer;
}

</style>
