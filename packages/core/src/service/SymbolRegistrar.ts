import type { SymbolUtil } from '../symbol'

export type SymbolRegistrar = (this: void, symbols: SymbolUtil, ctx: SymbolRegistrarContext) => void

export interface SymbolRegistrarContext { }
