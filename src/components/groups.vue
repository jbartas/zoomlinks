<template>
<div class="groups">

    <!-- This is a simple component to make the groups selection bar -->
    <div class="nav_wrapper">
      <nav>   <!-- navigation tabs -->
        <div class="navtab" >
            <div v-on:click="showApp( 'addGroup')">
            <i class="fa fa-plus-square"></i> New Group </div>
        </div>
        <div class="navtab" v-if="isAdmin" >
            <div v-on:click="showApp( 'groupUsers')">
            <i class="fa fa-child"></i> Add a User </div>
        </div>
        <div class="navtab" v-if="isAdmin" >
            <div v-on:click="showApp( 'groupUsers')">
            <i class="fa fa-lock"></i> Add an Admin </div>
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
  data() {
    return {
      groupsError: "",
      activeGroup: null,
      isAdmin: false,
    }
  },
  methods: {
    showApp: function( appName ) {
      // eslint-disable-next-line
      console.log( "groups: showApp = ", appName  );
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
  created: function() {
    this.activeGroup = this.$parent.activeGroup;
    console.log( "groups: create: Active group is ", this.activeGroup );
    // Make sure logged in user is an admin of activeGroup 
    if( this.activeGroup ) {
      if( this.activeGroup.admins.find( id => id == this.$parent.loggedInID )) {
        this.isAdmin = true;
        console.log( "groups: create: Admin ID ", this.$parent.loggedInID );
      }
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
    max-width:      49em;  /* Adjust if adding/removing tabs */
}

.group-error {
    color:          var(--grid-url-color);
    text-decoration: underline;
    cursor:         pointer;
    font-size:      1.3em;
}

</style>
