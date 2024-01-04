//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeUSDC is ERC20 {
    address owner;
    uint constant _initial_supply = 500 * (10 ** 18);

    constructor() ERC20("Fake USDC", "FUSDC") {
        owner = msg.sender;
        _mint(msg.sender, _initial_supply);
    }
}
