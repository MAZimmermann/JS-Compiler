/**********
 * parser.js
 *
 * Contains procedure for each nonterminal
 *
 **********/

/**********
 * TODO:
 **********/

function parse(tokensFromLex, startPosition) {

    // Define/declare array of tokens to be assessed
    var tokens = tokensFromLex;

    // Array containing list of errors
    var errors = []; var errorCount = 0;
    // Array containing list of warnings
    var warnings = []; var warningCount = 0;

    count = startPosition;
    if (tokens[0].kind == Token.Kind.L_BRACE) {

        // Create new instance of tree
        var cst = new Tree();
        // Initialize tree with root node
        cst.addNode("Root", "branch")

        // The first children should the goal symbol
        // TODO: Proper terminology?
        cst.addNode("Program", "branch")

        cst.addNode("Block", "branch")
        parseBlock();
        cst.addNode("EOP", "branch")

    } else {
        // TODO: error for invalid start of program
    }

    // This is no bueno at the moment
    if (count /*< tokens.length*/ == 1000000) {
        parse(tokensFromLex, count);
    } else {
        // return CST
        return cst;
    }

}

/**********
* Parse procedure needed for every nonterminal
**********/
function parseBlock() {

}
function parseStatementList() {

}
function parseStatement() {

}
function parsePrintStatement() {

}
function parseAssignmentStatement() {

}
function parseVariableDeclaration() {

}
function parseWhileStatement() {

}
function parseIfStatement() {

}
function parseExpression () {

}
function parseIntExpression () {

}
function parseStringExpression () {

}
function parseBooleanExpression () {

}
function parseId () {

}
function parseCharList () {

}
function parseType () {

}
function parseChar () {

}
function parseSpace () {

}
function parseDigit () {

}
function parseBoolop () {

}
function parseBoolval () {

}
function parseIntop () {

}
/*
 * Project Grammar Reference
 *
 * Program       ::== Block $
 * Block         ::== { StatementList }
 * StatementList ::== Statement StatementList
 * Statement     ::== PrintStatement
 *               ::== AssignmentStatement
 *               ::== VarDecl
 *               ::== WhileStatement
 *               ::== IfStatement
 *               ::== Block
 *
 * PrintStatement      ::== print( Expr )
 * AssignmentStatement ::== Id = Expr
 * VarDecl             ::== type Id
 * WhileStatement      ::== while BooleanExpr Block
 * IfStatement         ::== if BooleanExpr Block
 *
 * Expr        ::== IntExpr
 *             ::== StringExpr
 *             ::== BooleanExpr
 *             ::== Id
 * IntExp      ::== digit intop Expr
 *             ::== digit
 * StringExpr  ::== " CharList "
 * BooleanExpr ::== ( Expr boolop Expr)
 *             ::== boolval
 *             ::== char
 * Id          ::== char
 * CharList    ::== char CharList
 *             ::== space CharList
 *             ::== e
 *
 * type    ::== int | string | boolean
 * char    ::== a | b | c | ... | z
 * space   ::==  the space character
 * digit   ::==  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
 * boolop  ::==  == | !=
 * boolval ::== false | true
 * intop   ::== +
 *
 */