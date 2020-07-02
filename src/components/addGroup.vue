<template>
<div class="addgroup">

  <div class="form-title" >
      Create a New Group
  </div>
  <div class="form-sub-title"
      title="You will be the admin of this group. You may add other admins 
        after the group is created. ">
    Group admin: ({{userName}}). 
    Questions about groups? Hover over entry fields for help <i class="fa fa-question-circle"></i>
  </div>

  <form class="place-form sb_form" v-on:submit.prevent  autocomplete="Chrome-sux"  >

    <div title="Name is Case insensitive with no spaces. It will be checked for uniqueness.">
        <div class="form-text" >
            Please choose a name for your group. 
            <i class="fa fa-question-circle float-right"></i>
        </div>
        <div class="grid-2cols" >
            <label>Group Name:</label>
            <div class="input-box" >
                <input name="groupName" v-model="groupName" v-on:blur="checkData( 'groupName' )" />
            </div>
        </div>      <!-- end grid-2cols -->
    </div>      <!-- end Group name area -->
        <div class="form-text" >
            Add a desription &amp; tags:
        </div>
        <div class="center-items" >
            <div class="input-box" >
                <input name="descriptipon" v-model="descr" />
            </div>
            <div class="input-box" >
                <input name="tags" v-model="tags"/>
            </div>
        </div>
    <br>
    <hr>

    <div class="form-text" 
    title=
    "    public - Anyone can view the links, but only only group members can write or edit links. 
private - Only group members can view the group's links. 
        Admin(s) must add members in the 'manage group' page. 
    "
    >
        Please make your group <strong> 'Public' </strong>  or <strong> 'private'</strong>.
            <i class="fa fa-question-circle float-right"></i>
    </div>
    
    <div class="grid-5cols" >
        <label>Group Type:</label>
        Public
        <input type="radio" value="public" v-model="groupType" />
        Private
        <input type="radio" value="private" v-model="groupType" />
    </div>      <!-- end grid-2cols -->
    <br>
    <hr>
    <div class="form-text" title="If you add a password, then it will be requiered for 
        adding or changing links. Leave it blank if you want anyone who can see links 
        to be able to add or change them.">
        Group Password for editing links
            <i class="fa fa-question-circle float-right"></i>
    </div>
    <div class="grid-2cols" >
        <label>Password:</label>
        <div class="input-box" title="At least 6 characters" >
            <input type="password" name="password" v-model="password" autocomplete="new-password" />
        </div>

        <label>Please re-enter password:</label>
        <div class="input-box" title="At least 6 characters">
            <input type="password" name="password2" v-model="password2" autocomplete="new-password" />
        </div>
    </div>      <!-- end grid-2cols -->

    <div class="submit_button" >
        <button  v-on:click="createGroup()" > Create Group </button>
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
  </div>

</div>
</template>


<script>
import axios from "axios";
const bcrypt = require('bcryptjs');


export default {
  name: 'addGroup',
  props: {
    msg: String,
  },
  data() {
      return {
        groupName: "",
        password: "",
        groupType: "private",
        descr: "",
        tags: "",
        
        statusMsg: "",
        password2: "",       /* for input checking */
        networkError: "",
        pw_message: "",
        resultStatus: "",
        reLogin: "",
        userName: "",
      }
  },
  methods: {
      /* Basically the "submit" handler */
      createGroup: function  () {

        this.networkError = "";   // no error yet
        this.resultStatus = "Creating group " + this.groupName;
        let headers = { headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type'
            }};

        console.log("Create group; name: ", this.groupName );

        /* hash the password */
        let hashPW = bcrypt.hashSync( this.password, 10);
        let userId = this.$parent.$parent.loggedInID;
        let newGroup = { 
            admins:     [ userId],     	// Array of admins
            groupName:  this.groupName,
            descr:      this.descr,
            tags:       this.tags,
            password:   hashPW,
            type:       this.groupType,
            links:      [],
            members:   	[ userId ],     // _id list of member users
        };

        let url = this.$parent.$parent.baseURL + "/newGroup";
        console.log("Create group; object: ", newGroup, ", URL: ", url );

        axios.post( url, newGroup, headers )
        .then( reply => {
            // eslint-disable-next-line
            console.log( "addGroup; reply: ", reply );
            this.resultStatus = "New Group " + this.groupName + " created.";
            this.$parent.renderApp = "editGroup";
            this.$parent.activeGroup = this.groupName;
        }).catch( error =>  {
            // eslint-disable-next-line
            console.log( error );
            this.networkError = error;
            this.resultStatus = "";
        });

      },
      checkData: function ( queryField ) {
          /* method to check a just-entered newUserName or password to 
           * see if it already exists in the database and warn the user if so.
           */
        let url = this.$parent.baseURL + "/getGroupInfo/";
        this.networkError = "";   // no error yet
        let headers = { headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type'
            }};

        // See if we issue query for newUserName.
        if( queryField == "groupName"  && this.groupName != "" ) {
            url += this.groupName;
        }
        else {
            return;
        }

        // eslint-disable-next-line
        console.log( "getGroupRecord request url: ", url );
        
        axios.get( url, headers )
        .then ( reply => {
            // eslint-disable-next-line
            console.log( "getGroupRecord Reply: ", reply );
            if( reply.data.status != "success" ) {
                // eslint-disable-next-line
                console.log( "user check: bad user status ", reply.data.message );
                return;
            }

            /* Fall to here if we got a successly reply, 
             * That might be zero elements...
             */
            let groups = reply.data.groupInfo;  // array of matching groups (should be 0 or 1)
            if( groups.length == 0 ) {          // no matching 
                this.networkError = "";         // user is OK to proceed
                this.resultStatus = "Group name is available for use.";
            }
            else if( groups[0].groupName == this.groupName ) {
                this.resultStatus = "Group name " + this.groupName + 
                    " already in use. Name must be unique.";
                this.groupName = "";            // clear from screen
            }
            else {
                // eslint-disable-next-line
                console.log( "user check: mismatched user name !? ", groups[0].groupName );
            }
        }).catch( error =>  {
            // eslint-disable-next-line
            console.log( error );
            this.networkError = "Can't check name on server, " + error;
        });
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
    },
    'groupName': function() {
        if( this.groupName.indexOf(" ") != -1 ) {
//            this.groupName = this.groupName.slice(0,-1);
            this.resultStatus = "Please, no spaces in Group name.";
        }
        else {
                this.resultStatus = "";
        }
    }
  },
  created: function () {
      this.userName = this.$parent.loggedInName
  }
}

</script>


<style scoped>

/* Outer container */
.addgroup {
    position:   relative;
}

.place-form {
    position:   relative;
    top:        2.9em;
    width:      80%;
    max-width:  500px;
    margin:     auto;
    padding:    2em;
}

/* Over-write default 2cols */
.grid-2cols {
     display:           grid;
     grid-template-columns:  30%  auto;
     grid-gap:          4px;
}

input {
    min-width: 90%;
}

.input-box {
    text-align: left;
    padding-left: 4px;
}

.grid-5cols {
    position:          relative;
    top:               0.3em;
    display:           grid;
    grid-template-columns:  auto  auto  2em  auto  2em 20%;
    grid-gap:          4px;
    text-align:        right;
}

.place-error {
    position:   relative;
    top:        2em;
}

.form-title {
    position:   relative;
    top:        1.4em;
    color:      var(--bt-form-text);
    font-size:  1.2em;
    padding:    5px;
}

.form-sub-title {
    position:   relative;
    top:        2.0em;
    color:      var(--bt-form-text);
    font-size:  1.0em;
    padding:    4px;
}

label {
    color:      var(--bt-form-text)
}

.form-text {
    top:        0.1em;
    position:   relative;
    text-align: left;
    color:      var(--bt-form-color);
    padding:    6px;
}

.submit_button {
    text-align:         center;
}

.float-right {
    float:  right;
}

.center-items {
    text-align:       center;
}

</style>
