export default class NumberRange {
    constructor(
        private readonly type: 'integer' | 'float',
        private readonly min?: number,
        private readonly max?: number
    ) { }

    toString() {
        
    }
}
