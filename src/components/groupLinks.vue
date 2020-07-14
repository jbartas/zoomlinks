<template>
<div class="group-links">

  <!-- This file is mostly a wrapper for linkList.vue component. -->

  <div class="gl-header" >
    Links for group {{activeGroup.groupName}}
    <button v-on:click="showApp('addLink')"> 
      Add a link 
    </button>
  </div>

    <linkList  class="group-links"
      linksfor= "group" 
      >
    </linkList>

</div>
</template>


<script>
import linkList from '../components/linkList.vue'

export default {
  name: 'groupLinks',
  components: {
    linkList
  },
  data() {
    return {
      loggedInName: "",
      activeGroup: "",
    }
  },
  methods: {
    showApp: function( appName ) {
      // eslint-disable-next-line
      console.log( "showApp: ", appName  );
      this.$parent.renderApp = appName;
    }
  },
  created: function () {
    this.loggedInName = this.$parent.loggedInName;
    this.activeGroup = this.$parent.activeGroup;
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
