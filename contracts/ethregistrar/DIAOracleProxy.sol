pragma solidity >=0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";

// https://docs.diadata.org/documentation/oracle-documentation/deployed-contracts
interface DIAOracle {
  function getValue(string memory key) external view returns (uint128, uint128);
}


// DIAOracleProxy gets a price VLX in USD from DIAOracleV2.
contract DIAOracleProxy is Ownable {
    // Oracle interface
    DIAOracle public usdOracle;

    event DIAOracleChanged(address oracle);

    constructor(DIAOracle _usdOracle) public {
        setUsdOracle(_usdOracle);
    }

    /**
     * @dev Get last VLX/USD price from oracle.
     */
    function latestAnswer() public view returns(int256) {
        (uint128 rate, ) =  usdOracle.getValue("VLX/USD");
        uint256 value = uint256(rate);
        return int256(value);
    }

    /**
     * @dev Sets usd oracle.
     * @param _usdOracle Oracle address.
     */
    function setUsdOracle(DIAOracle _usdOracle) public onlyOwner {
        usdOracle = _usdOracle;
        emit DIAOracleChanged(address(_usdOracle));
    }
}
