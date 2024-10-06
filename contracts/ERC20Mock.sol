// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {

    address public owner;

    constructor(uint256 initialSupply) ERC20("USDT", "USDT") {
        owner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    // only owner can mint
    function mint(uint256 amount) external {
        require(msg.sender == owner);
        _mint(msg.sender, amount);
    }

}
