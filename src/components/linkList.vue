<template>
  <div class="linkList">

   <div class="place-grid" >
      <div class="table-header-wrapper" >
          Links:
      </div>
      <grid :data="gridData" class="grid_wrapper"
            :columns="gridColumns" 
            :callback="gridCallback" 
            buttoncol="edit" 
            >
       </grid>

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
    gridCallback: function ( id ) {
        // eslint-disable-next-line
        console.log( "grid callback, id: ", id );

    },
    getLinkData: function ( user ) {

        let url = "/getLinks/" + user ;

        // eslint-disable-next-line
        console.log( "getLinkData: ", url );
        restapi.get( url )
        .then ( response => {
            let reply = response.data;
            // eslint-disable-next-line
            console.log( "got Records: ", reply );

            /* Clear the grid of current data before we (re)write it */
            this.gridData = [];
            if( reply.recordList.length == 0 ) {
                this.resultMsg = "No links found for user " + user + ". Save some with 'Add Link'."
                return;
            }

            reply.recordList.forEach( link => {
                // Make subset of records with names matching grid columns
                let gridrec = {
                    name: link.linkName,
                    url:  link.linkURL,
                    tags: link.linkTags,
                    edit: "Edit"
                }
                this.gridData.push(gridrec);
            })

        }).catch( error =>  {
            // eslint-disable-next-line
            console.log( error );
            this.networkError = error;
        });
        
    },
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
  created: function() {
    let user = this.$parent.loggedInName;
    if( user == "" ) {    // No one is logged in.
        return;
    }
    this.getLinkData( user );
  },
  data() {
      return {
        userName: "",
        resultMsg: "",
        networkError: "",

        /* grid stuff */
        gridColumns: [ 'name', 'url', 'tags', "edit" ],
        gridData: []
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
    top:        1em;
    left:       0%;
    text-align: center;
    color: var(--bt-form-color);
}

.place-error {
    position:   relative;
    left:       1px;
    top:        2em;
}

.grid_wrapper {
    position:   relative;
    left:       0%;
    width:      96%;
    background-color:   rgba(200, 190, 180, 0.5);
    padding:    18px;
    text-align: left;
}

.table-header-wrapper {
    text-align:     center;
    font-size:      1.5em;
    font-weight:    600;
}

</style>
