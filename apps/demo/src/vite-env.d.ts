/// <reference types="vite/client" />

declare module 'lz-string' {
  function compressToBase64(input: string): string;
  function decompressFromBase64(input: string): string;

  function compressToUTF16(input: string): string;
  function decompressFromUTF16(compressed: string): string;

  function compressToUint8Array(uncompressed: string): Uint8Array;
  function decompressFromUint8Array(compressed: Uint8Array): string;

  function compressToEncodedURIComponent(input: string): string;
  function decompressFromEncodedURIComponent(compressed: string): string;

  function compress(input: string): string;
  function decompress(compressed: string): string;
}

declare const __BUILD_TIME__: string;
