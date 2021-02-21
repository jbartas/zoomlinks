<template>
  <div class="edit_list">

    <div class="place-form" >
      Editing a List of links
      <form name="add-link" class="sb_form form-width" v-on:submit.prevent >
        <div v-bind:class="global.portrait?'controls-tall':'controls-wide'" >
            <label> List name: </label>
            <div>
                <input name="listName" v-model="listName"
                    title="Give the list any name you like" autocomplete="off" />
            </div>
            <label> Created: </label>
            <div>
                {{listCreated}}
            </div>
            <label> Expires:</label>
            <div title="Date / Time when the list will auto-delete" >
                {{listExpires}}
            </div>
            <label   title="Time between creation and expiration"  > Duration: </label>
            <div>
                <input class="short-input" v-model="ttlDisplay"
                    title="time before the list expires" autocomplete="off" />
                &nbsp;
                <select class="units-input"  name="ttlUnits" v-model="ttlUnits" >
                  <option value="Hours">Hours</option>
                  <option value="Days">Days</option>
                </select>
            </div>
        </div>   <!-- end top inputs -->

        <div> <br>
          Links in this List:
        </div>
          <table class="grid-table" >
            <tr v-for="link in links" :key="link._id" >
              <td class="td-text">
             {{link.linkName}}
              </td>
              <td class="td-button">
                <button class="small-button"
                  v-on:click="btn_clicked('remove', link._id)"
                  title="Remove link from list. This will not erase the master copy."
                > Remove </button>
              </td>
            </tr>
          </table>

        <div class="bottom_buttons" >
            <button v-on:click="submitList()" > Save Changes </button>
            <button v-on:click="deleteList()" > Delete this List </button>
        </div>
      </form>
    </div>

    <div class="place-error" >
      <div class="errorMsg">{{networkError}}</div>
      <div class="resultMsg">{{resultMsg}}</div>
    </div>
 
  </div>
</template>


<script>
import restapi from "../restapi.js";

export default {
  name: 'editList',
  props: {
      global: Object,
  },
  methods: {
      submitList: function() {

        this.networkError = "";     // first clear any old error
        this.resultMsg = "Working...";

        console.log( "submitList; id: ", this.editListId, this.global.editList.linkIds );

        // update global.editList object with local vars 
        if( this.global.editList.name != this.listName ) {
          this.global.editList.name = this.listName;
          this.updateNeeded = true;
        }

        let startDate = new Date(this.listCreated);
        let endDate = new Date(this.listExpires);
        let ttl = endDate - startDate
        if( ttl != this.ttlHours * 3600000 ) {
          console.log( "changing end date, new ttl ", ttl );
          endDate = new Date(this.global.editList.created) + ttl;
          this.global.editList.ends = endDate.toString();
          this.updateNeeded = true;
        }

        // If we don't need to send update, skip it.
        if( this.updateNeeded != true ) {
          console.log( "submitList; No update needed." );
          return;
        }

        // extract the possibly changed link IDs into a list for server.
        let linkIds = [];
        this.links.forEach( link => {
          linkIds.push( link._id );
        })

        let updateList = { 
          hash: this.global.sessionHash,
          _id: this.editListId,
          linkIds: linkIds,
          name: this.global.editList.name,
          ttl: this.ttlHours * 3600     // in seconds
        }

        console.log( "updateList: ", updateList );

        // More here later (what ??)
        let url = "makeLinksList";

        restapi.post( url, updateList )
        .then( reply => {
            console.log( "submitList; reply: ", reply, ", list: ", updateList );
            this.resultMsg = "Updated List " + updateList.name + " created.";
            this.global.renderApp = 'listslist';
        }).catch( error =>  {
            console.log( error );
            this.networkError = error + " updating links list";
        });
      },
      deleteList: function() {
        this.networkError = "";     // first clear any old error
        this.resultMsg = "Working...";

        console.log( "deleteList; id: ", this.editListId );
        let url = "/deleteList/";
        let params = {
            "listId": this.editListId,
            "hash": this.global.sessionHash
        }
        restapi.post( url, params )
        .then( reply => {
            console.log( "deleteList; reply: ", reply );
            this.resultMsg = "Deleted List " + this.global.editList.name ;
            this.global.editList = null;
            this.global.renderApp = 'listslist';
        }).catch( error =>  {
            console.log( error );
            this.networkError = error + " deleting list";
        });

      },
      idxCallback: function( link ) {
        // console.log( "idxCallback, link:  ", link, ", Id:", this.delLinkId );
        if( link._id == this.delLinkId ) return true;
        // else
        return false;
      },
      btn_clicked: function ( operation, linkId ) {
          console.log( "list entry btn, op:", operation, ", Id:", linkId );
          this.delLinkId = linkId;
          let idx = this.links.findIndex( this.idxCallback );
          if (idx > -1) {
            this.links.splice(idx, 1);
            this.updateNeeded = true;   // flag to send update to server
          } else {
            console.log("bug: idx ", idx, "not in links[]");
          }
      },
  },
  created: function() {
        if( !this.global.loggedInID ) {    // No one is logged in.
            console.log( "editList - not logged in" );
            return;
        }
        console.log( "editList: created; editList: ", 
           this.global.editList );
        this.editListId = this.global.editList._id;
        this.listName = this.global.editList.name;
        this.listCreated = this.global.editList.created;
        this.listExpires = this.global.editList.ends;
        let startDate = new Date(this.listCreated);
        let endDate = new Date(this.listExpires);
        let ttl = endDate - startDate;
        this.ttlHours = ttl / 3600000;
        this.ttlDisplay = this.ttlHours;

        // Ask the server for the list links details.
        console.log("editList: created: Getting bulk data for links", this.global.editList );
        
        let url = "getBulkLinks";
        let params = { 
            "hash" : this.global.sessionHash,
            "linkIds" : this.global.editList.linkIds
        };

        restapi.post( url, params )
        .then( response => {
            let reply = response.data;
            console.log( "got List getBulkLinks reply: ", reply );
            if( reply.status != "success") {
                this.resultMsg = "";
                this.networkError = "Network error: " + reply.message;
                return;
            }

            this.links = reply.listLinks;

        }).catch( error =>  {
            // eslint-disable-next-line
            console.log( error );
            this.networkError = error;
        });
  },
  watch: {
    'ttlUnits': function( ) {
        if( this.ttlUnits == "Days" ) {
          this.ttlDisplay = this.ttlHours / 24;
        }
        else {
          this.ttlDisplay = this.ttlHours;
        }
    },
    'ttlDisplay': function() {
        if( this.ttlUnits == "Days" ) {
          this.ttlHours = this.ttlDisplay * 24; 
        }
        else {
          this.ttlHours = this.ttlDisplay; 
        }
    }
  },

  data() {
    return {
        networkError: "",
        resultMsg: "",
        editListId: "XXX",     // ID of list 
        listName: "",
        listCreated: "",
        listExpires: "",
        links:[],
        ttlHours: 3,
        ttlDisplay: 3,    // TTL time to display, depends on units (hours or days)
        ttlUnits: "Hours",
        updateNeeded: false
    }
  }
}

</script>

<style scoped>

.edit_list {
    position:   relative;
    color:      var(--bt-form-color);
    margin:     auto;
}

.place-form {
    position:   relative;
    top:        2em;
}

.form-width {
    margin:     auto;
    width:      70%;
    min-width:  640px;
}

.controls-wide {
    display:        grid;
    grid-template-columns:  8em  auto;
    grid-row-gap:   4px;
}

input {
    max-width:      90%;
}

.links {
    position:       relative;
    top:            0.8em;
    display:        grid;
    grid-template-columns:  8em  auto;
    grid-row-gap:   4px;

}

.grid-table {
  table-layout:   fixed;
  position: relative;
  left:     0%;
  width:    100%;
  color:    var( --bt-text-color );
  border-spacing: 6px;
}


.bottom_buttons {
    position:       relative;
    top:            0.2em;
    left:           0em;
    text-align:     center;
    max-width:      94vw;
    margin:         0.5em;
}

input {
    width: 75%;
}

.td-text {
  overflow:       hidden;
  white-space:    nowrap;
  padding-left:   4px;
  background-color: #fbfbfb;
  border: 1px solid  grey;

}

.td-button {
  width:          4em;
  height:         0.9em;
}

.small-button {
  width:          5em;
}

.place-error {
    position:   relative;
    left:       1px;
    top:        2em;
}

.short-input {
    position:   relative;
    left:       0%;
    width:      3em;
}

.units-input {
    position:   relative;
    width:      5em;
}

.sb_form {
    text-align: left;
}

</style>
