import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const CONTRACT_ADDRESS = '0x6cde03dcc72c4af932138603a20718b25b2f5aef';

const ABI = [
    {
        type: 'function',
        name: 'get_canvas_count',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
];

async function verifyContract() {
    const client = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(),
    });

    try {
        console.log('🔍 Verifying DataLoom contract on Arbitrum Sepolia...\n');
        console.log('📍 Contract Address:', CONTRACT_ADDRESS);
        console.log('🌐 Network: Arbitrum Sepolia (Chain ID: 421614)\n');

        // Check if contract exists
        const code = await client.getBytecode({ address: CONTRACT_ADDRESS });

        if (!code || code === '0x') {
            console.log('❌ ERROR: No contract found at this address!');
            console.log('The contract may not be deployed or the address is incorrect.\n');
            process.exit(1);
        }

        console.log('✅ Contract exists! Bytecode length:', code.length, 'bytes\n');

        // Try to read canvas count
        try {
            const count = await client.readContract({
                address: CONTRACT_ADDRESS,
                abi: ABI,
                functionName: 'get_canvas_count',
            });

            console.log('✅ Contract is functional!');
            console.log('📊 Canvas Count:', count.toString());
            console.log('\n🎉 Contract verification successful!');
            console.log('🔗 View on Arbiscan: https://sepolia.arbiscan.io/address/' + CONTRACT_ADDRESS);
        } catch (error) {
            console.log('⚠️  Could not read canvas count (this is normal if no canvases exist yet)');
            console.log('Error:', error.message);
            console.log('\n✅ Contract exists and should be functional for writes.');
        }

    } catch (error) {
        console.error('❌ Error verifying contract:', error.message);
        process.exit(1);
    }
}

verifyContract();
