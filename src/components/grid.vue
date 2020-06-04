
<template>
<div class="wrapper">
  <form id="search">
    Search <input name="query" v-model="searchQuery" class="search-input" >
  </form>
  <div id="grid-template">
    <div class="table-header-wrapper">
      <table class="grid-table">
        <col style="width:40%"><col style="width:23%"><col style="width:30%"><col style="width:7%">
        <thead class="grid_table_head" >
          <th v-for="key in columns"  :key="key"
            @click="sortBy(key)"
            :class="{ active: sortKey == key }"
          >
            {{ key | capitalize }}
            <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"></span>
          </th>
        </thead>
     
        <tbody class="grid_table_body">
          <tr v-for="entry in filteredData" :key="entry"  >
            <td v-for="key in columns"  :key="key" 
             @click="td_clicked(entry, key)" 
             v-bind:class="{ 'button_cell': isButton(key) }" > 
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
    buttoncol: String
  },
  data(){
    return {
      searchQuery: '',
      sortKey: '',
      sortOrders: {},
    }
  },
  computed: {
    filteredData: function () {
      let sortKey = this.sortKey;
      let filterKey = this.searchQuery && this.searchQuery.toLowerCase();
      let order = this.sortOrders[sortKey] || 1;
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
    sortBy: function (key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    td_clicked: function (entry, key) {
        if( this.callback ) {
          this.callback( entry, key );
        }
    },
    isButton: function (key) {
        if( key == this.buttoncol) {
            return true;
        }
        else {
            return false;
        }
    }
  },
  created(){
    let sortOrders = {};
    this.columns.forEach(function (key) {
      sortOrders[key] = 1;
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
  cursor:       pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding-right:    5px;
}

.grid_table_body tr {
  background-color: #f9f9f9;
  padding:        3px;
}

.search-input {
  width:    80%;
}

.button_cell {
  height:       0.8em;
  width:        7em;
  color:        var(--bt-form-text);
  background-color:  white;

  border: 2px solid var( --bt-zoom-blue );
  border-radius: 12px;
  padding:      1px;
  text-align:   center;
  font-size:    0.8em;
}

.button_cell:hover {
  background-color:   var(--bt-hover-color);
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
  padding:        3px;
  border: 1px solid #998877;
}

.arrow {
  display:        inline-block;
  vertical-align: middle;
  width:          0;
  height:         0;
  margin-left:    5px;
  opacity:        0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}

</style>
