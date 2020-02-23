import CommandTreeVersion from '../types/CommandTreeVersion'
import CommandTree from '../types/CommandTree'

const CommandTrees: {
    [version: string]: CommandTree | undefined
} = {}

export async function getCommandTree(version: CommandTreeVersion) {
    if (!CommandTrees[version]) {
        CommandTrees[version] = (await import(`./${version}/CommandTree`)).default
    }
    return CommandTrees[version] as CommandTree
}
