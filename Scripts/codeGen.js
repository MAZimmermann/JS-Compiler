/********** ********** ********** ********** **********
 * codeGen.js
 *
 * Includes...
 *
 *  TODO: Revise scope info/accuracy, place more data in AST(IR) ***(NEARLY THERE)***
 *
 *  TODO: Define opcodes, pass along symbol table in addition to AST(IR) ***(NEARLY THERE)***
 *
 *  TODO: Think about input needed, revise op code format
 *
 **********/

function codeGen(ir, st) {

    var symbolTable = st;

    // Declare new array (list of opcodes)
    codeGen.target = new Code();

    // Set the current node to the root
    var root = ir.getRoot();

    // Begin AST(IR) traversal
    traverse(root);

    /*var wrapAt = 1;*/

    for (var j = 0; j < 256; j++) {

        /********** ********** ********** ********** **********
         * Cap each line at sixteen op codes TODO: Revise This
         ***********/
        /*if (wrapAt == 16) {
            document.getElementById("codeGen").value += "\n";
            wrapAt = 1;
        } else {
            wrapAt++;
        }*/

        if (codeGen.target.bytes[j] != undefined) {
            document.getElementById("codeGen").value += codeGen.target.bytes[j] + " ";
        } else {
            document.getElementById("codeGen").value += "00" + " ";
        }

    }



    /********** ********** ********** ********** **********
     * getType
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
     * getHeapAddress
     ***********/
    /*function getAddress(node) {
        var data = node.data.split("");
        var key = data[0].concat("@", data[1], data[2]);
        var entry = codeGen.target.staticTable[key];
        return entry[3];
    }*/



    /********** ********** ********** ********** **********
     * traverse() ... IR Traversal
     ***********/
    function traverse(node) {

        // If there are no children (i.e., leaf nodes)...
        if (!node.children || node.children.length === 0) {
            // We've hit a leaf node, do nothing
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

/*        // For handling expressions
        if (node.data.match(asToken.Kind.Digit.pattern)) {
            buildIntExpression(node);

        } else {
            // TODO: More to do here...
        }*/



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

            if (firstChild.name.match("int")) {

            } else if (firstChild.name.match("string")) {

            } else if (firstChild.name.match("boolop")) {

            } else if (firstChild.name.match("id")) {

            }

        }



        /********** ********** ********** ********** **********
         * buildAssignmentStatement()
         ***********/
        function buildAssignmentStatement(node) {

            var firstChild = node.children[0];
            var secondChild = node.children[1];

            var type = getType(firstChild);
            var address = getAddress(firstChild);

            if (secondChild.name.match(/^[a-z]$/)){

                var secondAddress = getAddress(secondChild);
                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction(secondAddress);
                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(address);

                var key = getKey(firstChild);
                codeGen.target.staticTable[key][0] = secondAddress;

            } else {
                if (type.match("int")) {

/*                    codeGen.target.buildInstruction('A9');
                    codeGen.target.buildInstruction(address);*/
                    buildIntExpression(secondChild);
                    codeGen.target.buildInstruction('8D');
                    codeGen.target.buildInstruction(address);

                } else if (type.match("string")) {

                    var heapAddress = codeGen.target.buildString(secondChild.data);
                    codeGen.target.buildInstruction('A9');
                    codeGen.target.buildInstruction(heapAddress);
                    codeGen.target.buildInstruction('8D');
                    codeGen.target.buildInstruction(address);

                } else if (type.match("boolval")) {

                    // Don't know yet...

                }
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
                codeGen.target.buildInstruction(codeGen.target.currentStaticEntry);
                codeGen.target.buildStaticEntry(node.children[1].data);

            } else if (firstChild.name.match("string")) {

                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('00');
                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.currentStaticEntry);
                codeGen.target.buildStaticEntry(node.children[1].data);

            } else if (firstChild.name.match("boolean")) {

                /*codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('00');
                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.currentStaticEntry);
                codeGen.target.buildStaticEntry(node.children[1].data);
                TODO: Come back to this one... */

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
                codeGen.target.buildInstruction('A9');
                value = ("0000" + node.children[0].data.toString(16)).substr(-2);
                codeGen.target.buildInstruction(value);
                codeGen.target.buildInstruction('6D');
                codeGen.target.buildInstruction(codeGen.target.currentTempAddress);

            } else {

                if (node.name.match(/^[a-z]$/)) {
                    // TODO: account for ID at the end of int expression thingy
                }

                codeGen.target.buildInstruction('A9');
                value = ("0000" + node.data.toString(16)).substr(-2);
                codeGen.target.buildInstruction(value);
                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.currentTempAddress);

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