var seconds_per_turn = 2;      // Basically, setInterval value * 1000
var home_box = null;
var selected_box = null;
var game_interval = null;
var game_alive = true;         // False on game over?

// Set the player's and game stats here.
var game_stats = {
    "game time": {
        "day":           1,
        "hour":    "07:00",
    },
    "essentials": {
        "control":      100,    // game over when 0 or less
        "electricity":    0,    // supplied by batteries
        "rations":       28,    // supplied by food tins
        "water":          0,    // supplied by water jugs
    },
    "people": {
        // Different types of people give bonuses to different gridbox_types.
        "refugees":       4,    // stock person type
    },
    "other supplies": {
        "ammunition":     0,    // for security/combat
        "construction":   0,    // for building structures like windmills
        "batteries":      0,    // for storing energy
        "food tins":      0,    // for making rations
        "water bottles": 10,    // for getting water
    },
};

function get_people(num) {
    // Get num number of people from the game_stats. Returns an array of
    // the types of people that have been randomly selected.
    if (num >= get_consumers()) return [];
    var people = [];
    while (people.length != num) {
        var p = rand_choice(Object.keys(game_stats["people"]));
        people.push(p);
        game_stats["people"][p] -= 1;
        if (game_stats["people"][p] <= 0) delete game_stats["people"][p];
    }
    return people;
}

function get_reward(kind, max_amount) {
    // Picks a random "other supplies" or "people" type and adds a random
    // number of it to game_stats. Returns what was selected so it can be
    // reported back to the player.
    if (kind == "people") {
        var r = {};
        var a = ["farmer", "engineer", "refugee", "medic"];
        for (var i=0; i<rand_int(max_amount); i++) {
            var s = rand_choice(a);
            if (Object.keys(game_stats["people"]).indexOf(s) >= 0) game_stats["people"][s] += 1;
            else game_stats["people"][s] = 1;
            if (Object.keys(r).indexOf(s) >= 0) r[s] += 1;
            else r[s] = 1;
        }
        var x = [];
        $.each(Object.keys(r), function() { x.push(r[this] + " " + this); });
        return x.join(", ");
    } else {
        var a = rand_choice(["ammunition", "construction", "batteries",
            "food tins", "water bottles"]);
        var n = rand_int(max_amount) + 1;
        game_stats["other supplies"][a] += n;
        return n + " " + a;
    }
}

function set_people(people) {
    // Reverse of get_people.
    $.each(people, function() {
        game_stats["people"][this] += 1;
    });
}


// ------------- Menu controls.
function hide_menu() {
    if (selected_box != null) {
        selected_box.remove_image("res/selected-box.png");
        selected_box = null;
    }
    $("#gridbox-menu-container").html("");
    $("#gridbox-menu").hide();
    pause_game();
}

function show_menu(title, items, gb) {
    pause_game();
    if (game_alive) {
        selected_box = gb;
        selected_box.set_image("res/selected-box.png");
        var m = $("#gridbox-menu-container");
        m.html("");
        m.append($("<h2>" +title+ "</h2>"));
        $.each(items, function() {
            var d = $("<div></div>");
            var a = $("<a></a>");
            d.append(a);
            a.text(this[0]);
            if (this[1].substring(this[1].length-1) != ";") this[1] += ";";
            a.attr("href", "javascript:" + this[1]);
            if (this[2] != undefined) d.append($("<span>" +this[2]+ "</span>"));
            m.append(d);
        });
        m.append($('<div><a>[ close ]</a></div>'));
        $("#gridbox-menu-container > div:last-child").click(
            function() { hide_menu(); });
        $("#gridbox-menu").show();
    } else {
        alert("Sorry, you're either dead or have gone insane. Game over.");
    }
}

function show_stats() {
    var table = $("#disp-stats");
    table.html("");
    $.each(Object.keys(game_stats), function() {
        var tr = $("<tr></tr>");
        var v = game_stats[this];
        if (v instanceof String || v instanceof Number) {
            tr.append($("<td>" +title(this.toString())+ "</td>"));
            tr.append($("<td>" +v+ "</td>"));
            table.append(tr);
        } else {
            tr.append($('<td colspan="2">' +title(this)+ '</td>'));
            table.append(tr);
            $.each(Object.keys(v), function() {
                var tr2 = $("<tr></tr>");
                tr2.append($("<td>" +title(this)+ "</td>"));
                if (isNaN(v[this])) tr2.append($("<td>" +v[this]+ "</td>"));
                else tr2.append($("<td>" +Math.round(v[this])+ "</td>"));
                table.append(tr2);
            });
        }
    });
}

// ------------- All update functions come after this one.
function game() {
    // This is the game's "main" function, which is called every x seconds.
    // ------------- Update the player and game stats first.
    update_time();
    if (game_alive) {
        // ------------- Consume resources.
        var consumers = get_consumers();
        if (["06:00", "18:00"].indexOf(game_stats["game time"]["hour"]) >= 0) {
            update_resource(consumers, "rations", "food tins");
            update_resource(consumers, "water", "water bottles");
        }
        // ------------- Update every other box but home_box because we've done that.
        $.each(stage.grid, function() {
            if (this != home_box) this.boxtype.update(this);
        });
        }
    //------------- Finally, update the display.
    show_stats();
}

function collect_essential(stat_name, resources, requires) {
    /*
        Collect essential game_stat from resources available in selected_box.
        stat_name: game_stat["essentials"][stat_name]
        resource: {"name0": x, ...} where name0 is in selected_box.dict
        requires: {"name0": x, ...} where name0 is in game_stat["other resources"]
            x value is the minimum number to produce one unit of stat_name.
    */
    function is_supplied(src, ref) {
        var s = true;
        $.each(Object.keys(src), function() { if (ref[this] < src[this]) s = false; });
        return s;
    }
    function use_supply(src, ref) {
        $.each(Object.keys(src), function() { ref[this] -= src[this]; });
    }
    if (!is_supplied(resources, selected_box.dict) ||
        !is_supplied(requires, game_stats["other supplies"])) {
            alert("Not enough supplies.");
        }
    while (true) {
        if (!is_supplied(resources, selected_box.dict) ||
            !is_supplied(requires, game_stats["other supplies"])) break;
        // Continue.
        use_supply(resources, selected_box.dict);
        use_supply(requires, game_stats["other supplies"]);
        game_stats["essentials"][stat_name] += 1;
    }
    hide_menu();
    $("body").focus();
}

function get_consumers() {
    var consumers = 0;
    $.each(Object.keys(game_stats["people"]), function() {
        consumers += game_stats["people"][this];
    });
    return consumers;
}

function update_control(consumers, reason) {
    // Computes how much control the player loses when things happen.
    if (reason == "food") var d = 1;     // Some arbitrary score for hunger.
    else var d = 1;                      // Default score.
    game_stats["essentials"]["control"] -= consumers * d;
    if (game_stats["essentials"]["control"] <= 0) {
        if (consumers > 1) {
            // If control goes below 1, reduce the number of people and reset.
            game_stats["essentials"]["control"] = 100;
            var y = rand_choice(Object.keys(game_stats["people"]));
            game_stats["people"][y] -= 1;
            if (game_stats["people"][y] <= 0) delete game_stats["people"][y];
        } else {
            // The player goes insane or dies. Game over.
            game_alive = false;
            var x = rand_choice(["you've gone insane!", "you've died of hunger!"]);
            alert("Congratulations, " + x);
        }
    }
}

function update_resource(consumers, resource, byproduct) {
    // Computes how much essential resources will be used and how
    // much supplies will be recycled because of the consumption.
    var c = game_stats["essentials"][resource] - consumers;
    if (c >= 0) {
        if (byproduct != undefined) game_stats["other supplies"][byproduct] +=
            (game_stats["essentials"][resource] - c);
        game_stats["essentials"][resource] = c;
    } else {
        game_stats["essentials"][resource] = 0;
        // Compute how much control the player loses over the settlement.
        update_control(consumers, resource);
    }
}

function update_supply(base_value, people_bonuses) {
    /*
        Updates the amount of supplies available to a gridbox_type.
        base_value: base increment value
        people_bonuses: {"p": x, ...} p is a key in game_stats["people"] and
            x will be multiplied number of p, to be added to base_value;
    */
    $.each(Object.keys(people_bonuses), function() {
        if (Object.keys(game_stats["people"]).indexOf(this) >= 0) {
            base_value += game_stats["people"][this] * (people_bonuses[this] + 1);
        }
    });
    return base_value;
}

function update_time() {
    var gmt = game_stats["game time"];
    var h = parseInt(gmt["hour"].split(":")[0]) + 1;
    if (h == 24) { h = 0; gmt["day"] += 1; }
    if (h < 10) h = "0" + h;
    gmt["hour"] = h + ":00";
    // Roll for random event?
}


// ------------- Game controls.
function pause_game() {
    if (game_interval == null) {
        game_interval = setInterval(game, seconds_per_turn * 1000);
    } else {
        clearInterval(game_interval);
        game_interval = null;
    }
}

function start_game() {
    $("#intro").fadeOut(1000, function() {
        $("#intro").remove();
        $("#info, #stage").show();
        // Create the grid.
        stage.init(8, 40);
        stage.set_image("res/stage.jpg");
        // Set the home box; this is where people sleep.
        home_box = stage.grid[27];
        home_box.init(gb_home);
        // Set the exit boxes so the player can explore, forage, and plunder.
        // This is also where enemies might come in.
        stage.grid[23].init(gb_explore);
        stage.grid[32].init(gb_explore);
        show_stats();
        // Start the game.
        pause_game();
    });
}


$(document).ready( function() {
    $("#gridbox-menu").css("top", $("#intro").offset().top);
    $("#gridbox-menu, #info, #stage").hide();
});