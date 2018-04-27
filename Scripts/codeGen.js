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

    // Print output to the codeGen textarea
    for (var i = 0; i < codeGen.target.output.length; i++) {
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
                var address = getAddress(firstChild);
                codeGen.target.buildInstruction("AC");
                codeGen.target.buildInstruction(address);
                codeGen.target.buildInstruction("A2");
                codeGen.target.buildInstruction("01");

            }  else if (firstChild.name.match(/^(true|false)$/)) {

            } else if (firstChild.name.match(/^[0-9]$/)) {

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

            } else if (secondChild.name.match(/^[0-9]$/) || node.name.match(/^\+$/)) {

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

                /* TODO: Begin boolean code gen */

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

                buildIntExpression(node.children[1]);

                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.currentTempAddress);

                codeGen.target.buildInstruction('A9');
                value = ("0000" + node.children[0].data.toString(16)).substr(-2);

                codeGen.target.buildInstruction(value);
                codeGen.target.buildInstruction('6D');
                codeGen.target.buildInstruction(codeGen.target.currentTempAddress);

            } else {
                if (node.name.match(/^[a-z]$/)) {

                    codeGen.target.buildInstruction('AD');
                    var address = getAddress(node);
                    codeGen.target.buildInstruction(address);

                } else {

                    codeGen.target.buildInstruction('A9');
                    value = ("0000" + node.data.toString(16)).substr(-2);
                    codeGen.target.buildInstruction(value);

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