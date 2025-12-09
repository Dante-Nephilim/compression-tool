import { promises as fs } from "fs";
import path from "path";
import { compress, decompress } from "./utils";

export async function parseArgumentsAndRun(): Promise<void> {
  function readFromStdin(): Promise<string> {
    return new Promise((resolve) => {
      let input = "";
      process.stdin.on("data", (chunk) => (input += chunk));
      process.stdin.on("end", () => resolve(input));
    });
  }
  function logEncodedOrDecodedContent(flag: string, content: string) {
    if (flag === "-c") {
      console.log("Compressing content...");
      console.log(compress(content));
    } else if (flag === "-dc") {
      console.log("Decompressing content...");
      console.log(decompress(content));
    }
  }

  const args = process.argv.slice(2);
  console.log(process.argv);
  let flag: string | null = null;
  let filePath: string | null = null;

  // Help Message
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    const helpMessage = `my-compression - A custom implementation of compression tool
    Usage:
    my-compression [option] <filename.extension>

    Options:
    -c    Compress File
    -dc    DeCompress File
    -h, --help    Show this help message`;
    console.log(helpMessage);
    process.exit(0);
  }
  // Read from stdin
  if (args.length === 1 && args[0].startsWith("-") && !process.stdin.isTTY) {
    const input = await readFromStdin();
    logEncodedOrDecodedContent(args[0], input);
    return;
  }
  // Argument Parsing
  else if (args.length === 1) {
    if (args[0].startsWith("-")) {
      console.error("Please provide a file name after the flag.\nUsage: my-compression [-c|-dc] <filename.extension>");
      process.exit(1);
    }
    // Check for file extension
    if (!args[0].includes(".")) {
      console.error("The file name needs to be provided with extension. Eg: filename.extension");
      process.exit(1);
    }
    filePath = args[0];
  }
  // With Flag and File
  else if (args.length === 2) {
    flag = args[0];
    filePath = args[1];
    const validFlags = ["-c", "-dc"];
    if (!validFlags.includes(flag)) {
      console.error(`Invalid flag: ${flag}`);
      process.exit(1);
    }
  }
  // Invalid Argument Count
  else {
    console.error("Usage: my-compression [-c|-dc] <filename.extension>");
    process.exit(1);
  }
  try {
    const resolvedFilePath = path.resolve(process.cwd(), filePath!);
    const fileContent = await fs.readFile(resolvedFilePath, "utf-8");
    if (flag) {
      // Write encoded or decoded file to the same location
      const outputFilePath = flag === "-c" ? `${resolvedFilePath}.compressed` : `${resolvedFilePath}.decompressed`;
      await fs.writeFile(outputFilePath, flag === "-c" ? compress(fileContent) : decompress(fileContent), "utf-8");
      console.log(`Output written to ${outputFilePath}`);
    } else {
      console.log("No flag provided. Defaulting to compressing the file...");
      const outputFilePath = `${resolvedFilePath}.compressed`;
      await fs.writeFile(outputFilePath, compress(fileContent), "utf-8");
      console.log(`Output written to ${outputFilePath}`);
    }
  } catch (error) {
    console.error(`An error reading the file: ${filePath}`);
    console.error(error);
    process.exit(1);
  }
}
