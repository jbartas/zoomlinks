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
                        @click="clicked( entry, 'info' )" >
                    </button>
                    <button class="tile-button clock_cell fa-list"
                        @click="clicked( entry, 'edit' )" >
                    </button>
                    <button class="tile-button clock_cell fa-group"
                        @click="clicked( entry, 'group' )" >
                    </button>
                </div>
                <div>
                    <div class="tile-item url_cell"
                            @click="clicked( entry, 'link' )" >
                        {{entry["link"]}}
                    </div>
                    <div class="tile-item">
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
        global: Object
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
    },
    created () {
        this.searchQuery = this.global.urlParams.search;
    }
}

</script>


<style scoped >

.place-tiles {
    position:   relative;
}

.url_cell {
    border:         1px solid grey;
    color:          var( --bt-form-color );
    background-color:   var( --bt-hover-color );
}

.buttons-3cols {
    position:   relative;
    top:        0.5em;
    display:    grid;
    grid-template-columns:  auto auto auto;
    grid-gap:   4px;
}

</style>

