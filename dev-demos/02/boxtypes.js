// The game grid controller requires this.
var gb_default = new gridbox_type();
gb_default.init = function (gb) {
    // gb.box.css("border", "1px black solid");
    gb.set_image("res/gb-default.svg");
};


// Contains all player properties.
var gb_home = new gridbox_type();
gb_home.init = function(gb) {
    // gb.box.css("border", "1px black solid");
    gb.set_image("res/home.png", true);
    // Assign some stuff to the player.
};

// Exit gridbox, shows the "explore" menu when clicked.
var gb_exit = new gridbox_type();
gb_exit.init = function(gb) {
    gb.set_image("res/exit.png", true);
}
gb_exit.clicked = function(gb) {
    alert("Explore, forage, or plunder.");
};