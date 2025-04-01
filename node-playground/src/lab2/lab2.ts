import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";

/**
 * File encryption utility using AES in CTR mode
 * This script reads a file, encrypts its contents using AES-256-CTR,
 * and writes the encrypted data to a new file.
 */

// Function to encrypt a file using AES in CTR mode
function encryptFile(
  inputFilePath: string,
  outputFilePath: string,
  key: Buffer,
  iv: Buffer
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const readStream = fs.createReadStream(inputFilePath);
      const writeStream = fs.createWriteStream(outputFilePath);

      const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);

      readStream
        .pipe(cipher)
        .pipe(writeStream)
        .on("finish", () => {
          console.log(`File encrypted successfully: ${outputFilePath}`);
          resolve();
        })
        .on("error", (error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Function to decrypt a file using AES in CTR mode
function decryptFile(
  inputFilePath: string,
  outputFilePath: string,
  key: Buffer,
  iv: Buffer
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const readStream = fs.createReadStream(inputFilePath);
      const writeStream = fs.createWriteStream(outputFilePath);

      const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);

      readStream
        .pipe(decipher)
        .pipe(writeStream)
        .on("finish", () => {
          console.log(`File decrypted successfully: ${outputFilePath}`);
          resolve();
        })
        .on("error", (error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Generate a random encryption key and IV
function generateKeyAndIV(): { key: Buffer; iv: Buffer } {
  // AES-256 requires a 32-byte key and 16-byte IV for CTR mode
  const key = crypto.randomBytes(32); // 256 bits
  const iv = crypto.randomBytes(16); // 128 bits
  return { key, iv };
}

async function main() {
  try {
    // Get file paths from command line arguments or use defaults
    const inputFileName = process.argv[2] || "large-file.txt";
    const outputFileName = process.argv[3] || `${inputFileName}.encrypted.enc`;
    const decryptedFileName =
      process.argv[4] || `${inputFileName}.decrypted.txt`;

    const inputFilePath = path.join(__dirname, "..", "assets", inputFileName);
    const outputFilePath = path.join(__dirname, "..", "assets", outputFileName);
    const decryptedFilePath = path.join(
      __dirname,
      "..",
      "assets",
      decryptedFileName
    );

    try {
      const fileStats = fs.statSync(inputFilePath);
      console.log(
        `Input file size: ${fileStats.size / 1024 / 1024 / 1024} Gigabytes`
      );
    } catch (error) {
      console.error(`Error getting file size: ${(error as Error).message}`);
    }

    // Check if input file exists
    if (!fs.existsSync(inputFilePath)) {
      console.error(`Error: Input file '${inputFileName}' not found`);
      process.exit(1);
    }

    // Generate encryption key and IV
    const { key, iv } = generateKeyAndIV();

    // Save the key and IV to files for later decryption
    const keyFileName = `${outputFileName}.key`;
    const ivFileName = `${outputFileName}.iv`;

    const keyFilePath = path.join(__dirname, "..", "assets", keyFileName);
    const ivFilePath = path.join(__dirname, "..", "assets", ivFileName);

    fs.writeFileSync(keyFilePath, key);
    console.log(`Encryption key saved to: ${keyFilePath}`);

    fs.writeFileSync(ivFilePath, iv);
    console.log(`Initialization vector saved to: ${ivFilePath}`);

    // Measure encryption time
    console.time("Encryption Time");
    await encryptFile(inputFilePath, outputFilePath, key, iv);
    console.timeEnd("Encryption Time");

    // Measure decryption time
    console.time("Decryption Time");
    await decryptFile(outputFilePath, decryptedFilePath, key, iv);
    console.timeEnd("Decryption Time");
  } catch (error) {
    console.error("Error:", (error as any).message);
  }
}

// Run the main function
main();
