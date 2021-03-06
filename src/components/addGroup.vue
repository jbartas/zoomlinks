<template>
<div class="addgroup">

  <div class="form-title" >
      Create a New Group
  </div>
  <div class="form-sub-title" v-if="editing == null" 
      title="You will be the admin of this group. You may add other admins 
        after the group is created. ">
    You ({{userName}}) will be group admin. <br>
    Click on <i class="fa fa-question-circle"></i> icons for help.
  </div>
  <div class="form-sub-title" v-if="editing" 
      title="You can change fields for this group, including adding users, and admins. ">
    Editing Group {{editing.groupName}}. 
    Questions? Hover over entry fields for help <i class="fa fa-question-circle"></i>
  </div>

  <form class="place-form sb_form" v-on:submit.prevent  autocomplete="Chrome-sux" >
    <div title="Name is Case insensitive with no spaces. It will be checked for uniqueness." 
        ref="info1" >
        <div class="form-text" >
            Please choose a name for your group. 
            <i class="fa fa-question-circle float-right"  @click="info_click( $refs.info1 )"></i><br>
        </div>
        <div class="grid-2cols" >
            <label>Group Name:</label>
            <div class="input-box" >
                <input name="groupName" v-model="groupName"  placeholder="group-name (required)"
                    v-on:blur="checkData( 'groupName' )" />
            </div>
        </div>      <!-- end grid-2cols -->
    </div>      <!-- end Group name area -->
    <br>
    <div class="form-text"  ref="info2"  @click="info_click( $refs.info2 )" 
        title="Both these fields will be used when searching for the group." >
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

    <div class="form-text" ref="info3"  @click="info_click(  $refs.info3 )"
    title=
    "    public - Anyone can view the links, but only only group members can write or edit links. 
<br> private - Only group members can view the group's links. 
        Admin(s) must add members in the 'manage group' page. 
    "
    >
        Please make your group <strong> 'Public' </strong>  or <strong> 'private'</strong>.
            <i class="fa fa-question-circle float-right" ></i>
    </div>
    
    <div class="grid-5cols" >
        <label>Group Type:</label>
        <span class="offset" > 
            Public </span>
        <input type="radio" value="public"  class="radios" v-model="groupType" />
            Private
        <input type="radio" value="private" class="radios" v-model="groupType" />
    </div>      <!-- end grid-2cols -->
    <br>
    <hr>
    <div class="form-text" ref="info4" 
    title="Password are required for private groups. 
    On public groups they will be required for adding or changing links."  >
        <i class="fa fa-question-circle float-right"  @click="info_click(  $refs.info4 )"></i>
        <div class="grid-checkbox" >
            <span class="shortbox" >
                Use a group Password for editing links?
            </span>
            <input type=checkbox class="radios" v-model="doPassword" />
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
import restapi from "../restapi.js";
const bcrypt = require('bcryptjs');

export default {
  name: 'addGroup',
  props: {
      global: Object,
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
    info_click: function( info ) {
        /* Display 'title' text to help out user */
        let alerthtml = "<span style='font-family: Avenir, Helvetica, Arial, sans-serif; \
            color=red ' >" +
            info.title + "</span>"; 
        this.$swal.fire( { html: alerthtml } );
    },
    /* Basically the "submit" handler */
    createGroup: function  () {

        this.networkError = "";   // no error yet

        if( this.groupName == null || this.groupName == "" || this.groupName.indexOf(" ") != -1 ) {
            this.resultStatus = "Group Name is required, and must not have any spaces";
            return;
        }

        this.resultStatus = "Creating group " + this.groupName;
        console.log("Create group; name: ", this.groupName );

        /* hash the password */
        let hashPW = bcrypt.hashSync( this.password, 10);
        let userId = this.global.loggedInID;
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

        restapi.post( "/newGroup", newGroup )
        .then( reply => {
            // eslint-disable-next-line
            console.log( "addGroup; reply: ", reply );
            this.resultStatus = "New Group " + this.groupName + " created.";
            this.global.activeGroup = newGroup;
            this.global.renderApp = "editGroup";
        }).catch( error =>  {
            // eslint-disable-next-line
            console.log( error );
            this.networkError = error;
            this.resultStatus = "";
        });

    },
    checkData: function ( queryField ) {
        /* method to check a just-entered groupName or password to 
         * see if it already exists in the database and warn the user if so.
         */
        let url = "/getGroupInfo/";
        this.networkError = "";   // no error yet
        this.resultStatus = "";   // no status, either.

        // See if we issue query for newUserName.
        if( queryField == "groupName"  && this.groupName != "" ) {
            url += this.groupName;
        }
        else {
            return;
        }

        // eslint-disable-next-line
        console.log( "getGroupRecord request url: ", url );
        
        restapi.get( url )
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
    this.userName = this.global.loggedInName;
    this.editing = this.global.activeGroup;

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

i {
    /* the "?" icons */
    font-size:  1.3em;
}

/* Over-write default 2cols */
.grid-2cols {
     display:           grid;
     grid-template-columns:  30%  auto;
     grid-gap:          4px;
}

.grid-checkbox {
    display:           grid;
    grid-template-columns:  auto  auto;
    grid-gap:          1px;
    padding:           4px;
    padding-top:       12px;
    padding-bottom:    12px;
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
    width: 20em;
    max-width: 54vw;
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
    grid-gap:          5px;
    text-align:        right;
}

.offset {
    margin-left: 2em;
}

.radios {
    max-width:  1em;
}

.shortbox {
    max-width: 58vw;
}

.place-error
{
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
