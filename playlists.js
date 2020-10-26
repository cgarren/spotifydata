function init() {
    $("#userdata_link").addClass("active");
    $("#userdata_dropdown a:nth-child(5)").addClass("active");
    $("#content")[0].style.display = "block";
    loadRequest("https://api.spotify.com/v1/me/tracks?limit=1", function(req, identifier) {
        var response = JSON.parse(req.responseText);
        generateImage("80px", {
            "height": null,
            "url": "https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png",
            "width": null
        }, "Liked Songs", response["total"], false, "liked_songs", 1);
        loadRequest("https://api.spotify.com/v1/me/playlists?limit=50", displayPlaylists, 1);
    }, 1)
    if (getHashParams()["raw_hash"] == "") {
        showAlert('<svg class="mr-2" width="40" height="40" viewBox="0 0 8.4666665 8.4666669"><g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-288.53332)"><path inkscape:connector-curvature="0" id="path8057" d="m 3.8859141,290.31736 -2.5116107,4.36789 a 0.40014058,0.39764426 0 0 0 0.3474193,0.59495 l 5.0232213,0 a 0.40014058,0.39764426 0 0 0 0.3474191,-0.59495 l -2.5116103,-4.36789 a 0.40014058,0.39764426 0 0 0 -0.6948387,0 z" style="fill:none;fill-rule:evenodd;stroke:#f77707;stroke-width:0.26458332px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" /><path style="fill:none;fill-rule:evenodd;stroke:#f77707;stroke-width:0.26458335px;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1" d="m 4.2333334,291.77454 8e-7,1.78395" id="path8059" inkscape:connector-curvature="0" sodipodi:nodetypes="cc" /><path id="circle8061" d="m 4.3656251,294.08947 a 0.13229167,0.13228111 0 0 1 -0.1322917,0.13227 0.13229167,0.13228111 0 0 1 -0.1322917,-0.13227 0.13229167,0.13228111 0 0 1 0.1322917,-0.13229 0.13229167,0.13228111 0 0 1 0.1322917,0.13229 z" style="opacity:1;fill:#f77707;fill-opacity:1;stroke:none;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" inkscape:connector-curvature="0" /></g></svg> Caution: With large libraries and playlists, load times can be very long!', "alert-warning", 0);
    }

    var options = $('#table').bootstrapTable('getOptions');
    options.height = window.innerHeight - (26 + 58); //subtract footer and table controls
    $('#table').bootstrapTable('refreshOptions', options);
    /*try {
        $('#table').on('all.bs.table', function(e, arg1, arg2) {
            //console.log(e);
            //console.log(arg1);
            //console.log(arg2);
        });
    } catch {

    }*/
}

jQuery(document).ready(function($) {

    if (window.history && window.history.pushState) {

        $(window).on('popstate', function() {
            var hashLocation = location.hash;
            var hashSplit = hashLocation.split("#!/");
            var hashName = hashSplit[1];

            if (hashName !== '') {
                var hash = window.location.hash;
                if (hash === '') {
                    location.reload();
                }
            }
        });

        window.history.pushState('forward', null, './playlists');
    }

});

function showImage(imgPath, row) {
    var myImage = new Image();
    myImage.name = imgPath;
    myImage.src = imgPath;
    myImage.onload = function findHHandWW() {
        var imgHeight = this.height;
        var imgWidth = this.width;
        if (imgHeight > 150 || imgWidth > 150) {
            var hratio = imgHeight / 150;
            var wratio = imgWidth / 150;
            if (hratio > wratio) {
                imgHeight = imgHeight / hratio;
                imgWidth = imgWidth / hratio;
            } else {
                imgHeight = imgHeight / wratio;
                imgWidth = imgWidth / wratio;
            }
        }
        return "<img height='" + imgHeight + "px' width='" + imgWidth + "pxH' src='" + image_url + "'>";
    }
}

function generateImage(image_size, playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id, num) {
    var image = document.createElement("span");
    if (playlist_image != null) {
        var myImage = new Image();
        myImage.name = playlist_image["url"];
        myImage.src = playlist_image["url"];
        myImage.onload = function() {
            var imgHeight = this.height;
            var imgWidth = this.width;
            /*if (imgHeight > 75 || imgWidth > 75) {
                var hratio = imgHeight / 75;
                var wratio = imgWidth / 75;
                if (hratio > wratio) {
                    imgHeight = imgHeight / hratio;
                    imgWidth = imgWidth / hratio;
                } else {
                    imgHeight = imgHeight / wratio;
                    imgWidth = imgWidth / wratio;
                }
            }*/
            image.style.backgroundImage = 'url("' + playlist_image["url"] + '")';
            image.style.backgroundRepeat = "no-repeat";
            //image.style.backgroundAttachment = "fixed";
            image.style.backgroundPosition = "center";
            image.style.backgroundSize = "cover";

            image.classList = "ml-md-0 mr-2 float-left";
            image.style.height = image_size;
            image.style.width = image_size;
            if (num == 1) {
                callback(image, playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id);
            } else if (num == 2) {
                displayPlaylistInfo(image, playlist_name, playlist_songs, playlist_public, playlist_id);
                //loadRequest("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks", displaySongs, 1);
                displayData(playlist_id, playlist_songs);
            } else {
                console.log("Error!")
            }
        }
    } else {
        image.id = "image";
        //"<span id='image' class='dot ml-md-0 mr-2'><svg width='40' height='40.5' color='#88898D' viewBox='0 0 80 81' xmlns='http://www.w3.org/2000/svg' style='margin: 18px'><title>Playlist Icon</title><path d='M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z' fill='currentColor' fill-rule='evenodd'></path></svg></span>";
        if (num == 1) {
            image.classList = "dot ml-md-0 mr-2 float-left";
            image.innerHTML = "<svg width='40' height='40.5' color='#88898D' viewBox='0 0 80 81' xmlns='http://www.w3.org/2000/svg' style='margin: 18px'><title>Playlist Icon</title><path d='M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z' fill='currentColor' fill-rule='evenodd'></path></svg>";
            callback(image, playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id);
        } else if (num == 2) {
            image.classList = "dot-profile ml-md-0 mr-2 float-left";
            image.innerHTML = "<svg width='60' height='60' color='#88898D' viewBox='0 0 80 81' xmlns='http://www.w3.org/2000/svg' style='margin: 30px'><title>Playlist Icon</title><path d='M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z' fill='currentColor' fill-rule='evenodd'></path></svg>";
            displayPlaylistInfo(image, playlist_name, playlist_songs, playlist_public, playlist_id);
            //loadRequest("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks", displaySongs, 1);
            displayData(playlist_id, playlist_songs);
        } else {
            console.log("Error!")
        }
    }
}

function callback(image, playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id) {
    var table = $("#Playlisttable")[0];
    var row = document.createElement("tr");
    var holder = document.createElement("td");
    if (playlist_songs != 0) {
        holder.classList = "holder";
        holder.id = playlist_name;
        holder.addEventListener("click", function(params) {
            dismissAlert();
            generateImage("120px", playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id, 2);
        }, false)
    } else {;
    }
    var name = document.createElement("div");
    name.classList = "align-middle h5 font-weight-bold";
    name.innerHTML = playlist_name;
    var songs = document.createElement("div");
    songs.classList = "align-middle text-secondary font-weight-normal";
    if (playlist_songs == 1) {
        songs.innerHTML = playlist_songs + " song";
    } else {
        songs.innerHTML = playlist_songs + " songs";
    }
    var public = document.createElement("div");
    public.classList = "align-middle text-secondary font-weight-normal";
    if (playlist_public == true) {
        public.innerHTML = "Public";
    } else {
        public.innerHTML = "Private";
    }

    holder.prepend(image);
    holder.append(name);
    holder.append(songs);
    holder.append(public);
    row.append(holder);
    table.append(row);
}

/*function generateRow(playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id) {
    var image = generateImage("80px", playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id)
}*/

function loadingTemplate(message) {
    return '<i class="fa fa-spinner fa-spin fa-fw fa-2x"></i><br><div id="loadingmessage">Loading your music</div>'
}

function displayPlaylistInfo(image, playlist_name, playlist_songs, playlist_public, playlist_id) {
    $("#list").hide();
    $("#playlist").show();
    $("#playlist_name").html(playlist_name);
    if (playlist_songs == 1) {
        $("#songs").html(playlist_songs + " song");
    } else {
        $("#songs").html(playlist_songs + " songs");
    }
    if (playlist_id != "liked_songs") {
        if (playlist_public == true) {
            $("#public").html("Public");
        } else {
            $("#public").html("Private");
        }
    } else {
        $("#divider")[0].style.display = "none!important";
        $("#public")[0].style.display = "none!important";
    }
    $("#pic").append(image);
    var newURL = "playlists#" + playlist_name;
    window.history.pushState({}, document.title, "/" + newURL);
}

function displayStats(feature_data, playlist_response) {
    if (playlist_response != null) {
        response = JSON.parse(playlist_response.responseText);
        console.log(response)
        //Followers
        generateLargeStat("Followers", response["followers"]["total"], false, "playlist-stats");
    }
    //generate averages
    let averages = {}
    for (i of feature_data) {
        for (j in i["track"]) {
            if (isNumber(i["track"][j]) && j != "time_signature" && j != "name") {
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
    header.classList = "font-weight-bold text-light text-center mb-3 text-wrap";
    header.innerHTML = "Playlist Averages";
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

function displayStatsAllPlaylists(playlist_name, playlist_songs, playlist_public, playlist_id) {
    console.log(2)
}

function displayData(playlist_id, playlist_songs) {
    var $table = $('#table');
    var data = [];
    var j = 0;

    $table.bootstrapTable('showLoading');
    $("#loadingmessage")[0].innerHTML = "Loading 0/" + playlist_songs + " songs";

    function getData(url, increment) {
        $("#loadingmessage")[0].innerHTML = "Loading " + j + "/" + playlist_songs + " songs";
        //console.log(url);
        if (url != null) {
            //get the next set of songs
            loadRequest(url, function(res, identifier) {
                response = JSON.parse(res.responseText);
                id_list = [];
                //console.log(response);
                //NEED TO CREATE LIST OF IDS AND SEND THEM TO THE MASS DATA ENDPOINTS
                response.items.forEach(element => id_list.push(element.track.id));
                loadRequest("https://api.spotify.com/v1/audio-features/?" + jQuery.param({ "ids": id_list.join() }), function(feat_res) {
                    features = JSON.parse(feat_res.responseText);
                    //console.log(features);
                    for (i in response["items"]) {
                        response["items"][i]["track"] = { ...response["items"][i]["track"], ...features["audio_features"][i] }
                        data.push(response["items"][i])
                        //console.log(response["items"][i])
                    }
                    //response["items"].forEach(element => data.push(element))
                    j = j + increment;
                    //console.log(j, 2)
                    getData(response["next"], increment);
                }, 1);
                //$('#table').bootstrapTable('append', JSON.parse(res.responseText)["items"]);
            }, 1);
        } else {
            formatted_data = formatData(data);
            console.log(formatted_data);
            $table.bootstrapTable('load', formatted_data);
            $table.bootstrapTable('hideLoading');
            if (playlist_id == "liked_songs") {
                displayStats(data, null);
            } else {
                loadRequest("https://api.spotify.com/v1/playlists/" + playlist_id, function(req, identifier) {
                    displayStats(data, req);
                });
            }
        }
    }
    if (playlist_id != "liked_songs") {
        getData("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?offset=0&limit=100", 100);
    } else {
        getData("https://api.spotify.com/v1/me/tracks?offset=0&limit=50", 50);
    }
}

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
            var date_options = {
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

function pickHex(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)
    ];
    return rgb;
}

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
/*
function displaySongs(req, identifier) {
    var response = JSON.parse(req.responseText);
    console.log(response);
    if (response["next"] != null) {
        //get the next set of songs
        loadRequest(response["next"], displaySongs, 1);
    }
    for (i in response["items"]) {
        generateSongRow(response["items"][i], i);
    }
}

function generateSongRow(data, i) {
    //console.log(data);
    //console.log(data["track"]["artists"].length);
    var table = $("#Songtable")[0];
    var row = document.createElement("tr");
    row.id = data["track"]["id"];
    var name = document.createElement("td");
    name.innerHTML = data["track"]["name"];
    /*holder.addEventListener("click", function(params) {
        generateImage("120px", playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id, 2)
    }, false)*/
/*
    var artist = document.createElement("td");
    var artists = data["track"]["artists"][0]["name"];
    if (data["track"]["artists"].length > 1) {
        for (i = 1; i < data["track"]["artists"].length; i++) {
            artists = artists + ", " + data["track"]["artists"][i]["name"]
        }
    }
    artist.innerHTML = artists;
    var duration = document.createElement("td");
    duration.innerHTML = convertMilliseconds(data["track"]["duration_ms"]);

    row.append(name);
    row.append(artist);
    row.append(duration);
    table.append(row);
}
*/

function displayPlaylists(req, identifier) {
    var response = JSON.parse(req.responseText);
    for (i in response["items"]) {
        //console.log(i)
        generateImage("80px", response["items"][i]["images"][0], response["items"][i]["name"], response["items"][i]["tracks"]["total"], response["items"][i]["public"], response["items"][i]["id"], 1);
    }
    if (response["next"] != null) {
        loadRequest(response["next"], displayPlaylists, 1);
        /*product = response["product"];
        $("#account_type")[0].innerHTML = product.charAt(0).toUpperCase() + product.slice(1);

        if (Object.keys(response["images"]).length > 0) {
            image_url = response["images"][0]["url"];
            console.log(image_url)
            showImage(image_url);
        }*/
    }
}