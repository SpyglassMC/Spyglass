import GameVersion from '../types/GameVersion'
import BlockDefinition from '../types/BlockDefinition'

const BlockDefinitions: {
    [version: string]: BlockDefinition | undefined
} = {}

export async function getBlockDefinition(version: GameVersion) {
    if (!BlockDefinitions[version]) {
        BlockDefinitions[version] = await import(`./${version}/BlockDefinition.json`)
    }
    return BlockDefinitions[version] as BlockDefinition
}
