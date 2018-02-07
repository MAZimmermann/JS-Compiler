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
    L_BRACE: {
        name: "L_BRACE",
        pattern: /{/
    },
    R_BRACE: {
        name: "R_BRACE",
        pattern: /}/
    },
    L_PAREN: {
        name: "L_PAREN",
        pattern: /\(/
    },
    R_PAREN: {
        name: "R_PAREN",
        pattern: /\)/
    },
    VARIABLE_TYPE: {
        name: "VARIABLE_TYPE",
        pattern: /(int|string|boolean)/,
    },
    STRING: {
        name: "STRING",
        pattern: /"[a-z\s]*"/
    },
    BOOLEAN: {
        name: "BOOLEAN",
        pattern: /(true|false)/
    },
    PRINT_STATEMENT: {
        name: "PRINT_STATEMENT",
        pattern: /print/
    },
    WHILE_STATEMENT: {
        name: "WHILE_STATEMENT",
        pattern: /while/
    },
    IF_STATEMENT: {
        name: "IF_STATEMENT",
        pattern: /if/
    },
    ID: {
        name: "ID",
        pattern: /[a-z]/,
    },
    QUOTE: {
        name: "QUOTE",
        pattern: /"/
    },
    CHAR: {
        name: "CHAR",
        pattern: /[a-z]/
    },
    DIGIT: {
        name: "DIGIT",
        pattern: /\d/
    },
    EQUALITY_OPERATOR: {
        name: "EQUALITY_OPERATOR",
        pattern: /==/
    },
    INEQUALITY_OPERATOR: {
        name: "INEQUALITY_OPERATOR",
        pattern: /!=/
    },
    ADDITION_OPERATOR: {
        name: "ADDITION_OPERATOR",
        pattern: /\+/
    },
    ASSIGNMENT_OPERATOR: {
        name: "ASSIGNMENT_OPERATOR",
        pattern: /=/
    },
    END_OF_FILE: {
        name: "END_OF_FILE",
        pattern: /\$/
    }
}

/*
 * Project Grammar Reference
 *
 * Program       ::== Block $
 * Block         ::== { StatementList }
 * StatementList ::== Statement StatementList
 * Statement     ::== PrintStatement
 *               ::== AssignmentStatement
 *               ::== VarDecl
 *               ::== WhileStatement
 *               ::== IfStatement
 *               ::== Block
 *
 * PrintStatement      ::== print( Expr )
 * AssignmentStatement ::== Id = Expr
 * VarDecl             ::== type Id
 * WhileStatement      ::== while BooleanExpr Block
 * IfStatement         ::== if BooleanExpr Block
 *
 * Expr        ::== IntExpr
 *             ::== StringExpr
 *             ::== BooleanExpr
 *             ::== Id
 * IntExp      ::== digit intop Expr
 *             ::== digit
 * StringExpr  ::== " CharList "
 * BooleanExpr ::== ( Expr boolop Expr)
 *             ::== boolval
 *             ::== char
 * Id          ::== char
 * CharList    ::== char CharList
 *             ::== space CharList
 *             ::== e
 *
 * type    ::== int | string | boolean
 * char    ::== a | b | c | ... | z
 * space   ::==  the space character
 * digit   ::==  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
 * boolop  ::==  == | !=
 * boolval ::== false | true
 * intop   ::== +
 *
 */