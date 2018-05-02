/********** ********** ********** ********** **********
 * code.js
 *
 * Includes:
 *  Code class via code constructor
 *
 *  TODO: Start boolvals and comparisons
 *
 *  TODO: Clean up and refactor / look for areas to consolidate
 *
 *  TODO: Consider editing static data table format
 *
 *  TODO: Errors and Warnings?
 *
 *
 *  TODO: Fix END CHILDREN
 *
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
    this.currentJumpAddress = 'J0';

    /********** ********** ********** ********** **********
     * TODO: Figure use of temporary addresses in int calculations
     **********/
    this.temp1 = 'TMP1';
    this.temp2 = 'TMP2';

    /* Added for intExpr == | != intExpr */
    this.temp3 = 'TMP3';

}



/********** ********** ********** ********** **********
 * FormatProgram (combines the results of code gen to be displayed)
 **********/
Code.prototype.formatProgram = function() {

    // System call
    this.buildInstruction('00');

    // this.currentAddress is incremented every time we build an instruction,
    //  so the beginning of the static area should be... TODO: finish/phrase better?
    var staticStart = this.currentAddress;

    // Replaces all temporary variable memory locations with the actual location
    for (var key in this.staticTable) {

        var staticAddressOffset = this.staticTable[key][4];

        var position = staticStart + staticAddressOffset;

        var temporaryAddress = this.staticTable[key][0];

        var newAddress = ('0000' + position.toString(16)).substr(-2).toUpperCase();

        for (var j = 0; j < this.currentAddress; j++) {
            if (this.opCodes[j].match(/^T[0-9]$/)) {
                var cur = this.opCodes[j].concat(this.opCodes[j + 1]);

                if (cur.match(temporaryAddress)) {
                    this.opCodes[j] = newAddress;
                    this.opCodes[j + 1] = '00';
                }
            }
        }
    }

    // Replaces all temporary jump variables with the actual jump value
    for (var key in this.jumpTable) {

        var jumpVal = this.jumpTable[key];

        jumpVal = '0' + jumpVal;;

        for (var j = 0; j < this.currentAddress; j++) {
            if (this.opCodes[j].match(key)) {
                this.opCodes[j] = jumpVal;
            }
        }
    }

    // currentStaticOffset will have been incremented from the last static data table entry
    var temp1Position = staticStart + this.currentStaticOffset;
    var newTemp1 = ('0000' + temp1Position.toString(16)).substr(-2).toUpperCase();
    this.temp1 = newTemp1;

    var temp2Position = staticStart + this.currentStaticOffset + 1;
    var newTemp2 = ('0000' + temp2Position.toString(16)).substr(-2).toUpperCase();
    this.temp2 = newTemp2;

    var temp3Position = staticStart + this.currentStaticOffset + 2;
    var newTemp3 = ('0000' + temp3Position.toString(16)).substr(-2).toUpperCase();
    this.temp3 = newTemp3;

    this.opCodes[temp1Position] = this.temp1;
    this.opCodes[temp2Position] = this.temp2;
    this.opCodes[temp3Position] = this.temp3;

    for (var j = 0; j < this.currentAddress; j++) {
        if (this.opCodes[j].match(/^TM$/)) {
            var cur = this.opCodes[j].concat(this.opCodes[j + 1]);
            if (cur.match(/^TMP1$/)) {
                this.opCodes[j] = this.temp1;
                this.opCodes[j + 1] = '00';
            } else if (cur.match(/^TMP2$/)) {
                this.opCodes[j] = this.temp2;
                this.opCodes[j + 1] = '00';
            } else if (cur.match(/^TMP3$/)) {
                this.opCodes[j] = this.temp3;
                this.opCodes[j + 1] = '00';
            }
        }
    }

    // add space following each op code
    for (var k = 0; k < this.currentAddress; k++) {
        this.opCodes[k] = this.opCodes[k] + ' ';
        this.output[k] = this.opCodes[k];
    }

    // fill space between current address and current heap address with 00
    for (var l = this.currentAddress; l < this.heapAddress; l++) {
        this.output[l] = '00' + ' ';
    }

    // add space following each entry in the heap
    for (var m = 0; m < this.heap.length; m++) {
        this.heap[m] = this.heap[m] + ' ';
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
    this.heap.unshift('00');

    for (var i = string.length - 1; i >= 0; i--) {
        var currentLetter = string[i];
        currentLetter = ('0000' + currentLetter.charCodeAt(0).toString(16)).substr(-2).toUpperCase();
        this.heap.unshift(currentLetter);
    }

    this.heapAddress -= string.length + 1;

    var address = ('0000' + (this.heapAddress).toString(16)).substr(-2).toUpperCase();
    address = address + '00';

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
 * getKey
 ***********/
function getKey(node) {
    var data = node.data.split("");
    var key = data[0].concat("@", data[1], data[2]);
    return key;
}



/********** ********** ********** ********** ********** ********** **********
 * OPERATIONS ASSOCIATED WITH THE JUMP TABLE
 ********** ********** ********** ********** ********** ********** **********/

/********** ********** ********** ********** **********
 * buildJumpEntry (create new jump data table entry)
 **********/
Code.prototype.buildJumpEntry = function() {

    this.jumpTable[this.currentJumpAddress] = this.currentJumpAddress;

    this.currentJumpAddress = nextJumpEntry(this.currentJumpAddress);

}

/********** ********** ********** ********** **********
 * nextJumpEntry (get the next jump table entry)
 ***********/
function nextJumpEntry(cur) {
    var next = String.fromCharCode(cur.charCodeAt(1) + 1);
    return 'J' + next;
}
