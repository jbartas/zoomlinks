<template>
<div class="groups">

    <div class="nav_wrapper">
      <nav>   <!-- navigation tabs -->
        <div class="navtab" >
            <div v-on:click="showApp( 'addGroup')">
            <i class="fa fa-key"></i> New Group </div>
        </div>
        <div class="navtab" >
            <div v-on:click="showApp( 'listGroups')">
            <i class="fa fa-key"></i> Group Info </div>
        </div>
        <div class="navtab" >
            <div v-on:click="showApp( 'groupLinks')">
            <i class="fa fa-key"></i> Group Links </div>
        </div>
      </nav>   <!-- end navigation tabs -->
    </div> <!-- end "nav_wrapper" -->

    <addGroup  v-if="groupApp == 'addGroup'" />
    <listGroups  v-if="groupApp == 'listGroups'" />
    <groupLinks  v-if="groupApp == 'groupLinks'" />

    <div class="place-error" >
        <div class="errorMsg" >
            {{networkError}}
        </div>
        <div class="resultMsg" >
            {{resultStatus}}
        </div>
    </div>

</div>
</template>


<script>
import listGroups from '../components/listGroups.vue'
import groupLinks from '../components/groupLinks.vue'
import addGroup from '../components/addGroup.vue'

export default {
  name: 'groups',
  components: {
      addGroup,
      listGroups,
      groupLinks
  },
  data() {
      return {
        groupName: null,        // active group, if set
        groupApp: "newGroup",   // Which group page to show
        networkError: "",
        resultStatus: "",
      }
  },
  methods: {
    showApp: function( appName ) {
      // eslint-disable-next-line
      console.log( "showApp; group: ", appName  );
      this.groupApp = appName;
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
