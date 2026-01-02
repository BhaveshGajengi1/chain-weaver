---
description: Deploy the chain-weaver application
---

# Chain-Weaver Deployment Guide

This workflow covers deploying both the frontend application and the Stylus smart contract.

## Option 1: Deploy Frontend Only (Recommended for Quick Start)

### Using Lovable Platform (Easiest)

1. Open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. Click on **Share → Publish**
3. Your application will be deployed automatically
4. Optional: Connect a custom domain via **Project > Settings > Domains**

### Using Vercel/Netlify (Manual)

1. Build the production bundle:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting platform:
   - **Vercel**: `vercel --prod`
   - **Netlify**: `netlify deploy --prod --dir=dist`

---

## Option 2: Deploy Smart Contract Only

### Prerequisites

Before deploying the Stylus contract, ensure you have:

1. **Compiled WASM file**: Run the build script first
```bash
bash build-wsl.sh
```

2. **Private Key**: Export your wallet private key (keep this secure!)
```bash
export PRIVATE_KEY=0xyour_private_key_here
```

3. **Testnet ETH**: Get Arbitrum Sepolia ETH from [Arbitrum Sepolia Faucet](https://faucet.quicknode.com/arbitrum/sepolia)

### Deploy Contract

// turbo
1. Run the deployment script:
```bash
bash deploy.sh
```

2. Copy the deployed contract address from the output

3. Update the contract address in your frontend:
   - Create `.env.local` if it doesn't exist:
   ```bash
   cp .env.example .env.local
   ```
   - Update `VITE_DATALOOM_CONTRACT_ADDRESS` with your new contract address

---

## Option 3: Full Deployment (Frontend + Contract)

### Step 1: Deploy Smart Contract

Follow **Option 2** above to deploy the Stylus contract first.

### Step 2: Configure Environment Variables

1. Create `.env.local` file:
```bash
cp .env.example .env.local
```

2. Update the following required variables in `.env.local`:
   - `VITE_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - `VITE_DATALOOM_CONTRACT_ADDRESS`: Use the address from Step 1
   - `VITE_ALCHEMY_API_KEY` (optional): Get from [Alchemy](https://www.alchemy.com/)

### Step 3: Test Locally

// turbo
1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:5173 and test the application
3. Connect your wallet and verify contract interactions work

### Step 4: Build and Deploy Frontend

1. Build the production bundle:
```bash
npm run build
```

2. Deploy using Lovable (easiest) or your preferred hosting platform

---

## Post-Deployment Checklist

- [ ] Frontend is accessible via the deployment URL
- [ ] Wallet connection works (WalletConnect/MetaMask)
- [ ] Contract address is correctly configured
- [ ] Contract interactions work on Arbitrum Sepolia
- [ ] Verify contract on [Arbiscan Sepolia](https://sepolia.arbiscan.io/)
- [ ] Test all core features (upload, retrieve, verify data)

---

## Troubleshooting

### Contract Deployment Issues

- **"PRIVATE_KEY not set"**: Export your private key: `export PRIVATE_KEY=0x...`
- **"Insufficient funds"**: Get testnet ETH from Arbitrum Sepolia faucet
- **"WASM not found"**: Run `bash build-wsl.sh` first

### Frontend Issues

- **Wallet won't connect**: Check `VITE_WALLETCONNECT_PROJECT_ID` in `.env.local`
- **Contract calls fail**: Verify `VITE_DATALOOM_CONTRACT_ADDRESS` is correct
- **Build fails**: Run `npm install` to ensure all dependencies are installed

### Environment Variables

If environment variables aren't loading:
- Ensure `.env.local` exists (not `.env`)
- Restart the dev server after changing `.env.local`
- Variables must start with `VITE_` to be accessible in the frontend
