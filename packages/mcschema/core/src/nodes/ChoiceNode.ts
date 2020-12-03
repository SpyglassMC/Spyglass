import { INode } from './Node'
import { ListNode } from './ListNode'
import { SwitchNode } from './SwitchNode'

type Choice = {
  type: string
  priority?: number,
  node: INode<any>
  match?: (value: any) => boolean
  change?: (old: any) => any
}

type ChoiceNodeConfig = {
  context?: string,
  choiceContext?: string
}

export type ChoiceHookParams = {
  choices: Choice[],
  config: ChoiceNodeConfig,
  switchNode: INode
}

/**
 * Node that allows multiple types
 */
export const ChoiceNode = (choices: Choice[], config?: ChoiceNodeConfig): INode<any> => {
  const isValid = (choice: Choice, value: any) => {
    if (choice.match) {
      return choice.match(value)
    }
    switch (choice.type) {
      case 'list': return Array.isArray(value)
      case 'object': return typeof value === 'object' && !Array.isArray(value)
      default: return typeof value === choice.type
    }
  }
  const switchNode = SwitchNode(choices.map(c => ({
    type: c.type,
    priority: c.priority,
    match: (path) => isValid(c, path.get()),
    node: c.node
  })))

  return {
    ...switchNode,
    validate(path, value, errors, options) {
      let choice = switchNode.activeCase(path, true)
      if (choice.node.optional()) {
        return value
      }
      return choice.node.validate(path, value, errors, options)
    },
    hook(hook, path, ...args) {
      return hook.choice({ node: this, choices, config: config ?? {}, switchNode}, path, ...args)
    }
  }
}

const XOrList = (x: string): ((node: INode<any>, config?: ChoiceNodeConfig) => INode<any>) => ((node, config) => {
  return ChoiceNode([
    {
      type: x,
      node,
      change: v => v[0] ?? node.default()
    },
    {
      type: 'list',
      node: ListNode(node),
      change: v => v ? [v] : []
    }
  ], config)
})

export const ObjectOrList = XOrList('object')

export const StringOrList = XOrList('string')

export const ObjectOrPreset = (presetNode: INode<string>, objectNode: INode<any>, presets: {[preset: string]: any}): INode<any> => {
  return ChoiceNode([
    {
      type: 'string',
      priority: 1,
      node: presetNode,
      change: v => Object.keys(presets)[0]
    },
    {
      type: 'object',
      node: objectNode,
      change: v => presets[v] ?? presets[Object.keys(presets)[0]]
    }
  ])
}
