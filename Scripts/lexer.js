/*
 * lexer.js
 *
 * - Grabs source code from taInput
 *
 * - Checks for anything but whitespace, returns error if no input
 *
 * - Splits input by line, \n
 *
 * - Splits line by DELIMITER_PATTERN, see below
 *
 * - Assesses each lexeme, line[j],
 *  and produces new token for token array
 *  if the lexeme is a valid token
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

    // TODO: Give credit for this
    DELIMITER_PATTERN = /([a-z]+)|(\d+)|("[^"]*")|(\/\*[^\/\*]*\*\/)|(==)|(!=)|(\S)|(\n)/g;

    // TODO: Determine/write other portions ^delimiter pattern^ for clarification
    var _numberPattern = /\d+/;
    var _charPattern = /[a-z]/;
    var _stringPattern = /"[^"]*"/;
    var _idPattern = /[a-z]+/;

    // Match for anything but whitespace
    if (/\S/.test(sourceCode)) {

        // Split input by line
        var lines = sourceCode.trim().split("\n");

        // analyze each line individually
        for (var i = 0; i < lines.length; i++) {
            lineNum++;
            line = lines[i].trim();
            line = line.split(DELIMITER_PATTERN);
            line = line.filter(checkUndefined);
            for (var j = 0; j < line.length; j++) {
                lexeme = line[j];

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
                    /*alert("LEXER: " + newToken.kind.name);*/
                    document.getElementById("taOutput").value += "LEXER --> | " +
                        newToken.kind.name + " [ " + newToken.value + " ] " +
                        " on line " + lineNum + "..." + "\n";
                } else {

                    // TODO: set up error cases

                }

            }

        }

        if (tokens[tokens.length - 1].kind != Token.Kind.END_OF_FILE) {
            // TODO: set up error cases
            alert("test");
        }

        return tokens;

    } else {

        // TODO: set up error cases
        return tokens;

    }

}