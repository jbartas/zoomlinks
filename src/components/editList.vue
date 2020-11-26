<template>
  <div class="edit_list">

    <div class="place-form" >
      Editing a List of links
      <form name="add-link" class="sb_form form-width" v-on:submit.prevent >
        <div v-bind:class="global.portrait?'controls-tall':'controls-wide'" >
            <label> List name: </label>
            <div>
                <input name="listName" v-model="listName"
                    title="Give the link any name you like" autocomplete="off" />
            </div>
            <label> Created: </label>
            <div>
                {{listCreated}}
            </div>
            <label> Expires:</label>
            <div>
                {{listExpires}}
            </div>
            <label> Hours: </label>
            <div>
                <input name="ttlhours" v-model="ttlHours"
                    title="hours to exist" autocomplete="off" />
            </div>
        </div>   <!-- end top inputs -->

        <div> <br>
          Links in this List:
        </div>
          <table class="grid-table" >
            <tr v-for="link in links" :key="link._id" >
              <td class="td-text">
             {{link.name}}
              </td>
              <td class="td-button">
                <button class="small-button"
                v-on:click="btn_clicked('remove', link._id)"
                > Remove </button>
              </td>
              <td class="td-button">
                <button class="small-button" 
                > Edit </button>
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
//import restapi from "../restapi.js";

export default {
  name: 'editList',
  props: {
      global: Object,
  },
  methods: {
      submitList: function() {

        this.networkError = "";     // first clear any old error
        this.resultMsg = "Working...";

        console.log( "submitList; id: ", this.editListId );

      },
      deleteList: function() {
        this.networkError = "";     // first clear any old error
        this.resultMsg = "Working...";

        console.log( "deleteList; id: ", this.editListId );

      },
      btn_clicked: function ( operation, id ) {
          console.log( "list entry btn, op:", operation, ", Id:", id );
      },
  },
    created: function() {
        if( !this.global.loggedInID ) {    // No one is logged in.
            console.log( "editList - not logged in" );
            return;
        }
        this.editListId = this.global.editList._id;
        this.listName = this.global.editList.name;
        this.listCreated = this.global.editList.created;
        this.listExpires = this.global.editList.ends;
        let startDate = new Date(this.listCreated);
        let endDate = new Date(this.listExpires);
        let ttl = endDate - startDate
        this.ttlHours = ttl / 3600000;
        this.ttlMinutes = (ttl - this.ttlHours) / 6000;
        

    },
  data() {
    return {
        networkError: "",
        resultMsg: "",
        editListId: "XXX",     // ID of list 
        listName: "",
        listCreated: "",
        listExpires: "",
        links:[ { name: "a link name",       _id: 123 }, 
                { name: "another link name", _id: 456 } 
              ],
        ttlHours: 0,
        ttlMinutes: 0
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
    top:            0.8em;
    max-width:      94vw;
    margin:         0.5em;
    margin-left:    0em;
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

</style>
