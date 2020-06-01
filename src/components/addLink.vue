<template>
  <div class="add_link">

   <div class="place-form" style="width: 20em;" >
      <form name="add-link" class="grid-2cols sb_form form-width" autofill="off" v-on:submit.prevent >
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
        <label> &nbsp; </label>
        <div>
            <button v-on:click="submitLink()" > Save Link </button>
        </div>
      </form>
    </div>

    <div class="place-error" >
      <div class="errorMsg">{{networkError}}</div>
      <div class="errorMsg">{{loginStatus}}</div>
    </div>
 
  </div>
</template>


<script>
//import restapi from "../restapi.js";

export default {
  name: 'login',
  methods: {
      submitLink: function() {
        // eslint-disable-next-line

        let newLink = {
            "name":     this.linkName,
            "linkURL":  this.linkURL,
            "linkTags": this.linkTags,
            "addDate":  new Date().toJSON,
            "useDate":  new Date().toJSON,
            "userEmail": this.$parent.userEmail
        }
        console.log( "link submit; ", newLink );
      }
  },
  data() {
    return {
        networkError: "",
        loginStatus: "",
        linkURL: "",
        linkName: "",
        linkTags: ""
    }
  }
}

</script>

<style scoped>

.add_link {
    position:   relative;
    min-width:  470px;
    color:      var(--bt-form-color);
    margin:     10px;
    padding:    10px;
    text-align: center;
}

.form-width {
    width:   140%;
}

.grid-2cols {
     display:           grid;
     grid-template-columns:  22%  auto;
     grid-gap:          4px;
}

input {
    width: 98%;
}

.place-form {
    position:   relative;
    top:        2em;
    left:       14%;
}

.place-error {
    position:   relative;
    left:       1px;
    top:        2em;
}

</style>
