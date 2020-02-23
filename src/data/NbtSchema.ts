import CommandTreeVersion from '../types/CommandTreeVersion'
import NbtSchema from '../types/NbtSchema'

const NbtSchemas: {
    [version: string]: NbtSchema | undefined
} = {}

export async function getNbtSchema(version: CommandTreeVersion) {
    if (!NbtSchemas[version]) {
        NbtSchemas[version] = (await import(`./${version}/NbtSchema`)).default
    }
    return NbtSchemas[version] as NbtSchema
}
