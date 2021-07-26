function init() {
    dismissAlert()
    var h = window.innerHeight - (26 + 58)
    document.getElementById("holder-row").setAttribute("style","height:" + h + "px");
    //createClass('.entry { color: ' + properties.TEXT_COLOR + '}');
    //createClass('.text-link { color: ' + properties.SPECIAL_TEXT_COLOR + '}');
    //createClass('.text-link:hover { color: ' + properties.SPECIAL_TEXT_COLOR + '}');
    //createClass('.quote { font-size: 1.2em; padding: 1em; background-color: ' + properties.SECONDARY_BACKGROUND_COLOR + '; color: ' + properties.SECONDARY_TEXT_COLOR + ';}');
    //createClass('.entry:hover{ box-shadow: 0 0rem 1rem .1rem' + properties.SELECTED_COLOR + '; cursor: pointer; color: ' + properties.SPECIAL_TEXT_COLOR + ';}');
    $.get('faq.json', function(data) {
    	var i = 1;
        for (const [sectionTitle, questions] of Object.entries(data.sections)) {
            createSidebarHeader(sectionTitle);
            createSectionHeader(sectionTitle);
            for (q of questions.questions) {
            	var j=0;
            	if (j == 0) {
            		createQuestionRow(q, true, i);
            	} else {
            		createQuestionRow(q, false, i);
            	}
                createSidebarRow(q, i);
                i = i + 1;
                j = j + 1;
            }
        }
    });
}

function createSidebarHeader(header) {
    entry = document.createElement("div");
    entry.classList = "text-wrap special_text_color_prop";
    label = document.createElement("h5");
    label.classList = "m-2 text-left";
    label.innerHTML = header;
    entry.append(label);
    $("#sidebar").append(entry);
}

function createSectionHeader(header) {
    entry = document.createElement("div");
    entry.classList = "row m-0 mt-4 text-wrap";
    //entry.style.color = properties.TEXT_COLOR;
    label = document.createElement("div");
    label.classList = "text-left h3 special_text_color_prop";
    label.style.fontSize = "60px";
    label.innerHTML = header;
    entry.append(label);
    $("#faq-holder").append(entry);
}

function createQuestionRow(q, first, id) {
    entry = document.createElement("div");
    if (first = true) {
        entry.classList = "row m-0 mb-2 text-wrap rounded";
    } else {
    	entry.classList = "row m-0 mt-4 mb-2 text-wrap rounded";
    }
    entry.id = id;
    holder = document.createElement("div");
    holder.classList = "col";
    //entry.style.color = properties.TEXT_COLOR;
    var collapseid = id + 1000;
    question = document.createElement("div");
    question.dataset.toggle = "collapse";
    question.setAttribute("aria-expanded", "false");
    question.setAttribute("aria-controls", collapseid);
    //question.aria.controls=collapseid;
    question.href="#" + collapseid;
    question.classList = "text-left h1 d-block text_color_prop";
    question.innerHTML = q.question;
    answer = document.createElement("p");
    answer.id = collapseid;
    answer.classList = "text-left collapse";
    answer.classList = "text-left";
    answer.style.fontSize = "1.2em";
    answer.innerHTML = q.answer;
    holder.append(question);
    holder.append(answer);
    entry.append(holder);
    $("#faq-holder").append(entry);
}

function createSidebarRow(q, id) {
    entry = document.createElement("a");
    entry.href = "#" + id;
    entry.classList = "text-decoration-none text-wrap entry d-block rounded text_color_prop hover_2";
    //entry.innerHTML = "hellothere"
    //entry.style.color = properties.TEXT_COLOR;
    label = document.createElement("p");
    label.classList = "m-2 text-left";
    label.innerHTML = q.question;
    entry.append(label);
    $("#sidebar").append(entry);
}

function generateSmallStat(name, value, is_link, div_id, custom_value_color) {
    if (is_link == false) {
        songs = document.createElement("div");
        songs.style.cursor = "default";
    } else {
        songs = document.createElement("a");
        songs.href = "#";
    }
    songs.classList = "text-decoration-none text-nowrap display-3 text-right text_color_prop";
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
}