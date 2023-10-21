"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import "./globals.css";
import { XMTPProvider } from "@xmtp/react-sdk";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import {
  sepolia,
  mainnet,
  goerli,
  scrollTestnet,
  polygonZkEvmTestnet,
  mantleTestnet,
  scrollSepolia,
} from "@wagmi/chains";
import Web3Provider from "../components/web3-provider";
import XMTPChat from "@/components/XMTPChat";
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
          supportedChains: [
            goerli,
            scrollSepolia,
            polygonZkEvmTestnet,
            mantleTestnet,
          ],
          appearance: {
            theme: "light",
            accentColor: "#676FFF",
            logo: "/token-tutor-black.png",
          },
        }}
      >
        <head>
          <title>Token Tutor - Your new web3 mentoring platform</title>
          <meta
            name="title"
            content="Token Tutor - Your new web3 mentoring platform"
          />
          <meta
            name="description"
            content="Tokenize Time, Maximize Learning, Build the Future"
          />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://token-tutor.vercel.app/" />
          <meta
            property="og:title"
            content="Token Tutor - Your new web3 mentoring platform"
          />
          <meta
            property="og:description"
            content="Tokenize Time, Maximize Learning, Build the Future"
          />
          <meta
            property="og:image"
            content="https://token-tutor.vercel.app/token-tutor-official-cover.png"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://token-tutor.vercel.app/" />
          <meta
            property="twitter:title"
            content="Token Tutor - Your new web3 mentoring platform"
          />
          <meta
            property="twitter:description"
            content="Tokenize Time, Maximize Learning, Build the Future"
          />
          <meta
            property="twitter:image"
            content="https://token-tutor.vercel.app/token-tutor-official-cover.png"
          />
        </head>
        <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
          <XMTPProvider>
            <body className={inter.className}>
              <Header />
              <Web3Provider>
                {children}
                <XMTPChat />
                <Toaster />
              </Web3Provider>
            </body>
          </XMTPProvider>
        </PrivyWagmiConnector>
      </PrivyProvider>
    </html>
  );
}
