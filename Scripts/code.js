/********** ********** ********** ********** **********
 * code.js
 *
 * Includes:
 *  Code class via code constructor
 *  Enumeration of code operations
 *
 * TODO: Figure out names and such
 *
 * TODO: Revise/add to data held in instance of code object
 *
 **********/



/********** ********** ********** ********** **********
 * Code constructor
 **********/
function Code() {

    /********** ********** ********** ********** **********
     * List of Op Codes to be displayed at the end of code gen
     **********/
    this.bytes = [256];

    /********** ********** ********** ********** **********
     * Static Table
     **********/
    this.staticTable = [];
    this.offset = 0;

    /********** ********** ********** ********** **********
     * Jump Table
     **********/
    this.jumpTable = [];

    /********** ********** ********** ********** **********
     * Current Address (start at zero)
     **********/
    this.currentAddress = 0;

    /********** ********** ********** ********** **********
     * Heap Address (start at 255)
     **********/
    this.heapAddress = 255;
    this.bytes[this.heapAddress] = '00';

    /********** ********** ********** ********** **********
     * Current Static Table Entry (start at T0XX)
     **********/
    this.currentStaticEntry = 'T0XX';

    /********** ********** ********** ********** **********
     * Current TempAddress?
     **********/
    this.currentTempAddress = 'T1XX';

}



/********** ********** ********** ********** **********
 * Format code
 **********/
Code.prototype.format = function() {

    var staticStart = this.currentAddress + 1;

    // Replaces all temporary variable memory locations with the actual location
    for (var key in this.staticTable) {

        var thisOffset = this.staticTable[key][4];

        var position = staticStart + thisOffset;

        var temporaryAddress = this.staticTable[key][0];

        var newAddress = ("0000" + position.toString(16)).substr(-2).toUpperCase() + " ";

        for (var j = 0; j < this.currentAddress; j++) {
            if (this.bytes[j].match(/^T[0-9]$/)) {
                var cur = this.bytes[j].concat(this.bytes[j + 1]);
                if (cur.match(temporaryAddress)) {
                    this.bytes[j] = newAddress;
                    this.bytes[j + 1] = "00";
                }
            }
        }
    }

    for (var j = 0; j < this.currentAddress; j++) {
        this.bytes[j] = this.bytes[j] + " ";
    }

    for (var k = this.currentAddress; k < this.heapAddress; k++) {
        this.bytes[k] = "00" + " ";
    }

    for (var l = this.heapAddress; l < this.bytes.length; l++) {
        this.bytes[l] = this.bytes[l] + " ";
    }

}



/********** ********** ********** ********** **********
 * Push instruction to the list of Op Codes
 **********/
Code.prototype.buildInstruction = function(instructions) {
    if (instructions.length == 4) {

        for (var i = 0; i < instructions.length/2; i++) {
            var instructionComponent = instructions.substr(2 * i, 2);
            this.bytes[this.currentAddress] = instructionComponent;
            this.currentAddress++;
        }

    } else {

        /* TODO: Think about handling addresses */
        this.bytes[this.currentAddress] = instructions;
        this.currentAddress++;

    }
}



/********** ********** ********** ********** **********
 * Push instruction to the list of Op Codes
 **********/
Code.prototype.buildString = function(string) {

    for (var i = 0; i < string.length; i++) {
        var position = string.length - i;
        var cur = string[i];
        cur = ("0000" + cur.charCodeAt(0).toString(16)).substr(-2).toUpperCase();
        this.bytes[this.heapAddress - position] = cur;
    }

    this.heapAddress -= string.length + 1;

    this.bytes[this.heapAddress] = '00';

    return cur = ("0000" + (this.heapAddress + 1).toString(16)).substr(-2).toUpperCase();

}



/********** ********** ********** ********** **********
 * Push instruction to the list of Op Codes
 **********/
Code.prototype.buildStaticEntry = function(data) {

    var data = data.split("");

    var key = data[0].concat("@", data[1], data[2]);

    var entry = [];

    entry.push(this.currentStaticEntry);
    for (var j = 0; j < 3; j++) {
        entry.push(data[j]);
    }

    entry.push(this.offset);
    this.offset++;

    this.staticTable[key] = entry;

    this.currentStaticEntry = nextStaticEntry(this.currentStaticEntry);
    this.currentTempAddress = nextStaticEntry(this.currentTempAddress);

}



/********** ********** ********** ********** **********
 * nextStaticEntry()
 ***********/
function nextStaticEntry(cur) {
    var next = String.fromCharCode(cur.charCodeAt(1) + 1);
    return 'T' + next + 'XX';
}



/********** ********** ********** ********** **********
 * Enumeration of code operations
 * Inspired by the "Svegliator"
 *
 * TODO: Decide whether I want to use this format
 *
 **********/
Code.Operations = {

    /********** ********** ********** ********** **********
     * Load the accumulator with a constant
     ***********/
    LDAC: function(value) {

    },



    /********** ********** ********** ********** **********
     * Load the accumulator from memory
     ***********/
    LDAM: function(address) {

    },



    /********** ********** ********** ********** **********
     * Store the accumulator in memory
     ***********/
    STA: function() {

    },



    /********** ********** ********** ********** **********
     * Add with carry
     ***********/
    ADC: function() {

    },



    /********** ********** ********** ********** **********
     * Load the X register with a constant
     ***********/
    LDXC: function() {

    },



    /********** ********** ********** ********** **********
     * Load the X register from memory
     ***********/
    LDXM: function() {

    },



    /********** ********** ********** ********** **********
     * Load the Y register with a constant
     ***********/
    LDYC: function() {

    },



    /********** ********** ********** ********** **********
     * Load the Y register from memory
     ***********/
    LDYM: function() {

    },



    /********** ********** ********** ********** **********
     * No operation
     ***********/
    NOP: function() {

    },



    /********** ********** ********** ********** **********
     * Break (which is really a system call)
     ***********/
    BRK: function() {

    },



    /********** ********** ********** ********** **********
     * Compare a byte in memory to the X reg
     *  Sets the Z (zero) flag if equal
     ***********/
    CPX: function() {

    },



    /********** ********** ********** ********** **********
     * Branch n bytes if Z (zero) flag equals zero
     ***********/
    BNE: function() {

    },



    /********** ********** ********** ********** **********
     * Increment the value of a byte
     ***********/
    INC: function() {

    },



    /********** ********** ********** ********** **********
     * System call
     *  #$01 in X reg = print the integer stored in the Y register
     *  #$02 in X reg = print 00-terminated string stored at the address in the Y register
     ***********/
    SYS: function() {

    }

}