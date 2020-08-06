function getParamsFromURL() {
    try {
        var hashParams = getHashParams()
        localStorage.setItem('access_token', hashParams["access_token"]);
        localStorage.setItem('received_state', hashParams["state"]);
        localStorage.setItem('raw_hash', hashParams["raw_hash"])
        var myNewURL = "songdata";//the new URL
        window.history.replaceState({}, document.title, "/" + myNewURL );
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

function loadRequest(url, callbackFunction, identifier) {
    var xhttp;
    var oauth_id = localStorage.getItem('access_token');
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
    $('.alert').alert('close')
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
            $("#userdata_dropdown a:nth-child(5)").hide() //[0].href = "https://spotifydata.com/profile";
            $("#userdata_dropdown a:nth-child(6)").hide() //[0].href = "https://spotifydata.com/profile";
        } else {
            $("#songdata_link")[0].href = "https://spotifydata.com/songdata"// + localStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(1)")[0].href = "https://spotifydata.com/profile"// + localStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(2)").hide() //[0].href = "https://spotifydata.com/profile" + localStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(3)").hide() //[0].href = "https://spotifydata.com/profile" + localStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(4)").hide() //[0].href = "https://spotifydata.com/profile" + localStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(5)").hide() //[0].href = "https://spotifydata.com/profile" + localStorage.getItem('raw_hash');
            $("#userdata_dropdown a:nth-child(6)").hide() //[0].href = "https://spotifydata.com/profile" + localStorage.getItem('raw_hash');
        }
    });
}

addLoadEvent(load);

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})