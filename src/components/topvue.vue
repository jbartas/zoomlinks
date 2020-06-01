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
          A way to share Zoom, chat and other links
        </td><td>
		<div class="topbuttons">
          <button  v-on:click="showApp( 'login')" > Log {{loggedInStatus == 'Not Logged in.'?'In':'Out'}} </button>
          <button  v-on:click="showApp( 'addUser')" >Create Account</button>
		</div>
		<div id="loggedin" >
         {{loggedInStatus}}
		</div>
    </td></tr>
    </table>

    <div class="nav_wrapper">
      <nav>   <!-- navigation tabs -->
        <div  v-if="loggedInStatus == 'Not Logged in.'"  class="navtab" >
            <div v-on:click="showApp( 'login')">
        <i  class="fa fa-key"></i> Login </div>
        </div>
        <div class="navtab">
          <div v-on:click="showApp( 'addUser')"> 
              <i class="fa fa-child"></i> Create Account </div>
        </div>
        <div class="navtab">
          <div v-if="loggedInStatus != 'Not Logged in.'" v-on:click="showApp( 'addLink')"> 
              <i class="fa fa-link"></i> Add Link </div>
        </div>
        <div class="navtab">
          <div v-if="loggedInStatus != 'Not Logged in.'" v-on:click="showApp( 'linkList')"> 
              <i class="fa fa-list"></i> My Links </div>
        </div>
      </nav>
    </div> <!-- end nav_wrapper -->

    <login      v-if="renderApp == 'login'" />
    <addUser    v-if="renderApp == 'addUser'" />
    <addLink    v-if="renderApp == 'addLink'" />

  </div> <!-- end topbar -->
</div> <!-- end top_view -->
</template>

<script>
import login from '../components/login.vue'
import addUser from '../components/addUser.vue'
import addLink from '../components/addLink.vue'

export default {
  name: 'ZoomTop',
  components: {
    login,
    addUser,
    addLink
  },
  props: {
    msg: String
  },
  data() {
    return {
      /* These are referenced by child modules, don't change their names unless you 
       * are willing to make the changes in all the children.
       */
      baseURL: "http://3.219.109.170:3000/api",
      renderApp: "login",
      loggedInStatus: "Not Logged in.",
      loggedInName: "",
      userEmail: ""
    }
  },
  methods: {
    showApp: function( appName ) {
      // eslint-disable-next-line
      console.log( "showApp: ", appName  );
      this.renderApp = appName;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.topbar {
    position:       relative;
    left:           20%;
    width:          60%;
    align-self:     center;
    align-items:    center;
    justify-content: center;
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
    float:          left;
    margin:         4px;
    bottom:         0.4em;
    border-radius:  15px;
    color:        white;
    background:     var( --bt-form-color);
    display:        flex;
    flex-direction: row;
}

.navtab {
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
    width:      94%;
    height:     3em;
}


</style>
