<template>
<div class="group-links">

<!-- This file is mostly a wrapper for linkList.vue component. -->

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


</style>
