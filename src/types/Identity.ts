import * as path from 'path'
import * as fs from 'fs-extra'
import Lintable, { ToLintedString } from './Lintable'
import { Cache } from './Cache'
import { LintConfig } from './Config'
import { sep } from 'path'

export default class Identity implements Lintable {
    static readonly DefaultNamespace = 'minecraft'
    static readonly Sep = '/'
    static readonly TagSymbol = '#'

    constructor(
        private readonly namespace = Identity.DefaultNamespace,
        private readonly path: string[] = [],
        private readonly isTag = false
    ) { }

    [ToLintedString](lint: LintConfig): string {
        let id
        if (lint.omitDefaultNamespace && this.namespace === Identity.DefaultNamespace) {
            id = this.path.join(Identity.Sep)
        } else {
            id = `${this.namespace}:${this.path.join(Identity.Sep)}`
        }
        return `${this.isTag ? Identity.TagSymbol : ''}${id}`
    }

    /**
     * Convert the ID to a string in form of `${namespace}:${path}`. Will NOT begin with TagSymbol (`#`) if the ID is a tag.
     */
    toString() {
        return `${this.namespace}:${this.path.join(Identity.Sep)}`
    }

    /**
     * Convert the ID to a file path.
     * @param category The category of this namespaced ID. e.g. `functions`, `advancements`, etc.
     * @param ext The extension of the file. Defaults to `.json`.
     * @param side Is the ID serverside or clientside. Values: `assets` and `data`. Defaults to `data`.
     */
    toPath(category: keyof Cache<any>, ext: string = '.json', side: 'assets' | 'data' = 'data') {
        let datapackCategory: string
        if (category === 'tags/blocks' ||
            category === 'tags/entityTypes' ||
            category === 'tags/fluids' ||
            category === 'tags/functions' ||
            category === 'tags/items') {
            datapackCategory = 'tags'
        } else if (category === 'lootTables/block' ||
            category === 'lootTables/entity' ||
            category === 'lootTables/fishing' ||
            category === 'lootTables/generic') {
            datapackCategory = 'loot_tables'
        } else {
            datapackCategory = category
        }
        return `${side}${sep}${this.namespace}${sep}${datapackCategory}${sep}${this.path.join(sep)}${ext}`
    }

    /**
     * 
     * @param rel The relative path from the workspace. You should guarantee that the path is in a valid
     * datapack category.
     */
    /* istanbul ignore next */
    static async fromPath(rel: string):
        Promise<{ id: Identity, category: keyof Cache<any>, ext: string, side: 'assets' | 'data' }> {
        rel = path.normalize(rel)
        const segs = rel.split(path.sep)
        const ext = path.extname(rel)
        const side = segs[0] as 'assets' | 'data'
        const namespace = segs[1]
        const datapackCategory = segs[2]
        const paths = segs.slice(3)
        paths[paths.length - 1] = path.basename(paths[paths.length - 1], ext)
        const id = new Identity(namespace, paths)
        let category: keyof Cache<any>
        if (datapackCategory === 'tags') {
            switch (paths[0]) {
                case 'block':
                    category = 'tags/blocks'
                    break
                case 'entity_types':
                    category = 'tags/entityTypes'
                    break
                case 'fluids':
                    category = 'tags/fluids'
                    break
                case 'functions':
                    category = 'tags/functions'
                    break
                case 'items':
                default:
                    category = 'tags/items'
                    break
            }
        } else if (datapackCategory === 'loot_tables') {
            const file = await fs.readFile(rel, 'utf8')
            try {
                const json = JSON.parse(file)
                if (typeof json.type === 'string') {
                    if (json.type.endsWith('block')) {
                        category = 'lootTables/block'
                    } else if (json.type.endsWith('entity')) {
                        category = 'lootTables/entity'
                    } else if (json.type.endsWith('fishing')) {
                        category = 'lootTables/fishing'
                    } else {
                        category = 'lootTables/generic'
                    }
                } else {
                    category = 'lootTables/generic'
                }
            } catch (ignored) {
                category = 'lootTables/generic'
            }
        } else {
            category = datapackCategory as keyof Cache<any>
        }
        return { id, category, ext, side }
    }
}
