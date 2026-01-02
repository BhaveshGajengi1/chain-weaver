import { ethers } from 'ethers';
import * as fs from 'fs';

const ARBITRUM_SEPOLIA_RPC = 'https://sepolia-rollup.arbitrum.io/rpc';

async function deployContract() {
    console.log('🚀 Deploying DataLoom to Arbitrum Sepolia...\n');

    // Check for private key
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.log('❌ ERROR: PRIVATE_KEY environment variable not set');
        console.log('\nPlease set your private key:');
        console.log('  export PRIVATE_KEY=0xyour_private_key_here');
        console.log('\n⚠️  Make sure you have Arbitrum Sepolia ETH in your wallet!');
        console.log('   Get testnet ETH from: https://faucet.quicknode.com/arbitrum/sepolia');
        process.exit(1);
    }

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(ARBITRUM_SEPOLIA_RPC);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log('📍 Deploying from:', wallet.address);

    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log('💰 Balance:', ethers.formatEther(balance), 'ETH');

    if (balance === 0n) {
        console.log('\n❌ ERROR: No ETH in wallet!');
        console.log('Get testnet ETH from: https://faucet.quicknode.com/arbitrum/sepolia');
        process.exit(1);
    }

    // Contract bytecode and ABI (from Solidity compiler)
    const contractCode = fs.readFileSync('./contracts/DataLoom.sol', 'utf8');

    console.log('\n📝 Contract loaded');
    console.log('⏳ Compiling and deploying...\n');

    // For simplicity, we'll use the pre-compiled bytecode from Foundry
    // You should compile this first with: forge build

    console.log('ℹ️  Please compile the contract first:');
    console.log('   cd foundry-local');
    console.log('   forge build');
    console.log('\nThen use the deployment command:');
    console.log('   forge create contracts/DataLoom.sol:DataLoom \\');
    console.log('     --rpc-url https://sepolia-rollup.arbitrum.io/rpc \\');
    console.log('     --private-key $PRIVATE_KEY \\');
    console.log('     --verify \\');
    console.log('     --etherscan-api-key $ARBISCAN_API_KEY');
}

deployContract().catch(console.error);
