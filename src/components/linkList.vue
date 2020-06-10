<template>
  <div class="linkList">

   <div class="place-grid" >
      <div class="table-header-wrapper" >
          Links:
      </div>
      <grid class="grid_wrapper"
            :data     = "gridData" 
            :columns  = "gridColumns" 
            :callback = "gridCallback"
            v-bind:cellcss  = "{ edit: 'button_cell', url: 'url_cell' }"
            buttoncol = "edit" 
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
    gridCallback: function ( link, cell ) {
        // eslint-disable-next-line
        console.log( "grid callback, link: ", link, cell );
        if( cell == "edit" ) {
            this.$parent.editLink = link;       // pass link fields to "add"" form
            this.$parent.renderApp = "addLink";
        }
        else if( cell == "url" ) {
            let url = "/bumpClick/";
            this.networkError = "";     // clear any visible error message

            // Bump click count in server records
            let linkId = { "_id": link._id }
            // eslint-disable-next-line
            console.log( "bumpClick, linkId: ", linkId );

            restapi.post( url, linkId )
            .then ( response => {
                let reply = response.data;
                // eslint-disable-next-line
                console.log( "bumpClick: ", reply );
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( "bumpClick error: ", error );
                this.networkError = "Click record error:", error;
            });

            this.resultMsg = ""
            window.open( link.url, "_blank");
        }
        else {
            this.resultMsg = "Click 'Url' to go to link, 'Edit' button to edit or delete it."
        }

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
                    password: link.password,
                    edit: "Edit",
                    _id: link._id   // will not be displayed
                }
                this.gridData.push(gridrec);
            })

        }).catch( error =>  {
            // eslint-disable-next-line
            console.log( error );
            this.networkError = error;
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
        gridColumns: [ 'name', 'url', 'tags', "password", "edit" ],
        gridData: []
      }
  }
}

</script>

<style>

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
    --grid-cell-border: #998877;
    --grid-url-color:   #4a2888;
    position:   relative;
    left:       0%;
    width:      96%;
    background-color:   rgba(200, 190, 180, 0.5);
    padding:    18px;
    text-align: left;
}

/* Special formats passed to grid for cells */
.url_cell {
    color:          var(--grid-url-color);
    text-decoration: underline;
    text-align:     left;
    border: 1px solid  var(--grid-cell-border);
    cursor:         pointer;
}

.url_cell:hover {
    background-color:   var( --bt-hover-color );
    font-weight:        700;
}

.button_cell {
  height:       0.8em;
  width:        7em;
  color:        var(--bt-form-text);
  background-color:  white;

  border: 2px solid var( --bt-zoom-blue );
  border-radius: 12px;
  padding:      1px;
  text-align:   center;
  font-size:    0.8em;
}

.button_cell:hover {
  background-color:   var(--bt-hover-color);
}

.table-header-wrapper {
    text-align:     center;
    font-size:      1.0em;
    font-weight:    500;
    color:          var(--bt-zoom-blue );
}

tr:hover {
  background-color:   var(--bt-hover-color);

}
</style>
