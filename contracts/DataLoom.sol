// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DataLoom
 * @dev Production Solidity version of DataLoom for Arbitrum Sepolia
 */
contract DataLoom {
    uint256 public canvasCount;
    
    mapping(uint256 => bytes) public pixelData;
    mapping(uint256 => string) public metadata;
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public timestamps;
    
    event CanvasStored(uint256 indexed canvasId, address indexed creator, uint256 timestamp);
    
    /**
     * @dev Store pixel data on-chain
     * @param _pixelData Encoded pixel data
     * @param _metadata Canvas metadata
     * @return canvasId The ID of the stored canvas
     */
    function storePixels(bytes memory _pixelData, string memory _metadata) public returns (uint256) {
        canvasCount++;
        uint256 canvasId = canvasCount;
        
        pixelData[canvasId] = _pixelData;
        metadata[canvasId] = _metadata;
        creators[canvasId] = msg.sender;
        timestamps[canvasId] = block.timestamp;
        
        emit CanvasStored(canvasId, msg.sender, block.timestamp);
        
        return canvasId;
    }
    
    /**
     * @dev Get canvas data by ID
     * @param canvasId The canvas ID to retrieve
     * @return _pixelData The pixel data
     * @return _metadata The metadata
     * @return _creator The creator address
     * @return _timestamp The creation timestamp
     */
    function getCanvas(uint256 canvasId) public view returns (
        bytes memory _pixelData,
        string memory _metadata,
        address _creator,
        uint256 _timestamp
    ) {
        return (
            pixelData[canvasId],
            metadata[canvasId],
            creators[canvasId],
            timestamps[canvasId]
        );
    }
    
    /**
     * @dev Get total canvas count
     * @return The total number of canvases
     */
    function getCanvasCount() public view returns (uint256) {
        return canvasCount;
    }
    
    /**
     * @dev Get creator of a canvas
     * @param canvasId The canvas ID
     * @return The creator address
     */
    function getCreator(uint256 canvasId) public view returns (address) {
        return creators[canvasId];
    }
}
