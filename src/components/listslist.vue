<template>
  <div class="linklist" >
    <div class="listList" >

        <div class="table-header" >
            <strong> My Lists of links:: </strong> 
        </div>
        <grid class="grid_wrapper" v-if="! global.portrait" 
            :data     = "gridData" 
            :columns  = "gridColumns" 
            :callback = "gridCallback"
            :colstyle = "gridColStyles"
            :global = "global"
            v-bind:cellcss  = 
                "{ edit: 'button_cell', last: 'clock_cell fa-calendar-check-o', info: 'clock_cell fa-list', link: 'url_cell', group: 'clock_cell fa-group' }"
            buttoncol = "edit" 
            >
        </grid>
        <tiles class="grid_wrapper" v-if="global.portrait" 
            :data     = "gridData" 
            :columns  = "gridColumns" 
            :callback = "gridCallback"
            :global = "global"
            >
        </tiles >

    </div>

    <div class="place-error" >
      <div class="errorMsg">{{networkError}}</div>
      <div class="resultMsg">{{resultMsg}}</div>
    </div>

  </div>
</template>


<script>
import restapi  from "../restapi.js";
import grid     from "./grid.vue";
import tiles    from "./tiles.vue";
//import editList from "./editList.vue";

export default {
    name: 'lists',
    components: {
      grid,
      tiles
    },
    props: {
      global: Object,
    },
    data() {
      return {
          lists: [],    // full list info, from API
          networkError: "",
          resultMsg: "",

          gridData: [], // list info for table
          gridColumns: [ 'name', 'links', 'created', 'ends', "edit" ], // titles
          gridColStyles: {    // control the grid column widths 
            "name": "width: 36%", 
            "links": "width: 2em",
            "created": "width: 20%",
            "ends": "width: 20%",
            "edit": "width: 6em" 
          },
      }
    },
    methods: {
        gridCallback: function ( list, cell ) {
            console.log( "grid callback, link: ", list, ", cell: ", cell );
            if( cell == "edit") {
                this.global.editList = list;
                this.global.renderApp = "editList";
            }
            else {  /* cell == remove */
                console.log( "list removal code here later" );
            }
        },
        setGridData: function () {
            /* Format gridData[] from lists[] */
            this.gridData = [];
            this.lists.forEach( list => {
              let created = new Date(list.createDate);
              let ending = new Date(list.createDate);
              ending.setSeconds(ending.getSeconds() + list.ttl);
              console.log("list times: ", created, list.ttl );
              let gridrec = {
                  name: list.name,
                  links: list.linkIds.length.toString(),
                  linkIdList: list.linkIds,
                  created: created.toString(),
                  ends: ending.toString(),
                  edit: "Edit",
                  _id: list._id   // will not be displayed
              }
              this.gridData.push(gridrec);
            })
        }
    },
    created: function() {
        if( !this.global.loggedInID ) {    // No one is logged in.
            return;
        }

        /* Get the lists for the logged-in used */
        let url = "/getLists";
        let restcmd = { 
            "hash": this.global.sessionHash,
            owner: this.global.loggedInID
        };

        restapi.post( url, restcmd )
        .then( reply => {
            console.log( "listLists.js, created; reply: ", reply );
            this.lists = reply.data.recordList;
            this.setGridData();
            this.resultMsg = "You own " + this.lists.length + " Lists ";
        }).catch( error =>  {
            let msg = error + " while fetching links lists";
            console.log( msg );
            this.networkError = msg;
        });


    }
}
</script>


<style scoped>

.listList {
    position:   relative;
    min-width:    18em;
    max-width:    62em;
    padding-top:  1em;
    margin:     auto;
}

.table-header {
    padding:        0.5em;
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
    background-color:   rgba(200, 190, 180, 0.5);
    padding:    18px;
    text-align: left;
}

</style>
