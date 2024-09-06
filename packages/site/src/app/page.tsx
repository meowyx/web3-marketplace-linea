"use client"; // Mark this page as a Client Component

import { CubeIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useItems } from "@/app/hooks/useItems"; // Make sure the path is correct
import { ConnectWalletButton } from "../app/components/ConnectButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AvailableItems from "./components/AvailableItems";
import OwnedItems from "./components/OwnedItems";

export default function Home() {
  const { items, ownedItems, listItem, purchaseItem, address } = useItems();
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">
        <span>
          <CubeIcon className="mr-2 h-4 w-4" /> Marketplace
        </span>
      </h1>
      <span className="flex justify-end">
        <ConnectWalletButton />
      </span>

      {/* Listing a new item */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">List a New Item</h2>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="border p-2 flex-1"
          />
          <Input
            type="text"
            placeholder="Price in ETH"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
            className="border p-2 flex-1"
          />
          <Button
            variant="outline"
            onClick={() => listItem(newItemName, newItemPrice)}
            className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2 px-4 rounded duration-200 hover:shadow-xl"
          >
            List Item
          </Button>
        </div>
      </section>

      {/* Available items */}
      <AvailableItems
        items={items}
        address={address}
        onPurchase={purchaseItem}
      />

      {/* Owned items */}
      <OwnedItems ownedItems={ownedItems} />
    </main>
  );
}
