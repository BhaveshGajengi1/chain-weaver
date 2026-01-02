const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function deployContract() {
    try {
        console.log('🚀 Deploying DataLoom Contract to Arbitrum Sepolia...\n');

        // Setup provider and wallet
        const provider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc');
        const privateKey = process.argv[2];

        if (!privateKey) {
            throw new Error('Private key not provided');
        }

        const wallet = new ethers.Wallet(privateKey, provider);
        console.log(`📍 Deploying from address: ${wallet.address}`);

        // Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH\n`);

        if (balance === 0n) {
            throw new Error('Insufficient balance for deployment');
        }

        // Read WASM file
        const wasmPath = path.join(__dirname, 'target', 'wasm32-unknown-unknown', 'release', 'dataloom.wasm');
        console.log(`📦 Reading WASM file from: ${wasmPath}`);

        if (!fs.existsSync(wasmPath)) {
            throw new Error(`WASM file not found at ${wasmPath}`);
        }

        const wasmBytes = fs.readFileSync(wasmPath);
        console.log(`📊 WASM size: ${wasmBytes.length} bytes\n`);

        // Deploy contract (WASM bytecode as contract code)
        console.log('🔨 Sending deployment transaction...');
        const tx = await wallet.sendTransaction({
            data: '0x' + wasmBytes.toString('hex'),
            gasLimit: 10000000, // 10M gas limit
        });

        console.log(`📝 Transaction hash: ${tx.hash}`);
        console.log('⏳ Waiting for confirmation...\n');

        const receipt = await tx.wait();

        if (receipt.status === 1) {
            console.log('✅ Contract deployed successfully!');
            console.log(`📍 Contract address: ${receipt.contractAddress}`);
            console.log(`🔗 View on Arbiscan: https://sepolia.arbiscan.io/address/${receipt.contractAddress}`);
            console.log(`\n🎉 Deployment complete!`);

            // Write address to file
            fs.writeFileSync('deployed-address.txt', receipt.contractAddress);

            return receipt.contractAddress;
        } else {
            throw new Error('Transaction failed');
        }
    } catch (error) {
        console.error('❌ Deployment failed:');
        console.error(error.message);
        process.exit(1);
    }
}

deployContract();
