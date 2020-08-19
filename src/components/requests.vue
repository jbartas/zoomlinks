<template>
  <div class="requests" >
    <div class="place-requests" >

    <h2>Have a request for a new feature? </h2>
    <h2>Noticed a bug? </h2>
    <p class="req-message" >
      Send us an email - we'll look into it. Feel free to attach screen captures. 
      Be sure to let us know if you want a direct reply.
    </p>
    <a href="mailto:jbartas@gmail.com" >
      <button> Email request </button>
    </a>
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
