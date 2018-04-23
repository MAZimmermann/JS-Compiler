/********** ********** ********** ********** **********
 * astoken.js
 *
 * This file helps to build an array of AST tokens,
 *  as well as build the AST itself
 *
 * Includes:
 *  asToken class via asToken constructor
 *  asToken "build" function
 *  Enumeration of acceptable asToken kinds
 *
 **********/

/********** ********** ********** ********** **********
 * asToken constructor
 **********/
function asToken(kind, value, depth) {
    this.kind = kind;
    this.value = value;
    this.depth = depth;
}

/********** ********** ********** ********** **********
 * asToken build function
 **********/
asToken.build = function(kind, value, depth) {
    return new asToken(kind, value, depth);
}

/********** ********** ********** ********** **********
 * Enumeration of asToken kind
 * Inspired by the "Svegliator"
 **********/
asToken.Kind = {
    Block: {
        name: "Block",
        pattern: /^Block$/
    },
    PrintStatement: {
        name: "PrintStatement",
        pattern: /^PrintStatement$/
    },
    AssignmentStatement: {
        name: "AssignmentStatement",
        pattern: /^AssignmentStatement$/
    },
    VarDecl: {
        name: "VarDecl",
        pattern: /^VarDecl$/
    },
    WhileStatement: {
        name: "WhileStatement",
        pattern: /^WhileStatement$/
    },
    IfStatement: {
        name: "IfStatement",
        pattern: /^IfStatement$/
    },
    IntExpression: {
        name: "IntExpression",
        pattern: /^IntExpression$/
    },
    StringExpression: {
        name: "StringExpression",
        pattern: /^StringExpression/
    },
    BooleanExpression: {
        name: "BooleanExpression",
        pattern: /^BooleanExpression/
    },
    BoolvalExpression: {
        name: "BoolvalExpression",
        pattern: /^BoolvalExpression/
    },
    IdExpression: {
        name: "IdExpression",
        pattern: /^IdExpression/
    },
    EndExpression: {
        name: "EndExpression",
        pattern: /^EndExpression/
    },
    EndBooleanExpression: {
        name: "EndBooleanExpression",
        pattern: /^EndBooleanExpression/
    },
    Type: {
        name: "Type",
        pattern: /^Type$/
    },
    Quote: {
        name: "Quote",
        pattern: /^Quote$/
    },
    Char: {
        name: "Char",
        pattern: /^Char$/
    },
    Space: {
        name: "Space",
        pattern: /^Space$/
    },
    Id: {
        name: "Id",
        pattern: /^[a-z]$/
    },
    Digit: {
        name: "Digit",
        pattern: /^[0-9]$/
    },
    Boolop: {
        name: "Boolop",
        pattern: /^(==|!=)$/
    },
    Boolval: {
        name: "Boolval",
        pattern: /^(true|false)$/
    },
    Intop: {
        name: "Intop",
        pattern: /^\+$/
    },
    Assignop: {
        name: "Assignop",
        pattern: /^=$/
    }
}