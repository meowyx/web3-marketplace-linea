"use client"; // Ensure this hook is marked as a client component

import { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { CONTRACT_ADDRESS, ABI as ABI_STRING_ARRAY } from "../constants";
import { client } from "@/providers/WagmiProvider";

type Item = {
  id: number;
  name: string;
  price: string;
  seller: string;
  owner: string;
  isSold: boolean;
};

export const useItems = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [items, setItems] = useState<Item[]>([]);
  const [ownedItems, setOwnedItems] = useState<Item[]>([]);

  // Load all items from the contract
  const loadItems = async () => {
    try {
      const itemCount = await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI_STRING_ARRAY,
        functionName: "itemCount",
      });

      const newItems: Item[] = [];
      for (let i = 1; i <= Number(itemCount); i++) {
        const item = (await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI_STRING_ARRAY,
          functionName: "items",
          args: [i],
        })) as Array<any>;

        newItems.push({
          id: Number(item[0]),
          name: item[1],
          price: formatUnits(item[2], 18),
          seller: item[3],
          owner: item[4],
          isSold: item[5],
        });
      }

      setItems(newItems);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  // Load owned items of the current user
  const loadOwnedItems = async () => {
    try {
      if (!address) return;
      const ownedItemIds = (await client.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI_STRING_ARRAY,
        functionName: "getItemsByOwner",
        args: [address],
      })) as number[];

      const newOwnedItems: Item[] = [];
      for (const itemId of ownedItemIds) {
        const item = await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI_STRING_ARRAY,
          functionName: "items",
          args: [itemId],
        });
        newOwnedItems.push({
          id: Number(item[0]),
          name: item[1],
          price: formatUnits(item[2], 18),
          seller: item[3],
          owner: item[4],
          isSold: item[5],
        });
      }

      setOwnedItems(newOwnedItems);
    } catch (error) {
      console.error("Error loading owned items:", error);
    }
  };

  // List a new item
  const listItem = async (newItemName: string, newItemPrice: string) => {
    try {
      if (!walletClient || !address) return;
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

  // Purchase an item
  const purchaseItem = async (id: number, price: string) => {
    try {
      if (!walletClient || !address) return;
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

  useEffect(() => {
    if (address) {
      loadItems();
      loadOwnedItems();
    }
  }, [address]);

  return { items, ownedItems, listItem, purchaseItem, address };
};
