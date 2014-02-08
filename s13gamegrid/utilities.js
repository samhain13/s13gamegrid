/*
    Some utilities.
*/
var dict = function() {
    // Our version of a dictionary object.
    this.keys = [];
    this.values = [];
    
    this.list = function() {
        // Returns a list of key-value pairs so that user scripts can iterate
        // through them via list[x].key and list[x].value
        var x = [];
        for (var i=0; i<this.keys.length; i++){
            x.push({"key": this.keys[i], "value": this.values[i]});
        }
        return x;
    };
    
    this.get = function(key) {
        // Returns the value of a key or undefined if they key does not exist.
        if (!this.has_key(key)) return undefined;
        else return this.values[this.keys.indexOf(key)];
    };
    
    this.has_key = function(key) {
        // Checks whether the dict has a specific key.
        return this.keys.indexOf(key) >= 0;
    };
    
    this.set = function(key, value) {
        // Sets the value of a key or creates a new key-value pair.
        if (this.has_key(key)) {
            this.values[k] = value;
        } else {
            this.keys.push(key);
            this.values.push(value);
        }
    };
    
    this.remove = function(key) {
        // Remove a key-value pair.
        if (this.has_key(key)) {
            this.keys.splice(k, 1);
            this.values.splice(k, 1);
        }
    };
};


rand_int = function(maximum) {
    // Generates a random integer.
    return Math.round(Math.random() * maximum);
};
