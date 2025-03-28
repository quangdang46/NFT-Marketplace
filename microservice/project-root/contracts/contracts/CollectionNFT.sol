// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CollectionNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    event NFTMinted(address indexed owner, uint256 tokenId, string tokenURI);

    function bulkMint(address to, string[] memory tokenURIs) external onlyOwner returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](tokenURIs.length);
        for (uint256 i = 0; i < tokenURIs.length; i++) {
            _tokenIdCounter++;
            uint256 tokenId = _tokenIdCounter;
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            tokenIds[i] = tokenId;
            emit NFTMinted(to, tokenId, tokenURIs[i]);
        }
        return tokenIds;
    }

    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        _setTokenURI(tokenId, tokenURI);
    }
}