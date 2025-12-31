import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { DefaultPreferences, merge, PartialUserPreferences } from '../../lib/index.js'

describe('PartialUserPreferences', () => {
	describe('buildPreferencesFromConfigurationSafe()', () => {
		it('Should keep valid configurations the same', async () => {
			assert.deepEqual(
				PartialUserPreferences.buildPreferencesFromConfigurationSafe(DefaultPreferences),
				DefaultPreferences,
			)
		})
		it('Should filter out invalid configurations', async () => {
			// Create a copy of default preferences to modify
			const expected: PartialUserPreferences = {
				env: {
					...DefaultPreferences.env,
				},
				feature: {
					...DefaultPreferences.feature,
				},
			}
			delete expected.env.enableMcdocCaching
			delete expected.feature.hover
			delete expected.feature.inlayHint
			assert.deepEqual(
				PartialUserPreferences.buildPreferencesFromConfigurationSafe(merge(DefaultPreferences, {
					env: {
						enableMcdocCaching: "A string? In the 'enableMcdocCahing' setting?",
					},
					feature: {
						hover: "Guess we're doing strings now",
						inlayHint: {
							enabledNodes: 42,
						},
					},
				})),
				expected,
			)
		})
	})
})
