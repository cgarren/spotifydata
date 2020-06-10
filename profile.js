window.onload = function() {
    $("#userdata_link").addClass("active");
    $("#userdata_dropdown a:nth-child(1)").addClass("active");
    var success = getParamsFromURL();
    localStorage.setItem('spotify_auth_state', localStorage.getItem('received_state'))
    //try {
    if (success & localStorage.getItem('received_state') == localStorage.getItem('spotify_auth_state')) {
        //$("#dataform")[0].style.display = "block"
        //$("#searchbutton").onclick() = searchForTrack();
        loadRequest("https://api.spotify.com/v1/me", myfunc, 1)
        //$("#searchbutton")[0].addEventListener("click", function() { searchForTrack() });
    } else {
        //$("#errormessage")[0].style.display = "block"
        //console.log(success, localStorage.getItem('received_state'), localStorage.getItem('spotify_auth_state'))
    }
}

function myfunc(req, identifier) {
	var response = req.responseText
	console.log(response)
}