function lex() {
    // Grab source code from taInput
    var sourceCode = document.getElementById("taInput").value;
    // Trim the leading and trailing spaces
    sourceCode = trim(sourceCode);
    return sourceCode;
}