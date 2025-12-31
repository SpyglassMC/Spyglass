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
			expected.feature.inlayHint = { enabledNodes: ['my_node'] }
			assert.deepEqual(
				PartialUserPreferences.buildPreferencesFromConfigurationSafe(merge(DefaultPreferences, {
					env: {
						enableMcdocCaching: "A string? In the 'enableMcdocCahing' setting?",
					},
					feature: {
						hover: "Guess we're doing strings now",
						inlayHint: {
							enabledNodes: [
								'my_node',
								42,
							],
						},
					},
				})),
				expected,
			)
		})
	})
})
