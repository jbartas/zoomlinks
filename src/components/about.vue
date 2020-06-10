<template>
  <div class="about">
    <div class="place-about" >

<button class="accordion" v-on:click="onClick('what')" > What it is </button>
<div class="panel" id="what" >
<p>
Linkshare is a free web site where you can save, share, name and tag 
your favotite links. The links are always available, and easy to 
sort &amp; search. It's better than bookmarks because your links are available 
from any computer and browser, anywhere. The tags make searching for links 
super easy, and built-in sharing groups and sharing make handling many links 
across an organization a breeze. 
</p>
</div>

<button class="accordion" v-on:click="onClick('why')" > Why we created it </button>
<div class="panel" id="why" >
<p>
Linkshare was started during the Corona-virus shutdown when we found ourselves 
flooded with cryptic, unnamed zoom links. Links for work, hobbies, social 
groups, friends - we went from having 3-4 zooms to dozens. And 
zoom meetings change group Ids and passwords regularly.
</p><p>
As computer people, we use different computers with a variety of Browsers 
and operating systems. A solution like bookmarks or iCloud would only work 
on a few of these environments. A free public online space like Google Drive 
might work, but they are pretty much guaranteed to sell your information 
or use it for advertising. Plus most of these systems lack a fast search 
and click option.
</p><p>
Thus we created Linkshare.link. Fast, free, flexible saving and sharing of 
Zoom and all your other links, and we promise we will never sell your 
information.
</p>
</div>


<button class="accordion"  v-on:click="onClick('funding')" > Funding </button>
<div class="panel" id="funding">
<p>
Our committment is to keep link saving and sharing free for all users.  If 
the site grows to a point where the web server bills become expensive, we 
may resort to ads or crowdfunding. But we will never ask our users to pay 
a fee, and we will never, ever sell your personal information (like what 
links you saved).
</p>
</div>

<button class="accordion"  v-on:click="onClick('soon')" > Features Coming Soon </button>
<div class="panel" id="soon">
<p>
<strong>Groups</strong> - form a group, invite friends, and then everybody in the group can 
have the latest updated info for all the links the group uses. Groups are 
private so you don't get Zoom Bombed; and if you need to change a link or 
password you can instantly update it and notify the whole group.
</p><p>
<strong>Friends</strong> - Friend another LinkShare user and you can easily share any links 
you want with them.
</p><p>
<strong>Mail tool</strong> - If you want to send a set of links to someone outside of LinkShare 
just select the links to share and send an email or text with them.
</p>
</div>

    
    </div>
  </div>
</template>


<script>

export default {
  name: 'about',
  props: {
    msg: String,
  },
  methods: {
    onClick: function( panelId ) {
        // eslint-disable-next-line
        console.log( "click event callback: " );

        /* Toggle between hiding and showing the active panel */
        var panel = document.getElementById( panelId );
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
        
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }         
    }
  }
}

</script>


<style scoped>

.about {
    position:   relative;
    min-width:  470px;
    color:      var(--bt-form-color);
    text-align: left;
}

.place-about {
    position:   relative;
    width:      70%;
    top:        2em;
    margin:     auto;
}

.accordion {
  position:     relative;
  cursor:       pointer;
  padding:      8px;
  width:        100%;
  text-align:   left;
  font-size:    1.2em;
  line-height:  1.4em;
  border:       none;
  outline:      none;
  transition:   0.3s;
  background-color: var( --bt-table-backgroud );
}

.active, .accordion:hover {
  background-color: var( --bt-hover-color );
}

.panel {
  padding: 0 18px;
  background-color: white;
  display: none;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.2s ease-out;
}

</style>
