/********** ********** ********** ********** **********
 * code.js
 *
 * Includes:
 *  Code class via code constructor
 *
 *  TODO: Start boolvals and comparisons
 *
 *  TODO: Enumeration of code operations (might not use this) *****
 *
 *  TODO: Clean up and refactor / look for areas to consolidate
 *
 *  TODO: Consider editing static data table format
 *
 *  TODO: Jump table? That'll come with loops...
 *
 *  TODO: Errors and Warnings?
 *
 **********/



/********** ********** ********** ********** **********
 * Code (constructor for code object containing generated code)
 **********/
function Code() {

    /********** ********** ********** ********** **********
     * final output array containing op codes, static area, and heap
     **********/
    this.output = [];

    /********** ********** ********** ********** **********
     * List of Op Codes (start at 0)
     **********/
    this.opCodes = [];
    this.currentAddress = 0;

    /********** ********** ********** ********** **********
     * List containing heap data (start at 255)
     **********/
    this.heap = [];
    this.heapAddress = 256;

    /********** ********** ********** ********** **********
     * Static Data Table ('T0XX' and 0 are the starting points)
     **********/
    this.staticTable = [];
    this.currentStaticAddress = 'T0XX';
    this.currentStaticOffset = 0;

    /********** ********** ********** ********** **********
     * Jump Table (starting points TBD...)
     **********/
    this.jumpTable = [];
    this.currentJumpAddress = 'TBD...';

    /********** ********** ********** ********** **********
     * TODO: Figure use of temporary addresses in int calculations
     **********/
    this.temp1 = "TMP1";
    this.temp2 = "TMP2";

}



/********** ********** ********** ********** **********
 * FormatProgram (combines the results of code gen to be displayed)
 **********/
Code.prototype.formatProgram = function() {

    // System call
    this.buildInstruction("00");

    // this.currentAddress is incremented every time we build an instruction,
    //  so the beginning of the static area should be... TODO: finish/phrase better?
    var staticStart = this.currentAddress;

    // Replaces all temporary variable memory locations with the actual location
    for (var key in this.staticTable) {

        var staticAddressOffset = this.staticTable[key][4];

        var position = staticStart + staticAddressOffset;

        var temporaryAddress = this.staticTable[key][0];

        var newAddress = ("0000" + position.toString(16)).substr(-2).toUpperCase();

        for (var j = 0; j < this.currentAddress; j++) {
            if (this.opCodes[j].match(/^T[0-9]$/)) {
                var cur = this.opCodes[j].concat(this.opCodes[j + 1]);

                if (cur.match(temporaryAddress)) {
                    this.opCodes[j] = newAddress;
                    this.opCodes[j + 1] = "00";
                }
            }
        }
    }

    // currentStaticOffset will have been incremented from the last static data table entry
    var temp1Position = staticStart + this.currentStaticOffset;
    var newTemp1 = ("0000" + temp1Position.toString(16)).substr(-2).toUpperCase();
    this.temp1 = newTemp1;

    var temp2Position = staticStart + this.currentStaticOffset + 1;
    var newTemp2 = ("0000" + temp2Position.toString(16)).substr(-2).toUpperCase();
    this.temp2 = newTemp2;

    this.opCodes[temp1Position] = this.temp1;
    this.opCodes[temp2Position] = this.temp2;

    for (var j = 0; j < this.currentAddress; j++) {
        if (this.opCodes[j].match(/^TM$/)) {
            var cur = this.opCodes[j].concat(this.opCodes[j + 1]);
            if (cur.match(/^TMP1$/)) {
                this.opCodes[j] = this.temp1;
                this.opCodes[j + 1] = "00";
            } else if (cur.match(/^TMP2$/)) {
                this.opCodes[j] = this.temp2;
                this.opCodes[j + 1] = "00";
            }
        }
    }

    // add space following each op code
    for (var k = 0; k < this.currentAddress; k++) {
        this.opCodes[k] = this.opCodes[k] + " ";
        this.output[k] = this.opCodes[k];
    }

    // fill space between current address and current heap address with 00
    for (var l = this.currentAddress; l < this.heapAddress; l++) {
        this.output[l] = "00" + " ";
    }

    // add space following each entry in the heap
    for (var m = 0; m < this.heap.length; m++) {
        this.heap[m] = this.heap[m] + " ";
        this.output[this.heapAddress] = this.heap[m];
        this.heapAddress++;
    }

    /********** ********** ********** ********** **********
     *
     * TODO: Implement error check for memory collisions
     *
     * TODO: Potential meme here...
     *
     **********/

}



/********** ********** ********** ********** **********
 * Build instruction and add it to the list of Op Codes
 **********/
Code.prototype.buildInstruction = function(instructions) {

    /*TODO: Better distinction between whether we're dealing with instruction or address*/

    if (instructions.length == 4) {
        // We're dealing with an address

        for (var i = 0; i < instructions.length/2; i++) {
            var instructionComponent = instructions.substr(2 * i, 2);
            this.opCodes[this.currentAddress] = instructionComponent;
            this.currentAddress++;
        }

    } else {
        // We're dealing with an op code

        this.opCodes[this.currentAddress] = instructions;
        this.currentAddress++;

    }
}



/********** ********** ********** ********** **********
 * Build instruction associated with new string, adds string the heap
 **********/
Code.prototype.buildString = function(string) {

    // unshift will insert new values at the beginning of the array
    this.heap.unshift("00");

    for (var i = string.length - 1; i >= 0; i--) {
        var currentLetter = string[i];
        currentLetter = ("0000" + currentLetter.charCodeAt(0).toString(16)).substr(-2).toUpperCase();
        this.heap.unshift(currentLetter);
    }

    this.heapAddress -= string.length + 1;

    var address = ("0000" + (this.heapAddress).toString(16)).substr(-2).toUpperCase();
    address = address + "00";

    return address;

}



/********** ********** ********** ********** ********** ********** **********
 * OPERATIONS ASSOCIATED WITH THE STATIC DATA TABLE
 ********** ********** ********** ********** ********** ********** **********/

/********** ********** ********** ********** **********
 * buildStaticEntry (create new static data table entry)
 **********/
Code.prototype.buildStaticEntry = function(node) {

    var entry = [];

    var key = getKey(node);

    var data = node.data.split("");

    entry.push(this.currentStaticAddress);

    for (var j = 0; j < 3; j++) {
        entry.push(data[j]);
    }

    entry.push(this.currentStaticOffset);

    this.staticTable[key] = entry;

    this.currentStaticOffset++;

    this.currentStaticAddress = nextStaticEntry(this.currentStaticAddress);

}

/********** ********** ********** ********** **********
 * nextStaticEntry (get the next static data table entry)
 ***********/
function nextStaticEntry(cur) {
    var next = String.fromCharCode(cur.charCodeAt(1) + 1);
    return 'T' + next + 'XX';
}

/********** ********** ********** ********** **********
 * getKey (the key associated with a given node)
 ***********/
function getKey(node) {
    var data = node.data.split("");
    var key = data[0].concat("@", data[1], data[2]);
    return key;
}

/********** ********** ********** ********** **********
 * getAddress (get the address associated with this node's corresponding static data table entry)
 ***********/
function getAddress(node) {
    var data = node.data.split("");
    var key = data[0].concat("@", data[1], data[2]);
    var entry = codeGen.target.staticTable[key];
    return entry[0];
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