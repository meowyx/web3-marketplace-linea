import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketplaceModule = buildModule("MarketplaceModule", (m) => {
  // Deploy the Marketplace contract
  const marketplace = m.contract("Marketplace");

  // Return the deployed contract instance
  return { marketplace };
});

export default MarketplaceModule;
