<template>
<div class="list-links">

  <!-- This file is mostly a wrapper for linkList.vue component. -->

  <div class="ll-header" >
    Links for list {{global.editList.name}}
    <button v-on:click="showApp('addLink')"> 
      Add a link 
    </button>
    <button v-on:click="saveClipboard()" title="Save a public link for this list to clipboard."> 
      Link -> clipboard
    </button>
  </div>

    <linkList  class="list-links"
      :global = "global"
      linksfor= "list" 
      >
    </linkList>

</div>
</template>


<script>
import linkList from '../components/linkList.vue'
//import restapi from "../restapi.js";

export default {
  name: 'showlistlinks',
  components: {
    linkList
  },
  props: {
    global: Object,
  },
  data() {
    return {
    }
  },
  methods: {
    showApp: function( appName ) {
      console.log( "showApp: ", appName  );
      this.global.renderApp = appName;
    },
    saveClipboard: function() {
      console.log( "saveClipboard; editlist: ", this.global.editList );
      // Make a "magic link" for the list
      let link = "http://linkshare.link?user=guest&app=showlistlinks&listid=" 
        + this.global.editList._id;

      // for local testing:
      if( window.location.href.includes("localhost:8080") ) {
        link = "http://localhost:8080?user=guest&app=showlistlinks&listid=" 
          + this.global.editList._id;
      }

      // Javascript could have made this a lot simpler...
      var tmp = document.createElement("textarea");
      tmp.value = link;
      tmp.style.height = "0";
      tmp.style.overflow = "hidden";
      tmp.style.position = "fixed";
      document.body.appendChild(tmp);
      tmp.focus();
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
    }
  },
  created: function() {
    /* Do we need this? */
    console.log( "showlistlinks: created(), editlist ", this.global.editList );

  }
}

</script>


<style scoped>

/* Outer container */
.list-links {
    position:   relative;
}

.ll-header {
    position:       relative;
    max-width:      40em;
    height:         1.6em;
    padding:        0.6em;
    margin:         auto;
    font-size:      1.2em;
    display:        grid;
    grid-template-columns:  auto  auto auto;
    grid-gap:       4px;
}

</style>
