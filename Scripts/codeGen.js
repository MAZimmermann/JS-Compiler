/********** ********** ********** ********** **********
 * codeGen.js
 *
 * Includes...
 *
 * TODO: revise scope info/accuracy, place more data in AST(IR),
 *  TODO: define opcodes, pass along symbol table in addition to AST(IR)
 *
 **********/

function codeGen(ir) {

    // Declare new array (list of opcodes)
    var opCodes = [];

    // For now... fill opCodes with "00"s
    for (var i = 0; i < 256; i++) {
        opCodes[i] = "00";
    }

    // For now... fill "6502a Code" area with "00"s
    for (var j = 0; j < opCodes.length; j++) {
        document.getElementById("codeGen").value += opCodes[j] + " ";
    }

    // Set the current node to the root
    var root = ir.getRoot();

    // Begin AST(IR) traversal
    traverse(root);

    return;



    /********** ********** ********** ********** **********
     * traverse() ... IR Traversal
     ***********/
    function traverse(node) {

        // If there are no children (i.e., leaf nodes)...
        if (!node.children || node.children.length === 0) {
            // We've hit a leaf node, do nothing
        } else {

            // There are children

            if (node.data.match(asToken.Kind.Block.pattern)) {
                buildBlock(node);

            } else if (node.data.match(asToken.Kind.PrintStatement)) {
                buildPrintStatement(node);

            } else if (node.data.match(asToken.Kind.AssignmentStatement)) {
                buildAssignmentStatement(node);

            } else if (node.data.match(asToken.Kind.VarDecl)) {
                buildVarDecl(node);

            } else if (node.data.match(asToken.Kind.WhileStatement)) {
                buildWhileStatement(node);

            } else if (node.data.match(asToken.Kind.IfStatement)) {
                buildIfStatement(node);

            } else if (node.data.match(asToken.Kind.IntExpression)) {
                buildIntExpression(node);

            } else if (node.data.match(asToken.Kind.StringExpression)) {
                buildStringExpression(node);

            } else if (node.data.match(asToken.Kind.BooleanExpression)) {
                buildBooleanExpression(node);

            } else if (node.data.match(asToken.Kind.BoolvalExpression)) {
                buildBoolvalExpression(node);

            } else if (node.data.match(asToken.Kind.IdExpression)) {
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
            if (node.children[0].name.match("int")) {

            } else if (node.children[0].name.match("string")) {

            } else if (node.children[0].name.match("boolean")) {

            }
        }



        /********** ********** ********** ********** **********
         * buildAssignmentStatement()
         ***********/
        function buildAssignmentStatement() {

        }



        /********** ********** ********** ********** **********
         * buildVarDecl()
         ***********/
        function buildVarDecl() {

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