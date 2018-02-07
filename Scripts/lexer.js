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

    // Delimiter patterns pulled from online and previous hall of fame projects
    DELIMITER_1 = /([a-z]+)|(\d+)|("[^"]*")|(\/\*[^\/\*]*\*\/)|(==)|(!=)|(\S)|(\n)/g;
    DELIMITER_2 = /(print)|(while)|(if)/g;
    DELIMITER_3 = /(int)/g;

    // Delimiters used to test for invalid comment break
    DELIMITER_4 = /(\/\*[^\/\*]*$)/g;
    DELIMITER_5 = /([^\/\*]*\*\/)/g;

    // Delimiters used to test for invalid string break
    DELIMITER_6 = /("[a-z\s]*$)/g;
    DELIMITER_7 = /([a-z\s]*")/g;

    // tbd...
    DELIMITER_8 = /([a-z])/g;

    // Match for anything but whitespace
    if (/\S/.test(sourceCode)) {

        // Split input by line
        var lines = sourceCode.trim().split("\n");

        // analyze each line individually
        for (var i = 0; i < lines.length; i++) {
            lineNum++;
            line = lines[i].trim();

            if (DELIMITER_4.test(line)) {
                errors.push("Improper comment starting on line " + lineNum);
                errorCount++;
                while (!DELIMITER_5.test(line)) {
                    lineNum++; i++;
                    line = lines[i].trim();
                }
            } else if (DELIMITER_6.test(line)) {
                errors.push("Improper string starting on line " + lineNum);
                errorCount++;
                while (!DELIMITER_7.test(line)) {
                    lineNum++; i++;
                    line = lines[i].trim();
                }
            } else {
                // TODO: definitely come up with a better naming scheme here...
                line = line.split(DELIMITER_1);
                line = line.filter(checkUndefined);

                lineSplit = [];

                for (var j = 0; j < line.length; j++) {
                    newLine = line[j].split(DELIMITER_2);
                    newLine = newLine.filter(checkUndefined);

                    for (var k = 0; k < newLine.length; k++) {
                        if (!newLine[k].match(/^\s$/) && newLine[k] != "") {
                            if (!newLine[k].match(/^print$/) && !newLine[k].match(/^(\/\*[^\/\*]*\*\/)$/)) {
                                newerLine = newLine[k].split(DELIMITER_3);
                                for (var l = 0; l < newerLine.length; l++) {
                                    lineSplit.push(newerLine[l]);
                                }
                            } else {
                                lineSplit.push(newLine[k]);
                            }
                        }
                    }
                }

/*                for (var l = 0; l < lineSplit.length; l++) {
                    document.getElementById("lineOutput").value += "[" + lineSplit[l] + "] ";
                } document.getElementById("lineOutput").value += "\n";*/

                line = lineSplit;

                for (var m = 0; m < line.length; m++) {
                    lexeme = line[m];
                    if (lexeme === "") {
                        // do nothing, ignore whitespace
                    } else if (lexeme.match(/^(\/\*[^\/\*]*\*\/)$/)) {
                        // Ignore multi-line comments, increase lineNum for each \n encountered
                        lineNum = lineNum + lexeme.replace(/[^\n]/g, "").length;
                    }
                    else if (isValid(lexeme)) {
                        if (getKind(lexeme) === Token.Kind.ID) {
                            lexemeSplit = lexeme.split("");
                            lexemeSplit = lexemeSplit.filter(checkUndefined);
                            for (var n = 0; n < lexemeSplit.length; n++) {
                                newId = lexemeSplit[n];
                                newToken = Token.build(Token.Kind.ID, newId, lineNum);
                                tokens.push(newToken);
                                /*alert("LEXER: " + newToken.kind.name);*/
                                document.getElementById("taOutput").value += "LEXER --> | " +
                                    newToken.kind.name + " [ " + newToken.value + " ] " +
                                    " on line " + lineNum + "..." + "\n";
                            }
                        } else {
                            newToken = Token.build(getKind(lexeme), lexeme, lineNum)
                            tokens.push(newToken);
                            /*alert("LEXER: " + newToken.kind.name);*/
                            document.getElementById("taOutput").value += "LEXER --> | " +
                                newToken.kind.name + " [ " + newToken.value + " ] " +
                                " on line " + lineNum + "..." + "\n";
                        }
                    } else {
                        document.getElementById("taOutput").value += "LEXER --> | " +
                            "ERROR: Invalid lexeme found on line " + lineNum + "\n";
                        // TODO:
                    }

                }

            }

        }

        // Check for $[EOP] marker, add $[EOP] marker if not it is not found
        if (tokens[tokens.length - 1].kind != Token.Kind.END_OF_FILE) {
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
        // TODO: set up error cases
        return lexReturns;

    }

}