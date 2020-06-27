<template>
  <div class="add_link">

   <div class="place-form" >
      <form name="add-link" class="sb_form form-width" v-on:submit.prevent >
        <div class="grid-2cols ">
            <label> Link name: </label>
            <div>
                <input name="linkName" v-model="linkName" placeholder="Give link a name" 
                    title="Give the link any name you like" autocomplete="on" />
            </div>
            <label> Link URL:</label>
            <div>
                <input name="linkURL" v-model="linkURL" placeholder="Paste/type link" 
                    title="Paste or type the full URL of the link" autocomplete="off" />
            </div>
            <label> Tags:</label>
            <div>
                <input name="linkURL" v-model="linkTags" placeholder="Put tags here" 
                    title="Put 'tag' (sets of words separated by commas) here to find the link later." 
                    autocomplete="off" />
            </div>
        </div>   <!-- end class = grid-2cols-->
        <div class="checkboxes" >
            <label> Is this a Zoom link?:</label>
            <div  title="Check to add add typical 'zoom' items.">
                <input type=checkbox name="setZoom" v-model="setZoom">
            </div>
            <label> Add a Custom Field?:</label>
            <div title="Check to add your own custom field.">
                <input type=checkbox name="setCustoms" v-model="setCustoms">
            </div>
        </div>
        <div class = "grid-2cols" v-if="setCustoms" >
            <div></div><div> Your custom data. </div>
            <div>
                <input  placeholder="Name" v-bind="options.custom.name"
                    title="Give you custom field a name, like 'password' or 'contact email'." 
                    autocomplete="off" />
            </div>
            <div title="Enter your new field's text value, like 'john@gmail.com'">
                <input  placeholder="Content" v-bind="options.custom.value"
                    autocomplete="off" />
            </div>
        </div>
        <div class = "zoom-2cols" v-if="setZoom" >
            <div><strong>Zoom data</strong></div>
            <div> Note: all fields are optional. </div>

            <label> Zoom Passsword </label>
            <div title="Enter zoom password. If none then leave it blank">
                <input  placeholder="Password" v-bind="options.zoomPassword"
                    autocomplete="off" />
            </div>
            <label> Zoom Meeting ID (9 digits, from Zoom) </label>
            <div title="Meeting ID is usually 9 digits" >
                <input  placeholder="Meeting ID number" v-bind="options.zoomID"
                    autocomplete="off" />
            </div>
            <label> Zoom Meeting Phone (from Zoom) </label>
            <div title="Phone number for calling in to meeting" >
                <input  placeholder="Meeting ID number" v-bind="options.zoomPhone"
                    autocomplete="off" />
            </div>
            <label> Contact person's Name </label>
            <div>
                <input  placeholder="Contact Name"  v-bind="options.zoomcontactName"
                    autocomplete="off" />
            </div>
            <label> Contact person's Phone </label>
            <div>
                <input  placeholder="Contact Phone" v-bind="options.zoomcontactPhone"
                    autocomplete="off" />
            </div>
            <label> Contact person's Email </label>
            <div title="Enter contact's email address, e.g. 'john@gmail.com'">
                <input  placeholder="Contact@email.com" v-bind="options.zoomcontactEmail"
                    autocomplete="off" />
            </div>
        </div>

        <label> &nbsp; </label>
        <div v-if="editLink == null" >
            <button v-on:click="submitLink()" > Save Link </button>
        </div>
        <div v-if="editLink" >
            <button v-on:click="submitLink()" > Save Edits </button>
            <button v-on:click="deleteLink()" > Delete Link </button>
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
  name: 'addLink',
  methods: {
      submitLink: function() {

        this.networkError = "";     // first clear any old error
        this.resultMsg = "Working...";

        console.log( "link submit; options: ", this.options );

        if( this.linkURL == "" ) {
            this.resultMsg = "No 'link' (URL). Record not created";
            return;
        }

        let newLink = {
            "userName": this.$parent.loggedInName,
            "linkName": this.linkName,
            "linkURL":  this.linkURL,
            "linkTags": this.linkTags,
            "type":     "N/A",        // make smarter later - search URL for ".com" ?
            "clicks":   0,
            "options":  this.options
        }

        if( this.setZoom )
            newLink.type = "zoom";

        // If we're editing a link send the Id to the server along with the data
        if( this.editLink ) {
            newLink._id = this.editLink._id;
            newLink.clicks = this.editLink.clicks;  // don't lose counter
        }

        console.log( "link submit; ", newLink );
        restapi.post( "/newLink", newLink )
        .then(
            response => {
                let reply = response.data;
                if( reply.status == "success") {
                    // Set up messages for success
                    this.networkError = "";
                    if( this.editLink ) {
                        this.resultMsg = "Edits Saved";
                    }
                    else {
                        this.resultMsg = "Created new link entry";
                    }

                    // Clear the saved fields from display
                    this.linkURL = ""
                    this.linkName = ""
                    this.linkTags = ""
                    this.zoomPassword = ""
                }
                else {
                    this.resultMsg = "Unable to create link record";
                    // eslint-disable-next-line
                    console.log( "addLink create error: ", reply );
                }
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( error );
                this.resultMsg = "";
                this.networkError = "Save error: " + error;
            });
    },
    deleteLink: function ( ) {
        this.networkError = "";
        let linkInfo = {
            "link_id": this.editLink._id, 
            "userName": this.$parent.loggedInName
        };

        restapi.post( "/deleteLink", linkInfo )
        .then(
            response => {
                let reply = response.data;
                if( reply.status == "success") {
                    this.resultMsg = "Deleted";
                    this.networkError = "";
                }
                else {
                    this.loginStatus = "Login FAILED: " + reply.message;
                }
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( error );
                this.resultMsg = "";
                this.networkError = "Delete error: " + error;
            });
    }
  },
  watch: {
    setZoom: function() {
        // make sure display zoom data matches record in memory
        if( this.setZoom ) {
            console.log( "setZoom: options: ", this.options  );
            if( this.options && this.options.length > 0 ) {
                // go through options looking for zoom data
                this.options.forEach( option => {
                    if( option.name == "Zoom Password" ) {
                        this.zoomPassword =  option.value;
                    }
                    else if( option.name == "Zoom Contact" ) {
                        this.zoomContactName =  option.value;
                    }
                    else if( option.name == "Zoom Contact Phone" ) {
                        this.zoomContactPhone =  option.value;
                    }
                });

            }
        }
    }
  },
  created: function() {
        // editLink also serves as a flag for edit display
        this.editLink = this.$parent.editLink;

        // eslint-disable-next-line
        console.log( "addLink create(), edit: ", this.editLink );
        this.$parent.editLink = null;       // we have a local copy, slear the parent

        // If we're editing a link, get the fields from the server
        if ( this.editLink ) {
                let link = this.editLink;
                this.linkURL = link.url;
                this.linkName = link.name;
                this.linkTags = link.tags;
                if( link.options ) {
                    this.options = link.options;
                }
        }
  },
  data() {
    return {
        networkError: "",
        resultMsg: "",
        editLinkId: "",     // ID of link if a link is being edited.

        // Fields in form for new link
        linkURL: "",
        linkName: "",
        linkTags: "",

        // handling for custom fields
        setCustoms: false,      // true do set custom fields
        setZoom: false,         // true fi a zoom link

        options: [],            // name/value pairs of link options

        // Other data - all zoom for now
        zoomPassword: "",
        zoomID: "",
        zoomPhone: "",          // Phone for calling in
        zoomContactName: "",
        zoomContactPhone: "",
        zoomContactEmail: "",
    }
  }
}

</script>

<style scoped>

.add_link {
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

.grid-2cols {
     display:       grid;
     grid-template-columns:  8em  auto;
     grid-gap:      4px;
     transition:    0.3s;
}

.zoom-2cols {
     display:       grid;
     grid-template-columns:  40%  auto;
     grid-gap:      4px;
     transition:    0.3s;
}


.checkboxes {
    position:       relative;
    top:            0.8em;
    height:         2.5em;
    text-align:     left;
    display:        grid;
    grid-template-columns:  auto  4em  auto  4em  auto;
    grid-gap:       4px;
}

input {
    width: 90%;
}

.place-error {
    position:   relative;
    left:       1px;
    top:        2em;
}

</style>
