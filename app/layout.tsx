"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import "./globals.css";
import { XMTPProvider } from "@xmtp/react-sdk";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import { sepolia, mainnet, goerli } from "@wagmi/chains";
import Web3Provider from "../components/web3-provider";
import XMTP from "@/components/XMTP";
import XMTPDemo from "@/components/XMTPDemo";
import { Toaster } from "@/components/ui/toaster";
import { WagmiConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";
const inter = Inter({ subsets: ["latin"] });

const configureChainsConfig = configureChains([mainnet], [publicProvider()]);

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
          supportedChains: [goerli],
          appearance: {
            theme: "light",
            accentColor: "#676FFF",
            logo: "/token-tutor-black.png",
          },
        }}
      >
        <head>
          <title>Token Tutor</title>
        </head>
        <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
          <XMTPProvider>
            <body className={inter.className}>
              <Header />
              <Web3Provider>
                {children}
                <XMTPDemo />
                <Toaster />
              </Web3Provider>
            </body>
          </XMTPProvider>
        </PrivyWagmiConnector>
      </PrivyProvider>
    </html>
  );
}
