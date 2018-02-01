/*
util.js
utility functions
 */

function trim(str) {
    return str.replace(/^\s+ | \s+$/g, "");
}

function checkUndefined(element) {
    return element !== undefined;
}