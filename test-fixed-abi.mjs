import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const CONTRACT_ADDRESS = '0x6cde03dcc72c4af932138603a20718b25b2f5aef';

const ABI = [
    {
        type: 'function',
        name: 'getCanvasCount',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'storePixels',
        stateMutability: 'nonpayable',
        inputs: [
            { name: '_pixelData', type: 'bytes' },
            { name: '_metadata', type: 'string' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
    },
];

async function testContract() {
    const client = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(),
    });

    console.log('🔍 Testing updated ABI...\n');

    try {
        console.log('Testing getCanvasCount...');
        const count = await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'getCanvasCount',
        });
        console.log('✅ getCanvasCount works! Count:', count.toString());
    } catch (error) {
        console.log('❌ getCanvasCount failed:', error.message);
    }

    console.log('\n🧪 Simulating storePixels...');
    const testData = '0x0001000200030004';
    const testMetadata = 'Test';

    try {
        const { request } = await client.simulateContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'storePixels',
            args: [testData, testMetadata],
            account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        });
        console.log('✅ storePixels simulation successful!');
        console.log('\n🎉 Contract is working correctly with camelCase ABI!');
    } catch (error) {
        console.log('❌ storePixels failed:', error.message);
        console.log('\nℹ️  This might be expected if there are contract-specific validations.');
    }
}

testContract().catch(console.error);
