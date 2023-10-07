import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./logo";
import { Button } from "./ui/button";

import { LoginButton } from "./loginBtn";

export default function Header() {
  const router = useRouter();

  return (
    <div className="flex p-3 px-32  w-full justify-between items-center bg-white/25 shadow-md shadow-black/5">
      <Link
        href="/"
        className="flex items-center space-x-2 font-bold w-44 text-xl"
      >
        <Logo width={120} height={120} />
      </Link>
      <div className="flex gap-3">
        <Button variant={"link"} onClick={() => router.push("/learn")}>
          Learn
        </Button>
        <Button variant={"link"} onClick={() => router.push("/loans")}>
          Teach
        </Button>
      </div>

      <LoginButton />
    </div>
  );
}
