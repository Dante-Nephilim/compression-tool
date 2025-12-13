// Huffman compression
export function compress(content: string): Buffer {
  type HuffmanTreeNode = {
    weight: number;
    left: HuffmanTreeNode | null;
    right: HuffmanTreeNode | null;
    char?: string;
  };

  // 1. Build frequency map
  const frequencyMap: Map<string, number> = new Map();
  for (const char of content) {
    frequencyMap.set(char, (frequencyMap.get(char) ?? 0) + 1);
  }

  console.log("Character Frequency Map: ", frequencyMap);

  if (frequencyMap.size === 0) {
    return Buffer.alloc(0);
  }

  // 2. Build Huffman tree using a simple priority-queue-like array
  const nodes: HuffmanTreeNode[] = Array.from(frequencyMap).map(([char, freq]) => ({
    weight: freq,
    char,
    left: null,
    right: null,
  }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.weight - b.weight);
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    const parent: HuffmanTreeNode = {
      weight: left.weight + right.weight,
      left,
      right,
    };
    nodes.push(parent);
  }

  const huffManBinaryTree = nodes[0];
  console.log("Huffman Binary Tree: ", huffManBinaryTree);

  // 3. Generate codes by traversing the tree
  function buildCodes(node: HuffmanTreeNode | null, prefix: string, table: Map<string, string>) {
    if (!node) return;
    if (node.char !== undefined && !node.left && !node.right) {
      // Leaf
      table.set(node.char, prefix.length === 0 ? "0" : prefix);
      return;
    }
    buildCodes(node.left, prefix + "0", table);
    buildCodes(node.right, prefix + "1", table);
  }

  const huffmanCodes: Map<string, string> = new Map();
  buildCodes(huffManBinaryTree, "", huffmanCodes);

  console.log("Huffman Codes: ", huffmanCodes);

  // 4. Encode content into bit string
  let encodedContent = "";
  for (const char of content) {
    const code = huffmanCodes.get(char);
    if (code === undefined) {
      throw new Error(`Missing Huffman code for char ${JSON.stringify(char)}`);
    }
    encodedContent += code;
  }

  console.log("Encoded Content (first 256 bits): ", encodedContent.slice(0, 256));

  // 5. Pack bits into bytes
  const byteLength = Math.ceil(encodedContent.length / 8);
  const bitBuffer = Buffer.alloc(byteLength);
  let byteIndex = 0;

  for (let i = 0; i < encodedContent.length; i += 8) {
    const byteBits = encodedContent.slice(i, i + 8).padEnd(8, "0");
    bitBuffer[byteIndex++] = parseInt(byteBits, 2);
  }

  return bitBuffer;
}

// Stub for now; real implementation will depend on header format later
export function decompress(content: string): string {
  return content;
}
