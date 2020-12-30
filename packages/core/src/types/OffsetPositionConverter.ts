import { Position } from './Position'

export interface OffsetPositionConverter {
	toOffset(position: Position): number
	toPosition(offset: number): Position
}
