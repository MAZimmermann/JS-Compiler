/********** ********** ********** ********** **********
* token.js
*
* Includes:
*  Token class via token constructor
*  Token build function
*  Enumeration of acceptable token kinds
*
**********/

/********** ********** ********** ********** **********
* Token constructor
**********/
function Token(kind, value, line) {
    this.kind = kind;
    this.value = value;
    this.line = line;
}

/********** ********** ********** ********** **********
* Token build function
**********/
Token.build = function(kind, value, line) {
    return new Token(kind, value, line)
}

/********** ********** ********** ********** **********
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
    ID: {
        name: "ID",
        pattern: /^[a-z]$/
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
