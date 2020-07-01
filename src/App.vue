<template>
  <div id="app">
    <ZoomTop></ZoomTop>
  </div>
</template>

<script>
import ZoomTop from './components/topvue.vue'

export default {
  name: 'App',
  components: {
    ZoomTop
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
  margin-top: 1%;
}


:root {
  --bt-text-color:  #3c4e60;
  --bt-form-color:  #3322EE;
  --bt-form-text:   #1144FF;
  --bt-table-backgroud:   rgba(200, 190, 180, 0.3);
  --bt-zoom-blue:    #2c8eFF;
  --bt-zoom-form:    #2c8eFF;
  --bt-hover-color:  #e8f8f0;
}

body {
    position:   "relative";
    margin:     10px;
/*    background: url("./assets/zoom-w-cam.png")  fixed;*/
    color:    var( bt-text-color );
}

h2 {    /* used in topbar for main title */
  color:   var(--bt-zoom-blue);
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
    position:       relative;
    line-height:    normal;
    background-color: white;
    padding-left:   5px;
    height:         1.4em;
    border-color: #d8d8d8 #e8e8e8 #e8e8e8 #d8d8d8;
}


input:hover {
    background-color:   var(--bt-hover-color);
}

button {
    height:         2em;
    width:          10em;
    overflow:       visible;
    color:          var(--bt-form-text);
    background-color:  white;
    border-color:   var( --bt-zoom-blue );
    border-radius:  12px;
    padding-left:   5px;
    padding-right:  5px;
    margin:         2px;
}

button:hover {
    background-color:  var( --bt-hover-color );
}

/* Our generic form for addUser, etc */

.sb_form {
    text-align:       center;
    font-size:        1.0em;
    padding-top:      1em;
    background-color: var(--bt-table-backgroud) ;
    margin:           6px;
    padding:          12px;
}

label {
    color:          var(--bt-form-color);
    padding-right:  0.2em;
    float:          right;
    text-align:     right;
}

/* class for lining up form labels and controls, used in login, addUser */
.grid-2cols {
     display:           grid;
     grid-template-columns:  auto  auto;
     grid-gap:          4px;
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
    padding:      0.6em;
}

</style>
