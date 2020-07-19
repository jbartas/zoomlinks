<template>
<div class="list-groups">
   <div class="place-grid" >
      <div class="table-header-wrapper" >
        <strong> My Groups: </strong>
      </div>
      <grid class="grid_wrapper"
            :data     = "gridData" 
            :columns  = "gridColumns" 
            :callback = "gridCallback"
            :colstyle = "gridColStyles"
            v-bind:cellcss  = 
                "{ select: 'button_cell', use: 'clock_cell fa-calendar-check-o', edit:'button_cell' }"
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
  props: {
    global: Object,
  },
  data() {
      return {
        resultMsg: "",
        networkError: "",
        groupRecs: [],       // list of full records of groups

        /* grid stuff */
        gridColumns: [ "select", "name", "description", "tags", "use", "edit" ], // titles
        gridColStyles: { 
            "select": "width: 5em", 
            "name":   "width: 10em", 
            "description": "width: auto",
            "tags":   "width: auto",
            "use" :   "width: 1.8em", 
            "edit":   "width: 5em" 
        }, 
        gridData: []        // sub-records for grid display
      }
  },
  methods: {
    gridCallback( gridlink, key ) {
        console.log( "gridCallback: ", key, gridlink );
        // find record in this.groupRecs
        let group = this.groupRecs.find( rec => rec._id == gridlink._id );
        this.global.activeGroup = group;

        if( key == "select") {
          //this.resultMsg = "Group '" + group.groupName + "' is now the active group";
          this.global.renderApp = "groupLinks";
        }
        else if( key == "edit") {
          this.global.renderApp = "addGroup";
        }
    },
    getGroupData: function ( ) {
        this.networkError = "";
        this.resultMsg = "";

        // get groups for the logged in user
        let url = "/getGroups/" +  this.global.loggedInID;

        console.log( "getGroupData: ", url );
        restapi.get( url )
        .then ( response => {
            let reply = response.data;
            
            // eslint-disable-next-line
            console.log( "got Groups: ", reply.groupList );

            if( reply.groupList.length == 0 ) {
              this.resultMsg = "You don't seem to be in any groups yet.";
            }
            else {
              this.resultMsg = "Found " + reply.groupList.length + " groups.";
            }
            this.groupRecs = reply.groupList;

            // Make mini-records with nice text names for grid
            this.groupRecs.forEach( group => { 
                let gridRec = {
                    name : group.groupName,
                    _id  : group._id,
                    description: group.descr,
                    tags: group.tags,
                    edit: "Edit",
                    select: "Select"
                };
                this.gridData.push( gridRec );
            });

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
    font-size:  0.98em;
}

.table-header-wrapper {
    padding:    0.5em;
}

.button_cell {
  height:       0.8em;
  color:        var(--bt-form-text);
  margin:       auto;
  background-color:   white;  
  border: 2px solid var( --bt-zoom-blue );
  border-radius: 12px;
  padding:      1px;
  text-align:   center;
  font-size:    1.2em;
}

.button_cell:hover {
  background-color:   var(--bt-hover-color);
}

</style>
