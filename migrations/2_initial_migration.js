var SimpleStorage = artifacts.require("SimpleStorage");
var TransferEthers = artifacts.require("TransferEthers");

module.exports = function(deployer) {
    deployer.deploy(SimpleStorage);
    deployer.deploy(TransferEthers);
};