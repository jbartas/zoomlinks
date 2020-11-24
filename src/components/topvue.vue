<template>
  <div class="topvue">

    <div id="topbar" class="topbar">
    <div class="top-3cols" >
      <!-- Column 1  - logo and easy way to click back home -->
      <a href="/" >
       <img src="../assets/logo.png" alt="logo" width="140" v-if="globals.portrait != true" >
       <img src="../assets/logo.png" alt="logo" width="105" v-if="globals.portrait == true" >
      </a> 
      <div> <!-- Column 2 -->
          <span class="top-title">
              LinkShare
          </span>
          <div v-if="globals.portrait == false" class="toptext">
            A way to share Zoom, chat and other links<br>
          </div>
      </div>
      <!-- Column 3 - dual buttons (desktop) or menu icon (mobile) -->
      <div class="topbuttons" v-if="globals.portrait == false" >  <!-- Column 3 -->
          <button  v-on:click="showApp( 'login')" > 
              Log {{globals.loggedInStatus == true?'Out':'In'}} </button>
          <button  v-on:click="showApp( 'addUser')" >
              Create Account</button>
      </div>
      <div class="menuicon" v-if="globals.portrait" v-on:click="hide_nav = !hide_nav" > 
        <i class="fa fa-bars"></i> 
      </div>
    </div>  <!-- end of 3cols -->
    <div>
      <span class="toptext-span">
      {{loggedInText}}
      </span>
      <span class="toptext-span"> - 
      </span>
      <span class="toptext-span">
      {{ActiveGroupText}}
      </span>
    </div>  <!-- end of info status spans -->

    <div class="nav_wrapper" v-if="hide_nav != true" >
      <div v-bind:class="globals.portrait?'nav_tall':'nav_wide'">   <!-- navigation tabs -->
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
          <div v-if="globals.loggedInStatus == true" v-on:click="showApp( 'listslist')"> 
              <i class="fa fa-wrench"></i> Lists </div>
        </div>
        <div class="navtab">
          <div v-on:click="showApp( 'about')"> 
              <i class="fa fa-question-circle"></i> About... </div>
        </div>
      </div>
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
    <listslist  :global = "globals" v-if="globals.renderApp == 'listslist'" />
    <about       v-if="globals.renderApp == 'about'" />
    <addGroup   :global = "globals" v-if="globals.renderApp == 'addGroup'" />
    <listGroups :global = "globals" v-if="globals.renderApp == 'listGroups'  
                 || globals.renderApp == 'groups'" />
    <groupLinks :global = "globals" v-if="globals.renderApp == 'groupLinks'" />
    <groupUsers :global = "globals" v-if="globals.renderApp == 'groupUsers'" />
    <editList   :global = "globals" v-if="globals.renderApp == 'editList'" />


</div> <!-- end top_view -->
</template>

<script>
import login from '../components/login.vue'
import addUser from '../components/addUser.vue'
import addLink from '../components/addLink.vue'
import linkList from '../components/linkList.vue'
import groups from '../components/groups.vue'
import listslist from '../components/listslist.vue'
import editList from '../components/editList.vue'
import about from '../components/about.vue'
import listGroups from '../components/listGroups.vue'
import groupLinks from '../components/groupLinks.vue'
import addGroup from '../components/addGroup.vue'
import groupUsers from '../components/groupUsers.vue'

import { EventBus } from '../components/eventBus.js';


export default {
  name: 'ZoomTop',
  components: {
    login,
    addUser,
    addLink,
    linkList,
    groups,
    listslist,
    editList,
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
          sessionHash: null,
          editLink: null,       // For passing link fields to editor
          editList: null,       // Passing links list to editor
          urlParams: {},        // params from the invoking URL
          portrait: false,       // true if in portrait mode, false for landscape.
      },

      ActiveGroupText: "No active Group",
      loggedInText: "Not Logged In",   // generated from loggedInStatus and loggedInName
      GUESTUSER: "guest",        // const

      hide_nav: false,      // hide nav panel (for phones)
    }
  },
  methods: {
    showApp: function( appName ) {
      console.log( "showApp: ", appName  );

      // If on phone, hide the menu after selection
      if( this.globals.portrait == true) {
        this.hide_nav = true;
      }
      if( appName == "login" && this.globals.loggedInStatus == true ) {
        // Handle "log out" button from top bar.
        this.globals.loggedInStatus = false;
        localStorage.setItem("session", JSON.stringify( this.globals ));
      }

      // load next app
      this.globals.renderApp = appName;
    },
    parseURLParams: function() {
      /* URL params are things like "user" and "group" which let the invoker 
       * go directly to an internet location inside linkshare, for example 
       * going straight to a group being accessed as "guest".
       */
      let uri = window.location.href.split('?');
      if (uri.length < 2) {
        return;
      }
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
          this.showApp("groupLinks");
      }

      // Send out search Query
      if( this.globals.urlParams.search ) {
          console.log( "Emit SEARCH_QUERY ", this.globals.urlParams.search );
          EventBus.$emit('SEARCH_QUERY', this.globals.urlParams.search );
      }

    },
    setPortraitMode: function() {
      console.log("setPortraitMode, Window.width ", window.outerWidth );

      /* Figure out if this should get the portrait display (phones) or the 
       * real computer disp[lay.
       */
      if( window.outerWidth < window.outerHeight ) {
        console.log("Do vertical/phone GUI");
        this.globals.portrait = true;
        this.hide_nav = true;
      }
      else {
        console.log("Do horizontal GUI");
        this.globals.portrait = false;
      }
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
    },
    'window.outerWidth': function() {   // watch doesn't work? 
        this.setPortraitMode();
    }
  },
  created : function() {

    if (typeof(Storage) !== "undefined") {
      // Code for localStorage.
      let session = localStorage.getItem("session");
      console.log( "localStorage.getItem(session):", session );
      if( !session ) {
        /* First time here? */
        /*
        let msg = "<strong>Welcome to Linkshare!</strong> <br> Some options: <br> - Watch an intro video ";
        msg += "<br> - Create a new account <br> - Log In";
        this.$swal.fire( { html: msg } );
        */
      }
      else {
        // User was here before, check for open session
        this.globals = JSON.parse( session );
        console.log( "session (global) data:", this.globals );
        if( this.globals.loggedInStatus == true ) {
          this.showApp( "linkList" );
        }
      }

    } else {
      console.log("No Web Storage support");
    }
    /* Handle any parameters which were appended to the initial
     * URL which invoked the web site. 
     */
    console.log("Invoking URL: ",  window.location.href );
    this.parseURLParams();

    this.setPortraitMode();   // vertical (phone) or horizontal (screen)? 

    // Save global data (URL, portrait) in local browser storage.
    localStorage.setItem("session", JSON.stringify( this.globals ));
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

/* Outer container for the entire GUI */
.topvue {
    color:      var(--bt-zoom-form);
    overflow:   hidden; /* Hide horizontal scrollbar */
    min-height:     50vw;
}


/* this is the top area for every page in the GUI. */
.topbar {
    position:       relative;
    max-width:      1000px;   /* Max width for whole site.  */
    margin:         auto;
}

.top-3cols {
     display:           grid;
     grid-template-columns:  140px  auto  9em;
     grid-gap:          4px;
}

.topbuttons {
    position:   relative;
    padding:    8px;
}

/* A wide nav bar for screens */
.nav_wide {
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

/* A tall nav bar for phones */
.nav_tall {
    position:   relative;
    margin:     auto;
    border:     2px solid var( --bt-zoom-blue );
    box-shadow: 4px 6px  var(--bt-table-backgroud);
    display:    grid;
    grid-template-columns:  auto auto;
    grid-gap:   4px;
    text-align: left;
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

.menuicon {
    width:              2.2em;
    font-size:          2.0em;
}

.nav_wrapper {
    position:   relative;
    margin:     auto;
    min-height: 3.2em;
}

.top-title {
    padding:      8px;
    font-size:    1.6em;
}

.toptext {
    position:     relative;
    margin:       auto;
}

.toptext-span {
    font-weight:  600;
}

</style>
