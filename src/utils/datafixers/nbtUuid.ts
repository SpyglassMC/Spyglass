import { NbtCompoundNode } from '../../nodes/NbtCompoundNode'
import { NbtIntArrayNode } from '../../nodes/NbtIntArrayNode'
import { NbtIntNode } from '../../nodes/NbtIntNode'
import { NbtNumberNode } from '../../nodes/NbtNumberNode'
import { NbtStringNode } from '../../nodes/NbtStringNode'

const group = [8, 4, 4, 4, 12]

export function bufferFromString(string: string) {
    return Buffer.from(
        string
            .split('-')
            .reduce((p, c, i) => `${p}${c.padStart(group[i], '0')}`, ''),
        'hex'
    )
}

export function bufferFromLongs(most: bigint, least: bigint) {
    const buffer = Buffer.alloc(16)
    buffer.writeBigInt64BE(most, 0)
    buffer.writeBigInt64BE(least, 8)
    return buffer
}

/**
 * For `{ [key]: "00000001-0001-0001-0001-000000000001" }`.
 */
export function bufferFromNbtString(node: NbtCompoundNode, key: string) {
    const stringNode = node[key]
    if (stringNode instanceof NbtStringNode) {
        return bufferFromString(stringNode.valueOf())
    } else {
        throw new Error(`Expected a string node for ‘${key}’`)
    }
}


/**
 * For `{ [key]Most: 1L, [key]Least: 1L }`.
 */
export function bufferFromNbtLongs(node: NbtCompoundNode, key: string): Buffer
/**
 * For `{ [mostKey]: 1L, [leastKey]: 1L }`.
 */
export function bufferFromNbtLongs(node: NbtCompoundNode, mostKey: string, leastKey: string): Buffer
export function bufferFromNbtLongs(node: NbtCompoundNode, mostKey: string, leastKey?: string) {
    if (!leastKey) {
        leastKey = `${mostKey}Least`
        mostKey = `${mostKey}Most`
    }
    const mostNode = node[mostKey]
    const leastNode = node[leastKey]
    if (mostNode instanceof NbtNumberNode && leastNode instanceof NbtNumberNode) {
        return bufferFromLongs(BigInt(mostNode.valueOf()), BigInt(leastNode.valueOf()))
    } else {
        throw new Error(`Expected two number nodes for ‘${mostKey}’ and ‘${leastKey}’`)
    }
}

/**
 * For `{ [key]: { M: 1L, Least: 1L } }`.
 */
export function bufferFromNbtCompound(node: NbtCompoundNode, key: string) {
    const childNode = node[key]
    if (childNode instanceof NbtCompoundNode) {
        return bufferFromNbtLongs(childNode, 'M', 'L')
    } else {
        throw new Error(`Expected a compound node for ‘${key}’`)
    }
}

export function nbtIntArrayFromBuffer(buffer: Buffer) {
    const getNbtIntNode = (offset: number) => {
        const value = buffer.readInt32BE(offset)
        return new NbtIntNode(null, value, value.toString())
    }

    const ans = new NbtIntArrayNode(null)
    ans.push(
        getNbtIntNode(0),
        getNbtIntNode(4),
        getNbtIntNode(8),
        getNbtIntNode(12)
    )
    return ans
}
