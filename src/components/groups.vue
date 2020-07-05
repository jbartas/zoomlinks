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

    <div class="place-error" v-on:click="showApp( 'listGroups')" >
      <div class="group-error" >{{groupsError}}</div>
    </div>

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
      else if( appName == "groupLinks") {
        if( this.$parent.activeGroup == null ) {
          this.groupsError = "Please Select an active group first. ";
          return;
        }
      }
      this.$parent.renderApp = appName;
    }
  },
  data() {
    return {
      groupsError: "",
    }
  }
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

.group-error {
    color:          var(--grid-url-color);
    text-decoration: underline;
    cursor:         pointer;
    font-size:      1.3em;
}

</style>
