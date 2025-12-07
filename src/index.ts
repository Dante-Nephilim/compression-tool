import { promises as fs } from "fs";
import path from "path";

export async function parseArgumentsAndRun(): Promise<void> {
  function readFromStdin(): Promise<string> {
    return new Promise((resolve) => {
      let input = "";
      process.stdin.on("data", (chunk) => (input += chunk));
      process.stdin.on("end", () => resolve(input));
    });
  }

  const args = process.argv.slice(2);
  const flag: string | null = null;
  const filePath: string | null = null;

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
}
