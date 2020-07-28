window.onload = function() {
    $("#userdata_link").addClass("active");
    $("#userdata_dropdown a:nth-child(1)").addClass("active");
    var success = getParamsFromURL();
    localStorage.setItem('spotify_auth_state', localStorage.getItem('received_state'));
    if (success & localStorage.getItem('received_state') == localStorage.getItem('spotify_auth_state')) {
        $("#content")[0].style.display = "block";
        loadRequest("https://api.spotify.com/v1/me/playlists?limit=50", displayPlaylists, 1);
    } else {
        $("#errormessage")[0].style.display = "block";
    }
}

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

function generateRow(playlist_image, playlist_name, playlist_songs, playlist_public) {
    var image_size = "80px";
    if (playlist_image != null) {
        var myImage = new Image();
        myImage.name = playlist_image["url"];
        myImage.src = playlist_image["url"];
        myImage.onload = function findHHandWW() {
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
            var table = $("#Playlisttable")[0];
            var row = document.createElement("tr");
            //var imgHTML = "<img height='" + imgHeight + "px' width='" + imgWidth + "pxH' src='" + playlist_image["url"] + "'>";
            var name = document.createElement("td");
            name.classList = "align-middle";
            name.innerHTML = playlist_name;
            var songs = document.createElement("td");
            songs.classList = "align-middle";
            var span = document.createElement("span");
            songs.innerHTML = playlist_songs;
            var public = document.createElement("td");
            public.classList = "align-middle";
            if (playlist_public == true) {
                public.innerHTML = "yes";
            } else {
                public.innerHTML = "no";
            }

            var image = document.createElement("span");
            image.style.backgroundImage = 'url("' + playlist_image["url"] + '")';
            image.style.backgroundRepeat = "no-repeat";
            //image.style.backgroundAttachment = "fixed";
            image.style.backgroundPosition = "center";
            image.style.backgroundSize = "cover";

            image.classList = "dot ml-md-0 mr-2";
            image.style.height = image_size;
            image.style.width = image_size;
            name.prepend(image);
            row.append(name);
            row.append(songs);
            row.append(public);
            table.append(row);
        }
    } else {
        var table = $("#Playlisttable")[0];
        var row = document.createElement("tr");
        var image = document.createElement("span");
        image.id = "image";
        image.classList = "dot ml-md-0 mr-2";
        image.innerHTML = "<svg width='40' height='40.5' color='#88898D' viewBox='0 0 80 81' xmlns='http://www.w3.org/2000/svg' style='margin: 18px'><title>Playlist Icon</title><path d='M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z' fill='currentColor' fill-rule='evenodd'></path></svg>";
        //"<span id='image' class='dot ml-md-0 mr-2'><svg width='40' height='40.5' color='#88898D' viewBox='0 0 80 81' xmlns='http://www.w3.org/2000/svg' style='margin: 18px'><title>Playlist Icon</title><path d='M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z' fill='currentColor' fill-rule='evenodd'></path></svg></span>";
        var name = document.createElement("td");
        name.classList = "align-middle";
        name.innerHTML = playlist_name;
        var songs = document.createElement("td");
        songs.classList = "align-middle";
        songs.innerHTML = playlist_songs;
        var public = document.createElement("td");
        public.classList = "align-middle";
        if (playlist_public == true) {
            public.innerHTML = "yes";
        } else {
            public.innerHTML = "no";
        }

        name.prepend(image);
        row.append(name);
        row.append(songs);
        row.append(public);
        table.append(row);
    }
}

function displayPlaylists(req, identifier) {
    var response = JSON.parse(req.responseText);
    console.log(response)
    if (response["total"] > 100 && identifier == 1) {
        loadRequest("https://api.spotify.com/v1/me/playlists?limit=50&offset=50", displayPlaylists, 2);
        loadRequest("https://api.spotify.com/v1/me/playlists?limit=50&offset=100", displayPlaylists, 3);
    } else if (response["total"] > 50 && identifier == 1) {
        loadRequest("https://api.spotify.com/v1/me/playlists?limit=50&offset=50", displayPlaylists, 2);
    }

    for (i in response["items"]) {
        console.log(i)
        generateRow(response["items"][i]["images"][0], response["items"][i]["name"], response["items"][i]["tracks"]["total"], response["items"][i]["public"]);
    }
    /*product = response["product"];
    $("#account_type")[0].innerHTML = product.charAt(0).toUpperCase() + product.slice(1);

    if (Object.keys(response["images"]).length > 0) {
        image_url = response["images"][0]["url"];
        console.log(image_url)
        showImage(image_url);
    }*/
}