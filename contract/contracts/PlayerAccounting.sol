// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract PlayerAccounting {
    address owner;
    address usdcContractAddress;
    mapping(address => uint) playerBalances;
    mapping(address => bool) playerActiveStatus;

    // Initialize this contract with a single stablecoin ERC20 token that players
    // will fund their account with
    constructor(address _activeToken) {
        usdcContractAddress = _activeToken;
        owner = msg.sender;
    }

    /**
     * Used by player's wallet to deposit ERC20 stablecoins
     */
    function deposit(uint256 amount) public {
        // Pull the ERC20 tokens using transferFrom
        bool success = ERC20(usdcContractAddress).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success);

        // account for this balance update
        playerBalances[msg.sender] += amount;
    }

    // Gets the balance of stablecoins that the calling EOA has previously deposited to this contract
    function getBalance() external view returns (uint) {
        return playerBalances[msg.sender];
    }

    // Gets the active status of calling player wallet
    function getActiveStatus() external view returns (bool) {
        return playerActiveStatus[msg.sender];
    }

    // Gets a player's balance of deposited stablecoins
    function getPlayerBalance(
        address _playerAddress
    ) public view onlyOwner returns (uint) {
        return playerBalances[_playerAddress];
    }

    // Sets the active status of a player account
    function getPlayerActiveStatus(
        address _playerAddress
    ) external view onlyOwner returns (bool) {
        return playerActiveStatus[_playerAddress];
    }

    // Gets the active status of a player account
    function setPlayerActiveStatus(
        address _playerAddress,
        bool _isActive
    ) public onlyOwner {
        playerActiveStatus[_playerAddress] = _isActive;
    }

    modifier onlyOwner() {
        // require only the owner access
        if (msg.sender != owner) {
            revert("Caller is not the owner");
        }
        // run the rest of the function body
        _;
    }
}
