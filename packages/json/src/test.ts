import { testParser } from '@spyglassmc/core/test-out/utils'
import { JsonAstNode } from './node'
import { entry } from './parser'
import './schema/data/loot_table'
import { loot_table } from './schema/data/loot_table'
import { SchemaContext } from './schema/SchemaContext'

const table1 = testParser(entry, `{
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "item"
        }
      ]
    }
  ]
}`)

console.log(table1)
const ctx1 = new SchemaContext(table1.node as JsonAstNode, '')
loot_table(ctx1)
