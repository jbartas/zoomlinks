
<template>
<div class="wrapper">
  <form id="search">
    Search <input name="query" v-model="searchQuery" class="search-input" >
  </form>
  <div id="grid-template">
    <div class="table-header-wrapper">
      <table class="grid-table">
        <thead class="grid_table_head" >
          <th v-for="key in columns"  :key="key"
            @click="sortBy(key)"
            :class="{ active: sortKey == key }"
            :style="getColStyle(key)"
          >
            {{ key | capitalize }}
            <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"
              title="Click to order this column"></span>
          </th>
        </thead>
     
        <tbody class="grid_table_body">
          <tr v-for="entry in filteredData" :key="entry._id" class="grid_tr" >
            <td v-for="key in columns"  :key="key" 
             @click="td_clicked(entry, key)" 
             v-bind:class="getclass(key)" > 
              {{entry[key]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div> 

</template>

<script>

export default {
  name: "grid",
  props: {
    data: Array,
    columns: Array,
    callback: Function,
    cellcss: Object,
    colstyle: Object
  },
  data(){
    return {
      searchQuery: '',
      sortKey: 'use',
      sortOrders: {},
    }
  },
  computed: {
    filteredData: function () {
      let sortKey = this.sortKey;
      let filterKey = this.searchQuery && this.searchQuery.toLowerCase();
      let order = this.sortOrders[sortKey] || 1;
      //let order = -1;
      let data = this.data;

      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        })
      }
    return data;
    },
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },
  methods: {
    getColStyle: function( key ) {
        // console.log("getColStyle: key: ", key );
        if( this.colstyle && this.colstyle[key] ) {
          return this.colstyle[key];
        }
        else {
          return "width: auto";
        }
    },
    sortBy: function (key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    td_clicked: function (entry, key) {
        if( this.callback ) {
          this.callback( entry, key );
        }
    },
    getclass: function (key) {
        if( this.cellcss[key] ) {
            //console.log( " css.key: ", this.cellcss[key] );
            return this.cellcss[key];
        }
        else {
            //console.log( " NO css for key " );
            return "text_cell";
        }
    }
  },
  created(){
    let sortOrders = {};
    this.columns.forEach(function (key) {
      sortOrders[key] = -1;
    })
    this.sortOrders = sortOrders;
  }
}

</script>

<style scoped >

.grid-table {
  table-layout:   fixed;
  position: relative;
  left:     0%;
  width:    100%;
  color:    var( --bt-text-color );
  border-spacing: 6px;
}

.grid-table th {
  cursor:           pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select:  none;
  user-select:      none;
  padding-right:    5px;
  text-align:       center;
}

.grid_table_body tr {
  background-color: #f9f9f9;
  padding:        1px;
}

tr:hover {
    background-color:   var(--bt-hover-color);
}
.search-input {
  width:    80%;
}

.grid_table_head {
    max-height:    20px;
}

th.active {
  color:        var(--bt-form-color);
}

th.active .arrow {
  opacity: 1;
}

td {
  overflow:       hidden;
  white-space:    nowrap;
  padding-left:   4px;
}

/* formatting for <td> cell with no passed cellcss entry */
.text_cell {
  text-align:     left;
  border: 1px solid  var(--grid-cell-border);
}

.arrow {
  display:        inline-block;
  vertical-align: middle;
  width:          0;
  height:         0;
  margin-left:    5px;
  opacity:        0.86;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #00f;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #00f;
}

</style>
