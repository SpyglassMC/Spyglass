import { CommandTree } from '../types/CommandTree'
import { CommandTreeVersion } from '../types/CommandTreeVersion'

const CommandTrees: {
    [version: string]: CommandTree | undefined
} = {}

/* istanbul ignore next */
export async function getCommandTree(version: CommandTreeVersion) {
    if (!CommandTrees[version]) {
        CommandTrees[version] = (await import(`./CommandTree${version}`)).CommandTree
    }
    return CommandTrees[version] as CommandTree
}
