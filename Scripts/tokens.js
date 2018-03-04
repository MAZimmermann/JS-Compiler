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

/**********
* Token constructor
**********/
function Token(kind, value, line) {
    this.kind = kind;
    this.value = value;
    this.line = line;
}

/**********
* Token build function
**********/
Token.build = function(kind, value, line) {
    return new Token(kind, value, line)
}

/**********
* Enumeration of token kind
* Inspired by the "Svegliator"
**********/
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
    PRINT: {
        name: "PRINT",
        pattern: /^print$/
    },
    WHILE: {
        name: "WHILE",
        pattern: /^while$/
    },
    IF: {
        name: "IF",
        pattern: /^if$/
    },
    TYPE: {
        name: "TYPE",
        pattern: /^(int|string|boolean)$/,
    },
    QUOTE: {
        name: "QUOTE",
        pattern: /^"$/
    },
    CHAR: {
        name: "CHAR",
        pattern: /^[a-z]$/
    },
    SPACE: {
        name: "SPACE",
        pattern: /^\s$/
    },
    DIGIT: {
        name: "DIGIT",
        pattern: /^\d$/
    },
    BOOLOP: {
        name: "BOOLOP",
        pattern: /^(==|!=)$/
    },
    BOOLVAL: {
        name: "BOOLVAL",
        pattern: /^(true|false)$/
    },
    INTOP: {
        name: "INTOP",
        pattern: /^\+$/
    },
    ASSIGNOP: {
        name: "ASSIGNOP",
        pattern: /^=$/
    },
    EOP: {
        name: "EOP",
        pattern: /^\$$/
    }
}
