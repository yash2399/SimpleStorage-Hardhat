const { ethers } = require("hardhat");
const { expect, assrt, assert } = require("chai");
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace");
const { extendEnvironment } = require("hardhat/config");

// this code will be run to test if our contract does what it's meant to do

describe("SimpleStorage", function () {
  let simplestorageFactory;
  let simpleStorage;
  beforeEach(async function () {
    simplestorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simplestorageFactory.deploy();
  });
  // before each test (it) it must perform the above function (deploy the contract)
  it("Should start with fav num 0", async function () {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    assert.equal(currentValue.toString(), expectedValue);
  });
  // test to check if first fav num is indeed 0 and retrieve function works properly
  it("Should update", async function () {
    const expectedValue = "7";
    const trasactionResponse = await simpleStorage.store(expectedValue);
    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), expectedValue);
  });
  // test to check if store function works properly
});

// with hardhat-gas-reporter enabled, we can see how much gas each function uses
// we can test by yarn hardhat test
