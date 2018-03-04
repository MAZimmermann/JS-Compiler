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
        name: "WHITESPACE",
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