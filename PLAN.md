# Seasons Mah Jong: plan

Mah Jong solitaire through the year: boards for each of the year's holidays and seasons, of which each player plays the ones they choose. It was forked from Boneyard Mah Jong, the Halloween game, on Wednesday 11 November 2026. Boneyard goes on as a game of its own, and its Long Night is Seasons' Halloween too, so the two games both have it. Boneyard's own plan, in its repository and in this one's history, gives the reasons for everything that came from it.

## The holidays

| Holiday | When | Its colours | Its boards |
|---|---|---|---|
| New Year's | January 1 | gold, under a midnight blue | next |
| Valentine's Day | February 14 | pink, on deep rose | next |
| Start of Spring | March 20, the usual day of the equinox | leaf green, on deep green | next |
| Summer Beach Season | Memorial Day to Labor Day | sun yellow, on sea blue | next |
| Independence Day | July 4 | red, on navy | next |
| Labor Day | the first Monday in September | amber, on slate | next |
| Start of Fall | September 22, the usual day of the equinox | orange, on russet | next |
| Halloween | October 31 | Boneyard's orange, on purple | the Long Night: thirteen boards |
| Thanksgiving | the fourth Thursday in November | squash, on brown | a week of seven, begun: Monday's to Wednesday's are made |
| Christmas | December 25 | red, on pine green | next |

## Choosing them

- On a first visit a card asks which to play: all ten, in the order they come round from today, each with its date, as many as the player likes. Start waits until one is chosen, and All of them chooses every one.
- Then the game opens the soonest of those chosen whose boards are ready, or if none are, the soonest of all.
- From then on the menu opens the holiday chosen last. Your holidays lists the player's own, in the order they come round, with those still to come marked soon. Any of them opens from there, and Change your holidays brings back the first card.
- A holiday whose boards aren't made yet has a card of its own, in its own colours, saying when it falls, with Halloween's Long Night and the turtle to play until its boards come.
- The cards for choosing wear Seasons' own look, a plain gold, rather than any one holiday's.

## A holiday's look

- Its colour is the accent, for titles and buttons; its sky goes behind the board, and tints the cards; and its lettering is its titles' type. Halloween keeps Boneyard's Creepster, and the others share Fredoka, a rounder hand.
- The Long Night always wears Halloween's look, with each hour's own sky. The turtle wears the holiday chosen last.
- `js/themes.js` works the dates out for any year, as some move: Thanksgiving, Labor Day, and the beach season, from Memorial Day. Spring and fall start on the days the equinoxes fall on most years.

## Next: the holidays' own boards

Themed levels for the nine holidays still to come. For each, to decide:

- **Its boards**: how many, and their shapes. The Long Night has thirteen, an hour each, and keeps its layouts about nine tiles across, for phones held upright.
- **Its tiles**: faces of its own, or Boneyard's suits with its own honours in place of the jack-o'-lanterns, brews and ghosts. A set is 42 faces, drawn in code, each one readable by shape alone, with its big corner index.
- **Its twist, if any**: Ghosts float, Treats and Midnight belong to Halloween, so each holiday could bring something of its own.
- **Its sky through the boards, and its sounds.**
- **Its scores**, and boards of its own on the leaderboard.

## Thanksgiving week

Seven boards, one a day from the Sunday before Thanksgiving to the Saturday after it, each with a theme of its own. `js/thanksgiving.js` holds them.

| Day | Theme | Board | Twist |
|---|---|---|---|
| Sunday | Traffic | to make | |
| Monday | Thawing the turkey | the frozen turkey: 90 tiles on four layers, nine across | Frozen |
| Tuesday | The grocery run | a shopping cart: 94 tiles on four layers, nine across | The shopping list |
| Wednesday | Friendsgiving | the potluck table: a pie, a bowl of stuffing, a casserole and a loaf, 100 tiles on four layers, nine across | Potluck |
| Thursday | to choose | | |
| Friday | to choose | | |
| Saturday | to choose | | |

### Frozen

- Some tiles start frozen. A frozen tile can't be taken, even when nothing holds it, until enough matches have been made to thaw it. Its face shows through the ice, so nothing is hidden, and its corner shows the matches still to make.
- On Monday the turkey thaws from the outside in: its outline is thawed from the start, the next ring thaws after 8 matches, and the middle after 16, of the board's 45.
- A deal plays the board through taking a frozen tile only once it has thawed, so every deal can be won; the hints, the solver and the safe shuffle go by the same rule. An undo freezes the tiles again, and a skeleton key can't thaw ice.
- In trials of 200 deals, the ice doesn't make the board harder by luck: a player taking pairs at random clears it about as often as with no ice. What it changes is the order to play in. At the start, 8 tiles that would be free are frozen, and the outside of the bird has to last until the middle thaws.
- Until the week is in the menu, Monday's board plays by its address, `#play/turkey`, and shows its day's card first. Its tiles are still Boneyard's.

### The shopping list

- The day's card names four things to find. The top bar shows them as small tiles, ticked as each is crossed off, with the matches left before checkout. The tiles of things still to find wear a red price tag.
- Taking a pair of a thing on the list crosses it off, up to and including the match at checkout, halfway through the board: 25 points each, and 100 more for the whole list. Then the list closes. An undo puts a thing back on it.
- Every list can be finished in time: its four things are pairs the deal's own winning order takes before checkout. They are worth looking for, too: none has a pair free from the start, or is taken in the deal's first third of the way to checkout, unless there are too few others. In 300 trial deals, a pair of 0.05 of the four things was free at the start, on average.
- Only things of one face go on the list, not the flowers or the moons, any two of which match, so that what to find is plain.
- Until the week is in the menu, Tuesday's board plays by its address, `#play/cart`, and its card says what is on the list.

### Potluck

- Friends bring dishes to share, and each pair of a dish leaves a gift, as Halloween's jack-o'-lanterns leave treats: a friend's tip shows you a match, a saved seat frees one blocked tile, and musical chairs shuffles the tiles for free.
- The dishes are the three faces that stand where a set's dragons do: until Thanksgiving has tiles of its own, the jack-o'-lantern, the witch's brew and the ghost. An undo never earns a second gift.
- It is the week's breather, between Tuesday's list and Thursday: in 200 trial deals, a board brought 4.2 gifts.
- The gifts are Halloween's treats under other names and icons (💬, 🪑, 🎶), so each board says which set it gives. A Thanksgiving board with no treats has no treat buttons.
- Until the week is in the menu, Wednesday's board plays by its address, `#play/potluck`.

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

**Wed 11 Nov, evening:** Thanksgiving week planned as seven boards, Sunday to Saturday, with Sunday's theme traffic. Monday's is made: the frozen turkey, and with it the Frozen twist. So is Tuesday's: the grocery run, on a shopping cart, with the shopping list. And Wednesday's: Friendsgiving, at the potluck table, with friends' gifts.

**Wed 11 Nov:** forked from Boneyard Mah Jong. The ten holidays, the card to choose them on a first visit, Your holidays in the menu, and each holiday's colours, sky and lettering. Halloween plays as the Long Night, and the other nine say their boards are on their way. Online the same day, at https://swilliamson24060.github.io/seasons-mahjong/, beside Boneyard, which stays a game of its own, and with a leaderboard in a Firebase project of its own.

## Parked for later

- **Spreading curse**: a curse creeps from tile to tile until you clear a pair beside it.
- **Masquerade**: tiles in costume show another tile's face until they're free and you touch them.
- **Night of the Living Tiles**: endless; tiles climb out of the graveyard in pairs.
- **Duel**: you and a ghost take turns on the same board.
- **Daily deal**: one deal a day, the same for everyone, with a result line to share.
- **Candlelight** was turned down: a dark board would irritate more than it scares.
