// src/components/Web3Provider.tsx
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, polygon } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const projectId = 'c40802857b9946910bc34e29cde5baf3'

const networks = [mainnet, arbitrum, polygon]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

const metadata = {
  name: 'Spike Labs',
  description: 'AI Workplace for Game Devs',
  url: 'https://spikelabs.vercel.app', // Must match your domain
  icons: ['https://spikelabs.vercel.app/google-thumbnail.png']
}

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true // Optional
  },
  themeMode: 'dark' // Matches your UI
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}