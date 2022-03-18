import * as core from '@spyglassmc/core'

export const ColorArgumentValues = [
	...core.Color.ColorNames,
	'reset',
]

export const SwizzleArgumentValues = [
	'x', 'xy', 'xz', 'xyz', 'xzy',
	'y', 'yx', 'yz', 'yxz', 'yzx',
	'z', 'zx', 'zy', 'zxy', 'zyx',
]
