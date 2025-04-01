import * as fs from "fs";
import * as path from "path";

/**
 * Generates a large text file efficiently using streams
 * @param filePath Path to save the generated file
 * @param sizeInGB Target size of the file in gigabytes
 */
async function generateLargeTextFile(
  filePath: string,
  sizeInGB: number = 10
): Promise<void> {
  const targetSizeBytes = sizeInGB * 1024 * 1024 * 1024; // Convert GB to bytes
  const chunkSizeBytes = 64 * 1024 * 1024; // 64 MB chunks for efficient writing

  console.log(`Generating ${sizeInGB}GB text file at: ${filePath}`);
  console.time("Generation completed in");

  // Create a write stream
  const writeStream = fs.createWriteStream(filePath);

  let bytesWritten = 0;
  let lastReportedProgress = 0;

  return new Promise((resolve, reject) => {
    writeStream.on("error", reject);

    function writeNextChunk() {
      // Determine how much to write in this chunk
      const remainingBytes = targetSizeBytes - bytesWritten;
      const bytesToWrite = Math.min(chunkSizeBytes, remainingBytes);

      if (bytesToWrite <= 0) {
        console.log("finishing");
        // We've written enough data, close the stream and finish
        writeStream.end(() => {
          console.timeEnd("Generation completed in");
          console.log(`File generated successfully: ${filePath}`);
          resolve();
        });
        return;
      }

      // Generate content dynamically for the current chunk
      const content = generateTextContent(bytesToWrite);
      writeStream.write(content, () => {
        bytesWritten += bytesToWrite;

        // Report progress every 5%
        const progress = Math.floor((bytesWritten / targetSizeBytes) * 100);
        if (progress >= lastReportedProgress + 5) {
          lastReportedProgress = progress;
          console.log(
            `Progress: ${progress}% (${(
              bytesWritten /
              1024 /
              1024 /
              1024
            ).toFixed(2)}GB)`
          );
        }

        // Use setImmediate to avoid blocking the event loop
        setImmediate(writeNextChunk);
      });
    }

    // Start writing
    writeNextChunk();
  });
}

/**
 * Generates text content for the file
 * @param size Size of content to generate in bytes
 * @returns Generated text content
 */
function generateTextContent(size: number): string {
  // Create a basic repeating pattern with some variation
  const baseText =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\n";
  const baseTextLength = baseText.length;

  let content = "";
  while (content.length + baseTextLength <= size) {
    content += baseText;
  }

  // Add remaining characters to reach the exact size
  content += baseText.substring(0, size - content.length);

  return content;
}

// Example usage
async function main() {
  const outputPath = path.join(__dirname, "..", "assets", "large-file.txt");
  try {
    await generateLargeTextFile(outputPath, 10);
  } catch (error) {
    console.error("Error generating file:", error);
  }
}

// Run the generator
main();
