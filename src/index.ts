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
      const buf = compress(content);
      // For stdin/direct text, print hex so it’s inspectable
      console.log(buf.toString("hex"));
    } else if (flag === "-dc") {
      console.log("Decompressing content...");
      console.log(decompress(content));
    }
  }

  const args = process.argv.slice(2);
  console.log(process.argv);
  let flag: string | null = null;
  let filePath: string | null = null;

  // Help
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    const helpMessage = `my-compression - A custom implementation of compression tool
Usage:
  my-compression [option] <filename.extension>

Options:
  -c       Compress file
  -dc      Decompress file
  -h, --help   Show this help message`;
    console.log(helpMessage);
    process.exit(0);
  }

  // Stdin mode: my-compress -c < input.txt
  if (args.length === 1 && args[0].startsWith("-") && !process.stdin.isTTY) {
    const input = await readFromStdin();
    logEncodedOrDecodedContent(args[0], input);
    return;
  }

  // Args parsing
  if (args.length === 1) {
    if (args[0].startsWith("-")) {
      console.error("Please provide a file name after the flag.\nUsage: my-compression [-c|-dc] <filename.extension>");
      process.exit(1);
    }
    if (!args[0].includes(".")) {
      console.error("The file name needs to be provided with extension. Eg: filename.extension");
      process.exit(1);
    }
    filePath = args[0];
  } else if (args.length === 2) {
    flag = args[0];
    filePath = args[1];
    const validFlags = ["-c", "-dc"];
    if (!validFlags.includes(flag)) {
      console.error(`Invalid flag: ${flag}`);
      process.exit(1);
    }
  } else {
    console.error("Usage: my-compression [-c|-dc] <filename.extension>");
    process.exit(1);
  }

  try {
    const resolvedFilePath = path.resolve(process.cwd(), filePath!);
    const fileContent = await fs.readFile(resolvedFilePath, "utf-8");

    if (flag) {
      const outputFilePath = flag === "-c" ? `${resolvedFilePath}.compressed` : `${resolvedFilePath}.decompressed`;

      const output = flag === "-c" ? compress(fileContent) : decompress(fileContent);

      // compress() returns Buffer, decompress() is still string
      await fs.writeFile(outputFilePath, output as any);
      console.log(`Output written to ${outputFilePath}`);
    } else {
      console.log("No flag provided. Defaulting to compressing the file...");
      const outputFilePath = `${resolvedFilePath}.compressed`;
      const output = compress(fileContent);
      await fs.writeFile(outputFilePath, output);
      console.log(`Output written to ${outputFilePath}`);
    }
  } catch (error) {
    console.error(`An error reading the file: ${filePath}`);
    console.error(error);
    process.exit(1);
  }
}
