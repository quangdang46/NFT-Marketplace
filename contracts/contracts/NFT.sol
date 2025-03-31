// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol"; // Thêm import
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract NFTManager is ERC1155, Ownable, IERC2981, IERC1155Receiver { // Thêm IERC1155Receiver
    using ECDSA for bytes32;

    uint256 private constant TOKEN_ID = 1;
    uint256 private _totalMinted;
    address public marketplaceFeeRecipient;
    uint256 public marketplaceFeePercentage;
    address public royaltyRecipient;
    uint256 public royaltyPercentage;

    uint256 public maxSupply;
    uint256 public mintLimit;
    uint256 public mintPrice;
    mapping(address => uint256) public mintCountPerWallet;

    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 amount;
        uint256 minBid;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool ended;
    }
    mapping(uint256 => Auction) public auctions;
    uint256 public auctionCount;

    mapping(bytes => bool) private _usedSignatures;

    event NFTMinted(address indexed recipient, uint256 amount, string uri);
    event AuctionCreated(uint256 indexed auctionId, uint256 tokenId, uint256 amount, uint256 minBid, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address winner, uint256 amount);
    event LazyMinted(address indexed buyer, uint256 amount, string uri);

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
        royaltyPercentage = 1000;
        _totalMinted = 0;
    }

    // Các hàm mint, lazyMint, auction giữ nguyên, chỉ thêm IERC1155Receiver
    function mintNFT(uint256 amount) external payable returns (uint256) {
        require(_totalMinted + amount <= maxSupply, "Exceeds max supply");
        require(msg.value >= mintPrice * amount, "Insufficient payment");
        require(mintCountPerWallet[msg.sender] + amount <= mintLimit, "Exceeds mint limit per wallet");

        _mint(msg.sender, TOKEN_ID, amount, "");
        _totalMinted += amount;
        mintCountPerWallet[msg.sender] += amount;

        emit NFTMinted(msg.sender, amount, uri(TOKEN_ID));
        return TOKEN_ID;
    }

    function bulkMint(address to, uint256 amount) external onlyOwner {
        require(_totalMinted + amount <= maxSupply, "Exceeds max supply");

        _mint(to, TOKEN_ID, amount, "");
        _totalMinted += amount;

        emit NFTMinted(to, amount, uri(TOKEN_ID));
    }

    function lazyMint(
        address buyer,
        uint256 amount,
        bytes memory signature
    ) external onlyOwner {
        require(_totalMinted + amount <= maxSupply, "Exceeds max supply");

        bytes32 hash = keccak256(abi.encodePacked(buyer, amount, uri(TOKEN_ID)));
        bytes32 messageHash = MessageHashUtils.toEthSignedMessageHash(hash);
        address signer = ECDSA.recover(messageHash, signature);
        require(signer == owner(), "Invalid signature");
        require(!_usedSignatures[signature], "Signature already used");
        _usedSignatures[signature] = true;

        _mint(buyer, TOKEN_ID, amount, "");
        _totalMinted += amount;

        emit LazyMinted(buyer, amount, uri(TOKEN_ID));
    }

    function createAuction(uint256 amount, uint256 minBid, uint256 duration) external {
        require(balanceOf(msg.sender, TOKEN_ID) >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be greater than 0");

        auctionCount++;
        uint256 auctionId = auctionCount;
        _safeTransferFrom(msg.sender, address(this), TOKEN_ID, amount, "");

        auctions[auctionId] = Auction({
            tokenId: TOKEN_ID,
            seller: msg.sender,
            amount: amount,
            minBid: minBid,
            highestBid: 0,
            highestBidder: address(0),
            endTime: block.timestamp + duration,
            ended: false
        });

        emit AuctionCreated(auctionId, TOKEN_ID, amount, minBid, block.timestamp + duration);
    }

    function placeBid(uint256 auctionId) external payable {
        Auction storage auction = auctions[auctionId];
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid && msg.value >= auction.minBid, "Bid too low");
        require(!auction.ended, "Auction already ended");

        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(auctionId, msg.sender, msg.value);
    }

    function endAuction(uint256 auctionId) external {
        Auction storage auction = auctions[auctionId];
        require(block.timestamp >= auction.endTime, "Auction not yet ended");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;
        if (auction.highestBidder != address(0)) {
            uint256 fee = (auction.highestBid * marketplaceFeePercentage) / 10000;
            uint256 royalty = (auction.highestBid * royaltyPercentage) / 10000;
            uint256 sellerAmount = auction.highestBid - fee - royalty;

            payable(marketplaceFeeRecipient).transfer(fee);
            payable(royaltyRecipient).transfer(royalty);
            payable(auction.seller).transfer(sellerAmount);
            _safeTransferFrom(address(this), auction.highestBidder, TOKEN_ID, auction.amount, "");
        } else {
            _safeTransferFrom(address(this), auction.seller, TOKEN_ID, auction.amount, "");
        }

        emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);
    }

    function setURI(string memory newUri) external onlyOwner {
        _setURI(newUri);
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

    function setRoyalty(address recipient, uint256 percentage) external onlyOwner {
        require(percentage <= 10000, "Royalty too high");
        royaltyRecipient = recipient;
        royaltyPercentage = percentage;
    }

    // Triển khai IERC1155Receiver
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
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
            interfaceId == type(IERC1155Receiver).interfaceId || // Thêm hỗ trợ IERC1155Receiver
            super.supportsInterface(interfaceId);
    }
}