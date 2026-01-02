import { createPublicClient, http, encodeFunctionData, decodeFunctionResult } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const CONTRACT_ADDRESS = '0x6cde03dcc72c4af932138603a20718b25b2f5aef';

// Try different possible ABIs
const STYLUS_ABI = [
    {
        type: 'function',
        name: 'store_pixels',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'pixel_data', type: 'bytes' },
            { name: 'metadata', type: 'string' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'storePixels',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'pixelData', type: 'bytes' },
            { name: 'metadata', type: 'string' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'get_canvas_count',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        type: 'function',
        name: 'getCanvasCount',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
];

async function testContract() {
    const client = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(),
    });

    console.log('🔍 Testing contract functions...\n');
    console.log('📍 Contract:', CONTRACT_ADDRESS);
    console.log('');

    // Test get_canvas_count (snake_case)
    try {
        console.log('Testing get_canvas_count (snake_case)...');
        const count = await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: STYLUS_ABI,
            functionName: 'get_canvas_count',
        });
        console.log('✅ get_canvas_count works! Count:', count.toString());
    } catch (error) {
        console.log('❌ get_canvas_count failed:', error.message.substring(0, 100));
    }

    // Test getCanvasCount (camelCase)
    try {
        console.log('\nTesting getCanvasCount (camelCase)...');
        const count = await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: STYLUS_ABI,
            functionName: 'getCanvasCount',
        });
        console.log('✅ getCanvasCount works! Count:', count.toString());
    } catch (error) {
        console.log('❌ getCanvasCount failed:', error.message.substring(0, 100));
    }

    // Get contract bytecode
    console.log('\n📝 Getting contract bytecode...');
    const code = await client.getBytecode({ address: CONTRACT_ADDRESS });
    console.log('Contract bytecode length:', code ? code.length : 0, 'bytes');

    // Try to simulate store_pixels call
    console.log('\n🧪 Simulating store_pixels call...');
    const testData = '0x0001000200030004'; // Simple test data
    const testMetadata = 'Test canvas';

    try {
        const { request } = await client.simulateContract({
            address: CONTRACT_ADDRESS,
            abi: STYLUS_ABI,
            functionName: 'store_pixels',
            args: [testData, testMetadata],
            account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Test account
        });
        console.log('✅ store_pixels simulation successful!');
    } catch (error) {
        console.log('❌ store_pixels simulation failed:');
        console.log('Error:', error.message);
        if (error.cause) {
            console.log('Cause:', error.cause);
        }
    }
}

testContract().catch(console.error);
