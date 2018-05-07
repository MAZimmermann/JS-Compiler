/********** ********** ********** ********** **********
* lexer.js
 *
 * Breaks up input by line and assess each line
 *
 * When an EOP marker is hit, we pass the tokens to the parser
 *
 * TODO: Clean this up / revise summary
 *
**********/

function lex() {

    /********** ********** ********** ********** **********
     * Assume we're starting with program 1
     * Increment every time we hit a EOP marker
     ***********/
    programCount = 1;



    // Grab source code from taInput
    var sourceCode = document.getElementById("taInput").value;

    // Define/declare array of tokens to be returned
    var tokens = [];

    // Declare/define line number
    var lineNum = 0;

    // Array containing list of errors
    var errors = []; var errorCount = 0;
    // Array containing list of warnings
    var warnings = []; var warningCount = 0;



    // DELIMITER_1: leftParen, rightParen, leftBracket, rightBracket,
    // lowercase letters a-z, digits, quote, comments, boolean operators, anything but whitespace, and new lines
    DELIMITER_1 = /(\()|(\))|({)|(})|([a-z]+)|(\d)|(")|(\/\*[^\/\*]*\*\/)|(==)|(!=)|(\n)/g;

    // DELIMITER_2: print, while, if, string, boolean, true, false
    DELIMITER_2 = /(print)|(while)|(if)|(string)|(boolean)|(true)|(false)/g;

    // DELIMITER_3: int
     DELIMITER_3 = /(int)/g;

    // DELIMITER_4 and DELIMITER_5, used to test for invalid comment break
    DELIMITER_4 = /(\/\*[^\*\/]*$)/g;
    DELIMITER_5 = /([^\/\*]*\*\/)/g;

    // DELIMITER_6, used for grabbing characters when quote is found
    DELIMITER_6 = /([^"])|(\n)/g;



    // Match for anything but whitespace
    if (/\S/.test(sourceCode)) {

        /********** ********** ********** ********** **********
         * Start with program 1
         ***********/
        document.getElementById("lexOutput").value += "Program " + programCount + "\n";
        document.getElementById("lexOutput").value += "********** ********** **********\n" ;
        document.getElementById("compStatus").value += "Program " + programCount + "\n";
        document.getElementById("compStatus").value += "********** ********** **********\n" ;
        document.getElementById("compStatus").value += "LEX \n";

        // Split input by line
        var lines = sourceCode.split("\n");

        // Use this to assess whether we are on the last line of the source program
        lastLine = false;
        lastLineContent = "";

        // Analyze each line individually
        for (var i = 0; i < lines.length; i++) {

            lineNum++;
            line = lines[i].trim();

            if (i == lines.length - 1) {
                lastLine = true;
                lastLineContent = line;
            }

            /********** ********** ********** ********** **********
             * Test for for valid comments, remove any if found
             ***********/
            line = line.replace(/\/\*[^\*]*\*\//, "");

            /********** ********** ********** ********** **********
             * Test for invalid comments
             ***********/
            if (DELIMITER_4.test(line)) {

                document.getElementById("lexOutput").value += "LEXER --> | ";
                document.getElementById("lexOutput").value += "Invalid comment break starting on line ";
                document.getElementById("lexOutput").value += lineNum + "\n";
                line = line.replace(/\/\*[^\*\/]*$/, "");

                if (DELIMITER_5.test(lines[i+1])) {

                    /********** ********** ********** ********** **********
                     * Test if comment was simply pushed to the next line
                     ***********/

                    document.getElementById("lexOutput").value += "LEXER --> | ";
                    document.getElementById("lexOutput").value += "Comment continues on line  ";
                    document.getElementById("lexOutput").value += (lineNum+1) + "\n";
                    lines[i + 1] = lines[i + 1].replace(/([^\/\*]*\*\/)/, "");


                    warnings.push("Invalid comment break starting on line " + lineNum + ", ends on line " + (lineNum + 1));
                    warningCount++;

                } else {

                    /********** ********** ********** ********** **********
                     * It wasn't...
                     ***********/

                    errors.push("Invalid comment break starting on line " + lineNum);
                    errorCount++;

                }
            }



            /********** ********** ********** ********** **********
             * Split the current line according to DELIMITER_1
             ***********/
            d1Line = line.split(DELIMITER_1);
            d1Line = checkUndefined(d1Line);

            lineSplit = [];

            for (var j = 0; j < d1Line.length; j++) {

                /********** ********** ********** ********** **********
                 * Special treatment for strings
                 ***********/
                if (d1Line[j].match(Token.Kind.QUOTE.pattern)) {

                    breakString = false;
                    lineSplit.push(d1Line[j]); j++;

                    if (d1Line[j] == undefined) {

                        /********** ********** ********** ********** **********
                         * Quote is last character on the line
                         ***********/
                        document.getElementById("lexOutput").value += "LEXER --> | ";
                        document.getElementById("lexOutput").value += "Invalid string break on line ";
                        document.getElementById("lexOutput").value += lineNum + "\n";

                        errors.push("Invalid string break on line " + lineNum); errorCount++;
                        breakString; break;

                    } else {

                        /********** ********** ********** ********** **********
                         * Valid characters following quote (numbers and other invalids caught later)
                         ***********/
                        while(!d1Line[j].match(Token.Kind.QUOTE.pattern)) {
                            stringSplit = d1Line[j].split(DELIMITER_6);
                            stringSplit = checkUndefined(stringSplit);
                            for (var k = 0; k < stringSplit.length; k++) {
                                if (stringSplit[k] == "") {
                                    // Do nothing
                                } else {
                                    lineSplit.push(stringSplit[k]);
                                }
                            } j++;

                            /********** ********** ********** ********** **********
                             * Test if next character is undefined (end of line)
                             ***********/
                            if (d1Line[j] == undefined) {
                                document.getElementById("lexOutput").value += "LEXER --> | ";
                                document.getElementById("lexOutput").value += "Invalid string break on line ";
                                document.getElementById("lexOutput").value += lineNum + "\n";
                                errors.push("Invalid string break on line " + lineNum);
                                errorCount++;
                                breakString = true;
                                break;
                            }
                        }

                    }

                    if (!breakString) {
                        lineSplit.push(d1Line[j]);
                    }

                } else {

                    /********** ********** ********** ********** **********
                     * Split d1Line[j] according to DELIMITER_2
                     ***********/
                    d2Line = d1Line[j].split(DELIMITER_2);
                    d2Line = checkUndefined(d2Line);

                    for (var l = 0; l < d2Line.length; l++) {
                        if (!d2Line[l].match(/^\s$/) && d2Line[l] != "") {

                            if (!d2Line[l].match(DELIMITER_2)) {

                                /********** ********** ********** ********** **********
                                 * Split d2Line[k] according to DELIMITER_3
                                 ***********/
                                d3Line = d2Line[l].split(DELIMITER_3);
                                d3Line = checkUndefined(d3Line);

                                for (var m = 0; m < d3Line.length; m++) {

                                    if (d3Line[m] == "int") {

                                        lineSplit.push(d3Line[m]);

                                    } else if (d3Line[m].match(/[a-z]+/)) {

                                        splitString = d3Line[m].split("");

                                        for (var n = 0; n < splitString.length; n++) {

                                            lineSplit.push(splitString[n]);

                                        }

                                    } else {

                                        lineSplit.push(d3Line[m]);

                                    }
                                }
                            } else {

                                lineSplit.push(d2Line[l]);

                            }
                        }
                    }
                }
            }



            /********** ********** ********** ********** **********
             * Reassign line to properly-split, lexeme array
             ***********/
            line = lineSplit;

            /********** ********** ********** ********** **********
             * Iterate through new array and start building tokens
             ***********/
            for (var m = 0; m < line.length; m++) {
                lexeme = line[m].trim();

                if (lexeme == "") {

                    // Ignore

                } else {

                    if (isValid(lexeme)) {

                        /********** ********** ********** ********** **********
                         * Special treatment for strings
                         ***********/
                        if (getKind(lexeme) == Token.Kind.QUOTE) {

                            breakString = false;

                            /********** ********** ********** ********** **********
                             * First lexeme found is quote
                             ***********/
                            newToken = Token.build(Token.Kind.QUOTE, lexeme, lineNum);
                            tokens.push(newToken);
                            document.getElementById("lexOutput").value += "LEXER --> | " +
                                newToken.kind.name + " [ " + newToken.value + " ] " +
                                " on line " + lineNum + "..." + "\n";

                            m++; lexeme = line[m];

                            /********** ********** ********** ********** **********
                             * We hit a new line marker, not a QUOTE
                             ***********/
                            if (lexeme == undefined) {
                                breakString = true;
                                break;
                            }

                            while(getKind(lexeme) != Token.Kind.QUOTE) {

                                /********** ********** ********** ********** **********
                                 * Check if the following lexemes are SPACE, CHAR, or neither
                                 ***********/
                                if (getKind(lexeme) == Token.Kind.SPACE) {
                                    newToken = Token.build(Token.Kind.SPACE, lexeme, lineNum);
                                    tokens.push(newToken);
                                    document.getElementById("lexOutput").value += "LEXER --> | " +
                                        newToken.kind.name + " [ " + newToken.value + " ] " +
                                        " on line " + lineNum + "..." + "\n";

                                } else if (getKind(lexeme) == Token.Kind.CHAR) {
                                    newToken = Token.build(Token.Kind.CHAR, lexeme, lineNum);
                                    tokens.push(newToken);
                                    document.getElementById("lexOutput").value += "LEXER --> | " +
                                        newToken.kind.name + " [ " + newToken.value + " ] " +
                                        " on line " + lineNum + "..." + "\n";

                                } else {
                                    document.getElementById("lexOutput").value += "LEXER --> | " +
                                        "ERROR: Invalid lexeme [" + lexeme + "] found on line " + lineNum + "\n";
                                    errors.push("Invalid lexeme [" + lexeme + "] found on line " + lineNum);
                                    errorCount++;

                                }

                                m++; lexeme = line[m];

                                /********** ********** ********** ********** **********
                                 * We hit a new line marker, not a QUOTE
                                 ***********/
                                if (lexeme == undefined) {
                                    breakString = true;
                                    break;
                                }

                            }

                            if (!breakString) {

                                /********** ********** ********** ********** **********
                                 * While loop ended without break string being triggered
                                 * We've hit a closing quote
                                 ***********/

                                newToken = Token.build(Token.Kind.QUOTE, lexeme, lineNum);
                                tokens.push(newToken);
                                document.getElementById("lexOutput").value += "LEXER --> | " +
                                    newToken.kind.name + " [ " + newToken.value + " ] " +
                                    " on line " + lineNum + "..." + "\n";

                            }

                        } else if (getKind(lexeme) == Token.Kind.CHAR) {

                            /********** ********** ********** ********** **********
                             * In this case, we know Char is meant to be an ID
                             ***********/

                            newId = lexeme;
                            newToken = Token.build(Token.Kind.ID, lexeme, lineNum);
                            tokens.push(newToken);
                            document.getElementById("lexOutput").value += "LEXER --> | " +
                                newToken.kind.name + " [ " + newToken.value + " ] " +
                                " on line " + lineNum + "..." + "\n";

                        } else {

                            /********** ********** ********** ********** **********
                             * We've hit some other valid lexeme
                             ***********/

                            newToken = Token.build(getKind(lexeme), lexeme, lineNum)
                            tokens.push(newToken);
                            document.getElementById("lexOutput").value += "LEXER --> | " +
                                newToken.kind.name + " [ " + newToken.value + " ] " +
                                " on line " + lineNum + "..." + "\n";

                            if (getKind(lexeme) == Token.Kind.EOP) {

                                /********** ********** ********** ********** **********
                                 * We've hit an EOP marker
                                 ***********/

                                document.getElementById("lexOutput").value += "\n";

                                if (errorCount == 0) {

                                    /********** ********** ********** ********** **********
                                     * No errors, report any warnings and move onto parse
                                     ***********/

                                    document.getElementById("compStatus").value += "Found " + warningCount + " warning(s)" + "\n";
                                    if (warningCount == 0) {
                                        document.getElementById("compStatus").value += "\n";
                                    } else {
                                        for (var a = 0; a < warningCount; a++) {
                                            document.getElementById("compStatus").value += warnings[a] + "\n";
                                        }

                                        document.getElementById("compStatus").value += "\n";

                                    }

                                    document.getElementById("compStatus").value += "Found 0 error(s)" + "\n";

                                    var parseReturns = parse(tokens, programCount);
                                    var tree = parseReturns.tree.toString();

                                    document.getElementById("parseOutput").value += tree;
                                    document.getElementById("parseOutput").value += "\n";

                                    /********** ********** ********** ********** **********
                                     * Assuming parse has passed, build AST
                                     ***********/
                                    buildAST(parseReturns.tokens);

                                    /********** ********** ********** ********** **********
                                     * Reset all arrays / counts for lexing the next program
                                     ***********/
                                    tokens = []; errors = []; errorCount = 0; warnings = []; warningCount = 0; lineNum = 0;

                                    if (!lastLine) {

                                        programCount++;

                                        /********** ********** ********** ********** **********
                                         * Continue to next program
                                         ***********/
                                        document.getElementById("lexOutput").value += "Program " + programCount + "\n";
                                        document.getElementById("lexOutput").value += "********** ********** **********\n";

                                        document.getElementById("compStatus").value += "\n";

                                        document.getElementById("compStatus").value += "Program " + programCount + "\n";
                                        document.getElementById("compStatus").value += "********** ********** **********\n";
                                        document.getElementById("compStatus").value += "LEX \n";

                                    }

                                } else {

                                    /********** ********** ********** ********** **********
                                     * Lex errors detected, move to next program
                                     ***********/

                                    document.getElementById("compStatus").value += "Found " + warningCount + " warning(s)" + "\n";
                                    if (warningCount == 0) {
                                        document.getElementById("compStatus").value += "\n";
                                    } else {
                                        for (var a = 0; a < warningCount; a++) {
                                            document.getElementById("compStatus").value += warnings[a] + "\n";
                                        }

                                        document.getElementById("compStatus").value += "\n";

                                    }

                                    document.getElementById("compStatus").value += "Found " + errorCount + " error(s)" + "\n";
                                    for (var a = 0; a < errorCount; a++) {
                                        document.getElementById("compStatus").value += errors[a] + "\n";
                                    }

                                    /********** ********** ********** ********** **********
                                     * Reset all arrays / counts for lexing the next program
                                     ***********/
                                    tokens = []; errors = []; errorCount = 0; warnings = []; warningCount = 0; lineNum = 0;

                                    if (!lastLine) {

                                        programCount++;

                                        /********** ********** ********** ********** **********
                                         * Continue to next program
                                         ***********/
                                        document.getElementById("lexOutput").value += "Program " + programCount + "\n";
                                        document.getElementById("lexOutput").value += "********** ********** **********\n" ;

                                        document.getElementById("compStatus").value += "\n";

                                        document.getElementById("compStatus").value += "Program " + programCount + "\n";
                                        document.getElementById("compStatus").value += "********** ********** **********\n" ;
                                        document.getElementById("compStatus").value += "LEX \n";

                                    }

                                }
                            }
                        }
                    } else {

                        /********** ********** ********** ********** **********
                         * Invalid lexeme found
                         ***********/

                        document.getElementById("lexOutput").value += "LEXER --> | " +
                            "ERROR: Invalid lexeme [" + lexeme + "] found on line " + lineNum + "\n";
                        errors.push("Invalid lexeme [" + lexeme + "] found on line " + lineNum);
                        errorCount++;

                    }
                }
            }
        }

        /********** ********** ********** ********** **********
         * Missing EOP marker on last line means the token array isn't empty
         ***********/
        if (tokens.length != 0) {
            len = tokens.length;

            /********** ********** ********** ********** **********
             * Add EOP marker on last line and attempt parse
             ***********/

            if (tokens[len - 1].kind != Token.Kind.EOP) {

                warnings.push("Missing $[EOP] marker on last line. $[EOP] marker added to last line.");
                warningCount++;

                newToken = Token.build(Token.Kind.EOP, "$", (tokens.length - 1))
                tokens.push(newToken);

                document.getElementById("lexOutput").value += "LEXER --> | " +
                    "WARNING: Missing $[EOP] marker on last line\n";

                document.getElementById("lexOutput").value += "LEXER --> | " +
                    "$[EOP] marker added to last line\n";

                document.getElementById("taInput").value += "$\n";

            }

            if (errorCount == 0) {

                /********** ********** ********** ********** **********
                 * No errors, report any warnings and move onto parse
                 ***********/

                /*document.getElementById("compStatus").value += "\n";*/
                document.getElementById("compStatus").value += "Found " + warningCount + " warning(s)" + "\n";
                if (warningCount == 0) {
                    document.getElementById("compStatus").value += "\n";
                } else {
                    for (var a = 0; a < warningCount; a++) {
                        document.getElementById("compStatus").value += warnings[a] + "\n";
                    }

                    document.getElementById("compStatus").value += "\n";

                }

                document.getElementById("compStatus").value += "Found 0 error(s)" + "\n" /*+ "\n"*/;

                var parseReturns = parse(tokens, programCount);
                var tree = parseReturns.tree.toString();

                document.getElementById("parseOutput").value += tree;
                document.getElementById("parseOutput").value += "\n";

                /********** ********** ********** ********** **********
                 * Assuming parse has passed, build AST
                 ***********/
                buildAST(parseReturns.tokens);

            } else {

                /********** ********** ********** ********** **********
                 * Lex errors detected, move to next program
                 ***********/

                /*document.getElementById("compStatus").value += "\n";*/
                document.getElementById("compStatus").value += "Found " + warningCount + " warning(s)" + "\n";
                if (warningCount == 0) {
                    document.getElementById("compStatus").value += "\n";
                } else {
                    for (var a = 0; a < warningCount; a++) {
                        document.getElementById("compStatus").value += warnings[a] + "\n";
                    }

                    document.getElementById("compStatus").value += "\n";

                }

                document.getElementById("compStatus").value += "\n";
                document.getElementById("compStatus").value += "Found " + errorCount + " error(s)" + "\n";

                for (var a = 0; a < errorCount; a++) {
                    document.getElementById("compStatus").value += errors[a] + "\n";
                }

            }
        }
    } else {

        document.getElementById("compStatus").value += "Found " + 1 + " error(s)" + "\n";
        document.getElementById("compStatus").value += "No source code provided.";

    }
}