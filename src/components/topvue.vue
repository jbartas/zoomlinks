<template>
  <div class="topvue">

    <div id="topbar" class="topbar">
    <table border=0 width=100% >
      <tr><td width=12% >
		<!-- give myself an easy way to click back home -->
		<a href="/" >
			<img src="../assets/logo.png" alt="logo">
		</a> 
        </td><td width=70% >
          <h2 title="A 'Digital twin' is a database with information about a physical object - in this case, your body.">
              BioMoods - Your Biological Digital Log
          </h2>
        </td><td>
		<div class="topbuttons">
          <a href="/logout"><button> Log Out </button></a>
          <a href="/addUser"><button>Create Account</button></a>
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
      </nav>
    </div> <!-- end nav_wrapper -->

  </div> <!-- end topbar -->
</div> <!-- end top_view -->
</template>

<script>
export default {
  name: 'ZoomTop',
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
      loggedInName: ""
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.topbar {
  position:       relative;
  left:           2%;
  width:          78%;
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
    float:          left;
    position:       relative;
    top:            0em;
    margin:         4px;
    bottom:         0.5em;
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
    padding-right:       12px;
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

