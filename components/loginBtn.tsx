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
import { ChevronDownIcon, DoorOpen, User, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LoginButton() {
  const { login, logout, ready, authenticated } = usePrivy();
  const router = useRouter();
  const { wallets } = useWallets();
  const [wallet, setWallet] = useState("");
  const [chain, setChain] = useState("5" as string);

  const handleChangeChain = async (chainId: string) => {
    setChain(chainId);
    await wallets[0].switchChain(parseFloat(chainId));
  };

  useEffect(() => {
    if (wallets.length > 0) {
      setWallet(wallets[0].address);
      setChain(wallets[0].chainId.toString().split(":")[1]);
    }
  }, [wallets]);

  return (
    <div className="w-44 flex justify-end gap-3">
      {ready && authenticated && (
        <>
          <Select
            onValueChange={(chain) => handleChangeChain(chain)}
            value={chain}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Goerli" defaultValue={"5"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Goerli</SelectItem>
              <SelectItem value="534351">Scroll</SelectItem>
              <SelectItem value="1442">Polygon ZkEVM</SelectItem>
              <SelectItem value="5001">Mantle</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                {wallet.slice(0, 6) + "..." + wallet.slice(-4)}
                <ChevronDownIcon className="w-5 h-5 ml-2 bg-black/5 p-0.5 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-14">
              <DropdownMenuGroup className="flex flex-col gap-1">
                <DropdownMenuItem
                  onClick={() => router.push(`/profile/${wallet}`)}
                >
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/inventory`)}>
                  <WalletCards className="w-5 h-5 mr-2" />
                  Inventory
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={logout}
                  className="font-bold text-destructive"
                >
                  <DoorOpen className="w-5 h-5 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      {ready && !authenticated && (
        <Button variant={"secondary"} onClick={login}>
          Connect Wallet
        </Button>
      )}
      {!ready && <Loading />}
    </div>
  );
}
