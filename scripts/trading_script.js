const MainC = artifacts.require("MainC");

module.exports = function(callback) {
    (async () => {
        const mCon = await MainC.deployed();
        const accounts = await web3.eth.getAccounts();

        const indexes = [];
        const energy_status = [];
        for (let i = 0; i < 20; i++) {
            if (i < 10) {
                energy_status.push(Math.floor(Math.random() * 6) - 6);
            } else {
                energy_status.push(Math.floor(Math.random() * 8) + 1);
            }

            indexes.push(i);
            console.log(`Account ${i} starting status: ${energy_status[i]}`);
        }

        console.log("\n Setting up accounts...");
        for (let i = 0; i < 20; i++) {
            try {
                await mCon.register({from: accounts[i]});
            } catch (error) {
                null;
            }

            await mCon.requestEnergy(0, {from: accounts[i]});
            await mCon.withdraw({from: accounts[i]});
            await mCon.deposit({from: accounts[i], value: web3.utils.toWei("10", "ether")});
            let bal = await mCon.getBalance({from: accounts[i]});
            console.log(`Account ${i} starting balance: ${bal}`);
        }

        console.log("\n Starting energy trading...");
        for (let i = 0; i < 20; i++) {
            rand = Math.floor(Math.random() * indexes.length);
            let acc_num = indexes[rand];
            indexes.splice(rand, 1);

            console.log(`Submitting account ${acc_num}'s status (${i+1})`);
            await mCon.requestEnergy(energy_status[acc_num], {from: accounts[acc_num]});
        }

        console.log("\n Getting final values...");
        for (let i = 0; i < 20; i++) {
            let status = await mCon.getStatus({from: accounts[i]});
            let bal = await mCon.getBalance({from: accounts[i]});

            console.log(`Account ${i} final status and balance: ${status} and ${bal}`);
        }

        console.log("\n Finished");

    callback();
  })();
}