/********** ********** ********** ********** **********
 * symbol.js
 *
 * Includes
 *  Constructor for a hash table as well as
 *   methods for operations on a hash table
 *
 *  Inspired by Alex Haskins
 *   https://gist.github.com/alexhawkins/48d7fd31af6ed00e5c60
 *
 * TODO: Clean this up, consider new hash function
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
                    hash = hash >>> 0;
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