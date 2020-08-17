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
            <div class="grid-2cols" >
                <div class="buttons-2cols">
                    <button class="tile-button clock_cell fa-check-square-o" 
                        @click="clicked( entry, 'select' )" >
                    </button>
                    <button class="tile-button clock_cell fa-pencil-square-o"
                        @click="clicked( entry, 'edit' )" >
                    </button>
                </div>
                <div>
                    <div class="tile-item" >
                        {{entry["description"]}}
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
    name: "grouptiles",
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

.place-tiles {
    position:   relative;
}

.buttons-2cols {
    display:           grid;
    grid-template-columns:  auto  auto;
    grid-gap:          0.4em;
}

.tile_title {
    position:   relative;
    top:        0.3em;
    height:     1.7em;
}

.tile-item {
    height:     0.7em;
}

</style>

