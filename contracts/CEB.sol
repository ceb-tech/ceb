// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Uncomment this line to use console.log
//import "hardhat/console.sol";

contract CEB is ERC20 {

    uint256 public _totalSupply = 1_000_000_000 * 10 ** 18;

    string public constant _name = "CEB";

    string public constant _symbol = "CEB";

    uint256 public minSupply = 10_000_000 * 10 ** 18;

    // burn ratio, 5% by default
    uint256 public tradeBurnRatio = 5;

    // address of the supervisor
    address public adminAddress;

    // whitelist of addresses that are exempt from token burn
    mapping(address => bool) public whitelist;

    constructor() ERC20(_name, _symbol){
        adminAddress = msg.sender;
        whitelist[adminAddress] = true;
        _mint(msg.sender, _totalSupply);
    }

    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Only the admin can perform this action.");
        _;
    }

    function transfer(address _to, uint256 _amount) public override returns (bool) {
        require(_amount <= balanceOf(msg.sender), "Transfer amount exceeds sender balance");
        uint256 burnAmount = 0;
        uint256 currentSupply = totalSupply();
        if (!whitelist[msg.sender] && tradeBurnRatio > 0 && currentSupply > minSupply) {
            burnAmount = _amount * tradeBurnRatio / 100;
            super._burn(msg.sender, burnAmount);
        }
        uint256 receiveAmount = _amount - burnAmount;
        super._transfer(msg.sender, _to, receiveAmount);
        return true;
    }

    function changeAdminAddress(address newAdminAddress) public onlyAdmin {
        whitelist[adminAddress] = false;
        adminAddress = newAdminAddress;
        whitelist[adminAddress] = true;
    }

    function isWhitelisted(address _address) public view returns (bool) {
        return whitelist[_address];
    }

    function addToWhitelist(address _address) public onlyAdmin {
        whitelist[_address] = true;
    }
}
