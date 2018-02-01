/*
token.js
defines tokens
 including kind, value, and line
 */

function Token(kind, value, line) {
    this.kind = kind;
    this.value = value;
    this.line = line;
}

Token.build = function(kind, value, line) {
    return new Token(kind, value, line)
}

Token.Kind = {
    ID: {
        name: "Identifier",
        pattern: /^[a-z]$/,
    },
    L_BRACE: {
        name: "Left Brace",
        pattern: /^{$/
    },
    R_BRACE: {
        name: "Right Brace",
        pattern: /^}$/
    },
    L_PAREN: {
        name: "Left Parenthesis",
        pattern: /^\($/
    },
    R_PAREN: {
        name: "Right Parenthesis",
        pattern: /^\)$/
    },
    PRINT: {
        name: "Print",
        pattern: /^print$/
    },
    WHILE: {
        name: "While",
        pattern: /^while$/
    },
    IF: {
        name: "If",
        pattern: /^if$/
    },
    QUOTE: {
        name: "Quote",
        pattern: /^"$/
    },
    CHAR: {
        name: "Char",
        pattern: /^[a-z]$/
    },
    VAR_TYPE: {
        name: "Variable Type",
        pattern: /^(int|string|boolean)$/,
    },
    DIGIT: {
        name: "DIGIT",
        pattern: /^\d$/
    },
    STRING: {
        name: "String",
        pattern: /^"[a-z\s]*"$/
    },
    BOOLEAN: {
        name: "Boolean",
        pattern: /^(true|false)$/
    },
    EQUALITY_OP: {
        name: "Equality Operator",
        pattern: /^==$/
    },
    INEQUALITY_OP: {
        name: "Inequality Operator",
        pattern: /^!=$/
    },
    ADDITION_OP: {
        name: "Addition Operator",
        pattern: /^\+$/
    },
    ASSIGNMENT_OP: {
        name: "Assignment Operator",
        pattern: /^=$/
    }
}