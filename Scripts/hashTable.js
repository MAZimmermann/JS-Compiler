/********** ********** ********** ********** **********
 * symbol.js
 *
 * Includes
 *  ...
 *
 **********/

var buildTable = function(max) {
    var size = 0;
    var symbolList = [],
        methods = {
            createIndex: function(key) {
                var hash = 0;
                for (var i = 0; i < key.length; i++) {
                    hash = (hash << 5) - hash + key.charCodeAt(i);
                    hash = hash >>> 0; //convert to 32bit unsigned integer
                }
                return Math.abs(hash % max);
            },
            insert: function(key, value) {
                var hashIndex = this.createIndex(key);
                symbolList[hashIndex] = value;
                size++;
                return this;
            },
            retrieve: function(key) {
                var hashIndex = this.createIndex(key);
                return symbolList[hashIndex];
            },
            getSize: function() {
                return size;
            }
        };
    return methods;
}