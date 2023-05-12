/**
 * A reference of the JSON serialized format of the NBT docs
 * 
 * https://github.com/Yurihaia/nbtdoc-rs/blob/master/docs/json_format.d.ts
 * 
 * @author Yurihaia https://github.com/Yurihaia
 * @license MIT https://github.com/Yurihaia/nbtdoc-rs/blob/master/LICENSE-MIT
 */
export namespace nbtdoc {
    /**
     * A reference to an element inside an `Arena`
     */
    export type Index<T> = number
    /**
     * A referenceable list
     */
    export type Arena<T> = T[]
    /**
     * A type of index
     */
    export type ItemIndex = { Compound: Index<CompoundTag> } |
    { Enum: Index<EnumItem> } |
    { Module: Index<Module> }

    /**
     * A segment of a path to an actual NBT value
     */
    export type FieldPath = 'Super' | { Child: string }

    /**
     * The type that a field can be
     */
    export type NbtValue = 'Boolean' |
    { 
        /**i8 range*/
        Byte: NumberTag
    } |
    { 
        /**i16 range*/
        Short: NumberTag
    } |
    { 
        /**i32 range*/
        Int: NumberTag
    } |
    { 
        /**i64 range, lossy in JS*/
        Long: NumberTag
    } |
    { 
        /**f32 range*/
        Float: NumberTag
    } |
    { 
        /**f64 range*/
        Double: NumberTag
    } |
    'String' |
    {
        /**i8 value range*/ 
        ByteArray: NumberArrayTag
    } |
    {
        /**i32 value range*/ 
        IntArray: NumberArrayTag
    } |
    {
        /**i64 value range*/ 
        LongArray: NumberArrayTag
    } |
    { Compound: Index<CompoundTag> } |
    { Enum: Index<EnumItem> } |
    { List: {
        /**positive i32 range*/
        length_range: Range | null,
        value_type: NbtValue
    } } |
    { Index: {
        /**ID*/
        target: string,
        path: FieldPath[]
    } } |
    {
        /**ID*/
        Id: string
    } |
    { Or: NbtValue[] }

    /**
     * Internal Use
     * Signifies a certain inject that has not been executed yet
     */
    type UnresolvedInject = { Compound: [string, Field][]} | { Enum: EnumType }

    /**
     * A range of numbers. Both sides inclusive
     */
    type Range = [number | null, number | null]

    /**
     * The different types of enums
     */
    export type EnumType = { Byte: {
        /**i8 range*/ 
        [key: string]: EnumOption<number>
    } } | 
    { Short: {
        /**i16 range*/
        [key: string]: EnumOption<number>
    } } | 
    { Int: {
        /**i32 range*/
        [key: string]: EnumOption<number>
    } } | 
    { Long: {
        /**i64 range, lossy in JS*/ 
        [key: string]: EnumOption<number>
    } } | 
    { Float: {
        /**f32 range*/ 
        [key: string]: EnumOption<number>
    } } | 
    { Double: {
        /**f64 range*/ 
        [key: string]: EnumOption<number>
    } } | 
    { String: {
        [key: string]: EnumOption<string>
    } }

    /**
     * The main struct in the validation process
     */
    export interface Root {
        registries: {
            [/**ID*/ key: string]: [
                {    
                    [/**ID*/ key: string]: Index<CompoundTag>
                },
                (Index<CompoundTag> | null)
            ]
        },
        root_modules: { [key: string]: Index<Module> },
        compound_arena: Arena<CompoundTag>,
        enum_arena: Arena<EnumItem>,
        module_arena: Arena<Module>,
        /** Only needed for inner workings */
        unresolved_inject: Array<
        { Unregistered: [ string[], UnresolvedInject ]} |
        { Registered: [ ItemIndex, UnresolvedInject, string ]}
        >
    }

    /**
     * A specific compound definition
     */
    export interface CompoundTag {
        description: string,
        fields: { [key: string]: Field },
        supers: (
            { Compound: Index<CompoundTag> } |
            { Registry: {
                /**ID*/
                target: string,
                path: FieldPath[]
            } } |
            null
        )
    }

    /**
     * A field in a compound definition
     */
    export interface Field {
        description: string,
        nbttype: NbtValue
    }

    /**
     * An individual module
     */
    export interface Module {
        children: { [key: string]: ItemIndex },
        parent: Index<Module> | null
    }

    /**
     * A value enumeration
     */
    export interface EnumItem {
        et: EnumType,
        description: string
    }

    /**
     * An individual enum option
     */
    export interface EnumOption<T> {
        value: T,
        description: string
    }

    /**
     * A scalar number NBT value
     */
    export interface NumberTag {
        range: Range | null
    }

    /**
     * A scalar number array NBT value
     */
    export interface NumberArrayTag {
        /**positive i32 range*/
        length_range: Range | null,
        value_range: Range | null
    }
}
