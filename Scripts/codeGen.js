/********** ********** ********** ********** **********
 * codeGen.js
 *
 * Includes...
 *
 * TODO: Better description for this file
 *
 * TODO: Continue working with boolean values and comparisons
 *
 * TODO: Clean up and refactor / look for areas to consolidate
 *
 * TODO: Generate errors and warnings (memory collision, etc.)
 *
 * TODO: Format code output area
 *
 **********/

function codeGen(ir, st) {

    // Display CODE GEN
    document.getElementById("compStatus").value += "\n";
    document.getElementById("compStatus").value += "CODE GEN \n";

    // Grab symbol table from AST
    var symbolTable = st;

    // Declare new instance of code to be generated (target program)
    codeGen.target = new Code();

    // Set the current node to the root
    var root = ir.getRoot();

    // Begin AST(IR) traversal
    traverse(root);

    // Format the generated code
    codeGen.target.formatProgram();



    /********** ********** ********** ********** ********** ********** **********
     * HELPER FUNCTIONS FOR CODE GEN
     ********** ********** ********** ********** ********** ********** **********/

    /********** ********** ********** ********** **********
     * getType ()
     ***********/
    function getType(node) {
        var data = node.data.split("");
        var key = data[0].concat("@", data[1], data[2]);
        var entry = symbolTable[key];
        return entry[0];
    }

    /********** ********** ********** ********** **********
     * getAddress
     ***********/
    function getAddress(node) {
        var data = node.data.split("");
        var key = data[0].concat("@", data[1], data[2]);
        var entry = codeGen.target.staticTable[key];
        return entry[0];
    }

    /********** ********** ********** ********** **********
     * getKey
     ***********/
    function getKey(node) {
        var data = node.data.split("");
        var key = data[0].concat("@", data[1], data[2]);
        return key;
    }

    /********** ********** ********** ********** **********
     * checkHeap
     ***********/
    function checkHeap(string) {

        if (codeGen.target.heapAddress == 256) {
            return null;
        }

        var found = false;

        var stringToHex = [];

        for (var i = 0; i < string.length; i++) {
            var currentLetter = string[i];
            currentLetter = ("0000" + currentLetter.charCodeAt(0).toString(16)).substr(-2).toUpperCase();
            stringToHex.push(currentLetter);
        }

        var temp = [];

        var start = codeGen.target.heap[0];
        var startHex = codeGen.target.heapAddress + 0;

        for (var i = 0; i < codeGen.target.heap.length; i++) {
            if (codeGen.target.heap[i] == '00') {

                if (temp.toString() == stringToHex.toString()) {
                    found = true;
                    break;
                } else {
                    var start = codeGen.target.heap[i + 1];
                    startHex = codeGen.target.heapAddress + i + 1;
                }

            } else {
                temp.push(codeGen.target.heap[i]);
            }
        }

        var address = ('0000' + (startHex).toString(16)).substr(-2).toUpperCase();

        if (found) {
            return address;
        } else {
            return null;
        }

    }



    /********** ********** ********** ********** ********** ********** **********
     * TREE TRAVERSAL AND OPERATIONS ASSOCIATED WITH CODE GEN
     ********** ********** ********** ********** ********** ********** **********/

    /********** ********** ********** ********** **********
     * traverse() ... IR Traversal
     ***********/
    function traverse(node) {

        // If there are no children (i.e., leaf nodes)...
        if (!node.children || node.children.length === 0) {

            // There are no children (we've hit a leaf node)

            // This should never happen because we assess each non-terminal (inner node)
            //  all the way through its corresponding subtree to the leaves

            // Exception is empty an block, which we don't generate code for

        } else {

            // There are children

            // For handling Blocks and Statements
            if (node.data.match(asToken.Kind.Block.pattern)) {
                generateBlock(node);

            } else if (node.data.match(asToken.Kind.PrintStatement.pattern)) {

                /********** ********** ********** ********** **********
                 * Generate code for print statement
                 ***********/

                generatePrintStatement(node);

            } else if (node.data.match(asToken.Kind.AssignmentStatement.pattern)) {

                /********** ********** ********** ********** **********
                 * Generate code for assignment statement
                 ***********/

                generateAssignmentStatement(node);

            } else if (node.data.match(asToken.Kind.VarDecl.pattern)) {

                /********** ********** ********** ********** **********
                 * Generate code for variable declaration
                 ***********/

                generateVarDecl(node);

            } else if (node.data.match(asToken.Kind.WhileStatement.pattern)) {

                /********** ********** ********** ********** **********
                 * Generate code for while statement
                 ***********/

                var returnToHere = codeGen.target.currentAddress;

                var skipWhile = codeGen.target.currentJumpAddress;
                codeGen.target.buildJumpEntry();

                var returnToWhile = codeGen.target.currentJumpAddress;
                codeGen.target.buildJumpEntry();

                /********** ********** ********** ********** **********
                 * Generate code for boolean expression
                 ***********/

                generateBooleanExpression(node.children[0]);

                /*codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('00');

                codeGen.target.buildInstruction('D0');
                codeGen.target.buildInstruction('02');

                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('01');

                codeGen.target.buildInstruction('A2');
                codeGen.target.buildInstruction('00');

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.temp1);

                codeGen.target.buildInstruction('EC');
                codeGen.target.buildInstruction(codeGen.target.temp1);*/

                codeGen.target.buildInstruction('D0');
                codeGen.target.buildInstruction(skipWhile);

                var skipFromHere = codeGen.target.currentAddress;

                /********** ********** ********** ********** **********
                 * Generate code for block
                 ***********/

                generateBlock(node.children[1]);

                // unconditional jump to the top of the while loop
                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('00');

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.temp1);

                codeGen.target.buildInstruction('A2');
                codeGen.target.buildInstruction('01');

                codeGen.target.buildInstruction('EC');
                codeGen.target.buildInstruction(codeGen.target.temp1);

                codeGen.target.buildInstruction('D0');
                codeGen.target.buildInstruction(returnToWhile);

                if ((codeGen.target.currentAddress - skipFromHere) == 0) {
                    var jumpVal = 0;
                } else {
                    var jumpVal = (codeGen.target.currentAddress - skipFromHere);
                }

                codeGen.target.jumpTable[skipWhile] = jumpVal;

                var returnVal = (256 - codeGen.target.currentAddress) + returnToHere;

                codeGen.target.jumpTable[returnToWhile] = returnVal;

            } else if (node.data.match(asToken.Kind.IfStatement.pattern)) {

                /********** ********** ********** ********** **********
                 * Generate code for if statement
                 ***********/

                var skipIf = codeGen.target.currentJumpAddress;

                codeGen.target.buildJumpEntry();

                /********** ********** ********** ********** **********
                 * Generate code for boolean expression
                 ***********/

                generateBooleanExpression(node.children[0]);

                codeGen.target.buildInstruction('D0');
                codeGen.target.buildInstruction(skipIf);

                var skipFromHere = codeGen.target.currentAddress;

                /********** ********** ********** ********** **********
                 * Generate code for block
                 ***********/

                generateBlock(node.children[1]);

                if ((codeGen.target.currentAddress - skipFromHere) == 0) {
                    var jumpVal = 0;
                } else {
                    var jumpVal = (codeGen.target.currentAddress - skipFromHere);
                }

                codeGen.target.jumpTable[skipIf] = jumpVal;

            }
        }



        /********** ********** ********** ********** **********
         * generateBlock()
         ***********/
        function generateBlock(node) {
            for (var i = 0; i < node.children.length; i++) {
                traverse(node.children[i]);
            }
        }



        /********** ********** ********** ********** **********
         * generatePrintStatement()
         ***********/
        function generatePrintStatement(node){

            var firstChild = node.children[0];

            if (firstChild.name.match("string")) {

                var string = firstChild.data.join('');

                var address = checkHeap(string);

                if (address == null) {
                    address = codeGen.target.buildString(string);
                } else {
                    // Heap already contains this string
                    // Use the address that was returned
                }

                codeGen.target.buildInstruction('A0');
                codeGen.target.buildInstruction(address);

                codeGen.target.buildInstruction('A2');
                codeGen.target.buildInstruction('02');

            } else if (firstChild.name.match(/^[a-z]$/)) {

                var address = getAddress(firstChild);
                var key = getKey(firstChild);

                if (symbolTable[key][0] == "string") {

                    codeGen.target.buildInstruction('AC');
                    codeGen.target.buildInstruction(address);

                    codeGen.target.buildInstruction('A2');
                    codeGen.target.buildInstruction('02');

                } else if (symbolTable[key][0] == "boolean") {

                    codeGen.target.buildInstruction('AC');
                    codeGen.target.buildInstruction(address);

                    codeGen.target.buildInstruction('A2');
                    codeGen.target.buildInstruction('01');

                } else if (symbolTable[key][0] == "int") {

                    codeGen.target.buildInstruction('AC');
                    codeGen.target.buildInstruction(address);

                    codeGen.target.buildInstruction('A2');
                    codeGen.target.buildInstruction('01');

                }

            }  else if (firstChild.name.match(/^(true|false)$/)) {

                if (firstChild.name.match(/^(true)$/)) {

                    codeGen.target.buildInstruction('A0');
                    codeGen.target.buildInstruction('01');

                    codeGen.target.buildInstruction('A2');
                    codeGen.target.buildInstruction('01');

                } else {

                    codeGen.target.buildInstruction('A0');
                    codeGen.target.buildInstruction('00');

                    codeGen.target.buildInstruction('A2');
                    codeGen.target.buildInstruction('01');

                }

            } else if (firstChild.name.match(/^[0-9]$/)) {

                codeGen.target.buildInstruction('A0');
                codeGen.target.buildInstruction('0' + firstChild.name);

                codeGen.target.buildInstruction('A2');
                codeGen.target.buildInstruction('01');

            } else if (firstChild.name.match(/^\+$/)) {

                generateIntExpression(firstChild);

                codeGen.target.buildInstruction('AC');
                codeGen.target.buildInstruction(codeGen.target.temp2);

                codeGen.target.buildInstruction('A2');
                codeGen.target.buildInstruction('01');

            } else if (firstChild.name.match(/^(==|!=)$/)) {

                /* We've hit a boolean expression... */
                generateBooleanExpression(firstChild);

            }

            codeGen.target.buildInstruction('FF');

        }



        /********** ********** ********** ********** **********
         * generateAssignmentStatement()
         ***********/
        function generateAssignmentStatement(node) {

            var firstChild = node.children[0];
            var secondChild = node.children[1];

            var type = getType(firstChild);
            var address = getAddress(firstChild);

            if (secondChild.name.match("string")) {

                var heapAddress = codeGen.target.buildString(secondChild.data);

                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction(heapAddress);

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(address);

            } else if (secondChild.name.match(/^[a-z]$/)) {

                var secondAddress = getAddress(secondChild);

                codeGen.target.buildInstruction('AD');
                codeGen.target.buildInstruction(secondAddress);

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(address);

            }  else if (secondChild.name.match(/^(true|false)$/)) {

                if (secondChild.name.match(/^(true)$/)) {

                    codeGen.target.buildInstruction('A9');
                    codeGen.target.buildInstruction('01');

                    codeGen.target.buildInstruction('8D');
                    codeGen.target.buildInstruction(address);

                } else {

                    codeGen.target.buildInstruction('A9');
                    codeGen.target.buildInstruction('00');

                    codeGen.target.buildInstruction('8D');
                    codeGen.target.buildInstruction(address);

                }

            } else if (secondChild.name.match(/^[0-9]$/)) {

                codeGen.target.buildInstruction('A9');
                value = ("0000" + secondChild.data.toString(16)).substr(-2);
                codeGen.target.buildInstruction(value);

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(address);

            } else if (secondChild.name.match(/^\+$/)) {

                generateIntExpression(secondChild);

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(address);

            } else if (secondChild.name.match(/^(==|!=)$/)) {

                /* We've hit a boolean expression... */
                generateBooleanExpression(secondChild);

                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('00');

                codeGen.target.buildInstruction('D0');
                codeGen.target.buildInstruction('02');

                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('01');

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(address);

            }

        }



        /********** ********** ********** ********** **********
         * generateVarDecl()
         ***********/
        function generateVarDecl(node) {

            var firstChild = node.children[0];

            /* All variables are initialized with '00' */

            if (firstChild.name.match("int")) {

                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('00');

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.currentStaticAddress);
                codeGen.target.buildStaticEntry(node.children[1]);

            } else if (firstChild.name.match("string")) {

                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('00');

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.currentStaticAddress);
                codeGen.target.buildStaticEntry(node.children[1]);

            } else if (firstChild.name.match("boolean")) {

                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('00');

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.currentStaticAddress);
                codeGen.target.buildStaticEntry(node.children[1]);

            }

        }



        /********** ********** ********** ********** **********
         * buildWhileStatement()
         ***********/
        function buildWhileStatement() {

            /* Modularized code, boolean expressions handled in own method */

        }



        /********** ********** ********** ********** **********
         * buildIfStatement()
         ***********/
        function buildIfStatement() {

            /* Modularized code, boolean expressions handled in own method */

        }



        /********** ********** ********** ********** **********
         * generateIntExpression()
         ***********/
        function generateIntExpression(node) {
            if (node.name.match(/^\+$/)) {

                generateIntExpression(node.children[1]);

                codeGen.target.buildInstruction('A9');
                value = ("0000" + node.children[0].data.toString(16)).substr(-2);
                codeGen.target.buildInstruction(value);

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.temp1);

                codeGen.target.buildInstruction('AD');
                codeGen.target.buildInstruction(codeGen.target.temp2);

                codeGen.target.buildInstruction('6D');
                codeGen.target.buildInstruction(codeGen.target.temp1);

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.temp2);

            } else {
                if (node.name.match(/^[a-z]$/)) {

                    codeGen.target.buildInstruction('AD');
                    var address = getAddress(node);
                    codeGen.target.buildInstruction(address);

                    codeGen.target.buildInstruction('8D');
                    codeGen.target.buildInstruction(codeGen.target.temp2);

                } else {

                    codeGen.target.buildInstruction('A9');
                    value = ("0000" + node.data.toString(16)).substr(-2);
                    codeGen.target.buildInstruction(value);

                    codeGen.target.buildInstruction('8D');
                    codeGen.target.buildInstruction(codeGen.target.temp2);

                }

            }
        }



        /********** ********** ********** ********** **********
         * generateBooleanExpression()
         ***********/
        function generateBooleanExpression(node) {

            /*var firstChild = node.children[0];

            alert(firstChild.name);*/

            if (node.name.match(/^(true|false)$/)) {

                /* First child, and only child, is boolval */

                if (node.name.match(/^(true)$/)) {

                    codeGen.target.buildInstruction('A9');
                    codeGen.target.buildInstruction('01');
                    codeGen.target.buildInstruction('8D');
                    codeGen.target.buildInstruction(codeGen.target.temp2);

                    codeGen.target.buildInstruction('A2');
                    codeGen.target.buildInstruction('01');

                    codeGen.target.buildInstruction('EC');
                    codeGen.target.buildInstruction(codeGen.target.temp2);

                } else {

                    codeGen.target.buildInstruction('A9');
                    codeGen.target.buildInstruction('00');
                    codeGen.target.buildInstruction('8D');
                    codeGen.target.buildInstruction(codeGen.target.temp2);

                    codeGen.target.buildInstruction('A2');
                    codeGen.target.buildInstruction('00');

                    codeGen.target.buildInstruction('EC');
                    codeGen.target.buildInstruction(codeGen.target.temp2);

                }

            } else {

                /* Otherwise we have a boolean operator */
                var leftSide = node.children[0];
                var rightSide = node.children[1];

                if (leftSide.name.match(/^(==|!=)$/) || rightSide.name.match(/^(==|!=)$/)) {
                    /* if boolean operators are present, through an error */

                    errorMsg = "Nested boolean detected, will not compile...";
                    codeGen.target.errors.push(errorMsg);
                    codeGen.target.errorCount++;

                } else if (leftSide.name.match(/^[a-z]$/)) {

                    /* Handle IDs */

                    /* Left side is an ID */

                    if (rightSide.name.match("string")) {
                        /* Variable to string literal comparison */

                        var stringRight = rightSide.data.join('');

                        var addressRight = checkHeap(stringRight);

                        if (addressRight == null) {

                            /* this means that the heap does not contain the string on the
                             *  right side of the comparison */

                            /* therefore, the variable and string literal must not be equal */

                        } else {

                            var lAddress = getAddress(leftSide);

                            codeGen.target.buildInstruction('A2');
                            codeGen.target.buildInstruction(addressRight);

                            codeGen.target.buildInstruction('EC');
                            codeGen.target.buildInstruction(lAddress);

                        }

                    } else if (rightSide.name.match(/^[a-z]$/)) {
                        /* Variable to variable comparison */

                        var lAddress = getAddress(leftSide);
                        codeGen.target.buildInstruction('AD');
                        codeGen.target.buildInstruction(lAddress);

                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        var rAddress = getAddress(rightSide);
                        codeGen.target.buildInstruction('AD');
                        codeGen.target.buildInstruction(rAddress);

                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp1);

                        codeGen.target.buildInstruction('AE');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp1);


                    } else if (rightSide.name.match(/^\+$/)) {
                        /* Variable to integer expression comparison */

                        generateIntExpression(rightSide);

                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        var address = getAddress(leftSide);
                        codeGen.target.buildInstruction('AE');
                        codeGen.target.buildInstruction(address);

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                    } else if (rightSide.name.match(/^[0-9]$/)) {
                        /* Variable to integer comparison */

                        var address = getAddress(leftSide);
                        codeGen.target.buildInstruction('AD');
                        codeGen.target.buildInstruction(address);

                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        codeGen.target.buildInstruction('A9');
                        value = ("0000" + rightSide.data.toString(16)).substr(-2);
                        codeGen.target.buildInstruction(value);

                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp1);

                        codeGen.target.buildInstruction('AE');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp1);

                    } else if (rightSide.name.match(/^(true|false)$/)) {
                        /* Variable to boolval comparison */

                        var address = getAddress(leftSide);
                        codeGen.target.buildInstruction('AD');
                        codeGen.target.buildInstruction(address);

                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        if (rightSide.name.match(/^(true)$/)) {

                            codeGen.target.buildInstruction('A2');
                            codeGen.target.buildInstruction('01');

                        } else {

                            codeGen.target.buildInstruction('A2');
                            codeGen.target.buildInstruction('00');

                        }

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                    }

                    if (node.name.match(/^(!=)$/)) {
                        /* Extra step needed for not equals */

                        codeGen.target.buildInstruction('A2');
                        codeGen.target.buildInstruction('00');

                        codeGen.target.buildInstruction('D0');
                        codeGen.target.buildInstruction('02');

                        codeGen.target.buildInstruction('A2');
                        codeGen.target.buildInstruction('01');

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction('FF');
                        codeGen.target.buildInstruction('00');

                    }

                } else if (rightSide.name.match(/^[a-z]$/)) {

                    /* Right side is an id */

                    if (leftSide.name.match("string")) {
                        /* Variable to string literal comparison */


                        var stringLeft = leftSide.data.join('');

                        var addressLeft = checkHeap(stringLeft);

                        if (addressLeft == null) {

                            /* this means that the heap does not contain the string on the
                             *  left side of the comparison */

                            /* therefore, the variable and string literal must not be equal */

                        } else {

                            var rAddress = getAddress(rightSide);

                            codeGen.target.buildInstruction('A2');
                            codeGen.target.buildInstruction(addressLeft);

                            codeGen.target.buildInstruction('EC');
                            codeGen.target.buildInstruction(rAddress);

                        }

                    } else if (leftSide.name.match(/^\+$/)) {
                        /* Variable to integer expression comparison */

                        generateIntExpression(leftSide);

                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        var address = getAddress(rightSide);
                        codeGen.target.buildInstruction('AE');
                        codeGen.target.buildInstruction(address);

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                    } else if (leftSide.name.match(/^[0-9]$/)) {
                        /* Variable to integer comparison */

                        var address = getAddress(rightSide);
                        codeGen.target.buildInstruction('AD');
                        codeGen.target.buildInstruction(address);

                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        codeGen.target.buildInstruction('A9');
                        value = ("0000" + rightSide.data.toString(16)).substr(-2);
                        codeGen.target.buildInstruction(value);

                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp1);

                        codeGen.target.buildInstruction('AE');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp1);

                    } else if (leftSide.name.match(/^(true|false)$/)) {
                        /* Variable to boolval comparison */

                        var address = getAddress(rightSide);
                        codeGen.target.buildInstruction('AD');
                        codeGen.target.buildInstruction(address);

                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        if (leftSide.name.match(/^(true)$/)) {

                            codeGen.target.buildInstruction('A2');
                            codeGen.target.buildInstruction('01');

                        } else {

                            codeGen.target.buildInstruction('A2');
                            codeGen.target.buildInstruction('00');

                        }

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                    }

                    if (node.name.match(/^(!=)$/)) {
                        /* Extra step needed for not equals */

                        codeGen.target.buildInstruction('A2');
                        codeGen.target.buildInstruction('00');

                        codeGen.target.buildInstruction('D0');
                        codeGen.target.buildInstruction('02');

                        codeGen.target.buildInstruction('A2');
                        codeGen.target.buildInstruction('01');

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction('FF');
                        codeGen.target.buildInstruction('00');

                    }

                } else {

                    /* No IDs present in the comparison */

                    if (leftSide.name.match(/^[0-9]$/) && rightSide.name.match(/^[0-9]$/)) {

                        codeGen.target.buildInstruction('A9');
                        value = ("0000" + leftSide.data.toString(16)).substr(-2);
                        codeGen.target.buildInstruction(value);
                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        codeGen.target.buildInstruction('A2');
                        value = ("0000" + rightSide.data.toString(16)).substr(-2);
                        codeGen.target.buildInstruction(value);

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                    } else if (leftSide.name.match(/^\+$/) && rightSide.name.match(/^[0-9]$/)) {

                        generateIntExpression(leftSide);

                        codeGen.target.buildInstruction('A2');
                        value = ("0000" + rightSide.data.toString(16)).substr(-2);
                        codeGen.target.buildInstruction(value);

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                    } else if (leftSide.name.match(/^[0-9]$/) && rightSide.name.match(/^\+$/)) {

                        generateIntExpression(rightSide);

                        codeGen.target.buildInstruction('A2');
                        value = ("0000" + leftSide.data.toString(16)).substr(-2);
                        codeGen.target.buildInstruction(value);

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                    } else if (leftSide.name.match(/^\+$/) && rightSide.name.match(/^\+$/)) {

                        generateIntExpression(leftSide);

                        /*
                        * CREATE NEW TEMPORARY MEMORY LOCATION FOR THIS COMPARISON
                        * */

                        codeGen.target.buildInstruction('AD');
                        codeGen.target.buildInstruction(codeGen.target.temp2);
                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(codeGen.target.temp3);

                        generateIntExpression(leftSide);

                        codeGen.target.buildInstruction('AE');
                        codeGen.target.buildInstruction(codeGen.target.temp2);

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction(codeGen.target.temp3);

                    } else if (leftSide.name.match(/^(true|false)$/) && rightSide.name.match(/^(true|false)$/)) {

                        /* compare boolvals */

                        if (node.name.match(/^(==)$/)) {

                            if (leftSide.name.match(/^(true)$/) && rightSide.name.match(/^(true)$/)) {

                                codeGen.target.buildInstruction('A2');
                                codeGen.target.buildInstruction('00');

                            } else if (leftSide.name.match(/^(false)$/) && rightSide.name.match(/^(false)$/)) {

                                codeGen.target.buildInstruction('A2');
                                codeGen.target.buildInstruction('00');

                            } else {

                                codeGen.target.buildInstruction('A2');
                                codeGen.target.buildInstruction('01');

                            }

                            codeGen.target.buildInstruction('EC');
                            codeGen.target.buildInstruction('FF');
                            codeGen.target.buildInstruction('00');

                        } else {

                            if (leftSide.name.match(/^(true)$/) && rightSide.name.match(/^(true)$/)) {

                                codeGen.target.buildInstruction('A2');
                                codeGen.target.buildInstruction('01');

                            } else if (leftSide.name.match(/^(false)$/) && rightSide.name.match(/^(false)$/)) {

                                codeGen.target.buildInstruction('A2');
                                codeGen.target.buildInstruction('01');

                            } else {

                                codeGen.target.buildInstruction('A2');
                                codeGen.target.buildInstruction('00');

                            }

                            codeGen.target.buildInstruction('EC');
                            codeGen.target.buildInstruction('FF');
                            codeGen.target.buildInstruction('00');

                        }

                    } else if (leftSide.name.match("string") && rightSide.name.match("string")) {

                        var stringLeft = leftSide.data.join('');

                        var stringRight = rightSide.data.join('');

                        var addressLeft = checkHeap(stringLeft);

                        var addressRight = checkHeap(stringRight);

                        if (addressLeft == null) {

                            if (addressRight == null) {

                                addressLeft = codeGen.target.buildString(stringLeft);

                                addressRight = checkHeap(stringRight);

                                if (addressRight == null) {

                                    /* addressLeft no longer null, but addressRight is
                                    *  the strings are different */

                                    codeGen.target.buildInstruction('A2');
                                    codeGen.target.buildInstruction('01');

                                } else {

                                    /* addressLeft no longer null, and neither is addressRight
                                     *  the strings are the same */

                                    codeGen.target.buildInstruction('A2');
                                    codeGen.target.buildInstruction('00');

                                }

                            } else {

                                /* addressLeft returns null, but addressRight doesn't
                                 *  the strings are different */

                                codeGen.target.buildInstruction('A2');
                                codeGen.target.buildInstruction('01');

                            }

                        } else {

                            if (addressRight == null) {

                                /* addressLeft returns not null, but addressRight doesn't
                                 *  the strings are different */

                                codeGen.target.buildInstruction('A2');
                                codeGen.target.buildInstruction('01');

                            } else {

                                /* addressLeft and addressRight both returned not null */

                                if (addressLeft == addressRight) {

                                    /* They're the same */

                                    codeGen.target.buildInstruction('A2');
                                    codeGen.target.buildInstruction('00');

                                } else {

                                    /* They're NOT the same */

                                    codeGen.target.buildInstruction('A2');
                                    codeGen.target.buildInstruction('01');

                                }

                            }

                        }

                        codeGen.target.buildInstruction('EC');
                        codeGen.target.buildInstruction('FF');
                        codeGen.target.buildInstruction('00');

                    }

                    if (!leftSide.name.match(/^(true|false)$/) && !rightSide.name.match(/^(true|false)$/)){

                        if (node.name.match(/^(!=)$/)) {
                            /* Extra step needed for not equals */

                            codeGen.target.buildInstruction('A2');
                            codeGen.target.buildInstruction('00');

                            codeGen.target.buildInstruction('D0');
                            codeGen.target.buildInstruction('02');

                            codeGen.target.buildInstruction('A2');
                            codeGen.target.buildInstruction('01');

                            codeGen.target.buildInstruction('EC');
                            codeGen.target.buildInstruction('FF');
                            codeGen.target.buildInstruction('00');

                        }

                    }

                }
            }
        }

    }

}