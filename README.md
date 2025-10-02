# Sol Cosmo Transfer

A modern web application for real-time Solana token monitoring and SOL transfers on Devnet. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### 🚀 Live Token Feed

- Real-time WebSocket connection to monitor new Solana tokens
- Interactive table with sorting capabilities (symbol, name, timestamp)
- Token metadata display including logos, symbols, and mint addresses
- Duplicate detection and automatic feed management
- Click-to-copy mint addresses

### 💰 SOL Transfer

- Phantom wallet integration for secure transactions
- Real-time balance display with USD conversion
- Smart balance validation accounting for network fees and rent exemption
- Transaction confirmation with Solana Explorer links
- Form validation with helpful error messages

### 🎨 User Interface

- Responsive design optimized for desktop and mobile
- Professional dark/light theme support
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications for user feedback

## Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Phantom Wallet** browser extension
- **Backend WebSocket Server** running on port 8080

## Installation

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
   # WebSocket connection for live token feed
   NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8080/connect

   # Solana RPC endpoint (Devnet)
   NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY

   # CoinGecko API for SOL price data
   NEXT_PUBLIC_COINGECKO_SIMPLE_PRICE_URL=https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Setting Up Phantom Wallet

1. Install the [Phantom Wallet](https://phantom.app/) browser extension
2. Create or import a wallet
3. Switch to **Devnet** in Phantom settings:
   - Open Phantom → Settings → Developer Settings
   - Toggle "Testnet Mode" to enable Devnet

### Using the Token Feed

1. Navigate to the **Cosmo Feed** page
2. The application automatically connects to the WebSocket server
3. View real-time token data as new tokens are discovered
4. Click column headers to sort by symbol, name, or timestamp
5. Click mint addresses to copy to clipboard

### Transferring SOL

1. Go to the **Transfer** page
2. Click "Connect Phantom Wallet"
3. Enter recipient address and amount
4. Use the "Max" button to transfer maximum available amount
5. Review transaction details in Phantom
6. Confirm to execute the transfer

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── cosmo/             # Live token feed page
│   ├── transfer/          # SOL transfer page
│   ├── layout.tsx         # Root layout with navigation
│   └── globals.css        # Global styles and Tailwind imports
├── components/            # Reusable UI components
│   ├── Card.tsx          # Container component
│   ├── NavBar.tsx        # Navigation header
│   ├── Toast.tsx         # Notification system
│   └── WalletBadge.tsx   # Wallet connection status
├── lib/                   # Utility functions and configurations
│   ├── solana.ts         # Solana connection and wallet utilities
│   └── util.ts           # General utility functions
└── types/                 # TypeScript type definitions
    └── token.ts          # Token-related interfaces
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Blockchain**: Solana Web3.js
- **Wallet**: Phantom Wallet Provider
- **Real-time**: WebSocket connections
- **Icons**: Lucide React

## Configuration

### Network Settings

The application is configured for Solana Devnet by default. To use different networks:

1. Update `NEXT_PUBLIC_SOLANA_RPC_URL` in your environment file
2. Ensure your Phantom wallet is set to the same network
3. Update the backend WebSocket server endpoint if needed

### WebSocket Server

The application expects a WebSocket server running on `ws://127.0.0.1:8080/connect` that provides:

- Real-time token discovery events
- JSON message format with token metadata
- Support for connection management and reconnection

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

### Code Style

The project follows these conventions:

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Extended configuration for Next.js and React best practices
- **Prettier**: Consistent code formatting (configure in your editor)
- **Component Structure**: Functional components with proper TypeScript interfaces

## Troubleshooting

### Common Issues

**WebSocket Connection Failed**

- Ensure the backend server is running on port 8080
- Check that no other service is using the port
- Verify firewall settings allow local connections

**Phantom Wallet Not Detected**

- Install the latest Phantom browser extension
- Refresh the page after installation
- Check that the extension is enabled

**Transaction Failures**

- Verify sufficient SOL balance for transfers and fees
- Ensure recipient address is valid and on the correct network
- Check Phantom is connected to Devnet

**Theme Issues**

- Clear browser localStorage if theme switching fails
- Ensure JavaScript is enabled in your browser

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Check the [Issues](../../issues) page for known problems
- Review the troubleshooting section above
- Ensure all prerequisites are properly configured

---

**Note**: This application is designed for development and testing on Solana Devnet. Exercise caution when adapting for mainnet use.

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
