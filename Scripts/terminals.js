/**********
 * terminals.js
 *
 * Includes:
 *  Terminal class via Terminal constructor
 *  Enumeration of Terminals within our grammar
 *
 **********/

/**********
 * TODO: Give terminals value
 **********/

function Terminal() {
    // Define class for Terminals
}

/*
 * Enumeration of Terminals
 * Inspired by the "Svegliator"
 *
 */
Terminal.Kind = {

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