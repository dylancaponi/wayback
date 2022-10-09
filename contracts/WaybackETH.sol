// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.14;

import "./Oracle.sol";

contract WaybackETH {
    
    OptimisticOracleV2Interface oo = OptimisticOracleV2Interface(0xA5B9d8a0B0Fa04Ba71BDD68069661ED5C0848884);

    bytes32 identifier = bytes32("YES_OR_NO_QUERY");
        
    mapping(uint => bytes) public indexToAncillaryData;
    mapping(uint => uint) public indexToHasSettled;

//   Hash confirming for is the key 
  mapping(string => DataByRequest) private hashToData;
  struct DataByRequest {
    bytes ancillaryData;
    uint256 requestTime;
    bool hasSettled;
  }

    function requestHashMatch(string calldata dockerURL, string calldata hashURL, string calldata hash) public {
        bytes memory ancillaryData =
            bytes(string.concat("Q: Using this Docker container ", dockerURL, " and this URI as input ", hashURL, " --- Does the output match this hash: ", hash, "? A: 1 for yes, 2 for no"));
        uint256 requestTime = block.timestamp;
        IERC20 bondCurrency = IERC20(0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6); 
        uint256 reward = 0;
        hashToData[hash] = DataByRequest(
            ancillaryData,
            requestTime,
            false
        );

        oo.requestPrice(identifier, requestTime, ancillaryData, bondCurrency, reward);
        oo.setCustomLiveness(identifier, requestTime, ancillaryData, 300);
    }

    function settleHashMatchRequest(string calldata hash) public {
        if (hashToData[hash].hasSettled == false) {
            uint256 payout = oo.settle(address(this), identifier, hashToData[hash].requestTime, hashToData[hash].ancillaryData);
            if (payout > 0) {
                hashToData[hash].hasSettled = true;
            }
        }
    }

    function getSettledData(string calldata hash) public view returns (int256) {
        return oo.getRequest(address(this), identifier, hashToData[hash].requestTime, hashToData[hash].ancillaryData).resolvedPrice;
    }
}
