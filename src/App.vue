<template>
  <div id="app">
    <img alt="Zoom logo" src="./assets/logo.png">
    <ZoomTop msg="Welcome to the Zoom link manager Vue.js App"/>
  </div>
</template>

<script>
import ZoomTop from './components/topvue.vue'
import addUser from './components/addUser.vue'
import login from './components/login.vue'

export default {
  name: 'App',
  components: {
    ZoomTop,
    login,
    addUser
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


:root {
  --bt-text-color:  #2c3e50;;
  --bt-form-color:  #3322EE;
  --bt-table-backgroud:   rgba(200, 190, 180, 0.3);
  --bt_button_main:  #fec256;
  --bt-zoom-blue:    #2c8eFF;
  --bt-zoom-form:    #2c8eFF;
}

body {
    position:   "relative";
    margin:     10px;
    background: url("./assets/zoom-w-cam.png")  fixed;
    color:#    var(  color: #2c3e50 );
}

h2 {    /* used in topbar for main title */
  font-size:    30px;
  font-weight:  500;
}

h3 {    /* used in most child components for form captions, etc. */
    color:   var(--bt-text-color);
}

h4 {
    color: #3399DD;
}

input {
    float:   left;
    width:   90%;
}

input:hover {
    background-color:   var(--bt-hover-color);
}

button {
    height:         2em;
    width:          12em;
    overflow: visible;
    background-color:  white;
    border-color:   var( --bt-zoom-blue );
    border-radius:  12px;
    padding-left:   5px;
    padding-right:  5px;
    margin:         1px;
}


/* Our generic form for addUser, addAction, etc */
.sb_form {
    position:     relative;
    left:         2em;
    width:        32%;
    font-size:    1.0em;
}

/* class for lining up form labels and controls, used in login, addUser */
.grid-2cols {
     display:           grid;
     grid-template-columns:  auto  auto;
     grid-gap:          4px;
     padding:           4px;
     font-size:         1.0em;
}

.errorMsg {
    color:      red;
    font-size:    20px;
    font-weight:  500;
    padding:      0.6em;
}

.resultMsg {
    font-size:    20px;
    font-weight:  500;
    text-align:   left;
    padding:      0.6em;
}

</style>
