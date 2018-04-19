/********** ********** ********** ********** **********
 * buildAST.js
 *
 * Includes
 *  Methods for "checking" each element in the array "astTokens"
 *  The methods aid in building the AST,
 *   while also conducting scope/type checks and building the symbol table
 *
 * The symbol table is only displayed if declarations/uses
 *  pass scope and type checking
 *
 **********/

function buildAST(astTokens) {

    document.getElementById("compStatus").value += "\n";
    document.getElementById("compStatus").value += "SEMANTIC ANALYSIS \n";

    document.getElementById("saOutputTree").value += "Program " + programCount + "\n";
    document.getElementById("saOutputTree").value += "********** ********** **********\n";
    document.getElementById("saOutputTable").value += "Program " + programCount + "\n";
    document.getElementById("saOutputTable").value += "********** ********** **********\n";

    var table = document.getElementById("saOutputTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = "Program " + programCount;
    var cell1 = row.insertCell(1);
    cell1.innerHTML = "**********";
    var cell1 = row.insertCell(2);
    cell1.innerHTML = "**********";
/*    var cell1 = row.insertCell(3);
    cell1.innerHTML = "**********";*/

    // Grab token array "asTokens" from parse output
    var tokens = astTokens;

    // Keeps track of our position in "asTokens"
    var iter = 0;

    // Used to assess whether we're assessing a boolean expression
    boolCheck = false;

    // Assign -1 to level, placing the first block at 0
    var level = -1;

    // Create stack containing list of hash tables
    var stack = [];

    // Array containing list of errors
    var errors = []; var errorCount = 0;
    // Array containing list of warnings
    var warnings = []; var warningCount = 0;

/*    for (var k = 0; k < astTokens.length; k++) {
        alert(astTokens[k].value + " " + astTokens[k].depth);
    } iter = 0;*/

    // Create new instance of tree, this time an AST
    var ast = new Tree();

    // Initialize tree with root node
    // Since we passed parse, the first item will be a block
    ast.addNode("Block", "branch");

    // Set the current node to the root
    ast.cur = ast.root;

    checkBlock();

    ast.endChildren();

    // We passed through the entirety of the outermost block, return AST
    var tree = ast.toString();

    if (errorCount == 0) {

        if (warningCount == 0) {
            document.getElementById("compStatus").value += "Found 0 warning(s)" + "\n";
        } else {
            for (var k = 0; k < warnings.length; k++) {
                document.getElementById("compStatus").value += warnings[k]+ "\n";
            }
        }

        document.getElementById("compStatus").value += "Found 0 error(s)" + "\n";
        document.getElementById("saOutputTree").value += tree + "\n";

        codeGen(ast);

    } else {

        document.getElementById("saOutputTree").value += "Semantic analysis skipped" + "\n";
        document.getElementById("saOutputTree").value += "See error(s) and warning(s) above" + "\n";
        document.getElementById("saOutputTree").value += "\n";

    }



    /********** ********** ********** ********** **********
     * If we hit an error, semantic analysis process terminates and we display the error
     ***********/
    function saError(errorMsg) {

        errorCount++;

        if (warningCount == 0) {
            document.getElementById("compStatus").value += "Found 0 warning(s)" + "\n";
        } else {
            for (var k = 0; k < warnings.length; k++) {
                document.getElementById("compStatus").value += warnings[k]+ "\n";
            }
        }

        document.getElementById("compStatus").value += "ERROR \n";
        document.getElementById("compStatus").value += errorMsg + "\n";

    }



    /********** ********** ********** ********** **********
     * checkBlock()
     ***********/
    function checkBlock() {

        // Increase level (depth/scope) by 1
        level++;

        // Create new hashtable for the current block
        var hashTable = buildTable(10000);

        // Push the new hashtable onto the stack
        stack.push(hashTable);

        // Assign the current blocks level (depth/scope) to outer
        outer = tokens[iter].depth; iter++;

        if (tokens[iter] == undefined) {

        } else {

            while (tokens[iter].depth - 1 == outer) {

                if (tokens[iter].value.match(asToken.Kind.PrintStatement.pattern)) {
                    ast.addNode("PrintStatement", "branch"); iter++;
                    checkPrintStatement();
                    /*ast.endChildren();*/
                } else if (tokens[iter].value.match(asToken.Kind.AssignmentStatement.pattern)) {
                    ast.addNode("AssignmentStatement", "branch"); iter++;
                    checkAssignment();
                    /*ast.endChildren();*/
                } else if (tokens[iter].value.match(asToken.Kind.VarDecl.pattern)) {
                    ast.addNode("VarDecl", "branch"); iter++;
                    checkVarDecl();
                    ast.endChildren();
                } else if (tokens[iter].value.match(asToken.Kind.WhileStatement.pattern)) {
                    ast.addNode("WhileStatement", "branch"); iter++;
                    checkWhileStatement();
                    ast.endChildren();
                } else if (tokens[iter].value.match(asToken.Kind.IfStatement.pattern)) {
                    ast.addNode("IfStatement", "branch"); iter++;
                    checkIfStatement();
                    ast.endChildren();
                } else if (tokens[iter].value.match(asToken.Kind.Block.pattern)) {
                    ast.addNode("Block", "branch");
                    checkBlock();
                    ast.endChildren();
                    outer--;

                } else {

                    // Not sure what else could make its way through...
                    break;

                }

                if (tokens[iter + 1] == undefined) {
                    break;
                }

            }

            /********** ********** ********** ********** **********
             * Finished processing block, as hashtbale to final "list?"
             ***********/

            var temp = stack.pop();

            level--;

        }

    }



    /********** ********** ********** ********** **********
     * checkAssignment()
     ***********/
    function checkAssignment() {

        var holdType = tokens[iter + 1].value;

        if (holdType.match(asToken.Kind.IdExpression.pattern)) {
            var holdToken = tokens[iter + 2];
        }

        if (stack[stack.length-1].retrieve(tokens[iter].value) == undefined) {

            // Symbol not declared in scope

            var lvl = level; level--; found = false;

            while (level >= 0) {
                if (stack[level].retrieve(tokens[iter].value) == undefined) {
                    // continue
                } else {
                    var declaredAs = stack[level].retrieve(tokens[iter].value)[1];
                    found = true;
                }
                level--;
            }

            level = lvl;

            if (found) {

                // Move onto type checking

                if (holdType.match(asToken.Kind.IntExpression.pattern)) {
                    if (!(declaredAs == "int")) {
                        errorMsg = "Type mismatch, expecting " + declaredAs;
                        saError(errorMsg);
                    } else {
                        // Do nothing
                    }
                } else if (holdType.match(asToken.Kind.StringExpression.pattern)) {
                    if (!(declaredAs == "string")) {
                        errorMsg = "Type mismatch, expecting " + declaredAs;
                        saError(errorMsg);
                    } else {
                        // Do nothing
                    }
                } else if (holdType.match(asToken.Kind.BooleanExpression.pattern)) {
                    if (!(declaredAs == "boolean")) {
                        errorMsg = "Type mismatch, expecting " + declaredAs;
                        saError(errorMsg);
                    } else {
                        // Do nothing
                    }
                } else if (holdType.match(asToken.Kind.BoolvalExpression.pattern)) {
                    if (!(declaredAs == "boolean")) {
                        errorMsg = "Type mismatch, expecting " + declaredAs;
                        saError(errorMsg);
                    } else {
                        // Do nothing
                    }
                } else if (holdType.match(asToken.Kind.IdExpression.pattern)) {
                    if (stack[stack.length-1].retrieve(holdToken.value) == undefined) {

                        // Symbol not declared in scope

                        var lvl = level; level--; found = false;

                        while (level >= 0) {
                            if (stack[level].retrieve(tokens[iter].value) == undefined) {
                                // continue
                            } else {
                                var declaredAs = stack[level].retrieve(tokens[iter].value)[1];
                                found = true;
                            }
                            level--;
                        }

                        level = lvl;

                        if (found) {
                            // Move onto type checking

                            ast.addNode(tokens[iter].value, "leaf"); iter++;

                            checkExpression();

                        } else {
                            // Symbol not declared at all

                            errorMsg = "Symbol [" + holdToken.value + "] used before being declared";

                            saError(errorMsg);

                        }
                    } else {

                        var leftOfAssign = stack[level].retrieve(tokens[iter].value)[1];
                        var rightOfAssign = stack[level].retrieve(holdToken.value)[1];

                        if (leftOfAssign == rightOfAssign) {

                            // no issue, do nothing

                        } else {

                            errorMsg = "Type mismatch, expecting " + leftOfAssign + " found " + rightOfAssign;

                            saError(errorMsg);

                        }

                    }
                }

                ast.addNode(tokens[iter].value, "leaf"); iter++;

                checkExpression();

                if (holdType.match(asToken.Kind.BooleanExpression.pattern)) {
                    ast.endChildren();
                }

            } else {
                // Symbol not declared at all

                errorMsg = "Symbol [" + tokens[iter].value + "] used before being declared";

                saError(errorMsg);

            }

        } else {

            var declaredAs = stack[level].retrieve(tokens[iter].value)[1];

            if (holdType.match(asToken.Kind.IntExpression.pattern)) {
                if (!(declaredAs == "int")) {
                    errorMsg = "Type mismatch, expecting " + declaredAs;
                    saError(errorMsg);
                } else {
                    // Do nothing
                }
            } else if (holdType.match(asToken.Kind.StringExpression.pattern)) {
                if (!(declaredAs == "string")) {
                    errorMsg = "Type mismatch, expecting " + declaredAs;
                    saError(errorMsg);
                } else {
                    // Do nothing
                }
            } else if (holdType.match(asToken.Kind.BooleanExpression.pattern)) {
                if (!(declaredAs == "boolean")) {
                    errorMsg = "Type mismatch, expecting " + declaredAs;
                    saError(errorMsg);
                } else {
                    // Do nothing
                }
            } else if (holdType.match(asToken.Kind.BoolvalExpression.pattern)) {
                if (!(declaredAs == "boolean")) {
                    errorMsg = "Type mismatch, expecting " + declaredAs;
                    saError(errorMsg);
                } else {
                    // Do nothing
                }
            } else if (holdType.match(asToken.Kind.IdExpression.pattern)) {

                if (stack[stack.length-1].retrieve(holdToken.value) == undefined) {

                    // Symbol not declared in scope

                    var lvl = level; level--; found = false;

                    while (level >= 0) {
                        if (stack[level].retrieve(tokens[iter].value) == undefined) {
                            // continue
                        } else {
                            var declaredAs = stack[level].retrieve(tokens[iter].value)[1];
                            found = true;
                        }
                        level--;
                    }

                    level = lvl;

                    if (found) {
                        // Move onto type checking

                        ast.addNode(tokens[iter].value, "leaf"); iter++;

                        checkExpression();

                    } else {
                        // Symbol not declared at all

                        errorMsg = "Symbol [" + holdToken.value + "] used before being declared";

                        saError(errorMsg);

                    }
                } else {

                    var leftOfAssign = stack[level].retrieve(tokens[iter].value)[1];
                    var rightOfAssign = stack[level].retrieve(holdToken.value)[1];

                    if (leftOfAssign == rightOfAssign) {

                        // no issue, do nothing

                    } else {

                        errorMsg = "Type mismatch, expecting " + leftOfAssign + " found " + rightOfAssign;

                        saError(errorMsg);

                    }

                }
            }

            ast.addNode(tokens[iter].value, "leaf"); iter++;

            checkExpression();

            if (holdType.match(asToken.Kind.BooleanExpression.pattern)) {
                ast.endChildren();
            }

        }

    }



    /********** ********** ********** ********** **********
     * checkVarDecl()
     ***********/
    function checkVarDecl() {

        ast.addNode(tokens[iter].value, "leaf"); iter++;

        if (stack[stack.length-1].retrieve(tokens[iter].value) != undefined) {

            // Symbol already declared in this scope

            errorMsg = "Symbol [" + tokens[iter].value + "] already declared in this scope";

            saError(errorMsg);

        } else {

            var type = tokens[iter - 1].value;

            stack[stack.length-1].insert(tokens[iter].value, [tokens[iter].value, type, level]);

            var table = document.getElementById("saOutputTable");
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = tokens[iter].value;
            var cell1 = row.insertCell(1);
            cell1.innerHTML = type;
            var cell1 = row.insertCell(2);
            cell1.innerHTML = level;
/*            var cell1 = row.insertCell(3);
            cell1.innerHTML = scopeInstance;*/

            ast.addNode(tokens[iter].value, "leaf"); iter++;

        }

    }



    /********** ********** ********** ********** **********
     * checkWhileStatement()
     ***********/
    function checkWhileStatement() {

        checkExpression();

        ast.addNode("Block", "branch");

        checkBlock();
        ast.endChildren();
        outer--;

    }



    /********** ********** ********** ********** **********
     * checkIfStatement()
     ***********/
    function checkIfStatement() {

        checkExpression();

        ast.addNode("Block", "branch");

        checkBlock();
        ast.endChildren();
        outer--;

    }



    /********** ********** ********** ********** **********
     * checkPrintStatement()
     ***********/
    function checkPrintStatement() {

        checkExpression();

/*        ast.endChildren();*/

    }



    /********** ********** ********** ********** **********
     * checkExpression()
     ***********/
    function checkExpression() {

        if (tokens[iter].value.match(asToken.Kind.BoolvalExpression.pattern)) {

            // TODO: Scope / Type check?

            iter++;

            checkBoolvalExpression();

        } else if (tokens[iter].value.match(asToken.Kind.IntExpression.pattern)) {

            iter++;

            checkIntExpression();

        } else if (tokens[iter].value.match(asToken.Kind.StringExpression.pattern)) {

            iter++;

            checkStringExpression();

            ast.endChildren();


        } else if (tokens[iter].value.match(asToken.Kind.BooleanExpression.pattern)) {

            iter++;

            checkBooleanExpression();


        } else if (tokens[iter].value.match(asToken.Kind.IdExpression.pattern)) {

            iter++;

            checkIdExpression();

        }
    }



    /********** ********** ********** ********** **********
     * checkBoolvalStatement()
     ***********/
    function checkBoolvalExpression() {

        ast.addNode(tokens[iter].value, "leaf"); iter++;

        if (tokens[iter] == undefined) {

            /*
            * End of program??
            * Do nothing...
            * */

        } else {
            if (boolCheck) {
                while (!tokens[iter + 1].value.match(asToken.Kind.Boolop.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined) {
                        break;
                    }
                } iter++;
            } else {
                while (tokens[iter].value.match(asToken.Kind.EndExpression.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined) {
                        break;
                    }
                }
            }
        }
    }



    /********** ********** ********** ********** **********
     * checkIntExpression()
     ***********/
    function checkIntExpression() {

        if (tokens[iter + 1].value.match(asToken.Kind.Intop.pattern)) {

            if (tokens[iter + 4].value.match(asToken.Kind.EndExpression.pattern)) {

                /* We have the following...  */

                /* ... ___ ... _+_ ... INT EXPRESSION ... _END EXPRESSION_ ... */

                ast.addNode(tokens[iter + 1].value, "branch");
                ast.addNode(tokens[iter].value, "leaf"); iter++; iter++; iter++;
                ast.addNode(tokens[iter].value, "leaf"); iter++;

                if (tokens[iter] == undefined) {

                    /*
                    * End of program??
                    * Do nothing...
                    * */

                } else {
                    if (boolCheck) {
                        while (!tokens[iter + 1].value.match(asToken.Kind.Boolop.pattern)) {

                            ast.endChildren(); iter++;

                            if (tokens[iter] == undefined) {
                                break;
                            }
                        } iter++;
                    } else {
                        while (tokens[iter].value.match(asToken.Kind.EndExpression.pattern)) {

                            ast.endChildren(); iter++;

                            if (tokens[iter] == undefined) {
                                break;
                            }
                        }
                    }
                }
            } else {

                /* We have the following...  */

                /* ... ___ ... _+_ ... INT EXPRESSION ... _+_ ... */

                ast.addNode(tokens[iter + 1].value, "branch");

                ast.addNode(tokens[iter].value, "leaf"); iter++; iter++; iter++;

                checkIntExpression();

            }

        } else {

            // TODO: Scope / Type check?

            ast.addNode(tokens[iter].value, "leaf"); iter++;

            if (tokens[iter] == undefined) {

                /*
                * End of program??
                * Do nothing...
                * */

            } else {
                if (boolCheck) {
                    while (!tokens[iter + 1].value.match(asToken.Kind.Boolop.pattern)) {

                        ast.endChildren(); iter++;

                        if (tokens[iter] == undefined) {
                            break;
                        }
                    } iter++;
                } else {

                    while (tokens[iter].value.match(asToken.Kind.EndExpression.pattern)) {

                        ast.endChildren(); iter++;

                        if (tokens[iter] == undefined) {
                            break;
                        }
                    }
                }
            }
        }
    }



    /********** ********** ********** ********** **********
     * checkStringExpression()
     ***********/
    function checkStringExpression() {

        var holdIt = [];

        while (!tokens[iter].value.match(asToken.Kind.EndExpression.pattern)) {
            holdIt.push(tokens[iter].value); iter++;
        }

        ast.addNode(holdIt, "leaf"); iter++;

        if (tokens[iter] == undefined) {

            /*
            * End of program??
            * Do nothing...
            * */

        } else {
            if (boolCheck) {
                while (!tokens[iter + 1].value.match(asToken.Kind.Boolop.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined) {
                        break;
                    }
                } iter++;
            } else {
                while (tokens[iter + 1].value.match(asToken.Kind.EndExpression.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined) {
                        break;
                    }
                }
            }
        }
    }



    /********** ********** ********** ********** **********
     * checkBooleanExpression()
     ***********/
    function checkBooleanExpression() {

        var marker = iter;

        while (!tokens[iter].value.match(asToken.Kind.Boolop.pattern)) {

            iter++;

            if (tokens[iter] == undefined) {
                break;
            }

        }

        ast.addNode(tokens[iter].value, "branch");

        iter = marker;

        boolCheck = true;

        checkExpression();

        // Skip Boolop
        iter++;

        boolCheck = false;

        checkExpression();

        iter++;

    }



    /********** ********** ********** ********** **********
     * checkIdExpression()
     ***********/
    function checkIdExpression() {

        // TODO: Scope / Type check?

        ast.addNode(tokens[iter].value, "leaf"); iter++;

        if (tokens[iter] == undefined) {

            /*
            * End of program??
            * Do nothing...
            * */

        } else {
            if (boolCheck) {
                while (!tokens[iter + 1].value.match(asToken.Kind.Boolop.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined) {
                        break;
                    }
                } iter++;
            } else {
                while (tokens[iter].value.match(asToken.Kind.EndExpression.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined) {
                        break;
                    }
                }
            }
        }
    }
}