import { ethers } from 'ethers';

async function checkContract() {
    const provider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc');
    const contractAddress = '0x6cde03dcc72c4af932138603a20718b25b2f5aef';

    console.log('Checking contract at:', contractAddress);

    // Check if contract exists
    const code = await provider.getCode(contractAddress);
    console.log('Contract code length:', code.length);
    console.log('Contract exists:', code !== '0x');

    // Try calling get_canvas_count
    const abi = [
        {
            type: 'function',
            name: 'get_canvas_count',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ name: '', type: 'uint256' }],
        },
    ];

    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        const count = await contract.get_canvas_count();
        console.log('Canvas count:', count.toString());
    } catch (error) {
        console.log('Error calling get_canvas_count:', error.message);
    }
}

checkContract();
