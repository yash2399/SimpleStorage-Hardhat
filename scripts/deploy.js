const { ethers, run, network } = require("hardhat");
const { networks } = require("../hardhat.config");

async function main() {
  const SimplestorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("deploying ...");
  const simpleStorage = await SimplestorageFactory.deploy();
  await simpleStorage.deployed();
  console.log("Deployed at :" + simpleStorage.address);

  // we dont need to specify an rpc url or private key like in ganache here
  // this is because hardhat automatically gives a fake blockchain to test the contract
  // can be deployed by : yarn hardhat run scripts/deploy.js
  // you can use any network by specifying in hardhat.config.js file and using --network netwrokName

  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    // verify only if network deployed to is rinkeby(or any other on etherscan) and api key exists
    console.log("waiting for block confirmatons");
    await simpleStorage.deployTransaction.wait(6);
    // it takes time for etherscan to verify so its good to wait for 6 blocks before rnning the function
    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log("Current value :" + currentValue);
  const trasactionResponse = await simpleStorage.store(8);
  await trasactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log("Updated value :" + updatedValue);
}

async function verify(contractAddress, args) {
  console.log("verifying ...");
  try {
    await run("verify: verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    // it takes in contract address and verifies it
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(e);
    }
  } // if contract is already verified by etherscan, then it throws an error message
}
// this function verifies our transactions on etherscan by hardhat plugins defined in hardhat.config.js

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
