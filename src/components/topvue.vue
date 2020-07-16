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
          <button  v-on:click="showApp( 'login')" > Log {{loggedInStatus == true?'Out':'In'}} </button>
          <button  v-on:click="showApp( 'addUser')" >Create Account</button>
		</div>
    </td></tr>
    </table>

    <div class="nav_wrapper">
      <nav>   <!-- navigation tabs -->
        <div  v-if="loggedInStatus == false"  class="navtab" >
            <div v-on:click="showApp( 'login')">
        <i  class="fa fa-key"></i> Login </div>
        </div>
        <div class="navtab">
          <div v-on:click="showApp( 'addUser')"> 
              <i class="fa fa-child"></i> Create Account </div>
        </div>
        <div class="navtab">
          <div v-if="loggedInStatus == true" v-on:click="showApp( 'addLink')"> 
              <i class="fa fa-link"></i> Add Link </div>
        </div>
        <div class="navtab">
          <div v-if="loggedInStatus == true" v-on:click="showApp( 'linkList')"> 
              <i class="fa fa-list"></i> My Links </div>
        </div>
        <div class="navtab">
          <div v-if="loggedInStatus == true" v-on:click="showApp( 'groups')"> 
              <i class="fa fa-group"></i> Groups </div>
        </div>
        <div class="navtab">
          <div v-if="loggedInStatus == true" v-on:click="showApp( 'requests')"> 
              <i class="fa fa-wrench"></i> requests </div>
        </div>
        <div class="navtab">
          <div v-on:click="showApp( 'about')"> 
              <i class="fa fa-question-circle"></i> About... </div>
        </div>
      </nav>
    </div> <!-- end nav_wrapper -->
  </div> <!-- end topbar -->

    <login      v-if="renderApp == 'login'" />
    <addUser    v-if="renderApp == 'addUser'" />
    <addLink    v-if="renderApp == 'addLink'" />

    <div v-if="renderApp == 'linkList'">
      <linkList 
        linksfor = "user"
      />
    </div>

    <groups     v-if="renderApp == 'groups'" />
    <requests   v-if="renderApp == 'requests'" />
    <about      v-if="renderApp == 'about'" />
    <addGroup   v-if="renderApp == 'addGroup'" />
    <listGroups v-if="renderApp == 'listGroups' || renderApp == 'groups'" />
    <groupLinks v-if="renderApp == 'groupLinks'" />
    <groupUsers v-if="renderApp == 'groupUsers'" />


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
      /* PUBLIC */
      /* These are referenced by child modules, don't change their names unless you 
       * are willing to make the changes in all the children.
       */
      baseURL: "http://3.212.103.152:3001/zlapi",
      renderApp: "login",
      loggedInStatus: false,
      loggedInName: "",
      loggedInID: "",
      activeGroup: null,    // group currently in use, null if none
      userEmail: "",
      editLink: null,       // For passing link fields to editor
      ActiveGroupText: "No active Group",

      /* PRIVATE - you can mess with this if you want. */
      loggedInText: "Not Logged In"    // generated from loggedInStatus and loggedInName
    }
  },
  methods: {
    showApp: function( appName ) {
      // eslint-disable-next-line
      console.log( "showApp: ", appName  );
      this.renderApp = appName;
    }
  },
  watch: {
    'loggedInName': function() {
        if( this.loggedInStatus == true) {
            this.loggedInText = "Logged in as " + this.loggedInName ;
        }
        else {
            this.loggedInText = "Not Logged in" ;
        }
    },
    'activeGroup': function() {
        if( this.activeGroup ) {
            this.ActiveGroupText = "Active group is " + this.activeGroup.groupName ;
        }
        else {
            this.ActiveGroupText = "No active group" ;
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
