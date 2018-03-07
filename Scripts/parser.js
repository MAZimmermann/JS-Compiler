/********** ********** ********** ********** **********
* parser.js
*
* Includes
*  Nonterminal Function for handling each nonterminal
*  Match function to assess current and expected tokens
*  Error function for when parse is broken
*
**********/

function parse(tokensFromLex) {

    document.getElementById("parseOutput").value += "Program " + programCount + "\n";

    //Grab token array from lex output
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


    /********** ********** ********** ********** **********
    * Match function used to assess current and expected tokens
    ***********/
    function match(currentToken, expectedToken) {
        if (currentToken.value.match(expectedToken.pattern)) {

            return true;

        } else {

            false;

        }
    }


    /********** ********** ********** ********** **********
    * If ^match^ fails, throw parse error
    ***********/
    function parseError(errorMsg) {

        alert(errorMsg);

        throw new Error(errorMsg);

    }


    /********** ********** ********** ********** **********
    * Parse procedure needed for EVERY nonterminal
    **********/


    /********** ********** ********** ********** **********
    * parseProgram
    ***********/
    function parseProgram() {

        // call parseBlock
        cst.addNode("Block", "branch");
        parseBlock();
        cst.endChildren();

        if (match(tokens[iter], Token.Kind.EOP)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected EOP
             ***********/
            parseProgramError = "PARSER: ERROR: Expected EOP, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseProgramError;
            parseError(parseProgramError);

        }
    }


    /********** ********** ********** ********** **********
    * parseBlock
    ***********/
    function parseBlock() {
        if (match(tokens[iter], Token.Kind.L_BRACE)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

            // call parseStatementList
            cst.addNode("StatementList", "branch");
            parseStatementList();
            cst.endChildren();

            if (match(tokens[iter], Token.Kind.R_BRACE)) {

                cst.addNode(tokens[iter].value, "leaf"); iter++;

            } else {

                /**********
                 * ERROR Expected R_BRACE... ParseStatement should catch this, here for consistency
                 ***********/
                parseBlockError = "PARSER: ERROR: Expected R_BRACE, found [" + tokens[iter].value + "] on line " + tokens[iter].line
                document.getElementById("parseOutput").value += parseBlockError;
                parseError(parseBlockError);

            }

        } else {

            /**********
             * ERROR Expected L_BRACE
             ***********/
            parseBlockError = "PARSER: ERROR: Expected L_BRACE, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseBlockError;
            parseError(parseBlockError);

        }
    }


    /********** ********** ********** ********** **********
    * parseStatementList
    ***********/
    function parseStatementList() {
        while (!match(tokens[iter], Token.Kind.R_BRACE)) {

            // call parseStatement
            cst.addNode("Statement", "branch");
            parseStatement();
            cst.endChildren();

        }
    }


    /********** ********** ********** ********** **********
    * parseStatement
    ***********/
    function parseStatement() {
        if (match(tokens[iter], Token.Kind.PRINT)) {

            // call parsePrintStatement
            cst.addNode("PrintStatement", "branch");
            parsePrintStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.ID)) {

            // call parseAssignmentStatement
            cst.addNode("AssignmentStatement", "branch");
            parseAssignmentStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.TYPE)) {

            // call parseVarDecl
            cst.addNode("VarDecl", "branch");
            parseVarDecl();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.WHILE)) {

            // call parseWhileStatement
            cst.addNode("WhileStatement", "branch");
            parseWhileStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.IF)) {

            // call parseIfStatement
            cst.addNode("IfStatement", "branch");
            parseIfStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.L_BRACE)) {

            // call parseBlock
            cst.addNode("Block", "branch");
            parseBlock();
            cst.endChildren();

        }  else if (match(tokens[iter], Token.Kind.R_BRACE)) {

            // StatementList closed, do nothing

        } else {

            /**********
             * ERROR Expected Valid Start to Statement or R_BRACE
             ***********/
            parseStatementError = "PARSER: ERROR: Expected Valid Start to Statement or R_BRACE, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseStatementError;
            parseError(parseStatementError);

        }
    }


    /********** ********** ********** ********** **********
    * parsePrintStatement
    ***********/
    function parsePrintStatement() {

        // PRINT already matched
        cst.addNode(tokens[iter].value, "leaf"); iter++;

        if (match(tokens[iter], Token.Kind.L_PAREN)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

            // call parseExpression
            cst.addNode("Expression", "branch")
            parseExpression();
            cst.endChildren();

            if (match(tokens[iter], Token.Kind.R_PAREN)) {

                cst.addNode(tokens[iter].value, "leaf"); iter++;

            } else {

                /**********
                 * ERROR Expected R_PAREN
                 ***********/
                parsePrintStatementError = "PARSER: ERROR: Expected R_PAREN, found [" + tokens[iter].value + "] on line " + tokens[iter].line
                document.getElementById("parseOutput").value += parsePrintStatementError;
                parseError(parsePrintStatementError);

            }

        } else {

            /**********
             * ERROR Expected L_PAREN
             ***********/
            parsePrintStatementError = "PARSER: ERROR: Expected L_PAREN, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parsePrintStatementError;
            parseError(parsePrintStatementError);

        }
    }


    /********** ********** ********** ********** **********
    * parseAssignmentStatement
    ***********/
    function parseAssignmentStatement() {

        // call parseId
        cst.addNode("Id", "branch");
        parseId();
        cst.endChildren();

        if (match(tokens[iter], Token.Kind.ASSIGNOP)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

            // call parseExpression
            cst.addNode("Expression", "branch")
            parseExpression();
            cst.endChildren();

        } else {

            /**********
             * ERROR Expected ASSIGNOP
             ***********/
            parseAssignmentStatementError = "PARSER: ERROR: Expected ASSIGNOP, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseAssignmentStatementError;
            parseError(parseAssignmentStatementError);

        }
    }


    /********** ********** ********** ********** **********
    * parseVarDecl
    ***********/
    function parseVarDecl() {

        // call parseType
        cst.addNode("Type","branch");
        parseType();
        cst.endChildren();

        // call parseId
        cst.addNode("Id", "branch");
        parseId();
        cst.endChildren();
    }


    /********** ********** ********** ********** **********
    * parseWhileStatement
    ***********/
    function parseWhileStatement() {

        // WHILE already matched
        cst.addNode(tokens[iter].value, "leaf"); iter++;

        // call parseBooleanExpression
        cst.addNode("BooleanExpression", "branch")
        parseBooleanExpression();
        cst.endChildren();

        // call parseBlock
        cst.addNode("Block", "branch");
        parseBlock();
        cst.endChildren();
    }


    /********** ********** ********** ********** **********
    * parseIfStatement
    ***********/
    function parseIfStatement() {

        // IF already matched
        cst.addNode(tokens[iter].value, "leaf"); iter++;

        // call parseBooleanExpression
        cst.addNode("BooleanExpression", "branch")
        parseBooleanExpression();
        cst.endChildren();

        // call parseBlock
        cst.addNode("Block", "branch");
        parseBlock();
        cst.endChildren();
    }


    /********** ********** ********** ********** **********
    * parseExpression
    ***********/
    function parseExpression() {
        if (match(tokens[iter], Token.Kind.DIGIT)) {

            // call parseIntExpression
            cst.addNode("IntExpression", "branch");
            parseIntExpression();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.QUOTE)) {

            // call parseStringExpression
            cst.addNode("StringExpression", "branch");
            parseStringExpression();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.L_PAREN)) {

            // call parseBooleanExpression
            cst.addNode("BooleanExpression", "branch");
            parseBooleanExpression();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.CHAR)) {

            // call parseId
            cst.addNode("Id", "branch");
            parseId();
            cst.endChildren();

        } else {

            /**********
             * ERROR Expected Expression
             ***********/
            parseExpressiontError = "PARSER: ERROR: Expected Expression, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseExpressiontError;
            parseError(parseExpressiontError);

        }
    }


    /********** ********** ********** ********** **********
    * parseIntExpression
    ***********/
    function parseIntExpression() {

        // call parseDigit
        cst.addNode("Digit", "branch");
        parseDigit();
        cst.endChildren();

        if (match(tokens[iter], Token.Kind.INTOP)) {

            // call parseIntop
            cst.addNode("Intop", "branch");
            parseIntop();
            cst.endChildren();

            // call parseExpression
            cst.addNode("Expression", "branch");
            parseExpression();
            cst.endChildren();

        } else {

            // IntExpression consists of only digit

        }
    }


    /********** ********** ********** ********** **********
    * parseStringExpression
    ***********/
    function parseStringExpression() {
        if (match(tokens[iter], Token.Kind.QUOTE)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

            if (match(tokens[iter], Token.Kind.CHAR) || match(tokens[iter], Token.Kind.SPACE)) {

                // call parseCharList
                cst.addNode("CharList", "branch");
                parseCharList();
                cst.endChildren();

            }

            if (match(tokens[iter], Token.Kind.QUOTE)) {

                cst.addNode(tokens[iter].value, "leaf"); iter++;

            } else {

                /**********
                 * ERROR Expected closing QUOTE
                 ***********/
                parseStringExpressionError = "PARSER: ERROR: Expected closing QUOTE, found [" + tokens[iter].value + "] on line " + tokens[iter].line
                document.getElementById("parseOutput").value += parseStringExpressionError;
                parseError(parseStringExpressionError);

            }

        } else {

            /**********
             * ERROR Expected opening QUOTE
             ***********/
            parseStringExpressionError = "PARSER: ERROR: Expected opening QUOTE, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseStringExpressionError;
            parseError(parseStringExpressionError);

        }
    }


    /********** ********** ********** ********** **********
    * parseBooleanExpression
    ***********/
    function parseBooleanExpression() {
        if (match(tokens[iter], Token.Kind.L_PAREN)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

            // cale parseExpression
            cst.addNode("Expression", "branch");
            parseExpression();
            cst.endChildren();

            // call parseBoolop
            cst.addNode("Boolop", "branch");
            parseBoolop();
            cst.endChildren();

            // call parseExpression
            cst.addNode("Expression", "branch");
            parseExpression();
            cst.endChildren();

            if (match(tokens[iter], Token.Kind.R_PAREN)) {

                cst.addNode(tokens[iter].value, "leaf"); iter++;

            } else {

                /**********
                 * ERROR Expected R_PAREN
                 ***********/
                parseBooleanExpressionError = "PARSER: ERROR: Expected R_PAREN, found [" + tokens[iter].value + "] on line " + tokens[iter].line
                document.getElementById("parseOutput").value += parseBooleanExpressionError;
                parseError(parseBooleanExpressionError);

            }

        } else {

            /**********
             * ERROR Expected L_PAREN
             ***********/
            parseBooleanExpressionError = "PARSER: ERROR: Expected L_PAREN, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseBooleanExpressionError;
            parseError(parseBooleanExpressionError);

        }
    }


    /********** ********** ********** ********** **********
    * parseId
    ***********/
    function parseId() {
        if (match(tokens[iter], Token.Kind.CHAR)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected CHAR (ID)
             ***********/
            parseIdError = "PARSER: ERROR: Expected CHAR (ID), found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseIdError;
            parseError(parseIdError);

        }
    }


    /********** ********** ********** ********** **********
    * parseCharList
    ***********/
    function parseCharList() {
        while (!match(tokens[iter], Token.Kind.QUOTE)) {
            if (match(tokens[iter], Token.Kind.CHAR)) {

                // call parseChar
                cst.addNode("Char", "branch");
                parseChar();
                cst.endChildren();

                if (match(tokens[iter], Token.Kind.CHAR) && !match(tokens[iter], Token.Kind.QUOTE)) {

                    // call parseCharList
                    cst.addNode("CharList", "branch");
                    parseCharList();
                    cst.endChildren();

                } else if (match(tokens[iter], Token.Kind.SPACE) && !match(tokens[iter], Token.Kind.QUOTE)) {

                    // call parseCharList
                    cst.addNode("CharList", "branch");
                    parseCharList();
                    cst.endChildren();

                } else {
                    if (match(tokens[iter], Token.Kind.QUOTE)) {

                        // String closed, do nothing

                    } else {

                        /**********
                         * ERROR Expected CHAR, SPACE, or closing QUOTE
                         ***********/
                        parseCharListError = "PARSER: ERROR: Expected CHAR, SPACE, or closing QUOTE, found [" + tokens[iter].value + "] on line " + tokens[iter].line
                        document.getElementById("parseOutput").value += parseCharListError;
                        parseError(parseCharListError);

                    }
                }

            } else if (match(tokens[iter], Token.Kind.SPACE)) {

                // call parseSpace
                cst.addNode("Space", "branch");
                parseSpace();
                cst.endChildren();

                if (match(tokens[iter], Token.Kind.CHAR) && !match(tokens[iter], Token.Kind.QUOTE)) {

                    // call parseCharList
                    cst.addNode("CharList", "branch");
                    parseCharList();
                    cst.endChildren();

                } else if (match(tokens[iter], Token.Kind.SPACE) && !match(tokens[iter], Token.Kind.QUOTE)) {

                    // call parseCharList
                    cst.addNode("CharList", "branch");
                    parseCharList();
                    cst.endChildren();

                } else {

                    if (match(tokens[iter], Token.Kind.QUOTE)) {

                        // String closed, do nothing

                    } else {

                        /**********
                         * ERROR Expected CHAR, SPACE, or closing QUOTE
                         ***********/
                        parseCharListError = "PARSER: ERROR: Expected CHAR, SPACE, or closing QUOTE, found [" + tokens[iter].value + "] on line " + tokens[iter].line
                        document.getElementById("parseOutput").value += parseCharListError;
                        parseError(parseCharListError);

                    }
                }

            } else {
                if (match(tokens[iter], Token.Kind.QUOTE)) {

                    // String closed, do nothing

                } else {

                    /**********
                     * ERROR Expected CHAR, SPACE, or closing QUOTE
                     ***********/
                    parseCharListError = "PARSER: ERROR: Expected CHAR, SPACE, or closing QUOTE, found [" + tokens[iter].value + "] on line " + tokens[iter].line
                    document.getElementById("parseOutput").value += parseCharListError;
                    parseError(parseCharListError);

                }
            }
        }
    }


    /********** ********** ********** ********** **********
    * parseType
    ***********/
    function parseType() {
        if (match(tokens[iter], Token.Kind.TYPE)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected TYPE
             ***********/
            parseTypeError = "PARSER: ERROR: Expected TYPE, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseTypeError;
            parseError(parseTypeError);

        }
    }


    /********** ********** ********** ********** **********
    * parseChar
    ***********/
    function parseChar() {
        if (match(tokens[iter], Token.Kind.CHAR)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected CHAR
             ***********/
            parseCharError = "PARSER: ERROR: Expected CHAR, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseCharError;
            parseError(parseCharError);

        }
    }


    /********** ********** ********** ********** **********
    * parseSpace
    ***********/
    function parseSpace() {
        if (match(tokens[iter], Token.Kind.SPACE)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected SPACE
             ***********/
            parseSpaceError = "PARSER: ERROR: Expected SPACE, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseSpaceError;
            parseError(parseSpaceError);

        }
    }


    /********** ********** ********** ********** **********
    * parseDigit
    ***********/
    function parseDigit() {
        if (match(tokens[iter], Token.Kind.DIGIT)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected DIGIT
             ***********/
            parseDigitError = "PARSER: ERROR: Expected DIGIT, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseDigitError;
            parseError(parseDigitError);

        }
    }


    /********** ********** ********** ********** **********
    * parseBoolop
    ***********/
    function parseBoolop() {
        if (match(tokens[iter], Token.Kind.BOOLOP)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected BOOLOP
             ***********/
            parseBoolopError = "PARSER: ERROR: Expected BOOLOP, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseBoolopError;
            parseError(parseBoolopError);

        }
    }


    /********** ********** ********** ********** **********
    * parseBoolval
    ***********/
    function parseBoolval() {
        if (match(tokens[iter], Token.Kind.BOOLVAL)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected BOOLVAL
             ***********/
            parseBoolvalError = "PARSER: ERROR: Expected BOOLVAL, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseBoolvalError;
            parseError(parseBoolvalError);

        }
    }


    /********** ********** ********** ********** **********
    * parseIntop
    ***********/
    function parseIntop() {
        if (match(tokens[iter], Token.Kind.INTOP)) {

            cst.addNode(tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected INTOP
             ***********/
            parseIntopError = "PARSER: ERROR: Expected INTOP, found [" + tokens[iter].value + "] on line " + tokens[iter].line
            document.getElementById("parseOutput").value += parseIntopError;
            parseError(parseIntopError);

        }
    }

}
