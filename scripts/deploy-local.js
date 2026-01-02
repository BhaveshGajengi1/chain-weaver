const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying DataLoom to local network...\n");

    const DataLoom = await hre.ethers.getContractFactory("DataLoom");
    const dataLoom = await DataLoom.deploy();

    await dataLoom.waitForDeployment();

    const address = await dataLoom.getAddress();

    console.log("✅ DataLoom deployed successfully!");
    console.log(`📍 Contract address: ${address}`);
    console.log(`🌐 Network: Localhost (Chain ID: 31337)`);
    console.log(`\n💡 Add this address to src/lib/contracts.ts:\n`);
    console.log(`[31337]: "${address}" as \`0x\${string}\`,\n`);

    // Test the contract
    console.log("\n🧪 Testing contract...");
    const count = await dataLoom.getCanvasCount();
    console.log(`Initial canvas count: ${count}`);

    console.log("\n🎉 Contract is ready for testing!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
