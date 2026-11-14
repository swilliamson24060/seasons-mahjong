# Seasons Mah Jong: plan

Mah Jong solitaire through the year: boards for each of the year's holidays and seasons, of which each player plays the ones they choose. It was forked from Boneyard Mah Jong, the Halloween game, on Wednesday 11 November 2026. Boneyard goes on as a game of its own, and its Long Night is Seasons' Halloween too, so the two games both have it. Boneyard's own plan, in its repository and in this one's history, gives the reasons for everything that came from it.

## The holidays

| Holiday | When | Opens | Its colours | Its boards |
|---|---|---|---|---|
| New Year's | January 1 | December 1 | gold, under a midnight blue | the countdown's ten boards and New Year's Day, in the menu |
| Groundhog Day | February 2 | all year, every year | ice blue, on a winter sky | next |
| Valentine's Day | February 14 | February 1 | pink, on deep rose | next |
| Start of Spring | March 20, the usual day of the equinox | March 1 | leaf green, on deep green | next |
| Summer Beach Season | Memorial Day to Labor Day | May 1 | sun yellow, on sea blue | next |
| Independence Day | July 4 | June 1 | red, on navy | next |
| Labor Day | the first Monday in September | August 1 | amber, on slate | next |
| Start of Fall | September 22, the usual day of the equinox | August 1 | orange, on russet | next |
| Halloween | October 31 | October 1 | Boneyard's orange, on purple | the Long Night: thirteen boards |
| Thanksgiving | the fourth Thursday in November | November 1 | squash, on brown | Thanksgiving week: eight boards, in the menu |
| Christmas | December 25 | December 1 | red, on pine green | the Twelve Days: twelve boards, in the menu |

## Choosing them

- On a first visit a card asks which to play: all eleven, in the order they come round from today, each with its date, as many as the player likes. Start waits until one is chosen, and All of them chooses every one.
- Then the game opens the soonest of those chosen that is open, or of those whose boards are made, or if none are, the soonest of all.
- From then on the menu opens the holiday chosen last. Your holidays lists the player's own, in the order they come round, with those still to come marked soon. Any of them opens from there, and Change your holidays brings back the first card.
- A holiday whose boards aren't made yet has a card of its own, in its own colours, saying when it falls, with the holidays open and the turtle to play until its boards come.
- The cards for choosing wear Seasons' own look, a plain gold, rather than any one holiday's.

## When they open

- The games build up to each holiday, so each opens weeks before its day, on the first of a month (the table above), and stays open to the end of the year. With the new year every holiday closes again, until its opening day comes round. New Year's opens on December 1st for the year to come, so it closes as that year begins. Groundhog Day, the day that keeps coming round, is the one holiday open all year, every year.
- Until a holiday opens, Your holidays says when it will, and its card does too, in its own colours, with the holidays open meanwhile and the turtle. Its boards can't be played, from the menu or by their address, which deals a turtle instead; the turtle is always there.
- Out of season, the page opens on the board played freely, or a turtle, under the card of the holiday chosen last.
- Progress, best scores and the boards in play are kept through the new year, for when each holiday opens again.
- `?date=2027-03-01` on the game's address plays it as though it were that day, to try the holidays opening and closing.

## A holiday's look

- Its colour is the accent, for titles and buttons; its sky goes behind the board, and tints the cards; and its lettering is its titles' type. Halloween keeps Boneyard's Creepster, and the others share Fredoka, a rounder hand.
- The Long Night always wears Halloween's look, with each hour's own sky. The turtle wears the holiday chosen last, its tiles too: Halloween's while that holiday's own are still to come.
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
- The week's board in play is kept, as the night's is, so a player can go between the week, the Long Night and the turtle without losing any of them. A reload opens on the holiday chosen last: the week's board in play, or its card.
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

### The first Sunday

- The gentle start, as the Long Night's 6 pm is: the week's fewest tiles, 32 of them free from the start, and no twist. Its card tells the free-tile rule as traffic: a tile can pull out only when nothing is on it and its lane is clear at one end.
- It plays from Thanksgiving week's card in the menu, and freely by its address, `#play/highway`.

### Frozen

- Some tiles start frozen. A frozen tile can't be taken, even when nothing holds it, until enough matches have been made to thaw it. Its face shows through the ice, so nothing is hidden, and its corner shows the matches still to make.
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
- The twelve days' board in play is kept beside the week's and the night's. A reload opens on the holiday chosen last: its board in play, or its card, which offers the day reached next. Before December 1st, Christmas's card says when its boards open, and its boards' addresses deal a turtle; `?date=2026-12-01` on the address plays the game as of that day.

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
- Each glass is a champagne flute, standing at the top right of its place as a tile's badges sit, so the tile under it still shows, and gliding on as its way clears. As they meet, the two tilt together and clink, with a 🥂 rising, a high ringing clink and a fizz, and stay so. The top bar counts the places still between the glasses (🥂 29), and says cheers once they've met. An undo takes back a toast, and parts the glasses again.
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
