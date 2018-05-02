/********** ********** ********** ********** **********
 * codeGen.js
 *
 * Includes...
 *
 * TODO: Start boolvals and comparisons
 *
 * TODO: Clean up and refactor / look for areas to consolidate
 *
 * TODO: Errors and Warnings?
 *
 **********/

function codeGen(ir, st) {

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

    // Print output to the codeGen textarea
    for (var i = 0; i < codeGen.target.output.length; i++) {

        /*TODO: Format code output area*/

        document.getElementById("codeGen").value += codeGen.target.output[i];

    }



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
        var heapToString = codeGen.target.heap.toString();

        /*TODO: Finish writing this function*/
        heapToString = heapToString.replace(',', '');

        var stringToHex = "";

        for (var i = string.length - 1; i >= 0; i--) {
            var currentLetter = string[i];
            currentLetter = ("0000" + currentLetter.charCodeAt(0).toString(16)).substr(-2).toUpperCase();
            stringToHex = stringToHex + currentLetter;
        }

        /*alert(heapToString);
        alert(stringToHex);*/

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
            // We've hit a leaf node

            /*TODO: Do I want to assess children up here? Separately?*/

            if (node.name.match("string")) {
                buildString(node);

            } else if (node.name.match(/^[a-z]$/)) {

            }  else if (node.name.match(/^(true|false)$/)) {

            } else if (node.name.match(/^[0-9]$/)) {

            }

        } else {

            // There are children

            // For handling Blocks and Statements
            if (node.data.match(asToken.Kind.Block.pattern)) {
                buildBlock(node);

            } else if (node.data.match(asToken.Kind.PrintStatement.pattern)) {
                buildPrintStatement(node);

            } else if (node.data.match(asToken.Kind.AssignmentStatement.pattern)) {
                buildAssignmentStatement(node);

            } else if (node.data.match(asToken.Kind.VarDecl.pattern)) {
                buildVarDecl(node);

            } else if (node.data.match(asToken.Kind.WhileStatement.pattern)) {
                buildWhileStatement(node);

            } else if (node.data.match(asToken.Kind.IfStatement.pattern)) {

                var holdCurrentJump = codeGen.target.currentJumpAddress;

                codeGen.target.buildJumpEntry();

                buildIfStatement(node);

                codeGen.target.buildInstruction('D0');
                codeGen.target.buildInstruction(holdCurrentJump);

                var holdCurrentAddress = codeGen.target.currentAddress;

                buildBlock(node.children[1]);

                var jumpVal = (codeGen.target.currentAddress - holdCurrentAddress) + 1;

                codeGen.target.jumpTable[holdCurrentJump] = jumpVal;

            }
        }



        /********** ********** ********** ********** **********
         * buildBlock()
         ***********/
        function buildBlock(node) {
            for (var i = 0; i < node.children.length; i++) {
                traverse(node.children[i]);
            }
        }



        /********** ********** ********** ********** **********
         * buildPrintStatement()
         ***********/
        function buildPrintStatement(node){

            var firstChild = node.children[0];

            if (firstChild.name.match("string")) {

                var string = firstChild.data.join('');
                var address = codeGen.target.buildString(string);

                /*
                TODO: Remember to revisit this...
                checkHeap(string);*/

                codeGen.target.buildInstruction('AD');
                codeGen.target.buildInstruction(address);

                codeGen.target.buildInstruction('A0');
                codeGen.target.buildInstruction(address.substring(0, 2));

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.temp1);

                codeGen.target.buildInstruction('A2');
                codeGen.target.buildInstruction('02');

            } else if (firstChild.name.match(/^[a-z]$/)) {

                /*TODO: This depends on the value stored... */

                var address = getAddress(firstChild);
                var key = getKey(firstChild);

                if (symbolTable[key][0] == "string") {
                    /*TODO: string id*/

                } else if (symbolTable[key][0] == "boolean") {
                    /*TODO: boolean id*/

                } else if (symbolTable[key][0] == "int") {

                    /*TODO: int id*/
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

                buildIntExpression(firstChild);

                codeGen.target.buildInstruction('AC');
                codeGen.target.buildInstruction(codeGen.target.temp2);

                codeGen.target.buildInstruction('A2');
                codeGen.target.buildInstruction('01');

            }

            codeGen.target.buildInstruction('FF');

        }



        /********** ********** ********** ********** **********
         * buildAssignmentStatement()
         ***********/
        function buildAssignmentStatement(node) {

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

                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction(secondAddress);

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(address);

                var key = getKey(firstChild);
                codeGen.target.staticTable[key][0] = secondAddress;

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

                buildIntExpression(secondChild);

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(address);

            }

        }



        /********** ********** ********** ********** **********
         * buildVarDecl()
         ***********/
        function buildVarDecl(node) {

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

        }



        /********** ********** ********** ********** **********
         * buildIfStatement()
         ***********/
        function buildIfStatement() {

            var firstChild = node.children[0];

            var leftSide = firstChild.children[0];
            var rightSide = firstChild.children[1];

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

                buildIntExpression(leftSide);

                codeGen.target.buildInstruction('A2');
                value = ("0000" + rightSide.data.toString(16)).substr(-2);
                codeGen.target.buildInstruction(value);
                codeGen.target.buildInstruction('EC');
                codeGen.target.buildInstruction(codeGen.target.temp2);

            } else if (leftSide.name.match(/^[0-9]$/) && rightSide.name.match(/^\+$/)) {

                buildIntExpression(rightSide);

                codeGen.target.buildInstruction('A2');
                value = ("0000" + leftSide.data.toString(16)).substr(-2);
                codeGen.target.buildInstruction(value);
                codeGen.target.buildInstruction('EC');
                codeGen.target.buildInstruction(codeGen.target.temp2);

            } else if (leftSide.name.match(/^\+$/) && rightSide.name.match(/^\+$/)) {

                buildIntExpression(leftSide);

                /*
                * CREATE NEW TEMPORARY MEMORY LOCATION FOR THIS COMPARISON
                * */

                codeGen.target.buildInstruction('AD');
                codeGen.target.buildInstruction(codeGen.target.temp2);
                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.temp3);

                buildIntExpression(leftSide);

                codeGen.target.buildInstruction('A2');
                codeGen.target.buildInstruction(codeGen.target.temp2);
                codeGen.target.buildInstruction('EC');
                codeGen.target.buildInstruction(codeGen.target.temp3);

            } else {

                if (leftSide.name.match("string")) {

                    /*TODO: Come back to strings... */

                    var string = leftSide.data.join('');
                    var address = codeGen.target.buildString(string);

                } else if (leftSide.name.match(/^[a-z]$/)) {

                    /*TODO: Come back to strings IDs... */

                    var address = getAddress(rightSide);
                    codeGen.target.buildInstruction('AE');
                    codeGen.target.buildInstruction(address);

                }  else if (leftSide.name.match(/^(true|false)$/)) {

                    if (leftSide.name.match(/^(true)$/)) {

                        codeGen.target.buildInstruction('A9');
                        codeGen.target.buildInstruction('01');
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

                    } else {

                        codeGen.target.buildInstruction('A9');
                        codeGen.target.buildInstruction('00');
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

                }

            }

        }



        /********** ********** ********** ********** **********
         * buildIntExpression()
         ***********/
        function buildIntExpression(node) {
            if (node.name.match(/^\+$/)) {

                buildIntExpression(node.children[1]);

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
         * buildStringExpression()
         ***********/
        function buildStringExpression() {

        }



        /********** ********** ********** ********** **********
         * buildBooleanExpression()
         ***********/
        function buildBooleanExpression() {

        }



        /********** ********** ********** ********** **********
         * buildBoolvalExpression()
         ***********/
        function buildBoolvalExpression() {

        }



        /********** ********** ********** ********** **********
         * buildIdExpression()
         ***********/
        function buildIdExpression() {

        }



    }



}