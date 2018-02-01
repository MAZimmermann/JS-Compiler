/*
lexer.js
performs lexical analysis
 */

function lex() {

    // Grab source code from taInput
    var sourceCode = document.getElementById("taInput").value;

    var tokens = [];
    var lineNum = 0;

    // TODO: Give credit for this
    DELIMITER_PATTERN = /([a-z]+)|(\d+)|("[^"]*")|(\/\*[^\/\*]*\*\/)|(==)|(!=)|(\S)|(\n)/g;

    // TODO: Determine/write other portions ^delimiter pattern^ for clarification
    var _numberPattern = /\d+/;
    var _charPattern = /[a-z]/;
    var _stringPattern = /"[^"]*"/;
    var _idPattern = /[a-z]+/;

    // match for anything but whitespace
    if (/\S/.test(sourceCode)) {

        // split input by line
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
                    alert("LEXER: " + newToken.kind.name);
                    document.getElementById("taOutput").value += "LEXER: " + lexeme;
                } else {
                    // return error cause the input text area was empty
                }

            }

        }

        return tokens;

    } else {
        return tokens
    }

}