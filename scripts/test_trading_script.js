const P2PC = artifacts.require("P2PC");
const MainC = artifacts.require("MainC");

function register() {
  (async () => {
    const mCon = await MainC.deployed();
    const accounts = await web3.eth.getAccounts();

    const resp = await mCon.register({from: accounts[0]});
    console.log(resp);
    await mCon.register({from: accounts[1]});
    await mCon.register({from: accounts[2]});
    await mCon.register({from: accounts[3]});
  })();
}

module.exports = function(callback) {
  (async () => {
    try {
      const P2PCInstance = await P2PC.deployed();
      const MainCInstance = await MainC.deployed();
      const accounts = await web3.eth.getAccounts();

      //await register(MainCInstance, accounts);
      
      //await MainCInstance.register({from: accounts[0]});
      //await MainCInstance.register({from: accounts[1]});
      //await MainCInstance.register({from: accounts[2]});
      //await MainCInstance.register({from: accounts[3]});

      await MainCInstance.requestEnergy(0, {from: accounts[0]});
      await MainCInstance.requestEnergy(0, {from: accounts[1]});
      await MainCInstance.requestEnergy(0, {from: accounts[2]});
      await MainCInstance.requestEnergy(0, {from: accounts[3]});

      await MainCInstance.withdraw({from: accounts[0]});
      await MainCInstance.withdraw({from: accounts[1]});
      await MainCInstance.withdraw({from: accounts[2]});
      await MainCInstance.withdraw({from: accounts[3]});
      await MainCInstance.deposit({from: accounts[0], value: web3.utils.toWei("10", "ether")});
      await MainCInstance.deposit({from: accounts[1], value: web3.utils.toWei("10", "ether")});
      await MainCInstance.deposit({from: accounts[2], value: web3.utils.toWei("10", "ether")});
      await MainCInstance.deposit({from: accounts[3], value: web3.utils.toWei("10", "ether")});
      var b0 = await MainCInstance.getBalance({from: accounts[0]});
      var b1 = await MainCInstance.getBalance({from: accounts[1]});
      var b2 = await MainCInstance.getBalance({from: accounts[0]});
      var b3 = await MainCInstance.getBalance({from: accounts[1]});
      console.log(`Starting balances, b0: ${b0.toNumber()}, b1: ${b1.toNumber()}, b2: ${b2.toNumber()}, b3: ${b3.toNumber()}`);

      await MainCInstance.requestEnergy(5, {from: accounts[0]});
      await MainCInstance.requestEnergy(5, {from: accounts[1]});
      await MainCInstance.requestEnergy(-3, {from: accounts[2]});
      await MainCInstance.requestEnergy(-4, {from: accounts[3]});
      var s0 = await MainCInstance.getStatus({from: accounts[0]});
      var s1 = await MainCInstance.getStatus({from: accounts[1]});
      var s2 = await MainCInstance.getStatus({from: accounts[2]});
      var s3 = await MainCInstance.getStatus({from: accounts[3]});
      console.log(`Ending status, s0: ${s0.toNumber()}, s1: ${s1.toNumber()}, s2: ${s2.toNumber()}, s3: ${s3.toNumber()}`);

      b0 = await MainCInstance.getBalance({from: accounts[0]});
      b1 = await MainCInstance.getBalance({from: accounts[1]});
      b2 = await MainCInstance.getBalance({from: accounts[2]});
      b3 = await MainCInstance.getBalance({from: accounts[3]});
      console.log(`Ending balances, b0: ${b0.toNumber()}, b1: ${b1.toNumber()}, b2: ${b2.toNumber()}, b3: ${b3.toNumber()}`);

    } catch (error) {
      console.log(error);
    }

    callback();
  })();
}