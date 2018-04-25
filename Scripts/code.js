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



    /********** ********** ********** ********** **********
     * Current Static Table Entry (start at T0XX)
     **********/
    this.currentStaticEntry = 'T0XX';

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
    this.bytes[this.heapAddress] = '00';

    for (var i = 0; i < string.length; i++) {
        var position = string.length - i;
        var cur = string[i];
        cur = ("0000" + cur.charCodeAt(0).toString(16)).substr(-2).toUpperCase();
        this.bytes[this.heapAddress - position] = cur;
    }

    this.heapAddress -= string.length + 1;

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

    this.staticTable[key] = entry;

    /*alert(entry);*/

    this.currentStaticEntry = nextStaticEntry(this.currentStaticEntry);

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