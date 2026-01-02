#!/bin/bash

# Start Anvil local blockchain and deploy DataLoom contract

echo "🚀 Starting local blockchain with Anvil..."
echo ""

# Start Anvil in background
~/.foundry/bin/anvil --port 8545 --chain-id 31337 --accounts 10 --balance 10000 > /tmp/anvil.log 2>&1 &
ANVIL_PID=$!

echo "⏳ Waiting for Anvil to start..."
sleep 3

echo "✅ Anvil started on http://localhost:8545"
echo "📊 Chain ID: 31337"
echo "💰 10 accounts with 10,000 ETH each"
echo ""

# Deploy contract
echo "🔨 Deploying DataLoom contract..."
cd /mnt/c/Users/Bhavesh\ Gajengi/chain-weaver/foundry-local

CONTRACT_ADDRESS=$(~/.foundry/bin/forge create src/DataLoom.sol:DataLoom \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  | grep "Deployed to:" | awk '{print $3}')

if [ -z "$CONTRACT_ADDRESS" ]; then
  echo "❌ Deployment failed"
  kill $ANVIL_PID
  exit 1
fi

echo ""
echo "✅ Contract deployed successfully!"
echo "📍 Contract Address: $CONTRACT_ADDRESS"
echo "🌐 RPC URL: http://localhost:8545"
echo "🔑 Test Account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
echo "🔐 Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo ""
echo "💡 Add to src/lib/contracts.ts:"
echo "[31337]: \"$CONTRACT_ADDRESS\" as \`0x\${string}\`,"
echo ""
echo "🎉 Local blockchain is ready!"
echo "📝 Anvil PID: $ANVIL_PID (kill with: kill $ANVIL_PID)"
echo ""
echo "Press Ctrl+C to stop Anvil"

# Keep script running
wait $ANVIL_PID
