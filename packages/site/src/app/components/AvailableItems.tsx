import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AvailableItems({
  items,
  address,
  onPurchase,
}: {
  items: any[];
  address: string | undefined;
  onPurchase: (id: number, price: string) => void;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Available Items</h2>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <Card className="p-4 sm:p-6" key={index}>
            <li key={item.id} className="p-4">
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Price:</strong> {item.price} ETH
              </p>
              <p className="text-sm sm:text-base break-words">
                <strong>Owner:</strong> {item.owner}
              </p>
              {!item.isSold &&
                item.owner.toLowerCase() !== address?.toLowerCase() && (
                  <Button
                    variant="outline"
                    onClick={() => onPurchase(item.id, item.price)}
                    className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white py-2 px-4 rounded duration-200 hover:shadow-xl"
                  >
                    Purchase
                  </Button>
                )}
            </li>
          </Card>
        ))}
      </ul>
    </section>
  );
}
