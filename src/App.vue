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
  margin: 1%;
}


:root {
  --bt-text-color:  #3c4e60;
  --bt-form-color:  #3322EE;
  --bt-dark-text:   #0033DD;
  --bt-form-text:   #1144FF;
  --bt-table-backgroud:   rgba(200, 190, 180, 0.3);
  --bt-zoom-blue:    #2c8eFF;
  --bt-zoom-form:    #2c8eFF;
  --bt-hover-color:  #e8f8f0;
}

body {
    position:   "relative";
    margin:     auto;
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
    background-color: var(--bt-table-backgroud);
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

/* tall (mobile, phones) version of form control setup */
.controls-tall {
    display:           grid;
    grid-template-columns:  auto  auto;
    grid-row-gap:      1em;
    grid-column-gap:   0.5em;    
    max-width:         94vw;
}

.tile-wrapper {
    position:   relative;
    padding-top:        0.7em;
    padding-bottom:     0.3em;
    background-color:   var( --bt-table-backgroud );
}

.tile-item {
    height:         1.1em;
    width:          21em;
    max-width:      64vw;
    margin:         3px;
    padding:        3px;
    color:          var( --bt-dark-text );
    overflow:       hidden;
    white-space:    nowrap;
}

.tile_title {
    font-weight:    700;
}

.one-tile {
    border-radius:  6px;
    width:          30em;
    max-width:      93vw;
    margin:         6px;
    padding:        4px;
    text-align:     left;
    background-color:   white;
}

.tile-2cols {
    display:           grid;
    grid-template-columns:  8em  22em;
    grid-gap:          4px;
}

.tile-button {
    position:   relative;
    width:      1.6em;
    max-width:  1.6em;
    height:     1.6em;
}

.tile-search {
    position:   relative;
    left:       0.6em;
    text-align: left;
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
