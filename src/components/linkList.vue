<template>
  <div class="linkList">
    <div class="place-grid" >

        <!-- If invoked from group then group adds table header, else: -->
        <div class="table-header" v-if="linksfor == 'user' && !global.portrait" >
            <strong> My Links: </strong> 
        </div>

        <!-- Show grid or tile display, based on screen orientation -->
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
        <tiles v-if="global.portrait" 
            :data     = "gridData" 
            :callback = "gridCallback"
            :global = "global"
            >
        </tiles>
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
import tiles   from "./tiles.vue";
import { EventBus } from '../components/eventBus.js';


export default {
  name: 'listLink',
  components: {
      grid,
      tiles
  },
  props: {
      global: Object,
      linksfor: String,
  },
  methods: {
    createList( linkList )
    {
        // Make a linklist with the passed links.
        let now = new Date();   // for timestamping default name
        let newlist = { 
            "hash": this.global.sessionHash,
            // Id: ObjectId, - will be added by Backend
            linkIds: [],
            owner: this.global.loggedInID,        // owner Id
            name: this.global.loggedInName + "_" + now.toISOString(),
            createDate: 0,         // (UTC), now
            ttl: 3600 * 72,     // in seconds, default 72 hours
        }

        // stick Id list on new object
        linkList.forEach( link => {
            newlist.linkIds.push( link._id ); 
        });

        let url = "makeLinksList";

        restapi.post( url, newlist )
        .then( reply => {
            console.log( "createList; reply: ", reply, ", list: ", newlist );
            this.resultMsg = "New List " + newlist.name + " created.";
            this.global.editList.name = newlist.name;
            this.global.renderApp = 'editList';
        }).catch( error =>  {
            console.log( error );
            this.networkError = error + " creating links list";
        });

    },
    showMore( gridlink ) {
        // get the link's full record
        let link = this.linkRecs.find( rec => rec._id == gridlink._id );
        if( !link ) {
            console.log( "showMore, gridlink._id not found: ", gridlink.id );
            return; 
        }
        // eslint-disable-next-line
        console.log( "showMore, link: ", link );

        /* old records had no 'options' section, but some had a password
         * field which was a peer to name and tags. Patch this here:
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

        if( !this.global.activeGroup ) {
            let alerthtml = "You must first set an 'active group' with groups->group info->select.";
            this.$swal.fire({ html: alerthtml });
            return;
        }
        let alerthtml = "<p  class='more-table'> " + 
            ((this.deleting) ? "Remove" : "Add") +
            " link " + link.linkName + 
            ((this.deleting) ? " from" :" to") +
            " group " + this.global.activeGroup.groupName + " ? </p>";
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
                this.addLinkToGroup( link, this.global.activeGroup ); 
            }
            else {
                console.log( "$swal addToGroupDialog false." );
            }
        });
    },
    addLinkToGroup: function ( link, group ) {

        // This function also handles removing links from groups
        let index = group.links.indexOf(link._id);
        console.log("addLinkToGroup, deleting", this.deleting, 
            ", index: ", index, ", link: ", link, ", group: ", group );

        if( this.deleting ) {
            if ( index == -1 ) {
                console.log("link ID not in group." );
                return;
            }
            // remove link from local copy of group
            group.links.splice( index, 1 );
            console.log("link ID removed from group.", group );
        }
        else {
            if( index != -1 ) {
                this.resultMsg = "Link " + link.linkName + 
                    " is already in group";
                return;
            }
            group.links.push( link._id );   // add link to group local copy
        }

        restapi.post( "/updateGroup/", group )
        .then( reply => {
            // check reply for status error later? 
            let msg = "Updated group " + group.groupName + " with link " + link.linkName ;
            console.log( msg, reply );
            this.resultMsg = msg;
            if( this.deleting ) {
                this.getLinkData( "" );
            }
            this.deleting = false;      // clear flag
        }).catch( error => {
            console.log( error );
            this.networkError = error;
            this.resultMsg = "";
        });
    },
    gridCallback: function ( link, cell ) {
        console.log( "list grid callback, link: ", link, ", cell: ", cell );

        if( cell == "edit" ) {
            // get the original record, not the grid subset
            let reclink = this.linkRecs.find( rec => rec._id == link._id );
            if( !reclink ) {
                // eslint-disable-next-line
                console.log( "showMore, gridlink._id not found: ", gridlink.id );
                return; 
            }

            console.log( "gridCallback: edit;, added options: ", reclink );
            this.global.editLink = reclink;       // pass link fields to "add"" form
            this.global.renderApp = "addLink";
        }
        else if( cell == "group" ) {
            /* Add or delete a link from the active group. 
             * If links are displayed for a user then Add to user's active 
             * group; if displayed for a group then delete from group. 
             * First set deleting flag true/false
             */
            this.deleting  = (this.linksfor == "group");
            this.addToGroupDialog( link );
        }
        else if( cell == "info" ) {
            // Show extra fields
            this.showMore( link );
        }
        else if( cell == "link" ) {
            this.networkError = "";     // clear any visible error message

            // Bump click count in server records
            let linkId = { "_id": link._id }
            // eslint-disable-next-line
            console.log( "bumpClick, linkId: ", linkId );

            restapi.post( "/bumpClick/", linkId )
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
        else if( cell == "last" ) {
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
        let params = null;
        if(this.linksfor == "group" ) {
            console.log( "getLinkData: global.activeGroup:", this.global.activeGroup );
            if( !this.global.activeGroup ) {
                console.log( "getLinkData: no active group." );
                return;
            }
            url = "/getGroupLinks";
            params = {
                "group": this.global.activeGroup._id ,
                "hash": this.global.sessionHash
            }
        }
        else {
            url = "/getLinks/";
            params = {
                "name": user,
                "hash": this.global.sessionHash
            }
        }


        // eslint-disable-next-line
        console.log( "getLinkData: ", url, ", params: ", params );
        restapi.post( url, params )
        .then ( response => {
            let reply = response.data;
            
            console.log( "got Response: ", reply );
            if( reply.status != "success") {
                this.resultMsg = "";
                this.networkError = "Network error: " + reply.message;
                return;
            }

            /* Clear the grid of current data before we (re)write it */
            this.gridData = [];
            if( reply.recordList.length == 0 ) {
                if( this.linksfor == "group" ) {   // who has no links, group or user? 
                    this.resultMsg = "No links found for group " + this.global.activeGroup.groupName + 
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
                    last: link.useDate,
                    info: link.password,
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
    let user = this.global.loggedInName;
    if( user == "" ) {    // No one is logged in.
        return;
    }

    /* Handle arriving here from a URL driven invocation for a group. 
     * One indicator of this is an activeGroup with a name but no ID yet. 
     */
    console.log( "linkList; create: ", this.global.activeGroup );
    if( this.global.activeGroup &&
        this.global.activeGroup.groupName && 
        !this.global.activeGroup._id ) {

        // Get the group ID, then daiseychain to get the links
        let url = "/getGroupInfo/" + this.global.activeGroup.groupName;
        restapi.get( url )
        .then ( reply => {
            console.log( "getGroupRecord Reply.data: ", reply.data );
            if(reply.data.status == "success" ) {
                this.global.activeGroup = reply.data.groupList[0];
            }
            else {
                this.networkError = reply.data.message;
            }
            this.getLinkData( user );
        }).catch( error =>  {
            console.log( error );
            this.networkError = error;
        });
        return;
    }

    this.getLinkData( user );

    // Start listener for request for filtered list.
    EventBus.$on('FILTERED_LINKS_LIST', linkList => {
        console.log("FILTERED_LINKS_LIST got ", linkList );
        this.createList( linkList );
    });

  },
  data() {
      return {
        userName: "",
        resultMsg: "",
        networkError: "",
        linkRecs: [],       // list of full records of links
        deleting: false,    // true on button to remove from group

        /* grid stuff */
        gridColumns: [ 'name', 'link', 'tags', "last", "info", "group", "edit" ], // titles
        gridColStyles: {    // control the grid column widths 
            "select": "width: 36%", 
            "link":   "width: 20%", 
            "tags":   "width: auto",
            "last" :  "width: 2.4em; font-size: x-small;", 
            "info":   "width: 2.4em; font-size: x-small;",
            "group":  "width: 2.6em; font-size: x-small;",
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
}

.place-grid {
    position:   relative;
    width:      92%;
    min-width:  640px;
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
  /* width: controlled by col in table. */
  color:                var(--bt-form-text);
  /*  background-color:   var(--bt-table-backgroud);*/
  text-align:           center;
  margin:               auto;
  background-color:   white;
  
  border: 2px solid var( --bt-zoom-blue );
  border-radius: 12px;
  padding:      1px;
  text-align:   center;
  font-size:    1.1em;
}

.button_cell:hover {
  background-color:   var(--bt-hover-color);
}

</style>
