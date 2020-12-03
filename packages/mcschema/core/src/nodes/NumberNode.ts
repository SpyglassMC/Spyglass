import { INode, Base } from './Node'

type NumberNodeConfig = {
  /** Whether only integers are allowed */
  integer?: boolean
  /** If specified, number will be capped at this minimum */
  min?: number
  /** If specified, number will be capped at this maximum */
  max?: number,
  /** Whether the number represents a color */
  color?: boolean
}

export type NumberHookParams = {
  integer: boolean,
  min: number,
  max: number,
  between: boolean,
  config: NumberNodeConfig
}

export const NumberNode = (config?: NumberNodeConfig): INode<number> => {
  const integer = config?.color ? true : config?.integer ?? false
  const min = config?.color ? 0 : config?.min ?? -Infinity
  const max = config?.color ? 16777215 : config?.max ?? Infinity
  const between = config?.min !== undefined && config?.max !== undefined

  return {
    ...Base,
    type: () => 'number',
    default: () => min > 0 ? min : 0,
    validate(path, value, errors, options) {
      if (options.loose && typeof value !== 'number') {
        value = this.default()
      }
      if (typeof value !== 'number') {
        errors.add(path, 'error.expected_number')
      } else if (integer && !Number.isInteger(value)) {
        errors.add(path, 'error.expected_integer')
      } else if (between && (value < min || value > max)) {
        errors.add(path, 'error.expected_number_between', min, max)
      } else if (value < min) {
        errors.add(path, 'error.invalid_range.smaller', value, min)
      } else if (value > max) {
        errors.add(path, 'error.invalid_range.larger', value, max)
      }
      return value
    },
    hook(hook, path, ...args) {
      return hook.number({ node: this, integer, min, max, between, config: config ?? {} }, path, ...args)
    }
  }
}
