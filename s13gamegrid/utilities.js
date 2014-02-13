/*
    Some utilities and shortcuts.
*/
function keys(dict) {
    return Object.keys(dict);
}

function rand_chance(dict) {
    // Returns a randomly picked key from a dict of items with odds in 100.
    var choices = [];
    $.each(keys(dict), function() {
        if (rand_int(100) < dict[this]) choices.push(this);
    });
    return rand_choice(choices);
}

function rand_choice(list) {
    // Returns a randomly picked item from a list.
    return list[rand_int(list.length-1)];
}

function rand_int(maximum) {
    // Generates a random integer.
    return Math.round(Math.random() * maximum);
}

function title(s) {
    // Turns the first letter of each word into uppercase.
    var x = [];
    $.each(s.split(" "), function() {
        var t = this.toString();
        x.push(t.replace(t.substring(0,1), t.substring(0,1).toUpperCase()));
    });
    return x.join(" ");
}