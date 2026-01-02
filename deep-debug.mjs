import { createPublicClient, createWalletClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const CONTRACT_ADDRESS = '0x6cde03dcc72c4af932138603a20718b25b2f5aef';

// Test with multiple possible ABIs
const SOLIDITY_ABI = [
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
    {
        type: 'function',
        name: 'canvasCount',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
];

async function deepDebug() {
    const client = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(),
    });

    console.log('🔍 DEEP CONTRACT DEBUGGING\n');
    console.log('Contract:', CONTRACT_ADDRESS);
    console.log('Network: Arbitrum Sepolia (421614)\n');

    // 1. Check if contract exists
    console.log('1️⃣ Checking if contract exists...');
    const code = await client.getBytecode({ address: CONTRACT_ADDRESS });
    if (!code || code === '0x') {
        console.log('❌ NO CONTRACT FOUND AT THIS ADDRESS!');
        return;
    }
    console.log('✅ Contract exists');
    console.log('   Bytecode length:', code.length, 'characters');
    console.log('   First 100 chars:', code.substring(0, 100));

    // 2. Try to read canvas count with different function names
    console.log('\n2️⃣ Testing read functions...');

    const functionNames = ['getCanvasCount', 'canvasCount', 'get_canvas_count', 'canvas_count'];

    for (const fnName of functionNames) {
        try {
            const result = await client.readContract({
                address: CONTRACT_ADDRESS,
                abi: SOLIDITY_ABI,
                functionName: fnName,
            });
            console.log(`✅ ${fnName}() works! Result:`, result.toString());
        } catch (error) {
            console.log(`❌ ${fnName}() failed:`, error.message.substring(0, 80));
        }
    }

    // 3. Check contract storage
    console.log('\n3️⃣ Checking contract storage...');
    try {
        // Slot 0 should be canvas_count
        const slot0 = await client.getStorageAt({
            address: CONTRACT_ADDRESS,
            slot: '0x0',
        });
        console.log('Storage slot 0 (canvas_count):', slot0);
    } catch (error) {
        console.log('Failed to read storage:', error.message);
    }

    // 4. Try to estimate gas for storePixels
    console.log('\n4️⃣ Testing storePixels gas estimation...');
    const testData = '0x00010002';
    const testMetadata = 'Test';

    try {
        const gas = await client.estimateContractGas({
            address: CONTRACT_ADDRESS,
            abi: SOLIDITY_ABI,
            functionName: 'storePixels',
            args: [testData, testMetadata],
            account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        });
        console.log('✅ Gas estimation successful:', gas.toString());
    } catch (error) {
        console.log('❌ Gas estimation failed');
        console.log('Error:', error.message);
        if (error.cause) {
            console.log('Cause:', JSON.stringify(error.cause, null, 2));
        }
        if (error.details) {
            console.log('Details:', error.details);
        }
    }

    // 5. Check if this is actually a Stylus contract
    console.log('\n5️⃣ Checking if this is a Stylus contract...');
    console.log('Stylus contracts are deployed via special transactions.');
    console.log('This contract was deployed via tx: 0x22fe55ddcfade77215365736ab75b92105d5caf8a20890ba84935b9c6095b2b1');

    // 6. Try calling with eth_call directly
    console.log('\n6️⃣ Testing direct eth_call...');
    try {
        // getCanvasCount() selector: 0x8bc33af3
        const result = await client.call({
            to: CONTRACT_ADDRESS,
            data: '0x8bc33af3', // getCanvasCount()
        });
        console.log('✅ Direct call successful');
        console.log('Result:', result);
    } catch (error) {
        console.log('❌ Direct call failed:', error.message);
    }
}

deepDebug().catch(console.error);
