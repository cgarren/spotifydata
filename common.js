function getParamsFromURL(new_url) {
    try {
        var hashParams = getHashParams()
        if (hashParams["raw_hash"] == '') {

        } else {
            sessionStorage.setItem('access_token', hashParams["access_token"]);
            sessionStorage.setItem('received_state', hashParams["state"]);
            sessionStorage.setItem('raw_hash', hashParams["raw_hash"]);
        }
        var myNewURL = new_url; //the new URL
        window.history.replaceState({}, document.title, "/" + myNewURL);
        return true;
    } catch (err) {
        console.log(err.message)
        return false;
    }
}

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    hashParams['raw_hash'] = window.location.hash
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

function convertMilliseconds(millis) {
    millis = Math.floor(millis);
    var seconds = (millis / 1000) % 60;
    seconds = Math.floor(seconds);
    var minutes = (millis / (1000 * 60)) % 60;
    minutes = Math.floor(minutes);
    var hours = (millis / (1000 * 60 * 60)) % 24;
    hours = Math.floor(hours);

    if (hours == 0) {
        return minutes + "m " + seconds + "s";
    } else {
        return hours + "h " + minutes + "m " + seconds + "s";
    }
}

function showAlert(message, type, time) {
    //message can be HTML
    //time = 0 means alert never expires, in ms
    /*  TYPES OF ALERTS
    alert-danger
    alert-primary
    alert-secondary
    alert-success
    alert-warning
    alert-info
    alert-light
    alert-dark
    */
    alertdiv = $(".alertdiv")[0];
    alert = document.createElement("div");
    alert.innerHTML = message;
    alert.classList = "alert alert-dismissible fade show";
    alert.classList.add(type)
    alert.setAttribute("role", "alert");
    button = document.createElement("button");
    button.type = "button";
    button.classList = "close";
    button.setAttribute("data-dismiss", "alert");
    button.setAttribute("aria-label", "Close");
    close = document.createElement("span");
    close.innerHTML = "&times;";
    close.setAttribute("aria-hidden", "true");
    button.append(close);
    alert.append(button);
    alertdiv.append(alert);
    try {
        $("#searchbutton")[0].innerHTML = "Show me data!";
        $("#searchbutton").prop("disabled", false);
    } catch {

    }
    if (time != 0) {
        window.setTimeout(dismissAlert, time);
    }
}

function loadRequest(url, callbackFunction, identifier) {
    var xhttp;
    var oauth_id = sessionStorage.getItem('access_token');
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callbackFunction(this, identifier);
        } else if (this.status == 401) {
            console.log("401: Access token unauthorized")
            $("#content")[0].style.display = "none"
            $("#errormessage")[0].style.display = "block"
        }
    };
    xhttp.ontimeout = function(e) {
        console.log("Request timed out: " + url)
    }
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Authorization", "Bearer " + oauth_id)
    xhttp.timeout = 10000
    xhttp.send();
}

function dismissAlert() {
    try {
        $('.alert').alert('close');
    } catch {
        console.log("No alert to dismiss !");
    }
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

function getName(req) {
    if (req.status == 200 || req.status == 0) {
        results = JSON.parse(req.responseText);
        sessionStorage.setItem("user_name", results["display_name"]);
        formatName(results["display_name"]);
    } else {
        console.log("Error getting user's name")
    }
}

function formatName(name) {
    console.log(name)
    $("#user_name")[0].innerHTML = name;
}

function logout() {
    const user_name = sessionStorage.getItem("user_name");
    sessionStorage.clear();
    localStorage.clear();
    console.log(user_name + " logged out successfully" + window.status)
    window.location.href = "https://spotifydata.com/"
}

function load() {
    //Sentry.init({ dsn: 'https://a9b82693f9054fa0b17303176592ca64@o429548.ingest.sentry.io/5376381' });
    $.get('nav.html', function(data) {
        $('body').prepend(data);
        if (true) {
            $("#songdata_link")[0].href = "https://spotifydata.com/songdata";
            $("#userdata_dropdown a:nth-child(1)")[0].href = "https://spotifydata.com/profile";
            $("#userdata_dropdown a:nth-child(2)").hide() //[0].href = "https://spotifydata.com/profile";
            $("#userdata_dropdown a:nth-child(3)").hide() //[0].href = "https://spotifydata.com/profile";
            $("#userdata_dropdown a:nth-child(4)").hide() //[0].href = "https://spotifydata.com/profile";
            $("#userdata_dropdown a:nth-child(5)")[0].href = "https://spotifydata.com/playlists";
            $("#userdata_dropdown a:nth-child(6)").hide() //[0].href = "https://spotifydata.com/profile";
        } else {
            $("#songdata_link")[0].href = "https://spotifydata.com/songdata" // + sessionStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(1)")[0].href = "https://spotifydata.com/profile" // + sessionStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(2)").hide() //[0].href = "https://spotifydata.com/profile" + sessionStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(3)").hide() //[0].href = "https://spotifydata.com/profile" + sessionStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(4)").hide() //[0].href = "https://spotifydata.com/profile" + sessionStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(5)")[0].href = "https://spotifydata.com/playlists" // + sessionStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(6)").hide() //[0].href = "https://spotifydata.com/profile" + sessionStorage.getItem('raw_hash');
        }
        init();
        $.get('footer.html', function(data) {
            $('body').append(data);
        });
        if (sessionStorage.getItem("user_name") == null) {
            loadRequest("https://api.spotify.com/v1/me", getName, 1);
        } else {
            formatName(sessionStorage.getItem("user_name"));
        }
    });
}

addLoadEvent(load);

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})