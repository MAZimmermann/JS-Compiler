/**********
* parser.js
*
* Contains procedure for each nonterminal
*
**********/

/**********
* TODO:
**********/

function parse(tokensFromLex) {

    // Define/declare array of tokens to be assessed
    var tokens = tokensFromLex;

    // Array containing list of errors
    var errors = [];
    var errorCount = 0;
    // Array containing list of warnings
    var warnings = [];
    var warningCount = 0;

    // Keeps track of our position in the token array
    var iter = 0;

    // Create new instance of tree
    var cst = new Tree();

    // Initialize tree with root node
    cst.addNode("Root", "branch")
    cst.cur = cst.root;
    parseProgram();
    cst.endChildren();

    return cst;

    /**********
    * If ^match^ fails
    ***********/
    function match(currentToken, expectedToken) {
        if (currentToken.value.match(expectedToken.pattern)) {
            return true;
        } else {
            false;
        }
    }

    /**********
    * If ^match^ fails
    ***********/
    function parseError() {
        throw new Error("Parse Error Detected");
    }

    /**********
    * Parse procedure needed for every nonterminal
    **********/
    function parseProgram() {
        cst.addNode("Block", "branch");
        parseBlock();
        cst.endChildren();
        if (match(tokens[iter], Token.Kind.END_OF_FILE)) {
            cst.addNode("EOP", "leaf");
            iter++;
        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected [$] got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * If ^match^ fails
    ***********/
    function parseBlock() {
        if (match(tokens[iter], Token.Kind.L_BRACE)) {
            cst.addNode("{", "leaf");
            iter++;
            cst.addNode("StatementList", "branch");
            parseStatementList();
            cst.endChildren();
            if (match(tokens[iter], Token.Kind.R_BRACE)) {
                cst.addNode("}", "leaf");
                iter++;
            } else {
                // TODO: Error and such
                alert("PARSER: ERROR: Expected [}] got [" + tokens[iter].value + "] on line " + tokens[iter].line)
                parseError();
            }
        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected [{] got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * If ^match^ fails
    ***********/
    function parseStatementList() {

        /* Attempt productions in the order they are listed
        * However...
        *
        * TODO: Move this comment up
        *
        * */

        statementError = false;

        while (!match(tokens[iter], Token.Kind.R_BRACE)) {
            cst.addNode("Statement", "branch");
            parseStatement();
            cst.endChildren();

            if (statementError == true) {
                // TODO: Error and such
                alert("PARSER: ERROR: Expected [}] got [" + tokens[iter].value + "] on line " + tokens[iter].line);
                parseError();
            }
        }

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseStatement() {
        if (match(tokens[iter], Token.Kind.PRINT_STATEMENT)) {
            // Print Statement
            cst.addNode("PrintStatement", "branch");
            parsePrintStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.ID)) {
            // Assignment Statement
            cst.addNode("Assignment", "branch");
            parseAssignmentStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.VARIABLE_TYPE)) {
            // Variable Declaration
            cst.addNode("VariableDeclaration", "branch");
            parseVariableDeclaration();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.WHILE_STATEMENT)) {
            // While Statement
            parseWhileStatement();
            cst.addNode("WhileStatement", "branch");
            parseWhileStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.IF_STATEMENT)) {
            // If Statement
            parseIfStatement();
            cst.addNode("IfStatement", "branch");
            parseIfStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.L_BRACE)) {
            // Block
            parseBlock();

        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected valid start to statement got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * If ^match^ fails
    ***********/
    function parsePrintStatement() {
        cst.addNode("print", "leaf");
        iter++;
        if (match(tokens[iter], Token.Kind.L_PAREN)) {
            cst.addNode("(", "leaf");
            iter++;
            cst.addNode("Expression", "branch")
            parseExpression();
            cst.endChildren();
            if (match(tokens[iter], Token.Kind.R_PAREN)) {
                cst.addNode(")", "leaf");
                iter++;
            } else {
                // TODO: Error and such
                alert("PARSER: ERROR: Expected [)] got [" + tokens[iter].value + "] on line " + tokens[iter].line);
                parseError();
            }
        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected [(] got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * If ^match^ fails
    ***********/
    function parseAssignmentStatement() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseVariableDeclaration() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseWhileStatement() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseIfStatement() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseExpression() {
        // IntExpression
        if (match(tokens[iter], Token.Kind.DIGIT)) {
            parseIntExpression();

        } else if (match(tokens[iter], Token.Kind.QUOTE)) {
            // String expression
            parseStringExpression();

        } else if (match(tokens[iter], Token.Kind.L_PAREN)) {
            // Boolean expression

        } else if (match(tokens[iter], Token.Kind.ID)) {
            // Id

        }
        else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected valid start to expression got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * If ^match^ fails
    ***********/
    function parseIntExpression() {
        if (match(tokens[iter], Token.Kind.DIGIT.pattern)) {
            cst.addNode("IntExpression", "branch");
            iter++;
            cst.endChildren();
        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected digit got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * If ^match^ fails
    ***********/
    function parseStringExpression() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseBooleanExpression() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseId() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseCharList() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseType() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseChar() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseSpace() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseDigit() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseBoolop() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseBoolval() {

    }

    /**********
    * If ^match^ fails
    ***********/
    function parseIntop() {

    }

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