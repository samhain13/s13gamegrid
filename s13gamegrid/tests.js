function test_rand_chance() {
    var dict = {"m": 47, "n": 50, "o": 22, "p": 85, "q": 60, "r": 56};
    var scores = {};
    var result = [];
    var total = 0;
    $.each(keys(dict), function() {
        scores[this] = 0;
    });
    for (var i=0; i<1000; i++) {
        var x = rand_chance(dict);
        if (x != undefined) scores[x] += 1;
    }
    var result = [];
    $.each(keys(scores), function() {
        result.push(this + ": " + scores[this] + ": odds " + dict[this]);
        total += scores[this];
    });
    console.log("\n" + result.join("\n"));
    console.log("total: " + total);
}