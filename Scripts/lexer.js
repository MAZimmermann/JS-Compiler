/*
 * lexer.js
 *
 * - Grabs source code from taInput
 *
 * - Checks for anything but whitespace, returns error if no input
 *
 * - Splits input by line, \n
 *
 * - Splits line by DELIMITER_PATTERN(s), see below
 *
 * - Assesses each lexeme, line[_],
 *    and produces new token for token array
 *    if the lexeme is a valid token
 *
 */

/*
 * TODO:
 *  - Continue revising error checks
 *  - Finalize comment/string handling
 */

function lex() {

    document.getElementById("taOutput").value += "Begin Lexical Analysis... \n";

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

    /* Delimiter patterns pulled from online and previous hall of fame projects
     * DELIMITER_1: leftParen, rightParen, leftBracket, rightBracket,
     * lowercase letters a-z, digits, quote, comments, boolean operators, anything but whitespace, and new lines
     */ DELIMITER_1 = /(\()|(\))|({)|(})|([a-z]+)|(\d)|(")|(\/\*[^\/\*]*\*\/)|(==)|(!=)|(\n)/g;

    /* DELIMITER_2: print, while, if, string, boolean, true, false
     */ DELIMITER_2 = /(print)|(while)|(if)|(string)|(boolean)|(true)|(false)/g;

    /* Valid lexeme "int" contained in "print"
     * DELIMITER_3: int
     */ DELIMITER_3 = /(int)/g;

    // Delimiters used to test for invalid comment break
    DELIMITER_4 = /(\/\*[^\/\*]*$)/g;
    DELIMITER_5 = /([^\/\*]*\*\/)/g;

    // Delimiter grabbing characters when quote is found
    DELIMITER_6 = /([^"])|(\n)/g;

    // Match for anything but whitespace
    if (/\S/.test(sourceCode)) {

        // Split input by line
        var lines = sourceCode.split("\n");

        // TODO: explain this
        lastLine = false;
        lastLineContent = "";

        // Analyze each line individually
        for (var i = 0; i < lines.length; i++) {
            lineNum++;
            line = lines[i];

            if (i == lines.length - 1) {
                lastLine = true;
                lastLineContent = line;
            }

            // Test for valid comments, remove any if found
            line = line.replace(/\/\*[^\/\*]*\*\//, "");

            if (DELIMITER_4.test(line)) {
                // Test for invalid comments
                document.getElementById("taOutput").value += "LEXER --> | ";
                document.getElementById("taOutput").value += "Invalid comment break starting on line ";
                document.getElementById("taOutput").value += lineNum + "\n";
                errors.push("Invalid comment break starting on line " + lineNum);
                errorCount++;
                // Test if comment was simply pushed to the next line
                if (DELIMITER_5.test(lines[i+1].trim())) {
                    document.getElementById("taOutput").value += "LEXER --> | ";
                    document.getElementById("taOutput").value += "Comment continues on line  ";
                    document.getElementById("taOutput").value += (lineNum+1) + "\n";
                    i++; lineNum++;
                }

            } else {
                // Split the current line according to DELIMITER_1
                d1Line = line.split(DELIMITER_1);
                d1Line = checkUndefined(d1Line);

                lineSplit = [];

                for (var j = 0; j < d1Line.length; j++) {
                    // Special treatment for strings
                    if (d1Line[j].match(Token.Kind.QUOTE.pattern)) {
                        breakString = false;
                        lineSplit.push(d1Line[j]); j++;
                        if (d1Line[j] == undefined) {
                            // Quote is last character on the line
                            document.getElementById("taOutput").value += "LEXER --> | ";
                            document.getElementById("taOutput").value += "Invalid string break on line ";
                            document.getElementById("taOutput").value += lineNum + "\n";
                            errors.push("Invalid string break on line " + lineNum);
                            errorCount++;
                            breakString;
                            break;
                        } else {
                            // Valid characters following quote
                            while(!d1Line[j].match(Token.Kind.QUOTE.pattern)) {
                                stringSplit = d1Line[j].split(DELIMITER_6);
                                stringSplit = checkUndefined(stringSplit);
                                // Handling comments inside of quotes
                                // TODO: ... is this necessary??
                                for (var a = 0; a < stringSplit.length; a++) {
                                    if (stringSplit[a] === "") {
                                        // Do nothing
                                    }/* else if (stringSplit[a] == "/" && stringSplit[a+1] == "*") {
                                        a = a + 2;
                                        while (stringSplit[a] != "\*" && stringSplit[a+1] != "/") {
                                            a++
                                        } a = a + 2;
                                    }*/ else {
                                        lineSplit.push(stringSplit[a]);
                                    }
                                } j++; // Test if next character is undefined (end of line)
                                if (d1Line[j] == undefined) {
                                    document.getElementById("taOutput").value += "LEXER --> | ";
                                    document.getElementById("taOutput").value += "Invalid string break starting on line ";
                                    document.getElementById("taOutput").value += lineNum + "\n";
                                    errors.push("Invalid string break starting on line " + lineNum);
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
                        // Split d1Line[j] according to DELIMITER_2
                        d2Line = d1Line[j].trim().split(DELIMITER_2);
                        d2Line = checkUndefined(d2Line);
                        for (var k = 0; k < d2Line.length; k++) {

                            if (!d2Line[k].match(/^\s$/) && d2Line[k] != "") {
                                if (!d2Line[k].match(DELIMITER_2)) {
                                    // Split d2Line[k] according to DELIMITER_3
                                    d3Line = d2Line[k].split(DELIMITER_3);
                                    d3Line = checkUndefined(d3Line);
                                    for (var l = 0; l < d3Line.length; l++) {
                                        if (d3Line[l] === "int") {
                                            lineSplit.push(d3Line[l]);
                                        } else if (d3Line[l].match(/[a-z]+/)) {
                                            splitString = d3Line[l].split("");
                                            for (var q = 0; q < splitString.length; q++) {
                                                lineSplit.push(splitString[q]);
                                            }
                                        } else {
                                            lineSplit.push(d3Line[l]);
                                        }
                                    }
                                } else {
                                    lineSplit.push(d2Line[k]);
                                }
                            }
                        }
                    }
                }

                line = lineSplit;

                for (var m = 0; m < line.length; m++) {
                    lexeme = line[m];
                    document.getElementById("lineOutput").value += lexeme + " ";
                    if (lexeme == "" || lexeme == " ") {
                        // do nothing, ignore whitespace
                    }
                    else if (isValid(lexeme)) {
                        // lexemes like abc will be seen as an identifier up until this point
                        if (getKind(lexeme) === Token.Kind.QUOTE) {
                            breakString = false;
                            newToken = Token.build(Token.Kind.QUOTE, lexeme, lineNum);
                            tokens.push(newToken);
                            /*alert("LEXER: " + newToken.kind.name);*/
                            document.getElementById("taOutput").value += "LEXER --> | " +
                                newToken.kind.name + " [ " + newToken.value + " ] " +
                                " on line " + lineNum + "..." + "\n";
                            m++;
                            lexeme = line[m];

                            while (getKind(lexeme) != Token.Kind.QUOTE) {
                                newToken = Token.build(Token.Kind.CHAR, lexeme, lineNum);
                                tokens.push(newToken);
                                /*alert("LEXER: " + newToken.kind.name);*/

                                document.getElementById("lineOutput").value += lexeme + " ";

                                document.getElementById("taOutput").value += "LEXER --> | " +
                                    newToken.kind.name + " [ " + newToken.value + " ] " +
                                    " on line " + lineNum + "..." + "\n";
                                m++;
                                lexeme = line[m];
                                if (lexeme == undefined) {
                                    breakString = true;
                                    break;
                                }
                            }
                            if (!breakString) {

                                document.getElementById("lineOutput").value += lexeme + " ";

                                newToken = Token.build(Token.Kind.QUOTE, lexeme, lineNum);
                                tokens.push(newToken);
                                /*alert("LEXER: " + newToken.kind.name);*/
                                document.getElementById("taOutput").value += "LEXER --> | " +
                                    newToken.kind.name + " [ " + newToken.value + " ] " +
                                    " on line " + lineNum + "..." + "\n";
                            }
                        } else if (getKind(lexeme) === Token.Kind.ID) {
                                newId = lexeme;
                                newToken = Token.build(Token.Kind.ID, lexeme, lineNum);
                                tokens.push(newToken);
                                /*alert("LEXER: " + newToken.kind.name);*/
                                document.getElementById("taOutput").value += "LEXER --> | " +
                                    newToken.kind.name + " [ " + newToken.value + " ] " +
                                    " on line " + lineNum + "..." + "\n";
                        } else {
                            newToken = Token.build(getKind(lexeme), lexeme, lineNum)
                            tokens.push(newToken);
                            /*alert("LEXER: " + newToken.kind.name);*/
                            document.getElementById("taOutput").value += "LEXER --> | " +
                                newToken.kind.name + " [ " + newToken.value + " ] " +
                                " on line " + lineNum + "..." + "\n";

                            if (getKind(lexeme) === Token.Kind.END_OF_FILE) {
                                document.getElementById("taOutput").value += "\n";
                            }

                        }
                    } else {
                        document.getElementById("taOutput").value += "LEXER --> | " +
                            "ERROR: Invalid lexeme found on line " + lineNum + "\n";
                        errors.push("Invalid lexeme found on line " + lineNum);
                        errorCount++;
                    }

                }

                document.getElementById("lineOutput").value += "\n";

            }

        }

        // Check for $[EOP] marker, add $[EOP] marker if not it is not found
        if (!lastLineContent.slice(-1).trim().match(/\$/)) {
            warnings.push("Missing $[EOP] marker on last line. $[EOP] marker added to last line.");
            warningCount++;
            newToken = Token.build(Token.Kind.END_OF_FILE, "$", (tokens.length - 1))
            tokens.push(newToken);
            document.getElementById("taOutput").value += "LEXER --> | " +
                "ERROR: Missing $[EOP] marker on last line\n";
            document.getElementById("taOutput").value += "LEXER --> | " +
                "$[EOP] marker added to last line\n";
            document.getElementById("taInput").value += "$\n";
        }

        // TODO: Give own Description
        // Return format inspired by previous hall of fame projects
        var lexReturns = {
            tokenArray: tokens,
            errorArray: errors,
            errorCount: errorCount,
            warningArray: warnings,
            warningCount: warningCount
        }

        return lexReturns;

    } else {

        errors.push("No source code provided");
        errorCount++;

        var lexReturns = {
            tokenArray: tokens,
            errorArray: errors,
            errorCount: errorCount,
            warningArray: warnings,
            warningCount: warningCount
        }

        // No input provided
        return lexReturns;

    }

}