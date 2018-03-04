/**********
* parser.js
*
* Includes
*  Function for handling each nonterminal
*  Match function to assess current and expected tokens
*  Error function for when parse is broken
*
**********/

/**********
* TODO:
* - Pass alerts to parseError()
* - Finalize nonterminal procedures
**********/

function parse(tokensFromLex) {

    /**********
    * Grab token array from lex output
    ***********/
    var tokens = tokensFromLex;

    // Keeps track of our position in the token array
    var iter = 0;

    // Create new instance of tree
    var cst = new Tree();

    // Initialize tree with root node
    cst.addNode("Root", "branch");

    // Set the current node to the root
    cst.cur = cst.root;

    // Begin parseProgram
    parseProgram();

    cst.endChildren();

    return cst;

    /**********
    * Match function used to assess current and expected tokens
    ***********/
    function match(currentToken, expectedToken) {
        if (currentToken.value.match(expectedToken.pattern)) {
            return true;
        } else {
            false;
        }
    }

    /**********
    * If ^match^ fails, throw parse error
    ***********/
    function parseError() {
        throw new Error("Parse Error Detected");
    }


    /**********
    * Parse procedure needed for EVERY nonterminal
    **********/


    /**********
    * parseProgram
    ***********/
    function parseProgram() {
        cst.addNode("Block", "branch");
        parseBlock();
        cst.endChildren();
        if (match(tokens[iter], Token.Kind.EOP)) {
            cst.addNode(tokens[iter].value, "leaf");
            iter++;
        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected [$] got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * parseBlock
    ***********/
    function parseBlock() {
        if (match(tokens[iter], Token.Kind.L_BRACE)) {
            cst.addNode(tokens[iter].value, "leaf"); iter++;
            cst.addNode("StatementList", "branch");
            parseStatementList();
            cst.endChildren();
            if (match(tokens[iter], Token.Kind.R_BRACE)) {
                cst.addNode(tokens[iter].value, "leaf"); iter++;
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
    * parseStatementList
    ***********/
    function parseStatementList() {

        // Do I need this?
        statementError = false;

        while (!match(tokens[iter], Token.Kind.R_BRACE)) {
            cst.addNode("Statement", "branch");
            parseStatement();
            cst.endChildren();

            // Revise this...
            if (statementError == true) {
                // TODO: Error and such
                alert("PARSER: ERROR: Expected [}] got [" + tokens[iter].value + "] on line " + tokens[iter].line);
                parseError();
            }
        }

    }

    /**********
    * parseStatement
    ***********/
    function parseStatement() {
        if (match(tokens[iter], Token.Kind.PRINT)) {
            // Print Statement
            cst.addNode("PrintStatement", "branch");
            parsePrintStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.CHAR)) {
            // Assignment Statement
            cst.addNode("Assignment", "branch");
            parseAssignmentStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.TYPE)) {
            // Variable Declaration
            cst.addNode("VariableDeclaration", "branch");
            parseVariableDeclaration();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.WHILE)) {
            // While Statement
            cst.addNode("WhileStatement", "branch");
            parseWhileStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.IF)) {
            // If Statement
            cst.addNode("IfStatement", "branch");
            parseIfStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.L_BRACE)) {
            // Block
            cst.addNode("Block", "branch");
            parseBlock();
            cst.endChildren();

        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected valid start to statement got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();

        }
    }

    /**********
    * parsePrintStatement
    ***********/
    function parsePrintStatement() {
        cst.addNode(tokens[iter].value, "leaf"); iter++;
        if (match(tokens[iter], Token.Kind.L_PAREN)) {
            cst.addNode(tokens[iter].value, "leaf"); iter++;
            cst.addNode("Expression", "branch")
            parseExpression();
            cst.endChildren();
            if (match(tokens[iter], Token.Kind.R_PAREN)) {
                cst.addNode(tokens[iter].value, "leaf"); iter++;
            } else {
                // TODO: Error and such
                alert("Expected [)] test");
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
    * parseAssignmentStatement
    ***********/
    function parseAssignmentStatement() {
        cst.addNode("Id", "branch");
        parseId();
        cst.endChildren();
        if (match(tokens[iter], Token.Kind.ASSIGNOP)) {
            cst.addNode(tokens[iter].value, "leaf"); iter++;
            cst.addNode("Expression", "branch")
            parseExpression();
            cst.endChildren();
        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected [=] got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * parseVariableDeclaration
    ***********/
    function parseVariableDeclaration() {
        cst.addNode(tokens[iter].value, "leaf"); iter++;
        if (match(tokens[iter], Token.Kind.CHAR)) {
            cst.addNode("Id", "branch");
            parseId();
            cst.endChildren();
        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected Id got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * parseWhileStatement
    ***********/
    function parseWhileStatement() {

        /*TODO: REVISE PLACEMENT OF TERMINAL INSERTION WHEN BRANCH MUST BE INSERTED*/

        cst.addNode(tokens[iter].value, "leaf"); iter++;

        cst.addNode("BooleanExpr", "branch")
        parseBooleanExpression();
        cst.endChildren();

        cst.addNode("Block", "branch");
        parseBlock();
        cst.endChildren();
    }

    /**********
    * parseIfStatement
    ***********/
    function parseIfStatement() {
        cst.addNode(tokens[iter].value, "leaf"); iter++;

        cst.addNode("BooleanExpr", "branch")
        parseBooleanExpression();
        cst.endChildren();

        cst.addNode("Block", "branch");
        parseBlock();
        cst.endChildren();
    }

    /**********
    * parseExpression
    ***********/
    function parseExpression() {
        // IntExpression
        if (match(tokens[iter], Token.Kind.DIGIT)) {
            cst.addNode("IntExpression", "branch");
            parseIntExpression();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.QUOTE)) {
            // String expression
            cst.addNode("StringExpression", "branch");
            parseStringExpression();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.L_PAREN)) {
            // Boolean expression
            cst.addNode("BooleanExpression", "branch");
            parseBooleanExpression();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.CHAR)) {
            // Id
            cst.addNode("Id", "branch");
            parseId();
            cst.endChildren();
        }
        else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected valid start to expression got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * parseIntExpression
    ***********/
    function parseIntExpression() {
        // redundant incase called again
        if (match(tokens[iter], Token.Kind.DIGIT)) {
            cst.addNode(tokens[iter].value, "leaf"); iter++;
            if (match(tokens[iter], Token.Kind.INTOP)) {
                cst.addNode(tokens[iter].value, "leaf"); iter++;
                cst.addNode("Expression", "branch");
                parseExpression();
                cst.endChildren();
            } else {
                // IntExpression consists of only digit
            }
        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected digit got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * parseStringExpression
    ***********/
    function parseStringExpression() {
        if (match(tokens[iter], Token.Kind.QUOTE)) {
            cst.addNode(tokens[iter].value, "leaf"); iter++;
            if (match(tokens[iter], Token.Kind.CHAR)) {
                cst.addNode("CharList", "branch");
                parseCharList();
                cst.endChildren();
            } else if (match(tokens[iter], Token.Kind.QUOTE)) {
                cst.addNode("CharList", "branch");
                cst.endChildren();
                cst.addNode(tokens[iter].value, "leaf"); iter++;
            }
            if (match(tokens[iter], Token.Kind.QUOTE)) {
                cst.addNode(tokens[iter].value, "leaf"); iter++;
            } else {
                // TODO: Error and such
                alert("PARSER: ERROR: Expected closing quote got [" + tokens[iter].value + "] on line " + tokens[iter].line);
                parseError();
            }
        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected opening quote got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * parseBooleanExpression
    ***********/
    function parseBooleanExpression() {
        if (match(tokens[iter], Token.Kind.L_PAREN)) {
            cst.addNode(tokens[iter].value, "leaf"); iter++;
            cst.addNode("Expression", "branch");
            parseExpression();
            cst.endChildren();
            if (match(tokens[iter], Token.Kind.BOOLOP)) {
                cst.addNode(tokens[iter].value, "leaf"); iter++;
                cst.addNode("Expression", "branch");
                parseExpression();
                cst.endChildren();
            } else {
                alert("test");
                // error
            }
            if (match(tokens[iter], Token.Kind.R_PAREN)) {
                cst.addNode(tokens[iter].value, "leaf"); iter++;
            } else {
                // error
            }
        } else {
            // error
        }
    }

    /**********
    * parseId
    ***********/
    function parseId() {
        if (match(tokens[iter], Token.Kind.CHAR)) {
            cst.addNode(tokens[iter].value, "leaf"); iter++;
        } else {
            // TODO: Error and such
            alert("PARSER: ERROR: Expected char got [" + tokens[iter].value + "] on line " + tokens[iter].line);
            parseError();
        }
    }

    /**********
    * parseCharList
    ***********/
    function parseCharList() {
        while (!match(tokens[iter], Token.Kind.QUOTE)) {
            if ((match(tokens[iter], Token.Kind.CHAR) || match(tokens[iter], Token.Kind.SPACE)) && !match(tokens[iter], Token.Kind.QUOTE)) {
                cst.addNode(tokens[iter].value, "leaf"); iter++;
                if ((match(tokens[iter], Token.Kind.CHAR) || match(tokens[iter], Token.Kind.SPACE)) && !match(tokens[iter], Token.Kind.QUOTE)) {
                    cst.addNode("CharList", "branch");
                    parseCharList();
                    cst.endChildren();
                } else {
                    if (match(tokens[iter], Token.Kind.QUOTE)) {
                        // Do nothing
                    } else {
                        // TODO: Error and such
                        alert("PARSER: ERROR: Expected char got [" + tokens[iter].value + "] on line " + tokens[iter].line);
                        parseError();
                    }
                }
            } else {
                if (match(tokens[iter], Token.Kind.QUOTE)) {
                    // Do nothing
                } else {
                    // TODO: Error and such
                    alert("PARSER: ERROR: Expected char got [" + tokens[iter].value + "] on line " + tokens[iter].line);
                    parseError();
                }
            }
        }
    }

    /**********
    * parseType
    ***********/
    function parseType() {

    }

    /**********
    * parseChar
    ***********/
    function parseChar() {

    }

    /**********
    * parseSpace
    ***********/
    function parseSpace() {

    }

    /**********
    * parseDigit
    ***********/
    function parseDigit() {

    }

    /**********
    * parseBoolop
    ***********/
    function parseBoolop() {

    }

    /**********
    * parseBoolval
    ***********/
    function parseBoolval() {

    }

    /**********
    * parseIntop
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