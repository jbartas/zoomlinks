<template>
<div class="addUser" >
  <div class="place-form" >

    <form class="sb_form" v-on:submit.prevent  autocomplete="Chrome-sux" >
        <div class="form-title"
            title="You enter a name manually or click on a name in the lists below." 
            ref="info20"
        >
            Add/Remove a User or Admin from Group {{activeGroup.groupName}}
            <i class="fa fa-question-circle float-right"  @click="info_click( $refs.info20 )"></i>
            <br>
        </div>
        <div class="form-text" >
            <div>
                <div class="user-name-block" >
                    <label>Name: </label>
                    <input type=text v-model="userName" />
                </div>

                <div class="user-button" v-if="!nameIsMember()" >
                    <span class="button-text" >
                        Add {{userName}} to members? 
                    </span>
                    <button class="submit_user_button" v-on:click="userChange('add','user')" > Add </button>
                </div>
                <div class="user-button" v-if="nameIsMember()" >
                    <span class="button-text" >
                        Delete <strong>{{userName}}</strong> from member list??
                    </span>
                    <button class="submit_user_button" v-on:click="userChange('delete','user')" > Delete </button>
                </div>
                <div class="user-button" v-if="!nameIsAdmin()" >
                    <span class="button-text" >
                        Add <strong>{{userName}}</strong> to Admin list??
                    </span>
                    <button class="submit_user_button" v-on:click="userChange('add','admin')" > Add </button>
               </div> 
                <div class="user-button" v-if="nameIsAdmin()" >
                    <span class="button-text" >
                        Delete <strong>{{userName}}</strong> from Admin list??
                    </span>
                    <button class="submit_user_button" v-on:click="userChange('delete','admin')" > Delete </button>
               </div> 
            </div>
            <hr>
            <div class="grid-2cols" >
                <div class="form-title"> Users: </div> 
                <div class="form-title"> Admins: </div>
                <ul class="name-list" >
                    <li v-for="user in memberList"  :key="user.userName" 
                        v-on:click="userName = user.userName">
                        {{user.userName}} 
                    </li>
                </ul>
                <ul class="name-list" >
                    <li v-for="user in adminList"  :key="user.userName" 
                        v-on:click="userName = user.userName">
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
  props: {
      global: Object,
  },
  data() {
    return {
        isAdmin: false,
        activeGroup: {},    // group being modified
        userName: "",       // Name of user to add or remove      
        memberList: [],     // List of group members
        adminList: [],      // List of group admins
        networkError: "",
        resultStatus: "",
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
      userChange: function( operation, usertype ) {
          /* change status of a group user - either delete or add a user or admin.
           * The first step in all these is to get the user ID (which verifies name is OK)
           * Params: operation: "add" or delete", type: "user" or "admin"
           */
        console.log( "userChange: ", operation, usertype);
        let name = this.userName;
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
                this.resultStatus = "";
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
      nameIsMember: function() {
          let result = this.memberList.find( user => user.userName == this.userName);
          if( result ){
              return true;
          }
          return false;
      },
      nameIsAdmin: function() {
          return( this.adminList.find( 
                user => user.userName == this.userName )
          );
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

    this.activeGroup = this.global.activeGroup;

    console.log("groupUsers; create for group ", this.activeGroup);

    // Make sure logged in user is an admin of activeGroup 
    if( this.activeGroup ) {
      if( this.activeGroup.admins.find( id => id == this.global.loggedInID )) {
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

<style scoped>

.addUser{
    position:   relative;
    text-align: center;
}

.place-form {
    position:   relative;
    margin:     auto;
    max-width:  46em;
    padding:    2vw;
}

.user-name-block {
    display:            grid;
    grid-template-columns:  auto  auto;
    grid-gap:           6px;
    padding:            0.6em;
}

.user-button {
    padding:        0.2em;
    max-width:      35em;
    display:        grid;
    grid-template-columns:  auto  7em;
    grid-gap:       0.9em;
}

.button-text {
    text-align:     right;
}

.grid-2cols {
    text-align:     left;
    display:        grid;
    grid-template-columns:  50%  50%;
    grid-gap:       0.1em;
}

label {
    color:      var(--bt-form-text)
}

input {
    padding-right:    3em;
}

.form-text {
    top:            0.1em;
    position:       relative;
    color:          var(--bt-form-color);
    padding-top:    2vw;
}

.form-title {
    position:   relative;
    color:      var(--bt-form-text);
    font-size:  1.2em;
    padding:    5px;
}

.name-list {
    background-color:   #f6f6fb;
    font-size:          1.1em;
}

.name-list:hover {
    cursor:         pointer;
}

.submit_user_button {
    position:       relative;
    max-width:      6em;
}

</style>


