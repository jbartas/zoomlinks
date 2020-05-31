<template>
<div>


<form class="place-form sb_form" autofill="off" v-on:submit.prevent  >
<h3>Create a new account on BioMoods</h3>

    <div class="grid-2cols new_user" style="width: 20em;" >

        <label>Birth Year:</label>
        <div class="optional" title="Optional, but reseach data is better if we know your age">
            <input name="birth year" v-model="birthyear"  placeholder="Optional"
                v-on:blur="checkData( 'birthyear' )" >
        </div>

        <label>Gender:</label>
        <div class="optional" title="Optional, but reseach data is better if we know your gender">
            <input name="gender" v-model="gender" placeholder="Optional" ></div>

        <label>email:</label>
        <div title="This will be needed if you lose you password">
            <input name="email" v-model="email"  v-on:blur="checkData( 'email' )"   >
            </div>

        <label>user name:</label>
        <div  title="Name that will be displayed on screens">
            <input name="newUserName" autocomplete="off" v-model="newUserName" 
                autofill="off" v-on:blur="checkData( 'newUserName' )" >
        </div>

        <label>desired password:</label>
        <div title="At least 6 characters, and at least one number">
            <input type="password" name="password" autofill="off" 
                v-model="password" ></div>

        <label>re-enter password:</label>
        <div title="At least 6 characters, and at least one number">
            <input type="password" name="password2" v-model="password2" ></div>

        <div> </div>
        <div class="submit_button" >
            <button  v-on:click="createUser()" > Create account </button>
        </div>
    </div>
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
    </div>
</form>

</div>
</template>


<script>
import axios from "axios";
const bcrypt = require('bcryptjs');

/* Password hashing (as of Sept 3 2019):
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
            let url = this.$parent.baseURL + "/newUser";
            this.networkError = "";   // no error yet
            let headers = { headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type'
                }};
            
            if( this.email == "" || this.newUserName == "" || this.password.length < 6 ) {
                this.networkError = "missing a required field";
                return;
            }

            /* hash the password */
            let hashPW = bcrypt.hashSync( this.password, 10);

            let newuser = {
                "birthday" : this.birthyear, 
                "gender" : this.gender,
                "email" : this.email, 
                "userName" : this.newUserName, 
                "password" : hashPW, 
                "admin" : false, 
            }
            // eslint-disable-next-line
            console.log( newuser );

            axios.post( url, newuser, headers )
            .then( reply => {
                // eslint-disable-next-line
                console.log( "newUser; reply: ", reply );
                this.resultStatus = "New User " + this.newUserName + " created.";
                this.email = "";
                this.newUserName = "";
                this.birthyear = ""; 
                this.gender = "";
                this.password = ""; 
                this.password2 = ""; 
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( error );
                this.networkError = error;
            });
      },
      checkData: function ( queryField ) {
          /* method to check a just-entered newUserName or password to 
           * see if it already exists in the database and warn the user if so.
           */
            let url = this.$parent.baseURL + "/getUserInfo";
            this.networkError = "";   // no error yet
            let headers = { headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type'
                }};

            // See if we issue query for newUserName or email.
            if( queryField == "email" && this.email != "") {
                url += "/email/" + this.email;
            }
            else if( queryField == "newUserName"  && this.newUserName != "" ) {
                url += "/userName/" + this.newUserName;
            }
            else if( queryField == "birthyear" && this.birthyear != "" ) {
                // eslint-disable-next-line
                console.log( "birthyear: ", this.birthyear );
                if( this.birthyear < 1900 || this.birthyear > 2020 ) {
                    /* user specified a birthyear out of range. */
                    this.networkError = "Please enter a year from 1900 to 2020";
                }
                return;
            }
            else {
                return;
            }
            
            axios.get( url, headers )
            .then ( reply => {
                let user = reply.data;

                // eslint-disable-next-line
                console.log( "User: ", user );

                if( user.status != "success" ) {
                    // eslint-disable-next-line
                    console.log( "user check: bad user status ", user.message );
                    return;
                }

                /* Fall to here if we got a succuessly reply to user list, 
                 * That might be zero users...
                 */
                if( user.user.length == 0 ) {   // no matching users
                    this.networkError = "";     // user is OK to proceed
                }
                else if( user.user[0].userName == this.newUserName ) {
                    this.networkError = "User name " + this.newUserName + " already in use";
                    this.newUserName = "";     // clear from screen
                }
                else if( user.user[0].email == this.email ) {
                    this.networkError = "email address " + this.email + " already in use";
                    this.email = "";
                }
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( error );
                this.networkError = error;
            });
      }
  },
  props: {
    msg: String,
    topbarMsg: String
  },
  data() {
      return {
        birthyear: "",
        gender:"",
        email: "",
        newUserName: "",
        password: "",

        statusMsg: "",
        password2: "",       /* for input checking */
        networkError: "",
        pw_message: "",
        resultStatus: ""
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


<style scoped>


label {
    color:      var(--bt-form-color);
    float:      right;
    padding-right: 0.8em;
}

.place-form {
    position:   relative;
    top:        0px;
    left:       12em;
}

.place-error {
    position:   relative;
    top:        2em;
    left:       0em;
}

.resultMsg {
    position:           relative;
    top:                1em;
    left:               6em;
}

.optional {
    background-color:   #aa88FF;
}

.new_user {
    position:           relative;
    top:                20px;
    left:               2em;
    color:              var(--bt-text-color);
    margin:             10px;
    padding:            20px;
    text-align:         right;
    background-color:   var(--bt-table-backgroud) ;
}

.grid-2cols {
     grid-template-columns:  auto  auto;
}

.submit_button {
    text-align:         center;
}
</style>
