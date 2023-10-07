import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, DoorOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./loading";

export function LoginButton() {
  const { login, logout, ready, authenticated } = usePrivy();

  const { wallets } = useWallets();
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    if (wallets.length > 0) setWallet(wallets[0].address);
  }, [wallets]);

  return (
    <>
      {ready && authenticated && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              {wallet.slice(0, 6) + "..." + wallet.slice(-4)}
              <ChevronDownIcon className="w-5 h-5 ml-2 bg-black/5 p-0.5 rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>My Profile</DropdownMenuItem>
              <DropdownMenuItem>My Courses</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="font-bold text-destructive"
              >
                Log out
                <DoorOpen className="w-5 h-5 ml-2" />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {ready && !authenticated && (
        <Button variant={"secondary"} onClick={login}>
          Connect Wallet
        </Button>
      )}
      {!ready && <Loading />}
    </>
  );
}
