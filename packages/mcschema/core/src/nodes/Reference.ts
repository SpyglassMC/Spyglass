import { INode, NodeOptions } from './Node'
import { Registry } from '../Registries'
import { ModelPath } from '../model/Path'
import { Errors } from '../model/Errors'
import { Hook } from '../Hook'

export const Reference = <T>(schemas: Registry<INode>, schema: string): INode<T> => ({
  type(path: ModelPath) {
    return schemas.get(schema).type.bind(this)(path)
  },
  category(path: ModelPath) {
    return schemas.get(schema).category.bind(this)(path)
  },
  default() {
    return schemas.get(schema).default.bind(this)()
  },
  transform(path: ModelPath, value: T) {
    return schemas.get(schema).transform(path, value)
  },
  enabled(path: ModelPath) {
    return schemas.get(schema).enabled.bind(this)(path)
  },
  keep() {
    return schemas.get(schema).keep.bind(this)()
  },
  optional() {
    return schemas.get(schema).optional.bind(this)()
  },
  navigate(path: ModelPath, index: number) {
    return schemas.get(schema).navigate.bind(this)(path, index)
  },
  pathPush(path: ModelPath, key: string | number) {
    return schemas.get(schema).pathPush.bind(this)(path, key)
  },
  suggest(path: ModelPath, value: T) {
    return schemas.get(schema).suggest.bind(this)(path, value)
  },
  validate(path: ModelPath, value: T, errors: Errors, options: NodeOptions) {
    return schemas.get(schema).validate.bind(this)(path, value, errors, options)
  },
  validationOption(path: ModelPath) {
    return schemas.get(schema).validationOption.bind(this)(path)
  },
  hook<U extends any[], V>(hook: Hook<U, V>, path: ModelPath, ...args: U) {
    return schemas.get(schema).hook.bind(this)(hook, path, ...args)
  },
  activeCase(path: ModelPath, fallback?: boolean) {
    return schemas.get(schema).activeCase.bind(this)(path, fallback)
  },
  canUpdate(path: ModelPath, value: any) {
    return schemas.get(schema).canUpdate.bind(this)(path, value)
  },
  update(path: ModelPath, value: any) {
    return schemas.get(schema).update.bind(this)(path, value)
  }
})
