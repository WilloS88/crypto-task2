const matrixSize = 5;
const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
const playfairKeyEx = "PLAYFAIREXAMPLE";
const spacePlaceholder = "XMEZERAY";
const numbersPlaceholder = [
  "XZEROY",
  "XONEY",
  "XTWOY",
  "XTHREEY",
  "XFOURY",
  "XFIVEY",
  "XSIXY",
  "XSEVENY",
  "XEIGHTY",
  "XNINEY",
];

// Filter input
function prepareInput(text: string): string {
  return text
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
    .replace(/[^A-Z0-9 ]/g, "") // Remove all special characters except numbers and spaces
    .replace(/ /g, spacePlaceholder) // Replace spaces with placeholder
    .replace(/[0-9]/g, (digit: string) => numbersPlaceholder[parseInt(digit)]); // Replace numbers with placeholders
}

// Function to split text into chunks of two characters a filter them
function prepareText(text: string, encryption: boolean): string {
  let preparedText = prepareInput(text);
  let result = "";
  let i = 0;

  if (encryption) {
    while (i < preparedText.length) {
      let char1 = preparedText[i];
      let char2 = preparedText[i + 1];

      // If the second character is undefined (odd length)
      if (!char2) {
        // If the last character is "X", avoid adding "X" to make "XX"
        let paddingChar = "X";
        if (char1 === "X") {
          paddingChar = "Q"; // Use "Q" or any other character that is not "X"
        }
        result += char1 + paddingChar;
        i += 2;
      }
      // If both characters are the same, insert "X" after the first and reprocess the second character
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
    // Split the text into pairs
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
          } else {
            // "X" might be a valid character, include it
            result += char1 + char2;
          }
        } else if (char2 === "Q") {
          // "Q" was added as padding, check if it should be removed
          if (i === pairs.length - 1) {
            // It's the last pair, remove "Q"
            result += char1;
          } else {
            result += char1 + char2;
          }
        } else {
          result += char1 + char2;
        }
      } else {
        // Only one character left
        if (char1 !== "X" && char1 !== "Q") {
          result += char1;
        }
      }
    }
  }

  return result.trim();
}

// Function to format the matrix without special characters
function formatMatrix(matrix: string[][]): string {
  return matrix
    .map((row) => row.join("        "))
    .join("\n")
    .toUpperCase();
}

// Check if the char is in the array
function isCharInMatrix(matrix: string[][], char: string): boolean {
  for (const row of matrix) {
    if (row.includes(char)) {
      return true;
    }
  }
  return false;
}

// Function for displaying key in the matrix
function displayKeyMatrix(key: string): string[][] {
  // Array init
  const keyMatrix: string[][] = Array.from({ length: matrixSize }, () =>
    Array(matrixSize).fill("")
  );

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
function findPosition(matrix: string[][], char: string): [number, number] {
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
function areCharsInSameRow(
  matrix: string[][],
  char1: string,
  char2: string
): boolean {
  const [row1] = findPosition(matrix, char1);
  const [row2] = findPosition(matrix, char2);
  return row1 === row2;
}

// Check if the two chars are in the same COL
function areCharsInSameColumn(
  matrix: string[][],
  char1: string,
  char2: string
): boolean {
  const [, col1] = findPosition(matrix, char1);
  const [, col2] = findPosition(matrix, char2);
  return col1 === col2;
}

function encryptPlayfairCipher(text: string, keyMatrix: string[][]): string {
  const preparedText = prepareText(text, true);
  const pairs = preparedText.split(" ");

  let encryptedText = "";

  for (const pair of pairs) {
    const char1 = pair[0];
    const char2 = pair[1];

    let [row1, col1] = findPosition(keyMatrix, char1);
    let [row2, col2] = findPosition(keyMatrix, char2);

    if (row1 === row2) {
      // Same row: replace each with the letter to the RIGHT, wrapping around
      col1 = (col1 + 1) % matrixSize;
      col2 = (col2 + 1) % matrixSize;
      encryptedText += keyMatrix[row1][col1] + keyMatrix[row2][col2] + " ";
    } else if (col1 === col2) {
      // Same column: replace each with the letter BELOW, wrapping around
      row1 = (row1 + 1) % matrixSize;
      row2 = (row2 + 1) % matrixSize;
      encryptedText += keyMatrix[row1][col1] + keyMatrix[row2][col2] + " ";
    } else {
      // Rectangle: swap columns "DIAGONAL"
      encryptedText += keyMatrix[row1][col2] + keyMatrix[row2][col1] + " ";
    }
  }

  return encryptedText.trim();
}

function decryptPlayfairCipher(
  text: string,
  keyMatrix: string[][],
  originalInput: string
): string {
  // Remove spaces and prepare the text for decryption
  const preparedText = prepareText(text.replace(/\s+/g, ""), false);
  const pairs = preparedText.match(/.{1,2}/g);

  if (!pairs) {
    throw new Error("Invalid encrypted text");
  }

  let decryptedText = pairs
  .map((pair) => {
    const char1 = pair[0];
    const char2 = pair[1];

    let [row1, col1] = findPosition(keyMatrix, char1);
    let [row2, col2] = findPosition(keyMatrix, char2);

    if (row1 === row2) {
      // Same row: replace each with the letter to the LEFT, wrapping around
      col1 = (col1 - 1 + matrixSize) % matrixSize;
      col2 = (col2 - 1 + matrixSize) % matrixSize;
      return keyMatrix[row1][col1] + keyMatrix[row2][col2];
    } else if (col1 === col2) {
      // Same column: replace each with the letter ABOVE, wrapping around
      row1 = (row1 - 1 + matrixSize) % matrixSize;
      row2 = (row2 - 1 + matrixSize) % matrixSize;
      return keyMatrix[row1][col1] + keyMatrix[row2][col2];
    } else {
      // Rectangle: swap columns "DIAGONAL"
      return keyMatrix[row1][col2] + keyMatrix[row2][col1];
    }
  })
  .join(""); // Into a single string


  // Replace placeholders back to original spaces and numbers
  decryptedText = decryptedText
    .replace(new RegExp(spacePlaceholder, "g"), " ")
    .replace(new RegExp(numbersPlaceholder.join("|"), "g"), (match) => {
      const index = numbersPlaceholder.indexOf(match);
      return index !== -1 ? index.toString() : match;
    });

  // Compare decryptedText with the original input to remove padding characters
  if (decryptedText.length > originalInput.length) {
    decryptedText = decryptedText.slice(0, originalInput.length);
  }

  return decryptedText;
}

// Event Listener for Encrypting, Keys and displaying in UI
document.querySelector(".encrypt-button")?.addEventListener("click", () => {
  // Get the key text and text input from the user
  const keyText = prepareInput(
    (document.getElementById("key-text") as HTMLTextAreaElement).value
  );
  const encryptText = (
    document.getElementById("text-to-encrypt") as HTMLTextAreaElement
  ).value;

  // Prepare and filter the text to be encrypted
  const filteredText = prepareText(encryptText, true);

  // Display the filtered text
  (
    document.getElementById("filtered-text-to-encrypt") as HTMLTextAreaElement
  ).value = filteredText;

  try {
    // Generate the key matrix and display it
    const matrixWithKey = displayKeyMatrix(keyText);
    (document.getElementById("matrix-with-key") as HTMLTextAreaElement).value =
      formatMatrix(matrixWithKey);

    // Encrypt the text and display it
    const encryptedText = encryptPlayfairCipher(encryptText, matrixWithKey);
    (document.getElementById("encrypted-text") as HTMLTextAreaElement).value =
      encryptedText;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("An unknown error occurred");
    }
  }
});

// Event Listener for Decrypting and displaying in UI
document.querySelector(".decrypt-button")?.addEventListener("click", () => {
  // Get the key text and text input from the user
  const keyText = prepareInput(
    (document.getElementById("key-text") as HTMLTextAreaElement).value
  );
  //
  const encryptedText = (
    document.getElementById("text-to-decrypt") as HTMLTextAreaElement
  ).value;

  const originalInput = (
    document.getElementById("text-to-encrypt") as HTMLTextAreaElement
  ).value;
  try {
    const matrixWithKey = displayKeyMatrix(keyText);

    const decryptedText = decryptPlayfairCipher(
      encryptedText,
      matrixWithKey,
      originalInput
    );

    (document.getElementById("decrypted-text") as HTMLTextAreaElement).value =
      decryptedText;

    // Decrypt the text and display it
    (
      document.getElementById("decrypted-filtered-text") as HTMLTextAreaElement
    ).value = decryptedText;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("An unknown error occurred");
    }
  }
});

// Event Listener for Playfair Key example
document.querySelector(".playfair-button")?.addEventListener("click", () => {
  (document.getElementById("key-text") as HTMLTextAreaElement).value =
    playfairKeyEx.toUpperCase();

  try {
    const encodedText = displayKeyMatrix(playfairKeyEx);
    (document.getElementById("matrix-with-key") as HTMLTextAreaElement).value =
      formatMatrix(encodedText);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("An unknown error occurred");
    }
  }
});
