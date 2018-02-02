/*
 * token.js
 *
 * Includes:
 *  Token class via token constructor
 *  Token build function
 *  Enumeration of acceptable token kinds
 *
 */

// Token constructor
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
 * Inspiration for this portion of the lexer
 *  - Justin Svegliato's "Svegliator"
 *
 */
Token.Kind = {
    ID: {
        name: "ID",
        pattern: /^[a-z]$/,
    },
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
    QUOTE: {
        name: "QUOTE",
        pattern: /^"$/
    },
    CHAR: {
        name: "CHAR",
        pattern: /^[a-z]$/
    },
    VARIABLE_TYPE: {
        name: "VARIABLE_TYPE",
        pattern: /^(int|string|boolean)$/,
    },
    DIGIT: {
        name: "DIGIT",
        pattern: /^\d$/
    },
    STRING: {
        name: "STRING",
        pattern: /^"[a-z\s]*"$/
    },
    BOOLEAN: {
        name: "BOOLEAN",
        pattern: /^(true|false)$/
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