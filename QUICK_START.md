# 🚀 Quick Start Guide - Chain-Weaver Local Testing

## Current Status: ✅ ALL SYSTEMS RUNNING

### What's Running Right Now:
1. ✅ **Anvil Blockchain** - http://localhost:8545 (Chain ID: 31337)
2. ✅ **DataLoom Contract** - `0x5FbDB2315678afecb367f032d93F642f64180aa3`
3. ✅ **Dev Server** - http://localhost:8080/

---

## 🎯 3 Simple Steps to Start Testing

### Step 1: Add Localhost Network to MetaMask

**Quick Settings:**
- Network Name: `Localhost 8545`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency: `ETH`

### Step 2: Import Test Account (Optional)

**Private Key:** `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Address:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

**Balance:** 10,000 ETH (test funds)

### Step 3: Test the App

1. Switch MetaMask to **Localhost 8545**
2. Go to http://localhost:8080/
3. Click **"Connect Wallet"**
4. Draw on the **Eternal Canvas**
5. Click **"Store On-Chain"**
6. Enjoy instant, free transactions! 🎉

---

## 🔥 What Changed

Fixed network detection to accept **both localhost AND Arbitrum Sepolia**:
- ✅ ConnectWallet.tsx
- ✅ Demo.tsx

---

## 📋 Running Services

| Service | Status | Location |
|---------|--------|----------|
| Anvil | 🟢 Running | Terminal 1 |
| Dev Server | 🟢 Running | Terminal 2 |
| Contract | ✅ Deployed | `0x5FbDB...0aa3` |

---

## 🆘 Quick Troubleshooting

**Problem:** "Wrong network" warning  
**Solution:** Switch MetaMask to Localhost 8545 (Chain ID 31337)

**Problem:** Transaction fails  
**Solution:** Make sure Anvil is still running in the terminal

**Problem:** Can't see contract  
**Solution:** Refresh page after switching networks
