"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import { sepolia } from "@wagmi/chains";

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
            logo: "https://your-logo-url",
          },
        }}
      >
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </PrivyProvider>
    </html>
  );
}
