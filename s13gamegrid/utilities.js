/*
    Some utilities and shortcuts.
*/
function has_key(dict, key) {
    // Checks whether a dict has a key.
    return keys(dict).indexOf(key) >= 0;
}

function in_range(current_value, low_value, high_value) {
    // Checks whether current_value is within low_ and high_value. Inclusive.
    return current_value >= low_value && current_value <= high_value;
}

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