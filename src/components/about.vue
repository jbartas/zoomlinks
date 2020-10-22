<template>
  <div class="about">
    <div class="place-about" >

<button class="accordion" v-on:click="onClick('what')" > What it is </button>
<div class="panel" id="what" >
<p>
Linkshare is a free web site where you can save, share, name and tag 
your favotite links. The links are always available, and easy to 
sort &amp; search. It's better than bookmarks because your links are available 
from any device and browser, anywhere. The tags make searching for links 
super easy, and built-in sharing groups and sharing make handling many links 
across an organization a breeze. 
</p>
<p>
It's the last link you will ever have to remember.
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
As computer people, we use different computers, phones, and tablets 
with a variety of Browsers and operating systems. 
A solution like bookmarks, a Google doc, or iCloud would only work 
in a few of these environments. A free public online space like Google Drive 
might work, but they are pretty much guaranteed to sell your information 
or use it for advertising. Plus most of these systems lack a fast search 
and click option, and do not address sharing lists of links with friends 
or co-workers.
</p><p>
Thus we created Linkshare.link. Fast, free, flexible saving and sharing of 
Zoom and all your other links, and we promise we will never sell your 
information.
</p>
</div>

<button class="accordion"  v-on:click="onClick('help')" > Help &amp; Requests </button>
<div class="panel" id="help">
    <p><strong>Have a request or need help? </strong></p>
    <p class="req-message" >
      Send me an email - I'll look into it. Feel free to attach screen captures. 
      Be sure to let me know if you want a direct reply.
    </p>
    <p>
    <a href="mailto:jbartas@gmail.com" >
      <button> Email request </button>
    </a>
    </p>
</div>

<button class="accordion"  v-on:click="onClick('new')" > What's New </button>
<div class="panel" id="new">
<p>
  <strong>August 17, 2020 - </strong> Finally, the mobile version! <br>
The same Zoomlinks website that works smoothly on your desktop browser 
now scales down to your phone. On loading it detects whether your screen 
is horizontal or vertical and adjusts accordingly. <br>
Tested on Chrome on Android phones - try it out and send feedback. 
</p>
<p>
  <strong>June 29th, 2020 - </strong> New support created for info 
  specific to Zoom links (and other video 
  chat services). You can now save the password, Zoom ID, and more. 
  Click on "Zoom link" in "add link" page to fill in the Zoom info. 
  In My Links page click on the 'More' icon to see the Zoom info.
</p>
</div>

<button class="accordion"  v-on:click="onClick('funding')" > Funding </button>
<div class="panel" id="funding">
<p>
Our committment is to keep link saving and sharing free for all users.  If 
the site grows to a point where the web server bills become expensive, we 
may resort to ads or crowdfunding. But we will never ask our non-business users 
to pay a fee, and we will never, ever sell your personal information (for example 
what links you saved).
</p>
</div>

<button class="accordion"  v-on:click="onClick('soon')" > Features Coming Soon </button>
<div class="panel" id="soon">
<p>
<strong>Link Lists</strong> - Make a list of links &amp; and share the 
list with others. Lists of inks can be viewed by anyone, even if they don't have 
a linkshare account. If you do have an account you can marge a list
of links from another user with your links. This will be a fast and easy way 
to share sets of links with teams and freinds.  
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
    min-width:  370px;
    color:      var(--bt-form-color);
    text-align: left;
}

.place-about {
    position:     relative;
    min-width:    18em;
    max-width:    62em;
    padding-top:  1em;
    margin:       auto;
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
