/*
    The game controller script.
    
    This requires jQuery, utilities.js and another script that defines the
    Gridbox types for the game. That script MUST have an object called
    gb_default, which is an instance of gridbox_type.
*/
var gridbox_type = function() {
    this.clicked = function(gb) {
        // Obviously.
    };
    this.init = function(gb) {
        // This should be called when a gridbox is assigned this type.
    };
    this.update = function(gb) {
        // This is called in stage.main every "turn".
    };
};

//var gridbox = function(gid, index) {
var gridbox = function(index, row, column) {
    this.box = $('<div id="gridbox-' +index+ '" class="gridbox"></div>');
    this.dict = null;   // To be set by the boxtype object.
    this.boxtype = null; // To be set at stage.init.
    this.gid = index;
    this.row = row;
    this.col = column;
    this.range = 1;  // "Radius" for getting the vicinity of this gridbox.
    this.vicinity = [];
    
    this.get_vicinity = function() {
        // Keeps track of other gridboxes that are in this one's range.
        var r = []; var c = [];
        for (var i=this.row-this.range; i<this.row+this.range+1; i++) { r.push(i); }
        for (var i=this.col-this.range; i<this.col+this.range+1; i++) { c.push(i); }
        for (var i=0; i<stage.grid.length; i++) {
            var gb = stage.grid[i];
            if ($.inArray(gb.row, r) >= 0 && $.inArray(gb.col, c) >= 0 &&
                gb != this) this.vicinity.push(gb);
        } // End of for.
    };
    
    this.set_image = function(src, reset) {
        // Places an image inside the gridbox's div.
        var box = this.box;
        var img = $('<img src="' +src+ '" />');
        if (reset) this.box.html("");
        else img.addClass("gridbox-layer-image");  // So we can hide layer images.
        box.append(img);
        img.load( function() {
            img.css({
                "bottom": "0px",
                "left": (box.width()/2) - (img.width()/2),
                "position": "absolute"
            });
        });
    };
    
    this.init = function(boxtype) {
        // Initialises the gridbox instance.
        this.dict = new dict();   // Reset the dict.
        this.boxtype = boxtype;
        this.boxtype.init(this);  // Initialise the boxtype instance.
        this.get_vicinity();
    };
};

var stage = {
    "box": null,            // The HTML element representing the stage.
    "grid": [],             // For keeping track of gridbox objects.
    "grid_size": 8,         // Number of boxes in both x and y axes.
    "gridbox_size": 30,     // Size of each gridbox in pixels.
    "selected": null,       // Is a gridbox currently selected.
    
    "init": function(grid_size, gridbox_size) {
        if (grid_size != undefined) this.grid_size = grid_size;
        if (gridbox_size != undefined) this.gridbox_size = gridbox_size;
        // Make the grid.
        this.box = $("#grid");
        var c = 0;     // We need this for generating the gridbox id.
        var ix = .8;   // Spacing adjustment for i values.
        var jx = 1.4;  // Spacing adjustment for j values.
        this.box.css("position", "relative");
        // Build the rows (and columns).
        for (var i=0; i<this.grid_size; i++) {
            var t = i * (this.gridbox_size * ix);
            for (var j=0; j<this.grid_size; j++) {
                // var gb = new gridbox("gb-" + c + "-row-" + i + "-col-" + j);
                var gb = new gridbox(c, i, j);
                var l = (this.grid_size * this.gridbox_size) -
                    (this.gridbox_size * j) + (this.gridbox_size * i * jx);
                t += this.gridbox_size * ix;
                this.grid.push(gb);
                // Initialise the gridbox and put it on the stage.
                gb.init(gb_default);
                gb.box.css({
                    "cursor": "pointer",
                    "height": this.gridbox_size,
                    "left": l,
                    "margin-top": 0 - (this.gridbox_size/2),
                    "position": "absolute",
                    "top": t, "width": this.gridbox_size,
                });
                this.box.append(gb.box);
                c++;  // Increment the counter.
            }
        }
        // Attach an on_click event to the stage.
        this.box.click(function(e) { stage.on_click(e); });
        // Adjust the grid's width and height.
        this.box.width(
            (this.grid[this.grid_size-1].box.offset().left +
            this.grid[this.grid.length-this.grid_size].box.offset().left +
            this.gridbox_size) - (this.box.offset().left * 2)
        );
        this.box.height(
            ((this.grid[this.grid.length-1].box.offset().top +
            (this.gridbox_size * 1.5)) - this.grid[0].box.offset().top)
        );
    },
    
    "on_click": function(event) {
        // Handles click events for the grid/stage. We're doing this because
        // we want gridboxes that are behind tall or wide graphics to still
        // be clickable.
        var pos = [event.pageX, event.pageY];
        $.each(this.grid, function(index) {
            var x = [this.box.offset().left,
                     this.box.offset().left + this.box.width()];
            var y = [this.box.offset().top,
                     this.box.offset().top + this.box.height()];
            if ((pos[0] > x[0] && pos[0] < x[1]) &&
                (pos[1] > y[0] && pos[1] < y[1])) this.boxtype.clicked(this);
        });
    },
    
    "set_image": function(image_path) {
        // Sets the background image of the stage.
        this.box.css("background-image", "url('" + image_path + "')");
    },
};