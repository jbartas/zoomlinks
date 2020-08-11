<template>
<div class="tile-wrapper" >

    <form id="search" class="tile-search" autocomplete="off" >
        Search <input name="query" v-model="searchQuery" class="search-input" >
    </form>

    <div class="place-tiles" >
        <div v-for="entry in filteredData" :key="entry._id"  class="one-tile" >
            <div class="data-item tile_title">
                {{entry["name"]}}
            </div>
            <div class="grid-2cols" >
                <div class="buttons-3cols">
                    <button class="tile-button clock_cell fa-calendar-check-o">
                    </button>
                    <button class="tile-button clock_cell fa-list">
                    </button>
                    <button class="tile-button clock_cell fa-group">
                    </button>
                </div>
                <div>
                    <div class="data-item url_cell">
                        {{entry["link"]}}
                    </div>
                    <div class="data-item">
                        {{entry["tags"]}}
                    </div>
                </div>
            </div>            
        </div>
    </div>

</div> 

</template>

<script>

export default {
    name: "grid",
    props: {
        data: Array,
    },
    data(){
        return {
        searchQuery: '',
        sortKey: 'use',
        sortOrders: {},
        }
    },
    methods: {
        sortBy: function (key) {
        this.sortKey = key;
        this.sortOrders[key] = this.sortOrders[key] * -1
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
    }

}

</script>


<style scoped >

.tile-wrapper {
    overflow:   clip;
}

.place-tiles {
    position:   relative;  
    --grid-url-color:   #4a2888;
}

.data-item {
    border:         1px solid grey;
    border-radius:  4px;
    max-width:      62vw;
    height:         1.2em;
    margin:         3px;
    padding:        3px;
    color:          var( --bt-form-color );
    background-color:   white;
    overflow:       hidden;
    white-space:    nowrap;
}

.tile_title {
    font-weight:    700;
    width:          94%;
    max-width:      86vw;
}

.one-tile {
    border:         1px solid grey;
    border-radius:  6px;
    max-width:      94vw;
    margin:         6px;
    padding:        4px;
    text-align:     left;
    background-color:   var( --bt-table-backgroud );
}

.url_cell {
    background-color:   var( --bt-hover-color );
    font-weight:        700;
}

/* Over-write default grids */
.grid-2cols {
    display:           grid;
    grid-template-columns:  8em  auto;
    grid-gap:          4px;
}

.buttons-3cols {
    position:   relative;
    top:        0.5em;
    display:    grid;
    grid-template-columns:  auto auto auto;
    grid-gap:   4px;
}

.tile-button {
    position:   relative;
    width:      1.6em;
    max-width:  1.6em;
    height:     1.6em;
}

.tile-search {
    position:   relative;
    left:       0.6em;
    text-align: left;
}

.search-input {
    /* over-ride normal input min-width */
    min-width:  60%;
}

</style>

