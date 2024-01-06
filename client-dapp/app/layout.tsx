"use client";
import { WagmiConfig, createConfig } from "wagmi";
import { polygonMumbai } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/instructionsComponent/navigation/navbar";

const config = createConfig(
  getDefaultConfig({
    chains: [polygonMumbai],
    // Required API Keys
    alchemyId: process.env.ALCHEMY_API_KEY,
    walletConnectProjectId: process.env.WALLETCONNECT_PROJ_ID!,

    // Required
    appName: "Player System Dapp"
  })
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <ConnectKitProvider mode="dark" theme="retro">
          <body>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "105vh" }}>
              <Navbar />
              <div style={{ flexGrow: 1 }}>{children}</div>
            </div>
          </body>
        </ConnectKitProvider>
      </WagmiConfig>
    </html>
  );
}
