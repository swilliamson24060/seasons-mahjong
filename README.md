# Seasons Mah Jong

Mah Jong solitaire through the year, with boards for the holidays and seasons each player chooses. It began as a fork of Boneyard Mah Jong, the Halloween game, which goes on as a game of its own; Boneyard's Long Night is Seasons' Halloween too, and the other holidays' boards come next. [PLAN.md](PLAN.md) has the design and what is still to do.

## Run it locally

ES modules need a web server (opening the files from the file system will not work):

```bash
python3 tools/serve.py
```

Then open http://localhost:8790 to play. `tools/serve.py` serves this folder with caching turned off, so a reload always picks up edited files. It takes another port too, to run beside Boneyard (`python3 tools/serve.py 8791`), and `python3 -m http.server` works as well.

## The holidays

| Holiday | When | Opens |
|---|---|---|
| New Year's | January 1 | December 1 |
| Groundhog Day | February 2 | all year, every year |
| Valentine's Day | February 14 | February 1 |
| Start of Spring | March 20 | March 1 |
| Summer Beach Season | Memorial Day, the last Monday in May, to Labor Day | May 1 |
| Independence Day | July 4 | June 1 |
| Labor Day | the first Monday in September | August 1 |
| Start of Fall | September 22 | August 1 |
| Halloween | October 31 | October 1 |
| Thanksgiving | the fourth Thursday in November | November 1 |
| Christmas | December 25 | December 1 |

- On a first visit the game asks which to play, as many as you like, from a card that lists all eleven in the order they come round from today, each with its date. Start waits until one is chosen, and All of them chooses every one.
- The menu (☾) opens the holiday chosen last. Your holidays, on its card, lists the ones you chose, to go to any of them, and Change your holidays brings back the first card.
- Each holiday has its own look: its colour, its sky, and its lettering, with Halloween keeping Boneyard's. While the Long Night is on the table the page wears Halloween's, and the turtle wears the holiday chosen last, tiles and all. The cards for choosing wear Seasons' own gold.
- Halloween's, Thanksgiving's and Christmas's boards are made: the Long Night, Thanksgiving week, and the Twelve Days of Christmas. The other holidays' cards say when they fall and that their boards are on their way, with the holidays open and the turtle to play until then.
- Each holiday opens weeks before its day, to build up to it, and stays open to the end of the year; Groundhog Day alone is open all year, every year. With the new year every holiday closes again, until its opening day comes round. Until a holiday opens, Your holidays and its card say when it will, and its boards can't be played, from the menu or by their address. The turtle is always there. Progress and best scores are kept through the new year.
- `js/themes.js` holds the eleven: their icons and colours, when each falls, worked out for any year, as Thanksgiving, Labor Day and the beach season move, and when each opens.

## Playing

- Halloween's Long Night is thirteen boards, one an hour from 6 pm to 6 am. Each hour says what is new before it starts, and every hour reached can be played again from the Long Night's card. The board in play is kept as you go, so closing the page loses nothing.
- The Long Night's card goes to the turtle and back: Play the turtle, and Back to the Long Night. The board in play in each is kept, so going to one never loses the other. Give up this board deals the board in play again, and anything that would throw away a board with moves on it asks first; choosing the hour you are playing just goes back to it.
- Take two free tiles that match. A tile is free when nothing lies on it and its left or right side is open. The blocked tiles are dimmed, so that only the free ones need looking over (the switch for it is under each holiday's card in the menu), and each tile's number or letter is printed big in its corner, as on a playing card, with the drawing beside it, to read at a glance without counting eyes or bones.
- Hold a tile to see it up close, above your finger, and slide to look at the tiles around it. On a phone this is on from the start; the switch under each holiday's card turns it on or off on any screen.
- Pause (P) stops the clock and hides the board until you come back, and the game pauses by itself when you leave it for another app or tab. Whenever the clock is stopped on a board not yet cleared, behind the menu or an hour's first card as well, the board is hidden, so that no one can study it for nothing.
- Undo (U), Hint (H), Shuffle (S), Pause (P), sound on and off (M). Arrow keys move between free tiles, and Enter takes one. Every button has a word as well as its icon: beside it on a wide screen, under it on a phone.
- Each pair is worth 10 points and a cleared board 250, with 2 more for every second under par. A shuffle costs 100 and a hint 25; treats and undo are free. Turning over at midnight without a lost soul earns 150, and each lost soul costs 10. `js/score.js` holds the numbers.
- From midnight the tiles turn over partway through each board. Hold the moon button or Space to see the night side. A tile held up close shows its night side beside it, or with the magnifier off, turns over while you hold it. Pairs that match on both sides are the ones to take before midnight.
- Pairs of jack-o'-lanterns leave treats, whose buttons say what they do: a candle is a free hint, a skeleton key unlocks one blocked tile (press Unlock, then the tile), and a black cat is a free shuffle. A treat you have none of says what it does when you tap it.
- Thanksgiving week is eight boards, from the Sunday before Thanksgiving to the Sunday after. Thanksgiving's card in the menu lists them in order: each day you reach can be played again, and clearing a board opens the next. The week's board in play is kept, as the night's is, so going to the night or the turtle loses nothing. Each day's board also plays freely by its address: `#play/highway`, `#play/turkey`, `#play/cart`, `#play/potluck`, `#play/feast`, `#play/sale`, `#play/football` and `#play/alarm`.
  - On the first Sunday's, the jammed highway, there is no twist: the gentle start, its card telling the free-tile rule as traffic.
  - On Monday's, the frozen turkey, a frozen tile can't be taken until enough matches thaw it: its face shows through the ice, with the matches still to make in its corner, and the turkey thaws from the outside in.
  - On Tuesday's, the shopping cart, the list has four things to find, shown in the top bar, with a price tag on each tile of them. A pair of each, taken before checkout halfway through the board, crosses it off: 25 points each, and 100 more for the whole list.
  - On Wednesday's, Friendsgiving's potluck table, each pair of a dish (a turkey, green beans or mashed potatoes) leaves a gift: a friend's tip (a free hint), a saved seat (frees a blocked tile) or musical chairs (a free shuffle).
  - On Thursday's, the feast table, the fridge in the bottom bar has three containers for leftovers. A free tile and then a container saves the tile for later: off the table, it holds nothing down, and it still matches its partner whenever that's free. Everything in the fridge has to be eaten by the end. Halfway through, everyone naps, and the clock stops for the next 10 matches.
  - On Friday's, Black Friday's sale tag, four pairs are doorbusters, with a red % tag: a pair taken with one in it is yours, for 50 points. After every 5 of your matches, another shopper grabs the first doorbuster that's free. The top bar's Deals row keeps count.
  - On Saturday's, rivalry football's football, the field runs from the end zone at the top to the one at the bottom, their tiles carrying blue and red pennants. A pair taken with a tile in each end zone is a touchdown, for 60 points.
  - On the second Sunday's, the Sunday Scaries' alarm clock, the sun goes down halfway through and every tile turns over to its Monday side, as the Long Night's do at midnight: hold the moon to see Monday coming, and take pairs that match on both sides. A tile left without a partner wakes as a worry, and worries match each other.
- The week's tiles are Thanksgiving's own, matching just as Halloween's do: cranberries, corn and leaves for the three suits, the harvest's apple, gourd, acorn and pinecone, the turkey, green beans and mashed potatoes, autumn flowers and pies, any two of which match as any two flowers or moons do, and worries for lost souls. They are the week's wherever its boards are played, and the Long Night keeps Halloween's. The turtle, and any other board played freely, wears the tiles of the holiday chosen: Thanksgiving's for Thanksgiving, and Halloween's for the rest until their own are made. Choosing another holiday with the turtle on the table changes its tiles with its colours, and a turtle cleared goes back to the holiday's boards: the week's, or the Long Night.
- Christmas is the Twelve Days: twelve boards, one for each gift of the song, from a partridge in a pear tree to twelve drummers drumming, opening on December 1st. Christmas's card in the menu lists them in order, as Thanksgiving's does the week: each day you reach can be played again, clearing a board opens the next, and the bests add up to a Christmas score. The twelve days' board in play is kept beside the week's and the night's. Each is shaped by its gift, and they grow through the twelve days, as the song does, from 80 tiles to 128; each also plays freely by its address while Christmas is open. Until Christmas's own tiles are drawn, its boards wear Halloween's.
  - On the first day's, a partridge perched at the top of a pear tree (`#play/peartree`), there is no twist: the gentle start, its card telling the free-tile rule by the pears, which hang free.
  - On the second day's, two turtle doves beak to beak, making a heart (`#play/doves`), every kind of tile comes as two pairs: take a kind's second pair straight after its first, and they're lovebirds, for 30 points. The top bar counts them (🕊️).
  - On the third day's, a French hen sitting on her nest (`#play/hen`), a dozen tiles are still eggs: there's no telling what's inside one until it comes free and hatches. The top bar counts the eggs still to hatch (🥚), and a tile held up close shows only its egg.
  - On the fourth day's, a songbird singing on a branch (`#play/songbird`), birds of a feather flock together: take a pair whose two tiles touch, side by side or one just above the other, for 20 points. The top bar counts them (🐦).
  - On the fifth day's, five rings linked as the five spots on a die are (`#play/rings`), take every tile of a ring, and it turns to gold where it lay, for 50 points: a cleared board shows all five gold rings. It is dealt a ring at a time, so that a ring's tiles mostly match each other, and a ring can be cleared long before the board is. The top bar counts the gold rings (💍).
  - On the sixth day's, a goose sitting on her nest of eggs (`#play/goose`), goslings follow their mother in a line: a pair taken beside or just under the pair taken before it follows on, and six in a line score 60 points. The free tiles a pair could follow on from carry a gosling, and the top bar counts the line so far (🐣).
  - On the seventh day's, a swan gliding on a still lake (`#play/swan`), the bottom half of the board is the top half's reflection, its tiles tinged with blue. Seven tiles match their own reflection, the tile as far below the water as they are above it: take a tile and its reflection together, a swan, for 50 points; take either with another tile, and she swims off. The top bar counts the swans found, out of those found and still to find (🦢).
  - On the eighth day's, a milk pail (`#play/pail`), eight pairs are pails of fresh milk, each tile marked 🥛. Once either of a pail's tiles is free, its milk keeps for eight matches, counted down on both: dig out the other and take the two together while it's fresh, for 40 points. Take either with another tile and it spills; leave it too long and it sours. The top bar counts the pails taken fresh (🥛).
  - On the ninth day's, a dancer mid-twirl (`#play/dancer`), every nine matches the music changes: each free tile dances off with a tile still held down, and they change places, twirling, so tiles held down come free and the pairs that were free go back under. The board is always left so it can be won. The top bar counts down to the next change (💃).
  - On the tenth day's, a crown (`#play/crown`), ten tiles are lords, gilded and crowned 👑: a lord is free wherever he is, under other tiles or hemmed in, and goes with any free tile of his kind. Take one while he's still held down, and he's leapt, for 20 points; or keep him to get out of a tight spot. The top bar counts the lords still on the board (👑).
  - On the eleventh day's, a set of bagpipes (`#play/bagpipes`), eleven tiles are pipers, tinged green and marked 🎶. Take a piper with a tile of his kind, and he plays: the rest of his kind still on the board follow him out, from wherever they are, buried or not, for 15 points each. The top bar counts the pipers still on the board (🎶).
  - On the twelfth day's, a drum with its sticks crossed above it (`#play/drum`), it's Twelfth Night: halfway through, the drummers drum and every tile turns over, as the Long Night's do at midnight. Hold the moon to see the other side coming, and before then take pairs that match on both sides: a tile left without a partner turns to coal, and coal matches coal (🪨).
- Any board can also be played freely by address: `#play/turtle` for the classic turtle, or `#play/raven/12345/40` for the raven, dealt from seed 12345, turning over after 40 matches. A new deal (N) deals it again. The board played freely is kept like the night's, so a reload goes on with it, and a Thanksgiving or Christmas day's board plays by its day's rules. A holiday's board plays by address only while the holiday is open; before then, its address deals a turtle. A holiday whose boards are still being made plays them by address, to try them.

## The leaderboard

The leaderboard, on the Long Night's card, lists the best scores at each hour, and for the whole night: each player's bests added up. The first time a player clears a board, its card offers to put them on it under a name of their choosing, and from then on their bests go up as they make them. Their name can be changed, or taken off with their scores, from the leaderboard's card. Free play doesn't count. Seasons has a Firebase project of its own, `seasons-mahjong`, as Boneyard's keeps Boneyard's scores; `js/firebase-config.js` names it, and without a project there, the game shows no leaderboard.

Players sign in anonymously, which gives each browser an id of its own and no account to make, and the scores are kept in Firestore, at `boards/{board}/scores/{player}`, one entry a player on each board, holding their best. The game speaks to both through their REST APIs (`js/firebase.js`), so it needs no Firebase library.

[firestore.rules](firestore.rules) says what players may do: anyone may read the boards, and each player may write only their own entries, which can only get better. A score must also be one its board could give at the fastest a hand could clear it, a pair a second, so the rules hold each board's tiles and par; test.html checks them against the game's own, and they need publishing again if the boards change. So far they know only the Long Night's hours: the other holidays' boards will need adding, under names of their own, as they come.

Setting up the project, in the [Firebase console](https://console.firebase.google.com), takes five steps. The console's menus move about, but within a project its address is `console.firebase.google.com/project/<project id>/...`, and the pages below can be reached by changing the end of it:

1. Create a project. Google Analytics isn't needed, and the free plan is plenty.
2. Authentication (`authentication/providers`): Get started, then under Sign-in method turn on Anonymous. Leave its automatic clean-up off: a player whose anonymous account had been deleted could no longer change their own entries.
3. Firestore Database (`firestore`): Create database, keeping the id `(default)` and the Standard edition, in a location near your players, in production mode.
4. In Firestore Database, under Rules: replace what's there with the whole of `firestore.rules`, and Publish.
5. Project settings (`settings/general`), Your apps: add a Web app (no Firebase Hosting; npm or a script tag, it doesn't matter, as the game uses neither) and copy its `apiKey` and `projectId` into `js/firebase-config.js`. The key begins `AIza`; the `appId` beside it, `1:` and a long number, is something else. Neither is a secret: every web app sends them from the browser, and the rules decide what anyone can do.

## Online

The game lives at https://swilliamson24060.github.io/seasons-mahjong/, served by GitHub Pages from the `main` branch of this repository, as it is: `.nojekyll` keeps GitHub from processing it. Pushing `main` puts a new version online within a minute or two, and players get it the next time they load the game with a network.

Boneyard lives beside it, as a game of its own, at https://swilliamson24060.github.io/boneyard-mahjong/. The two share a site, swilliamson24060.github.io, and with it a browser's storage, so Seasons keeps its saves under names that begin `seasons.` and its offline copy in caches named `seasons-`, and neither game touches the other's.

## On itch.io

`python3 tools/itch.py` bundles the game for itch.io as `dist/seasons-mahjong.zip`: `index.html` at its root, every file the game loads (the list in `sw.js`, with `sw.js` itself) and nothing else. The zip is built, not kept in git, so build it again after a change. On itch.io:

1. Create a new project, with Kind of project set to HTML.
2. Under Uploads, upload the zip, and tick This file will be played in the browser.
3. Under Embed options, a viewport of 960 by 640 suits it, though the game fits whatever size it is given; tick Mobile friendly, and Fullscreen button.
4. Save, and view the page.

`python3 tools/shots.py` makes the page's pictures in `dist/itch/`, from the game as it is, in a few seconds: the cover, 630 by 500 as itch.io asks, and five screenshots, three from a computer and two from a phone. `tools/cover.html` draws the cover from the game's own tiles and lettering, and `tools/stage.html` sets up each screenshot's scene with moves from the game's own winning line, so they come out the same each time, and anew after a change. It needs Google Chrome, which draws the pictures headless (or the `CHROME` variable saying where a Chrome is), and macOS's `sips`, to cut out the phone pictures. For now the pictures are all Halloween's.

There the game plays in a frame in itch.io's page, so it leaves out its service worker: playing offline is for the game at its own address.

## Offline, and on a phone's home screen

Once loaded, the game plays offline: `sw.js`, a service worker, keeps every file it needs, and the fonts. While there is a network it still asks the server for each file, rather than trusting the browser's ten-minute copy, so a new version shows on the next load. A file added to the game must also be added to `FILES` in `sw.js`, with a new name for `CACHE`; the test page checks that nothing is missing. `manifest.webmanifest` lets a phone install it from the browser (Share, then Add to Home Screen, on an iPhone), with its own icon, for now still Boneyard's jack-o'-lantern. `tools/icons.py` draws the icon in plain Python and writes `icons/`: `python3 tools/icons.py`.

## Tests and sheets

- http://localhost:8790/test.html runs the tests in the page, the holidays' dates among them; the tab's title shows the result. Below the results is a dealt turtle drawn plainly, with its free tiles outlined, for checking layouts by eye.
- http://localhost:8790/faces.html shows every face of a set, Halloween's or Thanksgiving's (`faces.html?set=thanksgiving`), by day and by night, and small, at the size of a tile on an upright phone. Its other switch shows them as each kind of colour blindness sees them, or with no colour at all (`faces.html?vision=achromatopsia`): every face reads by its shape alone.
- http://localhost:8790/boards.html shows the thirteen boards of the Long Night, dealt as they will be played.
- `?date=2027-03-01` on the game's address plays it as though it were that day, to see the holidays open and close: http://localhost:8790/?date=2027-10-15 has Halloween open and Thanksgiving still to come, and `?date=2027-03-01` has neither.

## Where things live

- `index.html`, `css/game.css` and `js/main.js`: the page, the buttons and keys, the cards, choosing the holidays and wearing their looks, the clock, the sky, and keeping the night between visits.
- `js/themes.js`: the eleven holidays and seasons, when each falls in any year and when it opens, and their colours.
- `sw.js`, `manifest.webmanifest` and `icons/`: offline play, and installing the game as an app.
- `tools/itch.py`: the zip for itch.io, and `tools/shots.py`, with `tools/cover.html` and `tools/stage.html`, its cover and screenshots.
- `js/night.js`: the Long Night's thirteen hours: each one's board, rules, sky and the words before it.
- `js/thanksgiving.js`: Thanksgiving week's eight days: each one's board, rules, sky and the words before it.
- `js/christmas.js`: Christmas's Twelve Days, as they are made: each one's gift, board, rules, sky and the words before it.
- `js/score.js`: the score for a board, worked out from what the game records.
- `js/leaderboard.js`: the leaderboard's boards, the names it takes, and posting and reading scores; `js/firebase.js` speaks to Firebase, and `js/firebase-config.js` says which project. `firestore.rules` is what Firestore lets players do.
- `js/ui/sound.js`: the sounds, made with Web Audio as they play: the tiles, the organ, the bells.
- `js/ui/board.js`: the board on the page: the tiles stacked in their layers and sized to fit, selecting and matching, peeking, the tiles turning over, the gold rings, and the planchette that points out a hint. Players who have asked their device for less motion get no shaking or turning waves.
- `js/ui/faces.js`: the sets of faces, as SVG symbols, and their names: Halloween's drawn here, in code, one drawing for both sides. `js/ui/thanksgiving-faces.js` draws and names Thanksgiving's, and `js/ui/draw.js` holds what both draw with: the colours that change by night, and where the pips and sticks stand. `js/ui/faces.js` also draws the egg a tile hides in, on the hens' board.
- `js/ui/magnifier.js`: a held tile up close, above the finger that would hide it, with the side it will turn to.
- `js/engine/tiles.js`: the 42 faces, which of them match, and the pairs a deal is made from.
- `js/engine/layout.js`: reading a layout drawn as text, and the free-tile rule. `layouts.js` holds the layouts themselves.
- `js/engine/deal.js`: dealing so that every board can be won, and the safe shuffle; a board can ask for some tiles to be dealt first, as the gold rings are, a ring at a time, the swans, each with her reflection, and the milk pail's pails, two tiles just come free.
- `js/engine/solver.js`: finds a winning line, for hints and for checking twists.
- `js/engine/game.js`: one board in play: matching, undo, hints, shuffles, Ghosts float, Treats and the stroke of midnight, when the tiles turn over.
- `js/engine/midnight.js`: which tiles wake as lost souls when the tiles turn over.
- `js/engine/ice.js`: the Frozen twist's ice, and the turkey's, which thaws from the outside in.
- `js/engine/list.js`: the shopping list's things to find, chosen so that the list can always be finished before checkout.
- `js/engine/fridge.js`: the fridge's containers, places added to a board's layout after its tiles, with nothing on them or beside them.
- `js/engine/doorbusters.js`: choosing Black Friday's doorbusters, pairs of the deal's own order, so that a grab never stops a board being won.
- `js/engine/football.js`: the football board's end zones, and which pairs are touchdowns.
- `js/engine/flock.js`: when two tiles touch, for Christmas's birds of a feather.
- `js/engine/rings.js`: the gold rings' tiles, worked out from the square each ring goes round, and dealing their board a ring at a time.
- `js/engine/goslings.js`: when a pair follows on from the pair before it, for Christmas's goslings in a line.
- `js/engine/swans.js`: each tile's reflection in the lake, the swans among the tiles, and dealing the swans so that they come free at different times.
- `js/engine/milk.js`: choosing the milk pail's pails of fresh milk, pairs the deal's own order takes in time, and dealing it so that there are some all through the board.
- `js/engine/dance.js`: the dancer's change of partners, free tiles with tiles held down, tried until the solver finds the board can still be won.
- `js/engine/lords.js`: choosing the crown's lords, tiles held down at the start, each of a kind of his own.
- `js/engine/pipers.js`: choosing the bagpipes' pipers, each from the first pair of his kind the deal's own order takes, so that two can follow him out.
- `js/engine/rng.js`: seeded randomness, so a deal can be made again from its seed.
- `tests/`: the tests, the small runner behind `test.html`, and the plain board drawing.
