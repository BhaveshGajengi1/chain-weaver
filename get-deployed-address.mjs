import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getDeployedAddress() {
    try {
        // Deploy the contract and capture output
        const { stdout, stderr } = await execAsync(
            'wsl -d Ubuntu bash -c "cd /mnt/c/Users/Bhavesh\\\\ Gajengi/chain-weaver/foundry-local && ~/.foundry/bin/forge create src/DataLoom.sol:DataLoom --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"'
        );

        // Extract the deployed address
        const match = stdout.match(/Deployed to:\s*(0x[a-fA-F0-9]{40})/);

        if (match && match[1]) {
            console.log('\n✅ Contract deployed successfully!');
            console.log('📍 Contract Address:', match[1]);
            console.log('\n💡 Update src/lib/contracts.ts with:');
            console.log(`[31337]: "${match[1]}" as \`0x\${string}\`,`);
            return match[1];
        } else {
            console.log('Full output:', stdout);
            console.log('Error output:', stderr);
            throw new Error('Could not extract contract address from deployment output');
        }
    } catch (error) {
        console.error('Deployment error:', error.message);
        process.exit(1);
    }
}

getDeployedAddress();
