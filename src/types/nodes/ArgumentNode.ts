import Formattable from '../Formattable'

export const NodeType = Symbol('NodeType')

export default interface ArgumentNode extends Formattable {
    [NodeType]: string
}
