<template>
<div class="list-groups">
   <div class="place-grid" >
      <div class="table-header-wrapper" >
          My Groups:
      </div>
      <grid class="grid_wrapper"
            :data     = "gridData" 
            :columns  = "gridColumns" 
            :callback = "gridCallback"
            v-bind:cellcss  = 
                "{ use: 'clock_cell fa-calendar-check-o', more: 'clock_cell fa-list' }"
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
import grid    from "./grid.vue";
import restapi from "../restapi.js";

export default {
  name: 'listGroups',
  components: {
    grid,
  },
  data() {
      return {
        resultMsg: "",
        networkError: "",
        groupRecs: [],       // list of full records of groups

        /* grid stuff */
        gridColumns: [ "select", "name", "description", "use", "more" ], // titles
        gridColStyles: [ "width: 8em", "width: 36%", "width: auto", "width: 1.8em", "width: 1.8em" ],
        gridData: []        // sub-records for grid display
      }
  },
  methods: {
    gridCallback( link ) {
        console.log( "gridCallback: ", link );

    },
    getGroupData: function ( ) {
        this.networkError = "";
        this.resultStatus = "";

        // get groups for the logged in user
        let url = "/getGroups/" +  this.$parent.loggedInID;

        console.log( "getGroupData: ", url );
        restapi.get( url )
        .then ( response => {
            let reply = response.data;
            
            // eslint-disable-next-line
            console.log( "got Groups: ", reply );

            this.resultStatus = "Read groups from server ";
            // more here later

        }).catch( error =>  {
            // eslint-disable-next-line
            console.log( error );
            this.networkError = error;
        });        

    }
  },
  created: function() {
      this.getGroupData();
  },
}

</script>


<style scoped>

/* Outer container */
.list-groups {
    position:   relative;
}

.place-grid {
    position:   relative;  
    width:      80%;
    max-width:  1400px;
    margin:     auto;
    padding:    2em;
}

.table-header-wrapper {
    font-weight:  600;
    height:       2em;
}

</style>
