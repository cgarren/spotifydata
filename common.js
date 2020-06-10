function getParamsFromURL() {
    try {
        var hashParams = getHashParams()
        localStorage.setItem('access_token', hashParams["access_token"]);
        localStorage.setItem('received_state', hashParams["state"]);
        localStorage.setItem('raw_hash', hashParams["raw_hash"])
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

$.get('nav.html', function(data){
    $('body').prepend(data);
    $("#songdata_link")[0].href = "https://spotifydata.ml/songdata" + localStorage.getItem('raw_hash')
    $("#userdata_dropdown a:nth-child(1)")[0].href = "https://spotifydata.ml/profile" + localStorage.getItem('raw_hash')
    $("#userdata_dropdown a:nth-child(2)")[0].href = "https://spotifydata.ml/profile" + localStorage.getItem('raw_hash')
    $("#userdata_dropdown a:nth-child(3)")[0].href = "https://spotifydata.ml/profile" + localStorage.getItem('raw_hash')
    $("#userdata_dropdown a:nth-child(4)")[0].href = "https://spotifydata.ml/profile" + localStorage.getItem('raw_hash')
    $("#userdata_dropdown a:nth-child(5)")[0].href = "https://spotifydata.ml/profile" + localStorage.getItem('raw_hash')
    $("#userdata_dropdown a:nth-child(6)")[0].href = "https://spotifydata.ml/profile" + localStorage.getItem('raw_hash')
});

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})