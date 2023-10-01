import { plugins } from '..'
import { TextRange } from './TextRange'

export type MacroData = {
    template: string,
    placeholders: Set<string>,
    range: TextRange
}

export namespace MacroData {
    export function unfinished(): MacroData {
        return {
            template: '',
            placeholders: new Set(),
            range: {
                start: 0,
                end: 0
            }
        }
    }
}
