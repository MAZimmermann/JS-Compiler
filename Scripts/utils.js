/*
 * util.js
 *
 * Utility functions
 *
 * Includes:
 *  checkUndefined
 *  isValid
 *  getKind
 *
 */

// Used to remove undefined elements from array
function checkUndefined(element) {
    return element !== undefined;
}

// Used to iterate over acceptable token kinds
// Returns true for valid lexem, false otherwise
function isValid(lexeme) {
    for (var key in Token.Kind) {
        var kind = Token.Kind[key];
        if (lexeme.match(kind.pattern)) {
            return true;
        }
    }
    return false;
}

// Used to iterate over acceptable token kinds
// Returns lexeme kind
function getKind(lexeme) {
    for (var key in Token.Kind) {
        var kind = Token.Kind[key];
        if (lexeme.match(kind.pattern)) {
            return kind;
        }
    }
}