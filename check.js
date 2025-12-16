// Make sure your package.json has "type": "module"
// npm install bcrypt

import bcrypt from "bcrypt";
import readline from "readline";

const hash = "$2b$10$7WNEDjohk7W5RUwCozXkKuYYKOkJsIi1MCcBCybQlAWXcEYHRceQ2";

// Set up terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter password to check: ", async (passwordGuess) => {
  const match = await bcrypt.compare(passwordGuess, hash);

  if (match) {
    console.log("✔ Password is correct");
  } else {
    console.log("✘ Password is incorrect");
  }

  rl.close();
});
