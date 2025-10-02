import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

export function isValidSolAddress(addr: string): boolean {
  if (!addr || typeof addr !== "string") return false;

  try {
    const pubkey = new PublicKey(addr);
    // Verify round-trip encoding to ensure it's a valid base58 address
    return pubkey.toBase58() === addr;
  } catch {
    return false;
  }
}

export function fmt(n: number, d = 6): string {
  return n.toFixed(d);
}
