import type { InfallibleParser, ResourceLocationNode, ResourceLocationOptions } from '@spyglassmc/core'
import { resourceLocation } from '@spyglassmc/core'

export function minecraftIdentifier(options: ResourceLocationOptions): InfallibleParser<ResourceLocationNode> {
	return resourceLocation({
		allowTag: false,
		isPredicate: true,
		...options,
	})
}
