# Seasons Mah Jong: plan

Mah Jong solitaire through the year: boards for each of the year's holidays and seasons, of which each player plays the ones they choose. It was forked from Boneyard Mah Jong, the Halloween game, on Wednesday 11 November 2026. Boneyard goes on as a game of its own, and its Long Night is Seasons' Halloween too, so the two games both have it. Boneyard's own plan, in its repository and in this one's history, gives the reasons for everything that came from it.

## The holidays

| Holiday | When | Opens | Its colours | Its boards |
|---|---|---|---|---|
| New Year's | January 1 | December 1 | gold, under a midnight blue | next |
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

Themed levels for the nine holidays still to come. For each, to decide:

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
- Christmas's own tiles are to come, as Thanksgiving's are its own; until then its boards wear Halloween's. The ideas so far: ornaments, candy canes and wrapped presents for the three suits, the song's four birds for the monsters, poinsettia, holly, mistletoe and Christmas rose for the flowers, and a lump of coal for the lost soul.
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
- It is told in its own words (main.js): the clock counts down to Twelfth Night (🌟 3 to Twelfth Night), and then shows it (🎭); the lost souls are lumps of coal (🪨), and the score says "Twelfth Night with no coal", or counts the lumps. Until Christmas's own tiles are drawn, coal looks like Halloween's lost soul; their plan already has a lump of coal for it.
- Every deal can be won in its own order through the turn, meeting no coal, and the hints find a way through from a move of the player's own.

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

**Fri 13 Nov:** Christmas's seventh day, seven swans a-swimming: a swan on a still lake, mirrored in it, with seven swans, each a tile and its own reflection. And the eighth's, eight maids a-milking: a milk pail, with eight pails of fresh milk to dig out before they sour. And the ninth's, nine ladies dancing: a dancer mid-twirl, the free tiles changing partners every nine matches. And the tenth's, ten lords a-leaping: a crown, with ten lords free wherever they are. And the eleventh's, eleven pipers piping: bagpipes, whose pipers lead the rest of their kind out from wherever they are. And the twelfth's, twelve drummers drumming: a drum, turning over halfway on Twelfth Night. All twelve days are made. Then the twelve days in the menu, the third holiday ready to play, opening on December 1st: Christmas's card lists the twelve days, reached in turn, with their best scores and the Christmas score, made with Thanksgiving week's card as runs of days. A card opened over a day just dealt now offers to go on to it.

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
