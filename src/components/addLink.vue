<template>
  <div class="add_link">

   <div class="place-form" >
      <form name="add-link" class="grid-2cols sb_form form-width" v-on:submit.prevent >
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

        <label> Password:</label>
        <div>
            <input name="linkPassword" v-model="linkPassword" placeholder="Password" 
                title="Optional - If link requeires a password" 
                autocomplete="off" />
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

        let newLink = {
            "userName": this.$parent.loggedInName,
            "linkName":     this.linkName,
            "linkURL":  this.linkURL,
            "linkTags": this.linkTags,
            "password": this.linkPassword,
            "type":     "zoom",        // make smarter later - search URL for ".com" ?
            "clicks":   0
        }

        // If we're editing a link send the Id to the server along with the data
        if( this.editLink ) {
            newLink._id = this.editLink._id;
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
                    this.linkPassword = ""
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
                this.linkPassword = link.password;
                this.linkTags = link.tags;
        }
  },
  data() {
    return {
        networkError: "",
        resultMsg: "",

        // Fields from form for new link
        linkURL: "",
        linkName: "",
        linkTags: "",
        linkPassword: "",
        editLinkId: ""
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
     display:           grid;
     grid-template-columns:  8em  auto;
     grid-gap:          4px;
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
