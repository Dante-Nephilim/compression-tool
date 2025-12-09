//huffman compression
export function compress(content: string): string {
  const frequencyMap: Map<string, number> = new Map();
  content.split("").forEach((char) => {
    if (frequencyMap.has(char)) {
      frequencyMap.set(char, frequencyMap.get(char)! + 1);
    } else {
      frequencyMap.set(char, 1);
    }
  });
  return content;
}

//huffman decompression
export function decompress(content: string): string {
  return content;
}
