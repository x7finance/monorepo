/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import { useEffect, useState } from "react";
import type { Signer } from "@xmtp/xmtp-js";
import { Client } from "@xmtp/xmtp-js";
import { keccak256 } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { Button } from "@x7/ui/button";
import { Input } from "@x7/ui/input";
import { ScrollArea } from "@x7/ui/scroll-area";

interface XMTPChatProps {
  contractAddress: string;
}

export function XMTPChat({ contractAddress }: XMTPChatProps) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    async function initXMTP() {
      if (!walletClient || !address) {
        console.log("No wallet or address");
        return;
      }

      try {
        // Try creating client with minimal config first
        console.log("Creating client...");
        const signer: Signer = {
          getAddress: async () => address,
          signMessage: async (message: string | Uint8Array) => {
            const messageToSign =
              typeof message === "string"
                ? message
                : new TextDecoder().decode(message);

            const signature = await walletClient.signMessage({
              message: messageToSign,
              account: address,
            });

            return signature;
          },
        };
        const xmtp = await Client.create(signer, {
          env: "production",
        });
        console.log("Client created successfully");

        // Initialize conversation with explicit error handling
        const conversationId = keccak256(
          new TextEncoder().encode(`${contractAddress}-chat`),
        ).slice(2, 35);
        console.log("Conversation ID:", conversationId);

        const conversation =
          await xmtp.conversations.newConversation(conversationId);
        console.log("Conversation created");

        const history = await conversation.messages();
        console.log("Messages loaded:", history.length);

        setMessages(history);
        setClient(xmtp);
      } catch (error) {
        console.error("Detailed XMTP error:", {
          error,
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    }

    initXMTP();
  }, [walletClient, address, contractAddress]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!client || !newMessage.trim()) return;

    try {
      const conversationId = keccak256(
        new TextEncoder().encode(`${contractAddress}-chat`),
      ).slice(2, 35);
      const conversation =
        await client.conversations.newConversation(conversationId);
      await conversation.send(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  if (!address) {
    return (
      <div className="py-8 text-center">
        <p>Please connect your wallet to participate in the chat</p>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] flex-col">
      <h3 className="mb-4 text-lg font-bold">Community Chat</h3>

      <ScrollArea className="mb-4 flex-1">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`rounded-lg p-2 ${
                msg.senderAddress === address
                  ? "ml-auto bg-blue-100"
                  : "bg-gray-100"
              } max-w-[80%]`}
            >
              <p className="text-sm text-gray-600">
                {msg.senderAddress.slice(0, 6)}...{msg.senderAddress.slice(-4)}
              </p>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
