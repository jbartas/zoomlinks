<template>
<div class="tile-wrapper" >

    <form id="search" class="tile-search" autocomplete="off" >
        Search <input name="query" v-model="searchQuery" class="search-input" >
    </form>

    <div class="place-tiles" >
        <div v-for="entry in filteredData" :key="entry._id"  class="one-tile" >
            <div class="tile_title">
                {{entry["name"]}}
            </div>
            <div class="tile-2cols" >
                <div class="buttons-3cols">
                    <button class="tile-button clock_cell fa-calendar-check-o" 
                        @click="clicked( entry, 'more' )" >
                    </button>
                    <button class="tile-button clock_cell fa-list"
                        @click="clicked( entry, 'edit' )" >
                    </button>
                    <button class="tile-button clock_cell fa-group"
                        @click="clicked( entry, 'group' )" >
                    </button>
                </div>
                <div>
                    <div class="data-item url_cell"
                            @click="clicked( entry, 'link' )" >
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
    name: "tiles",
    props: {
        data: Array,
        callback: Function,
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
        },
        clicked: function( link, item ) {
            this.callback( link, item );
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
    background-color:   var( --bt-table-backgroud );
}

.place-tiles {
    position:   relative;
}

.data-item {
    height:         1.1em;
    width:          21em;
    max-width:      64vw;
    margin:         3px;
    padding:        3px;
    color:          var( --bt-dark-text );
    overflow:       hidden;
    white-space:    nowrap;
}

.tile_title {
    font-weight:    700;
}

.one-tile {
    border-radius:  6px;
    width:          30em;
    max-width:      93vw;
    margin:         6px;
    padding:        4px;
    text-align:     left;
    background-color:   white;
}

.url_cell {
    border:         1px solid grey;
    color:          var( --bt-form-color );
    background-color:   var( --bt-hover-color );
}

.tile-2cols {
    display:           grid;
    grid-template-columns:  8em  22em;
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

