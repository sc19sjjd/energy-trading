var P2PCI = artifacts.require("P2PCI");
var MainCI = artifacts.require("MainCI");

module.exports = function(deployer) {
    deployer.deploy(P2PCI).then(function() {
        return deployer.deploy(MainCI, P2PCI.address);
    });
};