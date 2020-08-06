function init() {
    $("#userdata_link").addClass("active");
    $("#userdata_dropdown a:nth-child(1)").addClass("active");
    $("#content")[0].style.display = "block";
    loadRequest("https://api.spotify.com/v1/me/playlists?limit=50", displayPlaylists, 1);
    console.log(getHashParams()["raw_hash"])
}

addLoadEvent(init);

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

            image.classList = "dot ml-md-0 mr-2 float-left";
            image.style.height = image_size;
            image.style.width = image_size;
            if (num == 1) {
                callback(image, playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id);
            } else if (num == 2) {
                displayPlaylist(image, playlist_name, playlist_songs, playlist_public, playlist_id);
                loadRequest("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks", displaySongs, 1);
            } else {
                console.log("Error!")
            }
        }
    } else {
        image.id = "image";
        image.classList = "dot ml-md-0 mr-2 float-left";
        image.innerHTML = "<svg width='40' height='40.5' color='#88898D' viewBox='0 0 80 81' xmlns='http://www.w3.org/2000/svg' style='margin: 18px'><title>Playlist Icon</title><path d='M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z' fill='currentColor' fill-rule='evenodd'></path></svg>";
        //"<span id='image' class='dot ml-md-0 mr-2'><svg width='40' height='40.5' color='#88898D' viewBox='0 0 80 81' xmlns='http://www.w3.org/2000/svg' style='margin: 18px'><title>Playlist Icon</title><path d='M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z' fill='currentColor' fill-rule='evenodd'></path></svg></span>";
        if (num == 1) {
            callback(image, playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id);
        } else if (num == 2) {
            displayPlaylist(image, playlist_name, playlist_songs, playlist_public, playlist_id);
            loadRequest("https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks", displaySongs, 1);
        } else {
            console.log("Error!")
        }
    }
}

function callback(image, playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id) {
    var table = $("#Playlisttable")[0];
    var row = document.createElement("tr");
    var holder = document.createElement("td");
    holder.classList = "holder";
    holder.id = playlist_name;
    holder.addEventListener("click", function(params) {
        generateImage("120px", playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id, 2)
    }, false)
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

function displayPlaylist(image, playlist_name, playlist_songs, playlist_public, playlist_id) {
    $("#list").hide()
    $("#playlist").show()
    $("#playlist_name").html(playlist_name);
    if (playlist_songs == 1) {
        $("#songs").html(playlist_songs + " song");
    } else {
        $("#songs").html(playlist_songs + " songs");
    }
    if (playlist_public == true) {
        $("#public").html("Public");
    } else {
        $("#public").html("Private");
    }
    $("#pic").append(image);
    var newURL = "playlists#" + playlist_name;
    window.history.pushState({}, document.title, "/" + newURL);
}

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
    console.log(data);
    console.log(data["track"]["artists"].length);
    var table = $("#Songtable")[0];
    var row = document.createElement("tr");
    row.id = data["track"]["id"];
    var name = document.createElement("td");
    name.innerHTML = data["track"]["name"];
    /*holder.addEventListener("click", function(params) {
        generateImage("120px", playlist_image, playlist_name, playlist_songs, playlist_public, playlist_id, 2)
    }, false)*/
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

function displayPlaylists(req, identifier) {
    var response = JSON.parse(req.responseText);
    //console.log(response)
    if (response["total"] > 100 && identifier == 1) {
        loadRequest("https://api.spotify.com/v1/me/playlists?limit=50&offset=50", displayPlaylists, 2);
        loadRequest("https://api.spotify.com/v1/me/playlists?limit=50&offset=100", displayPlaylists, 3);
    } else if (response["total"] > 50 && identifier == 1) {
        loadRequest("https://api.spotify.com/v1/me/playlists?limit=50&offset=50", displayPlaylists, 2);
    }

    for (i in response["items"]) {
        //console.log(i)
        generateImage("80px", response["items"][i]["images"][0], response["items"][i]["name"], response["items"][i]["tracks"]["total"], response["items"][i]["public"], response["items"][i]["id"], 1);
    }
    /*product = response["product"];
    $("#account_type")[0].innerHTML = product.charAt(0).toUpperCase() + product.slice(1);

    if (Object.keys(response["images"]).length > 0) {
        image_url = response["images"][0]["url"];
        console.log(image_url)
        showImage(image_url);
    }*/
}