"use strict";
var _a, _b;
const matrixSize = 5;
const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
const playfairKeyEx = "PLAYFAIREXAMPLE";
// Filter input
function prepareInput(key) {
    return key
        .toUpperCase() // Convert to uppercase
        .replace(/[ÁÀÂÄ]/g, "A")
        .replace(/[Č]/g, "C")
        .replace(/[Ď]/g, "D")
        .replace(/[ÉÈÊËĚ]/g, "E")
        .replace(/[ÍÌÎÏ]/g, "I")
        .replace(/[Ň]/g, "N")
        .replace(/[ÓÒÔÖ]/g, "O")
        .replace(/[Ř]/g, "R")
        .replace(/[Š]/g, "S")
        .replace(/[Ť]/g, "T")
        .replace(/[ÚÙÛÜ]/g, "U")
        .replace(/[Ý]/g, "Y")
        .replace(/[Ž]/g, "Z")
        .replace(/J/g, "I") // Replace J with I
        .replace(/[^A-Z0-9 ]/g, ""); // Remove all special characters
}
// Function to format the matrix without special characters
function formatMatrix(matrix) {
    return matrix
        .map((row) => row.join("     "))
        .join("\n")
        .toUpperCase();
}
// Check if the char is in the array
function isCharInMatrix(matrix, char) {
    for (const row of matrix) {
        if (row.includes(char)) {
            return true;
        }
    }
    return false;
}
// Function for displaying key in the matrix
function displayKeyMatrix(key) {
    // Array init
    const keyMatrix = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(""));
    let rowIndex = 0;
    let colIndex = 0;
    //
    for (const char of key) {
        if (!isCharInMatrix(keyMatrix, char)) {
            keyMatrix[rowIndex][colIndex] = char;
            colIndex++;
            if (colIndex === matrixSize) {
                colIndex = 0;
                rowIndex++;
                if (rowIndex === matrixSize) {
                    return keyMatrix;
                }
            }
        }
    }
    //
    for (const char of alphabet) {
        if (!isCharInMatrix(keyMatrix, char)) {
            keyMatrix[rowIndex][colIndex] = char;
            colIndex++;
            if (colIndex === matrixSize) {
                colIndex = 0;
                rowIndex++;
                if (rowIndex === matrixSize) {
                    // Matrix is full
                    break;
                }
            }
        }
    }
    return keyMatrix;
}
// Event Listener for Keys and displaying in UI
(_a = document.querySelector(".encrypt-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const keyText = prepareInput(document.getElementById("key-text").value);
    try {
        const encodedText = displayKeyMatrix(keyText);
        document.getElementById("encrypted-matrix").value =
            formatMatrix(encodedText);
    }
    catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
        else {
            alert("An unknown error occurred");
        }
    }
});
// Event Listener for Playfair Key example
(_b = document.querySelector(".playfair-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    document.getElementById("key-text").value =
        playfairKeyEx.toUpperCase();
    try {
        const encodedText = displayKeyMatrix(playfairKeyEx);
        document.getElementById("encrypted-matrix").value =
            formatMatrix(encodedText);
    }
    catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
        else {
            alert("An unknown error occurred");
        }
    }
});
// Check if the two chars are in the same ROW
// Check if the two chars are in the same COL
// Check if the two chars are in the same DIAGONAL
