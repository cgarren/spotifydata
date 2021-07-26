let myData;
let queue;
let printedFinal;
let len;
const problemWords = ["my", "the", "a", "have", "with", "go", "of", "theres", "beat", "long", "at", "or", "sounds", "much", "from", "sea", "their", "hear", "they're", "1", "2", "for", "in", "thinly", "pot", "6", "3/4", "popularized", "industry's", "world", "was"];
const problemObject = {
    "have": "00Q1fquFrPNTkcrY3VzGSm",
    "the": "4EWhpTj7pSMmGQiknjOSId",
    "a": "3zrGJFPXSpE9ekpG4knHYy", //"60gQkLL5WX2urqOfnBjHDn", TENTATIVE
    "with": "048biWppMphHQwmLCBbrUm",
    //"go": "4JNTpbntShpUpACDUzwHV5", //TENTATIVE
    "of": "7jVdlxNeXtMdVcI73wSSyT",
    "beat": "1lEcwPE8bKoPcGbK1CZOpQ",
    "at": "3PVLaswHLHvo3Xd9o2P54a", // "3gnGaqnsk0zFUFWabK2IUw", //TENTATIVE
    "or": "4v7pXozqsnkL2p0wQFvqWN", //MORE HERE
    "sounds": "75Gx0tJTazBdsQwN8ZMmuU",
    "harmony": "0Vki1VRmiN89jLz3mt7pI0",
    "for": "6ureZF1kd0UmAuQY5X13OZ",
    "part": "7AgdONgHOCwprH4NoXSiKa",
    "much": "1dm4Awzgul4CHYTw3P1nJi",
    "from": "5j6NN9cJeiXxWvwJ3zZZnA", //  "11dUub7wvMwyXIYnOhOXQj", //TENTATIVE
    "spark": "2SExrCAWaCYyWNdWvc64PH",
    "blue": "5u3C5LO1dS9wY4GLMUGQxd",
    "sea": "4RKeUgus1oXPf6g2tinJ4Q",
    "smile": "5GBXCkIhahkkSCRYPLc4cT",
    "satisfaction": "7BJ3qurHu5IudPcWWbMNdO",
    "dawn": "5uIGpJFRXbNvCxrnj4IEay",
    "hear": "6hIaXj8l2dspGGlXWNEFBm",
    "1": "18puP4ULysu86YMibg4luP",
    "2": "38VC8Wveo9h9Fw95vcaj4K",
    "3": "0HAC4012yGhwKzhDAmn0st",
    "4": "7tJR5QGRuDGjtxOJQwyVPi",
    "5": "1xKuvRNXQB4iRQispFYBiz",
    "6": "1W2DtJQmNOwMN2SQdGPIYB",
    "7": "2mP4vYhbARSLBjTWZIyNLo",
    "8": "3hGJQx34Vp4UHYyzWORGjj",
    "9": "2dbztJVyI9ieFFlekXDrTg",
    "10": "2YcQ8gq0oYutBywJfN9ldu",
    "slatt": "3u1KDHaSuUSBLvDqQibQq8",
    "promise": "7bC2jwToIEeLizOi6BKjvq",
    "in": "59EPkPU4V65bBSw5Rjnm6h", //  "1y0Kk2sSsQHlrSQyP8o9NE", //TENTATIVE
    "lonely": "2yUmk9h3VAndLt0eM5X4Ou",
    "angles": "3dBUsEiDRrLcNPIel6839J",
    "pot": "0eUakgPxQeG4e6dEZNDCUQ",
    "frontiers": "1TcbN2YLoqzvomr2U1sc66",
    "puffy": "34oYn4RKtIO2LGol9Nt2Tz",
    "medley": "3D27Ynb7HfFHAdWg3s9x44",
    "quicktime": "5rIY1U9yhGtBmHep114sgt",
    "3/4": "3P2JmyNO7hlOd6spRIJdD9",
    "awaits": "23rjqtoKLpuIBKK2G7Midr",
    "world": "1KK070iuoUVsOuHRKu3zh9",
    "cast": "6kLJ3AJURwFGP3punlb5nR",
    "killer": "0FLIBDpU2S5bb6TfMB4NuQ",
    "makes": "3ZhbKJh4l6GLRvbdu1TLeG",
    "me": "4q1xOWmzVMz3NEvzd9MZEk",
    "out": "0T5bSsSwxnuiTWxCPz36gG",
    "what": "1v4c9CkwtIiAih6N0jWabJ",
    "be": "7wRXW2YCMM7SSE0xCV7Rd4",
    "that": "33iUDWa2C1obiOaOjDFV8C",
    "are": "2gupz2r6Gf1nMcWSWNvXpg",
    "am": "77fyDVzU6rUzEgaT0aT3Rh",
    "is": "3LDQ6O78dyUNdSWOjBTO7B",
    "was": "497nFT0FEhPbOpnKl44WMn",
    "and": "2r4yhyNn3UJNkY1ZXnjdXL",
    "to": "2ercIITCpeX6p4JDWlixLD",
    "do": "05MDFYXowUxDjohip1ensI",
    "use": "0ypVEWtrnQQbe7VGtpu3iJ",
    "can": "5eAI8GB4OrH0tUPpDiydvg",
    "so": "7vG69ptFMqKF0kYB5u2SM0",
    "an": "4F7Z0kKQ3SWiQg5yYRIo2y",
    "no": "6Bmukb7aeZh29FJKMLGwK5"
}
const slightProblemWords = [] //["me", "out", "what", "be", "4"]; //greater than 200 tries
const punctuationRemove = [".", ",", "(", ")", "[", "]", "{", "}", "'", "\"", ":", ";", "<", ">", "?", "+", "=", "_", "*", "&", "^", "%", "$", "$", "#", "@", "!", "`", "~", "|"];
const punctuationReplaceWithSpace = ["-"]; // maybe slash?

//TODO: 
// Combine words with the problem list and put hard to find words in an easy acces list
// Make sure we only request once for duplicate words (add another field to the first occurance with the other positions that should be filled?)
// Remove features, anything in parentheses, and anything that's not the song title when comparing to the word including punctuation and newline chracters
// Probably need toggle to ignore punctuation in both the input and songs being compared to OR separate out punctuation
// Probably need toggle to determine whether to try phrases or not
// Could suggest synonyms for some words to help with not found rates

async function init() {
    //$("#userdata_link").addClass("active");
    //$("#userdata_dropdown a:nth-child(5)").addClass("active");
    $("#content")[0].style.display = "block";

    document.getElementById("form").addEventListener('submit', function(e) {
        e.preventDefault();
        //throw new Error('Stopping Javascript execution, ignore this error');
        queue = [];
        myData = [];
        printedFinal = false;
        //console.log(document.getElementById("words").value.split(/\r\n|\r|\n/g).join(" "));
        let input = document.getElementById("words").value.split(/\r\n|\r|\n/g).join(" ").split(" ");
        console.log(input);
        len = input.length;

        let i = 0;
        let j = 0;
        for (word of input) {
            setTimeout(function(i, word) {
                //console.log(word);
                word = replaceCharacters(replaceCharacters(word, punctuationRemove, ""), punctuationReplaceWithSpace, " ");
                // if (problemWords.includes(word)) {
                //     word = "bliu";
                // }
                console.log(word);

                id = {
                    "word": word,
                    "lastOffset": 0,
                    "position": i,
                    "spotifyStatus": "good"
                };
                myData[i] = id;
                spotifyRequest(id);
            }, j, i, word)
            i += 2;
            j += 200;
        }
    }, false);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function sleepms(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function replaceCharacters(str, charList, replacement) {
    for (let i in str) {
        if (charList.includes(str[i])) {
            str = str.substr(0, i) + replacement + str.substr(i + replacement.length);
            i--;
        }
    }
    //let regex = new RegExp(charList.join("|"), "g");
    return str;
}

function removeOtherSongInfo(song) {
    enclosingPunctuation = ["{", "[", "-", "feat", "("];
    for (i in song) {
        if (enclosingPunctuation.includes(song[i])) {
            song = song.substring(0, i);
        }
    }
    return song;
}

function spotifyRequest(id) {
    let url;
    if (id.spotifyStatus == "badRequest") {
        id.spotifyStatus = "good";
        url = "https://api.spotify.com/v1/search?q=" + id.word + "&offset=" + (id.lastOffset - 50) + "&type=track&limit=50";
    } else {
        url = "https://api.spotify.com/v1/search?q=" + id.word + "&offset=" + id.lastOffset + "&type=track&limit=50";
    }
    id.lastOffset += 50;
    if (id.lastOffset < 1000) {
        loadRequest(url, parseSpotifyData, id);
    } else if (id.spotifyStatus == "tryMusicBrainz") {
        //console.log("searching with brainz query:", id.term);
        if (Object.values(myData).length != myData.length) {
            url = "https://api.spotify.com/v1/search?q=" + id.term + "&offset=0&type=track&limit=50";
            id.spotifyStatus = "secondTry";
            loadRequest(url, parseSpotifyData, id);
        }
    } else if (id.spotifyStatus == "secondTry") {
        // No match found on spotify for song/artist after looking through musicbrainz
    } else {
        //console.log('Sorry Spotify!', id.word);
        id.spotifyStatus = "failed";
        id.running = false;
        if (id.word.toLowerCase().trim() in problemObject) {
            myData[id.position + 1] = problemObject[id.word.toLowerCase().trim()];
        } else if (!(problemWords.includes(id.word.toLowerCase().trim()) || slightProblemWords.includes(id.word.toLowerCase().trim()))) {
            console.log("Queued:", id.word);
            queue.push(id)
        } else {
            myData[id.position + 1] = "Sorry";
        }
        queueManager();
        //musicBrainzRequest(id);
        //myData[id.position + 1] = "Sorry";
    }
}

async function queueManager() {
    console.log("invoked", queue.length);
    if (queue.length != 0) {
        if (queue[0].running == false) {
            //console.log("true invoke", queue[0]);
            queue[0].running = true;
            let thevar = await musicBrainzRequest(queue[0]);
            //console.log(thevar);
            if (thevar == true) {
                queueManager();
            }
        }
    } else {
        if (len*2 == myData.length && Object.values(myData).length == myData.length && printedFinal == false) {
            console.log(myData);
            printedFinal = true;
        }
    }
}

async function musicBrainzRequest(id) {
    let total = 15000;
    let end = 15000;
    let start = 0;
    for (i = 0; i <= 2000; i += 100) {
        //console.log("requesting", id.word, id.musicBrainsOffset);
        let url = "http://musicbrainz.org/ws/2/recording/?query=recording:%22/^" + id.word + "$/%22&limit=100&fmt=json&offset=" + i;
        //setTimeout(loadRequest, getRandomInt(2000), url, parseMusicBrainzData, id, true);
        let data;
        console.log(i, id.word);
        if (end - start >= 1000) {
            console.log("going");
            start = window.performance.now();
            data = await loadRequestv2(url, 1);
            console.log(data);
            end = window.performance.now();
        } else {
            console.log("sleeping");
            await sleepms(2000 - (end - start));
            start = window.performance.now();
            data = await loadRequestv2(url, 1);
            console.log(data);
            end = window.performance.now();
        }

        //console.log("yeet", i);
        //loadRequest(url, parseMusicBrainzData, id);
        total = data.count;
        if (total == undefined) {
            console.log("Rate limit hit!")
            //return false;
            i -= 100;
        } else {
            let ret = parseMusicBrainzData(data, id);
            //console.log(ret);
            if (ret == true) {
                //console.log(queue.length);
                queue.splice(0, 1);
                //console.log(queue.length);
                //console.log("returned");
                return true;
            }
        }
    }
    myData[id.position + 1] = "Sorry";
    //console.log("returned 1")
    queue.splice(0, 1);
    return true;
}

function parseMusicBrainzData(response, id) {
    for (item of response.recordings) {
        //console.log(item.title.toLowerCase().trim() + "," + id.word.toLowerCase().trim());
        if (item.title.toLowerCase().trim() == id.word.toLowerCase().trim()) {
            //console.log("brainz success", id.word)
            let search = item.title + " " + item["artist-credit"][0]["name"];
            id.spotifyStatus = "tryMusicBrainz";
            id.term = search;
            setTimeout(spotifyRequest, 10, id);
            //spotifyRequest(id);
            //console.log(myData[id.position + 1], id.word)
        }
        //console.log(myData[id.position + 1]);
        if (myData[id.position + 1] != undefined) {
            return true;
        }
    }
    //console.log("returned false");
    return false;
}

function parseSpotifyData(res, id) {
    //console.log(res);
    if (res.status != 429) {
        response = JSON.parse(res.response);
        for (item of response.tracks.items) {
            //console.log(item.name);
            let song = item.name; //replaceCharacters(removeOtherSongInfo(item.name), punctuationRemove, "");
            let thesong = song.toLowerCase().trim();
            let theword = id.word.toLowerCase().trim();
            if ((thesong == theword) && (item.name.charAt(thesong.indexOf(theword) + theword.length) != "-")) {
                console.log(item.name, "by", item.artists[0].name)
                myData[id.position + 1] = {
                    "word": id.word,
                    "title": item.name,
                    "artist": item.artists[0].name,
                    "songId": item.id
                };
                if (len*2 == myData.length && Object.values(myData).length == myData.length && printedFinal == false) {
                    console.log(myData);
                    printedFinal = true;
                }
                return;
            }
        }
        if (id.spotifyStatus == "good" || id.spotifyStatus == "secondTry") {
            spotifyRequest(id);
        }
    } else {
        console.log("429!!!!!!!!!!!!!");
        console.log(res);
        id.spotifyStatus = "badRequest";
        window.setTimeout(spotifyRequest, 2000, id);
    }
}