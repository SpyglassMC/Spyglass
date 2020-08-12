import { CommandTree } from '../types/CommandTree'
import { CommandTreeVersion } from '../types/CommandTreeVersion'
export { CommandTree as FallbackCommandTree } from './CommandTree1.16'

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
