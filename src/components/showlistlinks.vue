<template>
<div class="list-links">

  <!-- This file is mostly a wrapper for linkList.vue component. -->

  <div class="ll-header" >
    Links for list {{global.editList.name}}
    <button v-on:click="showApp('addLink')"> 
      Add a link 
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
    }
  },
  created: function() {
    /* Do we need this? */
      console.log( "showlistlinks: created() " );
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
    grid-template-columns:  auto  auto;
    grid-gap:       4px;
}

</style>
