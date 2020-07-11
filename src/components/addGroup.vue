<template>
<div class="addgroup">

  <div class="form-title" >
      Create a New Group
  </div>
  <div class="form-sub-title" v-if="editing == null"
      title="You will be the admin of this group. You may add other admins 
        after the group is created. ">
    Group admin: ({{userName}}). 
    Questions about groups? Hover over entry fields for help <i class="fa fa-question-circle"></i>
  </div>
  <div class="form-sub-title" v-if="editing"
      title="You can change fields for this group, including adding users, and admins. ">
    Editing Group {{editing.groupName}}. 
    Questions? Hover over entry fields for help <i class="fa fa-question-circle"></i>
  </div>

  <form class="place-form sb_form" v-on:submit.prevent  autocomplete="Chrome-sux" >
    <div title="Name is Case insensitive with no spaces. It will be checked for uniqueness.">
        <div class="form-text" >
            Please choose a name for your group. 
            <i class="fa fa-question-circle float-right"></i>
        </div>
        <div class="grid-2cols" >
            <label>Group Name:</label>
            <div class="input-box" >
                <input name="groupName" v-model="groupName"  placeholder="group-name (required)"
                    v-on:blur="checkData( 'groupName' )" />
            </div>
        </div>      <!-- end grid-2cols -->
    </div>      <!-- end Group name area -->
    <div class="form-text" title="Both these fields will be used when searching for the group.">
        Add a desription &amp; tags:
        <i class="fa fa-question-circle float-right"></i>
    </div>
    <div class="grid-2cols" >
        <label>Description:</label>
        <div class="input-box" >
            <input name="descriptipon" v-model="descr" placeholder="Description of group" />
        </div>
        <label>Tags:</label>
        <div class="input-box" >
            <input name="tags" v-model="tags" placeholder="Search tags" />
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
    <div class="form-text" title="If you add a password, then it will be required for adding or changing
   links. Leave it blank if you want anyone who can see links to be 
   able to add or change them.">
        <i class="fa fa-question-circle float-right"></i>
        <div class="grid-checkbox" >
            Use a group Password for editing links?
            <input type=checkbox v-model="doPassword" />
        </div>
    </div>
    

    <div class="grid-2cols" v-if="doPassword" >
        <label>Password:</label>
        <div class="input-box" title="At least 6 characters" >
            <input type="password" name="password" v-model="password" autocomplete="new-password" />
        </div>

        <label>Please re-enter password:</label>
        <div class="input-box" title="At least 6 characters">
            <input type="password" name="password2" v-model="password2" autocomplete="new-password" />
        </div>
    </div>      <!-- end grid-2cols (doPassword) -->

    <div class="submit_button" v-if="editing == null" >
        <button  v-on:click="createGroup()" > Create Group </button>
    </div>
    <div class="grid-editbuttons" v-if="editing" >
        <button  v-on:click="createGroup()" > Save Changes </button>  &nbsp; 
        <button  v-on:click="deleteGroup()" > Delete Group </button>
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
        editing: null,      /* group record if editing. */

        // If editing, edit admins and members
        members: [],     // list of ID s
        admins: [],     // list of ID s

        doPassword: false,
        statusMsg: "",
        password2: "",       /* for input checking */
        networkError: "",
        pw_message: "",
        resultStatus: "",
        userName: "",
      }
  },
  methods: {
    /* Basically the "submit" handler */
    createGroup: function  () {

        this.networkError = "";   // no error yet

        if( this.groupName == null || this.groupName == "" || this.groupName.indexOf(" ") != -1 ) {
            this.resultStatus = "Group Name is required, and must not have any spaces";
            return;
        }

        this.resultStatus = "Creating group " + this.groupName;
        let headers = { headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type'
            }};

        console.log("Create group; name: ", this.groupName );

        /* hash the password */
        let hashPW = bcrypt.hashSync( this.password, 10);
        let userId = this.$parent.loggedInID;
        let newGroup = { 
            admins:     [ userId ],     	// Array of admins
            groupName:  this.groupName,
            descr:      this.descr,
            tags:       this.tags,
            password:   hashPW,
            type:       this.groupType,
            links:      [],
            members:   	[ userId ],     // _id list of member users
        };

        let url = this.$parent.baseURL + "/newGroup";
        console.log("Create group; object: ", newGroup, ", URL: ", url );

        axios.post( url, newGroup, headers )
        .then( reply => {
            // eslint-disable-next-line
            console.log( "addGroup; reply: ", reply );
            this.resultStatus = "New Group " + this.groupName + " created.";
            this.$parent.activeGroup = newGroup;
            this.$parent.renderApp = "editGroup";
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
        this.resultStatus = "";   // no status, either.
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
             * That will often be a zero length array
             */
            let groups = reply.data.groupList;  // array of matching groups (should be 0 or 1)
            if( groups.length == 0 ) {          // no matching 
                this.networkError = "";         // user is OK to proceed
                this.resultStatus = "Group name is available for use.";
            }
            else if( groups[0].groupName == this.groupName ) {
                this.resultStatus = "Group name '" + this.groupName + 
                    "' already in use. Name must be unique.";
                console.log( "checkData: groupName in use ", groups[0] );
                this.groupName = "";            // clear from screen
            }
            else {
                // eslint-disable-next-line
                console.log( "group name check: mismatched name !? ", groups[0].groupName );
                this.networkError = "Server DB error checking group name";
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
            this.groupName = this.groupName.slice(0,-1);
            this.resultStatus = "Please, no spaces in Group name.";
        }
    }
  },
  created: function () {
    this.$parent.$parent.renderApp = "";      // clear groups nav bar
    this.userName = this.$parent.loggedInName;
    this.editing = this.$parent.activeGroup;

    if( this.editing ) {
        this.groupName = this.editing.groupName;
        this.groupType = this.editing.type;
        this.descr = this.editing.descr;
        this.tags = this.editing.tags;

        // Get members and admins here later?
    }
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

.grid-checkbox {
    display:           grid;
    grid-template-columns:  18em  2em  auto;
    grid-gap:          1px;
    padding:           8px;
}

.grid-editbuttons {
    display:           grid;
    grid-template-columns:  auto  auto;
    grid-gap:          1px;
    text-align:        center;
    margin-left:       16%;
    margin-top:        4%;
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

</style>
