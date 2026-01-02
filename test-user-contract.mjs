import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const CONTRACT_ADDRESS = '0x00DEfe6c8fE01610406Aa58538952D5b7d92c56e';

const ABI = [
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
    {
        type: 'function',
        name: 'getCanvasCount',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
];

async function testUserContract() {
    const client = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(),
    });

    console.log('🔍 Testing contract at:', CONTRACT_ADDRESS);
    console.log('');

    // 1. Check if contract exists
    console.log('1️⃣ Checking contract existence...');
    const code = await client.getBytecode({ address: CONTRACT_ADDRESS });

    if (!code || code === '0x') {
        console.log('❌ NO CONTRACT AT THIS ADDRESS!');
        console.log('This address does not contain a deployed contract.');
        return;
    }

    console.log('✅ Contract exists');
    console.log('Bytecode length:', code.length, 'characters\n');

    // 2. Try to read canvas count
    console.log('2️⃣ Testing getCanvasCount...');
    try {
        const count = await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'getCanvasCount',
        });
        console.log('✅ getCanvasCount works! Count:', count.toString(), '\n');
    } catch (error) {
        console.log('❌ getCanvasCount failed:', error.message, '\n');
    }

    // 3. Try to simulate storePixels
    console.log('3️⃣ Simulating storePixels call...');
    const testData = '0x00010002000300040005';
    const testMetadata = 'Test canvas';

    try {
        const result = await client.simulateContract({
            address: CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'storePixels',
            args: [testData, testMetadata],
            account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        });
        console.log('✅ storePixels simulation successful!\n');
    } catch (error) {
        console.log('❌ storePixels simulation failed');
        console.log('Error:', error.message);
        console.log('');

        if (error.cause) {
            console.log('Cause:', error.cause);
        }
    }

    // 4. Check contract on Arbiscan
    console.log('4️⃣ Contract verification:');
    console.log('View on Arbiscan:', `https://sepolia.arbiscan.io/address/${CONTRACT_ADDRESS}`);
}

testUserContract().catch(console.error);
