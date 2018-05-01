/********** ********** ********** ********** **********
 * codeGen.js
 *
 * Includes...
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

    // For viewing clarity
    var trackerThing = 0;

    // Print output to the codeGen textarea
    for (var i = 0; i < codeGen.target.output.length; i++) {

        /*TODO: Format code output area*/

        document.getElementById("codeGen").value += codeGen.target.output[i];

        /*if (trackerThing == 0) {
            document.getElementById("codeGen").style.color = "magenta";
            document.getElementById("codeGen").value += codeGen.target.output[i];
            document.getElementById("codeGen").style.color = "black";
            trackerThing++;
        } else {
            document.getElementById("codeGen").value += codeGen.target.output[i];
            if (trackerThing == 15) {
                trackerThing = 0;
            } else {
                trackerThing++;
            }
        }*/

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
                buildIfStatement(node);

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

                /*TODO: check if string has already been stored
                * Helper function checkHeap() */

                var string = firstChild.data.join('');
                var address = codeGen.target.buildString(string);
                codeGen.target.buildInstruction("AD");
                codeGen.target.buildInstruction(address);
                codeGen.target.buildInstruction("A0");
                codeGen.target.buildInstruction(address.substring(0, 2));
                codeGen.target.buildInstruction("8D");
                codeGen.target.buildInstruction(codeGen.target.temp1);
                codeGen.target.buildInstruction("A2");
                codeGen.target.buildInstruction("02");

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
                    codeGen.target.buildInstruction("AC");
                    codeGen.target.buildInstruction(address);
                    codeGen.target.buildInstruction("A2");
                    codeGen.target.buildInstruction("01");

                }

            }  else if (firstChild.name.match(/^(true|false)$/)) {
                /*TODO: print boolean value*/

            } else if (firstChild.name.match(/^[0-9]$/)) {

                codeGen.target.buildInstruction("A0");
                codeGen.target.buildInstruction("0" + firstChild.name);
                codeGen.target.buildInstruction('A2');
                codeGen.target.buildInstruction('01');

            } else if (firstChild.name.match(/^\+$/)) {

                /*codeGen.target.buildInstruction('A9');
                value = ("0000" + firstChild.children[0].data.toString(16)).substr(-2);
                codeGen.target.buildInstruction(value);*/

                buildIntExpression(firstChild);

                codeGen.target.buildInstruction('AC');
                codeGen.target.buildInstruction(codeGen.target.temp2);
                codeGen.target.buildInstruction('A2');
                codeGen.target.buildInstruction('01');

            }

            codeGen.target.buildInstruction("FF");

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

                /*codeGen.target.buildInstruction('A9');
                value = ("0000" + secondChild.children[0].data.toString(16)).substr(-2);
                codeGen.target.buildInstruction(value);*/

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

        }



        /********** ********** ********** ********** **********
         * buildIntExpression()
         ***********/
        function buildIntExpression(node) {
            if (node.name.match(/^\+$/)) {

                /*codeGen.target.buildInstruction('A9');
                value = ("0000" + node.children[0].data.toString(16)).substr(-2);
                codeGen.target.buildInstruction(value);

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.temp2);*/

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

                codeGen.target.buildInstruction("8D");
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

                    codeGen.target.buildInstruction("8D");
                    codeGen.target.buildInstruction(codeGen.target.temp2);

/*                    codeGen.target.buildInstruction('A9');
                    value = ("0000" + node.data.toString(16)).substr(-2);
                    codeGen.target.buildInstruction(value);

                    codeGen.target.buildInstruction("8D");
                    codeGen.target.buildInstruction(codeGen.target.temp1);

                    codeGen.target.buildInstruction("AD");
                    codeGen.target.buildInstruction(codeGen.target.temp2);

                    codeGen.target.buildInstruction('6D');
                    codeGen.target.buildInstruction(codeGen.target.temp1);*/

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
         * buildIfExpression()
         ***********/
        function buildIdExpression() {

        }



    }



}