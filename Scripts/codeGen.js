/********** ********** ********** ********** **********
 * codeGen.js
 *
 * Includes
 *
 **********/

function codeGen(ir) {

    var opCodes = [];

    for (var i = 0; i < 256; i++) {
        opCodes[i] = "00";;
    }

    for (var j = 0; j < opCodes.length; j++) {
        document.getElementById("codeGen").value += opCodes[j] + " ";
    }

    // Set the current node to the root
    var root = ir.getRoot();

    traverse(root);

    // IR Traversal
    function traverse(node) {

            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0) {
                // We've hit a leaf node, do nothing
            } else {

                // There are children

                if (node.name.match(asToken.Kind.Block.pattern)) {
                    buildBlock(node);
                } else if (node.name.match(asToken.Kind.PrintStatement)) {
                    buildPrintStatement(node);

                } else if (node.name.match(asToken.Kind.AssignmentStatement)) {

                } else if (node.name.match(asToken.Kind.VarDecl)) {

                } else if (node.name.match(asToken.Kind.WhileStatement)) {

                } else if (node.name.match(asToken.Kind.IfStatement)) {

                } else if (node.name.match(asToken.Kind.IntExpression)) {

                } else if (node.name.match(asToken.Kind.StringExpression)) {

                } else if (node.name.match(asToken.Kind.BooleanExpression)) {

                } else if (node.name.match(asToken.Kind.BoolvalExpression)) {

                } else if (node.name.match(asToken.Kind.IdExpression)) {

                } else {
                    // Don't know yet...
                }
            }

            function buildBlock(node) {
                for (var i = 0; i < node.children.length; i++) {
                    traverse(node.children[i]);
                }
            }

            function buildPrintStatement(node){
                /*alert(node.children[0].name);*/
                /*if (node.children[0].match()) {

                }*/

            }

    };



}