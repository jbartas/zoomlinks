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

      /* Set up a temporary activeGroup. This will be used in linkList:create() 
       * to load the full activeGroup record.
       */
      this.global.activeGroup = {};
      this.global.activeGroup.groupName = this.global.urlParams.group;
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
