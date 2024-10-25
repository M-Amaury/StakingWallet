const {loadFixture,} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const {ethers} = require("hardhat");
const { lazy } = require("react");

describe("Staking", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const [user1, user2] = await ethers.getSigners();

    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy();

    return { staking, user1, user2 };
  }

  async function helperCreateWallet(staking){
    const tx = await staking.walletCreate()
    await tx.wait()
  }

  async function helperGetWallet(staking, index){
    const stakeWallets = await staking.getWallets()
    return(stakeWallets[index])
  }

  async function helperMineNBlocks(n) {
    for (let index = 0; index < n; index++) {
      await ethers.provider.send('evm_mine')
    }
  }

  describe("walletCreate", function () {
    it("Should create a wallet", async function () {
      const { staking } = await loadFixture(deployFixture);

      const tx = await staking.walletCreate();
      await tx.wait();

      const stakeWallets = await staking.getWallets();
      const stakeWallet = stakeWallets[0]

      expect(stakeWallet.user).to.not.be.empty;
    });

  describe("walletDeposit", function() {
    it("Should deposit ETH in the wallet", async function(){
      const {staking} = await loadFixture(deployFixture);

      await helperCreateWallet(staking);

      const tx = await staking.walletDeposit(0, {value: ethers.parseEther('1')});
      tx.wait()

      const wallet = await helperGetWallet(staking, 0);

      const balance = await ethers.provider.getBalance(wallet.user)

      expect(balance.toString()).to.equal(ethers.parseEther('1'))
    })

    describe("walletBalance", function() {
      it("Should check the current balance of a wallet", async function() {
        const {staking} = await loadFixture(deployFixture);

        await helperCreateWallet(staking);

        const tx = await staking.walletDeposit(0, {value: ethers.parseEther('1')});
        tx.wait()
  
        const balance = await staking.walletBalance(0)
  
        expect(balance.toString()).to.equal(ethers.parseEther('1'))
      })
    })

    describe("walletWithdraw", function(){
      it("Should withdraw th amount of eth from the wallet", async function(){
        const {staking, user1} = await loadFixture(deployFixture);

        await helperCreateWallet(staking)

        const txDeposit = await staking.walletDeposit(0, {value: ethers.parseEther('1')})
        txDeposit.wait()

        const wallet = await helperGetWallet(staking, 0)
        let balance = await ethers.provider.getBalance(wallet.user)

        expect(balance.toString()).to.equal(ethers.parseEther('1'))

        const txWithdraw = await staking.walletWithdraw(0,user1,ethers.parseEther('1'))
        txWithdraw.wait()

        balance = await ethers.provider.getBalance(wallet.user)

        expect(balance.toString()).to.equal(ethers.parseEther('0'))
      })
    })

    describe("stakeEth", function(){
      it("Should stake ETH to the staking contract", async function(){
        const {staking} = await loadFixture(deployFixture);

        await helperCreateWallet(staking)

        const txDeposit = await staking.walletDeposit(0, {value: ethers.parseEther('1')})
        txDeposit.wait()

        const tx = await staking.stakeEth(0)
        tx.wait()

        const wallet = await helperGetWallet(staking, 0)

        expect(await ethers.provider.getBalance(wallet.user)).to.equal(ethers.parseEther('0'))
        expect(wallet.stakedAmount.toString()).to.equal(ethers.parseEther('1'))
        expect(wallet.sinceBlock).to.be.a('bigint').and.to.be.greaterThan(0)
      })
    })

    describe("currentStake", function(){
      it("Should show the current amount staked", async function(){
        const {staking} =await loadFixture(deployFixture);

        await helperCreateWallet(staking);

        const txDeposit = await staking.walletDeposit(0, {value: ethers.parseEther('1')})
        txDeposit.wait()

        const txStake = await staking.stakeEth(0)
        txStake.wait()

        const wallet = await helperGetWallet(staking, 0)
        const balance = await staking.currentStake(0)

        expect(await ethers.provider.getBalance(wallet.user)).to.equal(ethers.parseEther('0'))
        expect(balance.toString()).to.equal(ethers.parseEther('1'))
      })
    })

    describe("currentReward", function(){
      it("Should show the current reward of the staking pool", async function(){
        const {staking} = await loadFixture(deployFixture)

        await helperCreateWallet(staking)

        const txDeposit = await staking.walletDeposit(0, {value: ethers.parseEther('1')})
        txDeposit.wait()

        const txStake = await staking.stakeEth(0)
        txStake.wait()

        await helperMineNBlocks(2)

        const reward = await staking.currentReward(0)

        expect(reward.toString()).to.equal(ethers.parseEther('0.02'))
      })
    })

    describe("totalAddressesStaked", function(){
      it("Should show the total number of address that staked in the pool", async function(){
        const {staking} = await loadFixture(deployFixture)

        await helperCreateWallet(staking)

        const txDeposit = await staking.walletDeposit(0, {value: ethers.parseEther('1')})
        txDeposit.wait()

        const txStake = await staking.stakeEth(0)
        txStake.wait()

        const number = await staking.totalAddressesStaked()

        expect(number).to.equal(1)
      })
    })

    describe("isWalletStaked", function(){
      it("Should check if a wallet has staked in the pool", async function(){
        const {staking} = await loadFixture(deployFixture)

        await helperCreateWallet(staking)

        const txDeposit = await staking.walletDeposit(0, {value: ethers.parseEther('1')})
        txDeposit.wait()

        const txStake = await staking.stakeEth(0)
        txStake.wait()

        const isStaked = await staking.isWalletStaked(0)

        expect(isStaked).to.be.true
      })
    })

    describe("unstakeEth", function(){
      it("Should unstake the eth from the pool", async function(){
        const { staking } = await loadFixture(deployFixture)

        await helperCreateWallet(staking)

        const txDeposit = await staking.walletDeposit(0, {value: ethers.parseEther('1')})
        txDeposit.wait()

        const txStake = await staking.stakeEth(0)
        txStake.wait()

        let wallet = await helperGetWallet(staking,0)

        expect(await ethers.provider.getBalance(wallet.user)).to.equal(ethers.parseEther('0'))
        expect(wallet.stakedAmount.toString()).to.equal(ethers.parseEther('1'))

        const tx = await staking.unstakeEth(0)
        tx.wait()
  
        wallet = await helperGetWallet(staking, 0)
  
        expect((await ethers.provider.getBalance(wallet.user)).toString()).to.equal(ethers.parseEther('1'))
        expect(wallet.stakedAmount.toString()).to.equal(ethers.parseEther('0'))
        expect(wallet.sinceBlock.toString()).to.equal('0')
        expect(wallet.untilBlock).to.be.a('bigint').and.to.be.greaterThan(0)
      })
    })
  })
  });
});
