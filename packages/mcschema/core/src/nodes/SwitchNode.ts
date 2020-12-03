import { INode, Base } from './Node'
import { ModelPath } from '../model/Path'

type Case<T> = {
  match: (path: ModelPath) => boolean
  priority?: number
  node: INode<T>
}

/**
 * Node that allows multiple types
 */
export const SwitchNode = <T>(cases: Case<T>[]): INode<T> => {
  return {
    ...Base,
    type(path) {
      return this.activeCase(path, true)
        .node.type(path)
    },
    category(path) {
      return this.activeCase(path, true)
        .node.category(path)
    },
    default: () => cases[0].node.default(),
    navigate(path, index) {
      const nextIndex = index + 1
      return this.activeCase(path.slice(0, nextIndex))
        ?.node
        .navigate(path, index)
    },
    pathPush(path, key) {
      return this.activeCase(path)?.node.pathPush(path, key) ?? path
    },
    suggest(path, value) {
      return this.activeCase(path)
        ?.node
        .suggest(path, value) ?? cases
          .filter(c => c.match(path))
          .map(c => c.node.suggest(path, value))
          .reduce((p, c) => p.concat(c))
    },
    validate(path, value, errors, options) {
      let c = this.activeCase(path)
      if (c === undefined) {
        return value
      }
      return c.node.validate(path, value, errors, options)
    },
    validationOption(path) {
      return this.activeCase(path)
        ?.node
        .validationOption(path)
    },
    activeCase(path: ModelPath, fallback?: boolean): Case<T> | undefined {
      const sorter = (a: Case<T>, b: Case<T>) => (b.priority ?? 0) - (a.priority ?? 0)
      const matchedCases = cases.filter(c => c.match(path)).sort(sorter)
      if (fallback && matchedCases.length === 0) {
        return cases.sort(sorter)[0]
      }
      return (matchedCases.length > 0 ? matchedCases[0] : undefined)
    },
    hook(hook, path, ...args) {
      return this.activeCase(path, true)
        .node.hook(hook, path, ...args)
    },
  }
}
