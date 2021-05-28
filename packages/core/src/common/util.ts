import rfdc from 'rfdc'

const rfdcCircular = rfdc({ circles: true })
export function deepClone<T>(obj: T): T {
	return rfdcCircular(obj)
}
