/********** ********** ********** ********** **********
 * buildAST.js
 *
 * Includes...
 *
 **********/

function buildAST(astTokens) {

    document.getElementById("saOutputTree").value += "Program " + programCount + "\n";
    document.getElementById("saOutputTree").value += "********** ********** **********\n";
    document.getElementById("saOutputTable").value += "Program " + programCount + "\n";
    document.getElementById("saOutputTable").value += "********** ********** **********\n";

    // Grab token array from lex output
    var tokens = astTokens;

    alert(tokens);

    // Create new instance of tree
    var ast = new Tree();

    // Initialize tree with root node
    ast.addNode("Block", "branch");

    // Set the current node to the root
    ast.cur = ast.root;

    ast.endChildren();

    var tree = ast.toString();

    document.getElementById("saOutputTree").value += tree + "\n";

}