import * as core from '@spyglassmc/core'
import { ReleaseVersion } from '../../dependency/index.js'

export const ColorArgumentValues = [...core.Color.ColorNames, 'reset']

export const EntityAnchorArgumentValues = ['feet', 'eyes']

export const GamemodeArgumentValues = ['adventure', 'survival', 'creative', 'spectator']

export function getItemSlotArgumentValues(ctx: core.ContextBase) {
	const release = ctx.project['loadedVersion'] as ReleaseVersion
	const output = [
		...[...Array(54).keys()].map((n) => `container.${n}`),
		...[...Array(27).keys()].map((n) => `enderchest.${n}`),
		...[...Array(15).keys()].map((n) => `horse.${n}`),
		...[...Array(9).keys()].map((n) => `hotbar.${n}`),
		...[...Array(27).keys()].map((n) => `inventory.${n}`),
		...[...Array(8).keys()].map((n) => `villager.${n}`),
		'armor.chest',
		'armor.feet',
		'armor.head',
		'armor.legs',
		'horse.chest',
		'horse.saddle',
		'weapon',
		'weapon.mainhand',
		'weapon.offhand',
	]
	if (ReleaseVersion.cmp(release, '1.20.5') >= 0) {
		output.push(
			...[...Array(4).keys()].map((n) => `player.crafting.${n}`),
			'armor.body',
			'contents',
			'player.cursor',
		)
	} else {
		output.push('horse.armor')
	}
	return output
}

// Only exists since 1.20.5
export function getItemSlotsArgumentValues(ctx: core.ContextBase) {
	return [
		...getItemSlotArgumentValues(ctx),
		'armor.*',
		'container.*',
		'enderchest.*',
		'horse.*',
		'hotbar.*',
		'inventory.*',
		'player.crafting.*',
		'villager.*',
		'weapon.*',
	]
}

export const OperationArgumentValues = ['=', '+=', '-=', '*=', '/=', '%=', '<', '>', '><']

export function getScoreboardSlotArgumentValues(ctx: core.ContextBase) {
	const release = ctx.project['loadedVersion'] as ReleaseVersion
	return [
		ReleaseVersion.cmp(release, '1.20.2') < 0 ? 'belowName' : 'below_name',
		'list',
		'sidebar',
		...core.Color.ColorNames.map((n) => `sidebar.team.${n}`),
	]
}

export const SwizzleArgumentValues = [
	'x',
	'xy',
	'xz',
	'xyz',
	'xzy',
	'y',
	'yx',
	'yz',
	'yxz',
	'yzx',
	'z',
	'zx',
	'zy',
	'zxy',
	'zyx',
]

export const HeightmapValues = [
	'motion_blocking',
	'motion_blocking_no_leaves',
	'ocean_floor',
	'ocean_floor_wg',
	'world_surface',
	'world_surface_wg',
]

export const RotationValues = ['none', 'clockwise_90', '180', 'counterclockwise_90']

export const MirrorValues = ['none', 'left_right', 'front_back']
