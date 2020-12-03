import { INode, Base } from './Node'

export type BooleanHookParams = {}

/**
 * Boolean node with two buttons for true/false
 */
export const BooleanNode = (): INode<boolean> => {
  return {
    ...Base,
    type: () => 'boolean',
    default: () => false,
    suggest: () => ['false', 'true'],
    validate(path, value, errors, options) {
      if (options.loose && typeof value !== 'boolean') {
        value = this.default()
      }
      if (typeof value !== 'boolean' || value === undefined) {
        errors.add(path, 'error.expected_boolean')
      }
      return value
    },
    hook(hook, path, ...args) {
      return hook.boolean({ node: this}, path, ...args)
    }
  }
}
