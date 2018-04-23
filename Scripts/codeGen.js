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
    codeGen.target = new Code();

    // Set the current node to the root
    var root = ir.getRoot();

    // Begin AST(IR) traversal
    traverse(root);

    // // For now... fill opCodes with "00"s
    // for (var i = 0; i < 256; i++) {
    //     codeGen.target.opCodes[i] = "00";
    // }

    for (var j = 0; j < 256; j++) {
        if (codeGen.target.opCodes[j] != undefined) {
            document.getElementById("codeGen").value += codeGen.target.opCodes[j] + " ";
        } else {
            document.getElementById("codeGen").value += "00" + " ";
        }
    }



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

            } else if (node.data.match(asToken.Kind.IntExpression.pattern)) {
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
        function buildAssignmentStatement() {

        }



        /********** ********** ********** ********** **********
         * buildVarDecl()
         ***********/
        function buildVarDecl() {

            var firstChild = node.children[0];

            if (firstChild.name.match("int")) {

                codeGen.target.buildInstruction('A9');
                codeGen.target.buildInstruction('00');
                codeGen.target.buildStaticEntry(node.children[1].data);
                codeGen.target.buildInstruction('8D');
                codeGen.target.buildInstruction(codeGen.target.currentStaticEntry);

            } else if (firstChild.name.match("string")) {

            } else if (firstChild.name.match("boolean")) {

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