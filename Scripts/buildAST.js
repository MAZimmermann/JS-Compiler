/********** ********** ********** ********** **********
 * buildAST.js
 *
 * Includes...
 *
 **********/

function buildAST(astTokens) {

    document.getElementById("saOutputTree").value += "Program " + programCount + "\n";
    document.getElementById("saOutputTree").value += "********** ********** **********\n";
    document.getElementById("saOutputTable").value += "Program " + programCount + "\n";
    document.getElementById("saOutputTable").value += "********** ********** **********\n";

    // Grab token array from lex output
    var tokens = astTokens;

    // Keeps track of our position in the token array
    var iter = 0;

    // Used to assess whether we're assessing a boolean expression
    boolCheck = false;

/*    for (var k = 0; k < astTokens.length; k++) {
        alert(astTokens[k].value /!*+ " " + astTokens[k].depth*!/);
    }

    iter = 0;*/

    // Create new instance of tree
    var ast = new Tree();

    // Initialize tree with root node
    // Since we passed parse, the first item will be a block
    ast.addNode("Block", "branch");

    // Set the current node to the root
    ast.cur = ast.root;

    checkBlock(); /*iter++;*/

    ast.endChildren();

    var tree = ast.toString();

    document.getElementById("saOutputTree").value += tree + "\n";

    function checkBlock() {

        outer = tokens[iter].depth;

/*        alert(tokens[iter].value + " " + tokens[iter].depth);*/

        iter++;

/*        alert(tokens[iter].value + " " + tokens[iter].depth);*/

        while (tokens[iter].depth - 1 == outer) {

/*            alert(astTokens[iter].value);*/

            if (tokens[iter].value.match(asToken.Kind.PrintStatement.pattern)) {
                ast.addNode("PrintStatement", "branch"); iter++;
                checkPrintStatement();
                ast.endChildren();
            } else if (tokens[iter].value.match(asToken.Kind.AssignmentStatement.pattern)) {
                ast.addNode("AssignmentStatement", "branch"); iter++;
                checkAssignment();
/*                ast.endChildren();*/
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

                alert("test");

                ast.addNode("Block", "branch");
                checkBlock();
                ast.endChildren();
                outer--;

            } else {

                // Not sure what else could make its way through...
                break;

            }

/*            alert(tokens[iter].value + " " + tokens[iter].depth);*/

            if (tokens[iter + 1] == undefined) {
                break;
            }

        }

    }

    function checkAssignment() {

/*        alert(tokens[iter].value + " " + tokens[iter].depth);*/

        ast.addNode(tokens[iter].value, "leaf"); iter++;

        checkExpression();

    }

    function checkVarDecl() {

        ast.addNode(tokens[iter].value, "leaf"); iter++;

        ast.addNode(tokens[iter].value, "leaf"); iter++;

    }

    function checkWhileStatement() {

        checkExpression();

/*        ast.endChildren();*/

        ast.addNode("Block", "branch");

        checkBlock();
        ast.endChildren();
        outer--;

    }

    function checkIfStatement() {

        checkExpression();

/*        ast.endChildren();*/

        ast.addNode("Block", "branch");

        checkBlock();
        ast.endChildren();
        outer--;

    }

    function checkPrintStatement() {

        checkExpression();

        ast.endChildren();

    }

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


        } else if (tokens[iter].value.match(asToken.Kind.BooleanExpression.pattern)) {

            iter++;

            checkBooleanExpression();


        } else if (tokens[iter].value.match(asToken.Kind.IdExpression.pattern)) {

            iter++;

            checkIdExpression();

        }
    }

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

/*                    alert("test");*/

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

    function checkStringExpression() {
        var holdIt = [];

        while (!tokens[iter].value.match(asToken.Kind.EndExpression.pattern)) {
            holdIt.push(tokens[iter].value)
            iter++;
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
                while (tokens[iter].value.match(asToken.Kind.EndExpression.pattern)) {

                    ast.endChildren(); iter++;

                    if (tokens[iter] == undefined) {
                        break;
                    }
                }
            }
        }
    }

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