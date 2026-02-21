## Journey Through This Front End Project: 

Documenting this helps me reflect on where I stumbled, what I tried and how I
eventually pieced things together. Walking through the key parts, focusing on
the tough problems I hit, my thought process and the solutions that
finally clicked. It's all from my perspective, like a personal dev diary, to
remind myself and maybe others that these challenges are part of growing.

####  The Navbar

When I did the navbar, I had an idea of how to write it out and style the
navbars. Here I looked at figma and went straight to the prototype to directly
try to replicate the exact same navbar. Immediately I wanted to use flex for
this because flex default row would perfectly balance everything out. And it
made the navbar way simpler than having to create multiple elements, allowed me
to maintain exact paddings and finish it up.

#### Filter Logo

Dive into blending modes. The main header logo, to get this cool inversion
effect that reacts opposite to the background and having a glassy type of
effect. Using CSS filters and mix blending modes with brightness helps with that and
allowed for this see through effect with invert colors.

#### Mobile Dropdown Nav Menubar

Next up was the dropdown nav menubar, especially on mobile. The goal was a
smooth hamburger menu that locks scrolling when open and restores position on
close. 

Initially, on testing I could still scroll the background while the menu was open,
which felt a little janky. And when closing, it'd snap back weirdly. Eventually
fixed that in js, then pinned nav on open and instant restore when
reopen.

#### Shrinking the Logo on Scroll Page

Shrinking the logo on scroll was fun. Accidentally implemented the
spacebar as well but I realized early on that it was just for figma
demonstration according to the comment in the header logo section. I used
`position: sticky` for the header, which allowed natural shrinking via JS class
toggles. `position: fixed` would've broken the effect, as it detaches from flow.

Small issue like load or scroll, shrinking worked, but the non shrunk logo lost
its inversion. Verified that the defaults style match the effects across states shrunk
and no shrunk. Then got it working. 

#### Third Section Grid: Layering and Animation Struggles

Grid 1 was by layering video/image support and check by data-set data-type in the
`Media-check.js` but when I came to Grids 2/3. 

Animation trouble on hover overflowing Y axis or clipping layers. So I
thought there has to be a way because to do this. Because the first two simple
html layer plan didn't really work. I went ahead rebuilt it to three layers.
Default underlay, base layer and hover layer. 

The reason old clipped failed is because the clipped movement uncovers space
behind the image, and the borders are still visible during animation. The new one uses the
oversized track that moves without gaps, uses static hover. Adjusting the
animation timings to match exactly the prototype. 

At the end the animation reveal, animate oversized base, stable underlay and synced
framing helped put it all together. I learned the artifacts from direct clipped
exist and moving to layering solves it.

#### Implementing Editorial Dropdown on Mobile

Nav tabs links or elements can be pulled from the one we have from desktop via JS and the
three other extra elements needed to be added in there too.

Adjusted the dropdown. Made it open one way. The hamburger menu also had to
reset on close so when it opens again the Editorial element doesn't just
dropdown in open state.

I ran into a bouncy animation on open editorial and transition. It animated too
much. Also the next day when I come back compared it to prototype, it didn't
look as similar as I wanted it to be. The animated font sizing + the layout
altogether made it feeling jumpy. So I added the animations to the list as well.
Eventually got it working.

#### Button Mapping Text Layering Animation with Pure JS and CSS

I mapped the button with JS to get each button clicking and showing their
relevant titles. Here I saw early that on button click the animation was
swapping only for three title texts and not the description. Not just swap, but it
should have that Figma ghosting effect.

At first the animation was not correct, one layer animation seems impossible.
Right here I knew it had to be another layering because no way one layer
animation could have two different titles stacked up like that. Also when rapid
clicking between the buttons caused issues like disappearing titles, ignored
clicks, paused click or queue lag stuck in stack waiting behavior.

I only saw these problem when implementing this animation. I tried to use Motion
one Library at one point but decided to not do it. It would be super strange to
use a library for just one animation in one section is what I thought.
Eventually I manage to get it, had to go through roughly about three different
steps that gave three different results, but it still wasn't perfect but finally landed
on the fourth that looked exactly like the prototype.

