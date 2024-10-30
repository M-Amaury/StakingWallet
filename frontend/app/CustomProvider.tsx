'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {getDefaultConfig,RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {arbitrumSepolia, hardhat} from 'wagmi/chains';
import {QueryClientProvider,QueryClient} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'App',
  projectId: 'accddf1c6272a93662df41f7bfa710df',
  chains: [arbitrumSepolia, hardhat],
  ssr: true,
});

const queryClient = new QueryClient();
const CustomProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({...darkTheme.accentColors.blue})}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default CustomProvider;
