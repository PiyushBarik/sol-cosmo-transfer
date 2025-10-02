"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { TokenFeedItem } from "@/types/token";
import { useToast } from "@/components/Toast";
import { Card } from "@/components/Card";

const MAX_TOKENS = 500;

export default function CosmoPage(): React.JSX.Element {
  const [tokens, setTokens] = useState<TokenFeedItem[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "open" | "closed" | "error"
  >("closed");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"time" | "symbol" | "name">("time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectDelay = useRef(1500);
  const isMountedRef = useRef(true);
  const { push: showToast } = useToast();

  const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

  const connectWebSocket = useCallback(() => {
    if (!wsUrl) {
      console.error("NEXT_PUBLIC_WS_URL environment variable is required");
      setConnectionStatus("error");
      setIsLoading(false);
      return;
    }

    console.log("Connecting to WebSocket...");

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus("connecting");

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setConnectionStatus("open");
        setIsLoading(false);
        setReconnectAttempts(0);
        reconnectDelay.current = 1500;
        // Only show toast if component is still mounted
        if (isMountedRef.current) {
          showToast("Connected to token feed", "ok");
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle different possible data formats
          let tokenData = null;

          if (data.type === "token_feed" && data.data) {
            tokenData = data.data;
          } else if (data.mint) {
            // Direct token data without wrapper
            tokenData = data;
          } else if (data.token) {
            // Token data in a 'token' property
            tokenData = data.token;
          }

          if (tokenData && tokenData.mint) {
            // Add createdAt timestamp if it doesn't exist
            if (!tokenData.createdAt) {
              tokenData.createdAt = new Date().toISOString();
            }

            setTokens((prevTokens) => {
              // Check if token already exists (by mint address)
              const existingIndex = prevTokens.findIndex(
                (token) => token.mint === tokenData.mint
              );

              if (existingIndex !== -1) {
                return prevTokens;
              }

              // Add new token to the beginning and limit array size
              const updated = [tokenData, ...prevTokens].slice(0, MAX_TOKENS);

              // Force a re-render by returning a new array reference
              return [...updated];
            });
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log(
          "WebSocket closed:",
          event.code,
          event.reason || "No reason given"
        );
        setConnectionStatus("closed");
        wsRef.current = null;

        // Schedule reconnection with exponential backoff
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect...");
          setReconnectAttempts((prev) => prev + 1);
          connectWebSocket();
        }, reconnectDelay.current);

        // Increase delay for next reconnection (max 30s)
        reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
        setIsLoading(false);
        // Only show error toast if we've already had a successful connection before and component is mounted
        if (reconnectAttempts > 0 && isMountedRef.current) {
          showToast("Connection error occurred", "err");
        }
      };
    } catch (error) {
      setConnectionStatus("error");
      setIsLoading(false);
      console.error("Failed to create WebSocket connection:", error);
    }
  }, [wsUrl, showToast, reconnectAttempts]);

  useEffect(() => {
    // Add a small delay on initial page load to prevent immediate connection errors
    const timer = setTimeout(() => {
      connectWebSocket();
    }, 500);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const sortedTokens = React.useMemo(() => {
    return [...tokens].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "symbol":
          aValue = a.symbol || "";
          bValue = b.symbol || "";
          break;
        case "name":
          aValue = a.name || "";
          bValue = b.name || "";
          break;
        case "time":
        default:
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [tokens, sortBy, sortOrder]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "open":
        return (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
        );
      case "connecting":
        return (
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Connecting</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">Error</span>
          </div>
        );
      case "closed":
      default:
        return (
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            <span className="text-sm font-medium">Disconnected</span>
          </div>
        );
    }
  };

  const getSortIcon = (column: typeof sortBy) => {
    if (sortBy !== column) {
      return (
        <svg
          className="w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    return sortOrder === "asc" ? (
      <svg
        className="w-4 h-4 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Cosmo Token Feed
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Live stream of new tokens from the Solana ecosystem
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {tokens.length} / {MAX_TOKENS} tokens
              </div>
              {getStatusIcon()}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Total Tokens
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {tokens.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Connection
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize">
                      {connectionStatus}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Latest Token
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {tokens[0]?.createdAt
                        ? new Date(tokens[0].createdAt).toLocaleTimeString()
                        : tokens.length > 0
                        ? "Just now"
                        : "--:--"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Token Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-6">
                      <button
                        onClick={() => handleSort("symbol")}
                        className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Symbol
                        {getSortIcon("symbol")}
                      </button>
                    </th>
                    <th className="text-left py-3 px-6">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Name
                        {getSortIcon("name")}
                      </button>
                    </th>
                    <th className="text-left py-3 px-6">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        Mint Address
                      </span>
                    </th>
                    <th className="text-left py-3 px-6">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        Logo
                      </span>
                    </th>
                    <th className="text-left py-3 px-6">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        Decimals
                      </span>
                    </th>
                    <th className="text-left py-3 px-6">
                      <button
                        onClick={() => handleSort("time")}
                        className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Created
                        {getSortIcon("time")}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <svg
                              className="w-8 h-8 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-1">
                              No tokens yet
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                              Waiting for new tokens to appear in the feed...
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedTokens.map((token) => (
                      <tr
                        key={token.mint}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">
                            {token.symbol || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-700 dark:text-slate-200 max-w-xs truncate block">
                            {token.name || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(token.mint)
                            }
                            className="font-mono text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors max-w-xs truncate block"
                            title={`Click to copy: ${token.mint}`}
                          >
                            {token.mint}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          {token.logo ? (
                            <Image
                              src={token.logo}
                              alt={token.symbol || "Token"}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                              <span className="text-xs text-slate-500">?</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-700 dark:text-slate-200">
                            {token.decimals ?? "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-600 dark:text-slate-400 text-sm">
                            {token.createdAt
                              ? new Date(token.createdAt).toLocaleTimeString()
                              : "Just received"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Error State */}
          {connectionStatus === "error" && (
            <Card
              variant="bordered"
              className="mt-6 border-red-200 dark:border-red-800"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold">Connection Error</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Failed to connect to the token feed. Retrying
                      automatically...
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="mt-6">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                      Connecting to Token Feed
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Establishing connection to the live data stream...
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
