import { plugins } from '..'
import { TextRange } from './TextRange'

export type MacroComponentData = {
    template: string,
    placeholders: Set<string>,
    range: TextRange
}

export interface MacroComponent extends plugins.SyntaxComponent<MacroComponentData> {

}

export namespace MacroComponent {
    export function unfinished(): MacroComponentData {
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
