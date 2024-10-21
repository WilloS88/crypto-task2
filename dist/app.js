"use strict";
var _a, _b, _c;
const matrixSize = 5;
const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
const playfairKeyEx = "PLAYFAIREXAMPLE";
// Filter input
function prepareInput(key) {
    let preparedKey = key
        .toUpperCase()
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
        .replace(/[^A-Z]/g, ""); // Remove everything except alphabet chars
    return preparedKey;
}
// Function to split text into chunks of two characters a filter them
function prepareText(text, encryption) {
    let preparedText = prepareInput(text);
    let result = "";
    let i = 0;
    if (encryption) {
        while (i < preparedText.length) {
            let char1 = preparedText[i];
            let char2 = preparedText[i + 1];
            // If the second character is undefined (odd length), add 'X' to make a pair
            if (!char2) {
                result += char1 + "X";
                i += 2;
            }
            // If both characters are the same, insert 'X' after the first and reprocess the second character
            else if (char1 === char2) {
                result += char1 + "X ";
                i += 1; // Move only one step to reprocess char2 in the next iteration
            }
            // Otherwise, add the pair as is
            else {
                result += char1 + char2 + " ";
                i += 2;
            }
        }
    }
    if (!encryption) {
        let pairs = preparedText.match(/.{1,2}/g);
        if (!pairs) {
            throw new Error("Invalid decrypted text");
        }
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];
            let char1 = pair[0];
            let char2 = pair[1];
            if (char2) {
                if (char2 === "X") {
                    // Check if the next pair starts with the same character as char1
                    if (pairs[i + 1] && pairs[i + 1][0] === char1) {
                        // "X" was inserted between duplicate letters, skip it
                        result += char1;
                    }
                    else {
                        // "X" might be a valid character, include it
                        result += char1 + char2;
                    }
                }
                else {
                    result += char1 + char2;
                }
            }
            else {
                // Only one character left
                if (char1 !== "X") {
                    result += char1;
                }
            }
        }
        // Remove any trailing 'X' that was added as padding during encryption
        if (result[result.length - 1] === "X") {
            result = result.slice(0, -1);
        }
    }
    return result.trim();
}
// Function to format the matrix without special characters
function formatMatrix(matrix) {
    return matrix
        .map((row) => row.join("        "))
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
    // Fill the matrix with the key
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
    // Fill the remaining matrix with the alphabet
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
// Funtion to find the position of a character in the matrix
function findPosition(matrix, char) {
    for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
            if (matrix[row][col] === char) {
                return [row, col];
            }
        }
    }
    throw new Error(`Character ${char} not found in key matrix`);
}
// Check if the two chars are in the same ROW
function areCharsInSameRow(matrix, char1, char2) {
    const [row1] = findPosition(matrix, char1);
    const [row2] = findPosition(matrix, char2);
    return row1 === row2;
}
// Check if the two chars are in the same COL
function areCharsInSameColumn(matrix, char1, char2) {
    const [, col1] = findPosition(matrix, char1);
    const [, col2] = findPosition(matrix, char2);
    return col1 === col2;
}
function encryptDecryptPlayfairCipher(text, keyMatrix, encryptDecrypt) {
    const preparedText = prepareText(text, true);
    const pairs = preparedText.split(" ");
    let encryptedText = "";
    for (const pair of pairs) {
        const char1 = pair[0];
        const char2 = pair[1];
        let [row1, col1] = findPosition(keyMatrix, char1);
        let [row2, col2] = findPosition(keyMatrix, char2);
        // Based on the bool value we decide to ENCRYPT
        if (encryptDecrypt) {
            if (row1 === row2) {
                // Same row: replace each with the letter to the RIGHT, wrapping around
                col1 = (col1 + 1) % matrixSize;
                col2 = (col2 + 1) % matrixSize;
                encryptedText += keyMatrix[row1][col1] + keyMatrix[row2][col2] + " ";
            }
            else if (col1 === col2) {
                // Same column: replace each with the letter BELOW, wrapping around
                row1 = (row1 + 1) % matrixSize;
                row2 = (row2 + 1) % matrixSize;
                encryptedText += keyMatrix[row1][col1] + keyMatrix[row2][col2] + " ";
            }
            else {
                // Rectangle: swap columns "DIAGONAL"
                encryptedText += keyMatrix[row1][col2] + keyMatrix[row2][col1] + " ";
            }
        }
        // Based on the bool value we decide to DECRYPT
        if (!encryptDecrypt) {
            if (row1 === row2) {
                // Same row: replace each with the letter to the LEFT, wrapping around
                col1 = (col1 - 1) % matrixSize;
                col2 = (col2 - 1) % matrixSize;
                encryptedText += keyMatrix[row1][col1] + keyMatrix[row2][col2] + " ";
            }
            else if (col1 === col2) {
                // Same column: replace each with the letter ABOVE, wrapping around
                row1 = (row1 - 1) % matrixSize;
                row2 = (row2 - 1) % matrixSize;
                encryptedText += keyMatrix[row1][col1] + keyMatrix[row2][col2] + " ";
            }
            else {
                // Rectangle: swap columns "DIAGONAL"
                encryptedText += keyMatrix[row1][col2] + keyMatrix[row2][col1] + " ";
            }
        }
    }
    return encryptedText.trim();
}
// Event Listener for Encrypting, Keys and displaying in UI
(_a = document.querySelector(".encrypt-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    // Get the key text and text input from the user
    const keyText = prepareInput(document.getElementById("key-text").value);
    const encryptText = document.getElementById("text-to-encrypt").value;
    // Prepare and filter the text to be encrypted
    const filteredText = prepareText(encryptText, true);
    // Display the filtered text
    document.getElementById("filtered-text-to-encrypt").value = filteredText;
    try {
        // Generate the key matrix and display it
        const matrixWithKey = displayKeyMatrix(keyText);
        document.getElementById("matrix-with-key").value =
            formatMatrix(matrixWithKey);
        // Encrypt the text and display it
        const encryptedText = encryptDecryptPlayfairCipher(filteredText, matrixWithKey, true);
        document.getElementById("encrypted-text").value =
            encryptedText;
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
// Event Listener for Decrypting and displaying in UI
(_b = document.querySelector(".decrypt-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    // Get the key text and text input from the user
    const keyText = prepareInput(document.getElementById("key-text").value);
    //
    const encryptedText = document.getElementById("text-to-decrypt").value;
    const matrixWithKey = displayKeyMatrix(keyText);
    document.getElementById("matrix-with-key").value =
        formatMatrix(matrixWithKey);
    try {
        const decryptedText = encryptDecryptPlayfairCipher(encryptedText, matrixWithKey, false);
        document.getElementById("decrypted-text").value =
            decryptedText;
        const filteredText = prepareText(decryptedText, false);
        document.getElementById("decrypted-filtered-text").value = filteredText;
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
(_c = document.querySelector(".playfair-button")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    document.getElementById("key-text").value =
        playfairKeyEx.toUpperCase();
    try {
        const encodedText = displayKeyMatrix(playfairKeyEx);
        document.getElementById("matrix-with-key").value =
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
