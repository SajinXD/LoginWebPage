function add7 (number) {
    return number +7;
}

function multiply (x, y) {
    return x * y;
}

function capitalize (str) {
    let lowerCaseStr = str.toLowerCase();
    let capitalizedStr = lowerCaseStr.charAt(0).toUpperCase() + lowerCaseStr.slice(1);
    return capitalizedStr;
}

function lastLetter (stri) {
    let lastLetterStr = stri.at(-1);
    return lastLetterStr;
}