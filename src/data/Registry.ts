import GameVersion from '../types/GameVersion'
import Registry from '../types/Registry'

const Registries: {
    [version: string]: Registry | undefined
} = {}

export async function getRegistry(version: GameVersion) {
    if (!Registries[version]) {
        Registries[version] = await import(`./${version}/Registry.json`)
    }
    return Registries[version] as Registry
}
