# Seasons Mah Jong: plan

Mah Jong solitaire through the year: boards for each of the year's holidays and seasons, of which each player plays the ones they choose. It was forked from Boneyard Mah Jong, the Halloween game, on Wednesday 11 November 2026, and Boneyard's Long Night is its Halloween. Boneyard's own plan, in its repository and in this one's history, gives the reasons for everything that came from it.

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
| Thanksgiving | the fourth Thursday in November | squash, on brown | next |
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

## Still Boneyard's

- The icon, the cover and the screenshots: Halloween's jack-o'-lantern and tiles.
- The colour a phone gives the page and the installed app: Boneyard's purple.
- The leaderboard: off until Seasons has a Firebase project of its own.
- Online: Seasons wants a GitHub repository of its own, with Pages, at https://swilliamson24060.github.io/seasons-mahjong/.

## What came from Boneyard

- Classic Mah Jong solitaire on the 144-tile set, with deals that can always be won, made by playing a game in reverse; hints, a safe shuffle, and undo; a solver that checks it all.
- Halloween's Long Night: thirteen boards from 6 pm to 6 am, with Ghosts float, Treats and Midnight, when the tiles turn over. The classic turtle too.
- Scoring: 10 a pair, 250 for clearing a board, 2 for every second under par, 100 off for a shuffle and 25 for a hint.
- For tired eyes and small screens: a tile held up close above the finger, the blocked tiles dimmed, and big corner numbers. A word on every button, and a pause that hides the board.
- Plain HTML, CSS and ES modules, with no build step and no libraries; offline play, and installing as an app; a zip, a cover and screenshots for itch.io; and a leaderboard in Firebase.

## Milestones

**Wed 11 Nov:** forked from Boneyard Mah Jong. The ten holidays, the card to choose them on a first visit, Your holidays in the menu, and each holiday's colours, sky and lettering. Halloween plays as the Long Night, and the other nine say their boards are on their way.

## Parked for later

- **Spreading curse**: a curse creeps from tile to tile until you clear a pair beside it.
- **Masquerade**: tiles in costume show another tile's face until they're free and you touch them.
- **Night of the Living Tiles**: endless; tiles climb out of the graveyard in pairs.
- **Duel**: you and a ghost take turns on the same board.
- **Daily deal**: one deal a day, the same for everyone, with a result line to share.
- **Candlelight** was turned down: a dark board would irritate more than it scares.
