import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { formatMessage, arrayToMessage, resolvePathOfObject, escapeString } from '../../utils/utils'

describe('utils.ts Tests', () => {
    describe('formatMessage() Tests', () => {
        it('Should capitalize the first letter and append period', () => {
            const message = 'expected something'
            const actual = formatMessage(message)
            assert(actual === 'Expected something.')
        })
    })
    describe('arrayToMessage() Tests', () => {
        it('Should return message for empty array', () => {
            const arr: string[] = []
            const actual = arrayToMessage(arr)
            assert(actual === 'nothing')
        })
        it('Should return message for one-element array', () => {
            const arr = ['foo']
            const actual = arrayToMessage(arr)
            assert(actual === '`foo`')
        })
        it('Should return message for two-element array', () => {
            const arr = ['bar', 'foo']
            const actual = arrayToMessage(arr)
            assert(actual === '`bar` and `foo`')
        })
        it('Should return message for multi-element array', () => {
            const arr = ['bar', 'baz', 'foo']
            const actual = arrayToMessage(arr)
            assert(actual, '`bar` === `baz` and `foo`')
        })
    })
    describe('resolvePathOfObject() Tests', () => {
        it('Should resolve string key of object', () => {
            const path = 'foo'
            const obj = { foo: 'foo' }
            const actual = resolvePathOfObject(obj, path)
            assert(actual === 'foo')
        })
        it('Should resolve number key of array', () => {
            const path = '1'
            const obj = ['foo', 'bar']
            const actual = resolvePathOfObject(obj, path)
            assert(actual === 'bar')
        })
        it('Should resolve recursive keys', () => {
            const path = 'foo.1.bar.0'
            const obj = { foo: ['baz', { bar: ['qux'] }] }
            const actual = resolvePathOfObject(obj, path)
            assert(actual === 'qux')
        })
    })
    describe('escapeString() Tests', () => {
        it('Should escape string.',()=>{
            const str = `{Text1:'{\\"text\\":\\"\\"}'}`
            const actual = escapeString(str)
            assert(actual === `{Text1:'{\\\\\\"text\\\\\\":\\\\\\"\\\\\\"}'}`)
        })
    })
})
