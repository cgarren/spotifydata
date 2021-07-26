const properties = new Object();
properties.BACKGROUND_COLOR = 'black';
properties.TEXT_COLOR = 'white';
properties.SECONDARY_BACKGROUND_COLOR = '#1DB954';
properties.SECONDARY_TEXT_COLOR = 'black';
properties.HELPING_TEXT_COLOR = 'grey';
properties.SPECIAL_TEXT_COLOR = '#1DB954';
properties.SELECTED_COLOR = '#1DB954';

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

/*function calcDate(date1, date2) {
    //below
    var diffa = Math.floor(date1.getTime() - date2.getTime());
    var day = 1000 * 60 * 60 * 24;
    var days = Math.floor(diffa / day);
    var months = Math.floor(days / 31);
    var years = Math.floor(months / 12);
    var message = '';
    if (years != 0) {
        message = years + " year(s) ago \n"
    } else if (months != 0) {
        message = months + " month(s) ago \n"
    } else if (days != 0) {
        message = days + " day(s) ago \n"
    } else {
        message = "today";
    }
    return message
}*/

function convertISOTime(date, compute_time_since) {
    var date = new Date(date);
    if (compute_time_since == true) {
        var now = new Date();
        var millis = Math.floor(now - date);
        //console.log(now, date, now-date, Math.floor(now - date), millis)
    } else {
        var millis = Math.floor(date);
        return date
    }
    /*
    var seconds = (millis / 1000) % 60;
    seconds = Math.floor(seconds);
    var minutes = (millis / (1000 * 60)) % 60;
    minutes = Math.floor(minutes);
    var hours = (millis / (1000 * 60 * 60)) % 24;
    hours = Math.floor(hours);
    var days = Math.floor(millis / (1000 * 60 * 60 * 24));
    */

    seconds = Math.floor(millis / 1000);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    days = Math.floor(hours / 24);
    hours = hours % 24;

    //console.log(millis, seconds, minutes, hours, days)

    if (minutes == 0 && hours == 0 && days == 0) {
        return seconds + "s";
    } else if (hours == 0 && days == 0) {
        return minutes + "m " + seconds + "s";
    } else if (days == 0) {
        return hours + "h " + minutes + "m";
    } else {
        return days + "d " + hours + "h";
    }
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
    dismissAlert()
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
    id = "alert" + Math.floor((Math.random() * 10000000) + 1);
    alert.id = id
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
    if (time != 0) {
        window.setTimeout(function() { dismissAlert(id); }, time);
    }
}

function showErrorMessage() {
    dismissAlert();
    showAlert('<div id="error">Uh Oh, there was a problem logging you in with Spotify! A Spotify account is required to access all features of this site.<a class="btn btn-danger float-right" id="loginbutton" href="https://spotifydata.com">Go to login page</a></div>', "alert-danger", 0);
    //$("#content")[0].style.display = "none";
    //$("#feedbackButton")[0].style.display = "none";
    //$("#errormessage")[0].style.display = "block";
}

function loadRequest(url, callbackFunction, identifier, noauth) {
    var xhttp;
    var oauth_id = sessionStorage.getItem('access_token');
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 200 || this.status == 503 || this.status == 429)) {
            if (callbackFunction != null) {
                callbackFunction(this, identifier);
            }
        } else if (this.status == 401) {
            console.log("401: Access token unauthorized");
            if ($('#error').length == 0) {
                showErrorMessage()
            }
            if (callbackFunction != null) {
                callbackFunction(this, identifier);
            }
            this.abort();
        }
    };
    xhttp.ontimeout = function(e) {
        console.log("Request timed out: " + url);
    }
    xhttp.open("GET", url, true);
    if (noauth != true) {
        xhttp.setRequestHeader("Authorization", "Bearer " + oauth_id);
    }
    //xhttp.setRequestHeader("Accept", "application/json");
    xhttp.timeout = 10000;
    try {
        xhttp.send();
    } catch (e) {
        console.log(e);
    }
}

function loadRequestv2(url, identifier) {
    var oauth_id = sessionStorage.getItem('access_token');
    return fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + oauth_id,
        }
    }).then(function(response) {
        return response.json();
    }).catch(function(error) {
        if (error.status == 401) {
            if ($('#error').length == 0) {
                showErrorMessage();
            }
        }
        return error;
    });
}

function dismissAlert(id) {
    try {
        if (id) {
            $('#' + id).alert('close');
        } else
            $('.alert').alert('close');
    } catch {
        console.log("Error!!!");
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateLargeStat(name, value, is_link, div_id, id) {
    if (is_link == false) {
        songs = document.createElement("div");
        songs.style.cursor = "default";
    } else {
        songs = document.createElement("a");
        songs.style.cursor = "pointer";
    }
    songs.classList = "text-decoration-none text-nowrap display-3 shadow text_color_prop hover_1";
    span = document.createElement("span");
    span.style.fontFamily = "'Squada One', cursive";
    //span.style.color = "#1DB954"
    //span.style.fontSize = "5vw";
    span.style.lineHeight = ".7em";
    //span.classList = "display-3"
    span.innerHTML = value;
    label = document.createElement("h3");
    label.classList = "mb-3 text-wrap helping_text_color_prop";
    label.innerHTML = name;
    songs.append(span);
    songs.append(label);
    $("#" + div_id).append(songs);
    return songs;
}

function openFeedbackModal() {
    $('#feedbackModal').modal('show');
}

function sendFeedback() {
    $('#feedback-submit').html("Submitting...");
    name = $('#feedback-name').val();
    email = $('#feedback-email').val();
    message = $('#feedback-message-text').val();
    try {
        if (sessionStorage.getItem("user_name") != "null") {
            feedback = {
                "name": name,
                "email": email,
                "message": message,
                "user_name": sessionStorage.getItem("user_name"),
                "user_id": sessionStorage.getItem("user_id"),
                "account_email": sessionStorage.getItem("email"),
                "product": sessionStorage.getItem("product"),
                "account_type": sessionStorage.getItem("account_type"),
                "country": sessionStorage.getItem("country"),
                "status": "User logged in"
            };
        } else {
            throw "User not logged in"
        }
    } catch (err) {
        feedback = {
            "name": name,
            "email": email,
            "message": message,
            "status": err
        };
    }

    feedback = JSON.stringify(feedback);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            $('#feedback-name').val("");
            $('#feedback-message-text').val("");
            $('.modal-form').hide();
            $('.modal-success').show();
            setTimeout(function() {
                $('#feedbackModal').modal('hide');
                setTimeout(() => {
                    $('#feedback-submit').html("Send message");
                    $('.modal-form').show();
                    $('.modal-success').hide();
                }, 2000)
            }, 2500);
        } else if (this.status == 401) {
            console.log("Error: Status 401");
            showAlert("Uh Oh, There was an error submitting your feedback! Please try again", "alert-danger", 5000);
        }
    };
    xhttp.ontimeout = function(e) {
        console.log("Request timed out: " + url);
        showAlert("Uh Oh, There was an error submitting your feedback! Please try again", "alert-danger", 5000);
    }
    xhttp.open("POST", "https://q89isgseci.execute-api.us-east-1.amazonaws.com/feedback", true);
    xhttp.timeout = 10000;
    xhttp.send(feedback);
}

function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function generateSmallStat(name, value, is_link, div_id, custom_value_color) {
    if (is_link == false) {
        songs = document.createElement("div");
        songs.style.cursor = "default";
    } else {
        songs = document.createElement("a");
        songs.style.cursor = "pointer";
    }
    songs.classList = "text-decoration-none text-nowrap display-3 text-right text_color_prop hover_1";
    /*span = document.createElement("span");
    span.style.fontFamily = "'Squada One', cursive";
    //span.style.color = "#1DB954"
    //span.style.fontSize = "5vw";
    span.style.lineHeight = ".7em";
    //span.classList = "display-3"
    span.innerHTML = value;*/
    label = document.createElement("h3");
    label.classList = "mb-3 text-wrap text-left";
    span = document.createElement("span");
    span.classList = "text-right";
    span.style.color = custom_value_color;
    //label.style.color = "#1d9146"
    label.innerHTML = name + ": ";
    span.innerHTML = value;
    label.append(span)
    songs.append(label);
    $("#" + div_id).append(songs)
    return songs;
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
        sessionStorage.setItem("user_id", results["id"]);
        sessionStorage.setItem("email", results["email"]);
        sessionStorage.setItem("product", results["product"]);
        sessionStorage.setItem("account_type", results["type"]);
        sessionStorage.setItem("country", results["country"]);
        //$("#user_name")[0].innerHTML = results["display_name"];
    } else {
        sessionStorage.setItem("user_name", null);
        console.log("Error getting user's name");
    }
}

function showDetailsModal(e) {
    console.log(e);
    $('#songModal').modal('show');
    //$('body').css('opacity', '50%');
}

function logout() {
    const user_name = sessionStorage.getItem("user_name");
    sessionStorage.clear();
    localStorage.clear();
    localStorage.setItem("logged out", "true");
    console.log(user_name + " logged out successfully" + window.status);
    window.location.href = "https://spotifydata.com/";
}

function footerAlign() {
    var footerHeight = $('footer').outerHeight();
    $('body').css('margin-bottom', footerHeight);
    $('footer').css('height', footerHeight);
}

$(window).resize(function() {
    footerAlign();
});

function createClass(css) {
    //var css = 'table td:hover{ background-color: #00ff00 }';
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName('head')[0].appendChild(style);

}

function load() {
    $('head').prepend('<script type="application/ld+json">{"isAccessibleForFree": "False", "hasPart": {"@type": "WebPageElement","isAccessibleForFree": "False","cssSelector": "#content"}}</script>');
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
        $.get('footer.html', function(data) {
            $('body').append(data);
            footerAlign();
        });
        init();
        $.get('modal.html', function(data) {
            $('body').prepend(data);
        });
        var checkLoginInterval = window.setInterval(loadRequest("https://api.spotify.com/v1/me", getName, 1), 60000);
    });
}

addLoadEvent(load);

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})