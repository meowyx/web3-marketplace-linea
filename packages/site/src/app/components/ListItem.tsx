"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagicWandIcon } from "@radix-ui/react-icons";

export default function ListItem({
  onList,
}: {
  onList: (name: string, price: string) => void;
}) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const handleList = () => {
    onList(newItemName, newItemPrice);
    setNewItemName("");
    setNewItemPrice("");
  };

  return (
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
          onClick={handleList}
          className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2 px-4 rounded  duration-200 hover:shadow-xl"
        >
          <MagicWandIcon className="mr-2 h-4 w-4" />
          List Item
        </Button>
      </div>
    </section>
  );
}
