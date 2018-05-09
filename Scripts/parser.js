/********** ********** ********** ********** **********
* parser.js
*
* Includes
*  Nonterminal functions for handling each nonterminal
*  Match function to assess current and expected tokens
*  Error function for when parse is broken
*
**********/

function parse(tokensFromLex) {

    document.getElementById("compStatus").value += "\n";
    document.getElementById("compStatus").value += "PARSE \n";

    document.getElementById("parseOutput").value += "Program " + programCount + "\n";
    document.getElementById("parseOutput").value += "********** ********** **********\n";

    // Grab token array from lex output
    var tokens = tokensFromLex;

    // This will contain the tokens need for the AST
    var astTokens = [];

    /*for (var z = 0; z < tokensFromLex.length; z++) {
        alert(tokensFromLex[z].value)
    }*/

    // Array containing list of warnings
    // This won't ever actually be used...
    var warnings = []; var warningCount = 0;

    // Keeps track of our position in the token array
    var iter = 0;

    // Create new instance of tree
    var cst = new Tree();

    // Initialize tree with root node
    cst.addNode("Root", "Root", "branch");

    // Set the current node to the root
    cst.cur = cst.root;

    var running = true;

    // Keep track of the depth/scope as we add new asTokens
    var depth = 0;

    // Begin parseProgram
    parseProgram();

    cst.endChildren();

    document.getElementById("compStatus").value += "Found 0 warning(s)" + "\n";

    document.getElementById("compStatus").value += "\n";

    document.getElementById("compStatus").value += "Found 0 error(s)" + "\n";

    var parseReturns = {
        tree: cst,
        tokens: astTokens
    };

    return parseReturns;


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

        // There aren't really any warnings to report during this phase
        // Warnings section is only listed for consistency
        document.getElementById("compStatus").value += "Found " + 0 + " warning(s)" + "\n";
        if (warningCount == 0) {
            document.getElementById("compStatus").value += "\n";
        } else {
            for (var a = 0; a < warningCount; a++) {
                document.getElementById("compStatus").value += warnings[a] + "\n";
            }

            document.getElementById("compStatus").value += "\n";

        }

        // As soon as we detect an error, we will quit parse
        // So, there will aways be only 1 error to report
        // However, we will use the same format used in Lex for consistency

        document.getElementById("compStatus").value += "Found " + 1 + " error(s) \n";
        document.getElementById("compStatus").value += errorMsg + "\n";

        running = false;

        throw new Error(errorMsg);

    }


    /********** ********** ********** ********** **********
    * Parse procedure needed for EVERY nonterminal
    **********/


    /********** ********** ********** ********** **********
    * parseProgram
    ***********/
    function parseProgram() {

        if (!running) {
            return;
        }

        // call parseBlock
        cst.addNode("Block", "Block", "branch");

        // Add Block to astTokens
        newToken = asToken.build(asToken.Kind.Block, "Block", depth, tokens[iter].line);
        astTokens.push(newToken);

        depth++;

        parseBlock();
        cst.endChildren();

        if (match(tokens[iter], Token.Kind.EOP)) {

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected EOP
             ***********/
            parseProgramError = /*"PARSER: ERROR: */"Expected EOP, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseProgramError;
            parseError(parseProgramError);

        }
    }


    /********** ********** ********** ********** **********
    * parseBlock
    ***********/
    function parseBlock() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.L_BRACE)) {

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

            // call parseStatementList
            cst.addNode("StatementList", "StatementList", "branch");
            parseStatementList();
            cst.endChildren();

            if (match(tokens[iter], Token.Kind.R_BRACE)) {

                cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

            } else {

                /**********
                 * ERROR Expected R_BRACE... ParseStatement should catch this, here for consistency
                 ***********/
                parseBlockError = /*"PARSER: ERROR: */"Expected R_BRACE, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
                document.getElementById("parseOutput").value += parseBlockError;
                parseError(parseBlockError);

            }

        } else {

            /**********
             * ERROR Expected L_BRACE
             ***********/
            parseBlockError = /*"PARSER: ERROR:*/"Expected L_BRACE, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseBlockError;
            parseError(parseBlockError);

        }

        depth--;

    }


    /********** ********** ********** ********** **********
    * parseStatementList
    ***********/
    function parseStatementList() {

        if (!running) {
            return;
        }

        while (!match(tokens[iter], Token.Kind.R_BRACE)) {

            // call parseStatement
            cst.addNode("Statement", "Statement", "branch");
            parseStatement();
            cst.endChildren();

        }
    }


    /********** ********** ********** ********** **********
    * parseStatement
    ***********/
    function parseStatement() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.PRINT)) {

            // call parsePrintStatement
            cst.addNode("PrintStatement", "PrintStatement", "branch");

            // Add PrintStatement to astTokens
            newToken = asToken.build(asToken.Kind.PrintStatement, "PrintStatement", depth, tokens[iter].line);
            astTokens.push(newToken);

            parsePrintStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.ID)) {

            // call parseAssignmentStatement
            cst.addNode("AssignmentStatement", "AssignmentStatement", "branch");

            // Add AssignmentStatement to astTokens
            newToken = asToken.build(asToken.Kind.AssignmentStatement, "AssignmentStatement", depth, tokens[iter].line);
            astTokens.push(newToken);

            parseAssignmentStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.TYPE)) {

            // call parseVarDecl
            cst.addNode("VarDecl", "VarDecl", "branch");

            // Add VarDecl to astTokens
            newToken = asToken.build(asToken.Kind.VarDecl, "VarDecl", depth, tokens[iter].line);
            astTokens.push(newToken);

            parseVarDecl();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.WHILE)) {

            // call parseWhileStatement
            cst.addNode("WhileStatement", "WhileStatement", "branch");

            // Add WhileStatement to astTokens
            newToken = asToken.build(asToken.Kind.WhileStatement, "WhileStatement", depth, tokens[iter].line);
            astTokens.push(newToken);

            parseWhileStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.IF)) {

            // call parseIfStatement
            cst.addNode("IfStatement", "IfStatement", "branch");

            // Add IfStatement to astTokens
            newToken = asToken.build(asToken.Kind.IfStatement, "IfStatement", depth, tokens[iter].line);
            astTokens.push(newToken);

            parseIfStatement();
            cst.endChildren();

        } else if (match(tokens[iter], Token.Kind.L_BRACE)) {

            // call parseBlock
            cst.addNode("Block", "Block", "branch");

            // Add Block to astTokens
            newToken = asToken.build(asToken.Kind.Block, "Block", depth, tokens[iter].line);
            astTokens.push(newToken);

            depth++;

            parseBlock();
            cst.endChildren();

        }  else if (match(tokens[iter], Token.Kind.R_BRACE)) {

            // StatementList closed, do nothing

        } else {

            /**********
             * ERROR Expected Valid Start to Statement or R_BRACE
             ***********/
            parseStatementError = /*"PARSER: ERROR: */"Expected valid start to Statement or R_BRACE, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseStatementError;
            parseError(parseStatementError);

        }
    }


    /********** ********** ********** ********** **********
    * parsePrintStatement
    ***********/
    function parsePrintStatement() {

        if (!running) {
            return;
        }

        // PRINT already matched
        cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        if (match(tokens[iter], Token.Kind.L_PAREN)) {

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

            // call parseExpression
            cst.addNode("Expression", "Expression", "branch")
            parseExpression();
            cst.endChildren();

            if (match(tokens[iter], Token.Kind.R_PAREN)) {

                cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

            } else {

                /**********
                 * ERROR Expected R_PAREN
                 ***********/
                parsePrintStatementError = /*"PARSER: ERROR: */"Expected R_PAREN, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
                document.getElementById("parseOutput").value += parsePrintStatementError;
                parseError(parsePrintStatementError);

            }

        } else {

            /**********
             * ERROR Expected L_PAREN
             ***********/
            parsePrintStatementError = /*"PARSER: ERROR: */"Expected L_PAREN, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parsePrintStatementError;
            parseError(parsePrintStatementError);

        }
    }


    /********** ********** ********** ********** **********
    * parseAssignmentStatement
    ***********/
    function parseAssignmentStatement() {

        if (!running) {
            return;
        }

        // call parseId
        cst.addNode("Id", "Id", "branch");
        parseId();
        cst.endChildren();

        if (match(tokens[iter], Token.Kind.ASSIGNOP)) {

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

            // call parseExpression
            cst.addNode("Expression", "Expression", "branch")
            parseExpression();
            cst.endChildren();

        } else {

            /**********
             * ERROR Expected ASSIGNOP
             ***********/
            parseAssignmentStatementError = /*"PARSER: ERROR: */"Expected ASSIGNOP, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseAssignmentStatementError;
            parseError(parseAssignmentStatementError);

        }
    }


    /********** ********** ********** ********** **********
    * parseVarDecl
    ***********/
    function parseVarDecl() {

        if (!running) {
            return;
        }

        // call parseType
        cst.addNode("Type","Type", "branch");
        parseType();
        cst.endChildren();

        // call parseId
        cst.addNode("Id", "Id", "branch");
        parseId();
        cst.endChildren();
    }


    /********** ********** ********** ********** **********
    * parseWhileStatement
    ***********/
    function parseWhileStatement() {

        if (!running) {
            return;
        }

        // WHILE already matched
        cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        if (match(tokens[iter], Token.Kind.BOOLVAL)) {

            // Add BoolvalExpression to astTokens
            newToken = asToken.build(asToken.Kind.BoolvalExpression, "BoolvalExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

            // call parseBoolval
            cst.addNode("Boolval", "Boolval", "branch");
            parseBoolval();
            cst.endChildren();

            // Add EndExpression to astTokens
            newToken = asToken.build(asToken.Kind.EndExpression, "EndExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

        } else {

        // call parseBooleanExpression
        cst.addNode("BooleanExpression", "BooleanExpression", "branch")

        // Add BooleanExpression to astTokens
        newToken = asToken.build(asToken.Kind.BooleanExpression, "BooleanExpression", depth, tokens[iter].line);
        astTokens.push(newToken);

        parseBooleanExpression();
        cst.endChildren();

        // Add EndBooleanExpression to astTokens
        newToken = asToken.build(asToken.Kind.EndBooleanExpression, "EndBooleanExpression", depth, tokens[iter].line);
        astTokens.push(newToken);

        }

        // call parseBlock
        cst.addNode("Block", "Block", "branch");

        // Add Block to astTokens
        newToken = asToken.build(asToken.Kind.Block, "Block", depth, tokens[iter].line);
        astTokens.push(newToken);

        depth++;

        parseBlock();
        cst.endChildren();

    }


    /********** ********** ********** ********** **********
    * parseIfStatement
    ***********/
    function parseIfStatement() {

        if (!running) {
            return;
        }

        // IF already matched
        cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        if (match(tokens[iter], Token.Kind.BOOLVAL)) {

            // Add BoolvalExpression to astTokens
            newToken = asToken.build(asToken.Kind.BoolvalExpression, "BoolvalExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

            // call parseBoolval
            cst.addNode("Boolval", "Boolval", "branch");
            parseBoolval();
            cst.endChildren();

            // Add EndExpression to astTokens
            newToken = asToken.build(asToken.Kind.EndExpression, "EndExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

        } else {

            // call parseBooleanExpression
            cst.addNode("BooleanExpression", "BooleanExpression", "branch");

            // Add BooleanExpression to astTokens
            newToken = asToken.build(asToken.Kind.BooleanExpression, "BooleanExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

            parseBooleanExpression();
            cst.endChildren();

            // Add EndBooleanExpression to astTokens
            newToken = asToken.build(asToken.Kind.EndBooleanExpression, "EndBooleanExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

        }

        // call parseBlock
        cst.addNode("Block", "Block", "branch");

        // Add Block to astTokens
        newToken = asToken.build(asToken.Kind.Block, "Block", depth, tokens[iter].line);
        astTokens.push(newToken);

        depth++;

        parseBlock();
        cst.endChildren();

    }


    /********** ********** ********** ********** **********
    * parseExpression
    ***********/
    function parseExpression() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.DIGIT)) {

            // call parseIntExpression
            cst.addNode("IntExpression", "IntExpression", "branch");

            // Add IntExpression to astTokens
            newToken = asToken.build(asToken.Kind.IntExpression, "IntExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

            parseIntExpression();
            cst.endChildren();

            // Add EndExpression to astTokens
            newToken = asToken.build(asToken.Kind.EndExpression, "EndExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

        } else if (match(tokens[iter], Token.Kind.QUOTE)) {

            // call parseStringExpression
            cst.addNode("StringExpression", "StringExpression", "branch");

            // Add StringExpression to astTokens
            newToken = asToken.build(asToken.Kind.StringExpression, "StringExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

            parseStringExpression();
            cst.endChildren();

            // Add EndExpression to astTokens
            newToken = asToken.build(asToken.Kind.EndExpression, "EndExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

        } else if (match(tokens[iter], Token.Kind.L_PAREN)) {

            // call parseBooleanExpression
            cst.addNode("BooleanExpression", "BooleanExpression", "branch");

            // Add BooleanExpression to astTokens
            newToken = asToken.build(asToken.Kind.BooleanExpression, "BooleanExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

            parseBooleanExpression();
            cst.endChildren();

            // Add EndBooleanExpression to astTokens
            newToken = asToken.build(asToken.Kind.EndBooleanExpression, "EndBooleanExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

        } else if (match(tokens[iter], Token.Kind.BOOLVAL)) {

            // Add BoolvalExpression to astTokens
            newToken = asToken.build(asToken.Kind.BoolvalExpression, "BoolvalExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

            // call parseBoolval
            cst.addNode("Boolval", "Boolval", "branch");
            parseBoolval();
            cst.endChildren();

            // Add EndExpression to astTokens
            newToken = asToken.build(asToken.Kind.EndExpression, "EndExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

        } else if (match(tokens[iter], Token.Kind.CHAR)) {

            // Add IdExpression to astTokens
            newToken = asToken.build(asToken.Kind.IdExpression, "IdExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

            // call parseId
            cst.addNode("Id", "Id", "branch");
            parseId();
            cst.endChildren();

            // Add EndExpression to astTokens
            newToken = asToken.build(asToken.Kind.EndExpression, "EndExpression", depth, tokens[iter].line);
            astTokens.push(newToken);

        } else {

            /**********
             * ERROR Expected Expression
             ***********/
            parseExpressiontError = /*"PARSER: ERROR: */"Expected Expression, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseExpressiontError;
            parseError(parseExpressiontError);

        }
    }


    /********** ********** ********** ********** **********
    * parseIntExpression
    ***********/
    function parseIntExpression() {

        if (!running) {
            return;
        }

        // call parseDigit
        cst.addNode("Digit", "Digit", "branch");
        parseDigit();
        cst.endChildren();

        if (match(tokens[iter], Token.Kind.INTOP)) {

            // call parseIntop
            cst.addNode("Intop", "Intop", "branch");
            parseIntop();
            cst.endChildren();

            // call parseExpression
            cst.addNode("Expression", "Expression", "branch");
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

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.QUOTE)) {

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

            if (match(tokens[iter], Token.Kind.CHAR) || match(tokens[iter], Token.Kind.SPACE)) {

                // call parseCharList
                cst.addNode("CharList", "Charlist", "branch");
                parseCharList();
                cst.endChildren();

            }

            if (match(tokens[iter], Token.Kind.QUOTE)) {

                cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

            } else {

                /**********
                 * ERROR Expected closing QUOTE
                 ***********/
                parseStringExpressionError = /*"PARSER: ERROR: */"Expected closing QUOTE, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
                document.getElementById("parseOutput").value += parseStringExpressionError;
                parseError(parseStringExpressionError);

            }

        } else {

            /**********
             * ERROR Expected opening QUOTE
             ***********/
            parseStringExpressionError = /*"PARSER: ERROR: */"Expected opening QUOTE, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseStringExpressionError;
            parseError(parseStringExpressionError);

        }
    }


    /********** ********** ********** ********** **********
    * parseBooleanExpression
    ***********/
    function parseBooleanExpression() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.L_PAREN)) {

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

            if (match(tokens[iter], Token.Kind.L_PAREN)) {

                /**********
                 * ERROR Nested Boolean Detected
                 ***********/
                parseBooleanExpressionError = /*"PARSER: ERROR: */"Nested boolean detected on line " + tokens[iter].line;
                document.getElementById("parseOutput").value += parseBooleanExpressionError;
                parseError(parseBooleanExpressionError);

            }

            // call parseExpression
            cst.addNode("Expression", "Expression", "branch");
            parseExpression();
            cst.endChildren();

            // call parseBoolop
            cst.addNode("Boolop", "Boolop", "branch");
            parseBoolop();
            cst.endChildren();

            if (match(tokens[iter], Token.Kind.L_PAREN)) {

                /**********
                 * ERROR Nested Boolean Detected
                 ***********/
                parseBooleanExpressionError = /*"PARSER: ERROR: */"Nested boolean detected on line " + tokens[iter].line;
                document.getElementById("parseOutput").value += parseBooleanExpressionError;
                parseError(parseBooleanExpressionError);

            }

            // call parseExpression
            cst.addNode("Expression", "Expression", "branch");
            parseExpression();
            cst.endChildren();

            if (match(tokens[iter], Token.Kind.R_PAREN)) {

                cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

            } else {

                /**********
                 * ERROR Expected R_PAREN
                 ***********/
                parseBooleanExpressionError = /*"PARSER: ERROR: */"Expected R_PAREN, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
                document.getElementById("parseOutput").value += parseBooleanExpressionError;
                parseError(parseBooleanExpressionError);

            }

        } else {

            /**********
             * ERROR Expected L_PAREN
             ***********/
            parseBooleanExpressionError = /*"PARSER: ERROR: */"Expected L_PAREN, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseBooleanExpressionError;
            parseError(parseBooleanExpressionError);

        }
    }


    /********** ********** ********** ********** **********
    * parseId
    ***********/
    function parseId() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.CHAR)) {

            // Add Id (char) to astTokens
            newToken = asToken.build(asToken.Kind.Char, tokens[iter].value, depth, tokens[iter].line);
            astTokens.push(newToken);

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected CHAR (ID)
             ***********/
            parseIdError = /*"PARSER: ERROR: */"Expected CHAR (ID), Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseIdError;
            parseError(parseIdError);

        }
    }


    /********** ********** ********** ********** **********
    * parseCharList
    ***********/
    function parseCharList() {

        if (!running) {
            return;
        }

        while (!match(tokens[iter], Token.Kind.QUOTE)) {
            if (match(tokens[iter], Token.Kind.CHAR)) {

                // call parseChar
                cst.addNode("Char", "Char", "branch");
                parseChar();
                cst.endChildren();

                if (match(tokens[iter], Token.Kind.CHAR) && !match(tokens[iter], Token.Kind.QUOTE)) {

                    // call parseCharList
                    cst.addNode("CharList", "Charlist", "branch");
                    parseCharList();
                    cst.endChildren();

                } else if (match(tokens[iter], Token.Kind.SPACE) && !match(tokens[iter], Token.Kind.QUOTE)) {

                    // call parseCharList
                    cst.addNode("CharList", "Charlist", "branch");
                    parseCharList();
                    cst.endChildren();

                } else {
                    if (match(tokens[iter], Token.Kind.QUOTE)) {

                        // String closed, do nothing

                    } else {

                        /**********
                         * ERROR Expected CHAR, SPACE, or closing QUOTE
                         ***********/
                        parseCharListError = /*"PARSER: ERROR: */"Expected CHAR, SPACE, or closing QUOTE, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
                        document.getElementById("parseOutput").value += parseCharListError;
                        parseError(parseCharListError);

                    }
                }

            } else if (match(tokens[iter], Token.Kind.SPACE)) {

                // call parseSpace
                cst.addNode("Space", "Space", "branch");
                parseSpace();
                cst.endChildren();

                if (match(tokens[iter], Token.Kind.CHAR) && !match(tokens[iter], Token.Kind.QUOTE)) {

                    // call parseCharList
                    cst.addNode("CharList", "Charlist", "branch");
                    parseCharList();
                    cst.endChildren();

                } else if (match(tokens[iter], Token.Kind.SPACE) && !match(tokens[iter], Token.Kind.QUOTE)) {

                    // call parseCharList
                    cst.addNode("CharList", "Charlist", "branch");
                    parseCharList();
                    cst.endChildren();

                } else {

                    if (match(tokens[iter], Token.Kind.QUOTE)) {

                        // String closed, do nothing

                    } else {

                        /**********
                         * ERROR Expected CHAR, SPACE, or closing QUOTE
                         ***********/
                        parseCharListError = /*"PARSER: ERROR: */"Expected CHAR, SPACE, or closing QUOTE, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
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
                    parseCharListError = /*"PARSER: ERROR: */"Expected CHAR, SPACE, or closing QUOTE, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
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

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.TYPE)) {

            // Add Type to astTokens
            newToken = asToken.build(asToken.Kind.TYPE, tokens[iter].value, depth, tokens[iter].line);
            astTokens.push(newToken);

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected TYPE
             ***********/
            parseTypeError = /*"PARSER: ERROR: */"Expected TYPE, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseTypeError;
            parseError(parseTypeError);

        }
    }


    /********** ********** ********** ********** **********
    * parseChar
    ***********/
    function parseChar() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.CHAR)) {

            // Add Char to astTokens
            newToken = asToken.build(asToken.Kind.Char, tokens[iter].value, depth, tokens[iter].line);
            astTokens.push(newToken);

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected CHAR
             ***********/
            parseCharError = /*"PARSER: ERROR: */"Expected CHAR, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseCharError;
            parseError(parseCharError);

        }
    }


    /********** ********** ********** ********** **********
    * parseSpace
    ***********/
    function parseSpace() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.SPACE)) {

            // Add Space to astTokens
            newToken = asToken.build(asToken.Kind.Space, tokens[iter].value, depth, tokens[iter].line);
            astTokens.push(newToken);

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected SPACE
             ***********/
            parseSpaceError = /*"PARSER: ERROR: */"Expected SPACE, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseSpaceError;
            parseError(parseSpaceError);

        }
    }


    /********** ********** ********** ********** **********
    * parseDigit
    ***********/
    function parseDigit() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.DIGIT)) {

            // Add Digit to astTokens
            newToken = asToken.build(asToken.Kind.Digit, tokens[iter].value, depth, tokens[iter].line);
            astTokens.push(newToken);

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected DIGIT
             ***********/
            parseDigitError = /*"PARSER: ERROR: */"Expected DIGIT, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseDigitError;
            parseError(parseDigitError);

        }
    }


    /********** ********** ********** ********** **********
    * parseBoolop
    ***********/
    function parseBoolop() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.BOOLOP)) {

            // Add Boolop to astTokens
            newToken = asToken.build(asToken.Kind.Boolop, tokens[iter].value, depth, tokens[iter].line);
            astTokens.push(newToken);

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected BOOLOP
             ***********/
            parseBoolopError = /*"PARSER: ERROR: */"Expected BOOLOP, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseBoolopError;
            parseError(parseBoolopError);

        }
    }


    /********** ********** ********** ********** **********
    * parseBoolval
    ***********/
    function parseBoolval() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.BOOLVAL)) {

            // Add Boolval to astTokens
            newToken = asToken.build(asToken.Kind.Boolval, tokens[iter].value, depth, tokens[iter].line);
            astTokens.push(newToken);

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected BOOLVAL
             ***********/
            parseBoolvalError = /*"PARSER: ERROR: */"Expected BOOLVAL, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseBoolvalError;
            parseError(parseBoolvalError);

        }
    }


    /********** ********** ********** ********** **********
    * parseIntop
    ***********/
    function parseIntop() {

        if (!running) {
            return;
        }

        if (match(tokens[iter], Token.Kind.INTOP)) {

            // Add Intop to astTokens
            newToken = asToken.build(asToken.Kind.Intop, tokens[iter].value, depth, tokens[iter].line);
            astTokens.push(newToken);

            cst.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        } else {

            /**********
             * ERROR Expected INTOP
             ***********/
            parseIntopError = /*"PARSER: ERROR: */"Expected INTOP, Found [" + tokens[iter].value + "] on line " + tokens[iter].line;
            document.getElementById("parseOutput").value += parseIntopError;
            parseError(parseIntopError);

        }
    }

}
