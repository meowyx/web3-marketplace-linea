// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;
// This sets the version of Solidity being used, ensuring compatibility with specific language features.

contract Marketplace {
    // Define a structure to represent an item in the marketplace.
    struct Item {
        uint id; // Unique identifier for the item
        string name; // Name of the item
        uint price; // Price of the item in wei (smallest unit of ether)
        address payable seller; // Address of the seller, set as payable so it can receive funds
        address owner; // Address of the current owner (initially the seller)
        bool isSold; // Tracks if the item has been sold
    }

    // Counter to track the number of items in the marketplace
    uint public itemCount = 0;

    // Mapping of item IDs to their respective Item structures
    mapping(uint => Item) public items;

    // Mapping of user addresses to an array of item IDs they own
    mapping(address => uint[]) public ownedItems;

    // Function to list an item for sale on the marketplace
    function listItem(string memory _name, uint _price) public {
        require(_price > 0, "Price must be greater than zero");
        // Ensure that the price of the item is greater than zero

        itemCount++; // Increment the item counter to assign a new ID to the item

        // Create a new item and store it in the `items` mapping using the current itemCount as the key
        items[itemCount] = Item(itemCount, _name, _price, payable(msg.sender), msg.sender, false);

        // Add the new item to the list of items owned by the seller
        ownedItems[msg.sender].push(itemCount);
    }

    // Function to purchase an item from the marketplace
    function purchaseItem(uint _id) public payable {
        // Retrieve the item from the `items` mapping
        Item storage item = items[_id];

        // Ensure the item exists and hasn't already been sold
        require(_id > 0 && _id <= itemCount, "Item does not exist");
        require(msg.value == item.price, "Incorrect price");
        require(!item.isSold, "Item already sold");

        // Prevent the seller from buying their own item
        require(msg.sender != item.seller, "Seller cannot buy their own item");

        item.isSold = true; // Mark the item as sold

        // Transfer the payment to the seller
        item.seller.transfer(msg.value);

        // Transfer ownership of the item from the seller to the buyer
        _transferOwnership(_id, item.seller, msg.sender);
    }

    // Internal function to handle transferring ownership of an item
    function _transferOwnership(uint _id, address _from, address _to) internal {
        // Retrieve the item from the `items` mapping
        Item storage item = items[_id];

        // Update the item's owner to the new owner
        item.owner = _to;

        // Find and remove the item from the previous owner's list of owned items
        uint[] storage fromItems = ownedItems[_from];
        for (uint i = 0; i < fromItems.length; i++) {
            if (fromItems[i] == _id) {
                fromItems[i] = fromItems[fromItems.length - 1]; // Replace with the last item in the array
                fromItems.pop(); // Remove the last item (previously copied)
                break; // Exit the loop once the item is found
            }
        }

        // Add the item to the new owner's list of owned items
        ownedItems[_to].push(_id);
    }

    // Function to allow an owner to transfer their item to someone else
    function transferItem(uint _id, address _to) public {
        Item storage item = items[_id]; // Retrieve the item from the mapping

        // Ensure the item exists and the caller is the current owner
        require(_id > 0 && _id <= itemCount, "Item does not exist");
        require(msg.sender == item.owner, "You do not own this item");

        // Transfer ownership to the new address
        _transferOwnership(_id, msg.sender, _to);
    }

    // Function to retrieve the list of items owned by a specific address
    function getItemsByOwner(address _owner) public view returns (uint[] memory) {
        return ownedItems[_owner]; // Return the array of item IDs owned by the given address
    }
}
