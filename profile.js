window.onload = function() {
    $("#userdata_link").addClass("active");
    $("#userdata_dropdown a:nth-child(1)").addClass("active");
    var success = getParamsFromURL();
    localStorage.setItem('spotify_auth_state', localStorage.getItem('received_state'));
    if (success & localStorage.getItem('received_state') == localStorage.getItem('spotify_auth_state')) {
        $("#content")[0].style.display = "block";
        loadRequest("https://api.spotify.com/v1/me", displayProfile, 1);
        loadRequest("https://api.spotify.com/v1/me/player/recently-played?limit=50", displayRecentlyPlayed, 1);
        loadRequest("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term", displayTopTracks, 1);
        loadRequest("https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term", displayTopArtists, 1);
        //loadRequest("https://api.spotify.com/v1/me/top/tracks?limit=30&time_range=long_term", displayTopTracks, 1);
    } else {
        $("#errormessage")[0].style.display = "block";
    }
}

function displayProfile(req, identifier) {
    var response = JSON.parse(req.responseText);
    $("#name")[0].innerHTML = response["display_name"];
    $("#id")[0].innerHTML = response["id"];
    $("#id")[0].href = response["external_urls"]["spotify"];
    product = response["product"];
    $("#account_type")[0].innerHTML = product.charAt(0).toUpperCase() + product.slice(1);

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
    if (Object.keys(response["images"]).length > 0) {
        image_url = response["images"][0]["url"];
        console.log(image_url)
        showImage(image_url);
    }
    $("#followers")[0].innerHTML = response["followers"]["total"]
    //$("#following")[0].innerHTML = "N/A"
    $("#country")[0].innerHTML = response["country"]
}

function generateRow(row_title, art_url, track_name, items, type, response) {
    //Generate row
    div = document.createElement("div");
    div.classList = "row";
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
    $("#main_row").append(div);

    //Fill content
    for (var j = 0; j < items; j = j + 1) {
        var album_url = art_url.split('.').reduce(function(o, k) {
            if (k == "j") { k = j; }
            return o && o[k];
        }, response);

        var art = document.createElement("div");
        var link = document.createElement("a");
        link.href = "#";
        link.classList = "cover-item text-center link";
        if (j == 0) {
            div.style = "margin-left: 0;";
        }
        art.style.backgroundImage = "url('" + album_url + "')";
        if (type == "album") {
        	art.classList = "art album";
        	//console.log(type)
        } else {
        	art.classList = "art artist";
        	//console.log(type)
        }
        var text = document.createElement("span");
        text.innerHTML = track_name.split('.').reduce(function(o, k) {
            if (k == "j") { k = j; }
            return o && o[k];
        }, response);
        text.classList = "text-light text-decoration-none";
        text.style.whiteSpace = "normal";
        text.style.wordWrap = "break-word";
        link.append(art);
        link.append(text);
        albumdiv.append(link);
    }
}

function displayRecentlyPlayed(req, identifier) {
    var response = JSON.parse(req.responseText);
    if (Object.keys(response["items"]).length == 0) {
        console.log("No recent tracks");
    } else {
        art_url = 'items.j.track.album.images.0.url';
        track_name = 'items.j.track.name';
        items = items = Object.keys(response["items"]).length;
        generateRow("Recently Played", art_url, track_name, items, "album", response);
    }
}

function displayTopTracks(req, identifier) {
    var response = JSON.parse(req.responseText);
    if (Object.keys(response["items"]).length == 0) {
        console.log("Insufficient play history");
    } else {
        art_url = 'items.j.album.images.0.url';
        track_name = 'items.j.name';
        items = items = Object.keys(response["items"]).length;
        generateRow("Top Tracks", art_url, track_name, items, "album", response);
    }
}

function displayTopArtists(req, identifier) {
    var response = JSON.parse(req.responseText);
    //console.log(response)
    if (Object.keys(response["items"]).length == 0) {
        console.log("Insufficient play history");
    } else {
        art_url = 'items.j.images.0.url';
        track_name = 'items.j.name';
        items = items = Object.keys(response["items"]).length;
        generateRow("Top Artists", art_url, track_name, items, "artist", response);
    }
}