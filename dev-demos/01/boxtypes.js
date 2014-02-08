var gb_default = new gridbox_type();
gb_default.clicked = function(gb) {
    console.log(gb.box.attr("id"));
};
gb_default.init = function (gb) {
    gb.set_image("res/gb-default.svg", true);
};


var gb_home = new gridbox_type();
gb_home.init = function (gb) {
    gb.set_image("res/home.svg", true);
};