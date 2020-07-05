<template>
<div class="group-links">

GroupsLinks - active group is {{$parent.activeGroup.groupName}}

</div>
</template>


<script>

export default {
  name: 'groupLinks',
}

</script>


<style scoped>

/* Outer container */
.group-links {
    position:   relative;
}

</style>
