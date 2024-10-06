// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PrivateSale {
    address public owner;
    address public saleTokenAddress;
    address public payTokenAddress;
    address public receiverAddress;
    uint public tokenPrice;
    uint public unlockDate;

    mapping(address => bool) public whitelist;
    mapping(address => uint) public balances;
    mapping(address => bool) public claimed;

    constructor(address _saleTokenAddress, address _payTokenAddress, address _receiverAddress, uint _tokenPrice, uint _unlockDate) {
        owner = msg.sender;
        saleTokenAddress = _saleTokenAddress;
        payTokenAddress = _payTokenAddress;
        receiverAddress = _receiverAddress;
        tokenPrice = _tokenPrice;
        unlockDate = block.timestamp + _unlockDate;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    // only whitelisted address can participate in the private sale
    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "You are not whitelisted to participate in the private sale.");
        _;
    }

    // one address can only claim once
    modifier notClaimed() {
        require(!claimed[msg.sender], "Tokens have already been claimed.");
        _;
    }

    function addToWhitelist(address[] memory _addresses) external onlyOwner {
        for (uint i = 0; i < _addresses.length; i++) {
            whitelist[_addresses[i]] = true;
        }
    }

    // use stable coin to buy token
    function buyTokens(uint _tokenAmount) external payable onlyWhitelisted {
        uint allowance = IERC20(payTokenAddress).allowance(msg.sender, address(this));
        require(allowance >= _tokenAmount * tokenPrice, "Insufficient funds.");
        // sale period has not ended
        require(block.timestamp < unlockDate, "Token purchase period has ended.");
        // transfer buyer stable coin to receiver
        require(IERC20(payTokenAddress).transferFrom(msg.sender, receiverAddress, _tokenAmount), "Token transfer failed.");
        balances[msg.sender] += _tokenAmount;
    }

    // after unlock date, claim token
    function claimTokens() external notClaimed {
        require(block.timestamp >= unlockDate, "Tokens are not yet unlocked.");
        uint tokenAmount = balances[msg.sender];
        require(tokenAmount > 0, "You don't have any tokens to claim.");
        balances[msg.sender] = 0;
        claimed[msg.sender] = true;
        IERC20 saleTokenContract = IERC20(saleTokenAddress);
        require(saleTokenContract.transfer(msg.sender, tokenAmount), "Token transfer failed.");
        // Emit an event to track the token claim
        emit TokensClaimed(msg.sender, tokenAmount);
    }

    // Event to track token purchases
    event TokensPurchased(address indexed buyer, uint tokenAmount);

    // Event to track token claims
    event TokensClaimed(address indexed claimer, uint tokenAmount);
}
