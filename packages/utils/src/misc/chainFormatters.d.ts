import { ChainAlchemyLinksEnum, ChainDenominationEnum, ChainId, ChainIdentifierEnum, ChainNameEnum, ChainShortNameEnum, ChainTokenOracleEtherUSDEnum } from "../chain";
export declare function generateChainDenomination(chain: ChainId): ChainDenominationEnum;
export declare function generateChainIdentifier(chain: ChainId): ChainIdentifierEnum;
export declare function generateChainAbbreviation(chain?: ChainId): "ETH" | ChainDenominationEnum;
export declare function generateChainShortName(chain?: ChainId): ChainShortNameEnum;
export declare function generateChainName(chain?: ChainId): ChainNameEnum;
export declare function generateChainTokenOracleEtherUSDEnum(chainId?: ChainId): ChainTokenOracleEtherUSDEnum;
export declare function getAlchemyUrls(id: ChainId): ChainAlchemyLinksEnum;
//# sourceMappingURL=chainFormatters.d.ts.map