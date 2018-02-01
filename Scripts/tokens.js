/*
token.js
defines tokens
 including kind, value, line, and precedence
 */

function Token(kind, value, line, precedence) {
    this.kind = kind;
    this.value = value;
    this.precedence = precedence;
    this.line = line;
}

Token.build = function(kind, value, line) {
    return new Token(kind, value, line)
}

Token = {
    L_BRACE: {
        pattern: /^{$/
    },
    R_BRACE: {
        pattern: /^}$/
    },
    L_PAREN: {
        pattern: /^\($/
    },
    R_PAREN: {
        pattern: /^\)$/
    },
    PRINT: {
        pattern: /^print$/
    },
    WHILE: {
        pattern: /^while$/
    },
    IF: {
        pattern: /^if$/
    },
    QUOTE: {
        pattern: /^"$/
    },
    CHAR: {
        pattern: /^[a-z]$/
    },
    SPACE: {

    },
    VAR_TYPE: {

    },
    INT: {

    },
    STRING: {

    },
    BOOLEAN: {

    },
    EQUIVALITY_OP: {

    },
    INEQUIVALITY_OP: {

    },
    ADDITION_OP: {

    },
    ASSIGNMENT_OP: {

    }
}