@echo off
echo 🚀 Starting Local Blockchain...
echo.

REM Start Anvil in a new window
start "Anvil Local Blockchain" wsl -d Ubuntu bash -c "~/.foundry/bin/anvil --port 8545 --chain-id 31337"

echo ⏳ Waiting for Anvil to start...
timeout /t 5 /nobreak > nul

echo.
echo 🔨 Deploying DataLoom contract...
wsl -d Ubuntu bash -c "cd /mnt/c/Users/Bhavesh\ Gajengi/chain-weaver/foundry-local && ~/.foundry/bin/forge create src/DataLoom.sol:DataLoom --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" > deploy-result.txt 2>&1

type deploy-result.txt

echo.
echo ✅ Local blockchain is running!
echo 📍 RPC URL: http://localhost:8545
echo 🔑 Test Account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
echo.
echo 💡 Check deploy-result.txt for contract address
echo.
pause
