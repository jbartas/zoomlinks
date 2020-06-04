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
        <div>
            <button v-on:click="submitLink()" > Save Link </button>
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

        let newLink = {
            "userName": this.$parent.loggedInName,
            "linkName":     this.linkName,
            "linkURL":  this.linkURL,
            "linkTags": this.linkTags,
            "linkPassword": this.linkPassword,
            "type":     "zoom",        // make smarter later - search URL for ".com" ?
            "clicks":   0
        }
        console.log( "link submit; ", newLink );
        restapi.post( "/newLink", newLink )
        .then(
            response => {
                let reply = response.data;
                if( reply.status == "success") {
                    this.resultMsg = "Created new link entry";
                    // this.$parent.renderApp = "listLinks";
                }
                else {
                    this.resultMsg = "Unable to create link record";
                    // eslint-disable-next-line
                    console.log( "addLink create error: ", reply );
                }
            }).catch( error =>  {
                // eslint-disable-next-line
                console.log( error );
                this.networkError = "Network: " + error;
            });

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
        linkPassword: ""
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
