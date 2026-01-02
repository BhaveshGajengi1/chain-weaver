require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.24",
    networks: {
        arbitrumSepolia: {
            url: "https://sepolia-rollup.arbitrum.io/rpc",
            accounts: ["b41ef693797033b5405ade48be72dce26287d5e241e13bfddb918285939581d9"],
            chainId: 421614,
        },
        hardhat: {
            chainId: 31337,
            accounts: {
                count: 10,
                accountsBalance: "10000000000000000000000", // 10,000 ETH
            },
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
    },
};
