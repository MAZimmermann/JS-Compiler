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
 *  - Explain Delimiters
 *  - Fix Invalid String Check
 *  - Explain LastLine Check
 *  - Change naming scheme
 *  - Revise error cases
 */

/*
TODO: FINISH COMMENT/STRING HANDLING
 */

function lex() {

    document.getElementById("taOutput").value += "Begin Lexical Analysis... \n";

    // Grab source code from taInput
    var sourceCode = document.getElementById("taInput").value;

    // Define/declare array of tokens to be returned
    var tokens = [];

    // Declare/define line number
    var lineNum = 0;

    // array containing list of errors
    var errors = []; var errorCount = 0;
    // array containing list of warnings
    var warnings = []; var warningCount = 0;

    /* Delimiter patterns pulled from online and previous hall of fame projects
     * DELIMITER_1: lowercase letters a-z, digits, quote, comments, boolops, anything but whitespace, and new lines
     */ DELIMITER_1 = /([a-z]+)|(\d)|(")|(\/\*[^\/\*]*\*\/)|(==)|(!=)|(\S)|(\n)/g;

    /* TODO: Explanation
     */ DELIMITER_2 = /(print)|(while)|(if)|(string)|(boolean)|(true)|(false)/g;

    /* TODO: Explanation
     */ DELIMITER_3 = /(int)/g;

    // Delimiters used to test for invalid comment break
    DELIMITER_4 = /(\/\*[^\/\*]*$)/g;
    DELIMITER_5 = /([^\/\*]*\*\/)/g;

    // Delimiter used for splitting string in char array
    DELIMITER_6 = /([^"])|(\n)/g;

    DELIMITER_7 = /(^[^"]*")("[^"]")+/g;

    // Match for anything but whitespace
    if (/\S/.test(sourceCode)) {

        // Split input by line
        var lines = sourceCode.trim().split("\n");

        // TODO: explain this
        lastLine = false;
        lastLineContent = "";

        // analyze each line individually
        for (var i = 0; i < lines.length; i++) {
            lineNum++;
            line = lines[i].trim();

            if (i == lines.length - 1) {
                lastLine = true;
                lastLineContent = line;
            }

            // Test for valid comments, remove any if found
            line = line.replace(/\/\*[^\/\*]*\*\//, "");

            if (DELIMITER_4.test(line)) {
                // Test for invlaid comments
                document.getElementById("taOutput").value += "LEXER --> | ";
                document.getElementById("taOutput").value += "Invalid comment break starting on line ";
                document.getElementById("taOutput").value += lineNum + "\n";
                errors.push("Invalid comment break starting on line " + lineNum);
                errorCount++;

                // TODO: test for end of comment on next line
                // otherwise, just continue with the next line
                /*if (lastLine) {
                    break
                }*/

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
                            alert("test")
                            document.getElementById("taOutput").value += "LEXER --> | ";
                            document.getElementById("taOutput").value += "Invalid string break starting on line ";
                            document.getElementById("taOutput").value += lineNum + "\n";
                            errors.push("Invalid string break starting on line " + lineNum);
                            errorCount++;
                            breakString;
                            break;
                        } else {
                            while(!d1Line[j].match(Token.Kind.QUOTE.pattern)) {
                                stringSplit = d1Line[j].split(DELIMITER_6);
                                stringSplit = checkUndefined(stringSplit);
                                for (var a = 0; a < stringSplit.length; a++) {
                                    if (stringSplit[a] === "") {
                                        // Do nothing
                                    } else if (stringSplit[a] == "/" && stringSplit[a+1] == "*") {
                                        a = a + 2;
                                        while (stringSplit[a] != "\*" && stringSplit[a+1] != "/") {
                                            a++
                                        } a = a + 2;
                                    } else if (stringSplit[a] == undefined) {
                                        // Do nothing
                                    } else {
                                        lineSplit.push(stringSplit[a]);
                                    }
                                }
                                j++;
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
                        // Split the current line according to DELIMITER_2
                        d2Line = d1Line[j].split(DELIMITER_2);
                        d2Line = checkUndefined(d2Line);
                        for (var k = 0; k < d2Line.length; k++) {

                            if (!d2Line[k].match(/^\s$/) && d2Line[k] != "") {
                                if (!d2Line[k].match(DELIMITER_2)) {
                                    // Split the current line according to DELIMITER_3
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
                                newToken = Token.build(Token.Kind.QUOTE, lexeme, lineNum);
                                tokens.push(newToken);
                                /*alert("LEXER: " + newToken.kind.name);*/
                                document.getElementById("taOutput").value += "LEXER --> | " +
                                    newToken.kind.name + " [ " + newToken.value + " ] " +
                                    " on line " + lineNum + "..." + "\n";
                            }
                        } else if (getKind(lexeme) === Token.Kind.ID) {
                            // split lexeme into char array, create token id for each char
                            /*lexemeSplit = lexeme.split("");
                            lexemeSplit = checkUndefined(lexemeSplit);*/
/*                            for (var n = 0; n < lexemeSplit.length; n++) {*/
                                newId = lexeme // lexemeSplit[n];
                                newToken = Token.build(Token.Kind.ID, lexeme, lineNum);
                                tokens.push(newToken);
                                /*alert("LEXER: " + newToken.kind.name);*/
                                document.getElementById("taOutput").value += "LEXER --> | " +
                                    newToken.kind.name + " [ " + newToken.value + " ] " +
                                    " on line " + lineNum + "..." + "\n";
                            // }
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
                        // TODO:
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