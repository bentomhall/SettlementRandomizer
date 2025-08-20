export enum SettlementBracket {
    HAMLET = 'hamlet',
    VILLAGE = 'village',
    SMALL_TOWN = 'small town',
    LARGE_TOWN = 'large town',
    CITY = 'city',
    METROPOLIS = 'metropolis',
    ESTATE = 'estate'
}

export interface SizeRange {
    get min(): number,
    get max(): number
}

export const settlementSizeMap: Map<SettlementBracket, SizeRange> = new Map(
    [
        [SettlementBracket.HAMLET, {min: 2, max: 100}],
        [SettlementBracket.VILLAGE, {min: 100, max: 500}],
        [SettlementBracket.SMALL_TOWN, {min: 500, max: 1000}],
        [SettlementBracket.LARGE_TOWN, {min: 1000, max: 1500}],
        [SettlementBracket.CITY, {min: 1500, max: 15000}],
        [SettlementBracket.METROPOLIS, {min: 15000, max: 1e6}],
        [SettlementBracket.ESTATE, {min: 50, max: 100}]
    ]
)

export const requiredOccupationMap: Map<SettlementBracket, string[]> = new Map(
    [
        [SettlementBracket.HAMLET, []],
        [SettlementBracket.VILLAGE, ["mayor", "innkeeper", "smith", ]],
        [SettlementBracket.SMALL_TOWN, ["mayor", "innkeeper", "smith", "merchant", "priest", "arcanist", "herbalist", "brewer"]],
        [SettlementBracket.LARGE_TOWN, ["mayor", "innkeeper", "smith", "merchant", "priest", "arcanist", "herbalist", "brewer", "noble", "black market representative", "guard captain"]],
        [SettlementBracket.ESTATE, ["lord", "majordomo", "head maid", "cook", "guard captain"]],
        [SettlementBracket.CITY, ["mayor", "innkeeper", "innkeeper", "smith", "merchant", "high priest", "arcanist", "herbalist", "brewer", "noble", "black market representative", "guard captain"]],
        [SettlementBracket.METROPOLIS, ["mayor", "innkeeper", "innkeeper", "innkeeper", "smith", "merchant", "high priest", "arcanist", "herbalist", "brewer", "noble", "black market representative", "guard captain"]]
    ]
)