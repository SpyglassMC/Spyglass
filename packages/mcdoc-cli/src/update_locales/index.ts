import { join } from 'path'

import fs from 'fs-extra'

import walk from 'klaw'
import { ofetch } from 'ofetch'

type MetaLocale = {
	old_keys: string[]
	old_values: string[]
	new_keys: string[]
	new_values: string[]
}

export async function update_locales() {
	console.log('Reading locale diff')

	const locales: MetaLocale = JSON.parse(
		await fs.readFile(join('out', 'meta', 'locale.json'), 'utf-8'),
	)

	const removed_keys: [string, string][] = []
	const added_keys: [string, string][] = []

	let moved_keys_count = 0
	const moved_keys: Record<string, string> = {}
	let changed_values_count = 0
	const changed_values: [key: string, [from: string, to: string]][] = []

	for (let i = 0; i < locales.old_keys.length; i++) {
		let keyRemoved = false
		const keyIndex = locales.new_keys.indexOf(locales.old_keys[i])
		if (keyIndex === -1) {
			keyRemoved = true
		}
		let valueRemoved = false
		const valueIndex = locales.new_values.indexOf(locales.old_values[i])
		if (valueIndex === -1) {
			valueRemoved = true
		}
		if (keyRemoved && valueRemoved) {
			removed_keys.push([locales.old_keys[i], locales.old_values[i]])
		} else if (keyRemoved && !valueRemoved) {
			if (
				locales.new_values.filter(value => value === locales.old_values[i])
					.length > 1
			) {
				removed_keys.push([locales.old_keys[i], locales.old_values[i]])
				console.log('Duplicate key removed:', locales.old_keys[i])
			} else {
				// the key was moved
				moved_keys[locales.old_keys[i]] = locales.new_keys[valueIndex]
				moved_keys_count++
			}
		} else {
			// value changed
			changed_values.push([locales.old_keys[i], [
				locales.old_values[i],
				locales.new_values[keyIndex],
			]])
			changed_values_count++
		}
	}
	for (let i = 0; i < locales.new_keys.length; i++) {
		if (
			!moved_keys[locales.new_keys[i]]
			&& !locales.old_keys.includes(locales.new_keys[i])
		) {
			added_keys.push([locales.new_keys[i], locales.new_values[i]])
		}
	}
	console.log(`Removed ${removed_keys.length} keys:`, removed_keys)
	console.log(`Added ${added_keys.length} keys:`, added_keys)
	console.log(`Moved ${moved_keys_count} keys:`, moved_keys)
	console.log(`Changed ${changed_values_count} values:`, changed_values)
	if (moved_keys_count > 0) {
		console.log('Moving keys')
		for await (const locale_file of walk(join('out', 'locale'))) {
			if (!locale_file.path.endsWith('en-us.json')) {
				const locale = JSON.parse(
					await fs.readFile(locale_file.path, 'utf-8'),
				)

				let have_moved = 0

				for (const key of Object.keys(moved_keys)) {
					if (locale[key]) {
						locale[moved_keys[key]] = locale[key]
						delete locale[key]

						have_moved++
					}
				}

				await fs.writeFile(
					locale_file.path,
					JSON.stringify(locale, undefined, 3),
				)

				if (have_moved > 0) {
					console.log(`Moved ${have_moved} keys in ${locale_file.path}`)
				}
			}
		}
	}
	const webhook = process.env.TRANSLATION_UPDATE_WEBHOOK

	if (changed_values_count > 0 && webhook) {
		console.log('Notifying translators about changed values')

		let description = ''

		for (const [key, [from, to]] of changed_values) {
			const isPeriod = to.slice(-1)

			if (isPeriod !== '.' && from.slice(0, -1) !== to) {
				description +=
					`- \`${key}\` changed, before/after:\n  - \`${from}\`\n  - \`${to}\`\n`
			}
		}

		await ofetch(webhook, {
			method: 'POST',
			body: {
				content: '',
				embeds: [
					{
						color: 1863349,
						title: 'mcdoc translation key values changed in en-us.json',
						description,
					},
				],
			},
		})
	}
}
