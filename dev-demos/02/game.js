var home_box = null;

function show_stats() {
    var table = $("#menu table");
    $.each(home_box.dict["keys"], function() {
        /*
        var tr = $("<tr></tr>");
        tr.append($("<td>" +this.toString()+ "</td>"));
        tr.append($("<td>" +home_box.dict.get(this.toString())+ "</td>"));
        table.append(tr);
        */
    });
}

$(document).ready( function() {
    // Create the grid.
    stage.init(8, 40);
    stage.set_image("res/stage.jpg");
    $("#menu, #stage").height($("#grid").height());
    
    // Set the home box.
    home_box = stage.grid[11];
    home_box.init(gb_home);
    
    // Set the exit boxes so the player can explore, forage, and plunder.
    // This is also where enemies might come in.
    stage.grid[23].init(gb_exit);
    stage.grid[32].init(gb_exit);
    
    // Build the stats display.
    show_stats();
});
