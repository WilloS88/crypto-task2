const matrixSize = 5;
const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
const playfairKeyEx = "PLAYFAIREXAMPLE";

// Filter input
function prepareInput(key: string): string {
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

// Function to split text into chunks of two characters
function prepareText(text: string): string {
  let preparedText = prepareInput(text);
  let result = "";
  let i = 0;
  
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

  return result.trim(); // Remove any trailing space
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

// Event Listener for Keys and displaying in UI
document.querySelector(".encrypt-button")?.addEventListener("click", () => {
  // Get the key text and text input from the user
  const keyText = prepareInput(
    (document.getElementById("key-text") as HTMLTextAreaElement).value
  );
  const encryptText = (
    document.getElementById("text-to-encrypt") as HTMLTextAreaElement
  ).value;

  // Prepare and filter the text to be encrypted
  const filteredText = prepareText(encryptText);

  // Display the filtered text
  (
    document.getElementById("filtered-text-to-encrypt") as HTMLTextAreaElement
  ).value = filteredText;

  try {
    // Generate the key matrix and display it
    const matrixWithKey = displayKeyMatrix(keyText);
    (document.getElementById("matrix-with-key") as HTMLTextAreaElement).value =
      formatMatrix(matrixWithKey);
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

// Check if the two chars are in the same ROW

// Check if the two chars are in the same COL

// Check if the two chars are in the same DIAGONAL
