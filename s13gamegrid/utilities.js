/*
    Some utilities.
*/
function rand_int(maximum) {
    // Generates a random integer.
    return Math.round(Math.random() * maximum);
};

function title(s) {
    // Turns the first letter of each word into uppercase.
    var x = [];
    $.each(s.split(" "), function() {
        var t = this.toString();
        x.push(t.replace(t.substring(0,1), t.substring(0,1).toUpperCase()));
    });
    return x.join(" ");
};