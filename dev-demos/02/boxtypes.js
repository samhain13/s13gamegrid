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
        "selected_box.boxtype.build(selected_box,"+instance_name+")",
        description]);
};
gb_default.build = function(gb, gb_instance) {
    // Show menu link target; builds buildings in place of this
    // gridbox if the gb_instance requirements are satisfied.
    var build_check = gb_instance.pre_init(gb);
    if (build_check == true) gb.init(gb_instance);
    else alert(build_check);
    hide_menu();   // In game.js.
};


// Contains all player and game properties.
var gb_home = new gridbox_type();
gb_home.init = function(gb) {
    gb.set_image("res/home.png", true);
};


// Allows the player to assign people to explore the outside world.
var gb_explore = new gridbox_type();
gb_explore.init = function(gb) {
    gb.set_image("res/explore.png", true);
};



// ------------- Buildings that can be built.
var gb_windmill = new gridbox_type();
gb_default.register("Windmill", "gb_windmill");
gb_windmill.init = function(gb) {
    gb.box.append($("<span>WINDMILL</span>"));
};

var gb_veg_garden = new gridbox_type();
gb_default.register("Vegetable Garden", "gb_veg_garden",
    "Grow fruits and vegetables. Also acts as a water supply.");
gb_veg_garden.init = function(gb) {
    gb.set_image("res/veg-garden.png", true);
    gb.dict = {
        "fruits":     0,
        "vegetables": 0,
        "water":      8,
    };
};
gb_veg_garden.update = function(gb) {
    if (game_stats["game time"]["hour"] == "06:00") {
        if (gb.dict["water"] < 10) gb.dict["water"] += 1;
        if (gb.dict["fruits"] < 10) {
            gb.dict["fruits"] += update_supply(1, {"farmer": 1});
        }
        if (gb.dict["vegetables"] < 10) {
            gb.dict["vegetables"] += update_supply(1, {"farmer": 1});
        }
    }
};
gb_veg_garden.clicked = function(gb) {
    menu_items = [];
    menu_items.push(["Collect Water (" +gb.dict["water"]+ " unit(s) available)",
        "collect_essential('water', {'water': 1}, {'water bottles': 1})",
        "Fill empty water bottles. Requires 1 water bottle and 1 water unit."]);
    menu_items.push(["Make Rations ("+ gb.dict["fruits"] +
        " fruit(s) and " +gb.dict["vegetables"]+ " vegetable(s) in stock)",
        "collect_essential('rations', {'fruits': 1, 'vegetables': 1}, {'food tins': 1})",
        "Fill empty food tins to create rations of fruits and vegetables. " +
        "Requires 1 food tin, 1 fruit, and 1 vegetable."]);
    menu_items.push(["Destroy", "selected_box.init(gb_default)", "Destroy this garden."]);
    show_menu("Vegetable Garden", menu_items, gb);
};
