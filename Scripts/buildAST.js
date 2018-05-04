/********** ********** ********** ********** **********
 * buildAST.js
 *
 * Includes
 *  Methods for "checking" each element in the array "astTokens"
 *  The methods aid in building the AST,
 *   while also conducting scope/type checks and building the symbol table
 *
 * The symbol table is only displayed if declarations/usage
 *  pass scope and type checking
 *
 * TODO: Add warnings to this phase of the compiler
 *  ex: "Declared but never used"
 *  ex: "Declared and used but not initialized"
 *
 * TODO: Add more details to errors
 *  ex: "Type Mismatch: Expected __, Found __"
 *
 **********/

function buildAST(astTokens) {

    // Display SEMANTIC ANALYSIS
    document.getElementById("compStatus").value += "\n";
    document.getElementById("compStatus").value += "SEMANTIC ANALYSIS \n";

    // Display Program __Program__Count__
    document.getElementById("saOutputTree").value += "Program " + programCount + "\n";
    document.getElementById("saOutputTree").value += "********** ********** **********\n";
    document.getElementById("saOutputTable").value += "Program " + programCount + "\n";
    document.getElementById("saOutputTable").value += "********** ********** **********\n";

    // Initialize table with header rows
    var table = document.getElementById("saOutputTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = "Program " + programCount;
    var cell1 = row.insertCell(1);
    cell1.innerHTML = "**********";
    var cell1 = row.insertCell(2);
    cell1.innerHTML = "**********";
    var cell1 = row.insertCell(3);
    cell1.innerHTML = "**********";

    // Grab token array "asTokens" from parse output
    var tokens = astTokens;

/*   for (var k = 0; k < astTokens.length; k++) {
        alert(astTokens[k].value + " " + astTokens[k].depth);
    } iter = 0;*/

    // Keeps track of our position in "tokens"
    var iter = 0;

    // Used to assess whether we're assessing a boolean expression
    boolCheck = false;

    // Assign -1 to level, placing the first block at 0
    var level = -1;

    // Assign 'A' for the first level instance (ex "0A", "1A", "2A")
    var levelInstance = 'A';

    // Create stack containing list of hash tables
    var stack = [];

    // Keep track of scope instances
    var scopeCodes = [];

    // Array containing list of errors
    var errors = []; var errorCount = 0;
    // Array containing list of warnings
    var warnings = []; var warningCount = 0;

    // Create final symbol table to pass along to Code Generation
    var symbolTable = [];

    // Create new instance of tree, this time an AST
    var ast = new Tree();

    // Initialize tree with root node
    // Since we passed parse, the first item will be a block
    ast.addNode("Block", "Block", "branch");

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

        // pass the ast and symbol table along to code gen
        codeGen(ast, symbolTable);

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
     * nextChar()
     ***********/
    function nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }



    /********** ********** ********** ********** **********
     * checkBlock()
     ***********/
    function checkBlock() {

        // Increase level (depth/scope) by 1
        level++;

        if (scopeCodes[level] == null) {
            scopeCodes[level] = [];
            scopeCodes[level].push('A');
            levelInstance = 'A';
        } else {
            var curLeng = scopeCodes[level].length;
            var last = scopeCodes[level][curLeng - 1];
            var newInstance = nextChar(last);
            scopeCodes[level].push(newInstance);
            levelInstance = newInstance;
        }

        // Create new hashtable for the current block
        var hashTable = buildTable(10000);

        // Push the new hashtable onto the stack
        stack.push(hashTable);

        // Assign the current block's level (depth/scope) to outer
        outer = tokens[iter].depth; iter++;

        if (tokens[iter] == undefined) {

        } else {

            while (tokens[iter].depth - 1 == outer) {

                if (tokens[iter].value.match(asToken.Kind.PrintStatement.pattern)) {
                    ast.addNode("PrintStatement", "PrintStatement", "branch"); iter++;
                    checkPrintStatement();
                    ast.endChildren();

                } else if (tokens[iter].value.match(asToken.Kind.AssignmentStatement.pattern)) {
                    ast.addNode("AssignmentStatement", "AssignmentStatement", "branch"); iter++;
                    checkAssignment();
                    ast.endChildren();

                } else if (tokens[iter].value.match(asToken.Kind.VarDecl.pattern)) {
                    ast.addNode("VarDecl", "VarDecl", "branch"); iter++;
                    checkVarDecl();
                    ast.endChildren();

                } else if (tokens[iter].value.match(asToken.Kind.WhileStatement.pattern)) {
                    ast.addNode("WhileStatement", "WhileStatement", "branch"); iter++;
                    checkWhileStatement();
                    ast.endChildren();

                } else if (tokens[iter].value.match(asToken.Kind.IfStatement.pattern)) {
                    ast.addNode("IfStatement", "IfStatement", "branch"); iter++;
                    checkIfStatement();
                    ast.endChildren();

                } else if (tokens[iter].value.match(asToken.Kind.Block.pattern)) {
                    ast.addNode("Block", "Block", "branch");
                    checkBlock();
                    ast.endChildren();
                    outer--;

                } else {

                    // Not sure what else could make its way through...
                    break;

                }

                if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {
                    break;
                }

            }

            var temp = stack.pop();

            level--;

        }

    }



    /********** ********** ********** ********** **********
     * checkAssignment()
     ***********/
    function checkAssignment() {

        var added = false;

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
                    level--;
                } else {
                    var declaredAs = stack[level].retrieve(tokens[iter].value)[1];
                    var declaredAt = level;
                    found = true;
                    break;
                }
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
                            if (stack[level].retrieve(holdToken.value) == undefined) {
                                // continue
                                level--;
                            } else {
                                var declaredAs = stack[level].retrieve(holdToken.value)[1];
                                var declaredAt = level;
                                found = true;
                                break;
                            }
                        }

                        if (found) {

                            // Move onto type checking

                            /*****
                            * HERE MARCUS
                            * *****/

                            var data = holdToken.value.concat(declaredAt, levelInstance);

                            ast.addNode(tokens[iter].value, data, "leaf"); iter++;

                            checkExpression();

                            added = true;

                        } else {

                            // Symbol not declared at all

                            errorMsg = "Symbol [" + holdToken.value + "] used before being declared";

                            saError(errorMsg);

                        }

                        level = lvl;

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

                /*****
                 * HERE MARCUS
                 * *****/

                if (!added) {

                    var data = tokens[iter].value.concat(declaredAt, levelInstance);

                    ast.addNode(tokens[iter].value, data, "leaf"); iter++;

                    checkExpression();

                }

            } else {

                // Symbol not declared at all

                errorMsg = "Symbol [" + tokens[iter].value + "] used before being declared";

                saError(errorMsg);

            }

        } else {

            var declaredAs = stack[level].retrieve(tokens[iter].value)[1];
            var declaredAt = level;

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
                        if (stack[level].retrieve(holdToken.value) == undefined) {
                            // continue
                            level--;
                        } else {
                            var declaredAs = stack[level].retrieve(holdToken.value)[1];
                            var declaredAt = level;
                            found = true;
                            break;
                        }
                    }

                    if (found) {
                        // Move onto type checking

                        /*****
                         * HERE MARCUS
                         * *****/

                        var data = holdToken.value.concat(declaredAt, levelInstance);

                        ast.addNode(tokens[iter].value, data, "leaf"); iter++;

                        checkExpression();

                        added = true;

                    } else {
                        // Symbol not declared at all

                        errorMsg = "Symbol [" + holdToken.value + "] used before being declared";

                        saError(errorMsg);

                    }

                    level = lvl;

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

            /*****
             * HERE MARCUS
             * *****/

            if (!added) {

                var data = tokens[iter].value.concat(declaredAt, levelInstance);

                ast.addNode(tokens[iter].value, data, "leaf"); iter++;

                checkExpression();

            }

        }

    }



    /********** ********** ********** ********** **********
     * checkVarDecl()
     ***********/
    function checkVarDecl() {

        var type = tokens[iter].value;

        ast.addNode(type, tokens[iter].value, "leaf"); iter++;

        if (stack[stack.length-1].retrieve(tokens[iter].value) != undefined) {

            // Symbol already declared in this scope

            errorMsg = "Symbol [" + tokens[iter].value + "] already declared in this scope";

            saError(errorMsg);

        } else {

            stack[stack.length-1].insert(tokens[iter].value, [tokens[iter].value, type, level, levelInstance]);

            var table = document.getElementById("saOutputTable");
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = tokens[iter].value;
            var cell1 = row.insertCell(1);
            cell1.innerHTML = type;
            var cell1 = row.insertCell(2);
            cell1.innerHTML = level;
            var cell1 = row.insertCell(3);
            cell1.innerHTML = levelInstance;

            // Add new variable to the symbol table
            var key = tokens[iter].value.concat("@", level, levelInstance);
            symbolTable[key] = [type, tokens[iter].value, level, levelInstance, 0];

            ast.addNode(tokens[iter].value, tokens[iter].value + level + levelInstance, "leaf"); iter++;

        }

    }



    /********** ********** ********** ********** **********
     * checkWhileStatement()
     ***********/
    function checkWhileStatement() {

        checkExpression();

        ast.addNode("Block", "Block", "branch");

        checkBlock();
        ast.endChildren();
        outer--;

    }



    /********** ********** ********** ********** **********
     * checkIfStatement()
     ***********/
    function checkIfStatement() {

        checkExpression();

        ast.addNode("Block", "Block","branch");

        checkBlock();
        ast.endChildren();
        outer--;

    }



    /********** ********** ********** ********** **********
     * checkPrintStatement()
     ***********/
    function checkPrintStatement() {

        checkExpression();

    }



    /********** ********** ********** ********** **********
     * checkExpression()
     ***********/
    function checkExpression() {

        if (tokens[iter].value.match(asToken.Kind.BoolvalExpression.pattern)) {

            iter++;

            checkBoolvalExpression();

        } else if (tokens[iter].value.match(asToken.Kind.IntExpression.pattern)) {

            iter++;

            checkIntExpression();

        } else if (tokens[iter].value.match(asToken.Kind.StringExpression.pattern)) {

            iter++;

            checkStringExpression();


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

        ast.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

        if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {

            /*
            * End of program??
            * Do nothing...
            * */

        } else {
            if (boolCheck) {
                while (!tokens[iter + 1].value.match(asToken.Kind.Boolop.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {
                        break;
                    }
                } iter++;
            } else {
                while (tokens[iter + 1].value.match(asToken.Kind.EndExpression.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {
                        break;
                    }
                } iter++;
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

                if (tokens[iter + 3].value.match(asToken.Kind.Id.pattern)) {

                    var intExprId = tokens[iter + 3];

                    if (stack[stack.length-1].retrieve(intExprId.value) == undefined) {

                        // Symbol not declared in scope

                        var lvl = level; level--; found = false;

                        while (level >= 0) {
                            if (stack[level].retrieve(intExprId.value) == undefined) {
                                // continue
                                level--;
                            } else {
                                var declaredAs = stack[level].retrieve(intExprId.value)[1];
                                var declaredAt = level;
                                found = true;
                                break;
                            }
                        }

                        level = lvl;

                        if (found) {

                            // Move onto type checking

                            if (declaredAs == "int") {

                                /* TODO: Warning could be issued here... */

                                ast.addNode(tokens[iter + 1].value, tokens[iter + 1].value, "branch");
                                ast.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++; iter++; iter++;
                                ast.addNode(tokens[iter].value, tokens[iter].value + level + levelInstance, "leaf"); iter++;

                            } else {

                                errorMsg = "Type mismatch, expecting int";
                                saError(errorMsg);

                            }

                        } else {

                            // Symbol not declared at all

                            errorMsg = "Symbol [" + intExprId.value + "] used before being declared";

                            saError(errorMsg);

                        }

                    } else {

                        var declaredAs = stack[level].retrieve(intExprId.value)[1];
                        var declaredAt = level;

                        if (declaredAs == "int") {

                            /* TODO: Warning could be issued here... */

                            ast.addNode(tokens[iter + 1].value, tokens[iter + 1].value, "branch");
                            ast.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++; iter++; iter++;
                            ast.addNode(tokens[iter].value, tokens[iter].value + level + levelInstance, "leaf"); iter++;

                        } else {

                            errorMsg = "Type mismatch, expecting int";
                            saError(errorMsg);

                        }

                    }

                } else {

                    if (tokens[iter+3].value.match(asToken.Kind.Digit.pattern)) {

                        ast.addNode(tokens[iter + 1].value, tokens[iter + 1].value, "branch");
                        ast.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++; iter++; iter++;
                        ast.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

                    } else {

                        errorMsg = "Type mismatch, expecting int";
                        saError(errorMsg);

                    }

                }

                if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {

                    /*
                    * End of program??
                    * Do nothing...
                    * */

                } else {
                    if (boolCheck) {
                        while (!tokens[iter + 1].value.match(asToken.Kind.Boolop.pattern)) {

                            ast.endChildren(); iter++;

                            if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {
                                break;
                            }
                        } /*iter++;*/
                    } else {
                        while (tokens[iter + 1].value.match(asToken.Kind.EndExpression.pattern)) {

                            ast.endChildren(); iter++;

                            if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {
                                break;
                            }
                        }
                    } iter++;
                }
            } else {

                /* We have the following...  */

                /* ... ___ ... _+_ ... INT EXPRESSION ... _+_ ... */

                if (tokens[iter + 3].value.match(asToken.Kind.Digit.pattern)) {

                    ast.addNode(tokens[iter + 1].value, tokens[iter + 1].value, "branch");

                    ast.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++; iter++; iter++;

                    checkIntExpression();

                } else {

                    errorMsg = "Type mismatch, expecting int";
                    saError(errorMsg);

                }

            }

        } else {

            ast.addNode(tokens[iter].value, tokens[iter].value, "leaf"); iter++;

            if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {

                /*
                * End of program??
                * Do nothing...
                * */

            } else {
                if (boolCheck) {
                    while (!tokens[iter + 1].value.match(asToken.Kind.Boolop.pattern)) {

                        ast.endChildren(); iter++;

                        if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {
                            break;
                        }
                    } iter++;
                } else {
                    while (tokens[iter + 1].value.match(asToken.Kind.EndExpression.pattern)) {

                        ast.endChildren(); iter++;

                        if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {
                            break;
                        }
                    } iter++;
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

        ast.addNode("string", holdIt, "leaf"); iter++;

        if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {

            /*
            * End of program??
            * Do nothing...
            * */

        } else {
            if (boolCheck) {
                while (!tokens[iter].value.match(asToken.Kind.Boolop.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined) {
                        break;
                    }
                }
            } else {
                while (tokens[iter + 1].value.match(asToken.Kind.EndExpression.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {
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

        ast.addNode(tokens[iter].value, tokens[iter].value, "branch");

        iter = marker;

        boolCheck = true;

        var holdExpressionStart = iter;

        checkExpression();

        // Skip Boolop
        iter++;

        boolCheck = false;

        if (errorCount>0) {

            // Halt SA

        } else {

            if (tokens[holdExpressionStart].value.match(asToken.Kind.IdExpression.pattern)) {

                if (stack[stack.length - 1].retrieve(tokens[holdExpressionStart + 1].value) == undefined) {

                    // Symbol not declared in scope

                    var lvl = level;
                    level--;
                    found = false;

                    while (level >= 0) {
                        if (stack[level].retrieve(tokens[holdExpressionStart + 1].value) == undefined) {
                            // continue
                            level--;
                        } else {
                            var declaredAs = stack[level].retrieve(tokens[holdExpressionStart + 1].value)[1];
                            var declaredAt = level;
                            found = true;
                            break;
                        }
                    }

                    level = lvl;

                    if (found) {

                        // Move onto type checking

                        if (tokens[iter].value.match(asToken.Kind.IntExpression.pattern)) {
                            if (!(declaredAs == "int")) {

                                errorMsg = "Type mismatch, expecting " + declaredAs;
                                saError(errorMsg);

                            } else {

                                checkExpression();

                                ast.endChildren();

                                iter++;

                            }
                        } else if (tokens[iter].value.match(asToken.Kind.StringExpression.pattern)) {
                            if (!(declaredAs == "string")) {

                                errorMsg = "Type mismatch, expecting " + declaredAs;
                                saError(errorMsg);

                            } else {

                                checkExpression();

                                ast.endChildren();

                                iter++;

                            }
                        } else if (tokens[iter].value.match(asToken.Kind.BooleanExpression.pattern)) {
                            if (!(declaredAs == "boolean")) {

                                errorMsg = "Type mismatch, expecting " + declaredAs;
                                saError(errorMsg);

                            } else {

                                checkExpression();

                                ast.endChildren();

                                iter++;

                            }
                        } else if (tokens[iter].value.match(asToken.Kind.BoolvalExpression.pattern)) {
                            if (!(declaredAs == "boolean")) {

                                errorMsg = "Type mismatch, expecting " + declaredAs;
                                saError(errorMsg);

                            } else {

                                checkExpression();

                                ast.endChildren();

                                iter++;

                            }
                        } else if (tokens[iter].value.match(asToken.Kind.IdExpression.pattern)) {

                            if (stack[stack.length - 1].retrieve(tokens[iter + 1].value) == undefined) {

                                // Symbol not declared in scope

                                var lvl = level;
                                level--;
                                found = false;

                                while (level >= 0) {
                                    if (stack[level].retrieve(tokens[iter + 1].value) == undefined) {
                                        // continue
                                        level--;
                                    } else {
                                        found = true;
                                        break;
                                    }
                                }

                                if (found) {

                                    // Move onto type checking

                                    var leftOfComp = stack[declaredAt].retrieve(tokens[holdExpressionStart + 1].value)[1];
                                    var rightOfComp = stack[level].retrieve(tokens[iter + 1].value)[1];

                                    if (leftOfComp == rightOfComp) {

                                        level = lvl;

                                        checkExpression();

                                        ast.endChildren();

                                        iter++;

                                    } else {

                                        level = lvl;

                                        errorMsg = "Type mismatch, expecting " + leftOfComp + " found " + rightOfComp;

                                        saError(errorMsg);

                                    }

                                } else {

                                    level = lvl;

                                    // Symbol not declared at all

                                    errorMsg = "Symbol [" + tokens[iter + 1].value + "] used before being declared";

                                    saError(errorMsg);

                                }

                            } else {

                                var leftOfComp = stack[declaredAt].retrieve(tokens[holdExpressionStart + 1].value)[1];
                                var rightOfComp = stack[level].retrieve(tokens[iter + 1].value)[1];

                                if (leftOfComp == rightOfComp) {

                                    checkExpression();

                                    ast.endChildren();

                                    iter++;

                                } else {

                                    errorMsg = "Type mismatch, expecting " + leftOfComp + " found " + rightOfComp;

                                    saError(errorMsg);

                                }

                            }
                        }

                    } else {

                        // Symbol not declared at all

                        errorMsg = "Symbol [" + tokens[iter + 1].value + "] used before being declared";

                        saError(errorMsg);

                    }

                } else {

                    var declaredAs = stack[level].retrieve(tokens[holdExpressionStart + 1].value)[1];
                    var declaredAt = level;

                    if (tokens[iter].value.match(asToken.Kind.IntExpression.pattern)) {
                        if (!(declaredAs == "int")) {

                            errorMsg = "Type mismatch, expecting " + declaredAs;
                            saError(errorMsg);

                        } else {

                            checkExpression();

                            ast.endChildren();

                            iter++;

                        }
                    } else if (tokens[iter].value.match(asToken.Kind.StringExpression.pattern)) {
                        if (!(declaredAs == "string")) {

                            errorMsg = "Type mismatch, expecting " + declaredAs;
                            saError(errorMsg);

                        } else {

                            checkExpression();

                            ast.endChildren();

                            iter++;

                        }
                    } else if (tokens[iter].value.match(asToken.Kind.BooleanExpression.pattern)) {
                        if (!(declaredAs == "boolean")) {

                            errorMsg = "Type mismatch, expecting " + declaredAs;
                            saError(errorMsg);

                        } else {

                            checkExpression();

                            ast.endChildren();

                            iter++;

                        }
                    } else if (tokens[iter].value.match(asToken.Kind.BoolvalExpression.pattern)) {
                        if (!(declaredAs == "boolean")) {

                            errorMsg = "Type mismatch, expecting " + declaredAs;
                            saError(errorMsg);

                        } else {

                            checkExpression();

                            ast.endChildren();

                            iter++;

                        }
                    } else if (tokens[iter].value.match(asToken.Kind.IdExpression.pattern)) {

                        if (stack[stack.length - 1].retrieve(tokens[iter + 1].value) == undefined) {

                            // Symbol not declared in scope

                            var lvl = level;
                            level--;
                            found = false;

                            while (level >= 0) {
                                if (stack[level].retrieve(tokens[iter + 1].value) == undefined) {
                                    // continue
                                    level--;
                                } else {
                                    found = true;
                                    break;
                                }
                            }

                            if (found) {

                                // Move onto type checking

                                var leftOfComp = stack[declaredAt].retrieve(tokens[holdExpressionStart + 1].value)[1];
                                var rightOfComp = stack[level].retrieve(tokens[iter + 1].value)[1];

                                if (leftOfComp == rightOfComp) {

                                    level = lvl;

                                    checkExpression();

                                    ast.endChildren();

                                    iter++;

                                } else {

                                    level = lvl;

                                    errorMsg = "Type mismatch, expecting " + leftOfComp + " found " + rightOfComp;

                                    saError(errorMsg);

                                }

                            } else {

                                level = lvl;

                                // Symbol not declared at all

                                errorMsg = "Symbol [" + tokens[iter + 1].value + "] used before being declared";

                                saError(errorMsg);

                            }

                        } else {

                            var leftOfComp = stack[declaredAt].retrieve(tokens[holdExpressionStart + 1].value)[1];
                            var rightOfComp = stack[level].retrieve(tokens[iter + 1].value)[1];

                            if (leftOfComp == rightOfComp) {

                                checkExpression();

                                ast.endChildren();

                                iter++;

                            } else {

                                errorMsg = "Type mismatch, expecting " + leftOfComp + " found " + rightOfComp;

                                saError(errorMsg);

                            }

                        }
                    }

                }

            } else if (tokens[iter].value.match(asToken.Kind.IdExpression.pattern)) {

                if (stack[stack.length - 1].retrieve(tokens[iter + 1].value) == undefined) {

                    // Symbol not declared in scope

                    var lvl = level;
                    level--;
                    found = false;

                    while (level >= 0) {
                        if (stack[level].retrieve(tokens[iter + 1].value) == undefined) {
                            // continue
                            level--;
                        } else {
                            var declaredAs = stack[level].retrieve(tokens[iter + 1].value)[1];
                            var declaredAt = level;
                            found = true;
                            break;
                        }
                    }

                    level = lvl;

                    if (found) {

                        // Move onto type checking

                        if (tokens[holdExpressionStart].value.match(asToken.Kind.IntExpression.pattern)) {
                            if (!(declaredAs == "int")) {

                                errorMsg = "Type mismatch, expecting int";
                                saError(errorMsg);

                            } else {

                                checkExpression();

                                ast.endChildren();

                                iter++;

                            }
                        } else if (tokens[holdExpressionStart].value.match(asToken.Kind.StringExpression.pattern)) {
                            if (!(declaredAs == "string")) {

                                errorMsg = "Type mismatch, expecting string";
                                saError(errorMsg);

                            } else {

                                checkExpression();

                                ast.endChildren();

                                iter++;

                            }
                        } else if (tokens[holdExpressionStart].value.match(asToken.Kind.BooleanExpression.pattern)) {
                            if (!(declaredAs == "boolean")) {

                                errorMsg = "Type mismatch, expecting boolean";
                                saError(errorMsg);

                            } else {

                                checkExpression();

                                ast.endChildren();

                                iter++;

                            }
                        } else if (tokens[holdExpressionStart].value.match(asToken.Kind.BoolvalExpression.pattern)) {
                            if (!(declaredAs == "boolean")) {

                                errorMsg = "Type mismatch, expecting boolean";
                                saError(errorMsg);

                            } else {

                                checkExpression();

                                ast.endChildren();

                                iter++;

                            }
                        }
                    }
                } else {

                    var declaredAs = stack[level].retrieve(tokens[iter + 1].value)[1];
                    var declaredAt = level;

                    if (tokens[holdExpressionStart].value.match(asToken.Kind.IntExpression.pattern)) {
                        if (!(declaredAs == "int")) {

                            errorMsg = "Type mismatch, expecting int";
                            saError(errorMsg);

                        } else {

                            checkExpression();

                            ast.endChildren();

                            iter++;

                        }
                    } else if (tokens[holdExpressionStart].value.match(asToken.Kind.StringExpression.pattern)) {
                        if (!(declaredAs == "string")) {

                            errorMsg = "Type mismatch, expecting string";
                            saError(errorMsg);

                        } else {

                            checkExpression();

                            ast.endChildren();

                            iter++;

                        }
                    } else if (tokens[holdExpressionStart].value.match(asToken.Kind.BooleanExpression.pattern)) {
                        if (!(declaredAs == "boolean")) {

                            errorMsg = "Type mismatch, expecting boolean";
                            saError(errorMsg);

                        } else {

                            checkExpression();

                            ast.endChildren();

                            iter++;

                        }
                    } else if (tokens[holdExpressionStart].value.match(asToken.Kind.BoolvalExpression.pattern)) {
                        if (!(declaredAs == "boolean")) {

                            errorMsg = "Type mismatch, expecting boolean";
                            saError(errorMsg);

                        } else {

                            checkExpression();

                            ast.endChildren();

                            iter++;

                        }
                    }
                }

            } else {

                // Move onto type checking

                var leftOfComp = tokens[holdExpressionStart].value;
                var rightOfComp = tokens[iter].value;

                if (leftOfComp == rightOfComp) {

                    checkExpression();

                    ast.endChildren();

                    iter++;

                } else {

                    errorMsg = "Type mismatch, expecting " + leftOfComp + " found " + rightOfComp;

                    saError(errorMsg);

                }

            }

        }

    }



    /********** ********** ********** ********** **********
     * checkIdExpression()
     ***********/
    function checkIdExpression() {

        if (stack[stack.length-1].retrieve(tokens[iter].value) == undefined) {

            // Symbol not declared in scope

            var lvl = level; level--; found = false;

            while (level >= 0) {
                if (stack[level].retrieve(tokens[iter].value) == undefined) {
                    // continue
                    level--;
                } else {
                    var declaredAs = stack[level].retrieve(tokens[iter].value)[1];
                    var declaredAt = level;
                    found = true;
                    break;
                }
            }

            level = lvl;

            if (found) {

                ast.addNode(tokens[iter].value, tokens[iter].value + level + levelInstance, "leaf"); iter++;

            } else {

                // Symbol not declared at all

                errorMsg = "Symbol [" + tokens[iter].value + "] used before being declared";

                saError(errorMsg);

            }

        } else {

            ast.addNode(tokens[iter].value, tokens[iter].value + level + levelInstance, "leaf"); iter++;

        }

        if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {

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

                    if (tokens[iter] == undefined || tokens[iter + 1] == undefined) {
                        break;
                    }
                } iter++;
            }
        }
    }
}