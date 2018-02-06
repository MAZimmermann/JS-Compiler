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

    // errors
    var errors = [];
    // warnings
    var warnings = [];
    // If an invalid lexeme is found,
    //  we quit the lexer and return the location of the invalid lexeme
    var invalidLexeme = false;

    // TODO: Give credit for this;
    // TODO: Determine/write other portions ^delimiter pattern^ for clarification
    DELIMITER_1 = /([a-z]+)|(\d+)|("[^"]*")|(\/\*[^\/\*]*\*\/)|(==)|(!=)|(\S)|(\n)/g;
    DELIMITER_2 = /(print)|(while)|(if)/g;
    DELIMITER_3 = /(int)/g;

    // Match for anything but whitespace
    if (/\S/.test(sourceCode)) {

        // Split input by line
        var lines = sourceCode.trim().split("\n");

        // analyze each line individually
        for (var i = 0; i < lines.length; i++) {
            lineNum++;
            line = lines[i].trim();

            // TODO: definitely come up with a better naming scheme here...
            line = line.split(DELIMITER_1);
            line = line.filter(checkUndefined);

            line2 = [];

            for (var j = 0; j < line.length; j++) {
                newLine = line[j].split(DELIMITER_2);
                newLine = newLine.filter(checkUndefined);
                for (var k = 0; k < newLine.length; k++) {
                    if (!newLine[k].match(/^\s$/) && newLine[k] != "") {
                            if (!newLine[k].match(/^print$/) && !newLine[k].match(/^(\/\*[^\/\*]*\*\/)$/)) {
                                newerLine = newLine[k].split(DELIMITER_3);
                                for (var l = 0; l < newerLine.length; l++) {
                                    line2.push(newerLine[l]);
                                }
                            } else {
                                line2.push(newLine[k]);
                            }
                    }
                }
            }

            for (var l = 0; l < line2.length; l++) {
                document.getElementById("lineOutput").value += "[" + line2[l] + "] ";
            }

            document.getElementById("lineOutput").value += "\n";

            line = line2;

            for (var l = 0; l < line.length; l++) {
                lexeme = line[l];
                // TODO: assess whitespace, comments, and invalid lexemes
                if (lexeme === "") {
                    // do nothing, ignore whitespace
                } else if (lexeme.match(/^(\/\*[^\/\*]*\*\/)$/)) {
                    // Ignore multi-line comments, increase lineNum for each \n encountered
                    lineNum = lineNum + lexeme.replace(/[^\n]/g, "").length;
                }
                else if (isValid(lexeme)) {
                    newToken = Token.build(getKind(lexeme), lexeme, lineNum)
                    tokens.push(newToken);
                    /!*alert("LEXER: " + newToken.kind.name);*!/
                    document.getElementById("taOutput").value += "LEXER --> | " +
                        newToken.kind.name + " [ " + newToken.value + " ] " +
                        " on line " + lineNum + "..." + "\n";
                } else {
                    document.getElementById("taOutput").value += "LEXER --> | " +
                        "ERROR: Invalid lexeme found on line " + lineNum + "\n";
                    // TODO:
                }

            }

        }

        // Check for $[EOP] marker, add $[EOP] marker if not it is not found
        if (tokens[tokens.length - 1].kind != Token.Kind.END_OF_FILE) {
            warnings.push("LEXER --> | ERROR: Missing $[EOP] marker on last line\n" +
                "$[EOP] marker added to last line\n");
            newToken = Token.build(Token.Kind.END_OF_FILE, "$", (tokens.length - 1))
            tokens.push(newToken);
            document.getElementById("taOutput").value += "LEXER --> | " +
                "ERROR: Missing $[EOP] marker on last line\n";
            document.getElementById("taOutput").value += "LEXER --> | " +
                "$[EOP] marker added to last line\n";
            document.getElementById("taInput").value += "$\n";
            return tokens;
        }

        // TODO: Give own Description
        // Return format inspired by previous hall of fame projects
        var lexReturns = {
            tokenArray: tokens,
            astLexemes: codeFrag,
            warningCount: lexWarningCount,
            errorCount: lexErrorCount
        }

        return tokens;

    } else {
        // No input provided
        // TODO: set up error cases
        return tokens;

    }

}