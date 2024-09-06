import { Card } from "@/components/ui/card";

export default function OwnedItems({ ownedItems }: { ownedItems: any[] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Your Owned Items</h2>
      <ul className="space-y-4">
        {ownedItems.map((item, index) => (
          <Card key={index}>
            <li key={item.id} className="p-4">
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
          </Card>
        ))}
      </ul>
    </section>
  );
}
