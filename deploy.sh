#!/bin/bash

# Deployment script for DataLoom Stylus Contract
# This script exports the ABI and deploys to Arbitrum Sepolia

set -e

echo "🚀 DataLoom Contract Deployment Script"
echo "========================================"
echo ""

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY environment variable is not set"
    echo ""
    echo "Please set your private key:"
    echo "  export PRIVATE_KEY=0xyour_private_key_here"
    echo ""
    exit 1
fi

# Navigate to project directory
cd "/mnt/c/Users/Bhavesh Gajengi/chain-weaver"

echo "📋 Step 1: Exporting Contract ABI..."
echo "-----------------------------------"
cargo stylus export-abi > contract-abi.json 2>&1 || {
    echo "⚠️  ABI export failed (this is expected on WSL2)"
    echo "   Continuing with deployment..."
}

echo ""
echo "🔍 Step 2: Checking contract..."
echo "-----------------------------------"
if [ -f "dataloom.wasm" ]; then
    SIZE=$(ls -lh dataloom.wasm | awk '{print $5}')
    echo "✅ Found compiled WASM: dataloom.wasm ($SIZE)"
else
    echo "❌ Error: dataloom.wasm not found!"
    echo "   Please run ./build-wsl.sh first"
    exit 1
fi

echo ""
echo "🌐 Step 3: Deploying to Arbitrum Sepolia..."
echo "-----------------------------------"
echo "Network: Arbitrum Sepolia"
echo "RPC: https://sepolia-rollup.arbitrum.io/rpc"
echo ""

# Deploy the contract
cargo stylus deploy \
    --private-key "$PRIVATE_KEY" \
    --endpoint https://sepolia-rollup.arbitrum.io/rpc \
    --wasm-file dataloom.wasm \
    --max-fee-per-gas-gwei 0.03 \
    --no-verify

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment Successful!"
    echo "========================================"
    echo ""
    echo "⚠️  IMPORTANT: Copy the contract address from above!"
    echo ""
    echo "Next steps:"
    echo "1. Update src/lib/contracts.ts with the contract address"
    echo "2. Verify on https://sepolia.arbiscan.io/"
    echo "3. Test the application with 'npm run dev'"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Please check the error message above."
    exit 1
fi
