import { ethers } from 'ethers';

async function checkWallet() {
    const provider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc');
    const privateKey = '0xb41ef693797033b5405ade48be72dce26287d5e241e13bfddb918285939581d9';
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log('Wallet address:', wallet.address);

    const balance = await provider.getBalance(wallet.address);
    console.log('Balance:', ethers.formatEther(balance), 'ETH');

    if (balance === 0n) {
        console.log('\n⚠️  No balance! You need Sepolia ETH to deploy.');
        console.log('Get some from: https://faucet.quicknode.com/arbitrum/sepolia');
    }
}

checkWallet();
