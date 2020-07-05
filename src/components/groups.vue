<template>
<div class="groups">

    <!-- This is a simple component to make the groups selection bar -->
    <div class="nav_wrapper">
      <nav>   <!-- navigation tabs -->
        <div class="navtab" >
            <div v-on:click="showApp( 'addGroup')">
            <i class="fa fa-plus-square"></i> New Group </div>
        </div>
        <div class="navtab" >
            <div v-on:click="showApp( 'listGroups')">
            <i class="fa fa-info"></i> Group Info </div>
        </div>
        <div class="navtab" >
            <div v-on:click="showApp( 'groupLinks')">
            <i class="fa fa-list-ol"></i> Group Links </div>
        </div>
      </nav>   <!-- end navigation tabs -->
    </div> <!-- end "nav_wrapper" -->

</div>
</template>


<script>
export default {
  name: 'groups',
  methods: {
    showApp: function( appName ) {
      // eslint-disable-next-line
      console.log( "showApp; group: ", appName  );
      if( appName == "addGroup" ) {
        this.$parent.activeGroup = null;
      }
      this.$parent.renderApp = appName;
    }
  },
}
</script>


<style scoped>

/* Outer container */
.groups {
    position:   relative;
}

nav {
    max-width:      29em;  /* Adjust if adding/removing tabs */
}

</style>
