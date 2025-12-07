my-compression 
=======

A custom implementation of the Compression tool using huffman coding.


Supports compression and decompression of text files.

Installation 
--------------
Clone and link the tool globally:

    git clone https://github.com/your-username/mywc.git
    cd my-compression
    npm install
    npm run build
    npm link

Now you can use `my-compression` from anywhere in your terminal.

Usage 
--------
    my-compression <file-path> [options]

Example:

    my-compression src/test.txt

Output:

    FilePath: src/compressed-test.txt

Running Tests 
---------------
    npm test

Development 
--------------
    npm start
    npm run build

Uninstall 
-----------
    npm unlink
