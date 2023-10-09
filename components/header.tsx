import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./logo";
import { Button } from "./ui/button";

import { LoginButton } from "./loginBtn";

export default function Header() {
  const router = useRouter();

  return (
    <div className="flex py-3 px-32  w-full justify-between items-center bg-background shadow-md  border-b-white/10 border-b">
      <Link
        href="/"
        className="flex items-center space-x-2 font-bold w-44 text-xl"
      >
        <Logo width={100} height={100} />
      </Link>
      <div className="flex gap-3 w-36 justify-between">
        {/* <Button variant={"link"} onClick={() => router.push("/learn")}>
          Learn
        </Button>
        <Button variant={"link"} onClick={() => router.push("/loans")}>
          Teach
        </Button> */}
        {/* c est pas mieux les Link natif de next ? */}
        <Link
          className="text-primary underline-offset-4 hover:underline hover:text-secondary"
          href="/learn"
        >
          <p>Learn</p>
        </Link>
        <Link
          className="text-primary underline-offset-4 hover:underline hover:text-secondary"
          href="/teach"
        >
          <p>Teach</p>
        </Link>
      </div>

      <LoginButton />
    </div>
  );
}
