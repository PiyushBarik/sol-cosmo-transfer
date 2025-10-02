"use client";

import React, { useState, useEffect } from "react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import {
  getConnection,
  getPhantomProvider,
  PhantomProvider,
} from "@/lib/solana";
import { isValidSolAddress, solToLamports } from "@/lib/util";
import { useToast } from "@/components/Toast";
import { WalletBadge } from "@/components/WalletBadge";
import { Card } from "@/components/Card";

interface FormData {
  toAddress: string;
  amount: string;
}

interface FormErrors {
  toAddress?: string;
  amount?: string;
}

export default function TransferPage(): React.JSX.Element {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [form, setForm] = useState<FormData>({ toAddress: "", amount: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUsdEstimate, setShowUsdEstimate] = useState(false);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [lastTxSignature, setLastTxSignature] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const { push: showToast } = useToast();

  useEffect(() => {
    const initializeProvider = (): void => {
      const phantom = getPhantomProvider();
      if (phantom) {
        setProvider(phantom);
        // Check if already connected
        phantom
          .connect()
          .then((response) => {
            setConnected(true);
            setWalletAddress(response.publicKey.toBase58());
          })
          .catch(() => {
            // User hasn't connected before or rejected
          });
      }
    };

    initializeProvider();
  }, []);

  const fetchBalance = React.useCallback(async (): Promise<void> => {
    if (!walletAddress) return;

    setLoadingBalance(true);
    try {
      const connection = getConnection();
      const publicKey = new PublicKey(walletAddress);
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / 1e9); // Convert lamports to SOL
    } catch (error) {
      console.error("Error fetching balance:", error);
      showToast("Failed to fetch wallet balance", "err");
    } finally {
      setLoadingBalance(false);
    }
  }, [walletAddress, showToast]);

  useEffect(() => {
    if (connected && walletAddress) {
      fetchBalance();
    }
  }, [connected, walletAddress, fetchBalance]);

  const connectWallet = async (): Promise<void> => {
    if (connected) {
      await disconnectWallet();
      return;
    }

    if (!provider) {
      const phantom = getPhantomProvider();
      if (phantom) {
        setProvider(phantom);
      } else {
        showToast("Phantom wallet not found. Please install Phantom.", "err");
        return;
      }
    }

    const currentProvider = provider || getPhantomProvider();
    if (!currentProvider) {
      showToast("Phantom wallet not found. Please install Phantom.", "err");
      return;
    }

    try {
      console.log("Attempting to connect...");
      const response = await currentProvider.connect();
      console.log("Connect response:", response);

      setConnected(true);
      setWalletAddress(response.publicKey.toBase58());
      showToast("Wallet connected successfully", "ok");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      showToast(`Failed to connect wallet: ${error}`, "err");
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    if (!provider) return;

    try {
      await provider.disconnect();
      setConnected(false);
      setWalletAddress("");
      setForm({ toAddress: "", amount: "" });
      setErrors({});
      setBalance(null);
      setLastTxSignature(""); // Clear any previous transaction success messages
      showToast("Wallet disconnected", "ok");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      showToast("Failed to disconnect wallet", "err");
    }
  };

  const fetchSolPrice = async (): Promise<void> => {
    const priceUrl = process.env.NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE_URL;
    if (!priceUrl) {
      showToast("Price URL not configured", "err");
      return;
    }

    setLoadingPrice(true);
    try {
      const response = await fetch(priceUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const price = data?.solana?.usd;
      if (typeof price === "number") {
        setSolPrice(price);
        setShowUsdEstimate(true);
      } else {
        throw new Error("Invalid price data received");
      }
    } catch (error) {
      console.error("Error fetching SOL price:", error);
      showToast("Failed to fetch SOL price", "err");
    } finally {
      setLoadingPrice(false);
    }
  };

  const copyToClipboard = async (
    text: string,
    label: string
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`, "ok");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      showToast("Failed to copy to clipboard", "err");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.toAddress.trim()) {
      newErrors.toAddress = "Recipient address is required";
    } else if (!isValidSolAddress(form.toAddress.trim())) {
      newErrors.toAddress = "Invalid Solana address";
    }

    if (!form.amount.trim()) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(form.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Amount must be a positive number";
      } else if (balance !== null) {
        // Account for network fee (~0.000005 SOL) and minimum rent-exempt balance (~0.00089 SOL)
        const networkFee = 0.000005;
        const minRentExempt = 0.00089;
        const totalRequired = amount + networkFee + minRentExempt;

        if (amount > balance) {
          newErrors.amount = `Insufficient balance. You have ${balance.toFixed(
            4
          )} SOL`;
        } else if (totalRequired > balance) {
          const maxTransferable = Math.max(
            0,
            balance - networkFee - minRentExempt
          );
          newErrors.amount = `Amount too high. After fees and rent, you can transfer max ${maxTransferable.toFixed(
            6
          )} SOL`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTransfer = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm() || !provider || !connected) {
      return;
    }

    setIsSubmitting(true);

    try {
      const connection = getConnection();
      const fromPubkey = new PublicKey(walletAddress);
      const toPubkey = new PublicKey(form.toAddress.trim());
      const lamports = solToLamports(parseFloat(form.amount));

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      const signedTransaction = await provider.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      const strategy: TransactionConfirmationStrategy = {
        signature,
        blockhash,
        lastValidBlockHeight: (await connection.getLatestBlockhash())
          .lastValidBlockHeight,
      };

      await connection.confirmTransaction(strategy);

      setLastTxSignature(signature);
      setForm({ toAddress: "", amount: "" });
      showToast(
        `Successfully sent ${form.amount} SOL to ${form.toAddress.slice(
          0,
          8
        )}...`,
        "ok"
      );

      // Refresh balance
      await fetchBalance();
    } catch (error) {
      console.error("Transfer failed:", error);
      showToast(`Transfer failed: ${error}`, "err");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUsdEstimate = (): string => {
    if (!solPrice || !form.amount) return "";
    const amount = parseFloat(form.amount);
    if (isNaN(amount)) return "";
    return `≈ $${(amount * solPrice).toFixed(2)} USD`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            SOL Transfer
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Send SOL to any Solana address using your Phantom wallet on Devnet
          </p>
        </div>

        {/* Wallet Connection */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Wallet Connection
              </h2>
              {connected && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Connected</span>
                </div>
              )}
            </div>

            {connected ? (
              <div className="space-y-4">
                <WalletBadge address={walletAddress} />

                {/* Balance Display */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">
                      Balance:
                    </span>
                    <div className="text-right">
                      {loadingBalance ? (
                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      ) : (
                        <div>
                          <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {balance !== null
                              ? `${balance.toFixed(4)} SOL`
                              : "Error loading"}
                          </span>
                          {balance !== null && solPrice && (
                            <div className="text-sm text-slate-500">
                              ≈ ${(balance * solPrice).toFixed(2)} USD
                            </div>
                          )}
                          {balance !== null && (
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <span>
                                Max transferable:{" "}
                                {Math.max(
                                  0,
                                  balance - 0.000005 - 0.00089
                                ).toFixed(6)}{" "}
                                SOL
                              </span>
                              <div className="group relative">
                                <svg
                                  className="w-3 h-3 text-slate-400 cursor-help"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  Accounts for network fees and rent-exempt
                                  minimum
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={disconnectWallet}
                  className="w-full px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Connect Phantom Wallet
              </button>
            )}
          </div>
        </Card>

        {/* Transfer Form */}
        {connected && (
          <Card className="mb-6">
            <form onSubmit={handleTransfer} className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Send SOL
              </h2>

              {/* Recipient Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={form.toAddress}
                  onChange={(e) =>
                    handleInputChange("toAddress", e.target.value)
                  }
                  placeholder="Enter Solana address"
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.toAddress
                      ? "border-red-500 dark:border-red-400"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                />
                {errors.toAddress && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.toAddress}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount (SOL)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={form.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    placeholder="0.0000"
                    className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.amount
                        ? "border-red-500 dark:border-red-400"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  />
                  {balance !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        const networkFee = 0.000005;
                        const minRentExempt = 0.00089;
                        const maxTransferable = Math.max(
                          0,
                          balance - networkFee - minRentExempt
                        );
                        handleInputChange("amount", maxTransferable.toFixed(6));
                      }}
                      className="absolute right-3 top-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      Max
                    </button>
                  )}
                </div>
                {errors.amount && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.amount}
                  </div>
                )}

                {/* USD Estimate */}
                {!showUsdEstimate && (
                  <button
                    type="button"
                    onClick={fetchSolPrice}
                    disabled={loadingPrice}
                    className="flex items-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    Show USD estimate
                    {loadingPrice && (
                      <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </button>
                )}
                {showUsdEstimate && getUsdEstimate() && (
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {getUsdEstimate()}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !form.toAddress || !form.amount}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Send SOL
                  </>
                )}
              </button>
            </form>
          </Card>
        )}

        {/* Last Transaction */}
        {lastTxSignature && (
          <Card
            variant="bordered"
            className="mb-6 border-green-200 dark:border-green-800"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 text-green-700 dark:text-green-300 mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <h3 className="font-semibold">Transaction Successful</h3>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <code className="text-sm text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {lastTxSignature.slice(0, 16)}...{lastTxSignature.slice(-16)}
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(lastTxSignature, "Transaction signature")
                  }
                  className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  aria-label="Copy transaction signature"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>

              <a
                href={`https://explorer.solana.com/tx/${lastTxSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View in Solana Explorer
              </a>
            </div>
          </Card>
        )}

        {/* Information */}
        <Card
          variant="bordered"
          className="border-blue-200 dark:border-blue-800"
        >
          <div className="p-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  Important Information
                </h3>
                <div className="text-blue-600 dark:text-blue-200 text-sm space-y-1">
                  <p>
                    <strong>Network:</strong> Solana Devnet
                  </p>
                  <p>
                    <strong>Requirements:</strong> Phantom wallet extension and
                    test SOL
                  </p>
                  <p>
                    <strong>Note:</strong> Make sure your Phantom wallet is set
                    to Devnet mode
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
