import assert = require('power-assert')
import { describe, it } from 'mocha'
import { checkNamingConvention, NamingConventionConfig } from '../../types/NamingConventionConfig'
import { DiagnosticConfig } from '../../types/StylisticConfig'

describe('NamingConventionConfig Tests', () => {
    describe('checkNamingConvention() Tests', () => {
        it('Should return true for camelCase', () => {
            const identities = ['l', 'lower', 'lowerC', 'lowerIP', 'lowerCamel', 'camelCase']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'camelCase']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for camelCase', () => {
            const identities = ['', 'Upper']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'camelCase']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for PascalCase', () => {
            const identities = ['U', 'Upper', 'UpperC', 'UpperIP', 'XMLHttpRequest', 'UpperCamel', 'PascalCase']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'PascalCase']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for PascalCase', () => {
            const identities = ['', 'lower']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'PascalCase']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for snake_case', () => {
            const identities = ['s', 'snake', 'snake_case', 'snake_snake_snake']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'snake_case']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for snake_case', () => {
            const identities = ['', 'snake_', 'snAke_snAke']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'snake_case']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for SCREAMING_SNAKE_CASE', () => {
            const identities = ['S', 'SCREAMING', 'SCREAMING_SNAKE', 'SCREAMING_SNAKE_CASE']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'SCREAMING_SNAKE_CASE']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for SCREAMING_SNAKE_CASE', () => {
            const identities = ['', 'snake', 'SCREAMING_']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'SCREAMING_SNAKE_CASE']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for kebab-case', () => {
            const identities = ['kebab', 'kebab-case', 'kebab-kebab-kebab']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'kebab-case']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for kebab-case', () => {
            const identities = ['', 'kebab-', 'kebAb-case']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'kebab-case']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for UPPERCASE', () => {
            const identities = ['UPPERCASE', 'UPPERCASE2']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'UPPERCASE']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for UPPERCASE', () => {
            const identities = ['camelCase', 'PascalCase', 'snake_case', 'SCREAMING_SNAKE_CASE', 'kebab-case', 'lowercase']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'UPPERCASE']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for lowercase', () => {
            const identities = ['lowercase', 'lowercase2']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'lowercase']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for lowercase', () => {
            const identities = ['camelCase', 'PascalCase', 'snake_case', 'SCREAMING_SNAKE_CASE', 'kebab-case', 'UPPERCASE']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', 'lowercase']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for regexp', () => {
            const identities = ['$regexp', '$$double', '$']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', '/^\\$.*$/']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for regexp', () => {
            const identities = ['regexp', 'd$ouble', '#regexp']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', '/^\\$.*$/']
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for null', () => {
            const identities = ['l', 'U', 'camelCase', 'PascalCase', 'snake_case', 'SCREAMING_SNAKE_CASE', 'kebab-case']
            const config: DiagnosticConfig<NamingConventionConfig> = null
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return true for [camelCase, PascalCase]', () => {
            const identities = [
                'l', 'lower', 'lowerC', 'lowerIP', 'lowerCamel', 'camelCase',
                'U', 'Upper', 'UpperC', 'PascalCase'
            ]
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', ['camelCase', 'PascalCase']]
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for [camelCase, PascalCase]', () => {
            const identities = ['', '---']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', ['camelCase', 'PascalCase']]
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for complex case', () => {
            const identities = ['$camelCase.PascalCase', '$camel.Pascal', '$c.P', '$camelCaseCamelCase.PascalCasePascalCase']
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', {
                label: 'test',
                prefix: '$',
                allowLessParts: false,
                allowMoreParts: false,
                sep: '.',
                parts: ['camelCase', 'PascalCase']
            }]
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for complex case', () => {
            const identities = [
                '$PascalCase.camelCase', '$Pascal.camel', '$kebab-case.camelCase',
                '$snake_case.UPPERCASE', 'camelCase.PascalCase', '$'
            ]
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', {
                label: 'test',
                prefix: '$',
                allowLessParts: false,
                allowMoreParts: false,
                sep: '.',
                parts: ['camelCase', 'PascalCase']
            }]
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for more complex case', () => {
            const identities = [
                'camelCase:PascalCase:lowercase+.-regexp/snake_case/UPPERCASE.SCREAMING_SCAKE_CASE*SCREAMING_SCAKE_CASE.kebab-case~kebab-case'
            ]
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', {
                label: 'test',
                allowLessParts: false,
                allowMoreParts: false,
                sep: '.',
                parts: [
                    {
                        suffix: '+',
                        sep: ':',
                        parts: ['camelCase', 'PascalCase', 'lowercase']
                    },
                    {
                        prefix: '-',
                        sep: '/',
                        parts: ['/^regexp$/', 'snake_case', 'UPPERCASE']
                    },
                    {
                        sep: '*',
                        parts: 'SCREAMING_SNAKE_CASE'
                    },
                    {
                        sep: '~',
                        parts: 'kebab-case'
                    }
                ]
            }]
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for more complex case', () => {
            const identities = [
            /// 'camelCase:PascalCase:lowercase+.-regexp/snake_case/UPPERCASE.SCREAMING_SCAKE_CASE*SCREAMING_SCAKE_CASE.kebab-case~kebab-case'
                'camelCase:PascalCase:lowercase.-regexp/snake_case/UPPERCASE.SCREAMING_SCAKE_CASE*SCREAMING_SCAKE_CASE.kebab-case~kebab-case',
                'camelCase:PascalCase:lowercase+.-snake_case/regexp/UPPERCASE.SCREAMING_SCAKE_CASE*SCREAMING_SCAKE_CASE.kebab-case~kebab-case',
                'camelCase~PascalCase~lowercase+.-regexp*snake_case*UPPERCASE.SCREAMING_SCAKE_CASE/SCREAMING_SCAKE_CASE.kebab-case:kebab-case',
                'camelCase'
            ]
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', {
                label: 'test',
                allowLessParts: false,
                allowMoreParts: false,
                sep: '.',
                parts: [
                    {
                        suffix: '+',
                        sep: ':',
                        parts: ['camelCase', 'PascalCase', 'lowercase']
                    },
                    {
                        prefix: '-',
                        sep: '/',
                        parts: ['/^regexp$/', 'snake_case', 'UPPERCASE']
                    },
                    {
                        sep: '*',
                        parts: 'SCREAMING_SNAKE_CASE'
                    },
                    {
                        sep: '~',
                        parts: 'kebab-case'
                    }
                ]
            }]
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
        it('Should return true for complex cases where the number of parts does not match', () => {
            const identities = [
                'SCREAMING_SNAKE_CASE',
                'SCREAMING_SNAKE_CASE.PascalCase',
                'SCREAMING_SNAKE_CASE.PascalCase.UPPERCASE',
                'SCREAMING_SNAKE_CASE.PascalCase.UPPERCASE.UPPERCASE',
                'SCREAMING_SNAKE_CASE.PascalCase.UPPERCASE.UPPERCASE.UPPERCASE.UPPERCASE.UPPERCASE'
            ]
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', {
                label: 'test',
                allowLessParts: true,
                allowMoreParts: true,
                sep: '.',
                parts: ['SCREAMING_SNAKE_CASE', 'PascalCase', 'UPPERCASE']
            }]
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === true)
            }
        })
        it('Should return false for complex cases where the number of parts does not match', () => {
            const identities = [
                'SCREAMING_SNAKE_CASE',
                'SCREAMING_SNAKE_CASE.PascalCase',
                // 'SCREAMING_SNAKE_CASE.PascalCase.UPPERCASE',
                'SCREAMING_SNAKE_CASE.PascalCase.UPPERCASE.UPPERCASE',
                'SCREAMING_SNAKE_CASE.PascalCase.UPPERCASE.UPPERCASE.UPPERCASE.UPPERCASE.UPPERCASE'
            ]
            const config: DiagnosticConfig<NamingConventionConfig> = ['warning', {
                label: 'test',
                allowLessParts: false,
                allowMoreParts: false,
                sep: '.',
                parts: ['SCREAMING_SNAKE_CASE', 'PascalCase', 'UPPERCASE']
            }]
            for (const id of identities) {
                const actual = checkNamingConvention(id, config)
                assert(actual === false)
            }
        })
    })
})
