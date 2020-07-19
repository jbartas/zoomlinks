<template>
  <div class="topvue">

    <div id="topbar" class="topbar">
    <table border=0 width=100% >
      <tr><td width=12% >
		<!-- give myself an easy way to click back home -->
		<a href="/" >
			<img src="../assets/logo.png" alt="logo" width="140px" >
		</a> 
        </td><td width=70% >
          <h2>
              LinkShare
          </h2>
          <div class="toptext">
          A way to share Zoom, chat and other links<br>
          </div>
          <span class="toptext-span">
          {{loggedInText}}
          </span>
          <span class="toptext-span"> - 
          </span>
          <span class="toptext-span">
          {{ActiveGroupText}}
          </span>

        </td><td>
		<div class="topbuttons">
          <button  v-on:click="showApp( 'login')" > Log {{globals.loggedInStatus == true?'Out':'In'}} </button>
          <button  v-on:click="showApp( 'addUser')" >Create Account</button>
		</div>
    </td></tr>
    </table>

    <div class="nav_wrapper">
      <nav>   <!-- navigation tabs -->
        <div  v-if="globals.loggedInStatus == false"  class="navtab" >
            <div v-on:click="showApp( 'login')">
        <i  class="fa fa-key"></i> Login </div>
        </div>
        <div class="navtab">
          <div v-on:click="showApp( 'addUser')"> 
              <i class="fa fa-child"></i> Create Account </div>
        </div>
        <div class="navtab">
          <div v-if="globals.loggedInStatus == true" v-on:click="showApp( 'addLink')"> 
              <i class="fa fa-link"></i> Add Link </div>
        </div>
        <div class="navtab">
          <div v-if="globals.loggedInStatus == true" v-on:click="showApp( 'linkList')"> 
              <i class="fa fa-list"></i> My Links </div>
        </div>
        <div class="navtab">
          <div v-if="globals.loggedInStatus == true" v-on:click="showApp( 'groups')"> 
              <i class="fa fa-group"></i> Groups </div>
        </div>
        <div class="navtab">
          <div v-if="globals.loggedInStatus == true" v-on:click="showApp( 'requests')"> 
              <i class="fa fa-wrench"></i> requests </div>
        </div>
        <div class="navtab">
          <div v-on:click="showApp( 'about')"> 
              <i class="fa fa-question-circle"></i> About... </div>
        </div>
      </nav>
    </div> <!-- end nav_wrapper -->
  </div> <!-- end topbar -->

    <login      :global = "globals" v-if="globals.renderApp == 'login'" />
    <addUser    :global = "globals" v-if="globals.renderApp == 'addUser'" />
    <addLink    :global = "globals" v-if="globals.renderApp == 'addLink'" />

    <div v-if="globals.renderApp == 'linkList'">
      <linkList :global = "globals" 
        linksfor = "user"
      />
    </div>

    <groups     :global = "globals" v-if="globals.renderApp == 'groups'" />
    <requests    v-if="globals.renderApp == 'requests'" />
    <about       v-if="globals.renderApp == 'about'" />
    <addGroup   :global = "globals" v-if="globals.renderApp == 'addGroup'" />
    <listGroups :global = "globals" v-if="globals.renderApp == 'listGroups'  
                 || globals.renderApp == 'groups'" />
    <groupLinks :global = "globals" v-if="globals.renderApp == 'groupLinks'" />
    <groupUsers :global = "globals" v-if="globals.renderApp == 'groupUsers'" />


</div> <!-- end top_view -->
</template>

<script>
import login from '../components/login.vue'
import addUser from '../components/addUser.vue'
import addLink from '../components/addLink.vue'
import linkList from '../components/linkList.vue'
import groups from '../components/groups.vue'
import requests from '../components/requests.vue'
import about from '../components/about.vue'
import listGroups from '../components/listGroups.vue'
import groupLinks from '../components/groupLinks.vue'
import addGroup from '../components/addGroup.vue'
import groupUsers from '../components/groupUsers.vue'


export default {
  name: 'ZoomTop',
  components: {
    login,
    addUser,
    addLink,
    linkList,
    groups,
    requests,
    about,
    addGroup,
    listGroups,
    groupLinks,
    groupUsers
  },
  props: {
    msg: String
  },
  data() {
    return {
      globals: {
          /* "globals" is the master list of global data. Don't change  
          * the names unless you are willing to make the changes in all 
          * the components.
          */
          renderApp: "login",   // App page to display
          loggedInStatus: false,
          loggedInName: "",
          loggedInID: "",
          activeGroup: null,    // group currently in use, null if none
          userEmail: "",
          editLink: null,       // For passing link fields to editor
          urlParams: {},        // params from the invoking URL
      },

      ActiveGroupText: "No active Group",
      loggedInText: "Not Logged In",   // generated from loggedInStatus and loggedInName
      GUESTUSER: "guest",        // const

      baseURL: "http://3.212.103.152:3001/zlapi",   // move to restapi
    }
  },
  methods: {
    showApp: function( appName ) {
      // eslint-disable-next-line
      console.log( "showApp: ", appName  );
      this.globals.renderApp = appName;
    }
  },
  watch: {
    'globals.loggedInName': function() {
        if( this.globals.loggedInStatus == true) {
            this.loggedInText = "Logged in as " + this.globals.loggedInName ;
        }
        else {
            this.loggedInText = "Not Logged in" ;
        }
    },
    'globals.activeGroup': function() {
        if( this.globals.activeGroup ) {
            this.ActiveGroupText = "Active group is " + this.globals.activeGroup.groupName ;
        }
        else {
            this.ActiveGroupText = "No active group" ;
        }

    }
  },
  created : function() {
    /* This handles any parameters which were appended to the initial
     * URL which invoked the web site. These are things like "user" 
     * and "group" which let the invoker go directly to an internet 
     * location inside linkshare, for example going straight to a group 
     * being accessed as "guest".
     * */
    console.log("Invoking URL: ",  window.location.href );
    let uri = window.location.href.split('?');
    if (uri.length == 2)
    {
      let vars = uri[1].split('&');
      let tmp = '';
      let params = {};
      vars.forEach(function(v){
        tmp = v.split('=');
        if(tmp.length == 2)
          params[tmp[0]] = tmp[1];
      });
      this.globals.urlParams = params;     // save for other pages
      console.log( "urlParams: ", this.globals.urlParams );

      if( !this.globals.urlParams.user ) {
          console.log( "urlParams: no user." );
          return;   // can't do anything without a user
      }

      // If user is not guest, this make sure they're logged in.
      if( this.globals.urlParams.user != this.GUESTUSER ) {
          console.log( "urlParams: user not guest." );
          if( (!this.globals.loggedInStatus) || (this.globals.urlParams.user != this.loggedInName) ) {
              console.log( "urlParams: non-guest user not logged in." );
              this.globals.urlParams.user = null;
              return;   // Do nothing, will default to login page
          }
      }
      else {    // log in guest user
          console.log( "urlParams: logging in guest." );
          this.globals.loggedInName = this.GUESTUSER;
          this.globals.loggedInStatus = true;
      }

      // only handle user param once per invocation
      this.globals.urlParams.user = null;

      // Fall to here if user is "guest" or logged-in non-guest
      if( this.globals.urlParams.app == "linkList" ) {
          this.showApp("linkList");
      }
      else if( this.globals.urlParams.app == "groupLinks" ) {
          //this.activeGroup = write a generic group finder
          this.showApp("groupLinks");
      }
    }    
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

/* this contains the entire site. */
.topbar {
    position:       relative;
    max-width:      1000px;   /* Max width for whole site.  */
    margin:         auto;
}

.topvue {
    color: var(--bt-zoom-form);
}

.topbuttons {
    position:   relative;
    left:       5%;
    right:      13%;
    padding:    8px;
}

nav {
    position:       relative;
    top:            0.6em;
    max-width:      49em;  /* Adjust if adding/removing tabs */
    margin:         auto;
    bottom:         0.4em;
    border-radius:  15px;
    color:        white;
    background:     var( --bt-form-color);
    display:        flex;
    flex-direction: row;
    align-items:    center;
}

.navtab {
    position:   relative;
    margin:             4px;
    padding:            4px;
    padding-left:       12px;
    padding-right:      12px;
    border-radius:      11px;
    font-size:          1.1em;
    line-height:        1.2em;
}

.navtab:hover {
    background-color:   var( --bt-zoom-blue );
    color:              #FFEE11;
}

.nav_wrapper {
    position:   relative;
    margin:     auto;
    min-height: 3.2em;
}

.toptext {
    position:     relative;
    margin:       auto;
}

.toptext-span {
    font-weight:  600;
}

</style>
