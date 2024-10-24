// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract Wallet {

    address payable public owner;

    constructor() {
        owner = payable(tx.origin);
    }

    function deposit() public payable {}

    function withdraw(address payable receiver, uint amount) public onlyOwner {
        receiver.transfer(amount);
    }

    function balanceOf() public view returns (uint) {
        return address(this).balance;
    }

    receive() external payable {}

    modifier onlyOwner() {
        require(tx.origin == owner, "Not an owner of the wallet");
        _;
    }
}