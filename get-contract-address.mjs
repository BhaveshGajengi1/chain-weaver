import { ethers } from 'ethers';

async function getContractAddress() {
    const provider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc');
    const txHash = '0x3c485cb7416ded24b307fbed3bcd109f930be8db056';

    console.log('Fetching transaction receipt...');
    console.log('TX Hash:', txHash);

    try {
        const receipt = await provider.getTransactionReceipt(txHash);

        if (receipt) {
            console.log('\n✅ Transaction confirmed!');
            console.log('Contract Address:', receipt.contractAddress);
            console.log('Block Number:', receipt.blockNumber);
            console.log('Gas Used:', receipt.gasUsed.toString());
            console.log('\n🔗 View on Arbiscan:');
            console.log(`https://sepolia.arbiscan.io/address/${receipt.contractAddress}`);

            return receipt.contractAddress;
        } else {
            console.log('⏳ Transaction pending...');
            return null;
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

getContractAddress();
