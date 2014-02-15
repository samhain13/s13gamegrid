// The game grid controller requires this.
var gb_default = new gridbox_type();
gb_default.menu_items = [];
gb_default.init = function (gb) {
    gb.set_image("res/gb-default.svg", true);
    hide_menu();
};
gb_default.clicked = function(gb) {
    // The show_menu function is defined in game.js.
    show_menu("Build Menu", this.menu_items, gb);
};
gb_default.register = function(item_title, instance_name, description) {
    // Register a gridbox_type instance as a Build Menu item.
    this.menu_items.push([item_title,
        "selected_box.boxtype.build("+instance_name+")",
        description]);
};
gb_default.build = function(gb_instance) {
    // Show menu link target; builds buildings in place of this
    // gridbox if the gb_instance requirements are satisfied.
    var build_check = gb_instance.pre_init(selected_box);
    if (build_check == true) {
        selected_box.init(gb_instance);
        if (!has_key(selected_box.dict, "health")) {
            selected_box.dict["health_max"] = 100;
            selected_box.dict["health"] = 100;
        }
        show_stats();
    } else {
        alert(build_check);
    }
    hide_menu();   // In game.js.
};


// Contains all player and game properties.
var gb_home = new gridbox_type();
gb_home.init = function(gb) {
    gb.set_image("res/home.png", true);
    gb.dict = {"health_max": 500, "health": 500};
};
gb_home.recall_expeditions = function() {
    if (exp_box1.dict["exp_active"] || exp_box2.dict["exp_active"]) {
        if (check_essential("electricity", 10)) {
            exp_box1.dict["exp_hours_gone"] = 0;
            exp_box1.dict["exp_override"] = true;
            exp_box2.dict["exp_hours_gone"] = 0;
            exp_box2.dict["exp_override"] = true;
            stats_sub("essentials", "electricity", 10);
            stats_add("other supplies", "batteries", 10);
        } else {
            alert("Not enough resources to broadcast a recall order.");
        }
    } else {
        alert("There are no active expeditions to recall.");
    }
    hide_menu();
};
gb_home.clicked = function(gb) {
    var menu_items = [];
    menu_items.push(["Broadcast Radio Message",
        "alert('Working on it.')",
        "Broadcast a message to attract more refugees (but also risk " +
        "attracting enemies). Requires 5 units of electricity."]);
    menu_items.push(["Recall Expedition",
        "home_box.boxtype.recall_expeditions()",
        "Broadcast a scrambled message and order your explorers to return " +
        "home. Requires 10 units of electricity."]);
    show_menu("Home Menu", menu_items, gb);
};


// Allows the player to assign people to explore the outside world.
var gb_explore = new gridbox_type();
gb_explore.init = function(gb) {
    gb.set_image("res/explore.png", true);
    gb.dict = {
        "exp_active":  false,   // A switch so we don't sent multiple expeditions.
        "exp_food_req":   14,   // Required food: 1 ration/day/person.
        "exp_hours_gone":  0,   // Update when active, expeditions take [below] hours.
        "exp_days_req":    7,   // Required number of expedition days.
        "exp_override": false,  // Was the expedition recalled?
    }
};
gb_explore.clicked = function(gb) {
    var menu_items = [];
    if (!gb.dict["exp_active"]) {
        menu_items.push(["Send Out Expedition",
            "selected_box.boxtype.explore(selected_box)",
            "Send a couple of people out into the wilderness to explore, " +
            "forage, and scavange. Requires 2 people and " +
            gb.dict["exp_food_req"] + " rations and water."]);
    } else {
        menu_items.push(["Expedition Status", "hide_menu()",
            "Hopefully, the expedition will return in " +
            gb.dict["exp_hours_gone"] + " hour(s)."]);
    }
    show_menu("Explore Menu", menu_items, gb);
};
gb_explore.explore = function(gb) {
    // Check if the player has enough people and rations.
    if (check_population(3) &&
        check_essential("rations", gb.dict["exp_food_req"]) &&
        check_essential("water", gb.dict["exp_food_req"])) {
        gb.dict["exp_active"] = true;
        gb.dict["exp_hours_gone"] = gb.dict["exp_days_req"] * 24;
        gb.dict["exp_people"] = get_people(2);
        stats_sub("essentials", "rations", gb.dict["exp_food_req"]);
        stats_sub("essentials", "water", gb.dict["exp_food_req"]);
    } else {
        alert("Not enough resources to send expedition.");
    }
    hide_menu();
};
gb_explore._check_explore = function(gb) {
    gb.dict["exp_hours_gone"] -= 1;
    if (gb.dict["exp_hours_gone"] <= 0) {
        // Check if the expedition survived.
        if (rand_int(99) > 90) {
            alert("It appears the explorers ran into trouble.\nThey will never return.");
        } else {
            // Return the people that participated in the expedition.
            for (var i=0; i<gb.dict["exp_people"].length; i++) {
                stats_add("people", gb.dict["exp_people"][i], 2);
            }
            gb.dict["exp_people"] = [];
            // Return the food tins and water bottles.
            stats_add("other supplies", "food tins", gb.dict["exp_food_req"]);
            stats_add("other supplies", "water bottles", gb.dict["exp_food_req"]);
            // Get rewards.
            var l = [];
            var xp = (gb.dict["exp_override"]) ? 10 : 50;
            l.push(get_reward("people", 2));
            l.push(get_reward("supplies", xp));
            l.push(get_reward("supplies", xp));
            l.push(get_reward("supplies", xp));
            alert("Explorers have returned and brought back:\n" + l.join("\n"));
        }
        gb.dict["exp_active"] = false;
        gb.dict["exp_override"] = false;
    }
};
gb_explore.update = function(gb) {
    if (gb.dict["exp_active"]) this._check_explore(gb);
};



// ------------- Buildings that can be built.
var gb_turbine = new gridbox_type();
gb_default.register("Wind Turbine", "gb_windmill", "Charge batteries using " +
    "wind energy. Requires 10 units of construction supplies.");
gb_turbine.pre_init = function(gb) {
    if (game_stats["other supplies"]["construction"] >= 10) {
        game_stats["other supplies"]["construction"] -= 10;
        return true;
    } else {
        return "Not enough construction supplies.";
    }
};
gb_turbine.init = function(gb) {
    gb.box.append($("<span>WIND TURBINE</span>"));
};
gb_turbine.clicked = function(gb) {
    var menu_items = [];
    menu_items.push(["Charge Batteries",
        "alert('Charge batteries.')",
        "Charge batteries."]);
    show_menu("Wind Turbine Menu", menu_items, gb);
};


var gb_veg_garden = new gridbox_type();
gb_default.register("Vegetable Garden", "gb_veg_garden",
    "Grow fruits and vegetables. Also acts as a water supply.");
gb_veg_garden.init = function(gb) {
    gb.set_image("res/veg-garden.png", true);
    gb.dict = {
        "full_stock":    56,
        "refill_water":  24,  // Hours until the water stock is refilled.
        "refill_food":   72,
        "growing":    false,
        "grower":      null,
        "fruits":         0,
        "vegetables":     0,
        "water":          0,
    };
};
gb_veg_garden.tend_garden = function(gb) {
    if (!gb.dict["growing"] && get_consumers() >= 1) {
        if (has_key(game_stats["people"], "farmers")) {
            gb.dict["refill_food"] = 36;
            gb.dict["grower"] = "farmers";
            stats_sub("people", "farmers", 1);
        } else {
            gb.dict["refill_food"] = 72;
            gb.dict["grower"] = get_people(1)[0];
        }
        gb.dict["growing"] = true;
    } else {
        alert("Somebody is already tending to this garden.");
    }
    hide_menu();
};
gb_veg_garden.update = function(gb) {
    // Water restocks automatically.
    if (gb.dict["refill_water"] <= 0) {
        if (gb.dict["water"] < gb.dict["full_stock"]) gb.dict["water"] += 1;
        gb.dict["refill_water"] = 24;
    } else {
        gb.dict["refill_water"] -= 1;
    }
    // Food restock has to be initiated by the player.
    if (gb.dict["growing"]) {
        if (gb.dict["refill_food"] <= 0) {
            gb.dict["fruits"] = gb.dict["full_stock"];
            gb.dict["vegetables"] = gb.dict["full_stock"];
            gb.dict["growing"] = false;
            stats_add("people", gb.dict["grower"], 1);
            alert("A " + gb.dict["grower"] + " is done growing food in " +
                "a vegetable garden.\nYou may now collect its produce.");
        } else {
            gb.dict["refill_food"] -= 1;
        }
    }
};
gb_veg_garden.clicked = function(gb) {
    menu_items = [];
    if (gb.dict["water"] > 0) {
        menu_items.push(["Collect Water, " +gb.dict["water"]+ " unit(s) available",
            'collect_essential("water", {"water": 1}, {"water bottles": 1})',
            "Fill empty water bottles. Requires 1 water bottle and 1 water unit."]);
    }
    if (gb.dict["fruits"] > 0) {
        menu_items.push(["Make Rations, "+ gb.dict["fruits"] +
            " fruits and " +gb.dict["vegetables"]+ " vegetables in stock",
            'collect_essential("rations", {"fruits": 1, "vegetables": 1},' +
            ' {"food tins": 1})', "Fill empty food tins to create rations " +
            "of fruits and vegetables. Requires 1 food tin, 1 fruit, and 1 vegetable."]);
    }
    if (!gb.dict["growing"]) {
        menu_items.push(["Tend To The Garden",
            "selected_box.boxtype.tend_garden(selected_box)",
            "Assign one person in the settlement to grow fruits and vegetables."]);
    }
    show_menu("Vegetable Garden", menu_items, gb);
};
