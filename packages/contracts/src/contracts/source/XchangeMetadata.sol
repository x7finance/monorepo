// SPDX-License-Identifier: MIT
pragma solidity =0.8.25;

/*

 /$$   /$$ /$$$$$$$$       /$$$$$$$$ /$$
| $$  / $$|_____ $$/      | $$_____/|__/
|  $$/ $$/     /$$/       | $$       /$$ /$$$$$$$   /$$$$$$  /$$$$$$$   /$$$$$$$  /$$$$$$
 \  $$$$/     /$$/        | $$$$$   | $$| $$__  $$ |____  $$| $$__  $$ /$$_____/ /$$__  $$
  >$$  $$    /$$/         | $$__/   | $$| $$  \ $$  /$$$$$$$| $$  \ $$| $$      | $$$$$$$$
 /$$/\  $$  /$$/          | $$      | $$| $$  | $$ /$$__  $$| $$  | $$| $$      | $$_____/
| $$  \ $$ /$$/           | $$      | $$| $$  | $$|  $$$$$$$| $$  | $$|  $$$$$$$|  $$$$$$$
|__/  |__/|__/            |__/      |__/|__/  |__/ \_______/|__/  |__/ \_______/ \_______/

Contract: XchangeMetadata - Stores and manages metadata for Xchange token pairs

 */
contract XchangeMetadata {
    struct TokenMetadata {
        string description;
        string twitterLink;
        string telegramLink;
        string websiteLink;
        string tokenUri;
        string bannerUri;
        bool exists;
        bool isEnabled;
    }

    address public owner;
    mapping(address => bool) public administrators;
    mapping(address => TokenMetadata) public tokenMetadata;
    address[] public registeredTokens;

    uint256 private constant MAX_STRING_LENGTH = 200;

    event MetadataUpdated(
        address indexed tokenAddress,
        string description,
        string twitterLink,
        string telegramLink,
        string websiteLink,
        string tokenUri,
        string bannerUri
    );
    event AdministratorUpdated(address indexed admin, bool status);
    event OwnerChanged(address indexed newOwner, address indexed changedBy);
    event TokenMetadataStatusChanged(address indexed tokenAddress, bool isEnabled);

    error Unauthorized();
    error TokenNotFound();
    error InvalidAddress();
    error NotTokenOwner();
    error StringTooLong();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyAdmin() {
        if (!administrators[msg.sender]) revert Unauthorized();
        _;
    }

    constructor(address initialOwner) {
        require(initialOwner != address(0), "Invalid owner address");
        owner = initialOwner;
        administrators[initialOwner] = true;
    }

    function setAdministrator(address admin, bool status) external onlyOwner {
        if (admin == address(0)) revert InvalidAddress();
        administrators[admin] = status;
        emit AdministratorUpdated(admin, status);
    }

    function addToken(
        address tokenAddress,
        string memory description,
        string memory twitterLink,
        string memory telegramLink,
        string memory websiteLink,
        string memory tokenUri,
        string memory bannerUri
    ) external onlyAdmin {
        if (tokenAddress == address(0)) revert InvalidAddress();
        if (bytes(description).length > MAX_STRING_LENGTH) revert StringTooLong();
        if (bytes(twitterLink).length > MAX_STRING_LENGTH) revert StringTooLong();
        if (bytes(telegramLink).length > MAX_STRING_LENGTH) revert StringTooLong();
        if (bytes(websiteLink).length > MAX_STRING_LENGTH) revert StringTooLong();
        if (bytes(tokenUri).length > MAX_STRING_LENGTH) revert StringTooLong();
        if (bytes(bannerUri).length > MAX_STRING_LENGTH) revert StringTooLong();

        if (!tokenMetadata[tokenAddress].exists) {
            registeredTokens.push(tokenAddress);
        }

        tokenMetadata[tokenAddress] = TokenMetadata({
            description: description,
            twitterLink: twitterLink,
            telegramLink: telegramLink,
            websiteLink: websiteLink,
            tokenUri: tokenUri,
            bannerUri: bannerUri,
            exists: true,
            isEnabled: true
        });

        emit MetadataUpdated(tokenAddress, description, twitterLink, telegramLink, websiteLink, tokenUri, bannerUri);
    }

    function updateTokenMetadata(
        address tokenAddress,
        string memory description,
        string memory twitterLink,
        string memory telegramLink,
        string memory websiteLink,
        string memory tokenUri,
        string memory bannerUri
    ) external {
        if (!tokenMetadata[tokenAddress].exists) revert TokenNotFound();

        // Check if sender is token owner
        try Ownable(tokenAddress).owner() returns (address tokenOwner) {
            if (msg.sender != tokenOwner) revert NotTokenOwner();
        } catch {
            revert NotTokenOwner();
        }

        tokenMetadata[tokenAddress] = TokenMetadata({
            description: description,
            twitterLink: twitterLink,
            telegramLink: telegramLink,
            websiteLink: websiteLink,
            tokenUri: tokenUri,
            bannerUri: bannerUri,
            exists: true,
            isEnabled: true
        });

        emit MetadataUpdated(tokenAddress, description, twitterLink, telegramLink, websiteLink, tokenUri, bannerUri);
    }

    function getRegisteredTokens() external view returns (address[] memory) {
        return registeredTokens;
    }

    function getTokenMetadata(address tokenAddress) external view returns (TokenMetadata memory) {
        if (!tokenMetadata[tokenAddress].exists) revert TokenNotFound();
        if (!tokenMetadata[tokenAddress].isEnabled) revert TokenNotFound();
        return tokenMetadata[tokenAddress];
    }

    function changeOwner(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert InvalidAddress();
        owner = newOwner;
        emit OwnerChanged(newOwner, msg.sender);
    }

    function setTokenMetadataStatus(address tokenAddress, bool status) external onlyAdmin {
        if (!tokenMetadata[tokenAddress].exists) revert TokenNotFound();

        tokenMetadata[tokenAddress].isEnabled = status;
        emit TokenMetadataStatusChanged(tokenAddress, status);
    }
}

interface Ownable {
    function owner() external view returns (address);
}
