// Example starter JavaScript for disabling form submissions if there are invalid fields
window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);

function pickHex(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)
    ];
    return rgb;
}

function keyMap(src, target) {
    target = target || {};
    Object.keys(src).forEach(function(propName) {
        var prop = src[propName];
        if (typeof prop == "object") {
            target[propName] = Object.keys(prop).join(',');
            keyMap(prop, target);
        }
    });
    return target;
};

function searchForTrack(ev) {
    //console.log("searching...");
    if (sessionStorage.getItem("track_features")) {
        sessionStorage.removeItem("track_features");
    }
    if (sessionStorage.getItem("track_info")) {
        sessionStorage.removeItem("track_info");
    }
    if (sessionStorage.getItem("artist_info")) {
        sessionStorage.removeItem("artist_info");
    }
    if ($('.form-control:invalid').length == 0) {
        //console.log("searching...");
        var searchfield = $("#validationCustom01")[0];
        var search = searchfield.value;
        //console.log(searchfield.value);
        var params = { "q": search, "type": "track", "limit": 1 };
        //console.log(jQuery.param(params));
        var url = "https://api.spotify.com/v1/search/?" + jQuery.param(params);

        //url = "https://api.spotify.com/v1/audio-features/3Wv6AagA0qqWH7nRDrkgh7";
        loadRequest(url, complete_search, 1);
        // send data as a dictionary
        //Put a loading icon in the button and disable it
        //spinner = html.SPAN(Class = "spinner-border spinner-border-sm");
        var spinner = document.createElement("span");
        spinner.classList = "spinner-border spinner-border-sm";
        var searchbutton = $("#searchbutton")[0];
        //console.log(searchbutton.innerHTML);
        searchbutton.innerHTML = "";
        searchbutton.append(spinner);
        searchbutton.disabled = true;
    }
}

function complete_search(req) {
    //console.log(req.responseText);
    if (req.status == 200 || req.status == 0) {
        results = JSON.parse(req.responseText);
        if (results["tracks"]["items"].length > 0) {
            for (i = 0; i < results["tracks"]["items"].length; i++) {
                try {
                    console.log(results["tracks"]["items"][i]["name"] + " by " + results["tracks"]["items"][i]["artists"][0]["name"]);
                    var track_id = results["tracks"]["items"][i]["id"];
                    var artist_id = results["tracks"]["items"][i]["artists"][0]["id"];
                    var features_url = "https://api.spotify.com/v1/audio-features/" + track_id;
                    var info_url = "https://api.spotify.com/v1/tracks/" + track_id;
                    var artist_url = "https://api.spotify.com/v1/artists/" + artist_id;
                    loadRequest(features_url, saveData, 1);
                    loadRequest(info_url, saveData, 2);
                    loadRequest(artist_url, saveData, 3);
                    //getTrackData(results["tracks"]["items"][i]["id"]);
                } catch (err) {
                    console.log("Error");
                    break;
                }
            }
        } else {
            console.log("No results for that search");
            showAlert("<strong>No songs found for that search!</strong>", "alert-danger", 5000);
            $("#searchbutton")[0].innerHTML = "Show me data!";
            $("#searchbutton").prop("disabled", false);
        }
    }
}

function saveData(req, identifier) {
    //console.log(req.responseText);
    var response = req.responseText;
    if (identifier == 1) {
        sessionStorage.setItem("track_features", response);
    } else if (identifier == 2) {
        sessionStorage.setItem("track_info", response);
    } else if (identifier == 3) {
        sessionStorage.setItem("artist_info", response);
    } else {
        console.log("Unkown Error");
    }
    var track_features = sessionStorage.getItem("track_features");
    //console.log(track_features);
    var track_info = sessionStorage.getItem("track_info");
    //console.log(track_info);
    var artist_info = sessionStorage.getItem("artist_info");
    //console.log(artist_info);
    if (track_features !== null & track_info !== null & artist_info != null) {
        //console.log("Data received, formatting");
        formatData(track_features, track_info, artist_info);
    }
}

function formatData(track_features, track_info, artist_info) {
    track_features = JSON.parse(track_features);
    track_info = JSON.parse(track_info);
    artist_info = JSON.parse(artist_info);

    let song_key_codes = new Map([
        [-1, "Unkown key"],
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

    //console.log(song_key_codes)

    let song_mode_codes = new Map([
        [-1, "Unkown mode"],
        [0, "minor"],
        [1, "major"]
    ]);

    track_features["duration"] = convertMilliseconds(track_features["duration_ms"]);
    delete track_features["duration_ms"];
    track_features["loudness"] = track_features["loudness"].toFixed(1) + " decibels";
    track_features["valence (happiness)"] = +track_features["valence"].toFixed(2);
    delete track_features["valence"];
    track_features["time signature"] = track_features["time_signature"];
    delete track_features["time_signature"];
    track_features["tempo"] = Math.round(track_features["tempo"]) + " BPM";
    track_features["danceability"] = Math.round(track_features["danceability"] * 100);
    track_features["energy"] = Math.round(track_features["energy"] * 100);
    track_features["speechiness"] = Math.round(track_features["speechiness"] * 100);
    track_features["acousticness"] = Math.round(track_features["acousticness"] * 100);
    track_features["instrumentalness"] = Math.round(track_features["instrumentalness"] * 100);
    track_features["liveness"] = Math.round(track_features["liveness"] * 100);
    track_features["valence (happiness)"] = Math.round(track_features["valence (happiness)"] * 100);
    //console.log(track_features)

    //Insert player widget
    /*<iframe src="https://open.spotify.com/embed/track/0NWPxcsf5vdjdiFUI8NgkP" 
    width="300" height="80" frameborder="0" allowtransparency="true" 
    allow="encrypted-media"></iframe>*/
    if ($('#player').length == 0) {
        //this is the first request and there is no player present
    } else {
        //the player exists already
        $('#player').remove();
    }
    var player = document.createElement("iframe");
    var playerdiv = $("#playerdiv");
    player.id = "player";
    player.src = "https://open.spotify.com/embed/track/" + track_info["id"];
    player.width = "300";
    player.height = "80";
    player.frameBorder = "0";
    player.allowTransparency = "true";
    player.allow = "encrypted-media";
    player.classList = "shadow rounded-lg";
    playerdiv.append(player);

    //All the elements will be inserted in the div with the "container" class

    var container = $(".container")[0];

    if ($('table').length == 0) {
        //this is the first request and there is no table present
    } else {
        //the table exists already
        $('#rowdiv').remove();
    }
    var rowdiv = document.createElement("div");
    rowdiv.classList = "row";
    rowdiv.id = "rowdiv";
    var tablediv = document.createElement("div");
    tablediv.classList = "col";
    var table = document.createElement("table");
    table.classList = "table table-dark table-sm table-borderless mx-auto mt-3 p-2 rounded-lg shadow";
    table.style.maxWidth = "500px";
    var thead = document.createElement("thead");
    thead.classList = "border-success border-bottom";
    var tbody = document.createElement("tbody");
    table.append(thead);
    table.append(tbody);

    //Add header 1: song title and artist
    try {
        var song_title = track_info["name"];
        var album = track_info["album"]["name"];
        var artist = track_info["album"]["artists"][0]["name"];
        var tablerowh = document.createElement("tr");
        tablerowh.classList = "text-center";
        var tableheader = document.createElement("th");
        tableheader.colSpan = "2";
        tableheader.innerHTML = "Stats for " + song_title + " by " + artist;
        //html.TH("Stats for " + song_title + " by " + artist, colspan="2"); //+ " on the album " + album + ":\n"
        tablerowh.append(tableheader);
        thead.append(tablerowh);
    } catch {
        thead.innerHTML = "Error: Could not get track from the provided id";
    }

    //add header 2: actual table header
    var tablerowa = document.createElement("tr");
    var tableheader1 = document.createElement("th");
    tableheader1.innerHTML = "Song Attribute";
    var tableheader2 = document.createElement("th");
    tableheader2.innerHTML = "Value";
    tableheader2.classList = "text-left";
    tablerowa.append(tableheader1);
    tablerowa.append(tableheader2);
    thead.append(tablerowa);

    //html.TR(html.TH("Song Attribute") + html.TH("Value", Class="text-left"))

    /*for key, value in track_features:
        tbody <= html.TR(html.TD(key) +
                          html.TD(value))
    Now we add some style to the table
    table.style = {"padding": "5px",
                    "backgroundColor": "#aaaaaa",
                    "width": "100%"}
    Now we add the table to the new div previously created
    tablediv <= table
        
    except:
         document <= "An error occured";*/

    track_features["song popularity"] = track_info["popularity"];

    //console.log(track_info["popularity"]);

    track_features["artist popularity"] = artist_info["popularity"];

    //console.log("artist popularity: " + artist_info["popularity"] + " " + track_features["artist popularity"]);

    if (track_info["explicit"] == false) {
        //console.log("explicit: no");
        track_features["explicit"] = "no";
    } else {
        //console.log("explicit: yes");
        track_features["explicit"] = "yes";
    }

    track_features["release date"] = track_info["album"]["release_date"];
    //console.log("release date: " + track_info["album"]["release_date"]);

    //var first = true;
    //console.log(artist_info["genres"][artist_info["genres"].length-1]);
    if (artist_info["genres"].length == 0) {
        genre_string = "unknown";
    } else if (artist_info["genres"].length == 1) {
        genre_string = artist_info["genres"][0];
    } else {
        var genre_string = ""
        for (let i of artist_info["genres"].keys()) {
            //console.log(i);
            if (artist_info["genres"][i] == artist_info["genres"][artist_info["genres"].length - 1]) {
                genre_string = genre_string + artist_info["genres"][i];
            } else {
                genre_string = genre_string + artist_info["genres"][i] + ", ";
            }
        }
    }
    //tbody <= html.TR(html.TD("genres", Class="text-left", style={"max-width":"80px"}) + html.TD(genre_string, Class="text-left", style={"max-width":"80px"}))
    var tablerow = document.createElement("tr");
    var tabledata1 = document.createElement("td");
    tabledata1.innerHTML = "artist genres";
    tabledata1.classList = "text-left";
    tabledata1.style.maxWidth = "80px";
    var tabledata2 = document.createElement("td");
    tabledata2.innerHTML = genre_string;
    tabledata2.classList = "text-left";
    tabledata2.style.maxWidth = "80px";
    tablerow.append(tabledata1);
    tablerow.append(tabledata2);
    tbody.append(tablerow);

    for (key in track_features) {
        if (key == "key") {
            //console.log("going into key");
            //console.log(song_key_codes);
            for (let cay of song_key_codes.keys()) {
                //console.log(track_features[key] + " " + cay + " hello");
                if (track_features[key] == cay) {
                    track_features[key] = song_key_codes.get(cay);
                }
            }
        }
        if (key == "mode") {
            //console.log("going into mode")
            for (let cay of song_mode_codes.keys()) {
                if (track_features[key] == cay) {
                    track_features[key] = song_mode_codes.get(cay);
                }
            }
        }
        if (key == "type" || key == "uri" || key == "track_href" || key == "analysis_url" || key == "id") {} else {
            //console.log(key + ": " + track_features[key])
            //tbody <= html.TR(html.TD(key, Class="text-left", style={"max-width":"80px"}) + html.TD(track_features[key], Class="text-left", style={"max-width":"80px"}))

            var tablerow = document.createElement("tr");
            var tabledata1 = document.createElement("td");
            tabledata1.innerHTML = key;
            tabledata1.classList = "text-left";
            tabledata1.style.maxWidth = "80px";
            var tabledata2 = document.createElement("td");
            tabledata2.innerHTML = track_features[key];
            tabledata2.classList = "text-left";
            tabledata2.style.maxWidth = "80px";
            tablerow.append(tabledata1);
            tablerow.append(tabledata2);
            tbody.append(tablerow);

            //console.log(key, typeof(track_features[key]))

            val = track_features[key] / 100;
            if (typeof(track_features[key]) == "number" && key != "time signature") {
                if (val == .5) {
                    color = [255, 255, 255];
                }
                /*else if (val < .5) {
                                 color = pickHex([255, 255, 255], [117, 117, 117], val)
                             } */
                else {
                    color = pickHex([255, 0, 0], [255, 255, 255], val);
                }
                colorstring = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
                tabledata2.style.color = colorstring;
                tabledata1.style.color = colorstring;
                //console.log(key, val, typeof(val), tabledata2.style.color)
            }
            //var hue = Math.floor((100 - val) * 220 / 100);  // go from green to red
            //var saturation = Math.abs(val - 50)/50;   // fade to white as it approaches 50

            //console.log($("body")[0].style.backgroundColor, color)
            //$("body")[0].classList = ""
            //val = .500000001
            //$("body")[0].style.backgroundColor = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")" //"hsl(" + hue + ", " + 100 + "%, 50%)"
        }
    }

    table.append(thead);
    table.append(tbody);
    tablediv.append(table);
    rowdiv.append(tablediv);
    container.append(rowdiv);

    generateChart(track_features);

    /*if ($('table').length == 0) {
        //this is the first request and there is no table present
    } else {
        //the table exists already
        $('#rowdiv').remove();
    }
    var rowdiv = document.createElement("div");
    rowdiv.classList = "row";
    rowdiv.id = "rowdiv";
    var tablediv = document.createElement("div");
    tablediv.classList = "col";
    var table = document.createElement("table");
    table.classList = "table table-dark table-sm table-borderless mx-auto mt-3 p-2 rounded-lg shadow";
    table.style.maxWidth = "500px";*/

    searchbutton.innerHTML = "Show me data!";
    searchbutton.disabled = false;
}

function generateChart(track_features) {
    let labels = [];
    let song_data = [];
    for (i in track_features) {
        if (isNumber(track_features[i]) == false || i == "time signature" || i == "release date") {
            delete track_features[i];
        } else {
            track_features[i] = parseFloat(track_features[i]);
            labels.push(capitalize(i));
            song_data.push(track_features[i]);
        }
    }
    //console.log(track_features)
    if ($('#chartdiv')) {
        $('#chartdiv').remove();
    }
    var container = $(".container")[0];
    var chartcontainer = document.createElement("div");
    chartcontainer.style.maxWidth = "500px";
    chartcontainer.style.width = $("table")[0].offsetWidth;
    //console.log($("table")[0].offsetWidth);
    chartcontainer.classList = "mx-auto mt-3 p-2 rounded-lg shadow";
    chartcontainer.id = "chartcontainer";
    var col = document.createElement("div");
    col.classList = "col";
    var rowdiv = document.createElement("div");
    rowdiv.classList = "row";
    rowdiv.id = "chartdiv";
    chartcontainer.innerHTML = '<canvas id="myChart"></canvas>';
    col.append(chartcontainer);
    rowdiv.append(col);
    container.append(rowdiv);
    var ctx = document.getElementById('myChart').getContext('2d');
    ctx.canvas.width = $('#chartcontainer')[0].offsetWidth; // resize to parent width
    //ctx.canvas.height = $('#chartcontainer').height(); // resize to parent height

    //var ctx = document.getElementById('myChart').getContext('2d');
    /*var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: labels, //['Popularity', 'Artist Popularity', 'Danceability', 'Energy', 'Happiness', 'Accousticness', 'Liveness', 'Loudness', 'Instrumentalness']
            datasets: [{
                backgroundColor: '#1DB95433',
                borderColor: '#1DB954',
                borderDash: [],
                pointBackgroundColor: '#1DB954',
                data: song_data //[0, 10, 5, 2, 20, 30, 45, 46, 87]
            }]
        },

        // Configuration options go here
        options: {
            legend: {
                display: false
            },
            scale: {
                pointLabels: {
                    fontColor: 'white',
                    fontSize: '14'
                },
                ticks: {
                    beginAtZero: true,
                    max: 100,
                    stepSize: 20
                }
            }
        }
    });*/

    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'horizontalBar',

        // The data for our dataset
        data: {
            labels: labels, //['Popularity', 'Artist Popularity', 'Danceability', 'Energy', 'Happiness', 'Accousticness', 'Liveness', 'Loudness', 'Instrumentalness']
            datasets: [{
                //backgroundColor: '#1DB954',
                backgroundColor: function(context) {
                    //console.log(context);
                    val = context.dataset.data[context.dataIndex] / 100;
                    if (val == .5) {
                        color = [255, 255, 255];
                    }
                    /*else if (val < .5) {
                                     color = pickHex([255, 255, 255], [117, 117, 117], val)
                                 } */
                    else {
                        color = pickHex([255, 0, 0], [255, 255, 255], val);
                    }
                    return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
                }, //['red', 'blue', 'green', 'brown', 'black', 'orange', 'purple', 'yellow', 'gray'],
                //borderColor: '#1DB954',
                minBarLength: 2,
                //pointBackgroundColor: '#1DB954',
                data: song_data //[0, 10, 5, 2, 20, 30, 45, 46, 87]
            }]
        },

        // Configuration options go here
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "#FFFFFF"
                    }
                }],
                xAxes: [{
                    ticks: {
                        suggestedMax: 100,
                        fontColor: "#FFFFFF",
                        fontSize: 17
                    }
                }]
            }
            /*,
                        animation: {
                            easing: "easeInBounce",
                            duration: 2000
                        }*/
        }
    });
    chart.update();
}

function init() {
    $("#songdata_link").addClass("active");
    var success = getParamsFromURL("songdata");
    sessionStorage.setItem('spotify_auth_state', "test") //sessionStorage.getItem('received_state'))
    //$("#songdata_link")[0].href = "https://spotifydata.com/songdata" + sessionStorage.getItem('raw_hash')
    //$("#userdata_link")[0].href = "https://spotifydata.com/userdata" + sessionStorage.getItem('raw_hash')
    //try {
    if (success & sessionStorage.getItem('received_state') == sessionStorage.getItem('spotify_auth_state')) {
        $("#validationCustom01").keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                if ($("#searchbutton")[0].disabled == false) {
                    searchForTrack();
                }
            }
        });

        $("#searchbutton")[0].addEventListener("click", function() { searchForTrack() });
        //if 
    } else {
        showErrorMessage()
        console.log(success, sessionStorage.getItem('received_state'), sessionStorage.getItem('spotify_auth_state'))
    }
}