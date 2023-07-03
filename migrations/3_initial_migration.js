var P2PC = artifacts.require("P2PC");
var MainC = artifacts.require("MainC");

module.exports = function(deployer) {
    deployer.deploy(P2PC).then(function() {
        return deployer.deploy(MainC, P2PC.address);
    });
};