/********** ********** ********** ********** **********
 * codeGen.js
 *
 * Includes
 *
 **********/

function codeGen(ir) {

    var codeList = [];

    for (var i = 0; i < 256; i++) {
        codeList[i] = "00";;
    }

    for (var j = 0; j < codeList.length; j++) {
        document.getElementById("codeGen").value += codeList[j] + " ";
    }

}