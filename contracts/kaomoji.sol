// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Kaomoji is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping (string => bool) existingURI;

    constructor(address initialOwner)
        ERC721("Kaomoji", "KMJ")
        Ownable(initialOwner)
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


    function isOwned(string memory uri) public view returns(bool) {
        return existingURI[uri];
    }

    function payToMint(address recipient, string memory uri) public payable returns(uint256) {
        require(!existingURI[uri], "This uri already existed.");
        require(recipient.code.length == 0, "Recipient cannot be a contract.");
        require(msg.value > 0.1 ether, "You need pay more.");
        uint256 tokenId = _nextTokenId++;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, uri);
        existingURI[uri] = true;
        return tokenId;
    }
}
