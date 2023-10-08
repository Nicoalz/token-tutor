"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import "./globals.css";
import { XMTPProvider } from "@xmtp/react-sdk";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import { sepolia, mainnet } from "@wagmi/chains";
import Web3Provider from "../components/web3-provider";
import XMTP from "@/components/XMTP";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          loginMethods: ["email", "wallet"],
          supportedChains: [sepolia],
          appearance: {
            theme: "light",
            accentColor: "#676FFF",
            logo: "/token-tutor.png",
          },
        }}
      >
        <XMTPProvider>
          <body className={inter.className}>
            <Header />
            <Web3Provider>
              {children}
              <XMTP />
            </Web3Provider>
          </body>
        </XMTPProvider>
      </PrivyProvider>
    </html>
  );
}
