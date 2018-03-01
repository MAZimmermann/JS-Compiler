/**********
 * nonterminals.js
 *
 * Includes:
 *  Nonterminal class via nonterminal constructor
 *  Enumeration of nonterminals within our grammar
 *
 **********/

/**********
 * TODO: Give nonterminals value
 **********/

function Nonterminal() {
    // Define class for nonterminals
}

/*
 * Enumeration of nonterminals
 * Inspired by the "Svegliator"
 *
 */
Nonterminal.Kind = {
    PROGRAM: {
        Value: ""
    },
    BLOCK: {
        Value: ""
    },
    STATEMENT_LIST: {
        Value: ""
    },
    STATEMENT: {
        Value: ""
    },
    PRINT_STATEMENT: {
        Value: ""
    },
    ASSIGNMENT_STATEMENT: {
        Value: ""
    },
    VARIABLE_DECLARATION: {
        Value: ""
    },
    WHILE_STATEMENT: {
        Value: ""
    },
    IF_STATEMENT: {
        Value: ""
    },
    EXPRESSION: {
        Value: ""
    },
    INT_EXPRESSION: {
        Value: ""
    },
    STRING_EXPRESSION: {
        Value: ""
    },
    BOOLEAN_EXPRESSION: {
        Value: ""
    },
    ID: {
        Value: ""
    },
    CHAR_LIST: {
        Value: ""
    },
    VARIABLE_TYPE: {
        Value: ""
    },
    CHAR: {
        Value: ""
    },
    SPACE: {
        Value: ""
    },
    DIGIT: {
        Value: ""
    },
    BOOLEAN_OPERATOR: {
        Value: ""
    },
    BOOLEAN_VALUE: {
        Value: ""
    },
    INT_OPERATOR: {
        Value: ""
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