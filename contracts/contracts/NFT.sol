// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract NFTManager is ERC721URIStorage, Ownable, IERC2981 {
    using ECDSA for bytes32;

    uint256 private _tokenIdCounter;
    address public marketplaceFeeRecipient;
    uint256 public marketplaceFeePercentage; // Phí marketplace (phần trăm, ví dụ: 2.5% = 250)
    mapping(uint256 => address) public royaltyRecipients; // Creator nhận royalty
    mapping(uint256 => uint256) public royaltyPercentages; // Royalty % cho mỗi NFT

    // Auction
    struct Auction {
        uint256 tokenId;
        address seller;
        uint256 minBid;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool ended;
    }
    mapping(uint256 => Auction) public auctions;
    uint256 public auctionCount;

    // Lazy Minting
    mapping(bytes => bool) private _usedSignatures;

    event NFTMinted(uint256 indexed tokenId, address recipient, string tokenURI);
    event AuctionCreated(uint256 indexed auctionId, uint256 tokenId, uint256 minBid, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address winner, uint256 amount);
    event LazyMinted(uint256 indexed tokenId, address buyer, string tokenURI);

    constructor(
        string memory name,
        string memory symbol,
        address _feeRecipient,
        uint256 _feePercentage
    ) ERC721(name, symbol) Ownable(msg.sender) {
        marketplaceFeeRecipient = _feeRecipient;
        marketplaceFeePercentage = _feePercentage;
        _tokenIdCounter = 1; // Bắt đầu từ 1 để khớp với NFTMarketplace
    }

    // Bulk Mint (từ CollectionNFT gốc)
    function bulkMint(address to, string[] memory tokenURIs) external onlyOwner returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](tokenURIs.length);
        for (uint256 i = 0; i < tokenURIs.length; i++) {
            _tokenIdCounter++;
            uint256 tokenId = _tokenIdCounter;
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            royaltyRecipients[tokenId] = to; // Gán royalty cho người nhận
            royaltyPercentages[tokenId] = 1000; // Mặc định 10%
            tokenIds[i] = tokenId;
            emit NFTMinted(tokenId, to, tokenURIs[i]);
        }
        return tokenIds;
    }

    // Mint thủ công (Admin only)
    function mintManual(address recipient, string memory uri) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);
        royaltyRecipients[tokenId] = recipient;
        royaltyPercentages[tokenId] = 1000; // Mặc định 10%
        emit NFTMinted(tokenId, recipient, uri);
        return tokenId;
    }

    // Mint tự động (User)
    function mintNFT(string memory uri) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        royaltyRecipients[tokenId] = msg.sender;
        royaltyPercentages[tokenId] = 1000; // Mặc định 10%
        emit NFTMinted(tokenId, msg.sender, uri);
        return tokenId;
    }

    // Lazy Minting
    function lazyMint(
        address buyer,
        string memory uri,
        uint256 royaltyPercentage,
        bytes memory signature
    ) external payable onlyOwner {
        bytes32 hash = keccak256(abi.encodePacked(buyer, uri, royaltyPercentage));
        bytes32 messageHash = MessageHashUtils.toEthSignedMessageHash(hash);
        address signer = ECDSA.recover(messageHash, signature);
        require(signer == owner(), "Invalid signature");
        require(!_usedSignatures[signature], "Signature already used");
        _usedSignatures[signature] = true;

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(buyer, tokenId);
        _setTokenURI(tokenId, uri);
        royaltyRecipients[tokenId] = signer;
        royaltyPercentages[tokenId] = royaltyPercentage;
        emit LazyMinted(tokenId, buyer, uri);
    }

    // Tạo đấu giá
    function createAuction(uint256 tokenId, uint256 minBid, uint256 duration) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(auctions[tokenId].endTime == 0, "Auction already exists");
        _transfer(msg.sender, address(this), tokenId);

        auctions[tokenId] = Auction({
            tokenId: tokenId,
            seller: msg.sender,
            minBid: minBid,
            highestBid: 0,
            highestBidder: address(0),
            endTime: block.timestamp + duration,
            ended: false
        });
        auctionCount++;
        emit AuctionCreated(tokenId, tokenId, minBid, block.timestamp + duration);
    }

    // Đặt giá trong đấu giá
    function placeBid(uint256 tokenId) external payable {
        Auction storage auction = auctions[tokenId];
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid && msg.value >= auction.minBid, "Bid too low");
        require(!auction.ended, "Auction already ended");

        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;
        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    // Kết thúc đấu giá
    function endAuction(uint256 tokenId) external {
        Auction storage auction = auctions[tokenId];
        require(block.timestamp >= auction.endTime, "Auction not yet ended");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;
        if (auction.highestBidder != address(0)) {
            uint256 fee = (auction.highestBid * marketplaceFeePercentage) / 10000;
            uint256 royalty = (auction.highestBid * royaltyPercentages[tokenId]) / 10000;
            uint256 sellerAmount = auction.highestBid - fee - royalty;

            payable(marketplaceFeeRecipient).transfer(fee);
            payable(royaltyRecipients[tokenId]).transfer(royalty);
            payable(auction.seller).transfer(sellerAmount);
            _transfer(address(this), auction.highestBidder, tokenId);
            emit AuctionEnded(tokenId, auction.highestBidder, auction.highestBid);
        } else {
            _transfer(address(this), auction.seller, tokenId);
        }
    }

    // EIP-2981: Royalty info
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address, uint256)
    {
        uint256 royaltyAmount = (salePrice * royaltyPercentages[tokenId]) / 10000;
        return (royaltyRecipients[tokenId], royaltyAmount);
    }

    // Override supportsInterface để hỗ trợ IERC2981
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721URIStorage, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}