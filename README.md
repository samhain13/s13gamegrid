# Samhain13's Game Grid #
A small JavaScript game library for making in-browser, tile-based games like farm sims (ala-FarmVille). See dev-demos/x directories for progress.

## Basic Setup ##

Required HEAD elements, in order of appearance:  

* s13gamegrid/jquery.js (or what's available on the jQuery site)
* s13gamegrid/utilities.js
* s13gamegrid/controller.js
* from elsewhere (see dev-demos/01 scripts):
    * boxtypes.js - contains the gridbox rules and definitions
        * needs to define "gb\_default", which is an instance of
          "gridbox\_type" (defined in controller.js);
        * also defines additional instances of "gridbox\_type"
          according to the game mechanics.
    * game.js - contains the implementation of the game mechanics
        * mechanics can be defined in a "main" function that is
          called at intervals or via user-trggered events.

Required BODY elements:  

* &lt;div id="grid">&lt;/div> - this is where the grid will be constructed.

