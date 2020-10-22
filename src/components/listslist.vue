<template>
  <div class="linklist" >
    <div class="link-list" >

    <h2>Lists of links: </h2>
    <p >
      Active lists: None.
    </p>
    </div>
  </div>
</template>


<script>

export default {
  name: 'requests',
  props: {
    msg: String,
  }, 
  methods: {
    onClick: function( cmd ) {
      console.log( "Requests: click, cmd: ", cmd );
    }
  }
}
</script>


<style scoped>

.requests {
    position:   relative;
    min-width:  350px;
    color:      var(--bt-form-color);
}

.place-requests {
    position:   relative;
    min-width:    18em;
    max-width:    62em;
    padding-top:  1em;
    margin:     auto;
}

.req-message {
    text-align:   center;
}

</style>
