<template>
<div class="addUser" >
  <div class="place-form" >

    <form class="sb_form" v-on:submit.prevent  autocomplete="Chrome-sux" >
        <div class="form-title">
            Add/Remove a User or Admin from Group {{activeGroup.groupName}}
        </div>
        <div class="form-text" >
            <div class="grid-controls" 
              title="You can cut and paste names from lists below, or just click on the name." >

                <label> Name of User: </label>
                <input type=text v-model="userName" />
                <button class="submit_button" v-on:click="userChange('add','user')" > Add </button>
                <button class="submit_button" v-on:click="userChange('delete','user')" > Delete </button>

                <label> Name of Admin: </label>            
                <input type=text v-model="adminName" />
                <button class="submit_button" v-on:click="userChange('add','admin')" > Add </button>
                <button class="submit_button" v-on:click="userChange('delete','admin')" > Delete </button>
            </div>
            <hr>
            <div class="grid-2cols" >
                <div class="form-title"> Users: </div> 
                <div class="form-title"> Admins: </div>
                <ul class="name-list" >
                    <li v-for="user in memberList"  :key="user.userName" 
                        v-on:click="adminName = user.userName">
                        {{user.userName}} 
                    </li>
                </ul>
                <ul class="name-list" >
                    <li v-for="user in adminList"  :key="user.userName" 
                        v-on:click="adminName = user.userName">
                        {{user.userName}} 
                    </li>
                </ul>
            </div>
        </div>
    </form>

    <div class="place-error" >
        <div class="errorMsg" >
            {{networkError}}
        </div>
        <div class="resultMsg" >
            {{resultStatus}}
        </div>
    </div>

  </div>  <!-- end class="place-form" -->
</div>  <!-- end class="addUser" -->
</template>


<script>
import restapi from "../restapi.js";

export default {
  name: 'groupUsers',
  data() {
    return {
        isAdmin: false,
        activeGroup: {},    // group being modified
        userName: "",       // Name of user to add or remove      
        adminName: "",      // Name of admin to add or remove
        memberList: [],     // List of group members
        adminList: [],      // List of group admins
        networkError: "",
        resultStatus: "",
    }
  },
  methods: {
      userChange: function( operation, usertype ) {
          /* change status of a group user - either delete or add a user or admin.
           * The first step in all these is to get the user ID (which verifies name is OK)
           * Params: operation: "add" or delete", type: "user" or "admin"
           */
        console.log( "userChange: ", operation, usertype);
        let name = this.userName;
        if( usertype == "admin" ) {
            name = this.adminName;
        }
        let cmd = {
            operation: operation,
            usertype: usertype,
            userName: name,
            groupName: this.activeGroup.groupName
        }

        restapi.post( "/setGroupUsers", cmd )
        .then( response => {
            if( response.status != "200" ) {
                console.log( "setGroupUsers: status: ", response.status );
                this.networkError = response.status;
            }
            else {
                console.log( "setGroupUsers; response: ", response );

                if( response.data.status == "error" ) {
                    this.resultStatus = response.data.message;
                    return;
                }
                this.activeGroup = response.data.updatedGroup;

                // fix up the display screen
                this.adminName = "";
                this.userName = "";
                this.getMembers();
                this.getAdmins();
            }
        }).catch( error =>  {
            // eslint-disable-next-line
            console.log( "getMembers: get error", error );
            this.networkError = error;
        }); 
      },
      getMembers: function() {
          // pass list of group members IDs to server to get names
          this.getUserList( this.activeGroup.members )
      },
      getAdmins: function() {
          // pass list of group members IDs to server to get names
          this.getUserList( this.activeGroup.admins )
      },
      getUserList: function( idList ) {
        // list of IDs passed is users or admins.
        // This is a .post instead of .get because of list passing issues.

        console.log( "getUserList; list: ", idList );
        restapi.post( "/getUserList", idList )
        .then ( response => {
            if( response.status != "200" ) {
                console.log( "getUserList: status: ", response.status );
                this.networkError = response.status;
            }
            else {
                console.log( "getUserList; response: ", response );
                // Hack to avoid a promise/callback
                if( idList == this.activeGroup.members ) {
                    console.log( "getUserList: members: ", response.data.userList.length );
                    this.memberList = response.data.userList;
                }
                else {
                    console.log( "getUserList: admins: ", response.data.userList.length );
                    this.adminList = response.data.userList;
                }
            }
        }).catch( error =>  {
            // eslint-disable-next-line
            console.log( "getUserList: get error", error );
            this.networkError = error;
        }); 
      },
  },
  created: function() {

    this.activeGroup = this.$parent.activeGroup;

    console.log("groupUsers; create for group ", this.activeGroup);

    // Make sure logged in user is an admin of activeGroup 
    if( this.activeGroup ) {
      if( this.activeGroup.admins.find( id => id == this.$parent.loggedInID )) {
        this.isAdmin = true;
      }
    }
    // User should not be able to get here if not admin.
    if( !this.isAdmin ) {
      alert( "To use this page you must log in as an admin of the active group." );
      return;
    }

    this.getMembers();      // get the names of the admins and members
    this.getAdmins();

  }
}
</script>

<style>

.addUser{
    position:   relative;
    text-align: center;
}

.place-form {
    position:   relative;
    margin:     auto;
    max-width:  42em;
    padding:    2em;
}

/* Over-write default 2cols */
.grid-controls {
    display:           grid;
    grid-template-columns:  9em  auto  5em 6em;
    grid-gap:          4px;
}

.grid-2cols {
    position:       relative;
    top:            1em;
    text-align:     left;
    display:       grid;
    grid-template-columns:  50%  50%;
    grid-gap:      4px;
}

label {
    color:      var(--bt-form-text)
}

input {
    padding-right:    3em;
}

.form-text {
    top:        0.1em;
    position:   relative;
    color:      var(--bt-form-color);
    padding:    6px;
}

.form-title {
    position:   relative;
    color:      var(--bt-form-text);
    font-size:  1.2em;
    padding:    5px;
}

.name-list {
    background-color:   #f6f6fb;
}

.submit_button {
    position:   relative;
    max-width:  5em;
}

</style>


