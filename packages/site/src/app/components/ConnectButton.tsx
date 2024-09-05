"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { PersonIcon, ExitIcon } from "@radix-ui/react-icons";

export const ConnectWalletButton = () => {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
      return;
    }
    const connector = connectors[0];
    connect({ connector });
  };

  return (
    <Button
      onClick={handleConnect}
      variant="outline"
      className=" border-2 border-darkBlack text-darkBlack hover:bg-darkBlack hover:text-lightWhite py-2 px-4 rounded duration-200 hover:shadow-xl"
    >
      {isConnected ? (
        <>
          <ExitIcon className="mr-2 h-4 w-4" />
          Disconnect
        </>
      ) : (
        <>
          <PersonIcon className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};
