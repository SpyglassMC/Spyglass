import assert from 'power-assert'
import { describe, it } from 'mocha'
import { Path } from '../model/Path'
import { DataModel } from '../model/DataModel'
import { StringNode } from '../nodes/StringNode'
import { ObjectNode } from '../nodes/ObjectNode'

describe('Path Tests', () => {
  describe('last() Tests', () => {
    it('should return the last element', () => {
      const path = new Path().push('foo');
      assert(path.last() === 'foo')
      assert(path.push('bar').last() === 'bar')
      assert(path.push('bar').pop().last() === 'foo')
    })
    it('should return undefined', () => {
      const path = new Path()
      assert(path.last() === undefined)
    })
  })
  describe('Model Tests', () => {
    it('should attach the model', () => {
      const path = new Path()
      const schema = StringNode()
      const model = new DataModel(schema)
      const pathWithModel = path.withModel(model)
      assert(pathWithModel.getModel() === model)
    })
    it('should get a path from the model', () => {
      const path = new Path()
      const schema = {...ObjectNode({
          foo: StringNode()
        }),
        default: () => ({ foo: 'value' })
      }
      const model = new DataModel(schema)
      const pathWithModel = path.withModel(model)
      assert(pathWithModel.push('foo').get() === 'value')
    })
  })
})
