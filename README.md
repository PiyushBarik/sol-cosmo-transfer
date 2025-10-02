# Sol Cosmo Transfer

A production-ready Solana demo application featuring live token feeds and wallet transfers on Devnet. Built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

### 🌊 Live Token Feed (/cosmo)

- Real-time WebSocket connection to token feed backend
- Sortable table with symbol, name, mint address, logo, decimals, and creation time
- Professional UI with loading skeletons and responsive design
- Token deduplication and automatic reconnection
- Dark/light theme support with system preference detection

### 💸 SOL Transfer (/transfer)

- Phantom wallet integration for Devnet transactions
- Real-time balance display with USD estimates
- Form validation with comprehensive error handling
- Transaction confirmation with Solana Explorer links
- Responsive card-based layout with accessibility features

### 🎨 Enhanced UI/UX

- Modern gradient hero sections and interactive cards
- Professional navigation with active state indicators
- Theme toggle system (light/dark/system)
- Toast notification system with auto-dismiss
- Skeleton loading states and error boundaries
- Fully responsive design for mobile and desktop

## 🚀 Getting Started

### Prerequisites

1. **Install Phantom Wallet**

   - Download from [phantom.app](https://phantom.app/)
   - Switch to Devnet in wallet settings

2. **Get Devnet SOL**
   - Use Phantom's built-in faucet
   - Or visit [faucet.solana.com](https://faucet.solana.com)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sol-cosmo-transfer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory:

   ```env
   # Required: WebSocket URL for live token feed
   NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8080/connect

   # Required: Solana RPC endpoint (Helius Devnet)
   NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY

   # Optional: CoinGecko API for USD price estimates
   NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE_URL=https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS v4 with dark mode
- **Blockchain**: Solana Web3.js for wallet integration
- **Wallet**: Direct Phantom provider integration (no wallet adapter)
- **State**: React hooks with local state management
- **API**: RESTful and WebSocket connections

### Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── cosmo/          # Live token feed page
│   ├── transfer/       # SOL transfer page
│   ├── layout.tsx      # Root layout with navigation
│   └── page.tsx        # Home page
├── components/         # Reusable UI components
│   ├── Card.tsx        # Flexible card component
│   ├── NavBar.tsx      # Navigation with theme toggle
│   ├── ThemeToggle.tsx # Theme switching system
│   ├── Toast.tsx       # Notification system
│   ├── WalletBadge.tsx # Wallet address display
│   └── Skeleton.tsx    # Loading state components
├── lib/                # Utility libraries
│   ├── solana.ts       # Solana connection utilities
│   └── util.ts         # Helper functions
└── types/              # TypeScript type definitions
    └── token.ts        # Token interface types
```

### Key Features Implementation

#### WebSocket Connection Management

- Automatic reconnection with exponential backoff
- Ping/pong heartbeat for connection health
- Graceful error handling and user feedback
- Token deduplication to prevent duplicates

#### Phantom Wallet Integration

- Direct provider access without wallet adapters
- Transaction signing and confirmation
- Balance fetching with automatic updates
- Comprehensive error handling

#### Theme System

- System preference detection
- localStorage persistence
- Hydration-safe rendering
- Smooth transitions between themes

## 🔧 Configuration

### Environment Variables

| Variable                                 | Required | Description                            |
| ---------------------------------------- | -------- | -------------------------------------- |
| `NEXT_PUBLIC_WS_URL`                     | Yes      | WebSocket endpoint for live token feed |
| `NEXT_PUBLIC_SOLANA_RPC_URL`             | Yes      | Solana RPC endpoint (recommend Helius) |
| `NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE_URL` | No       | CoinGecko API for USD price data       |

### Backend Requirements

The application expects a WebSocket server running on the configured URL that sends messages in this format:

```json
{
  "type": "token_feed",
  "data": {
    "mint": "string",
    "symbol": "string",
    "name": "string",
    "logo": "string",
    "decimals": number,
    "createdAt": "ISO string"
  }
}
```

## 🎯 Usage

### Live Token Feed

1. Navigate to `/cosmo`
2. View real-time token data as it streams in
3. Click column headers to sort by different fields
4. Click mint addresses to copy to clipboard
5. Toggle between light and dark themes

### SOL Transfer

1. Navigate to `/transfer`
2. Connect your Phantom wallet
3. Enter recipient address and amount
4. Review USD estimate (if enabled)
5. Confirm transaction in Phantom
6. View transaction in Solana Explorer

## 🎨 Design System

### Theme Colors

- **Light Theme**: Clean whites and slate grays
- **Dark Theme**: Deep slate with purple/blue accents
- **Gradients**: Purple to blue for headers and CTAs
- **Status Colors**: Green (success), Red (error), Yellow (warning)

### Typography

- **Headings**: Geist Sans with gradient text effects
- **Body**: Geist Sans for readability
- **Code**: Geist Mono for addresses and signatures

### Components

- **Cards**: Flexible with variants (default, elevated, bordered)
- **Buttons**: Consistent sizing with loading states
- **Forms**: Comprehensive validation and error display
- **Navigation**: Active states and responsive design

## 🔒 Security Considerations

- **Wallet Safety**: Direct Phantom integration without exposing private keys
- **Network**: Devnet only for testing purposes
- **Validation**: Client-side address and amount validation
- **Error Handling**: Comprehensive error boundaries and user feedback

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Tailwind's responsive system
- **Touch Friendly**: Appropriate touch targets
- **Accessibility**: ARIA labels and keyboard navigation

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting (if configured)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

Ensure all required environment variables are configured for your deployment environment.

### Vercel Deployment

This project is optimized for deployment on Vercel:

```bash
npm i -g vercel
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is built for demonstration purposes. Check the license file for details.

## 🙏 Acknowledgments

- **Solana**: For the robust blockchain infrastructure
- **Phantom**: For the excellent wallet experience
- **Next.js**: For the powerful React framework
- **Tailwind CSS**: For the utility-first styling approach
- **Helius**: For reliable Solana RPC services

---

Built with ❤️ for the Solana ecosystem
