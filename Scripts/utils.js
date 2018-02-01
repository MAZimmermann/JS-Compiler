/*
util.js
utility functions
 */

// remove undefined elements from array
function checkUndefined(element) {
    return element !== undefined;
}

function isValid(lexeme) {
    for (var key in Token.Kind) {
        var kind = Token.Kind[key];
        if (lexeme.match(kind.pattern)) {
            return true;
        }
    }
    return false;
}

function getKind(lexeme) {
    for (var key in Token.Kind) {
        var kind = Token.Kind[key];
        if (lexeme.match(kind.pattern)) {
            return kind;
        }
    }
}