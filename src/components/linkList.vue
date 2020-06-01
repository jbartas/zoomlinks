<template>
  <div class="linkList">

   <div class="place-grid" >
       <h2>Links:</h2>
       <grid 
            :columns = '[ "Name", "URL", "Tags" ]'
            />
    </div>

    <div class="place-error" >
      <div class="errorMsg">{{networkError}}</div>
      <div class="resultMsg">{{resultMsg}}</div>
    </div>
 
  </div>
</template>


<script>
import restapi from "../restapi.js";
import grid    from "./grid.vue";


export default {
  name: 'listLink',
  components: {
      grid
  },
  methods: {
    deleteLink: function ( link_Id ) {
        this.networkError = "";
        let linkInfo = { 
            "link_Id": link_Id, 
            "userName": this.$parent.loggedInName 
            };

        restapi.post( "/deleteLink", linkInfo )
        .then(
            response => {
                let reply = response.data;
                if( reply.status == "success") {
                    this.loginStatus = "";
                }
                else {
                    this.loginStatus = "Login FAILED: " + reply.message;
                }
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( error );
                this.networkError = "Network: " + error;
            });
        }
  },
  props: {
    msg: String,
    topbarMsg: String
  },
  data() {
      return {
        userName: "",
        resultMsg: "",
        networkError: ""
      }
  }
}



</script>

<style scoped>

.linkList {
    position:   relative;
    min-width:  640px;
    color:      var(--bt-form-color);
    margin:     10px;
    padding:    10px;
    text-align: center;
}

.place-grid {
    position:   relative;
    top:        2em;
    left:       24%;
}

.place-error {
    position:   relative;
    left:       1px;
    top:        2em;
}

.table-header-wrapper {
    background:   grey;
}

</style>
