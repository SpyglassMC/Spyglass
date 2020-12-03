import { INode, Base } from './Node'
import { ValidationOption } from '../ValidationOption'
import { quoteString } from '../utils'

export type IMap = {
  [name: string]: any
}

type MapNodeConfig = {
  validation?: ValidationOption
}

export type MapHookParams = {
  keys: INode<string>,
  children: INode,
  config: MapNodeConfig
}

/**
 * Map nodes similar to list nodes, but a string key is required to add children
 */
export const MapNode = (keys: INode<string>, children: INode, config?: MapNodeConfig): INode<IMap> => {
  return {
    ...Base,
    type: () => 'map',
    default: () => ({}),
    navigate(path, index) {
      const nextIndex = index + 1
      const pathElements = path.getArray()
      if (pathElements.length <= nextIndex) {
        return this
      }
      return children.navigate(path, nextIndex)
    },
    pathPush(path, key) {
      return path.modelPush(key)
    },
    suggest: (path) => keys.suggest(path, ''),
    validate(path, value, errors, options) {
      if (options.loose && typeof value !== 'object') {
        value = this.default()
      }
      if (value === null || typeof value !== 'object') {
        errors.add(path, 'error.expected_object')
        return value
      }
      let res: any = {}
      Object.keys(value).forEach(k => {
        keys.validate(path, k, errors, options)
        res[k] = children.validate(path.push(k), value[k], errors, options)
      })
      return res
    },
    validationOption(path) {
      return config?.validation ?? keys.validationOption(path.push(''))
    },
    hook(hook, path, ...args) {
      return hook.map({ node: this, keys, children, config: config ?? {} }, path, ...args)
    }
  }
}
