import { INode, Base } from './Node'
import { Path, ModelPath } from '../model/Path'
import { Errors } from '../model/Errors'
import { quoteString } from '../utils'

export const Switch = Symbol('switch')
export const Case = Symbol('case')

export type NodeChildren = {
  [name: string]: INode
}

export type NestedNodeChildren = {
  [name: string]: NodeChildren
}

export type IObject = {
  [name: string]: any
}

export type FilteredChildren = {
  [name: string]: INode
  /** The field to filter on */
  [Switch]?: (path: ModelPath) => ModelPath
  /** Map of filter values to node fields */
  [Case]?: NestedNodeChildren
}

type ObjectNodeConfig = {
  collapse?: boolean,
  context?: string,
  disableSwitchContext?: boolean,
  category?: string
}

export type ObjectHookParams = {
  fields: NodeChildren,
  filter?: (path: ModelPath) => ModelPath,
  cases?: NestedNodeChildren,
  getActiveFields: (path: ModelPath) => NodeChildren
  getChildModelPath: (path: ModelPath, childKey: string) => ModelPath
}

export const ObjectNode = (fields: FilteredChildren, config?: ObjectNodeConfig): INode<IObject> => {
  const { [Switch]: filter, [Case]: cases, ...defaultFields } = fields

  const getActiveFields = (path: ModelPath): NodeChildren => {
    if (filter === undefined) return defaultFields
    const switchValue = filter(path).get()
    const activeCase = cases![switchValue]
    return { ...defaultFields, ...activeCase }
  }

  const getChildModelPath = (path: ModelPath, childKey: string): ModelPath => {
    const switchValue = filter?.(path).get()
    const caseFields = filter ? (cases![switchValue] ?? {}) : {}
    const caseKeys = Object.keys(caseFields)
    const pathWithContext = (config?.context) ?
      new ModelPath(path.getModel(), new Path(path.getArray(), [config.context])) : path
    const pathWithFilter = !config?.disableSwitchContext && switchValue && caseKeys.includes(childKey) ?
      pathWithContext.contextPush(switchValue) : pathWithContext
    return pathWithFilter.push(childKey)
  }

  return ({
    ...Base,
    type: () => 'object',
    category: () => config?.category,
    default: () => ({}),
    keep() {
      return this.optional()
    },
    navigate(path, index) {
      const nextIndex = index + 1
      const pathElements = path.getArray()
      if (pathElements.length <= nextIndex) {
        return this
      }
      const activeFields = getActiveFields(path.slice(0, nextIndex))
      const node = activeFields[pathElements[nextIndex]]
      return node?.navigate(path, nextIndex)
    },
    pathPush(path, key) {
      return getChildModelPath(path, key.toString())
    },
    suggest(path, value) {
      const activeFields = getActiveFields(path)
      const existingKeys = Object.keys(typeof value === 'object' ? value : {})
      return Object.keys(activeFields)
        .filter(k => !existingKeys.includes(k))
        .map(quoteString)
    },
    validate(path, value, errors, options) {
      if (options.loose && typeof value !== 'object') {
        value = this.default()
      }
      if (typeof value !== 'object') {
        errors.add(path, 'error.expected_object')
        return value
      }
      let activeFields = defaultFields
      if (filter) {
        const filterPath = filter(path)
        let switchValue = filterPath.get()
        if (path.equals(filterPath.pop())) {
          const filterField = filterPath.last()
          switchValue = defaultFields[filterField].validate(path.push(filterField), value[filterField], new Errors(), options)
        }
        activeFields = { ...activeFields, ...cases![switchValue] }
      }
      const activeKeys = Object.keys(activeFields)
      const forcedKeys = activeKeys.filter(k => !activeFields[k].optional())
      const keys = new Set([...forcedKeys, ...Object.keys(value)])
      let res: any = {}
      keys.forEach(k => {
        if (activeKeys.includes(k)) {
          if (!activeFields[k].enabled(path)) return
          const newValue = activeFields[k].validate(path.push(k), value[k], errors, options)
          if (!activeFields[k].keep() && activeFields[k].optional()
             && (newValue === undefined
              || (Array.isArray(newValue) && newValue.length === 0)
              || (newValue.constructor === Object && Object.keys(newValue).length === 0))) {
            res[k] = undefined
          } else {
            res[k] = newValue
            path.getModel()!.set(path.push(k), newValue, true)
          }
        } else {
          res[k] = value[k]
        }
      })
      return res
    },
    hook(hook, path, ...args) {
      return hook.object({ node: this, fields: defaultFields, filter, cases, getActiveFields, getChildModelPath }, path, ...args)
    }
  })
}
