// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Wallet.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

contract Staking is ERC20 {
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    // TODO: Declare the events to be used in the 5 required functions
    event WalletCreate(uint256 walletId, address _address);

    event WalletDeposit(uint256 walletId, uint256 amount);

    event StakeETH(uint256 walletId, uint256 amount, uint startTime);

    event UnstakeETH(uint256 walletId, uint256 amount, uint256 numStocksReward);

    event WalletWithdraw(uint256 walletId, address _to, uint256 amount);

    // TODO: You can use a struct or mapping to keep track of all the current stakes in the staking pool.
    // Make sure to track the wallet, the total amount of ETH staked, the start time of the stake and the
    // end time of the stake
    struct StakeWallet {
        Wallet user;
        uint256 stakedAmount;
        uint256 sinceBlock;
        uint256 untilBlock;
    }

    // TODO: It may be a good idea to keep track of all the new stakes in an array
    StakeWallet[] public stakeWallets;

    EnumerableMap.UintToAddressMap private walletsStaked;

    // This defines the total percentage of reward(WEB3 ERC20 token) to be accumulated per second
    uint256 public constant percentPerBlock = 1; // Bonus Exercise: use more granular units

    // TODO: Define the constructor and make sure to define the ERC20 token here
    constructor() ERC20("Web3","WEB3"){}

    // TODO: This should create a wallet for the user and return the wallet Id. The user can create as many wallets as they want
    function walletCreate() public returns (uint256 walletId) {
        Wallet wallet = new Wallet();
        stakeWallets.push(StakeWallet(wallet,0,0,0));
        uint256 walletid = stakeWallets.length - 1;
        emit WalletCreate(walletId, address(wallet));
        return(walletid);
    }

    // TODO: This will return the array of wallets
    function getWallets() public view returns (StakeWallet[] memory) {
        return stakeWallets;
    }

    // TODO: This should let users deposit any amount of ETH into their wallet
    function walletDeposit(uint256 _walletId)
        public
        payable
        isWalletOwner(_walletId)
    {
        StakeWallet storage stakeWallet = stakeWallets[_walletId];
        stakeWallet.user.deposit{value: msg.value}();
        emit WalletDeposit(_walletId, msg.value);
    }

    // TODO: This will return the current amount of ETH for a particular wallet
    function walletBalance(uint256 _walletId) public view returns (uint256) {
        StakeWallet storage stakeWallet = stakeWallets[_walletId];
        return stakeWallet.user.balanceOf();
    }

    // TODO: This should let users withdraw any amount of ETH from their wallet
    function walletWithdraw(
        uint256 _walletId,
        address payable _to,
        uint _amount
    ) public payable isWalletOwner(_walletId) {
        StakeWallet storage stakeWallet = stakeWallets[_walletId];
        stakeWallet.user.withdraw(_to, _amount);
        emit WalletWithdraw(_walletId, _to, _amount);
    }

    /*
      TODO: This should let users stake the current ETH they have in their wallet to the staking pool. The user should 
      be able to stake additional amount of ETH into the staking pool whereby doing so will first reward the users with 
      the accumulated WEB3 ERC20 token and then reset the timestamp for the overall stake. When you stake your ETH into 
      the pool, what happens is the ETH is withdrawn from the wallet to the staking pool so make sure to call the withdraw 
      function of the wallet here to handle this.
    */
    // Bonus Exercise: Let user stake any amount of ETH rather than the whole balance
    function stakeEth(uint256 _walletId) public isWalletOwner(_walletId) {
        StakeWallet storage stakeWallet = stakeWallets[_walletId];
        uint256 currentBalance = stakeWallet.user.balanceOf();
        // TODO: Ensure that the wallet balance is non-zero before staking
        require( currentBalance > 0, "Wallet funds need to be non-zero");
        // TODO: Transfer ETH from the wallet(Wallet contract) to the staking pool(this contract)
        stakeWallet.user.withdraw(payable(address(this)), currentBalance);       
        // TODO: Reward with WEB3 tokens that the user had accumulated previously

        uint256 durationStaked = (block.timestamp - stakeWallet.sinceBlock);
        uint256 totalUnclaimedRewards = (stakeWallet.stakedAmount * durationStaked * percentPerBlock) / 100;
        _mint(msg.sender, totalUnclaimedRewards);

        stakeWallet.stakedAmount += currentBalance;
        stakeWallet.sinceBlock = block.timestamp;
        stakeWallet.untilBlock = 0;

        walletsStaked.set(_walletId, address(stakeWallet.user));

        emit StakeETH(_walletId, currentBalance, block.timestamp);
    }

    // TODO: This will return the current amount of ETH that a particular wallet has staked in the staking pool
    function currentStake(uint256 _walletId) public view returns (uint256) {
        StakeWallet storage stakeWallet = stakeWallets[_walletId];
        return stakeWallet.stakedAmount;
    }

    // TODO: This will return the total unclaimed WEB3 ERC20 tokens based on the user’s stake in the staking pool
    function currentReward(uint256 _walletId) public view returns (uint256) {
        StakeWallet storage stakeWallet = stakeWallets[_walletId];
        uint256 durationStaked = (block.timestamp - stakeWallet.sinceBlock);
        uint256 totalUnclaimedRewards = (stakeWallet.stakedAmount * durationStaked * percentPerBlock) / 100;
        return totalUnclaimedRewards;
    }

    // TODO: This will return the total amount of wallets that are currently in the staking pool
    function totalAddressesStaked() public view returns (uint256) {
        return walletsStaked.length();
    }

    // TODO: This will return true or false depending on whether a particular wallet is staked in the staking pool
    function isWalletStaked(uint256 _walletId) public view returns (bool) {
        return walletsStaked.contains(_walletId);
    }

    /*
      TODO: This should let users unstake all their ETH they have in the staking pool. Doing so will automatically mint 
      the appropriate amount of WEB3 ERC20 tokens that have been accumulated so far. When you unstake your ETH from the pool, 
      the ETH is withdrawn from the staking pool to the user wallet so make sure to call the transfer function to handle this.
    */
    function unstakeEth(uint256 _walletId)
        public
        payable
        isWalletOwner(_walletId)
    {
        StakeWallet storage stakeWallet = stakeWallets[_walletId];
        // TODO: Ensure that the user hasn't already unstaked previously
        require(stakeWallet.untilBlock == 0, "Already unstaked");  
        // TODO: Transfer ETHB from the staking pool(this contract) to the wallet(Wallet contract)
        uint256 currentBalance = stakeWallet.stakedAmount;
        payable(address(stakeWallet.user)).transfer(currentBalance);
        // TODO: Reward with WEB3 tokens that the user had accumulated so far
        uint256 rewardAmount = currentReward(_walletId);
        _mint(msg.sender, currentBalance);

        stakeWallet.untilBlock = block.timestamp;
        stakeWallet.sinceBlock = 0;
        stakeWallet.stakedAmount = 0;

        walletsStaked.remove(_walletId);
        emit UnstakeETH(_walletId, currentBalance, rewardAmount);
    }

    // TODO: Implement the "receive()" fallback function so the contract can handle the deposit of ETH
    receive() external payable {}

    // TODO: Implement the modifier "isWalletOwner" that checks whether msg.sender is the owner of the wallet
    modifier isWalletOwner(uint256 _walletId) {
        require(msg.sender != address(0), 'Invalid owner');
        StakeWallet storage stakeWallet = stakeWallets[_walletId];
        require(msg.sender == stakeWallet.user.owner(), "Not the owner");
        _;
    }
}
