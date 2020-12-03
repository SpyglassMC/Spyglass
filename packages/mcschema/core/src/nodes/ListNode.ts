import { INode, Base } from './Node'

export type ListHookParams = {
  children: INode
}

export const ListNode = (children: INode): INode<any[]> => {
  return ({
    ...Base,
    type: () => 'list',
    default: () => [],
    navigate(path, index) {
      const nextIndex = index + 1
      const pathElements = path.getArray()
      if (pathElements.length <= nextIndex) {
        return this
      }
      return children.navigate(path, nextIndex)
    },
    pathPush(path, index) {
      return path.push(parseInt(index.toString())).contextPush('entry')
    },
    validate(path, value, errors, options) {
      if (options.loose && !Array.isArray(value)) {
        value = this.default()
      }
      if (!Array.isArray(value)) {
        errors.add(path, 'error.expected_list')
        return value
      }
      return value.map((obj, index) =>
        children.validate(path.push(index), obj, errors, options)
      )
    },
    hook(hook, path, ...args) {
      return hook.list({ node: this, children }, path, ...args)
    }
  })
}
