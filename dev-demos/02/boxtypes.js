// The game grid controller requires this.
var gb_default = new gridbox_type();
gb_default.menu_items = [];
gb_default.init = function (gb) {
    gb.set_image("res/gb-default.svg");
};
gb_default.clicked = function(gb) {
    // The show_menu function is defined in game.js.
    show_menu("Build Menu", this.menu_items, gb);
};
gb_default.register = function(item_title, instance_name) {
    // Register a gridbox_type instance as a Build Menu item.
    this.menu_items.push([item_title,
        "menu_box_selected.boxtype.build(menu_box_selected,"+instance_name+");"]);
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
gb_default.register("Vegetable Garden", "gb_veg_garden");
gb_veg_garden.init = function(gb) {
    gb.set_image("res/veg-garden.png", true);
    gb.dict = {
        "fruits":     0,
        "vegetables": 0,
        "water":      0,
    };
};
gb_veg_garden.update = function(gb) {
    // Updates every 06:00.
    if (game_stats["game time"]["hour"] == "06:00") {
        // Here.
    }
};
gb_veg_garden.clicked = function(gb) {
    menu_items = [];
    // Do some checks before adding menu items to limit
    // what the player can do.
};