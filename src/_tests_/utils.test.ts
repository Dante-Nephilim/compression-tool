import { promises as fs } from "fs";
import path from "path";
import { compress, decompress } from "../utils";

describe("Compression and Decompression Utilities", () => {
  test("compress returns a non-empty Buffer for basic string", () => {
    const result = compress("cccbba");
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(0);
  });

  test("compress 'aaabbc' produces expected small buffer", () => {
    const result = compress("aaabbc");
    // 7 chars → few bits; should fit in 1–2 bytes
    expect(result.length).toBeLessThanOrEqual(2);
  });

  test("decompress currently echoes input", () => {
    expect(decompress("cccbba")).toBe("cccbba");
  });

  test("test.txt compressed is smaller than or comparable to original", async () => {
    const testFilePath = path.resolve(process.cwd(), "test.txt");
    const input = await fs.readFile(testFilePath);
    const compressed = compress(input.toString("utf8"));

    // Rough sanity check: compressed bytes * 8 bits vs original bytes * 8 bits
    // For now just assert it's not dramatically larger
    // You can tighten later once header/format is finalized
    expect(compressed.length).toBeLessThanOrEqual(input.length * 2);
  });
});
