<template>
<div class="group-links">

  <!-- This file is mostly a wrapper for linkList.vue component. -->

  <div class="gl-header" >
    Links for group {{global.activeGroup.groupName}}
    <button v-on:click="showApp('addLink')"> 
      Add a link 
    </button>
  </div>

    <linkList  class="group-links"
      :global = "global"
      linksfor= "group" 
      >
    </linkList>

    <div class="place-error" >
      <div class="errorMsg">{{networkError}}</div>
      <div class="resultMsg">{{resultMsg}}</div>
    </div>

</div>
</template>


<script>
import linkList from '../components/linkList.vue'
import restapi from "../restapi.js";

export default {
  name: 'groupLinks',
  components: {
    linkList
  },
  props: {
    global: Object,
  },
  data() {
    return {
      resultMsg: "",
      networkError: "",
    }
  },
  methods: {
    showApp: function( appName ) {
      console.log( "showApp: ", appName  );
      this.global.renderApp = appName;
    }
  },
  created: function() {
    if( this.global.urlParams.group ) {
      console.log( "groupLinks; from URL" );

      // Set up a temporary activeGroup while we load the record
      this.global.activeGroup = {};
      this.global.activeGroup.groupName = this.global.urlParams.group;

      let url = "/getGroupByName/" + this.global.urlParams.group;
      restapi.get( url )
      .then(  response => {
          let reply = response.data;
          if( reply.status == "success" ) {
              console.log( "groupLinks guest group ", reply.group );
              this.global.activeGroup = reply.group;
              // Clear group from URL params
              this.global.urlParams.group = null;
          }
          else {
              let msg = "No group found named " + this.global.urlParams.group;
              console.log( msg );
              this.resultMsg = msg;
          }
      }).catch( error =>  {
          console.log( error );
          this.networkError = error;
      });
    }
  }
}

</script>


<style scoped>

/* Outer container */
.group-links {
    position:   relative;
}

.gl-header {
    position:       relative;
    max-width:      40em;
    height:         1.6em;
    padding:        0.6em;
    margin:         auto;
    font-size:      1.2em;
    display:        grid;
    grid-template-columns:  auto  auto;
    grid-gap:       4px;
}

</style>
