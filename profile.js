function init() {
    $("#userdata_link").addClass("active");
    $("#userdata_dropdown a:nth-child(1)").addClass("active");
    $("#content")[0].style.display = "block";
    $("body")[0].style.color = properties.TEXT_COLOR;
    $("#id")[0].style.color = properties.TEXT_COLOR;
    createClass('.art:hover .overlay{ box-shadow: 0 0rem 1rem ' + properties.SELECTED_COLOR + '; display: block;}'); //background-color: ' + properties.SELECTED_COLOR + ' }')
    loadRequest("https://api.spotify.com/v1/me/tracks?limit=1", displayProfile, 2);
    loadRequest("https://api.spotify.com/v1/me", displayProfile, 1);
    loadRequest("https://api.spotify.com/v1/me/player/recently-played?limit=50", displayRecentlyPlayed, 1);
    loadRequest("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term", displayTopTracks, 1);
    loadRequest("https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term", displayTopArtists, 1);
    var slider = new Slider('#ex1', {
        formatter: function(value) {
            if (value == 1) {
                value = "4 Weeks";
            } else if (value == 2) {
                value = "6 Months";
            } else {
                value = "Years";
            }
            return value;
        }
    });
    slider.on("change", function() {
        if (slider.getValue() == 1) {
            loadRequest("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=short_term", displayTopTracks, 1);
            loadRequest("https://api.spotify.com/v1/me/top/artists?limit=50&time_range=short_term", displayTopArtists, 1);
        } else if (slider.getValue() == 2) {
            loadRequest("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term", displayTopTracks, 1);
            loadRequest("https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term", displayTopArtists, 1);
        } else {
            loadRequest("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term", displayTopTracks, 1);
            loadRequest("https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term", displayTopArtists, 1);
        }
    });
}

function showImage(imgPath) {
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
        $("#image")[0].innerHTML = "<img height='" + imgHeight + "px' width='" + imgWidth + "pxH' src='" + image_url + "'>";
        $("#image").removeClass("dot");
    }
}

function generateDivider() {
    divider = document.createElement("div");
    divider.style.borderBottom = "3px solid green";
    $("#stats").append(divider);
}

function displayProfile(req, identifier) {
    if (req.status != 401) {
        var response = JSON.parse(req.responseText);
    } else {
        //Object to use in the case of bad user login
        response = {
            "total": "?",
            "display_name": "Unknown User",
            "id": "Unknown",
            "external_urls": {
                "spotify": ""
            },
            "product": "unknown",
            "images": [],
            "followers": {
                "total": "?"
            },
            "country": "?"
        }
        $("#slider").hide()
    }
    if (response["total"] && identifier == 2) {
        generateLargeStat("Liked Songs", response["total"], true, "stats");
        //generateDivider();
    } else {
        $("#name")[0].innerHTML = response["display_name"];
        $("#id")[0].innerHTML = response["id"];
        $("#id")[0].href = response["external_urls"]["spotify"];
        product = response["product"];
        $("#account_type")[0].innerHTML = product.charAt(0).toUpperCase() + product.slice(1);

        if (Object.keys(response["images"]).length > 0) {
            image_url = response["images"][0]["url"];
            console.log(image_url)
            showImage(image_url);
        }

        generateLargeStat("Followers", response["followers"]["total"], true, "stats");
        //generateDivider();
        //generateLargeStat("Following", response["followers"]["total"], true, "stats");
        //generateDivider();
        generateLargeStat("Country", response["country"], false, "stats");
        //generateDivider();
    }
}

function generateRow(row_title, art_url, track_name, popularity, items, type, response) {
    let row_id = row_title.replace(/\s+/g, '');
    if ($("#" + row_id.length)) {
        $("#" + row_id).remove();
    }
    //Generate row
    div = document.createElement("div");
    div.classList = "row";
    div.id = row_id;
    title = document.createElement("div");
    title.classList = "col h2";
    title.innerHTML = row_title;
    col = document.createElement("div");
    col.classList = "col-12";
    albumdiv = document.createElement("div");
    albumdiv.classList = "cover-container";
    col.append(albumdiv);
    div.append(title);
    div.append(col);
    $("#" + row_id + "div").append(div);

    //Fill content
    var avgpop = 0;
    for (var j = 0; j < items; j = j + 1) {
        var album_url = art_url.split('.').reduce(function(o, k) {
            if (k == "j") { k = j; }
            return o && o[k];
        }, response);

        var art = document.createElement("div");
        var link = document.createElement("a");
        var overlay = document.createElement("div");
        link.href = "#";
        link.classList = "cover-item text-center text-decoration-none";
        if (j == 0) {
            div.style = "margin-left: 0;";
        }
        art.style.backgroundImage = "url('" + album_url + "')";
        //overlay.title = j + 1;
        overlay.innerHTML = j + 1;
        if (type == "album") {
            art.classList = "art album";
            overlay.classList = "overlay album";
        } else {
            art.classList = "art artist";
            overlay.classList = "overlay artist";
            //console.log(type)
        }
        art.append(overlay)
        var text = document.createElement("span");
        //text.innerHTML = j+1 + ". " + track_name.split('.').reduce(function(o, k) { //Uncomment this to include numbers
        text.innerHTML = track_name.split('.').reduce(function(o, k) {
            if (k == "j") { k = j; }
            return o && o[k];
        }, response);
        avgpop = avgpop + popularity.split('.').reduce(function(o, k) {
            if (k == "j") { k = j; }
            return o && o[k];
        }, response);

        text.classList = "text-decoration-none";
        text.style.color = properties.TEXT_COLOR;
        text.style.whiteSpace = "normal";
        text.style.wordWrap = "break-word";
        $clamp(text, {clamp: 2});
        link.append(art);
        link.append(text);
        albumdiv.append(link);
        /*art.addEventListener("mouseover", function() {
            if (event.target.classList.contains("art")) {
                event.target.firstChild.innerHTML = event.target.firstChild.title;
                event.target.firstChild.style.display = "block";
                event.target.firstChild.title = "";
            }
        });
        overlay.addEventListener("mouseout", function() {
            event.target.style.display = "none";
            event.target.title = event.target.innerHTML;
            event.target.innerHTML = "";
        });*/
    }
    avgpopularity = document.createElement("span");
    avgpopularity.innerHTML = "Avg popularity: " + avgpop / 50;
    avgpopularity.classList = "text-white-50 h5"
    title.append(document.createElement("br"))
    title.style.lineHeight = ".7em";
    title.append(avgpopularity);
}

function displayRecentlyPlayed(req, identifier) {
    if (req.status != 401) {
        var response = JSON.parse(req.responseText);
    } else {
        //Object to use in the case of bad user login
        response = {
            "items": []
        }
    }
    if (Object.keys(response["items"]).length == 0) {
        console.log("No recent tracks");
    } else {
        art_url = 'items.j.track.album.images.0.url';
        track_name = 'items.j.track.name';
        popularity = 'items.j.track.popularity';
        items = items = Object.keys(response["items"]).length;
        generateRow("Recently Played", art_url, track_name, popularity, items, "album", response);
        generateLargeStat("since end of last song", convertISOTime(response["items"][0]["played_at"], true), false, "stats");
    }
}

function displayTopTracks(req, identifier) {
    if (req.status != 401) {
        var response = JSON.parse(req.responseText);
    } else {
        //Object to use in the case of bad user login
        response = {
            "items": []
        }
    }
    if (Object.keys(response["items"]).length == 0) {
        console.log("Insufficient play history");
    } else {
        art_url = 'items.j.album.images.0.url';
        track_name = 'items.j.name';
        popularity = 'items.j.popularity';
        items = items = Object.keys(response["items"]).length;
        generateRow("Top Tracks", art_url, track_name, popularity, items, "album", response);
    }
}

function displayTopArtists(req, identifier) {
    if (req.status != 401) {
        var response = JSON.parse(req.responseText);
    } else {
        //Object to use in the case of bad user login
        response = {
            "items": []
        }
    }
    if (Object.keys(response["items"]).length == 0) {
        console.log("Insufficient play history");
    } else {
        art_url = 'items.j.images.0.url';
        track_name = 'items.j.name';
        popularity = 'items.j.popularity';
        items = items = Object.keys(response["items"]).length;
        generateRow("Top Artists", art_url, track_name, popularity, items, "artist", response);
    }
}