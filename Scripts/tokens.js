/**********
 * token.js
 *
 * Includes:
 *  Token class via token constructor
 *  Token build function
 *  Enumeration of acceptable token kinds
 *
 **********/

/**********
 * TODO:
 **********/

// Token constructor
// includes kind, values, and line
function Token(kind, value, line) {
    this.kind = kind;
    this.value = value;
    this.line = line;
}

// Token build function
Token.build = function(kind, value, line) {
    return new Token(kind, value, line)
}

/*
 * Enumeration of token kind
 * Inspired by the "Svegliator"
 *
 */
Token.Kind = {

    L_BRACE: {
        name: "L_BRACE",
        pattern: /^{$/
    },
    R_BRACE: {
        name: "R_BRACE",
        pattern: /^}$/
    },
    L_PAREN: {
        name: "L_PAREN",
        pattern: /^\($/
    },
    R_PAREN: {
        name: "R_PAREN",
        pattern: /^\)$/
    },
    PRINT_STATEMENT: {
        name: "PRINT_STATEMENT",
        pattern: /^print$/
    },
    WHILE_STATEMENT: {
        name: "WHILE_STATEMENT",
        pattern: /^while$/
    },
    IF_STATEMENT: {
        name: "IF_STATEMENT",
        pattern: /^if$/
    },
    VARIABLE_TYPE: {
        name: "VARIABLE_TYPE",
        pattern: /^(int|string|boolean)$/,
    },
    STRING: {
        name: "STRING",
        pattern: /^"[a-z\s]*"$/
    },
    BOOLEAN: {
        name: "BOOLEAN",
        pattern: /^(true|false)$/
    },
    ID: {
        name: "ID",
        pattern: /^[a-z]$/,
    },
    QUOTE: {
        name: "QUOTE",
        pattern: /^"$/
    },
    CHAR: {
        name: "CHAR",
        pattern: /^[a-z]$/
    },
    WHITESPACE: {
        name: "WHITESPACE",
        pattern: /^\s$/
    },
    DIGIT: {
        name: "DIGIT",
        pattern: /^\d$/
    },
    EQUALITY_OPERATOR: {
        name: "EQUALITY_OPERATOR",
        pattern: /^==$/
    },
    INEQUALITY_OPERATOR: {
        name: "INEQUALITY_OPERATOR",
        pattern: /^!=$/
    },
    ADDITION_OPERATOR: {
        name: "ADDITION_OPERATOR",
        pattern: /^\+$/
    },
    ASSIGNMENT_OPERATOR: {
        name: "ASSIGNMENT_OPERATOR",
        pattern: /^=$/
    },
    END_OF_FILE: {
        name: "END_OF_FILE",
        pattern: /^\$$/
    }
}
