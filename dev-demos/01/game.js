var game_grid_size = 8;
var game_gridbox_size = 40;

function main() {
    $.each(stage.grid, function() {
        this.boxtype.update(this);
    });
}


$(document).ready( function() {
    // Initialise the stage.
    stage.init(game_grid_size, game_gridbox_size);
    stage.set_image("res/stage.jpg");
    // Init the home gridbox.
    stage.grid[Math.floor(stage.grid.length/2) - (game_grid_size/2)].init(gb_home);
});