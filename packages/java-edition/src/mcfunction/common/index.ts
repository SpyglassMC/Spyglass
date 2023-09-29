import * as core from '@spyglassmc/core'

export const ColorArgumentValues = [...core.Color.ColorNames, 'reset']

export const EntityAnchorArgumentValues = ['feet', 'eyes']

export const GamemodeArgumentValues = ['adventure', 'survival', 'creative', 'spectator']

export const ItemSlotArgumentValues = [
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
	'horse.armor',
	'horse.chest',
	'horse.saddle',
	'weapon',
	'weapon.mainhand',
	'weapon.offhand',
]

export const OperationArgumentValues = [
	'=',
	'+=',
	'-=',
	'*=',
	'/=',
	'%=',
	'<',
	'>',
	'><',
]

export const ScoreboardSlotArgumentValues = [
	'belowName',
	'list',
	'sidebar',
	...core.Color.ColorNames.map((n) => `sidebar.team.${n}`),
]

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
