const { ethers } = require("hardhat");
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000"
const namehash = require('eth-ens-namehash');
const sha3 = require('web3-utils').sha3;
module.exports = async ({getNamedAccounts, deployments, network}) => {
    const {deploy} = deployments;
    const {deployer, owner} = await getNamedAccounts();
    console.log(owner, deployer)
    const baseRegistrar = await ethers.getContract('BaseRegistrarImplementation');

    const priceOracle = await ethers.getContract('StablePriceOracle')

    await deploy('PrivateRegistrarController', {
        from: deployer, 
        args: [baseRegistrar.address, priceOracle.address],
        log: true
    })  

    const controller = await ethers.getContract('PrivateRegistrarController')
    const transactions = []
    await new Promise(r => setTimeout(r, 2000));
    await baseRegistrar.addController(controller.address, {from: deployer})
    // ESTIMATE GAS -->
    await controller.setPriceOracle(priceOracle.address, {from: deployer})
    console.log(`Waiting on settings to take place private resolver ${transactions.length}`)
    // await Promise.all(transactions.map((tx) => tx.wait()));
}

module.exports.tags = ['eth-registrar'];
module.exports.dependencies = ['registry', 'oracles']