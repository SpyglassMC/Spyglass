import type { SymbolUtil } from '../symbol/index.js'

export type SymbolRegistrar = (this: void, symbols: SymbolUtil, ctx: SymbolRegistrarContext) => void

export interface SymbolRegistrarContext {}
