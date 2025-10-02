import { Connection, Transaction } from "@solana/web3.js";

export function getConnection(): Connection {
  const rpc = process.env.NEXT_PUBLIC_HELIUS_RPC;
  if (!rpc) {
    throw new Error("NEXT_PUBLIC_HELIUS_RPC environment variable is required");
  }
  return new Connection(rpc, "confirmed");
}

export interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: {
    toBase58(): string;
  };
  connect(): Promise<{ publicKey: { toBase58(): string } }>;
  disconnect(): Promise<void>;
  signAndSendTransaction(
    transaction: Transaction
  ): Promise<{ signature: string }>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  request(args: { method: string; params?: unknown }): Promise<unknown>;
}

export function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;

  const provider = (window as { solana?: PhantomProvider }).solana;
  return provider?.isPhantom ? provider : null;
}
