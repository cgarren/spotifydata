# Spotify Data

A web interface for getting song data through the Spotify API, plus much more!

## Website Link
[spotifydata.com](https://spotifydata.com/)

## TODO
### General
* ~~Convert to pure javascript~~
* ~~Style login page~~
* ~~Make some javascript to deploy navbar html across all pages in common.js~~
* ~~Stop using the url to keep params (store locally then clear url for other things)~~
* ~~Add Logout button (clears tokens and such)~~
* ~~Add footer to index page~~
* Simple about page maybe with venmo/donation button
* ~~Make the 404 page appealing~~
* Make a Spotify/Music Data FAQ page (with most popular searches taking into account SEO)
* Make pages more static/template based for SEO
* Create sitemap and submit to search console
* Put in alt text for all images
* Add title tags and meta descriptions (150-300 characters) to all pages and optimize them
* Figure out url stuff so a user can authenticate from google and go right to a certain page
* Recommend one song per day (could be history blind), curated by me - "Song of the Day"
* Make a song comparison page
* Song Battles? Picking higher song in categories minigame?
* Change song info page to be more appealing, possiblly toogle for cards/stats
* Add a charts page which lista spotify/billboard/genius/itunes/apple music/etc charts and combines them into a master chart (there is a playlist for the billboard hot 100)
* Add a way to see you top saved artists and albums-Maybe like a top 5 thing or just the most saved of each in the stats sidebar
* Add a proprietary playlist, artist, track, or user "score" that combines all of the availiable data-maybe multidimenstional, like a picture or something?
* Personaliy Guesser or something fun like that


### Feedback
* add a way to see how many songs you have saved from a particular artist
* add more stats to pages with sidebars
* generate Beat/Bar/Tatum graph for each searched song
* make it so that logout presents the option to sign in with a new account (probably need localstorage or cookie)
* add a lil more flair to the site, its pretty dry mostly in content but also in graphics

### Song Info Page
* ADD A WAY TO SEARCH BY TRACK DATA!!! (If possible)
* Make numbers in chart easier to read and understand
* ~~Add a 30 sec preview to track data page using preview_url field~~
* ~~Add album art~~
* Generally make the page more appealing-Maybe put in moving/stationary emotes for categories with cards (dancing, happy, speech, loudness) -Maybe toggle between stats view and visually appealing emote view?
* Add to queue button for song
* Lyrics on page/link to them (Musixmatch api integration? Possibly a widget? Genius lyrics/facts about the song?)
* Move from artist genres to album genres for more precision-NOT FEASABLE RIGHT NOW

### Account Stats Page
* Account Info (minutes listened/tracks played/time of day most active?, number of playlists, avg number of songs per playlist?, ~~popularity of top artists~~, ~~add time range slider/button group!!~~)
* Top Artists/Top tracks
* Recently Played
* Followers
* Playlists/Library (Click on a a playlist or library to get stats on it- genre %, avg duration, tempo, valence, etc..., Add in a way to reorder based on attributes)
* Reccomendations
* Insights (like Spotify.me, deeper than just stats, perhaps observations about general listening, reccomendations on how to use spotify better, listen better)
** Maybe merge insights and account info, and give top artists/tracks their own page

### New Music Page (filter by user's top artists, maybe a "for you" tab-ML?, using Spotify rec's?)
* New Singles
* New Albums
* Sort new/popular/playlist/library music by attributes (find the most danceable tracks, see which tracks were mastered the loudest, find out which songs are in the key of C, etc...)

### Small link to other cool Spotify sites (at bottom of page)
* Kaleidosync

### Queue Manager
* Ability to save current/different queues and batch add songs to queue
* Probably not possible or useful with the current API implementation

## Author
* Cooper Garren

## License
* This project is distributed without a license. If you would like to use some of its code, please contact the developer.

## Acknowledgments
* Thanks to everyone at Spotify and Bootstrap for the great documentation
* Thanks to Google fonts for the awesome landing page and navbar font
* Thanks to Bootstrap Table for the playlists analytics tables
