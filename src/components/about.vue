<template>
  <div class="about">
    <div class="place-about" >

<h3>What it is:</h3>
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

<h3>Funding:</h3>
<p>
Our committment is to keep link saving and sharing free for all users.  If 
the site grows to a point where the web server bills become expensive, we 
may resort to ads or crowdfunding. But we will never ask our users to pay 
a fee, and we will never, ever sell your personal information (like what 
links you saved).
</p>

<h3>Features Coming Soon:</h3>

<p>
Groups - form a group, invite friends, and then everybody in the group can 
have the latest updated info for all the links the group uses. Groups are 
private so you don't get Zoom Bombed; and if you need to change a link or 
password you can instantly update it and notify the whole group.
</p><p>
Friends - Friend another LinkShare user and you can easily share any links 
you want with them.
</p><p>
Mail tool - If you want to send a set of links to someone outside of LinkShare 
just select the links to share and send an email or text with them.
</p>

    
    </div>
  </div>
</template>


<script>

export default {
  name: 'about',
  props: {
    msg: String,
  },
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

</style>
