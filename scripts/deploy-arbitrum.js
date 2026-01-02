const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying DataLoom to Arbitrum Sepolia...\n");

    // Get the contract factory
    const DataLoom = await hre.ethers.getContractFactory("DataLoom");

    console.log("📝 Deploying contract...");
    const dataLoom = await DataLoom.deploy();

    await dataLoom.waitForDeployment();

    const address = await dataLoom.getAddress();
    console.log("\n✅ DataLoom deployed successfully!");
    console.log("📍 Contract Address:", address);

    // Get deployment transaction
    const deployTx = dataLoom.deploymentTransaction();
    console.log("🔗 Transaction Hash:", deployTx.hash);

    // Wait for confirmations
    console.log("\n⏳ Waiting for 3 block confirmations...");
    await deployTx.wait(3);

    console.log("✅ Confirmed!");
    console.log("\n🎉 Deployment complete!");
    console.log("\n📋 Next steps:");
    console.log("1. Update src/lib/contracts.ts with this address:");
    console.log(`   [arbitrumSepolia.id]: "${address}" as \`0x\${string}\`,`);
    console.log("\n2. View on Arbiscan:");
    console.log(`   https://sepolia.arbiscan.io/address/${address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });
