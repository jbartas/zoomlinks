<template>
  <div class="linkList">
   <div class="place-grid" >
      <div class="table-header" v-if="linksfor == 'user'" >
          <strong> My Links: </strong>
      </div>
      <div class="table-header" v-if="linksfor == 'group'" >
          <strong> Links for group {{activeGroup.groupName}}: </strong>
      </div>

      <grid class="grid_wrapper"
            :data     = "gridData" 
            :columns  = "gridColumns" 
            :callback = "gridCallback"
            :colstyle = "gridColStyles"
            v-bind:cellcss  = 
                "{ edit: 'button_cell', use: 'clock_cell fa-calendar-check-o', more: 'clock_cell fa-list', link: 'url_cell', group: 'clock_cell fa-group' }"
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
import axios   from "axios";

export default {
  name: 'listLink',
  components: {
      grid
  },
  props: {
      linksfor: String,
  },
  methods: {
    showMore( gridlink ) {
        // get the link's full record
        let link = this.linkRecs.find( rec => rec._id == gridlink._id );
        if( !link ) {
            // eslint-disable-next-line
            console.log( "showMore, gridlink._id not found: ", gridlink.id );
            return; 
        }
        // eslint-disable-next-line
        console.log( "showMore, link: ", link );

        /* old records had no customer fields, but they had passwords 
         * which were a peer to name and tags. Fix this here:
         */
        if( link.password != "" && !link.options ) {
            link.options = [{ name: "password",  value: link.password }];
        }
        let alerthtml = "<table class='more-table' >" +
            "<tr><td>Name: </td><td>" + link.linkName + "</td></tr>" +
            "<tr><td>Last Used: </td><td>" + link.useDate.slice(0,10) + 
                " at " + link.useDate.slice(11,16) + "</td></tr>" +
            "<tr><td>Clicks: </td><td>" + link.clicks + "</td></tr>" +
            "<tr><td>Tags: </td><td>" + link.linkTags + "</td></tr>";

        // eslint-disable-next-line
        console.log( "link.options: ", link.options );
        // add any link.optons to the html table
        if( link.options ) {
            link.options.forEach( option => {
                    alerthtml += "<tr><td>" + option.name + "</td><td>" + 
                        option.value + "</td></tr>";
            });
        }

        alerthtml += "</table>"

        this.$swal.fire({ html: alerthtml });
    },
    addToGroupDialog: function( gridlink ) {
        let link = this.linkRecs.find( rec => rec._id == gridlink._id );

        if( !this.activeGroup ) {
            let alerthtml = "You must first set an 'active group' with groups->group info->select.";
            this.$swal.fire({ html: alerthtml });
            return;
        }
        let alerthtml = "<p  class='more-table'> Add link " + link.linkName + 
                " to group " + this.activeGroup.groupName + " ? </p>";
        this.$swal.fire({ 
            html: alerthtml,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> Yes',
            confirmButtonAriaLabel: 'yes',
            cancelButtonText:
                '<i class="fa fa-thumbs-down"></i> No',
            cancelButtonAriaLabel: 'no',
        })
        .then((result) => {
            if (result.value) {
                console.log( "$swal addToGroupDialog true." );
                this.addLinkToGroup( link, this.activeGroup ); 
            }
            else {
                console.log( "$swal addToGroupDialog false." );
            }
        });
    },
    addLinkToGroup: function ( link, group ) {
        group.links.push( link._id );   // add link to group local copy
        let url = this.$parent.baseURL + "/updateGroup";

        axios.post( url, group /*,  headers*/ )
        .then( reply => {
            // check reply for status error later? 
            let msg = "Updated group " + group.groupName + " with link " + link.linkName ;
            console.log( msg, reply );
            this.resultMsg = msg;
        }).catch( error => {
            console.log( error );
            this.networkError = error;
            this.resultMsg = "";
        });
    },
    gridCallback: function ( link, cell ) {
        console.log( "grid callback, link: ", link, cell );

        if( cell == "edit" ) {
            // get the original record, not the grid subset
            let reclink = this.linkRecs.find( rec => rec._id == link._id );
            if( !reclink ) {
                // eslint-disable-next-line
                console.log( "showMore, gridlink._id not found: ", gridlink.id );
                return; 
            }

            // If needed, add deprecated password field to options
            if( reclink.password && reclink.password != "" && !reclink.options ) {
                reclink.options = [{ name: "Zoom Password", value: reclink.password }];
            }
            console.log( "gridCallback, added options: ", reclink );
            this.$parent.editLink = reclink;       // pass link fields to "add"" form
            this.$parent.renderApp = "addLink";
        }
        else if( cell == "group" ) {
            // Show extra fields
            this.addToGroupDialog( link );
        }
        else if( cell == "more" ) {
            // Show extra fields
            this.showMore( link );
        }
        else if( cell == "link" ) {
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
            window.open( link.link, "_blank");
        }
        else if( cell == "use" ) {
            let dt = new Date(link.use);
            let date = dt.toDateString();
            let time = dt.toTimeString().substr(0, 8);
            alert( "Link '" + link.name + "' last used at " + time + " on " + date );
        }
        else {
            this.resultMsg = "Click 'Link' to go to link, 'Edit' button to edit or delete it."
        }

    },
    getLinkData: function ( user ) {

        let url = "" 
        if(this.linksfor == "group" ) {
            console.log( "getLinkData: activeGroup:", this.activeGroup );
            if( !this.activeGroup ) {
                console.log( "getLinkData: no active group." );
                return;
            }
            url = "/getGroupLinks/" + this.activeGroup._id ;
        }
        else {
            url = "/getLinks/" + user ;
        }

        // eslint-disable-next-line
        console.log( "getLinkData: ", url );
        restapi.get( url )
        .then ( response => {
            let reply = response.data;
            
            // eslint-disable-next-line
            console.log( "got Records: ", reply );
            if( reply.status != "success") {
                this.resultMsg = "";
                this.networkError = "Network error: Server problem.";
                return;
            }

            /* Clear the grid of current data before we (re)write it */
            this.gridData = [];
            if( reply.recordList.length == 0 ) {
                if( this.linksfor == "group" ) {   // who has no links, group or user? 
                    this.resultMsg = "No links found for group " + this.activeGroup.groupName + 
                        ". Save some from your 'My Links' page or with 'Add Link'.";
                }
                else {
                    this.resultMsg = "No links found for user " + user  + ". Save some with 'Add Link'.";
                }
                return;
            }
            this.linkRecs = reply.recordList;

            reply.recordList.forEach( link => {
                // Make subset of records with names matching grid columns
                let gridrec = {
                    name: link.linkName,
                    link:  link.linkURL,
                    tags: link.linkTags,
                    use: link.useDate,
                    more: link.password,
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
    this.activeGroup = this.$parent.activeGroup;
    /*
    if( !this.activeGroup ) {
        this.resultMsg = "No Active Group!";
        alert("No active group is set.");
        this.$parent.renderApp = "listGroups";
    }
    */
    this.getLinkData( user );
  },
  data() {
      return {
        userName: "",
        resultMsg: "",
        networkError: "",
        linkRecs: [],       // list of full records of links
        activeGroup: null,

        /* grid stuff */
        gridColumns: [ 'name', 'link', 'tags', "use", "more", "group", "edit" ], // titles
        gridColStyles: {    // control the grid column widths 
            "select": "width: 36%", 
            "link":   "width: 20%", 
            "tags":   "width: auto",
            "use" :   "width: 1.8em", 
            "more":   "width: 1.8em",
            "group":  "width: 1.8em",
            "edit":   "width: 6em" 
        }, 
        gridData: []        // sub-records for grid display
      }
  }
}

</script>

<style>

.linkList {
    position:   relative;
    min-width:  640px;
}

.place-grid {
    position:   relative;
    width:      92%;
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

.grid_tr {
    text-align: left;    
}

.grid_tr:hover {
    background-color:   var(--bt-hover-color);
}

.more-table {
    position:       relative;
    width:          100%;
    padding:        6px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size:      0.9em;
    text-align:     left;
    color:          var( --bt-text-color );
    background-color:   var( --bt-table-backgroud );
    border-radius:      6px;
}

.more-table td  {
    background-color:   #fefefe;
    padding:            0.3em;
}

.more-table td:nth-child(odd) {
    color:          var( --bt-form-color );
    background-color: #f2f2f2;
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

.clock_cell {
    position:       relative;
    /* Next line is all we need from FontAwsome 'fa' style */
    font: normal normal normal 14px/1 FontAwesome;
    color:          white;
    background-color:   var( --bt-form-text );
    font-size:      1.4em;
    max-width:      1.0em;
    border-radius:  4px;
}

.clock_cell:hover {
    background-color:   var( --bt-zoom-blue );
    color:              #FFEE11;
}

.button_cell {
  height:       0.8em;
  /* width: controlled by col in table (grid.vue) */
  color:        var(--bt-form-text);
  /*  background-color:   var(--bt-table-backgroud);*/
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
