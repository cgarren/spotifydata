function init() {
    $("#userdata_link").addClass("active");
    $("#userdata_dropdown a:nth-child(5)").addClass("active");
    $("#content")[0].style.display = "block";

    //#55GmZuHBdV35tZDA0RNycA
    const hash = getHashParams()["raw_hash"];
    //console.log(hash);
    if (hash == "") {
        loadAllPlaylists();
        window.history.pushState('forward', '', './playlists');
    } else {
        loadPlaylist(hash.substring(1)) == null
        window.history.pushState('forward', '', './playlists' + hash);
    }

    var options = $('#table').bootstrapTable('getOptions');
    options.height = window.innerHeight - (26 + 58); //subtract footer and table controls
    $('#table').bootstrapTable('refreshOptions', options);
    $('table')[0].style.backgroundColor = properties.BACKGROUND_COLOR;
    $('table')[0].style.color = properties.TEXT_COLOR;
    $('#content')[0].style.color = properties.TEXT_COLOR;
    $("#number-of-songs")[0].style.color = properties.TEXT_COLOR;
    $("#public")[0].style.color = properties.SPECIAL_TEXT_COLOR;
    createClass('.holder:hover{ box-shadow: 0 0rem 1rem ' + properties.SELECTED_COLOR + '; cursor: pointer;}'); //background-color: ' + properties.SELECTED_COLOR + ' }')
    createClass('.table { background-color: ' + properties.BACKGROUND_COLOR + '; color: ' + properties.TEXT_COLOR + ' }');
    createClass('.dropdown-menu-right { background-color: ' + properties.SECONDARY_BACKGROUND_COLOR + '; color: ' + properties.SECONDARY_TEXT_COLOR + '; border: 1px ' + properties.SELECTED_COLOR + ' }');
    createClass('.fixed-table-toolbar { background-color: ' + properties.BACKGROUND_COLOR + '; color: ' + properties.TEXT_COLOR + ' }');
    createClass('.btn-buttons { background-color: ' + properties.SECONDARY_BACKGROUND_COLOR + '; color: ' + properties.SECONDARY_TEXT_COLOR + ' }');
    createClass('.bootstrap-table .fixed-table-toolbar .columns label { color: ' + properties.SECONDARY_TEXT_COLOR + ' }');
}

//------------------------------------------------------------------------------
//                            MAIN PLAYLIST PAGE
//------------------------------------------------------------------------------

async function loadAllPlaylists() {
    loadRequest("https://api.spotify.com/v1/me/tracks?limit=1", function(res, identifier) {
        if (res.status != 401) {
            //show cautionary alert for big playlists
            showAlert('<svg class="mr-2" width="40" height="40" viewBox="0 0 8.4666665 8.4666669"><g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-288.53332)"><path inkscape:connector-curvature="0" id="path8057" d="m 3.8859141,290.31736 -2.5116107,4.36789 a 0.40014058,0.39764426 0 0 0 0.3474193,0.59495 l 5.0232213,0 a 0.40014058,0.39764426 0 0 0 0.3474191,-0.59495 l -2.5116103,-4.36789 a 0.40014058,0.39764426 0 0 0 -0.6948387,0 z" style="fill:none;fill-rule:evenodd;stroke:#f77707;stroke-width:0.26458332px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /><path style="fill:none;fill-rule:evenodd;stroke:#f77707;stroke-width:0.26458335px;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1" d="m 4.2333334,291.77454 8e-7,1.78395" id="path8059" inkscape:connector-curvature="0" sodipodi:nodetypes="cc" /><path id="circle8061" d="m 4.3656251,294.08947 a 0.13229167,0.13228111 0 0 1 -0.1322917,0.13227 0.13229167,0.13228111 0 0 1 -0.1322917,-0.13227 0.13229167,0.13228111 0 0 1 0.1322917,-0.13229 0.13229167,0.13228111 0 0 1 0.1322917,0.13229 z" style="opacity:1;fill:#f77707;fill-opacity:1;stroke:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" inkscape:connector-curvature="0" /></g></svg> Currently with large libraries and playlists, load times can be very long!', "alert-warning", 0);

            let response = JSON.parse(res.responseText);

            //generate images for liked songs
            let image_small = generateCustomPlaylistImage("80px", "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png");
            let image_large = generateCustomPlaylistImage("120px", "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png");

            //add liked songs to list
            generatePlaylistRow("liked_songs", "Liked Songs", response["total"], sessionStorage.getItem("user_name") + " (Private)", image_small, image_large);

            //begin generating the rest of the playlists (could probably be sped up using async, but we always want liked songs to appear first)
            //loadRequest("https://api.spotify.com/v1/me/playlists?limit=50", displayPlaylists, 1);
            displayPlaylists()

        } else {
            //Generic message when user is not logged in
            let image = generateDefaultPlaylistImage("80px");
            generatePlaylistRow(null, "No Playlists Found", 0, "Unknown User", image, image);
        }
    }, 1)
}

//load all playlists //TODO: might want to consider paging this to reduce unnecessary loading
async function displayPlaylists() {
    let response = {"next": "https://api.spotify.com/v1/me/playlists?limit=50"};

    while (response["next"] != null) {
        response = await loadRequestv2(response["next"], 1);

        for (i of response["items"]) {
            //generate necessary playlist info
            let ret = formatImagesAndIndicators(i)
            //display the playlist in DOM
            generatePlaylistRow(i["id"], i["name"], i["tracks"]["total"], ret["playlist_indicator"], ret["image_small"], ret["image_large"]);
        }
    }
}

function generatePlaylistRow(playlist_id, playlist_name, playlist_songs, playlist_indicator, playlist_image_small, playlist_image_large) {
    //define table
    let table = $("#Playlisttable")[0];
    //create holding elements and add properties
    let row = document.createElement("tr");
    let holder = document.createElement("td");
    //make the playlist clickable if it has at least one song
    if (playlist_songs != 0) {
        holder.classList = "holder";
        holder.id = playlist_name;
        holder.addEventListener("click", function(params) {
            dismissAlert();
            //displayPlaylistInfo(playlist_image_large, playlist_name, playlist_songs, playlist_indicator, playlist_id);
            //displayPlaylistData(playlist_id, playlist_songs);
            loadPlaylist(playlist_id);
        }, false)
    }
    //create name div
    let name = document.createElement("div");
    name.classList = "align-middle h5 font-weight-bold";
    name.innerHTML = playlist_name;
    //create songs div
    let songs = document.createElement("div");
    songs.classList = "align-middle font-weight-normal helping_text_color_prop";
    if (playlist_songs == 1) {
        songs.innerHTML = playlist_songs + " song";
    } else {
        songs.innerHTML = playlist_songs + " songs";
    }
    //create private/public/owner indicator div
    let indicator = document.createElement("div");
    indicator.classList = "align-middle font-weight-normal helping_text_color_prop";
    indicator.innerHTML = playlist_indicator
    //put elements in DOM
    holder.prepend(playlist_image_small);
    holder.append(name);
    holder.append(songs);
    holder.append(indicator);
    row.append(holder);
    table.append(row);
}

function displayStatsAllPlaylists(playlist_name, playlist_songs, playlist_public, playlist_id) {
    //TODO, start with a simple number of playlists probably
    console.log(2)
}

//------------------------------------------------------------------------------
//                          INDIVIDUAL PLAYLIST PAGE
//------------------------------------------------------------------------------

//loads the given playlist
async function loadPlaylist(playlist_id) {
    response = await loadRequestv2("https://api.spotify.com/v1/playlists/" + playlist_id, 2)

    try {
        //get images and set indicator appropriately
        ret = formatImagesAndIndicators(response);

        //display the header information about the playlist
        displayPlaylistInfo(ret["image_large"], response["name"], response["tracks"]["total"], ret["playlist_indicator"], playlist_id);

        //get the playlists songs and their data from Spotify
        let data = await loadData(playlist_id, response["tracks"]["total"]);

        //format the data and feed it into the table
        $('#table').bootstrapTable('load', formatData(data));

        //signal that we're done loading so the data can be shown
        $('#table').bootstrapTable('hideLoading');

        //displays the stats on  a playlist //TODO: need a way to get follower count and other info here for stats
        displayStats(data, null);
        /*if (playlist_id == "liked_songs") {
            displayStats(data, null);
        } else {
            loadRequest("https://api.spotify.com/v1/playlists/" + playlist_id, function(req, identifier) {
                displayStats(data, req);
            });
        }*/

    } catch (err) {
        console.log(err)
        if (response.error.status != 401) {
            console.log("Error getting playlist " + playlist_id + ", loading selection screen");
        }
        loadAllPlaylists();
        window.history.pushState('forward', '', './playlists');
    }
}

function displayPlaylistInfo(image, playlist_name, playlist_songs, playlist_indicator, playlist_id) {
    //hide the list and ahow the playlist view
    $("#list").hide();
    $("#playlist").show();

    //sets the various attributes of the playlist in the DOM
    $("#playlist_name").html(playlist_name);
    if (playlist_songs == 1) {
        $("#number-of-songs").html(playlist_songs + " song");
    } else {
        $("#number-of-songs").html(playlist_songs + " songs");
    }
    if (playlist_id != "liked_songs") {
        $("#public").html(playlist_indicator);
    } else {
        $("#divider")[0].style.display = "none!important";
        $("#public")[0].style.display = "none!important";
    }
    $("#pic").append(image);

    //sets the urt to reflect the displayed playlist
    var newURL = "playlists#" + playlist_id;
    window.history.pushState({}, document.title, "/" + newURL);
}

async function loadData(playlist_id, playlist_songs) {
    //set loading message in the table
    $('#table').bootstrapTable('showLoading');
    $("#loadingmessage")[0].innerHTML = "Loading 0/" + playlist_songs + " songs";
    $(".fixed-table-loading")[0].style.backgroundColor = properties.BACKGROUND_COLOR;
    $("#loadingmessage")[0].style.color = properties.TEXT_COLOR;

    //check to see if the library is getting loaded, as it has a different endpoint. kick off the getData recursion
    if (playlist_id != "liked_songs") {
        return await getData("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?offset=0&limit=100", 100, [], 0, playlist_songs); //max is 100 songs per request
    } else {
        return await getData("https://api.spotify.com/v1/me/tracks?offset=0&limit=50", 50, [], 0, playlist_songs); //max is 50 songs per request
    }

}

//recursive function to get all of the tracks in a playlist/library
async function getData(url, increment, data, j, playlist_songs) {
    //end condition if we've reached the last chunk of songs to request
    if (url == null) {
        return data
    //otherwise load data from the url
    } else {
        //get the next set of songs
        let response = await loadRequestv2(url, 1);

        //increment the song counter for the loading message
        j += response["items"].length

        //updates loading message with current progress
        $("#loadingmessage")[0].innerHTML = "Loading " + j + "/" + playlist_songs + " songs";

        //creates list of ids to feed into next request
        id_list = [];
        response.items.forEach(element => id_list.push(element.track.id));

        //gets features of found songs
        let features = await loadRequestv2("https://api.spotify.com/v1/audio-features/?" + jQuery.param({ "ids": id_list.join() }), 1);

        //wrap up values neatly and push to overall data array
        for (i in response["items"]) {
            response["items"][i]["track"] = { ...response["items"][i]["track"], ...features["audio_features"][i] }
            data.push(response["items"][i])
        }

        //call the next url in the request
        return await getData(response["next"], increment, data, j, playlist_songs);
    }
}

function displayStats(feature_data, playlist_response) {
    //check if the playlist is liked songs (liked songs can't have followers)
    if (playlist_response != null) {
        //response = JSON.parse(playlist_response.responseText);
        console.log(response)
        //Followers
        if (response["followers"]["total"] != 1) {
            generateLargeStat("Followers", response["followers"]["total"], false, "playlist-stats");
        } else {
            generateLargeStat("Follower", response["followers"]["total"], false, "playlist-stats");
        }
    } //Holding off on the followers until I find a better way to get them without re-calling the api or passing them all the way through
    //generate averages
    let averages = {}
    for (i of feature_data) {
        for (j in i["track"]) {
            //console.log(j)
            if (isNumber(i["track"][j]) && j != "time_signature" && j != "name") {
                //console.log(averages[j])
                if (averages[j] == undefined) {
                    averages[j] = parseFloat(i["track"][j]);
                    averages[j + "_count"] = 1;
                } else {
                    averages[j] = averages[j] + parseFloat(i["track"][j]);
                    averages[j + "_count"] = averages[j + "_count"] + 1
                }
            }
        }
    }

    for (i in averages) {
        averages[i] = Math.round(averages[i] / averages[i + "_count"]);
        delete averages[i + "_count"];
    }

    //find last added to date
    let latest = 0;
    for (i of feature_data) {
        let date = Date.parse(i["added_at"]);
        if (date > latest) {
            latest = date;
        }
    }

    //Average stats
    var averagesdiv = document.createElement("div");
    averagesdiv.id = "averagesdiv";
    averagesdiv.classList = "shadow px-2 pt-2"
    $("#playlist-stats").append(averagesdiv);
    var header = document.createElement("h2");
    header.classList = "font-weight-bold text-center mb-3 text-wrap";
    header.innerHTML = "Playlist Averages";
    header.style.color = properties.TEXT_COLOR;
    averagesdiv.append(header);
    generateSmallStat("Popularity", averages["popularity"], false, "averagesdiv", cellStyle(averages["popularity"])["css"]["color"]);
    generateSmallStat("Happiness", averages["valence"], false, "averagesdiv", cellStyle(averages["valence"])["css"]["color"]);
    generateSmallStat("Energy", averages["energy"], false, "averagesdiv", cellStyle(averages["energy"])["css"]["color"]);
    generateSmallStat("Tempo", averages["tempo"] + " BPM", false, "averagesdiv", cellStyle(averages["tempo"], "", "", "track.tempo")["css"]["color"]);
    generateSmallStat("Danceability", averages["danceability"], false, "averagesdiv", cellStyle(averages["danceability"])["css"]["color"]);
    generateSmallStat("Acousticness", averages["acousticness"], false, "averagesdiv", cellStyle(averages["acousticness"])["css"]["color"]);
    generateSmallStat("Instrumentalness", averages["instrumentalness"], false, "averagesdiv", cellStyle(averages["instrumentalness"])["css"]["color"]);
    generateSmallStat("Liveness", averages["liveness"], false, "averagesdiv", cellStyle(averages["liveness"])["css"]["color"]);
    generateSmallStat("Loudness", averages["loudness"], false, "averagesdiv", cellStyle(averages["loudness"])["css"]["color"]);
    generateSmallStat("Position on album", ordinal_suffix_of(averages["track_number"]), false, "averagesdiv", cellStyle(averages["track_number"])["css"]["color"]);

    //Time since last added to/updated
    generateLargeStat("since a song was added", convertISOTime(latest, true), false, "playlist-stats");

    //Avg time between updates

    //Average add date

    //mood calculation-correlated with emojis?

    //number of contributors

    //followers, average popularity, average basic stat everything, average track playlist recency/adding trends, average creation date of songs, mood (based on a few factors like danceability and stuff), # of contributing users

}

//------------------------------------------------------------------------------
//                              HELPER FUNCTIONS
//------------------------------------------------------------------------------

//helper function to call appropriate image generation functions and set indicastor appropriately
function formatImagesAndIndicators(res) {
    //call image generation functions for large and small images
    let image_small;
    let image_large;
    if (res["images"][0] != null) {
        image_small = generateCustomPlaylistImage("80px", res["images"][0]["url"]);
        image_large = generateCustomPlaylistImage("120px", res["images"][0]["url"]);
    } else {
        image_small = generateDefaultPlaylistImage("80px");
        image_large = generateDefaultPlaylistImage("120px");
    }

    //set value of indicator field appropriately
    let playlist_indicator;
    if (sessionStorage.getItem('user_id') == res["owner"]["id"]) {
        if (res["public"] == true) {
            playlist_indicator = res["owner"]["display_name"] + " (Public)";
        } else if (res["public"] == false) {
            playlist_indicator = res["owner"]["display_name"] + " (Private)";
        } else {
            playlist_indicator = res["owner"]["display_name"];
        }
    } else {
        playlist_indicator = res["owner"]["display_name"];
    }

    //return results
    return {
        "playlist_indicator": playlist_indicator,
        "image_small": image_small,
        "image_large": image_large
    }
}

//returns the image at image_url in image_size as an img element
function generateCustomPlaylistImage(image_size, image_url) {
    //define params
    let imageSpan = document.createElement("span");
    //set element styles
    imageSpan.style.backgroundImage = 'url("' + image_url + '")';
    imageSpan.style.backgroundRepeat = "no-repeat";
    imageSpan.style.backgroundPosition = "center";
    imageSpan.style.backgroundSize = "cover";
    imageSpan.classList = "ml-md-0 mr-2 float-left";
    imageSpan.style.height = image_size;
    imageSpan.style.width = image_size;
    //return the new element
    return imageSpan
}

//returns the generic playlist image in image size as an img element
function generateDefaultPlaylistImage(image_size) {
    let imageSpan = document.createElement("span");
    //set elment styles
    imageSpan.id = "image";
    imageSpan.style.height = image_size;
    imageSpan.style.width = image_size;
    imageSpan.style.backgroundColor = "#222327";
    imageSpan.classList = "ml-md-0 mr-2 float-left"
    imageSpan.style.borderRadius = "0%";
    imageSpan.style.display = "inline-block";
    //set svg content
    imageSpan.innerHTML = "<svg width='" + parseInt(image_size) / 2 + "' height='" + parseInt(image_size) / 2 + "' color='#88898D' viewBox='0 0 80 81' xmlns='http://www.w3.org/2000/svg' style='margin: 18px'><title>Playlist Icon</title><path d='M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z' fill='currentColor' fill-rule='evenodd'></path></svg>";
    //return the new element
    return imageSpan
}

//defines a temple for the loading message in table
function loadingTemplate(message) {
    return '<i class="fa fa-spinner fa-spin fa-fw fa-2x"></i><br><div id="loadingmessage">Loading your music</div>'
}

//sorter function for durations in the data table
function durationSorter(a, b) {
    var letters = ["d", "h", "m", "s"]
    var aa = a.split(" ");
    var bb = b.split(" ");
    //console.log(a, b)
    for (i of letters) {
        a = false
        b = false
        for (j in aa) {
            if (aa[j].includes(i)) {
                a = true
                var asp = j
                aa[j] = aa[j].replace(i, '');
            }
        }
        for (k in bb) {
            if (bb[k].includes(i)) {
                b = true
                var bsp = k
                bb[k] = bb[k].replace(i, '')
            }
        }
        //console.log(a, b, i)
        if (a == true && b == false) {
            return 1
        } else if (a == false && b == true) {
            return -1
        } else if (a == true && b == true) {
            if (parseInt(aa[asp]) > parseInt(bb[bsp])) {
                //console.log("ret2 ", 1, aa[asp], bb[bsp])
                return 1
            } else if (parseInt(aa[asp]) < parseInt(bb[bsp])) {
                //console.log("ret2 ", -1, aa[asp], bb[bsp])
                return -1
            }
        }
    }
    return 0
}

//sorter function for dates in the data table
function dateSorter(a, b) {
    a = Date.parse(a)
    b = Date.parse(b)
    if (a > b) {
        return 1
    } else if (a < b) {
        return -1
    } else {
        return 0
    }
}

//helper function to get json in the proper format for the table to display
function formatData(data) {
    //$("#loadingmessage")[0].innerHTML = "Processing...";
    let song_key_codes = new Map([
        [-1, "Unkown"],
        [0, "C"],
        [1, "C#"],
        [2, "D"],
        [3, "D#"],
        [4, "E"],
        [5, "F"],
        [6, "F#"],
        [7, "G"],
        [8, "G#"],
        [9, "A"],
        [10, "A#"],
        [11, "B"]
    ]);

    let song_mode_codes = new Map([
        [-1, "Unkown"],
        [0, "minor"],
        [1, "major"]
    ]);

    for (song of data) {
        if (song["track"]["is_local"] == false) {
            //set date added to a more readable value
            let date_options = {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hour12: true,
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            };
            song["added_at"] = convertISOTime(song["added_at"], false).toLocaleString('en-US', date_options);

            song = song["track"]

            //set explicitness to a more readable value
            if (song["explicit"] == false) {
                song["explicit"] = "no";
            } else {
                song["explicit"] = "yes";
            }

            //set key to a more readable value
            song["key"] = song_key_codes.get(song["key"]);

            //set mode to a more readable value
            song["mode"] = song_mode_codes.get(song["mode"]);

            //set duration to a more readable value
            song["duration_ms"] = convertMilliseconds(song["duration_ms"]);

            //set numerical stats to more readable values
            song["loudness"] = song["loudness"].toFixed(1);
            song["valence"] = +song["valence"].toFixed(2);
            song["valence"] = Math.round(song["valence"] * 100);
            song["tempo"] = Math.round(song["tempo"]);
            song["danceability"] = Math.round(song["danceability"] * 100);
            song["energy"] = Math.round(song["energy"] * 100);
            song["speechiness"] = Math.round(song["speechiness"] * 100);
            song["acousticness"] = Math.round(song["acousticness"] * 100);
            song["instrumentalness"] = Math.round(song["instrumentalness"] * 100);
            song["liveness"] = Math.round(song["liveness"] * 100);
        }
    }
    return data;
}

//returns the proper color for a stat given its value (weight)
function pickHex(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)
    ];
    return rgb;
}

//helper function to format each cell correctly with colored elements
function cellStyle(value, row, index, field) {
    if (isNumber(value) && field != "track.time_signature" && field != "track.name" && field != "track.artists.0.name" && field != "track.duration_ms") {
        if (field == "track.tempo") {
            val = value / 225;
        } else {
            val = value / 100;
        }
        if (val == .5) {
            color = [255, 127, 127];
        }
        /*else if (val < .5) {
                         color = pickHex([255, 255, 255], [117, 117, 117], val)
                     } */
        else {
            color = pickHex([255, 0, 0], [255, 255, 255], val);
        }
        return {
            css: {
                color: "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")"
            }
        }
        //console.log(key, val, typeof(val), tabledata2.style.color)
    }
    return {}
}