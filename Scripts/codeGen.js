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

function codeGen(ir, symbols) {

    var finalTable = symbols;

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
        var type = finalTable[key][0];
        return type;
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

            // For handling expressions
            if (node.data.match(asToken.Kind.IntExpression.pattern)) {
                buildIntExpression(node);

            } else if (node.data.match(asToken.Kind.StringExpression.pattern)) {
                buildStringExpression(node);

            } else if (node.data.match(asToken.Kind.BooleanExpression.pattern)) {
                buildBooleanExpression(node);

            } else if (node.data.match(asToken.Kind.BoolvalExpression.pattern)) {
                buildBoolvalExpression(node);

            } else if (node.data.match(asToken.Kind.IdExpression.pattern)) {
                buildIdExpression(node);

            } else {
                // Don't know yet...
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

            } else {
                if (type.match("int")) {

                    if (secondChild.name.match(/^\+$/)) {

                        // Don't know yet...
                        // TODO: Use the traversal method to handle different expressions
                        traverse(secondChild);

                    } else {

                        codeGen.target.buildInstruction('A9');
                        value = ("0000" + secondChild.data.toString(16)).substr(-2);
                        codeGen.target.buildInstruction(value);
                        codeGen.target.buildInstruction('8D');
                        codeGen.target.buildInstruction(address);

                    }

                } else if (type.match("string")) {

                    var heapAddress = codeGen.target.buildString(secondChild.data);
                    codeGen.target.buildInstruction('A9');
                    codeGen.target.buildInstruction(heapAddress);
                    codeGen.target.buildInstruction('8D');
                    codeGen.target.buildInstruction(address);

                } else if (type.match("boolop")) {

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
        function buildIntExpression() {

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