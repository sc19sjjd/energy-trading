const BigNumber = require('bignumber.js');
const MainCI = artifacts.require("MainCI");

module.exports = function(callback) {
    (async () => {
        const mCon = await MainCI.deployed();
        const accounts = await web3.eth.getAccounts();
        const ether_val = BigNumber(await web3.utils.toWei("1", "ether"));

        const indexes = [];
        const energy_status = [];
        for (let i = 0; i < 20; i++) {
            if (i < 10) {
                energy_status.push(BigNumber((Math.floor(Math.random() * 6) - 6) * ether_val));
            } else {
                energy_status.push(BigNumber(Math.floor((Math.random() * 8) + 1) * ether_val));
            }

            indexes.push(i);
            console.log(`Account ${i} starting status: ${energy_status[i] / ether_val}`);
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
            await mCon.deposit({from: accounts[i], value: web3.utils.toWei("20", "ether")});
            let bal = await mCon.getBalance({from: accounts[i]});
            console.log(`Account ${i} starting balance: ${bal / ether_val}eth`);
        }

        try {
            console.log("\n Setting up liquidity pool...");
            let shares = await mCon.getLiquidityShares({from: accounts[0]});
            if (shares[0] > 0) {
                await mCon.withdrawLiquidity(BigNumber(shares[0]), {from: accounts[0]});
            }
            await mCon.withdraw();
            await mCon.deposit({value: web3.utils.toWei("60", "ether")});
            await mCon.depositLiquidity(BigNumber(40 * ether_val), {from: accounts[0]});
            let ls = await mCon.getLiquidityShares({from: accounts[0]});
            let pool = await mCon.getPool();
            console.log(`Liquidity pool: energy = ${pool[0] / ether_val}, ethers = ${pool[1] / ether_val}eth`);
            console.log(`Account 0 liquidity shares: ${ls[0] / ether_val}`);
        } catch (error) {
            console.error(error);
            return;
        }


        console.log("\n Starting energy trading...");
        for (let i = 0; i < 20; i++) {
            rand = Math.floor(Math.random() * indexes.length);
            let acc_num = indexes[rand];
            indexes.splice(rand, 1);

            console.log(`Submitting account ${acc_num}'s status (${energy_status[acc_num] / ether_val})`);
            await mCon.requestEnergy(energy_status[acc_num], {from: accounts[acc_num]});
        }

        console.log("\n Getting final values...");
        for (let i = 0; i < 20; i++) {
            let status = await mCon.getStatus({from: accounts[i]});
            let bal = await mCon.getBalance({from: accounts[i]});

            console.log(`Account ${i} final status: ${status / ether_val}, balance: ${bal / ether_val}eth`);
        }

        let pool = await mCon.getPool();
        let energy_price = await mCon.getEnergyPrice(BigNumber(1 * ether_val));
        console.log(`\n Final liquidity pool values, energy: ${pool[0] / ether_val}, ethers: ${pool[1] / ether_val}eth`);
        console.log(` Price of 1 unit of energy: ${energy_price / ether_val}eth`);
        
        console.log("\n Finished");

    callback();
  })();
}