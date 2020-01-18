import * as path from 'path'
import Lintable, { ToLintedString } from './Lintable'
import { ClientCache, CacheKey } from './ClientCache'
import { LintConfig } from './Config'
import { sep } from 'path'

export default class Identity implements Lintable {
    static readonly DefaultNamespace = 'minecraft'
    static readonly Sep = '/'
    static readonly TagSymbol = '#'

    constructor(
        readonly namespace = Identity.DefaultNamespace,
        readonly path: string[] = [],
        readonly isTag = false
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
    toRel(category: keyof ClientCache, side: 'assets' | 'data' = 'data') {
        let datapackCategory: string
        let ext: string
        if (category === 'tags/entityTypes') {
            datapackCategory = `tags${sep}entity_types`
        } else if (category === 'lootTables') {
            datapackCategory = 'loot_tables'
        } else {
            datapackCategory = category.replace(/\//g, sep)
        }
        if (category === 'functions') {
            ext = '.mcfunction'
        } else {
            ext = '.json'
        }
        return `${side}${sep}${this.namespace}${sep}${datapackCategory}${sep}${this.path.join(sep)}${ext}`
    }

    /**
     * 
     * @param rel The relative path from the workspace. Returns `undefined` if the path is in an invalid
     * datapack category.
     */
    /* istanbul ignore next */
    static fromRel(rel: string): { id: Identity, category: keyof ClientCache, ext: string, side: 'assets' | 'data' } | undefined {
        rel = path.normalize(rel)
        const segs = rel.split(/[/\\]/)
        const ext = path.extname(rel)
        if (segs[0] === 'assets' || segs[0] === 'data') {
            const side = segs[0]
            const namespace = segs[1]
            const datapackCategory = segs[2]
            const paths = segs.slice(3)
            if (side && namespace && datapackCategory && paths.length > 0) {
                paths[paths.length - 1] = path.basename(paths[paths.length - 1], ext)
                const id = new Identity(namespace, paths)
                let category: keyof ClientCache
                if (datapackCategory === 'tags') {
                    switch (paths[0]) {
                        case 'entity_types':
                            category = 'tags/entityTypes'
                            break
                        case 'blocks':
                        case 'fluids':
                        case 'functions':
                        case 'items':
                            category = `tags/${paths[0]}` as CacheKey
                            break
                        default:
                            return undefined
                    }
                    paths.splice(0, 1)
                } else if (datapackCategory === 'loot_tables') {
                    category = 'lootTables'
                } else if (
                    datapackCategory === 'advancements' ||
                    datapackCategory === 'functions' ||
                    datapackCategory === 'predicates' ||
                    datapackCategory === 'recipes'
                ) {
                    category = datapackCategory
                } else {
                    return undefined
                }
                return { id, category, ext, side }
            }
        }
        return undefined
    }

    static fromString(str: string) {
        if (str[0] === Identity.TagSymbol) {
            str = str.slice(1)
        }
        const parts = str.split(':')
        if (parts.length === 1) {
            return new Identity(undefined, parts[0].split(Identity.Sep))
        } else {
            return new Identity(parts[0], parts[1].split(Identity.Sep))
        }
    }

    static isExtValid(ext: string, category: CacheKey) {
        return (
            (category === 'functions' && ext === '.mcfunction') ||
            (category !== 'functions' && ext === '.json')
        )
    }
}
