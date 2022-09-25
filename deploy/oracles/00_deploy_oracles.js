const { ethers } = require("hardhat");
const toBN = require('web3-utils').toBN;

module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer, owner} = await getNamedAccounts();
    const oracle = await deploy('DIAOracleProxy', {
        from: deployer, 
        args:["0x0A7dC648C44e31636252be2267B86e0d9E1F8856"],
        log:true
    })

    await deploy('StablePriceOracle', {
        from: deployer, 
        args:[oracle.address,["0x5af3107a4000"]],
        log:true
    })

}

module.exports.tags = ['oracles'];
module.exports.dependencies = ['registry']