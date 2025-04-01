import * as fs from "fs";
import * as crypto from "crypto";
import path from "path";

/**
 * Calculates hash value of a file
 * @param filePath - Path to the file
 * @param algorithm - Hash algorithm to use (default: 'sha256')
 * @returns Promise that resolves to the hash value
 */
export async function calculateFileHash(
  filePath: string,
  algorithm: string = "sha256"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on("error", (err) => reject(err));
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

/**
 * Compares two files using their hash values
 * @param file1Path - Path to the first file
 * @param file2Path - Path to the second file
 * @param algorithm - Hash algorithm to use (default: 'sha256')
 * @returns Promise that resolves to boolean indicating if files are identical
 */
export async function compareFiles(
  file1Path: string,
  file2Path: string,
  algorithm: string = "sha256"
): Promise<boolean> {
  try {
    const hash1 = await calculateFileHash(file1Path, algorithm);
    const hash2 = await calculateFileHash(file2Path, algorithm);

    return hash1 === hash2;
  } catch (error) {
    console.error("Error comparing files:", error);
    throw error;
  }
}

const main = async () => {
  const inputFileName = process.argv[2] || "large-file.txt";
  const decryptedFileName = process.argv[4] || `${inputFileName}.decrypted.txt`;

  const inputFilePath = path.join(__dirname, "..", "assets", inputFileName);
  const decryptedFilePath = path.join(
    __dirname,
    "..",
    "assets",
    decryptedFileName
  );

  const areFilesIdentical = await compareFiles(
    inputFilePath,
    decryptedFilePath
  );
  if (areFilesIdentical) {
    console.log(`File ${inputFileName} and ${decryptedFileName} are identical`);
  } else {
    console.log(
      `File ${inputFileName} and ${decryptedFileName} are NOT identical`
    );
  }
};

main();
