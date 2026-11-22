# Seasons Mah Jong: plan

Mah Jong solitaire through the year: boards for each of the year's holidays and seasons, of which each player plays the ones they choose. It was forked from Boneyard Mah Jong, the Halloween game, on Wednesday 11 November 2026. Boneyard goes on as a game of its own, and its Long Night is Seasons' Halloween too, so the two games both have it. Boneyard's own plan, in its repository and in this one's history, gives the reasons for everything that came from it.

## The holidays

| Holiday | When | Opens | Its colours | Its boards |
|---|---|---|---|---|
| New Year's | January 1 | December 1 | gold, under a midnight blue | the countdown's ten boards and New Year's Day, in the menu |
| Groundhog Day | February 2 | all year, every year | ice blue, on a winter sky | the board of the day, in the menu |
| Valentine's Day | February 14 | February 1 | pink, on deep rose | a love story: eight boards, in the menu, with its tiles and music |
| Start of Spring | March 20, the usual day of the equinox | March 1 | leaf green, on deep green | next |
| April Showers | April 1 to May 31: April's showers, then May's flowers | March 1 | lilac, on rain grey | from showers to flowers: eight boards, planned, the first seven made |
| Summer Beach Season | Memorial Day to Labor Day | May 1 | sun yellow, on sea blue | next |
| Independence Day | July 4 | June 1 | red, on navy | next |
| Labor Day | the first Monday in September | August 1 | amber, on slate | next |
| Start of Fall | September 22, the usual day of the equinox | August 1 | orange, on russet | next |
| Halloween | October 31 | October 1 | Boneyard's orange, on purple | the Long Night: thirteen boards |
| Thanksgiving | the fourth Thursday in November | November 1 | squash, on brown | Thanksgiving week: eight boards, in the menu |
| Christmas | December 25 | December 1 | red, on pine green | the Twelve Days: twelve boards, in the menu |

## Choosing them

- The menu (☾) is the holidays, to choose one: all twelve, those open first, then the rest, greyed out, each in the order they come round from today (`menuList` in `js/themes.js`). Under an open holiday's name is its day; under one not open, the day it opens, or soon for one whose boards are still to come. Last is the turtle, always there.
- Choosing a holiday goes back to its board in progress, one with moves made on it, if it has one, whether or not it is the board on the table. Otherwise its boards come up, to choose one, as each holiday's card has listed them: those reached so far, each board reached by clearing the one before, and those still to come greyed out; the latest reached is the one to go on to, and Back returns to the menu.
- With a board on the table, the menu goes back to it, or gives it up, once the player has said so; a holiday's board given up deals afresh, and its holiday's boards come up again, to choose one, but Groundhog Day's board of the day starts over, and a turtle deals a new one.
- On a first visit the menu comes up over a turtle, dealt to look at. After that, the game opens on the board left on the table, while its holiday is open, or else on a turtle under the menu.
- The menu wears Seasons' own look, a plain gold, rather than any one holiday's; a holiday's boards wear its own.
- Until 18 November a player chose which holidays to play, and the menu opened the one chosen last, with Your holidays to go between them; it came to too many cards for too little, so now every holiday is there to choose, and those not open say so.

## When they open

- The games build up to each holiday, so each opens weeks before its day, on the first of a month (the table above), and stays open to the end of the year. With the new year every holiday closes again, until its opening day comes round. New Year's opens on December 1st for the year to come, so it closes as that year begins. Groundhog Day, the day that keeps coming round, is the one holiday open all year, every year.
- Until a holiday opens, it is greyed out in the menu, which says when it will. Its boards can't be played, from the menu or by their address, which deals a turtle instead; the turtle is always there.
- Out of season, the page opens on the board played freely, or a turtle under the menu.
- Progress, best scores and the boards in play are kept through the new year, for when each holiday opens again.
- `?date=2027-03-01` on the game's address plays it as though it were that day, to try the holidays opening and closing.

## A holiday's look

- Its colour is the accent, for titles and buttons; its sky goes behind the board, and tints the cards; and its lettering is its titles' type. Halloween keeps Boneyard's Creepster, and the others share Fredoka, a rounder hand.
- The Long Night always wears Halloween's look, with each hour's own sky. The turtle wears the holiday chosen last, its tiles too: Halloween's while that holiday's own are still to come.
- And speaks its words (`js/words.js`): no black cats at Christmas. Each holiday's tiles bring treats of their own, left by the tile that stands where Halloween's jack-o'-lantern does. Thanksgiving's turkeys leave the potluck's gifts, a tip, a saved seat and musical chairs. Christmas's stockings hold a star, Santa's key and a sleigh ride. New Year's party hats bring party favours, a sparkler, a party popper and a rattle. Groundhog Day's suns change the weather, sunshine, a warm spell and a gust of wind. Valentine's boxes of chocolates hide sweet surprises, a matchmaker, the key to your heart and speed dating. Each one fits the holiday's own sounds for a hint, a shuffle and a treat, and none is named after one of its tiles. A board that turns over in a holiday's tiles is told in that holiday's words; Groundhog Day, with no board of its own that turns over, has its forecast for it, the groundhog coming out to look for his shadow, a tile left without a partner a shadow. A holiday whose tiles are drawn brings its words with them.
- `js/themes.js` works the dates out for any year, as some move: Thanksgiving, Labor Day, and the beach season, from Memorial Day. Spring and fall start on the days the equinoxes fall on most years.

## Next: the holidays' own boards

Themed levels for the holidays still to come. For each, to decide:

- **Its boards**: how many, and their shapes. The Long Night has thirteen, an hour each, and keeps its layouts about nine tiles across, for phones held upright.
- **Its tiles**: faces of its own, as Thanksgiving's are: the same faces, drawn and named its own way and matching as Halloween's do, so the engine never knows. A set is 42 faces and a lost soul, drawn in code, each one readable by shape alone, with its big corner index.
- **Its twist, if any**: Ghosts float, Treats and Midnight belong to Halloween, so each holiday could bring something of its own.
- **Its sky through the boards, and its sounds.**
- **Its scores**, and boards of its own on the leaderboard.

## Thanksgiving week

Eight boards, one a day from the Sunday before Thanksgiving to the Sunday after it, each with a theme of its own. `js/thanksgiving.js` holds them.

- Thanksgiving's card in the menu is the week's, as the Long Night's is Halloween's: its eight days in order, each with its theme, or its best score once played, and the week score, the bests added up. Each day reached can be played again, and clearing a board opens the next. The second Sunday cleared, the week is seen through.
- The week's board in play is kept, as the night's is, so a player can go between the week, the Long Night and the turtle without losing any of them. A reload opens on the board left on the table.
- The days aren't on the leaderboard yet: its rules know only the Long Night's hours.
- The week's boards wear Thanksgiving's own tiles (below), wherever they are played, and the Long Night keeps Halloween's. With Thanksgiving chosen, the turtle wears them too, and a turtle cleared goes back to the week.

| Day | Theme | Board | Twist |
|---|---|---|---|
| First Sunday | Traffic | the highway: six lanes in two carriageways and an overpass, 84 tiles on three layers, nine across | none: the gentle start |
| Monday | Thawing the turkey | the frozen turkey: 90 tiles on four layers, nine across | Frozen |
| Tuesday | The grocery run | a shopping cart: 94 tiles on four layers, nine across | The shopping list |
| Wednesday | Friendsgiving | the potluck table: a pie, a bowl of stuffing, a casserole and a loaf, 100 tiles on four layers, nine across | Potluck |
| Thursday | The Feast | the feast table: plates down both sides, the side dishes at its corners and the turkey in the middle, 108 tiles on five layers, nine across | Leftovers, and the nap |
| Friday | Black Friday | a sale tag, hanging by its string, a big % on its face: 110 tiles on three layers, seven across | Doorbusters |
| Saturday | Rivalry football | a football stood on end, its laces raised: 100 tiles on four layers, seven across | Touchdowns |
| Second Sunday | The Sunday Scaries: the day before work and school again | an alarm clock, its two bells on top and its hands at seven: 102 tiles on three layers, nine across | Sundown |

### Thanksgiving's tiles

The same faces as Halloween's, matching just as those do, drawn as the harvest and the feast: only the drawings and the names are Thanksgiving's. `js/ui/thanksgiving-faces.js` holds them, and `faces.html?set=thanksgiving` shows them all.

| Halloween's | Thanksgiving's |
|---|---|
| Eyes, one to nine | Cranberries, the one a cluster of them under a leafy bough |
| Bones | Corn, the one an ear of flint corn |
| Graves | Leaves, each with its number on it |
| The monsters (E, S, W, N) | The harvest: apple, gourd, acorn and pinecone |
| Jack-o'-lantern, witch's brew, ghost | Turkey, green beans and mashed potatoes: the potluck's dishes |
| The poison garden | Autumn flowers: sunflower, mum, aster and marigold, any two of which match |
| The moons | Pies: pumpkin, apple, pecan and cherry, any two of which match |
| The lost soul | A worry, for the Sunday Scaries |

- The middle cranberry of the five and the nine is pale, still ripening, as a dots tile's middle dot is red.
- Each group's corner number has a colour of its own, by day and by night: cranberry red, husk green, leaf orange, harvest brown, aster purple, and the blue of the pie dish.
- Wherever a board names its tiles, it names them in its own set's words: a tile to a screen reader, the shopping list, the doorbusters, and the dishes on Friendsgiving's card.

### Thanksgiving's music

As Halloween's is a pipe organ in a stone church playing Bach's Toccata, a note a match, Thanksgiving's is a banjo in a farmhouse parlour (`js/ui/sound.js`), made in code as the organ is, its strings plucked in Karplus and Strong's way. It plays with Thanksgiving's tiles: on the week's boards, and on the turtle while Thanksgiving is the holiday chosen last.

| Moment | Halloween's | Thanksgiving's |
|---|---|---|
| A match | the Toccata's next note, on the organ | the next note of "Over the River and Through the Wood", Lydia Maria Child's Thanksgiving poem of 1844 to its traditional tune, on the banjo |
| A cleared board | the Toccata's opening, and a chord | the song's last line on the banjo, from the second "Over the river", over a guitar's oom-pah, and a chord strummed |
| The week seen through | | "We Gather Together", the Thanksgiving hymn, a Dutch tune of 1597 in Eduard Kremser's setting of 1877, its four voices on a parlour reed organ |
| The room | a stone church's long echo | a farmhouse parlour's, short and warm |
| A shuffle | a rustle | autumn leaves raked over, crackling |
| A hint | two high notes | a small handbell |
| A treat, the potluck's gifts and the whole list found | chimes running up | the dinner triangle: come and get it! |
| No pairs left | a low organ chord | a turkey's gobble |
| Thursday's nap | three notes falling, and waking, four rising | the same, on the banjo |
| Saturday's touchdown | the crowd's roar, and the band on the organ | the crowd's roar, and the band's brass sounding the charge |

- The tile's tock, a blocked tile, undo, Monday's thawing drips, Tuesday's till, Thursday's fridge door, Friday's snatch and the second Sunday's alarm clock are as they were.
- A cleared board's music fades as the next board comes, for Halloween's too.
- The songs are long out of copyright: the song's tune was taken down from a music-education book's melody, and the hymn's four voices from a hymnal's file of it, then checked by the tests, which also play each sound offline: the banjo in tune, and every sound heard but none too loud.
- The other holidays play Halloween's until theirs come, each with its own tune, instrument and room.

### The first Sunday

- The gentle start, as the Long Night's 6 pm is: the week's fewest tiles, 32 of them free from the start, and no twist. Its card tells the free-tile rule as traffic: a tile can pull out only when nothing is on it and its lane is clear at one end.
- It plays from Thanksgiving week's card in the menu, and freely by its address, `#play/highway`.

### Frozen

- Some tiles start frozen. A frozen tile can't be taken, even when nothing holds it, until enough matches have been made to thaw it. Its face shows through the ice, so nothing is hidden, and under its number are the matches still to make.
- On Monday the turkey thaws from the outside in: its outline is thawed from the start, the next ring thaws after 8 matches, and the middle after 16, of the board's 45.
- A deal plays the board through taking a frozen tile only once it has thawed, so every deal can be won; the hints, the solver and the safe shuffle go by the same rule. An undo freezes the tiles again, and a skeleton key can't thaw ice.
- In trials of 200 deals, the ice doesn't make the board harder by luck: a player taking pairs at random clears it about as often as with no ice. What it changes is the order to play in. At the start, 8 tiles that would be free are frozen, and the outside of the bird has to last until the middle thaws.
- It plays from Thanksgiving week's card in the menu, and freely by its address, `#play/turkey`, and shows its day's card first.

### The shopping list

- The day's card names four things to find. The top bar shows them as small tiles, ticked as each is crossed off, with the matches left before checkout. The tiles of things still to find wear a red price tag.
- Taking a pair of a thing on the list crosses it off, up to and including the match at checkout, halfway through the board: 25 points each, and 100 more for the whole list. Then the list closes. An undo puts a thing back on it.
- Every list can be finished in time: its four things are pairs the deal's own winning order takes before checkout. They are worth looking for, too: none has a pair free from the start, or is taken in the deal's first third of the way to checkout, unless there are too few others. In 300 trial deals, a pair of 0.05 of the four things was free at the start, on average.
- Only things of one face go on the list, not the flowers or the moons, any two of which match, so that what to find is plain.
- It plays from Thanksgiving week's card in the menu, and freely by its address, `#play/cart`, and its card says what is on the list.

### Potluck

- Friends bring dishes to share, and each pair of a dish leaves a gift, as Halloween's jack-o'-lanterns leave treats: a friend's tip shows you a match, a saved seat frees one blocked tile, and musical chairs shuffles the tiles for free.
- The dishes are the three faces that stand where a set's dragons do: the turkey, the green beans and the mashed potatoes, in Halloween's set the jack-o'-lantern, the witch's brew and the ghost. An undo never earns a second gift.
- It is the week's breather, between Tuesday's list and Thursday: in 200 trial deals, a board brought 4.2 gifts.
- The gifts are Halloween's treats under other names and icons (💬, 🪑, 🎶), so each board says which set it gives. A Thanksgiving board with no treats has no treat buttons.
- It plays from Thanksgiving week's card in the menu, and freely by its address, `#play/potluck`.

### Leftovers, and the nap

- Beside the table is the fridge, with three containers. A free tile and then a container saves the tile for later: off the table, it holds nothing down any more, and it still matches its partner whenever that's free. Everything in the fridge has to be eaten by the end, so filling it with tiles whose partners are buried can box you in. An undo takes a tile back out.
- The containers are places of their own, after the table's tiles, with nothing on them or beside them. A saved tile moves into one, so a deal, the solver, the hints and the safe shuffle treat it as any tile: every deal can still be won, the hints take tiles from the fridge, and a shuffle deals the ones in it too.
- A board with a fridge is stuck only when nothing can be taken and nothing more can go in the fridge.
- The nap: halfway through, after 27 of the 54 matches, everyone dozes off, and the clock stops for the next 10. Beside the clock, 😴 says how far off the nap is and 💤 how long it has left. An undo back into it stops the clock again, and it holds through a reload. The time napped never counts against par.
- It plays from Thanksgiving week's card in the menu, and freely by its address, `#play/feast`.

### Doorbusters

- Four pairs wear a red sale tag. A pair taken with a tagged tile in it buys that doorbuster, for 50 points. But after every 5 of the player's matches, another shopper grabs the first doorbuster still free, both its tiles at once, and the pairs they grab don't score for the player. With none free, they come away with nothing until the next time.
- The top bar's Deals row shows the four as small tiles, ticked once bought and crossed once grabbed, with the matches to the next grab. The day's card names them.
- It stays fair: each doorbuster is a pair the deal's own winning order takes together, so a grab, early or late, never stops the board being won. None is free from the start, and they come from between an eighth and two thirds of the way through the order, so there is a race for each.
- A grab belongs to the match that brought it, so an undo of that match brings the grabbed pair back. A shuffle moves the tags with the tiles, each open doorbuster becoming a pair of the new deal.
- In 200 trial deals, a player who only followed the hints bought 1.2 of the four, and other shoppers grabbed 2.8: going after the tags pays.
- It plays from Thanksgiving week's card in the menu, and freely by its address, `#play/sale`.

### Touchdowns

- The board is the field, the ball stood on end so that it runs from the end zone at the top to the one at the bottom, as suits a phone held upright. Each end zone is the three rows at its tip, on every layer: 14 tiles each, with its team's pennant, blue at the top and red at the bottom.
- A pair taken with a tile in each end zone is a touchdown, for 60 points: six, as in football, times ten. The top bar counts them (🏈), and an undo takes one back.
- Every deal can score one: a deal is made again until its own winning order holds a touchdown. In 200 trial deals, that order scored 2.2, and 5 at most.
- It plays from Thanksgiving week's card in the menu, and freely by its address, `#play/football`.

### Sundown

- The second Sunday's twist is the Long Night's midnight, told as the dread of Monday. Halfway through, after 26 of the 51 matches, the sun goes down and every tile turns over to its Monday side; holding the moon, or Space, shows Monday coming.
- Before sundown, pairs that match on both sides are the ones to take. A tile left without a partner wakes as a worry, and worries match each other; sundown with no worries earns 150, and each worry costs 10.
- Its words are its own: 🌇 counts down to sundown, 😟 counts the worries, the alarm clock rings at the turn, and the sky goes dark for Monday. Every deal can be won through sundown with no worries, as every Midnight deal can.
- It plays from Thanksgiving week's card in the menu, and freely by its address, `#play/alarm`.

## Christmas: the Twelve Days

Twelve boards, one for each gift of the song, from a partridge in a pear tree to twelve drummers drumming. `js/christmas.js` holds them.

- They are reached in turn, as Thanksgiving week's days are, and open with Christmas, on December 1st.
- Each board is shaped by its gift, and the boards grow through the twelve days, as the song does.
- The first day's is the gentle start, with no twist, as the first Sunday's is. The twelfth is to be Twelfth Night, when the tiles turn over halfway, as at the Long Night's midnight. The twists between are chosen a day at a time.
- The twelve days' boards wear Christmas's own tiles (below), wherever they are played, as the week's wear Thanksgiving's. With Christmas chosen, the turtle wears them too, and a turtle cleared goes back to the twelve days.
- While its boards were being made, each played by its address, as the week's did. Now all twelve are made, Christmas is ready, and opens on December 1st. Its card in the menu is the twelve days', made as Thanksgiving's is the week's: the two are runs of days, kept in main.js's RUNS, each with its days, the progress it keeps, and the words of its card and its end. The days are in order, each with its gift, or its best score once played, and the Christmas score, the bests added up; each day reached can be played again, and clearing a board opens the next. The twelfth cleared, Twelfth Night is over, and the twelve days seen through.
- The twelve days' board in play is kept beside the week's and the night's. A reload opens on the board left on the table. Before December 1st, the menu says when Christmas's boards open, and its boards' addresses deal a turtle; `?date=2026-12-01` on the address plays the game as of that day.

| Day | Gift | Board | Twist |
|---|---|---|---|
| 1 | A partridge in a pear tree | a pear tree, the partridge perched at the top and a pear hanging free from each side of its lower boughs: 80 tiles on two layers, nine across | none: the gentle start |
| 2 | Two turtle doves | two doves beak to beak, making a heart, their heads raised on its two lobes: 88 tiles on three layers, nine across | Lovebirds |
| 3 | Three French hens | a French hen in profile, her comb up and her tail cocked, sitting on her nest: 92 tiles on three layers, nine across | Hatching |
| 4 | Four calling birds | a songbird perched on a branch, singing, its beak open and its tail hanging behind it: 96 tiles on three layers, nine across | Birds of a feather |
| 5 | Five gold rings | five rings linked as the five spots on a die are, the middle one through the other four, raised three high where they cross: 100 tiles on three layers, nine across | Gold rings |
| 6 | Six geese a-laying | a goose sitting on her nest, facing right, her long neck curving up to her head and bill, her wing folded high on her back, with four eggs on the front of the nest: 104 tiles on four layers, nine across | Goslings in a line |
| 7 | Seven swans a-swimming | a swan gliding on a still lake, facing left, her neck straight up to her head and bill and her wings arched high, mirrored in the water: the bottom half is the top half upside down. 108 tiles on four layers, nine across | Mirrored swans |
| 8 | Eight maids a-milking | a milk pail, its handle arched over the top, full to the brim, tapering to its base, with a hoop near the top and another near the bottom: 112 tiles on four layers, nine across | Fresh milk |
| 9 | Nine ladies dancing | a dancer mid-twirl, her arms raised in a ring over her head, her skirt flaring out round her and piled up to its middle as it spins, her legs beneath: 116 tiles on five layers, nine across | Change partners |
| 10 | Ten lords a-leaping | a crown, its five points rising from it, the middle one highest and each with an orb at its tip, its band set with jewels: 120 tiles on four layers, nine across | Leaping lords |
| 11 | Eleven pipers piping | a set of bagpipes, its three drones standing up from the bag, the blowpipe rising to the right, the bag swelling in the middle, and the chanter beneath: 124 tiles on three layers, nine across | The pied piper |
| 12 | Twelve drummers drumming | a drum, its two sticks crossed above it and raised where they cross, its rim raised and its cords zigzagging round it: 128 tiles on four layers, nine across, the most of the twelve | Twelfth Night |

The twists were chosen a day at a time, and the twelfth's, Twelfth Night, was planned from the first.

### Christmas's tiles

The same faces as Halloween's, matching just as those do, drawn as Christmas: only the drawings and the names are Christmas's. `js/ui/christmas-faces.js` holds them, and `faces.html?set=christmas` shows them all.

| Halloween's | Christmas's |
|---|---|
| Eyes, one to nine | Ornaments, the one a great bauble hanging by its ribbon |
| Bones | Candy canes, the one a great cane tied with a green bow |
| Graves | Presents, each with its number on the tag where its ribbons cross |
| The monsters (E, S, W, N) | The song's four birds: the partridge in her pear tree, the turtle dove, the French hen and the calling bird |
| Jack-o'-lantern, witch's brew, ghost | The stocking, the tree and the snowman, red, green and white, as the dragons they stand for are |
| The poison garden | Christmas's plants: poinsettia, holly, mistletoe and the Christmas rose, any two of which match |
| The moons | Snowflakes: a star, a fern, a plate and a twelve-pointed one, any two of which match, though no two are alike |
| The lost soul | A lump of coal, for Twelfth Night |

- The middle ornament of the five and the nine is gold, the rest red, as a dots tile's middle dot is red.
- Each group's corner number has a colour of its own, by day and by night: ornament red, cane green, the presents' blue, the birds' brown, berry pink, and the snowflakes' ice blue.
- A lump of coal glows like an ember, on the board and held up close, where the other sets' lost souls glow blue: the board says which set it wears (`data-faces`), for the page's style to follow.

### Christmas's music

As Halloween's is a pipe organ in a stone church and Thanksgiving's a banjo in a farmhouse parlour, Christmas's is a music box by the fireside (`js/ui/sound.js`), playing "The Twelve Days of Christmas" as Frederic Austin set it in 1909, the tune everyone sings, taken down from his published melody. It plays with Christmas's tiles: on the twelve days' boards, and on the turtle while Christmas is the holiday chosen last.

| Moment | Christmas's |
|---|---|
| A match | the next note of the fifth verse, the one with five gold rings, on the music box, an octave up |
| A day's board cleared | the verse of its day, "On the sixth day of Christmas…", the music box's low tines on the bass notes and sleigh bells shaken with them; from the sixth day on, the day's own gift and then straight on from five gold rings down, so that no verse runs long |
| A turtle cleared | the fifth verse, whose notes its matches have played |
| Twelfth Night cleared, the twelve days seen through | the twelfth verse whole, every gift counting down, and the church bells ringing down the scale, twice |
| The room | a fireside's echo, a little longer than the farmhouse's |
| A shuffle | sleigh bells, shaken |
| A hint | a little silver bell |
| A treat | a present unwrapped: the paper torn, and ta-da |
| No pairs left | a lump of coal dropped into the stocking |

- The twists' own sounds are as they were: the doves' coo, the songbirds' flutter, the rings turning to gold, the goose's honk, the swan's harp, the milk's splash and souring, the waltz, the lords' fanfare, the pipers' bagpipes and Twelfth Night's twelve drummers.
- Austin's flourish on the last verse's "five gold rings" is left out, as most later versions leave it out: the regular figure plays every time.
- The tests check that each verse keeps time, an upbeat and then whole bars, and ends on the keynote, and play every sound offline: each heard, none too loud.

### The first day

- A partridge in a pear tree: the gentle start, with no twist. Its card tells the free-tile rule by the pears, which hang free from the start.
- 80 tiles on two layers, nine across: the fewest of the twelve. It plays by its address, `#play/peartree`.

### Lovebirds

- The second day's twist, on the two turtle doves' heart (`#play/doves`). Every kind of tile comes as two pairs, the flowers and the moons too, any two of which match: take a kind's second pair straight after its first, and they're lovebirds, for 30 points.
- Only matches count: a shuffle between the two pairs doesn't part them. An undo takes the lovebirds back with it.
- Every deal is made so that its own winning order takes at least one pair of lovebirds. In 200 deals it took 1.2, and 3 at most.
- The top bar counts them (🕊️), and they coo.

### Hatching

- The third day's twist, on the French hen (`#play/hen`). A dozen of the tiles that start blocked are still eggs, chosen afresh with each deal: there's no telling what's inside one until it comes free and hatches, with a cheep.
- A tile held up close shows only its egg, and a screen reader calls it an egg, still to hatch. An undo never puts a hatched tile back in its egg.
- Hatching earns and costs nothing: the twist is planning around tiles that can't be seen yet. On a deal's own winning order, the last egg hatches after 41 of its 46 matches, on average.
- The top bar counts the eggs still to hatch (🥚).

### Birds of a feather

- The fourth day's twist, on the songbird (`#play/songbird`). A pair whose two tiles touch, side by side or one just above the other on the same layer, flocks together, for 20 points: not corner to corner, and not across a gap. `js/engine/flock.js` says when two tiles touch.
- Every deal is made so that its own winning order takes at least one. In 200 deals it took 2.3, and 6 at most; played at random, a deal flocks about twice, and a pair that would is free on about a fifth of turns.
- An undo takes it back. The top bar counts them (🐦), and they flutter.

### Gold rings

- The fifth day's twist, on the five gold rings (`#play/rings`). Take every tile of a ring, and it turns to gold where it lay, for 50 points, with bells: a gold ring shows under the tiles still left, and a cleared board shows all five. The day's rules say which square each ring goes round, and `js/engine/rings.js` works out its tiles: where two rings cross, the tiles are both rings'.
- Dealt as any board is, a ring's tiles match tiles all over the board, so no ring could be cleared until near the end: aiming for one, the first came after 40 of the 50 matches. So the board is dealt a ring at a time, and a ring's tiles mostly match each other. Aiming for a ring, the first now comes after 24 matches, and the rest after 37, 44, 47 and 50; the deal's own order, which the hints follow, turns them to gold after 12, 24, 36, 43 and 50. A shuffle deals the tiles left a ring at a time too.
- An undo takes a gold ring back. The top bar counts them (💍).

### Goslings in a line

- The sixth day's twist, on the goose (`#play/goose`). Goslings follow their mother in a line: a pair with a tile that lay beside one of the pair taken before it, touching it on the same layer, or under it, follows on. Six in a line score 60 points, with a honk, and a new line starts from the pair that made it; a pair that doesn't follow on starts the line again from itself. `js/engine/goslings.js` says when a pair follows on.
- The free tiles a pair could follow on from carry a gosling, so the line can be seen once the pair before has gone. Each pair that follows on cheeps. The top bar counts the line so far, out of six (🐣). Only matches count: a shuffle doesn't part the line, and an undo takes it back a pair.
- A pair that follows on is there to be had on about four turns in five, so lines come to a player who looks for them: following on whenever they could, players made 2.7 lines of six a board, and 4 looking one pair ahead, while picking pairs at random made one in about eight boards. Following on has its cost: those players cleared fewer boards without a shuffle, 60 in 100 against 72. The board is dealt as any board is: dealing it to follow on gave no more lines, and made boards harder to clear.

### Mirrored swans

- The seventh day's twist, on the swan (`#play/swan`). The lake mirrors the board: a tile's reflection is the tile as far below the water as it is above, on the same layer, and the lake's tiles are tinged with blue. Seven tiles match their own reflection: take one with it, a swan, for 50 points, with a harp's run. Take either with another tile, and she swims off, with a ripple. `js/engine/swans.js` finds the reflections and the swans.
- The deal puts the swans in: every deal has seven, no more and no fewer, each a pair of the deal's own order, so the hints find them all, and each of a kind with another pair on the board, so that her tiles could go with others; at first most were of kinds with no other pair, and so were found whether looked for or not. The deal takes each swan from its own point in the deal on, and from tiles that weren't both free from the start, so that they come free as the board opens: 1.4 free at the start, and half the rest by the 16th of 54 matches.
- Picking pairs at random, players found 3.7 swans a board, and 3.1 swam off; taking a swan whenever one was free, 5.5; and never taking a swan's tile with another, 6.9.
- An undo brings a swan back, found or swum off. A shuffle deals the swans still to be found again, as many as there were. The top bar counts the swans found, out of those found and still to find (🦢 2/7, then 2/6 when one swims off).

### Fresh milk

- The eighth day's twist, on the milk pail (`#play/pail`). Eight pairs are pails of fresh milk, each tile marked 🥛. Once either of a pail's tiles is free, its milk keeps for eight matches, counted down on both tiles, amber for the last three: dig out the other, and take the two together while it's fresh, for 40 points, with a splash and a bell. Take either with another tile, and it spills; leave it too long, and it sours. `js/engine/milk.js` chooses the pails.
- As first planned, a pail kept from when both its tiles were free, and any pair with one of them took it: nearly free points, as both could be taken at once. Random play took 6.5 of the 8, and a player who looked, 7.8. So the count starts from the first tile, and only the pail's own pair takes it: a race to dig. Now random play takes 1.6 of the 8, 4.5 sour and 1.4 spill; a player who digs for them, about 5.
- Every pail can be had fresh: each is a pair the deal's own order takes within eight matches of either tile coming free, so following the hints takes all eight, and none has a tile free from the start. Dealt as any board is, such pairs came late; so the deal takes one now and then all through the board, a pair whose tiles have both just come free. The pails begin to keep after 6, 26 and 47 of the 56 matches (a tenth, half and nine tenths of them).
- An undo puts the milk back, and a shuffle keeps each fresh pail a pair that matches. The top bar counts the pails taken fresh (🥛 3/8), and the score has a row for them, with those that soured or spilt.

### Change partners

- The ninth day's twist, on the dancer (`#play/dancer`). Every nine matches the music changes, to a bar of a waltz: each free tile dances off with a tile still held down, and they change places, twirling, so tiles held down come free and the pairs that were free go back under. On this board half the tiles left are often free, so a dance moves about 45 of them. `js/engine/dance.js` chooses the partners.
- The board is always left so it can be won: partners are drawn at random and tried again until the solver finds a way to win, which the hints then follow, in a few milliseconds and 54 at most. In the rare dance where no try is found winnable, about one in fifty, the dancers keep their partners, and the page says so.
- So a dance never loses a board; it also rescues one that was going to be lost. Played at random, 52 boards in 60 were cleared without a shuffle, against 33 dealt the same without the dance: the dance shakes up a player's plans, and forgives their mistakes.
- The top bar counts down to the next change (💃 3), while any tile is held down. An undo puts the dance back, and the faces come back the same after a reload. There are no points for it: the twist is to take the pairs that can be seen before the music changes.

### Leaping lords

- The tenth day's twist, on the crown (`#play/crown`). Ten tiles are lords, gilded and crowned 👑: a lord is free wherever he is, under other tiles or hemmed in, and goes with any free tile of his kind. Take one while he's still held down by the usual rule, and he's leapt, for 20 points, with a trumpet call; or keep him, to get out of a tight spot. `js/engine/lords.js` chooses them.
- The lords start held down, each of a kind of his own, so a lord always needs another tile of his kind to go with. A lord adds a way to take a tile and takes none away, so the deal's own order still wins; the hints know the lords are free, and once a player has gone their own way, they leap with them too.
- It is a real choice. Played at random, 50 boards in 100 were cleared without a shuffle, with 6.2 leaps a board; leaping at every chance, 8.2 leaps, but only 46 cleared; saving the lords for when nothing else would go, 2 leaps, and 61 cleared. The crown without lords, played at random, cleared 45.
- The top bar counts the lords still on the board (👑 7). An undo takes a leap back.

### The pied piper

- The eleventh day's twist, on the bagpipes (`#play/bagpipes`). Eleven tiles are pipers, tinged green and marked 🎶. Take a piper with a tile of his kind, as any pair is taken, and he plays, with a drone and a skirl: the rest of his kind still on the board follow him out, from wherever they are, buried or not, for 15 points each, each leaving a note where it was. A kind's tiles all go together, and taking tiles never pins another down, so the board can still be won. `js/engine/pipers.js` chooses them.
- Each piper starts held down, of a kind of his own with two pairs on the board, and is a tile of the first of its pairs the deal's own order takes: so on that order, which the hints follow, every piper leads two out, 22 tiles in all. Chosen from any of his kind, a piper had often lost his followers before he could play, and only 7 to 11 tiles followed out a board.
- Played at random, 12 tiles followed out a board, and 75 boards in 100 were cleared without a shuffle; playing each piper as soon as he could go, 16; and keeping a piper's kind for him until he plays, 22, and 80 cleared. The bagpipes without pipers, played at random, cleared 58.
- The top bar counts the pipers still on the board (🎶 10). An undo brings the followers back.

### Twelfth Night

- The twelfth day's twist, on the drum (`#play/drum`): Twelfth Night, the last of Christmas. Halfway through, after 32 of its 64 matches, the drummers drum, twelve beats, and every tile turns over, as the Long Night's do at midnight and the Sunday Scaries' at sundown; the moon shows the other side coming, and three matches before, the page says so. A player who takes pairs that match on both sides meets no coal; a tile left without a partner turns to coal, and coal matches coal.
- It is told in its own words (main.js): the clock counts down to Twelfth Night (🌟 3 to Twelfth Night), and then shows it (🎭); the lost souls are lumps of coal (🪨), and the score says "Twelfth Night with no coal", or counts the lumps. Christmas's tiles draw it as a lump of coal, glowing like an ember where Halloween's lost souls glow blue.
- Every deal can be won in its own order through the turn, meeting no coal, and the hints find a way through from a move of the player's own.

## New Year's: the countdown

Ten boards, counted down from 10 to 1, each shaped as its own number, as the giant numbers on the screens in Times Square are: the countdown is the boards themselves. `js/newyear.js` holds them.

- They are to be reached in turn, as Christmas's twelve days are, and open with New Year's, on December 1st. New Year's closes as the new year begins, so the countdown ends at midnight.
- The ball is to drop a notch down its pole with each board cleared, and land at midnight, halfway through the last, the 1, as its tiles turn over to the new year's side.
- The first board, the 10, is the gentle start, with no twist, as the first day's and the first Sunday's are. The twists of the rest are to be chosen a board at a time, as Christmas's were, and the boards to grow toward midnight.
- Each number is drawn bold, its strokes two tiles thick, with a ridge along them on the layer above, sitting across the join of the two tiles beneath. The 2 and the 1 are the exceptions: the 2's stroke is broader, with the toast's way along it, a rail beside the way on either side on the layer above; and the 1's stem is four tiles thick, rising to a peak all the way down.
- New Year's boards wear New Year's own tiles (below), wherever they are played, as the twelve days' wear Christmas's. With New Year's chosen, the turtle wears them too.
- After the countdown comes New Year's Day, the morning after midnight, the last of New Year's boards, with a resolution to keep (below).
- While its boards were being made, each played by its address (`#play/ten`, `#play/january`), as the twelve days' did. Now all eleven are made, New Year's is ready, and opens on December 1st. Its card in the menu is a run of days, as Christmas's is, kept in main.js's RUNS as `new-year`: the boards in order, each with its title, or its best score once played, and the New Year's score, the bests added up; each board reached can be played again, and clearing a board opens the next. A board of the countdown is called by its number in a sentence (on to the 9), and clearing one says the ball drops a notch, and how many boards are left to midnight; the 1 cleared, it has landed. New Year's Day cleared, it's a happy new year, and New Year's is seen through.
- Beside the card's words stands the ball on its pole (`js/ui/ball.js`), a crystal ball, faceted and glinting: a notch down for each board of the countdown cleared, ten in all, and landed once the 1 is cleared, or once its clock strikes midnight with the 1 on the table, turning gold, with the new year's sign beneath it lit, the year the next New Year's Day falls in. Before December 1st, New Year's card says when its boards open, and their addresses deal a turtle; `?date=2026-12-01` on the address plays the game as of that day.

| Number | Title | Board | Twist |
|---|---|---|---|
| 10 | The countdown begins | the number 10: the 1 with its flag and its foot, beside the 0, a tall ring open in its middle, each with a ridge along it: 88 tiles on two layers, nine across | none: the gentle start |
| 9 | Fireworks | the number 9: its loop a ring round an open middle, its stem coming down on the right and curling round to the left at the foot, with a ridge along it all and a crest along the top of the loop, its bottom and the curl: 98 tiles on three layers, nine across | Fireworks |
| 8 | The disco ball | the number 8: two rings stacked, the top one the smaller, each round an open middle and joined at the waist, with a ridge along them and a crest along the top, the waist and the foot: 104 tiles on three layers, nine across, twelve rows deep | The disco ball |
| 7 | Lucky seven | the number 7: its bar across the top, a tick hanging from its left end, and its stem slanting down to the left, four tiles wide, with a ridge and a crest along the bar and the stem, and three tiles on top of the bar: 110 tiles on four layers, nine across | Lucky seven |
| 6 | The balloon drop | the number 6: its stem coming down on the left from a curl at the top into a ring round an open middle at the foot, with a ridge and a crest along it all, and a crest along the top and the foot of the ring on the layer above: 114 tiles on four layers, nine across | The balloon drop |
| 5 | Sparklers | the number 5: its flag across the top, its stem coming down on the left into its belly, which bulges out to the right and round to the foot, its tail turned up at the left, with a ridge and a crest along it all, and one tile on the flag's crest: 122 tiles on four layers, nine across | Sparklers |
| 4 | Confetti | the number 4: its left stroke coming down to its crossbar, which runs right across past its stem, standing the full height on a foot, with a ridge and a crest down the strokes and along the bar, and the tops of the strokes and the bar's crest on the layer above: 128 tiles on four layers, nine across | Confetti |
| 3 | Shooting stars | the number 3: its bar across the top, curling down at the left, its two bowls bulging out to the right on either side of its middle bar, and its foot across the bottom, curling up at the left, with a ridge, crests and tops along its bars and its right side: 134 tiles on five layers, nine across, twelve rows for the stars to cross | Shooting stars |
| 2 | A toast for two | the number 2: its arc over the top, curling down at the left, coming down the right and slanting down to the left to its broad foot across the bottom, with the glasses' way along its stroke, a rail of tiles beside the way on either side on the layer above and a tile on every other place of it, its crest piled over the top of the arc and its foot along the bottom: 138 tiles on four layers, nine across | A toast for two |
| 1 | Midnight | the number 1: its stem four tiles thick, its flag slanting down to the left from the top, and its broad foot across the bottom, with a ridge down the stem rising to a peak, a ridge along the flag, and the foot piled up to the fifth layer: the full set of 144 tiles on five layers, nine across, the most of the ten | Midnight: the tiles turn over |

### New Year's tiles

The same faces as Halloween's, matching just as those do, drawn as New Year's: only the drawings and the names are New Year's. `js/ui/newyear-faces.js` holds them, and `faces.html?set=new-year` shows them all.

| Halloween's | New Year's |
|---|---|
| Eyes, one to nine | Clocks, every one at five to midnight; the one an alarm clock, its two bells on top |
| Bones | Party horns, gold with purple bands; the one a great horn, blown, its fringe flying and confetti bursting from its bell |
| Graves | Calendar pages, the first nine days of January, each with January's band across its top and its corner turned up |
| The monsters (E, S, W, N) | Four who see the new year in: Father Time, with his hourglass, Baby New Year, in his top hat and sash, a night owl in a party hat, up for midnight, and a polar bear in a swim ring, for the New Year's Day plunge |
| Jack-o'-lantern, witch's brew, ghost | A party hat, a bottle of champagne, its cork popping, and New Year's ball, red, green and white, as the dragons they stand for are |
| The poison garden | Lucky charms: a four-leaf clover, a horseshoe, a ladybird and a lucky pig, any two of which match |
| The moons | The seasons of the year to come: winter's snowflake, spring's blossom, summer's sun and fall's maple leaf, any two of which match |
| The lost soul | A sleepyhead, who missed midnight |

- The middle clock of the five and the nine has a rim of gold, the rest navy, as a dots tile's middle dot is red.
- Each group's corner number has a colour of its own, by day and by night: the clocks' navy, the party horns' purple, January's red, Father Time's brown, the clover's green, and the seasons' teal.
- A sleepyhead glows a dreamy lilac, on the board and held up close, where Halloween's lost souls glow blue and Christmas's coal like an ember.
- The faces steer clear of the countdown's badges: no balloons, sparklers or rockets among them, for the 6's, the 5's and the 9's twists.

### New Year's music

As Halloween's is a pipe organ, Thanksgiving's a banjo and Christmas's a music box, New Year's is a piano in a ballroom (`js/ui/sound.js`), playing "Auld Lang Syne", Robert Burns's words of 1788 to the old Scots tune, taken down from the melody as Wikipedia gives it. It plays with New Year's tiles: on the countdown and New Year's Day, and on the turtle while New Year's is the holiday chosen last.

| Moment | New Year's |
|---|---|
| A match | the next note of the song, verse and chorus, on the piano |
| A board cleared | the chorus's last line, "we'll tak' a cup o' kindness yet, for auld lang syne", the left hand under it: each bar's bass on its first and third beats and its chord on its second and fourth |
| New Year's Day cleared, the countdown seen through | the whole chorus, the party horns blowing and the room cheering |
| Midnight on the 1 | as it was, the clock striking twelve and a firework, but the fanfare on the band's brass |
| The room | a ballroom's, wide |
| A shuffle | a party horn blown |
| A hint | a champagne glass touched |
| A treat | a champagne cork popping, and the fizz |
| No pairs left | a party horn running out of breath |

- The countdown's twists keep their own sounds: the rockets, the disco beat, the lucky coin's hot and cold, the balloons, the sparklers, the confetti, the shooting stars and wishes, the glasses' clink, and the sweets given in to.
- The piano is made as the other instruments are, in code: a string's partials, each a little sharp, dying away the faster the higher it is.
- The tests check that the song keeps time and that its chorus and last line come in where a bar ends, and play every sound offline: each heard, none too loud.

### The 10

- Its card tells the free-tile rule by the ridge down the 1, each tile of which is free: nothing lies on it, and both its sides are open.
- About 33 of its 88 tiles are free at the start, as many as on the first Sunday's and the first day's boards, and every deal can be won in its own order.

### Fireworks

- The 9's twist (`#play/nine`): nine tiles are rockets, each marked 🚀. Take a rocket with a tile of its kind, as any pair is taken, and it bursts, lighting up every tile still on the board touching it: beside it, or just above or below it, on its layer, as birds of a feather touch, and the tiles it sat on. A lit tile glows the lilac of a firework, with a sparkle on it ✨, and turns gold like any tile when chosen.
- Two lit tiles taken together are a lit pair, for 30 points. Lighting a tile changes nothing about when it can be taken, so a rocket is best set off where pairs are waiting, and a lit tile is best kept for another lit tile of its kind.
- The rockets are chosen from the tiles held down at the start, each with at least three tiles round it to light, and no two touching or one on the other, so each lights a part of the board of its own. They are chosen by where they lie, before the deal, and the deal is made so that its own order takes at least one lit pair (`js/engine/fireworks.js`).
- A rocket goes up with a whistle and bursts with a bang and a crackle, a 🎆 rising where it was, and the tiles it lights flash as they catch the light; a lit pair twinkles. The top bar counts the rockets still to set off (🚀 9). An undo puts a rocket back, unburst, and its tiles back in the dark.
- Measured over 100 deals: the deal's own order takes 1 to 7 lit pairs, 2.6 on average, and lights about 16 tiles by the end. Players simulated on 100 deals: one taking pairs at random gets 1.8 on average, from none to 8, and a greedy one, taking lit pairs and rockets whenever it sees them, 2.4; a careful one, looking a move ahead for lit pairs and never leaving a board that can't be won, gets 3.9, from 1 to 8 (30 deals).

### The disco ball

- The 8's twist (`#play/eight`): a disco ball 🪩 hangs over the dance floor, and its beam lies across the board a row deep, glinting. It starts on the top row and moves a row further down with every match, gliding there, and once it has lit the bottom row it starts again at the top: on the 8's twelve rows, every twelve matches.
- A pair taken with both its tiles in the beam dances in the spotlight, for 30 points. A tile is in the beam when its middle is, so a tile half a row out of line, as the ridges' and crests' tiles are, is lit when either of its rows is. The light changes nothing about when a tile can be taken. Tiles in the beam are a cool white, and a screen reader says "in the spotlight".
- A dance plays a beat, a kick and a hi-hat with a chord on top. The top bar counts the pairs that have danced (🪩 0), and an undo takes a dance back and moves the beam back up a row.
- The deal is made so that its own order dances at least once (`js/engine/disco.js`).
- Planned three rows deep, the beam was narrowed to one, as measured: three rows deep, a third of all pairs danced for a player who took a pair in the light whenever there was one, 15 a board, and 21 for a careful one, with little need to set pairs up; two rows deep, 9.5 and 14. A row deep, over 100 deals: the deal's own order dances 1.3 times, from 1 to 3; a player taking pairs at random 0.4, from none to 2; a greedy one, taking a pair in the beam whenever it sees one, 3.5, from none to 8; and a careful one, looking a move ahead for pairs in the beam and never leaving a board that can't be won, 7, from 2 to 15 (30 deals).

### Lucky seven

- The 7's twist (`#play/seven`): a lucky coin 🪙 is hidden in one of its tiles, a tile on the bottom layer held down at the start, chosen from the board's seed. After every pair taken until it is found, the coin says how close the pair came to it, by the nearer of its two tiles, counting tiles across or down, whichever is further, whatever the layers: 🔥 hot, a tile away or less, 🌡️ warm, three or less, or 🧊 cold.
- The coin turns up as soon as its tile comes free, gleaming gold in it with a 🪙 until the tile is taken, so it pays to dig where it's hot. Found as the first match frees it, it's worth 200 points, 5 less for every match before, and never less than 25 (`coinWorth` in `js/score.js`). The coin changes nothing about when a tile can be taken (`js/engine/coin.js`).
- Each reading floats up where the pair was taken, as 🔥, 🌡️ or 🧊, with a soft note, two rising for hot and a low one for cold, and stays in the top bar (🪙 🔥 hot) until the next; found, the coin rings and the bar says so. An undo takes a reading back, and hides the coin again if it took back the match that found it.
- The coin was first to be found by taking its tile, as measured: then even a player knowing where it was found it no sooner than one going by hot and cold, round match 35 of 55, its tile's partner having to be dug out too. Found as its tile comes free, over 100 deals, the middle of each spread: the deal's own order finds it on match 35, as does a player taking pairs at random, 34; one going by hot and cold, digging nearest where the coin could still be and never leaving a board that can't be won, finds it on match 22, and a quarter of the time by match 9 (40 deals), as soon as one that knows where it is.

### The balloon drop

- The 6's twist (`#play/six`): a net of balloons hangs over the party. As the board starts, and again every six matches, it opens, the balloons still on the board float away, and three more 🎈 drop onto free tiles, each a tile with no other of its kind free, so that popping it means digging one out.
- Taking a balloon's tile pops it, for 15 points. Balloons change nothing about when a tile can be taken. Where a net's balloons land is shuffled for that net from the board's seed, so a board reached the same way drops the same, and a reload plays back the same drops.
- A balloon drops on to its tile as the net opens, and floats up and away from it when the next one does; a pop snaps, and the net swishes open with the balloons bouncing down. The top bar counts the balloons to pop and the matches until the net opens again (🎈 3 · ⏳ 6). An undo puts the balloons back as they were, the net closed again.
- The deal is made so that its own order pops at least one (`js/engine/balloons.js`).
- It was first the 7's, every seven matches, and moved to the 6, every six, to make way for the 7's lucky coin. Landing on any free tile, the balloons were too easy to pop, as measured on the 7: the deal's own order popped 15 of 24, a player taking pairs at random half of theirs, and a careful one 22 of 24. Landing only on tiles alone of their kind, over 100 deals of the 6: the deal's own order pops 6.9 of 27; a random player 4.5 of 24; a greedy one, taking a balloon whenever it can, 8.6 of 24; and a careful one, looking a move ahead for balloons it can pop and never leaving a board that can't be won, 17.2 of 27, from 11 to 25 (30 deals).

### Sparklers

- The 5's twist (`#play/five`): five sparklers 🎇 are planted among the tiles, grey and unlit while they're held down. Each lights as soon as its tile comes free, and burns down over five matches, its badge counting them, amber at the last two. Taken while it still burns, a sparkler scores 10 points for every match it has left, 50 taken at once; burnt out, it's a tile like any other.
- So a sparkler is best lit with a tile of its kind already free to take it with: dig its partner out first, then free the sparkler. Sparklers change nothing about when a tile can be taken.
- They are chosen from the deal's own order: tiles held down at the start, each of a kind of its own, that the order takes within five matches of their coming free, one from each stretch of the order from a tenth of the way through, so that they light one after another, and taking the pairs in that order takes all five while they burn (`js/engine/sparklers.js`, with `freedAt` from the milk pail's).
- A sparkler lights with a struck match and a fizz, crackles when taken, and puffs out 💨 with a last fizz. The top bar counts the sparklers still to take (🎇 5). An undo puts them back as they were.
- Measured over 100 deals: the deal's own order takes all five burning, for 166 points; a player taking pairs at random 2.2 of them, for 71; a greedy one, taking a burning sparkler whenever it can, 3.2, for 149; and a careful one, looking a move ahead, readying a sparkler's partner before lighting it and never leaving a board that can't be won, all five but once, for 239 of the 250 there are (30 deals).

### Confetti

- The 4's twist (`#play/four`): confetti in four colours has fallen over the board, and every tile has caught a fleck of one, in the corner where other boards' badges go. The colours have shapes of their own, so they can be told apart without colour: a red heart ♥, a gold star ★, a silver dot ● and a blue diamond ◆.
- Of a kind with two pairs on the board, two tiles caught the same colour, a couple, and the other two colours unlike the couple's and each other's; a kind with one pair has two that differ, and no couple. A couple taken together is a perfect match ✨, for 5 points: so with three or four of a kind free, which go together matters, and a couple broken up is lost. Confetti changes nothing about when a tile can be taken.
- The couples are pairs of the deal's own order, so taking the pairs in that order takes every couple together. A shuffle scatters the confetti again over the new deal, a couple to each kind with two pairs left (`js/engine/confetti.js`).
- A perfect match pops like a party popper, its paper fluttering, with a chime and a ✨. The top bar counts the perfect matches (✨ 0); a screen reader names each tile's colour.
- Measured over 100 deals of the 4: 28 couples on each; a player taking pairs at random takes 13.5 together, and a greedy one, taking a perfect match whenever it can, 20; a careful one, which also never breaks a couple up if it can help it, takes all 28 (30 deals). Couples come every other pair or so, so a perfect match is worth 5, not 10: about 140 points for a careful player and 70 for a random one.

### Shooting stars

- The 3's twist (`#play/three`): as the board starts, and again every three matches, a shooting star 🌠 streaks across one row of the board, and the row glows a starry blue until the next. A pair taken with both its tiles in that row makes a wish, for 15 points: one wish to a star, and the glow fades once it's made. A tile half a row out of line is in the row when half of it is, as in the disco ball's beam. Stars change nothing about when a tile can be taken.
- Each star crosses a row with two free tiles of a kind in it, to wish on at once, if there is one, and if not, a row with two tiles of a kind in it, to dig a wish out of. Which is shuffled for that star from the board's seed, so a board reached the same way sees the same stars. Near the end, with nowhere a wish can be made, none crosses (1.4 of a board's 23 stars, with 26 tiles or fewer left) (`js/engine/stars.js`).
- A star swishes across with a shimmer as it comes, and a wish rings a rising run of bells. The top bar counts the wishes made and the matches until the next star (🌠 0 · ⏳ 3), and a screen reader says which tiles are in the star's row. An undo takes back a wish, and a star.
- First tried on rows with two free tiles of a kind only: late in a board such rows are rare, and most stars found nowhere to cross. Then, with rows to dig a wish out of when there are none of those, over 100 deals: the deal's own order makes 6.1 wishes on 23 stars; a player taking pairs at random 3.7, and a greedy one, taking a pair from the star's row whenever it can, 4.8, both often stuck before the end; a careful one, looking a move ahead for wishes and never leaving a board that can't be won, 10.6, from 7 to 16 (30 deals): about 160 points.

### A toast for two

- The 2's twist (`#play/two`): two glasses of champagne 🥂 stand at the two ends of the 2, one in its curl at the top left and one at the right-hand end of its foot. Their way runs along the 2's stroke on the bottom layer, up out of the curl, over the arc, down the right side and the slant, and along the foot: 31 places. With every match, each glass glides one place along it toward the other, unless a tile lies over the place it's going to, on a layer above the bottom one. When the glasses come side by side they clink, a toast, worth 5 points for every pair still on the board (`toastWorth` in `js/score.js`): 270 at the soonest, as they can meet no sooner than the fifteenth match. The glasses change nothing about when a tile can be taken.
- On the layer above, a rail of tiles runs beside the way on either side, the crest over the arc and the foot along the bottom among them, and a tile lies on every other place of the way from the third in from each end, 14 in all; one of them, down the right side, sits between the rails and has to be dug out. The tiles in the way are ringed in champagne gold, not filled with it, so as not to look chosen, and a screen reader says they are in the glasses' way.
- The deal pairs each tile in the way with a tile free along with it, as it plays the board through taking a tile in the way first whenever one is free, so that the way can be cleared from the start; though not two tiles in the way together, and not in the order the glasses come to them (`clearingTheWay` in `js/engine/glasses.js`). A shuffle deals the same way.
- Each glass is a champagne flute, standing at the top left of its place as a tile's badges sit, so the tile under it and its number still show, and gliding on as its way clears. As they meet, the two tilt together and clink, with a 🥂 rising, a high ringing clink and a fizz, and stay so. The top bar counts the places still between the glasses (🥂 29), and says cheers once they've met. An undo takes back a toast, and parts the glasses again.
- First tried under a ridge along the whole way, stacked to the fifth layer up the slant and the right side: the glasses met only at the end, if at all. Over 100 deals, the deal's own order never brought them together in 73, and a careful player, taking the pairs most in their way, met on match 66 of 69; letting the glasses glide two places a match, or only where every layer was clear, changed little. A ridge a layer high, 30 tiles in the way, still met on match 55. With a tile on every other place, 14 in the way, dealt as any board, the careful player met on match 29, though anywhere from 17 to 56, a tile in the way often waiting on partners buried deep; dealt to clear the way, on match 19.
- Measured on the board as made, over 200 deals, the middle of each spread: the deal's own order brings the glasses together on match 23, from 18 to 47; a player taking pairs at random on match 49, when it isn't stuck first; and a careful one, taking the pairs most in the glasses' way nearest them and never leaving a board that can't be won, on match 19, from 15 to 37 (60 deals): a toast of 250 for a careful player, 230 for the deal's own order and 100 for a random one.

### Midnight

- The 1's twist (`#play/one`): halfway through, after 36 of its 72 matches, the ball lands, the clock strikes twelve and every tile turns over to the new year's side, as the Long Night's boards do at midnight and Twelfth Night's: each holiday's last board turns over, and New Year's ends as the others do. Before midnight, pairs that match on both sides are the ones to take; holding the moon, or Space, shows the side to come.
- A tile left without a partner at midnight misses it, fast asleep: a sleepyhead 😴, and sleepyheads match each other, as lost souls do. Each costs 10 points, and midnight with everyone awake earns 150. New Year's tiles draw a sleepyhead as a round face fast asleep in a nightcap, glowing a dreamy lilac.
- It's told in its own words (`newyear` in main.js's turns): the top bar counts the matches to midnight (🕛 36 to midnight) and the sleepyheads there would be if the tiles turned over now (😴 0), and after it says 🎆 New Year. At midnight it wishes a happy new year, and the clock strikes twelve; as it finishes, a firework bangs and crackles under a fanfare, and 🎆 🎉 🎇 🥳 rise over the board. The score tells it as Midnight with everyone awake, or Sleepyheads.
- The 1 is the full set, the most of the ten, and its tall stem makes it the tightest: 18 tiles free at the start, against the 3's 37 and the 2's 48. Opening the stem up to 23 changed little, as measured, so its peak stayed.
- Measured over 200 deals: each can be won through midnight in its own order with no sleepyheads, and the hints find a way through from a move of your own. A player taking pairs at random wins a third of them, with 13 sleepyheads at midnight, and is stuck before midnight one time in five; one taking pairs that match on both sides whenever it can wins two thirds, with 0.2 sleepyheads. Twelfth Night's drum, for comparison: 65% and 76%. With the same midnight halfway through, the 3 is harder still for random play, 29%, and the turtle and the 2 easier, 53%.

### New Year's Day: Resolutions

- After midnight, New Year's Day, the last of New Year's boards (`#play/january`): a wall calendar turned to January. Its four rings hook through the top of the page, over the month's band, which is piled up to the fourth layer as a crest; below, inside the page's edges, the month's five weeks, a row of days each, with the paper showing between them, and on each week three days marked on the layer above: 118 tiles on four layers, nine across. It is not one of the countdown's numbers, so `NEW_YEAR` in `js/newyear.js` lists the countdown and then the day, and `newYearOf` finds a board's rules among them.
- Its twist is a resolution: no sweets. Six sweets sit on top of the board, each a tile free at the start and holding a tile down, none touching another, tinted a frosting pink with its treat in the corner where badges go (🍩 🍪 🧁 🍫 🍬 🍰). The resolution is to leave them alone through January, the board's first 31 matches, a day each: every match held out scores 5 points, and holding out the whole month 100 more, 255 in all (`POINTS.held` and `POINTS.resolution`). A pair with a sweet in it, taken in January, breaks the resolution, keeping what the days held earned. After January, the sweets are fair game, tiles like any other. Sweets change nothing about when a tile can be taken.
- The sweets are chosen by where they lie, before the deal, and the deal is made to leave them alone through January, trying every other free tile first, so that its own order keeps the resolution (`js/engine/sweets.js`). The line the hints follow begins as that order, so a player who follows the hints keeps it too. A shuffle in January deals the board again the same way through what's left of the month, and its new line keeps to it.
- Choosing a sweet in January says it would break the resolution. Breaking it crunches, with a falling sigh, a 💔 rising; seeing January out plays a fanfare, with 💪 and the bonus rising. The top bar counts the days held (📅 12/31), then says kept (💪) or broken, and on which day (💔 day 9); a screen reader names each sweet and whether it's still a temptation. An undo takes back a broken resolution, or a kept one.
- Measured over 150 deals: a player taking pairs at random holds out 4.4 days, never the whole month, for 22 points; one leaving the sweets alone whenever it can holds out the month 72% of the time, for 220, and is cornered late in January the rest, with only pairs with sweets left; a careful one, which also keeps a pair without sweets for the next match and never leaves a board that can't be won, keeps it 78% of the time, for 228 (40 deals). About 39 tiles are free at the start.

## Groundhog Day: the board of the day

The day that keeps coming round, open all year, every year: one board a day, the same deal for everyone, played again and again until it goes just right. `js/groundhog.js` holds it.

- Its board is a groundhog peeking out of his burrow: his ears up and his eyes two holes, his snout raised between them and his nose on top of it, his paws on the edge of the mound of earth, piled up at its middle: 118 tiles on three layers, nine across. It has no twist but the day itself, and wears Groundhog Day's own tiles (below). With Groundhog Day chosen, the turtle wears them too.
- Each day's board is dealt from a seed made from the date alone (`daySeed`), by the clock where it's played, so everyone has the same board that day, and the next day brings a new one. Every day's board through a year can be won, as measured.
- It is played as often as one likes, the same tiles in the same places each time: Play it again after clearing it, and giving it up starts the same board over. The board in play is kept, as the other holidays' are, but only through its day: the next day, the card offers that day's board.
- In main.js it is a run of one board (RUNS' `groundhog`, `daily`), so that the board in play, its sky and its look come as the other runs' do; its own card (`dailyMenu`) shows the best today and how often it was cleared, the days in a row cleared, counted from yesterday until today's is (`streakOf`), and the week's days with their bests, today's to play.
- Cleared under par, the groundhog sees no shadow: an early spring (🌷). Otherwise he sees it, and it's six more weeks of winter (❄️). The top bar names the day's board by its date (🦫 Groundhog Day Nov 17).
- Each day's best and clears are kept by the date, a little over a year of them. A leaderboard for the board of the day, everyone's on the same deal, would need its boards in the Firebase rules, and is for later.

### Groundhog Day's tiles

The same faces as Halloween's, matching just as those do, drawn as Groundhog Day: only the drawings and the names are Groundhog Day's. `js/ui/groundhog-faces.js` holds them, and `faces.html?set=groundhog` shows them all.

| Halloween's | Groundhog Day's |
|---|---|
| Eyes, one to nine | Burrows, a ring of earth with snow on its top round a dark hole, two eyes peeping out; the one the groundhog's own, in a snowy mound, as the snow comes down |
| Bones | Candles, beeswax and lit, for Candlemas, the old feast on the same day; the one a candle in a brass chamberstick, its flame glowing |
| Graves | Scrolls, for the forecast proclaimed: rolled at the top and the foot, with two lines of writing, a seal of red wax, and the number big in the middle |
| The monsters (E, S, W, N) | Four weather prophets, each of whom comes out on the second of February to look for his shadow, in one land or another: the groundhog in his top hat, a hedgehog, a badger, and a bear, just woken, yawning, with snow on his head |
| Jack-o'-lantern, witch's brew, ghost | The sun, beaming, a weather vane, green with verdigris, its rooster on its arrow, and a cloud, red, green and white, as the dragons they stand for are: in sunshine the groundhog sees his shadow, and under a cloud he doesn't |
| The poison garden | Spring's first flowers: a snowdrop, a crocus, a daffodil and a tulip, any two of which match |
| The moons | Songbirds, singing for spring, each on a snowy branch in a round of pale sky: a robin, a bluebird, a cardinal and a chickadee, any two of which match |
| The lost soul | His shadow, standing up on the snow, its eyes wide |

- The middle burrow of the five and the nine is ringed with spring's green grass, the rest with earth, as a dots tile's middle dot is red.
- Each group's corner number has a colour of its own, by day and by night: the burrows' earth brown, the candles' flame orange, the scrolls' ink blue, the weather prophets' woodland green, the crocus's purple and the cardinal's red.
- The shadow glows the pale blue of snow at dusk, on the board and held up close, where Halloween's lost souls glow blue, Christmas's coal like an ember and New Year's sleepyheads lilac.

### Groundhog Day's music

Groundhog Day is a forecast, an early spring or six more weeks of winter, and its music is Vivaldi's Four Seasons of 1725 on a harpsichord in a music room (`js/ui/sound.js`): Spring and Winter. The notes are Vivaldi's, as the Mutopia Project's edition gives them (CC BY-SA 3.0), taken from its files of Spring and Winter. It plays with Groundhog Day's tiles: on the board of the day, and on the turtle while Groundhog Day is the holiday chosen last.

| Moment | Groundhog Day's |
|---|---|
| A match | the next note of Spring's first two themes, the tune everyone knows, on the harpsichord |
| A board cleared under par, an early spring | Spring's opening, its first theme and its second, the first violins' tune over the second violins and the cello, every note damped as its key is let go |
| A board cleared over par, six more weeks of winter | Winter's opening: the strings' shivering eighths, the cello alone, then the violas, the second violins and the first, each a bar after the last, to a clash that resolves into F minor, and a chord of it to end on |
| The room | a music room's |
| A shuffle | the groundhog digging, and a clod of earth landing |
| A hint | a cardinal's whistle: cheer, cheer |
| A treat | a candle lit for Candlemas, and a chord |
| No pairs left | the groundhog sees his shadow: his whistle of alarm, and he scurries back down his burrow |

- The harpsichord is plucked as the banjo is, a string in Karplus and Strong's way, with two strings a key, one an octave above, as a harpsichord's two choirs of strings are.
- The tests check that both pieces keep time, their voices together, Spring ending on E major and Winter on F minor, that the harpsichord is in tune, and play every sound offline: each heard, none too loud.

## Valentine's Day: a love story

Eight boards, a love story told from Cupid taking aim to "be mine", each board a moment of it. `js/valentines.js` holds them, and all eight are made.

- They are reached in turn, as Christmas's twelve days are, and open with Valentine's Day, on February 1st.
- Each board is shaped by its moment, and the boards grow through the story, from 72 tiles to the full set of 144, all nine across, for phones held upright: on a Galaxy S25+ held upright their tiles come out 37 to 40px wide.
- The first board is the gentle start, with no twist, as the first day's and the 10 are. The last, Be mine, is planned from the first: halfway through, the question is popped and every tile turns over, as at the Long Night's midnight and on Twelfth Night, and a tile left without a partner is a broken heart, matching only another broken heart. The twists between are planned below, each to be tried and measured as its board is made, as Christmas's and New Year's were.
- Valentine's boards wear Valentine's own tiles (below), wherever they are played, as the twelve days' wear Christmas's, and play its music, Liszt's Liebestraum on a harp. With Valentine's chosen, the turtle wears them too, and plays it.
- While its boards were being made, each played by its address, as the twelve days' did. With all eight made, on 20 November, Valentine's Day is ready, and its card in the menu is a run of days, kept in main.js's RUNS as `valentines`: the chapters in order, each with its title, or its best score once played, and the Valentine's score, the bests added up. The eighth cleared, the question has its answer: yes.
- Its sky is pink on deep rose; each board's own, from a pink afternoon to the starry night the question is popped, is chosen as the board is made. The twists' own sounds come with their boards.
- Each board is drawn already, as planned on 18 November, in `tools/valentine-drafts.js`, and `tools/valentine.html` deals them in a phone's space, in Valentine's tiles: each drawing's every deal tried, 100 of each, can be won in its own order. As a board was made its drawing moved to `js/engine/layouts.js`, as all eight have.

| Chapter | Title | Board | Twist |
|---|---|---|---|
| 1 | Cupid's bow | Cupid's bow drawn, an arrow on its string pointing up, ready to fly: the arrowhead at the top, the bow's arc beneath it, its limbs coming down to the tips, the string pulled back to a V, and the arrow up the middle, raised, from its feathers at the foot: 72 tiles on four layers, nine across and eleven down | none: the gentle start |
| 2 | Love at first sight | a heart pierced by Cupid's arrow, its feathers sticking out at the upper left and its head at the lower right, the heart raised in the middle and the arrow raised across it: 92 tiles on three layers, nine across | Cupid's arrows |
| 3 | A secret admirer | a valentine in its envelope, the flap closed in a V, a gap along its edges, raised, and sealed with a heart at its point: 100 tiles on three layers, nine across and seven down | Sweethearts |
| 4 | A dozen roses | a vase of roses: the twelve roses raised over the bouquet, its leaves hanging at the sides, and the vase beneath, its neck narrow and its belly round: 102 tiles on three layers, nine across | In bloom |
| 5 | The first date | dinner by candlelight: two tall candles in their candlesticks, their flames above them, on the table: 108 tiles on four layers, nine across | Candlelight |
| 6 | A box of chocolates | the box with its lid off, nine chocolates in three rows, each raised on its paper cup, inside the box's walls: 118 tiles on three layers, nine across and nine down | Savour each one |
| 7 | Hugs and kisses | an X over an O, bold, with a ridge along their strokes and a crest along the ridge: 132 tiles on four layers, nine across | XOXO |
| 8 | Be mine | a ring, its band round an open middle, a diamond raised high on top, coming to a point where it sits on the band: the full set of 144 tiles on six layers | Be mine |

Drawing the boards changed the outline of 17 November:

- A board reads by its outline: the tiles' faces draw the eye, so a raised layer barely shows. So the heart's arrow sticks out of it at both ends, where a heart leaves room, rather than lying across it; and the envelope's flap shows as a gap along its V.
- Cupid's bow was to be the seventh board, of 132 tiles; but a bow and arrow is drawn in lines, which hold about 72 tiles without stacking into towers. So it's the first, the gentle start, and it starts the story better: Cupid takes aim, and on the next board his arrow has struck. Its twist idea, Cupid's arrows, goes with it to the heart.
- The roses come before the first date: the admirer sends flowers, and then asks. They stand in a vase, which reads better than a bouquet on its own: drawn loose, it looked like a lollipop.
- Candlelight was to score a pair in the glow, as the disco ball's beam already does; now it takes a tile in each candle's glow. Nothing is darkened, as Boneyard's Candlelight, turned down, would have been.
- Assorted chocolates, a treat in some, would repeat the jack-o'-lanterns' treats and the hatching eggs; the box's twist is now to eat each chocolate whole before the next.

### Valentine's tiles

The same faces as Halloween's, matching just as those do, drawn as Valentine's: only the drawings and the names are Valentine's. `js/ui/valentine-faces.js` holds them, and `faces.html?set=valentines` shows them all.

| Halloween's | Valentine's |
|---|---|
| Eyes, one to nine | Hearts, red, each with a shine on it; the one a great heart with a ribbon round it, a banner whose ends fold back behind it |
| Bones | Cupid's arrows, each with a heart for its head, a golden shaft and pink feathers; the one his bow drawn, an arrow on its string pointing up, as on the first board |
| Graves | Valentines, each a card in its envelope, the flap closed in a V and sealed with a heart, the number big on the heart |
| The monsters (E, S, W, N) | Four valentines' puns: a bumblebee with hearts for wings (bee mine), a barn owl, his face a heart (owl always love you), a teddy bear holding a heart (I love you beary much) and a kitten, her nose a heart (you're purr-fect) |
| Jack-o'-lantern, witch's brew, ghost | A heart-shaped box of chocolates, its lid off, a love potion, little hearts bubbling up out of it where Halloween's brew bubbled, and a paper lace valentine: red, green and white, as the dragons they stand for are |
| The poison garden | Love's flowers: a red rose, violets, a pink carnation and a daisy, a petal falling from it, any two of which match |
| The moons | Candy hearts, each its own pastel, saying BE MINE, XOXO, LOVE YOU and HUG ME, any two of which match |
| The lost soul | A broken heart, its halves fallen apart, for Be mine |

- The middle heart of the five and the nine is pink, as a dots tile's middle dot is red.
- Each group's corner number has a colour of its own, by day and by night: the hearts' red, the arrows' gold, the envelopes' violet, the animals' brown fur, the leaves' green and the candies' mint.
- The broken heart glows a tender pink, on the board and held up close, where Groundhog Day's shadow glows the blue of snow at dusk.

### Valentine's music

Valentine's Day is a love story, and its music is Liszt's Liebestraum No. 3 of 1850, his dream of love, on a harp in a drawing room (`js/ui/sound.js`), chosen on 19 November over Elgar's Salut d'Amour. The notes are Liszt's: the theme the nocturne is known by, from its upbeat, sung twice, the second time rising to its high F, and its harmony, a chord to each half bar rippling up and back down over its bass, taken down from flutetunes.com's file of the piece for flute and piano. It plays with Valentine's tiles: on the love story's boards, and on the turtle while Valentine's Day is the holiday chosen last.

| Moment | Valentine's |
|---|---|
| A match | the next note of the theme on the harp, over its bass |
| A chapter's board cleared | the theme's last line, from its ninth bar, the tune over its harmony, and the chord of A flat spread up the harp |
| Be mine cleared, the question answered | the theme's whole second time, from the upbeat, and the harp swept up two octaves before the chord |
| The room | a drawing room's, soft |
| A shuffle | love letters shuffled: a riffle of envelopes, and the pile squared up |
| A hint | a kiss blown: the lips' smack, a breath after it, and a twinkle on the harp's top string |
| A treat | a box of chocolates opened: its lid lifted off, and the harp swept up A flat's chord |
| No pairs left | a heart breaking: a brittle crack, and two notes falling on the harp, a sigh |

- The harp is plucked as the banjo and the harpsichord are, a string in Karplus and Strong's way, by a fingertip a third of the way along, its low strings ringing longest, and each rung down to a whisper before its sound ends, so that none stops short.
- The theme opens on a C sung again and again; its bass, falling a step at a time beneath it, goes with each note a match plays, so that the first matches move too.
- A holiday's strings are let go when another's music comes, as the harp's are many.
- The tests check that the theme keeps time, an upbeat and twelve bars of 6/4, its harmony a chord to each half bar, its second time opening as the first does, ending on A flat; that the harp is in tune; and play every sound offline: each heard, none too loud.

### Cupid's bow

- The first board, the gentle start, with no twist: 72 tiles, the fewest of the eight, 26 free at the start. Its card tells the free-tile rule by the bow's string, whose tiles are free from the start.
- Made on 19 November: it plays by its address, `#play/bow`, as the first chapter (`js/valentines.js`), whose card opens the story, and every one of 200 deals can be won in its own order. On a Galaxy S25+ held upright its tiles are 38px wide. It wears Valentine's own tiles, and plays its music.

### Cupid's arrows

- The second board's twist, on the pierced heart (`#play/heart`). As the board starts, and again every eight matches, Cupid lets fly an arrow 💘: it strikes two tiles of a kind, and they're smitten, blushing pink with a heart on each that counts down the matches until his next arrow. Take the two together before it flies, and it's love at first sight: 30 points. Take either with another tile and a heart is broken; leave them, and they get over it when the next arrow flies.
- An arrow strikes two tiles with nothing on them, so that both hearts show, and not both free, so that the couple has to be dug for; and a way to win from where the tiles lie takes the two together before the next arrow, so that it can always be had: the hints' way, or one made from it by taking the couple sooner, as long as that still wins, which the hints then follow. Which couple is shuffled for that arrow from the board's seed, so that a board reached the same way, or reloaded, sees the same arrows (`js/engine/cupid.js`). Where the hints' way leaves no couple to dig for in time, the arrow strikes a pair it takes free already: 29 of 360 arrows in 60 deals.
- Struck at first from the hints' way alone, half the boards had no couple to dig for as they started; letting the way take a couple sooner found one for nearly every arrow.
- 46 matches: six arrows. Cupid's bowstring twangs as he lets fly, the harp runs up a chord for love at first sight, and a heart breaking cracks and sighs. The top bar counts the couples (💘 2). An undo takes back a couple, or a broken heart, and an arrow; a shuffle moves the smitten couple with the tiles, to a pair of the new deal with a tile it had.
- Made on 19 November. Measured over 100 deals: following the hints takes all six couples together; the deal's own order takes 3.0, breaking 0.6 hearts; a player taking pairs at random 2.3, breaking 0.8 and clearing 75 boards; and a greedy one, taking the couple whenever both its tiles are free and never parting them, 3.8, clearing 80.

### Sweethearts

- The third board's twist, on the envelope (`#play/envelope`). Eight tiles carry candy hearts, each with half a sweet nothing from the secret admirer: BE and MINE, TRUE and LOVE, HUG and ME, SWEET and TALK, a message's two halves in one pastel, as the candy hearts' own tiles are, and on tiles of two different kinds. Take the pair with one half, and then, as the very next match, the pair with the other, either first, and the message is said: 40 points. Anything else taken between leaves it unsaid, and its other half's heart goes.
- The deal puts each message on two pairs its own order takes one straight after the other, spread through it, so the hints say all four (`js/engine/sweethearts.js`). Every half is on a kind of its own, never the candy hearts' own, so that no pair takes two halves at once, and on a tile whose heart shows from the start: nothing on it, no raised tile in the row above, whose edge would hide the heart where it peeks over the tile's top, and not the board's top row, where on a screen the board fills from top to bottom the bar above would cut it off.
- As a message is begun, the tile with its other half blushes and its heart beats until the next match, and the page says which word to take. A tile held up close shows its half in full. The top bar counts the messages said (💌 2/4). A message said is a note unfolded and its two words sung on the harp; one unsaid, a little sigh on it.
- The hints keep to a way that says the messages still to say: a half can go with any tile of its kind, and the rest of the way is played as it comes, each pair as soon as it can be, so that the digging a message needs comes first. As it was made, after six pairs of a player's own, the hints said 3.3 messages of the four over 200 deals moving a message's two pairs together alone; 3.5 pairing a half with any tile of its kind; and 3.8 playing the rest as it comes.
- An undo takes back a message said, begun or left unsaid. A shuffle puts the messages still to say on the new deal as the deal did, and the other half of a message begun on a pair free now, to be said next.
- Made on 20 November. Measured over 200 deals: following the hints says all four on every one, the messages' first pairs coming after 4, 12, 21 and 31 of the deal's 50 pairs, on average, and about three in four having to be dug for, the rest, mostly the first, ready to say from the start; a player taking pairs at random says 0.35; a greedy one, never taking a half until both its message's pairs can go, 3.8, clearing 182 boards with up to five shuffles; and following the hints after six pairs of the player's own, 3.7, 139 of 144 on the boards still to be won in 40 deals. On a Galaxy S25+ held upright its tiles are 40px wide.

### In bloom

- The fourth board's twist, on the vase of roses (`#play/roses`). Its twelve roses, the tiles raised on top of the bouquet, start in bud, a bud on each. From the third match one opens every three matches, from the top down, and stays in bloom for six, blushing, with a rose counting down the matches it has left, deeper at the last two; then it wilts 🥀. Take a rose in bloom, with any tile of its kind, and it joins the bouquet: 20 points. A bud taken before it opens is wasted, and a wilted rose is just a tile.
- The roses are free from the start, so the twist is the timing: a tile of a rose's kind ready to go with it while it's in bloom. Where New Year's Day's sweets are to be left alone, a rose is to be taken, at its moment; a careless player, taking the free tiles on top, wastes most of them in bud.
- The deal takes each rose in its own order while it's in bloom (`js/engine/roses.js`): as it plays the board through it tries the roses in bloom first and the buds last, and it's dealt again until its order gathers all twelve, so that the hints gather all twelve. A shuffle deals again in the same way, the roses staying where they are.
- The hints keep to a way that gathers the roses still to gather, played as it comes: a rose in bloom goes as soon as it can, with the tile the way pairs it with or any other free tile of its kind, and no bud goes while anything else can. A swap of partners that would leave two tiles to take each other, one lying over the other, isn't made, and a way that comes to a stop is played again without swaps: before that, the hints after six pairs of a player's own gathered 3 roses on a deal where another way gathered 11.
- The top bar counts the roses in the bouquet (🌹 5/12). A rose opening is its petals unfurling and the harp rising; one gathered, tissue paper rustling and the chord of A flat; a bud wasted, the secateurs' click and a low note; and one wilting, three notes drooping. An undo takes back a rose gathered or wasted, and one opened or wilted with the match that did it.
- Made on 20 November. Measured over 200 deals: following the hints, or the deal's own order, gathers all twelve on every one; a player taking pairs at random gathers 2.2, wasting 7.4 in bud and letting 2.4 wilt; a careful one, never taking a bud while anything else can go and taking a rose in bloom whenever a tile of its kind is free, gathers 10.5, all twelve on 71; and following the hints after six pairs of the player's own, none a rose, 10.6, all twelve on 126, within 6 roses over 60 deals of the best of 80 random playouts from the same places. On a Galaxy S25+ held upright its tiles are 40px wide.

### Candlelight

- The fifth board's twist, on the candles (`#play/candles`). Each candle's glow tinges the tiles round its flame gold, his candle's on the left of the board and hers on the right, three rows deep. A pair with one tile in each candle's glow, one by his candle and one by hers, is a candlelit pair: 20 points. Where the disco ball's beam wants both tiles in one band of light, candlelight wants a table for two.
- The candles burn down as the matches go by: every six matches the glow sinks a row toward the table, until it would pass the table's front edge and they gutter out, after 48 of the 54 matches (`js/engine/candles.js`).
- The deal is made so that its own order takes at least six candlelit pairs, and the hints take a candlelit pair whenever one can be taken and the board still won after it, as Cupid's couples are made to be taken, or by a way found from where it leaves the tiles. The top bar counts them, and the matches until the glow sinks (🕯️ 3 · ⏳ 4).
- Tried first with a deal asking for four, following the hints took 5.1 candlelit pairs, and a player taking pairs at random 4.2: the candles' glows are big and the board is the same on both sides, so pairs across them come by chance. A glow a row deep was too thin for the deal to find six. So the deal asks for six, and the hints take every one they can.
- A candlelit pair is two glasses raised across the table and a soft chord on the harp; the candles burning down, a breath through the flames and the harp's light lowering; and guttering out, a puff and a low note. An undo takes back a candlelit pair, and a shuffle leaves the glow where it is.
- Made on 20 November. Measured over 200 deals: the deal's own order takes 6.8 candlelit pairs, never fewer than six; following the hints, 9.0, every deal cleared; a player taking pairs at random 4.8, with up to five shuffles; and a careful one, taking a candlelit pair whenever one can be taken, 6.8. On a Galaxy S25+ held upright its tiles are 40px wide.

### Savour each one

- The sixth board's twist, on the box of chocolates (`#play/chocolates`). Each of the nine chocolates is its top, the chocolate under it and its paper cup, four tiles, six in all. Bite into a chocolate by taking its top; eat the rest of it, cup and all, before biting into another, and it's savoured: 30 points. Bite into another first and the one left half-eaten is just eaten, as are two bitten into at once.
- The box's walls, two high all round, 64 tiles, can be taken at any time, and give the chocolates' tiles partners. Every chocolate can be eaten whole on its own: with its top and the chocolate gone, its cup's inner tiles are free, then its outer ones.
- The deal eats the chocolates one at a time in its own order (`js/engine/chocolates.js`): as it plays the board through, it tries the tiles of the chocolate bitten into first and the other tops last, and it's dealt again until its order savours all nine, so the hints savour all nine. The hints keep to a way that savours the chocolates still to eat, played as it comes, as the roses' is: the chocolate bitten into first, its tiles with any free tile of their kind, and no other bitten into while it lasts. A shuffle deals again in the same way.
- The chocolate bitten into is ringed in milk chocolate brown, its tiles still to eat, and the page says to eat the rest. The top bar counts the chocolates savoured (🍫 3/9). A bite is the shell snapping; a chocolate savoured, its paper cup crumpled and the harp humming up a chord; and one left half-eaten, a shrug on the harp. An undo takes each back.
- The walls are the chocolates' partners, so taking them carelessly costs chocolates: after six pairs of a player's own, all of them walls, following the hints savoured 5.3 of the nine, over 200 deals, and the best of 60 random playouts from the same places, over 40 deals, 6.2, against the hints' 5.4 there.
- Made on 20 November. Measured over 200 deals: following the hints, or the deal's own order, savours all nine on every one; a player taking pairs at random savours 1.3, leaving 7.6 just eaten; and a careful one, never biting into another while one is unfinished, 5.7. On a Galaxy S25+ held upright its tiles are 40px wide.

### XOXO

- The seventh board's twist, on the X and the O (`#play/xo`), the X 62 tiles and the O 70, drawn apart and joined, the O half a tile below (`parseParts` in `js/engine/layout.js`). A pair from the X, both its tiles in it, is a kiss; from the O, a hug. Kisses and hugs taken in turn, four in a row, kiss, hug, kiss, hug or the other way round, make an XOXO: 15 points, and the run starts again. Two kisses or two hugs together start it again from the second, and a pair with a tile in each letter starts it again with nothing.
- Dealt as any board is, half its pairs would have a tile in each letter; so it's dealt a letter at a time, as the gold rings were a ring at a time, its own order taking kisses and hugs in turn, and dealt again until none of its pairs has a tile in each letter, so the hints make XOXOs: fifteen on every deal (`js/engine/xoxo.js`). After a player's own pairs, the hints take next a pair that carries the run on, when one can be taken and the board still won.
- An XOXO was to be worth 40 points; with fifteen in a deal's own order, the hints would have made 600 points of one twist, where the other chapters' make 160 to 270, so it's worth 15.
- The top bar shows the run so far, its letters (XOX), and counts the XOXOs (💋 3); the free tiles of the letter the run wants next blush pink. An XOXO is two kisses and two hugs, the lips' smacks and the harp's warm chords in turn; a run broken is told. An undo takes it back, and a shuffle deals again taking kisses and hugs in turn, from where the run is.
- Made on 20 November. Measured over 200 deals: following the hints, or the deal's own order, makes fifteen XOXOs on every one; a player taking pairs at random 1.7, twelve of its pairs having a tile in each letter; a careful one, carrying the run on whenever it can, 12.9; and following the hints after six pairs of the player's own, 11.5, 13.2 on the boards still to be won. On a Galaxy S25+ held upright its tiles are 40px wide.

### Be mine

- The eighth board's twist, on the ring. Halfway through, after 36 of its 72 matches, the question is popped 💍 and every tile turns over; the moon shows the other side coming, and three matches before, the page says so. A player who takes pairs that match on both sides meets no broken hearts; a tile left without a partner turns into a broken heart 💔, and broken hearts match each other.
- It's told in its own words (main.js): the clock counts down to the question (💍 3 to the question) and then shows it (💍 Be mine?); the score says the answer is yes, with no broken hearts, or counts them. Every deal can be won in its own order through the turn, meeting no broken hearts, and the hints find a way through from a move of the player's own.
- The question popped is the ring box's lid snapping open, the harp swept up two octaves, and a hush before its chord; and cleared, the board plays the theme's whole second time.
- Made on 20 November (`#play/ring`). As drawn, the diamond's peak, six layers up, lay over the number of the tile beside it on the bottom layer, on tiles 24px wide, though that tile lies under the crown till the peak is gone; so the bottom layer is hollow there and on the other side of the middle, and the crown two tiles wider instead. Over 200 deals, each can be won in its own order through the turn with no broken hearts, and from a move of the player's own the hints found a way through on all ten tried. On a Galaxy S25+ held upright its tiles are 39px wide. With it, Valentine's Day is ready: the sixth holiday to play.

## April Showers: from showers to flowers

A season for the gap between the Start of Spring and the beach season, when no holiday fell: April's showers, then May's flowers, as the saying goes, April showers bring May flowers. Eight boards, from the first shower to May Day, the sky clearing as they go. `js/showers.js` is to hold them.

- It is the twelfth holiday, a season as the beach season is: April Showers in the menu, with ☔ for its icon, from April 1 to May 31, and opening on March 1, a month ahead, as the beach season opens a month before Memorial Day. It is in `js/themes.js`, so it's in the menu, greyed out and saying soon, as the other holidays are until their boards are made.
- Its colours are lilac, for the lilacs that come out in May, on a rain grey sky; each board's own sky, grey and drizzling at the first, clearing to May's blue by the last, is chosen as the board is made.
- The Start of Spring keeps March's things for its own boards, when they're planned: the thaw, the first shoots, kites in the March wind and lambs. April Showers has the rain and the bloom.
- The boards are to be reached in turn, as Valentine's are, and grow from about 84 tiles to the full set of 144, all nine across. The first four are April's, in the rain, and the last four May's, coming into flower.
- The first board is the gentle start, with no twist. The last, May Day, is planned from the first: halfway through, April turns to May, and every tile turns over, as at the Long Night's midnight; a tile left without a partner is a flower that wilted, matching only another. The twists between are to be chosen a board at a time; the ideas in the table are where to start.
- Its boards are to wear April Showers' own tiles (below), wherever they are played; with April Showers chosen, the turtle wears them too. While they are being made, each plays by its address; with all eight made, its card in the menu is a run of days, kept in main.js's RUNS as `showers`, with the season's score, the bests added up.

| Chapter | Title | Board | Twist |
|---|---|---|---|
| 1 | The first shower | a rain cloud, billowing, its raindrops falling in lines beneath it: about 84 tiles | none: the gentle start |
| 2 | Umbrella weather | an open umbrella, its canopy peaked at the top and scalloped at the rim, its handle down the middle, hooked at the foot: about 92 tiles | Raindrops: a drop lands on the umbrella's peak every four matches and runs down a rib, a row a match, to be caught by taking the tile it's on before it drips off the rim |
| 3 | Puddle jumping | a pair of rain boots side by side, splashing in a puddle: about 100 tiles | Splash zone: a pair from the puddle splashes, and splashes one straight after another splash higher, 10 points more each; the boots stand in the puddle, so it's best kept till last |
| 4 | The rainbow | a rainbow arching between two clouds, its bands raised one over another: about 108 tiles | Chasing colours: one band lit at a time, moving on a band with every match, red to violet and round again; a pair from the band lit catches its colour |
| 5 | Seedlings | a seed tray, a sprout in each of its cells, their first leaves raised: about 116 tiles | Watering: eight seedlings, each watered by a pair taken beside it; watered three times it blooms, and a bloom taken is picked |
| 6 | The watering can | a watering can, its spout raised and sprinkling: about 124 tiles | Fill and pour: a pair from the can's body fills it a measure, up to five, and a pair of its drops pours one out |
| 7 | The flower bed | rows of tulips in a bed, their heads raised over their leaves: about 132 tiles | Busy bees: a bee flies from tulip to tulip with every match, the one she's flying to next ringed, and the tulip she's on, taken, makes honey |
| 8 | May Day | a May basket brimming with flowers, hung on a door: the full set of 144 tiles | May flowers: April turns to May halfway, and the tiles turn over; wilted flowers |

### April Showers' tiles, to come

The same faces as Halloween's, matching just as those do, to be drawn as April Showers', once its boards are made:

| Halloween's | April Showers' |
|---|---|
| Eyes, one to nine | Raindrops, the one a great drop landing with a splash |
| Bones | Umbrellas, furled, the one opened |
| Graves | Seed packets, each with its number on the packet |
| The monsters (E, S, W, N) | Four who love the rain: a duck, a frog, a snail and a worm |
| Jack-o'-lantern, witch's brew, ghost | Rain boots, a watering can and a paper boat, red, green and white, as the dragons they stand for are |
| The poison garden | May's flowers: lily of the valley, lilac, an iris and a peony, any two of which match |
| The moons | Butterflies, out after the rain, any two of which match |
| The lost soul | A wilted flower, for May Day |

### The first shower

- The first board, the gentle start, with no twist: a rain cloud, its biggest puff billowing up in the middle, raised four high, and a smaller one at its left, over a broad body; and beneath it, half a tile below, its raindrops falling in three slanting lines of four. 84 tiles on four layers, 30 free at the start. Its card tells the free-tile rule by the raindrops, every one of which is free from the start.
- Made on 20 November: it plays by its address, `#play/cloud`, as the first chapter (`js/showers.js`), and every one of 200 deals can be won in its own order. Five clouds were drawn and dealt in a phone's space: one heaped up in the middle read less as a cloud than one with puffs on its top edge, and raindrops in lines hanging from the cloud less as rain than lines falling half a tile below it. On a Galaxy S25+ held upright its tiles are 40px wide. Until April Showers' own tiles are drawn it wears Halloween's, and April Showers says soon in the menu while the other seven are made. Played by its address, as Valentine's chapters were while they were made, it wears the look of the holiday chosen last; its own sky, a drizzling grey, is for its run.

### Umbrella weather

- The second board's twist, on the umbrella (`#play/umbrella`), chosen on 21 November over Hold on tight, a gust of wind every eight matches to be weathered by a pair from the handle, and Pitter-patter, pairs of a suit taken a number higher each time. As the board starts and every four matches, a raindrop 💧 lands on the umbrella's peak and runs down the canopy along one of its five ribs, fanning out from the peak to the five points of its rim, a row with every match, and drips off at the rim. A drop is on the tile at the top of the stack where it is: take that tile, with any tile of its kind, and the drop is caught, 20 points. Over a place whose tiles are all taken, it runs on over nothing, and can't be caught there. Which rib is shuffled for each drop from the board's seed, among the ribs with a tile still on them, never the rib the drop before took while another has tiles; and a drop lands only on a rib it has the matches left to run the whole way down, so the rain stops with six matches left, eleven drops in all. The drops change nothing about when a tile can be taken (`js/engine/raindrops.js`).
- The board: an open umbrella, 92 tiles on four layers, nine across and ten down. Its canopy is a dome, peaked at the top in a single tile and rising four high at its middle, three across; its rim is scalloped, five points hanging below it where the ribs end, the outer four two high; and its handle runs down the middle from the middle point, two high, hooked to the left at the foot. Of four drawn and dealt in a phone's space, the plain dome read best as an umbrella: raised ribs read as a jumble, and points half a tile down came loose from the canopy. Its tiles are 40px wide on a Galaxy S25+ held upright, and 38 are free at the start. Its sky is a softer grey than the first shower's, the sky starting to clear.
- Each drop sits at the top left of the tile it's on, as badges do, so that the tile and its number still show, a clear blue drop with the light catching it, gliding a place down its rib with every match; over a bare place it runs on fainter, on the table. A drop landing falls onto the peak with a pat and a plip; one caught splashes, with a bright plip and the light glinting; one past the rim drips off and falls away, with a plop. The tiles still in a drop's way are ringed in rain blue, not filled with it, so as not to look chosen, and a screen reader says a tile has a raindrop on it or lies in one's way. The top bar counts the drops caught and the matches until the next lands (💧 3 · ⏳ 2), and the score card the drops caught of those that landed.
- The deal is played through catching the drops it can: the tiles running drops are on first, the drop furthest down its rib first, and last the tiles still in a drop's way, so that they are there when it comes. Without that last, a drop often landed on a rib whose last tiles the deal took before it got there: over 200 deals, the deal's own order missed 225 drops; with it, 10. The hints take a drop whenever they can and the board can still be won.
- Measured over 200 deals, of the eleven drops: the deal's own order catches 10.95, never fewer than 10, and so does following the hints; a player who takes a pair catching a drop whenever there is one, and otherwise pairs at random, 8.4, from 5 to 11; and a player taking pairs at random, 3.

### Puddle jumping

- The third board's twist, on the rain boots (`#play/boots`), the splash zone, chosen on 21 November over Puddle jumping, the plan's idea, a pair in a row with bare table between its tiles jumping the puddle, and Stepping stones, a line of stones across the puddle taken in order. The puddle's tiles, on the table from the boots' soles down, are the splash zone, tinged the blue of rainwater: a pair with both its tiles in the puddle splashes, 10 points, and splashes taken one straight after another splash higher, 20, then 30, and on, 10 more each time; a pair from anywhere else lets the puddle settle, and the next splash starts again at 10 (`js/engine/splash.js`).
- The board: a pair of rain boots side by side, their toes to the left, standing in a puddle, 100 tiles on four layers, nine across and seven down. Each boot is a shaft three across over a foot four across, two high, with a ridge down the middle of its shaft, its cuff higher still, and its toe raised; its sole stands in the puddle, with the arch under it between the ball of the foot and the heel, which made the boots read as boots. The puddle lies flat on the table, a tile deep, nine across under the soles and seven below: sixteen tiles, eight pairs, so that one run through the whole of it, 10 to 80, is worth 360, in line with the other twists. Its tiles are 40px wide on a Galaxy S25+ held upright, and 38 are free at the start, two of them in the puddle.
- First drawn with the boots standing over the puddle, not in it, and the deal taking the puddle in one run as the board started: the puddle's rows blocked only each other, so a player who splashed whenever a pair could be had made 352 of the 360 on average over 200 deals, with nothing to think about. With the boots' soles standing in the puddle's top row, the whole of it opens up only once the boots are gone, and the deal keeps it till last (`dryFirst`), taking two tiles out of the puddle together while two of them are free, and dealing again while its own order takes the puddle in more than one run. The puddle holds nothing else down, so the boots can always come off first; and so that keeping out of it never brings a shuffle to a dead end, a tile of the puddle is tried when fewer than two others are free.
- The hints keep to a way that leaves the puddle till last, its splashes moved after everything else where that still wins, so following them makes the run of eight. Measured over 200 deals: the deal's own order and following the hints, 360 every time; a player keeping out of the puddle till the boots are gone, 359; one splashing as soon as a pair can be had, 152, its longest run four on the middle deal; and one taking pairs at random, 99.
- Each splash plays a boot stamping into the water, the spray flying up and the drops pattering back down, a little higher than the splash before, with a glint of light from the fourth in a row; the puddle's tiles ripple out from where the pair was taken. The top bar counts the splashes in a row and what the next would score (💦 3 · +40), the score card the splashes and the longest run, and a screen reader says a tile is in the puddle.

### The rainbow

- The fourth board's twist, on the rainbow (`#play/rainbow`), chasing colours, chosen on 21 November over Pot of gold, the plan's idea, the bands painted in turn from red to violet for a pot of gold at the end, and Double rainbow, two pairs from a band one straight after the other. One band of the rainbow is lit at a time, red as the board starts, then orange, yellow, green, blue and violet, and round again, moving on a band with every match: a pair with both its tiles in the band lit catches its colour, 15 points. The band lit next is ringed in its colour, so a pair can be got ready for it (`js/engine/colours.js`).
- The board: a rainbow arching between two clouds, 104 tiles on six layers, nine across and ten and a half down. Six bands one tile thick each would want thirteen across, so each band is a layer, laid along a half ellipse on the half-tile grid, its tiles placed by a script along the curve, none overlapping, each resting on the band inside it: violet on the table within, and each band outside it a layer higher and half a tile further out, up to red on top on the outside, the bands raised one over another as planned. Drawn the other way up, violet on top, only the inner bands were free at the start, while red is lit first; with red on top, every red tile is free from the start, and the rainbow comes apart from the outside in. The bands have 15, 15, 13, 13, 11 and 11 tiles, from red to violet, and a cloud of thirteen, puffed up three high, stands at each foot. Its tiles are 39px wide on a Galaxy S25+ held upright, and 19 are free at the start: the fifteen red and four of the clouds'.
- Every tile is tinted its band's colour, pale, and the clouds' a cool white; the band lit shines, its colour deeper, and the band lit next is ringed in its colour, as the raindrops' way is in blue. A colour caught makes the rest of its band shimmer, out from where the pair was taken, with a glockenspiel's note for its band, up the pentatonic scale from red to violet. The top bar counts the colours caught and shows the bands lit now and next as coloured dots (🌈 5 · 🔴 → 🟠), and a screen reader says each tile's band, and whether it is lit now or next, so the colours are told apart by more than colour.
- The deal tries first, at each step, two free tiles of the band lit then, if two are free, and the hints catch the colour lit whenever they can and the board can still be won. Measured over 200 deals, of the 52 matches: the deal's own order catches 21.1 colours, from 14 to 28, and so does following the hints; a player who takes a pair from the band lit whenever there is one, and otherwise pairs at random, 12; and a player taking pairs at random, 4. At 15 points a colour, the hints' way is worth about 315, in line with the other twists.

### Seedlings

- The fifth board's twist, on the seed tray (`#play/tray`), watering, the plan's idea, chosen on 22 November over Growing tall, pairs of a suit taken a number higher each time. Eight seedlings 🌱 stand in the tray. A pair with a tile touching a seedling, beside it or just above or below it on its layer, as birds of a feather touch, waters it 💧, once a pair; watered three times, it blooms 🌷, and a bloom taken, with any tile of its kind, is picked, 30 points. A seedling taken before it blooms is pulled up, just a tile (`js/engine/watering.js`).
- The board: a seed tray seen from above, 112 tiles on two layers, nine across and eight down. Its soil fills the tray, nine by eight, and on it stand eight sprouts, each a cross of five: the seedling in the middle and its first leaves raised round it, so that each seedling has four leaves to water it from, and can be watered three times with one to spare. Crosses three across fill nine columns, so they stand staggered, three, then two, then three, and those side by side touch at their leaves' tips. The soil is a pale brown inside a clay rim, the leaves a pale green and each seedling deeper. Its tiles are 40px wide on a Galaxy S25+ held upright, and 34 are free at the start, none of them a seedling: a seedling's leaves beside it hold it down.
- A seedling comes free as soon as a leaf beside it is taken, a watering already made, so the twist is the waiting: leave it until two more pairs have watered it, then pick it. Each carries a sprout and the waterings it still needs (🌱 2), drinking as it's watered, and once it blooms, a tulip, opening; the top bar counts the blooms picked (🌷 3/8), and a screen reader says how many waterings a seedling still needs. A watering trickles, a bloom opens with a run up the glockenspiel, a bloom picked is snipped to a chord, and a seedling pulled up gives with a low note.
- The deal waters every seedling and picks it in bloom (`tending`): as it plays the board through it tries first the seedlings in bloom, then the leaves of those still growing, a leaf of each in turn, so that one pair waters two, then the rest, and the seedlings still growing last, dealing again while its own order misses one. The hints keep to such a way, picking a bloom when one can be picked and leaving a seedling in bud while anything else can go first. Measured over 200 deals: the deal's own order and following the hints pick all eight every time, 240 points; a careful player, who never takes a seedling in bud while anything else can go, 7.3; and a player taking pairs at random, 4.9, as leaves are taken all the same.

### The watering can

- The sixth board's twist, on the watering can (`#play/can`), fill and pour, chosen on 22 November over Refill, the can running dry every eight matches unless refilled since by a pair from its body. The can starts empty. A pair with both its tiles in its body fills it a measure 💧, up to five; a pair with both its tiles in the drops sprinkling from its rose pours one out onto the garden, 20 points, and with the can empty it waters nothing. A pair from the body taken with the can full fills nothing. So it's fill, pour and fill again, never more than five measures ahead (`js/engine/pour.js`).
- The board: a watering can, 116 tiles on five layers, nine across and ten down. Its body is a box on the left, five across and seven down with its corners off, rising in steps to five high; its handle arches over it; its spout rises steeply from the body's foot to the rose at the top right; and from the rose falls a curtain of fourteen drops, in two lines down the right and the start of a third. The tiles were placed by a script on the half tile grid, checked for overlaps, after drafts with a long gentle spout, the drops scattered round it, read less as a can and stood eleven and a half rows tall, its tiles 34px. The body is painted a garden green, the drops are water blue, and the handle, spout and rose bare metal. Its tiles are 39px wide on a Galaxy S25+ held upright, and 19 are free at the start: nine of the drops, which hang free as rain does, so pouring them dry is the temptation, and three of the body.
- The deal pours every pair of drops with water in the can (`pouring`): as it plays the board through it tries first two drops with water in the can, or else two tiles of its body with room in it, then the rest, and the drops last, dealing again while its own order misses a pour. The hints keep to a way that pours when there's water and a pair of drops can be had, and leaves the drops while the can is empty and its body while it's full. Once the drops are all poured, the body's pairs fill the can quietly. Measured over 200 deals: the deal's own order and following the hints pour all seven every time, never dry, 140 points; a careful player, pouring when there's water and filling when there's room, 6.8; and a player taking pairs at random 3, pouring as many dry.
- A measure glugs into the can, a little higher the fuller it is, a pour sprinkles onto the leaves with a chime, and a pour from an empty can clanks. The top bar shows how full the can is and the pours made (💧 3/5 · 🌼 4), the score card the pours and those dry, and a screen reader says whether a tile is in the can's body or one of its drops, and whether the can is full or empty.

### The flower bed

- The seventh board's twist, on the flower bed (`#play/bed`), busy bees, the plan's idea, chosen on 22 November. A bee 🐝 flies from tulip to tulip, landing on another with every match, and the tulip she's flying to next is ringed, so a pair can be got ready for it. Take the tulip she's on, the top of its head, with any tile of its kind, and she makes honey 🍯, 20 points. A tulip taken while she's elsewhere is just a tile, and she won't visit it again; once every tulip is picked, she flies off. Which tulip she flies to is drawn from the board's seed for each flight, among those still standing and never the one she's on, so a board played the same way sees the same bee, and a shuffle leaves her where she was (`js/engine/bees.js`).
- The board: a flower bed, 130 tiles on three layers, nine across and ten down. Sixteen tulips stand in four rows of four, staggered, each on a block of four leaves, two across and two down; its head is the block's top two raised, and the top of its head sits between them a layer higher, where the bee lands. Below them lies the bed's soil, two rows of nine. The tiles were placed by a script on the half tile grid, checked for overlaps and for a tile under every one raised; with one row of soil the bed had 121 tiles, an odd number, so it has two. The heads are red, yellow, pink and violet in turn along the rows, the leaves green and the soil brown. Its tiles are 40px wide on a Galaxy S25+ held upright, and 28 are free at the start, among them every tulip's top, so picking the tulips as they come is the temptation.
- The deal makes honey at every tulip (`foraging`): as it plays the board through, the bee flying as she would on its order so far, it tries first the tulip she's on, if it's free, then the rest, and the other tulips last, so that each is still standing when she comes to it, dealing again while its own order misses one. The hints take her tulip, with a free tile of its kind, whenever the board can still be won after it, and otherwise put off taking another tulip while anything else can go. Measured over 200 deals: the deal's own order and following the hints make honey at all sixteen every time, 320 points; a careful player, taking her tulip whenever it can be taken and no other while anything else can go, 15.2; and a player taking pairs at random, 3.5.
- The bee hovers over her tulip, keeping still for those who ask for less motion, and buzzes as she flies on; honey rings a run down the glockenspiel and up again. The top bar counts the honey made (🍯 5/16), the score card the honey of the tulips in the bed, and a screen reader says which tulip the bee is on and which she flies to next.

## On a phone

- The board fills the space it has, with 2px round it (`MARGIN` in `js/ui/board.js`), at the widest tiles it fits (`tileFit`), up to 88px. On a Galaxy S25+ held upright, in its browser, the board has 384 by 585 between the bars, and a board nine tiles across fills its width with tiles 40px wide, where with 10px round it they were 38. The tallest boards, twelve down, fill its height instead, at 35, from 34.
- On a phone held upright, the classic turtle, fifteen tiles across, came out at 23px. So the turtle has an upright one too (`UPRIGHT_TURTLE`, `#play/upright_turtle`), for a screen taller than it is wide: the full set of 144, nine across and ten down, on six layers of 64, 38, 20, 12, 6 and 4, swimming up the screen, its head at the top, a flipper at each corner and its tail below, its shell rising in steps to four tiles at the top. On the S25+ its tiles are 39px.
- Whichever of the two turtles gives the bigger tiles in the space the board has is dealt (`turtleKey` in main.js): the turtle in the menu, a new deal of a turtle, and a holiday's board before it opens. A phone held upright deals the upright one, and a computer, a tablet on its side or a phone on its side the classic. A turtle in play stays as it was dealt, and its address names which it is.
- The upright turtle starts with 47 free tiles, against the classic's 35, and its deals can be won, by day and through midnight.
- Each tile's number is in its top right corner, where it was in its top left. The board lifts each layer up and to the right, so a stack taller than a tile beside it lies over the tile's left side, or over its foot from below, but never over its top right corner. On a phone held upright, one tile in six had its number partly hidden in the top left by a stack beside it: 822 of the 5,148 tiles of all 47 boards, 26 of the upright turtle's 144. In the top right, none is (`tileSpots` in `js/ui/board.js`, and its test).
- The drawing on a tile with a number shrinks toward the bottom left, out of its way, and the W, the widest letter, is squeezed to a digit's width. The badges the twists put on tiles, a crown, a coin, a price tag and the rest, moved from the top right to the top left, 14% in from the edge, so that a stack one layer taller on the left, which lifts at most 13% of a tile's width, still leaves them showing; New Year's 2's glasses stand there too. The counts, a burning sparkler's, the milk's and the ice's, too wide to sit beside the number, sit just under it, at the right, where in the top right they had covered part of it.

## Still Boneyard's

- The icon, the cover and the screenshots: Halloween's jack-o'-lantern and tiles.
- The colour a phone gives the page and the installed app: Boneyard's purple.

## What came from Boneyard

- Classic Mah Jong solitaire on the 144-tile set, with deals that can always be won, made by playing a game in reverse; hints, a safe shuffle, and undo; a solver that checks it all.
- Halloween's Long Night: thirteen boards from 6 pm to 6 am, with Ghosts float, Treats and Midnight, when the tiles turn over. The classic turtle too.
- Scoring: 10 a pair, 250 for clearing a board, 2 for every second under par, 100 off for a shuffle and 25 for a hint.
- For tired eyes and small screens: a tile held up close above the finger, the blocked tiles dimmed, and big corner numbers. A word on every button, and a pause that hides the board.
- Plain HTML, CSS and ES modules, with no build step and no libraries; offline play, and installing as an app; a zip, a cover and screenshots for itch.io; and a leaderboard in Firebase.

## Milestones

**Sun 22 Nov:** April Showers' fifth board, the first of May's, seedlings (`#play/tray`): a seed tray seen from above, its soil inside a clay rim and on it eight sprouts, each a seedling with its first leaves raised round it in a cross, 112 tiles on two layers, and watering: a pair taken beside a seedling waters it, and watered three times it blooms, to be picked, 30 points; taken sooner, it's pulled up. The deal's own order waters every seedling and picks it in bloom, as following the hints does. Then the sixth, the watering can (`#play/can`): its body a box with its handle arching over it, its spout rising to the rose and a curtain of drops falling from it, 116 tiles, and fill and pour: a pair from its body fills the can a measure, up to five, and a pair of its drops pours one out, 20 points, or with the can empty waters nothing. Then the seventh, the flower bed (`#play/bed`): sixteen tulips in staggered rows, each a head raised over its leaves, over two rows of soil, 130 tiles on three layers, and busy bees: a bee flies from tulip to tulip with every match, the one she's flying to next ringed, and the tulip she's on, taken with any tile of its kind, makes honey, 20 points. The deal's own order makes honey at every tulip, as following the hints does.

**Sat 21 Nov:** The turtle, and any board played by address outside a holiday's own, now speaks the words of the holiday whose tiles it wears. Before, it gave Halloween's treats whatever it wore, a black cat and a skeleton key left by jack-o'-lanterns drawn as stockings or boxes of chocolates. Now each holiday's tiles bring treats of their own, and the card when no pairs are left names them. A tile freed by a key wears that holiday's key. A board turning over in a holiday's tiles is told in that holiday's words, with Groundhog Day's forecast written for it. Then April Showers' second board, umbrella weather (`#play/umbrella`): an open umbrella, its canopy a dome peaked at the top, its rim scalloped in five points and its handle hooked at the foot, 92 tiles on four layers, and raindrops: as the board starts and every four matches, a drop lands on the umbrella's peak and runs down one of its five ribs, a row a match, to be caught by taking the tile it's on, for 20 points, before it drips off the rim. The deal's own order catches all but the odd one of the eleven, so following the hints does. Then the third, puddle jumping (`#play/boots`): a pair of rain boots standing in a puddle, 100 tiles on four layers, and the splash zone: a pair from the puddle splashes, 10 points, and splashes one straight after another splash higher, 10 more each time, a pair from anywhere else letting the puddle settle. The boots' soles stand in the puddle, so it opens up only once they're gone, and keeping it till last makes a run of eight, 360 points, as following the hints does. Then the fourth, the rainbow (`#play/rainbow`): a rainbow arching between two clouds, each of its six bands a layer, red on top down to violet on the table, 104 tiles, and chasing colours: one band lit at a time, red to violet and round again, moving on a band with every match, a pair from the band lit catching its colour, 15 points.

**Fri 20 Nov:** Valentine's Day's third board, a secret admirer (`#play/envelope`): a valentine in its envelope, its flap closed in a V and sealed with a heart, 100 tiles on three layers, and sweethearts: eight tiles carry candy hearts, each with half a sweet nothing, BE and MINE, TRUE and LOVE, HUG and ME, SWEET and TALK, a message's halves the same pastel; the pairs with a message's two halves, taken one straight after the other, say it, for 40 points, and anything taken between leaves it unsaid. The deal puts every message on two pairs its own order takes back to back, where its hearts show, and the hints keep to a way that says them, so following the hints says all four. Then the fourth, a dozen roses (`#play/roses`): a vase of roses, 102 tiles on three layers, its twelve roses raised two high over the bouquet, and in bloom: the roses start in bud, and from the third match one opens every three matches, from the top down, blooming for six; taken in bloom with any tile of its kind, a rose joins the bouquet, for 20 points, while a bud taken is wasted and a rose left too long wilts. The deal takes every rose in bloom in its own order, and the hints keep to a way that gathers them, so following the hints gathers all twelve. Then the fifth, the first date (`#play/candles`): dinner by candlelight, two tall candles in their candlesticks on the table, 108 tiles on four layers, and candlelight: each candle's glow tinges the tiles round its flame gold, his on the left and hers on the right, and a pair with a tile in each glow is candlelit, for 20 points; every six matches the glow sinks a row toward the table, until the candles gutter out. The deal's own order takes six candlelit pairs or more, and the hints take one whenever they can. Then the sixth, a box of chocolates (`#play/chocolates`): nine chocolates in three rows, each a top, the chocolate under it and a paper cup of four, inside walls two high, 118 tiles on three layers, and savour each one: bite into a chocolate by taking its top, and eat the rest of it, cup and all, before biting into another, and it's savoured, for 30 points; bite into another first and it's just eaten. The deal eats them one at a time in its own order, and the hints keep to a way that savours them, so following the hints savours all nine. Then the seventh, hugs and kisses (`#play/xo`): an X over an O, bold, 132 tiles on four layers, and XOXO: a pair from the X is a kiss and from the O a hug, and four taken in turn make an XOXO, for 15 points, where 40 were planned, the deal's own order making fifteen. It's dealt a letter at a time, so following the hints makes fifteen, and the letter the run wants next blushes. Then the eighth, be mine (`#play/ring`): a diamond ring, the full set of 144 on six layers, turning over halfway as the question is popped, told in its own words, broken hearts for lost souls and the answer yes. With it Valentine's Day is ready, the sixth holiday, open from the 1st of February to the end of the year: its card in the menu is the love story's eight chapters, reached in turn, with the Valentine's score. Then April Showers' first board, the first shower (`#play/cloud`): a rain cloud billowing over its raindrops, which fall in three slanting lines, 84 tiles on four layers, the season's gentle start, with no twist, its card telling the free-tile rule by the raindrops, every one free from the start.

**Thu 19 Nov:** Valentine's Day's first board made: Cupid's bow drawn, an arrow on its string pointing up, ready to fly, 72 tiles on four layers, the love story's gentle start, with no twist. It plays by its address, `#play/bow`, its card opening the story and telling the free-tile rule by the bow's string. Then Valentine's own tiles: hearts, Cupid's arrows and valentines sealed in their envelopes; a bumblebee, a barn owl, a teddy bear and a kitten, for four valentines' puns; a box of chocolates, a love potion and a lace valentine; love's flowers and candy hearts; and a broken heart for lost souls. Then its music, chosen over Elgar's Salut d'Amour: Liszt's Liebestraum on a harp in a drawing room, a note a match over its bass, the theme's last line for a chapter cleared and its whole second time when the question is answered; love letters shuffled for a shuffle, a kiss blown for a hint, a box of chocolates opened for a treat, and a heart breaking when no pairs are left. Then the second board, love at first sight (`#play/heart`): a heart pierced by Cupid's arrow, 92 tiles on three layers, its arrow sticking out at both ends, and Cupid's arrows: as the board starts and every eight matches his arrow strikes a couple, two tiles of a kind, smitten, to take together before the next flies, for love at first sight; one taken with another tile breaks a heart. Every couple can be had, as the hints' way takes it in time, and following the hints takes all six.

**Wed 18 Nov:** The holidays made simpler. The menu is the holidays, all twelve, to choose one, those not open greyed out with the day they open, or soon, and the turtle; choosing one goes back to its board in progress, or lists its boards, those reached so far, to choose one, and giving a board up lists them again. The card to choose which holidays to play, Your holidays and the cards of holidays not yet open are gone, and the game opens on the board left on the table. Then Thanksgiving's own music, as Halloween has Bach's Toccata on a pipe organ: a banjo in a farmhouse parlour playing "Over the River and Through the Wood" a note a match, and its last line over a guitar's oom-pah for a cleared board; "We Gather Together" on a parlour reed organ when the week is seen through; and autumn leaves for a shuffle, a handbell for a hint, the dinner triangle for a treat, and a turkey's gobble when no pairs are left. Then Christmas's: a music box by the fireside playing "The Twelve Days of Christmas", the fifth verse a note a match and the verse of its day for a cleared board, the twelfth whole with the church bells when Twelfth Night is cleared, and sleigh bells for a shuffle, a silver bell for a hint, a present unwrapped for a treat, and a lump of coal when no pairs are left. Then New Year's: a piano in a ballroom playing "Auld Lang Syne", a note a match and the chorus's last line for a cleared board, the whole chorus with party horns and cheering when the countdown is seen through, midnight's fanfare on brass, and a party horn for a shuffle, a champagne glass for a hint, a cork popping for a treat, and a party horn running out of breath when no pairs are left. Then Groundhog Day's: Vivaldi's Four Seasons on a harpsichord, Spring's tune a note a match, and for the board cleared, as the groundhog forecasts, Spring's opening for an early spring or Winter's shivering strings for six more weeks of it; the groundhog digging for a shuffle, a cardinal's whistle for a hint, a candle lit for Candlemas for a treat, and the groundhog seeing his shadow when no pairs are left. Every holiday whose boards are made now has its own music. Then Valentine's Day's boards planned and drawn, each checked by the engine and dealt in a phone's space: Cupid's bow first, the gentle start, then the pierced heart with Cupid's arrows, the envelope with sweethearts, a vase of roses in bloom, dinner by candlelight, a box of chocolates to savour one at a time, an X and an O for XOXO, and the ring.

**Tue 17 Nov:** Groundhog Day, the fifth holiday ready to play, and the one open all year, every year: the board of the day, a groundhog peeking out of his burrow, dealt from the date so everyone has the same board each day, played again and again until it goes just right, with the best today, the days in a row cleared and the week's days on its card, and the groundhog's forecast as it's cleared, an early spring under par or six more weeks of winter. Then Groundhog Day's own tiles: burrows, candles for Candlemas and scrolls; four weather prophets, the groundhog in his top hat, a hedgehog, a badger and a bear; the sun, a weather vane and a cloud; spring flowers and songbirds; and his shadow, which the turtle wears too while Groundhog Day is the holiday chosen. Then bigger tiles on a phone: the board fills the space it has but for 2px round it, a twentieth bigger on a phone held upright, and the turtle swims up the screen there, the full set of 144 nine across on six layers, its tiles 39px wide on a Galaxy S25+ against the classic's 23, which a wider screen still deals. Then Valentine's Day planned as a love story: eight boards from love at first sight to be mine, a heart pierced by Cupid's arrow, a valentine in its envelope, dinner by candlelight, a box of chocolates, a dozen roses, hugs and kisses, Cupid's bow and a diamond ring, the last turning over halfway as the question is popped, with broken hearts for lost souls. Then a twelfth holiday, for April into May, when none fell: April Showers, a season from April 1 to May 31, opening on March 1, on the first card with its boards to come, and planned from the first shower to May Day, eight boards from a rain cloud, an umbrella, rain boots in a puddle and a rainbow to seedlings, a watering can, a flower bed and a May basket, the last turning over from April to May halfway, with wilted flowers for lost souls. Then the holidays of a player who chose all of them grow with the game: April Showers joined theirs if they had chosen all eleven, and the holidays to come will join them too. Then each tile's number moved to its top right corner, the one a taller stack beside it never covers, where in the top left one tile in six on a phone had its number partly hidden, and the twists' badges moved to the top left, clear of it.

**Sat 14 Nov:** New Year's ninth board, the 2, a toast for two: two glasses of champagne gliding toward each other along the 2's stroke, a place with every match unless a tile lies in their way, and clinking as they meet, a toast worth more the sooner. Its board was drawn again for it, a tile on every other place of the way between rails, and dealt so the way can be cleared from the start. And the tenth, the 1, midnight: the full set of 144 tiles on a bold 1, turning over halfway as the ball lands and the clock strikes twelve, a tile left without a partner a sleepyhead who missed it. All ten boards of the countdown are made. Then New Year's Day after them, the morning after: a calendar turned to January, with a resolution to keep, six sweets to leave alone through January's 31 matches. Then New Year's in the menu, the fourth holiday ready to play, opening on December 1st: its card lists the countdown's ten boards and New Year's Day, reached in turn, with the ball on its pole beside them, dropping a notch with each board cleared and landing at midnight on the 1, the year lit beneath it. Then New Year's own tiles: clocks at five to midnight, party horns and calendar pages; Father Time, Baby New Year, a night owl and a polar bear; a party hat, champagne and New Year's ball; lucky charms and the seasons of the year to come; and sleepyheads for midnight on the 1, which the turtle wears too while New Year's is the holiday chosen.

**Fri 13 Nov:** Christmas's seventh day, seven swans a-swimming: a swan on a still lake, mirrored in it, with seven swans, each a tile and its own reflection. And the eighth's, eight maids a-milking: a milk pail, with eight pails of fresh milk to dig out before they sour. And the ninth's, nine ladies dancing: a dancer mid-twirl, the free tiles changing partners every nine matches. And the tenth's, ten lords a-leaping: a crown, with ten lords free wherever they are. And the eleventh's, eleven pipers piping: bagpipes, whose pipers lead the rest of their kind out from wherever they are. And the twelfth's, twelve drummers drumming: a drum, turning over halfway on Twelfth Night. All twelve days are made. Then the twelve days in the menu, the third holiday ready to play, opening on December 1st: Christmas's card lists the twelve days, reached in turn, with their best scores and the Christmas score, made with Thanksgiving week's card as runs of days. A card opened over a day just dealt now offers to go on to it. Then Christmas's own tiles: ornaments, candy canes and presents, the song's four birds, the stocking, the tree and the snowman, Christmas's plants and snowflakes, and lumps of coal for Twelfth Night, which the turtle wears too while Christmas is the holiday chosen. Then New Year's, planned as the countdown: ten boards from 10 to 1, each shaped as its own number, the ball dropping a notch with each, and midnight when the last is cleared. The first is made, the 10, the gentle start. And the second, the 9, with fireworks: nine rockets, each lighting up the tiles round it as it bursts, and two lit tiles taken together a lit pair. And the third, the 8, with the disco ball, its beam sweeping down the board a row with every match, and a pair taken in it dancing in the spotlight. And the fourth, the 7, with the balloon drop: a net opening every seven matches, three balloons dropping onto free tiles alone of their kind, to pop before it opens again; then the balloon drop moved to the fifth, the 6, every six matches, and the 7 became a lucky seven, a lucky coin hidden in one of its tiles, each pair saying how close it came, hot, warm or cold, and the coin worth more the sooner its tile comes free. And the sixth, the 5, with sparklers: five of them, each lighting as its tile comes free and burning down over five matches, worth the more the sooner it's taken. And the seventh, the 4, with confetti: every tile with a fleck of one of four colours, and a couple of each kind, taken together, a perfect match. And the eighth, the 3, with shooting stars: a star crossing a row every three matches, and a pair taken from it making a wish.

**Thu 12 Nov:** Thanksgiving week in the menu, the second holiday ready to play: its card lists the eight days, reached in turn, with their best scores, and the week's board in play is kept beside the night's. Then Thanksgiving's own tiles, the harvest and the feast, which the turtle wears too while Thanksgiving is the holiday chosen. And each holiday opens weeks before its day, to build up to it, and stays open to the end of the year. And Groundhog Day joins the holidays, the one open all year, every year. Then Christmas, planned as the Twelve Days, one board for each gift of the song: the first day's is made, a partridge in a pear tree, and the second's, two turtle doves on a heart, with lovebirds, and the third's, three French hens, with eggs that hatch as they come free, and the fourth's, four calling birds, where birds of a feather flock together, and the fifth's, five gold rings, each turning to gold once its tiles are all taken, and the sixth's, six geese a-laying, whose goslings follow in a line.

**Wed 11 Nov, evening:** Thanksgiving week planned as eight boards, from the first Sunday, traffic, to the second, the Sunday Scaries. Monday's is made: the frozen turkey, and with it the Frozen twist. So is Tuesday's: the grocery run, on a shopping cart, with the shopping list. And Wednesday's: Friendsgiving, at the potluck table, with friends' gifts. And Thursday's: the feast, with the fridge for leftovers and the nap after. And Friday's: Black Friday, on a sale tag, with doorbusters to race other shoppers for. And Saturday's: rivalry football, on a football, with touchdowns from end zone to end zone. And the first Sunday's: traffic, on the highway, the week's gentle start with no twist. And the second Sunday's: the Sunday Scaries, on an alarm clock, turning over to Monday at sundown. The week's eight boards are all made.

**Wed 11 Nov:** forked from Boneyard Mah Jong. The ten holidays, the card to choose them on a first visit, Your holidays in the menu, and each holiday's colours, sky and lettering. Halloween plays as the Long Night, and the other nine say their boards are on their way. Online the same day, at https://swilliamson24060.github.io/seasons-mahjong/, beside Boneyard, which stays a game of its own, and with a leaderboard in a Firebase project of its own.

## Parked for later

- **Spreading curse**: a curse creeps from tile to tile until you clear a pair beside it.
- **Masquerade**: tiles in costume show another tile's face until they're free and you touch them.
- **Night of the Living Tiles**: endless; tiles climb out of the graveyard in pairs.
- **Duel**: you and a ghost take turns on the same board.
- **Daily deal**: one deal a day, the same for everyone, with a result line to share.
- **Candlelight** was turned down: a dark board would irritate more than it scares.
