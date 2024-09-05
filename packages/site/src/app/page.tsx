"use client";

import { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { CONTRACT_ADDRESS, ABI as ABI_STRING_ARRAY } from "../../constants";
import { client } from "@/providers/WagmiProvider";
import { ConnectWalletButton } from "../app/components/ConnectButton";

export default function Home() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [items, setItems] = useState<any[]>([]);
  const [ownedItems, setOwnedItems] = useState<any[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  useEffect(() => {
    loadItems();
    loadOwnedItems();
  }, []);

  const loadItems = async () => {
    try {
      const itemCount = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI_STRING_ARRAY,
        functionName: "itemCount",
      });

      for (let i = 1; i <= Number(itemCount); i++) {
        const item = (await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI_STRING_ARRAY,
          functionName: "items",
          args: [i],
        })) as Array<any>;

        setItems((prevItems) => [
          ...prevItems,
          {
            id: item[0],
            name: item[1],
            price: formatUnits(item[2], 18),
            seller: item[3],
            owner: item[4],
            isSold: item[5],
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  const loadOwnedItems = async () => {
    try {
      if (!address) return;
      const ownedItemIds = (await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI_STRING_ARRAY,
        functionName: "getItemsByOwner",
        args: [address],
      })) as number[];

      for (const itemId of ownedItemIds) {
        const item = await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI_STRING_ARRAY,
          functionName: "items",
          args: [itemId],
        });
        setOwnedItems((prevItems) => [
          ...prevItems,
          {
            id: item[0],
            name: item[1],
            price: formatUnits(item[2], 18),
            seller: item[3],
            owner: item[4],
            isSold: item[5],
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading owned items:", error);
    }
  };

  const listItem = async () => {
    try {
      if (!walletClient) return;
      const { request } = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: ABI_STRING_ARRAY,
        functionName: "listItem",
        args: [newItemName, parseUnits(newItemPrice, 18)],
        account: address,
      });
      await walletClient.writeContract(request);
      loadItems();
    } catch (error) {
      console.error("Error listing item:", error);
    }
  };

  const purchaseItem = async (id: number, price: string) => {
    try {
      if (!walletClient) return;
      const { request } = await client.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: ABI_STRING_ARRAY,
        functionName: "purchaseItem",
        args: [id],
        account: address,
        value: parseUnits(price, 18),
      });
      await walletClient.writeContract(request);
      loadItems();
      loadOwnedItems();
    } catch (error) {
      console.error("Error purchasing item:", error);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <ConnectWalletButton />
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">List a New Item</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="border p-2 flex-1"
          />
          <input
            type="text"
            placeholder="Price in ETH"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="border p-2 flex-1"
          />
          <button onClick={listItem} className="bg-blue-500 text-white p-2">
            List Item
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Available Items</h2>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="border p-4">
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Price:</strong> {item.price} ETH
              </p>
              <p>
                <strong>Owner:</strong> {item.owner}
              </p>
              {!item.isSold &&
                item.owner.toLowerCase() !== address?.toLowerCase() && (
                  <button
                    onClick={() => purchaseItem(item.id, item.price)}
                    className="bg-green-500 text-white p-2 mt-2"
                  >
                    Purchase
                  </button>
                )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Your Owned Items</h2>
        <ul className="space-y-4">
          {ownedItems.map((item) => (
            <li key={item.id} className="border p-4">
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Price:</strong> {item.price} ETH
              </p>
              <p>
                <strong>Owner:</strong> {item.owner}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
