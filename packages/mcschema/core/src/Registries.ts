import { INode } from './nodes/Node'

export interface Registry<T> {
  register(id: string, value: T): void
  get(id: string): T
}

/**
 * Registry for schemas
 */
export class SchemaRegistry implements Registry<INode> {
  private registry: { [id: string]: INode } = {}

  register(id: string, node: INode) {
    this.registry[id] = node
  }

  get(id: string) {
    const node = this.registry[id]
    if (node === undefined) {
      console.error(`Tried to access schema "${id}", but that doesn't exist.`)
    }
    return node
  }
}

/**
 * Registry for collections
 */
export class CollectionRegistry implements Registry<string[]> {
  private registry: { [id: string]: string[] } = {}

  register(id: string, list: string[]) {
    this.registry[id] = list
  }

  get(id: string) {
    const list = this.registry[id]
    if (list === undefined) {
      console.warn(`Tried to access collection "${id}", but that doesn't exist.`)
    }
    return list ?? []
  }
}
