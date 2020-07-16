<template>
  <div class="add_link">

    <div class="grid-addfor"  v-if="activeGroup && (editLink == null)" 
            title="All group links must be owner by a user. When you create a new link 
                for a group it is automatically added to your links as well. " >
        Add link for: 
        <span class="ctrl-pair" >
            <input type="radio" value="user" v-model="addfor" > User {{loggedInName}} only, or 
        </span>
        <span class="ctrl-pair" >
            <input type="radio" value="group"  v-model="addfor" > Group {{activeGroup.groupName}} too.
        </span>
    </div>

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
            <label> Add Zoom Fields:</label>
            <div  title="Check to add add typical 'zoom' items.">
                <input type=checkbox name="setZoom" v-model="setZoom">
            </div>
            <!-- Move this to it's own GIT branch
            <label> Add Day/Date/Time Fields:</label>
            <div  title="Check to add date, day of the week, and/or time for an event.">
                <input type=checkbox name="setDayDate" v-model="setDayDate">
            </div>
            -->
            <label> Add Custom Fields:</label>
            <div title="Check to add your own custom field.">
                <input type=checkbox name="setCustoms" v-model="setCustoms">
            </div>
        </div>

        <div class = "grid-2cols" v-if="setDayDate" >
            <div></div><div><br><strong> Day, Date and time info for appoinment or event. </strong></div>
            <label> Date of first or next event </label>
            <div title="Pick a date from the date picker">
                <input  placeholder="Date" />
            </div>
        </div>

        <div class = "grid-2cols" v-if="setCustoms" >
            <div></div><div> <strong> Your custom data. </strong></div>
            <div>
                <input  placeholder="Name" v-bind="options.custom.name"
                    title="Give your custom field a name, like 'password' or 'contact email'." 
                    autocomplete="off" />
            </div>
            <div title="Enter your new field's text value, like 'john@gmail.com'">
                <input  placeholder="Content" v-bind="options.custom.value"
                    autocomplete="off" />
            </div>
        </div>

        <div class = "zoom-2cols" v-if="setZoom" >
            <div><strong>Zoom data</strong></div>
            <div> Note: all Zoom fields are optional. </div>

            <label> Zoom Passsword </label>
            <div title="Enter zoom password. If none then leave it blank">
                <input  placeholder="Password" v-model="zoomPassword"
                    autocomplete="off" />
            </div>
            <label> Zoom Meeting ID (9 digits, from Zoom) </label>
            <div title="Meeting ID is usually 9-11 digits" >
                <input  placeholder="Meeting ID number" v-model="zoomID"
                    autocomplete="off" />
            </div>
            <label> Zoom Meeting Phone (from Zoom) </label>
            <div title="Phone number for calling in to meeting" >
                <input  placeholder="Meeting Phone number" v-model="zoomPhone"
                    autocomplete="off" />
            </div>
            <label> Contact person's Name </label>
            <div>
                <input  placeholder="Contact Name"  v-model="zoomContactName"
                    autocomplete="off" />
            </div>
            <label> Contact person's Phone </label>
            <div>
                <input  placeholder="Contact Phone" v-model="zoomContactPhone"
                    autocomplete="off" />
            </div>
            <label> Contact person's Email </label>
            <div title="Enter contact's email address, e.g. 'john@gmail.com'">
                <input  placeholder="Contact@email.com" v-model="zoomContactEmail"
                    autocomplete="off" />
            </div>
        </div>

        <label> &nbsp; </label>
        <div class="bottom_buttons" v-if="editLink == null" >
            <button v-on:click="submitLink()" > Save Link </button>
        </div>
        <div class="bottom_buttons"  v-if="editLink" >
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

        // bundle the options in array
        this.setOptions();

        let newLink = {
            "userName": this.$parent.loggedInName,
            "linkName": this.linkName,
            "linkURL":  this.linkURL,
            "linkTags": this.linkTags,
            "type":     "basic",
            "clicks":   0,
            "options":  this.options,
        }

        // Add optional stuff to new group
        if( this.setZoom ) {
            newLink.type = "zoom";
        }

        // If we're editing a link send the Id to the server along with the data
        if( this.editLink ) {
            newLink._id = this.editLink._id;
            newLink.clicks = this.editLink.clicks;  // don't lose counter
        }
        console.log( "link submit; newlink: ", newLink );

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

                    if( this.addfor == "group" ) {      // Add link to group as well
                        console.log("adding new link to group, newLink: ", reply.newLink );
                        // add link to group local copy
                        this.activeGroup.links.push( reply.newLink._id );

                        restapi.post( "/updateGroup", this.activeGroup )
                        .then( reply => {
                            // check reply for status error later? 
                            let msg = "Updated group " + this.activeGroup.groupName + 
                                " with link " + this.linkName ;
                            console.log( msg, reply );
                            this.resultMsg = msg;
                        }).catch( error => {
                            console.log( error );
                            this.networkError = error;
                            this.resultMsg = "";
                        });
                    }

                    // Clear the saved fields from display
                    this.linkURL = "";
                    this.linkName = "";
                    this.linkTags = "";
                    this.zoomPassword = "";
                    this.zoomID = "";
                    this.zoomPhone = "";          // Phone for calling in
                    this.zoomContactName = "";
                    this.zoomContactPhone = "";
                    this.zoomContactEmail = "";
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
    },
    getOptions: function() {
        // get Zoom options into zoom data fields
        console.log( "setZoom: options: ", this.options  );
        if( this.options && this.options.length > 0 ) {
            // go through options looking for zoom data
            this.options.forEach( option => {
                if( option.name == "Zoom Password" ) {
                    this.zoomPassword =  option.value;
                }
                else if( option.name == "Zoom ID" ) {
                    this.zoomID =  option.value;
                }
                else if( option.name == "Zoom Phone" ) {
                    this.zoomPhone =  option.value;
                }
                else if( option.name == "Zoom Contact Phone" ) {
                    this.zoomContactPhone =  option.value;
                }
                else if( option.name == "Zoom Contact Name" ) {
                    this.zoomContactName =  option.value;
                }
                else if( option.name == "Zoom Contact Email" ) {
                    this.zoomContactEmail =  option.value;
                }
            });
        }
    },
    setOptions: function() {
        if( this.setZoom ) {
            // bundle Zoom options from data fields into options record format
            this.options = [];  // clear any existing options
            this.options.push( { name: "Zoom Password", value: this.zoomPassword } ) 
            this.options.push( { name: "Zoom Phone", value: this.zoomPhone } ) 
            this.options.push( { name: "Zoom ID", value: this.zoomID } ) 
            this.options.push( { name: "Zoom Contact Name", value: this.zoomContactName } ) 
            this.options.push( { name: "Zoom Contact Phone", value: this.zoomContactPhone } ) 
            this.options.push( { name: "Zoom Contact Email", value: this.zoomContactEmail } ) 
        }
    }
  },
  watch: {
    setZoom: function() {
        // make sure display zoom data matches record in memory
        if( this.setZoom ) {
            this.getOptions();
        }
    },
    setCustoms: function() {
        this.options.custom = { name: "", value:"" };
    }
  },
  created: function() {
        // editLink also serves as a flag for edit display
        this.editLink = this.$parent.editLink;

        // eslint-disable-next-line
        console.log( "addLink create(), edit: ", this.editLink );
        this.$parent.editLink = null;       // we have a local copy, slear the parent

        /* Set up globals */
        this.loggedInName = this.$parent.loggedInName;
        this.activeGroup = this.$parent.activeGroup;
        if( this.activeGroup ) {
            this.addfor = "group"
        }

        // If we're editing a link, get the fields from the server
        if ( this.editLink ) {
                let link = this.editLink;
                this.linkURL = link.linkURL;
                this.linkName = link.linkName;
                this.linkTags = link.linkTags;
                if( link.options ) {
                    this.options = link.options;
                }
                if( this.type == "zoom" ) {
                    this.setZoom = true;
                }
        }
  },
  data() {
    return {
        networkError: "",
        resultMsg: "",
        editLinkId: "",     // ID of link if a link is being edited.

        loggedInName: "",
        activeGroup: "",

        addfor: "user",     // adding link to "user" or "group"

        // Fields in form for new link
        linkURL: "",
        linkName: "",
        linkTags: "",

        // handling for custom fields
        setCustoms: false,      // true do set custom fields
        setZoom: false,         // true if a zoom link
        setDayDate: false,      // true to add Day/Date/Time info

        options: [],            // name/value pairs of link options

        // Other data - all zoom options for now
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
    display:        grid;
    grid-template-columns:  8em  auto;
    grid-gap:       4px;
    transition:     0.3s;
}

.grid-addfor {
    position:       relative;
    top:            0.8em;
    text-align:     left;
    display:        grid;
    grid-template-columns:  auto  auto auto;
    grid-gap:       4px;
    max-width:      38em;
    margin:         auto;
}

.zoom-2cols {
    display:        grid;
    grid-template-columns:  40%  auto;
    grid-gap:       4px;
    transition:     0.3s;
}

.ctrl-pair {
    display:        grid;
    grid-template-columns:  auto  auto;
}

.bottom_buttons {
    position:       relative;
    top:            0.8em;
    margin:         0.5em;
}

.checkboxes {
    position:       relative;
    top:            0.8em;
    height:         2.1em;
    margin:         0.9em;
    text-align:     left;
    display:        grid;
    grid-template-columns:  auto  4em  auto  4em  auto  4em  auto;
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
