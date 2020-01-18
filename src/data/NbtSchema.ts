import GameVersion from '../types/GameVersion'
import NbtSchema from '../types/NbtSchema'

const NbtSchemas: {
    [version: string]: NbtSchema | undefined
} = {}

export async function getNbtSchema(version: GameVersion) {
    if (!NbtSchemas[version]) {
        NbtSchemas[version] = (await import(`./${version}/NbtSchema`)).default
    }
    return NbtSchemas[version] as NbtSchema
}
