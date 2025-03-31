// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract NFTManager is ERC1155, Ownable, IERC2981, IERC1155Receiver {
    uint256 private constant TOKEN_ID = 1;
    uint256 private _totalMinted;
    address public marketplaceFeeRecipient;
    uint256 public marketplaceFeePercentage;
    address public royaltyRecipient;
    uint256 public royaltyPercentage;
    uint256 public maxSupply;
    uint256 public mintLimit;
    uint256 public mintPrice;

    struct AllowlistStage {
        uint256 mintPrice;
        uint256 startTime;
        uint256 endTime;
        mapping(address => bool) allowedWallets;
    }
    mapping(uint256 => AllowlistStage) public allowlistStages;
    uint256 public stageCount;

    mapping(address => uint256) public mintCountPerWallet;

    event NFTMinted(address indexed recipient, uint256 amount, string uri);
    event AllowlistStageAdded(uint256 stageId, uint256 mintPrice, uint256 startTime, uint256 endTime);

    constructor(
        string memory name,
        string memory uri,
        address _feeRecipient,
        uint256 _feePercentage,
        uint256 _maxSupply,
        uint256 _mintLimit,
        uint256 _mintPrice
    ) ERC1155(uri) Ownable(msg.sender) {
        marketplaceFeeRecipient = _feeRecipient;
        marketplaceFeePercentage = _feePercentage;
        maxSupply = _maxSupply;
        mintLimit = _mintLimit;
        mintPrice = _mintPrice;
        royaltyRecipient = msg.sender;
        royaltyPercentage = 0;
    }

    function addAllowlistStage(
        uint256 stageId,
        uint256 stageMintPrice,
        uint256 startTime,
        uint256 duration,
        address[] memory wallets
    ) external onlyOwner {
        require(startTime >= block.timestamp, "Start time must be in future");
        AllowlistStage storage stage = allowlistStages[stageId];
        stage.mintPrice = stageMintPrice;
        stage.startTime = startTime;
        stage.endTime = startTime + duration;
        for (uint256 i = 0; i < wallets.length; i++) {
            stage.allowedWallets[wallets[i]] = true;
        }
        stageCount++;
        emit AllowlistStageAdded(stageId, stageMintPrice, startTime, stage.endTime);
    }

    function mintNFT(uint256 amount, uint256 stageId) external payable returns (uint256) {
        require(_totalMinted + amount <= maxSupply, "Exceeds max supply");
        require(mintCountPerWallet[msg.sender] + amount <= mintLimit, "Exceeds mint limit");

        AllowlistStage storage stage = allowlistStages[stageId];
        if (stage.startTime > 0) {
            require(block.timestamp >= stage.startTime && block.timestamp <= stage.endTime, "Stage not active");
            require(stage.allowedWallets[msg.sender], "Not in allowlist");
            require(msg.value >= stage.mintPrice * amount, "Insufficient payment for stage");
        } else {
            require(msg.value >= mintPrice * amount, "Insufficient payment");
        }

        _mint(msg.sender, TOKEN_ID, amount, "");
        _totalMinted += amount;
        mintCountPerWallet[msg.sender] += amount;

        emit NFTMinted(msg.sender, amount, uri(TOKEN_ID));
        return TOKEN_ID;
    }

    function setRoyalty(address recipient, uint256 percentage) external onlyOwner {
        require(percentage <= 10000, "Royalty too high");
        royaltyRecipient = recipient;
        royaltyPercentage = percentage;
    }

    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        override
        returns (address, uint256)
    {
        uint256 royaltyAmount = (salePrice * royaltyPercentage) / 10000;
        return (royaltyRecipient, royaltyAmount);
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}