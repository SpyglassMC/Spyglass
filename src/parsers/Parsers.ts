import { BlockArgumentParser } from './BlockArgumentParser'
import { DefinitionDescriptionArgumentParser } from './DefinitionDescriptionArgumentParser'
import { DefinitionIDArgumentParser } from './DefinitionIDArgumentParser'
import { EntityArgumentParser } from './EntityArgumentParser'
import { IdentityArgumentParser } from './IdentityArgumentParser'
import { ItemArgumentParser } from './ItemArgumentParser'
import { ItemSlotArgumentParser } from './ItemSlotArgumentParser'
import { LiteralArgumentParser } from './LiteralArgumentParser'
import { MessageArgumentParser } from './MessageArgumentParser'
import { NbtArgumentParser } from './NbtArgumentParser'
import { NbtPathArgumentParser } from './NbtPathArgumentParser'
import { NumberArgumentParser } from './NumberArgumentParser'
import { NumberRangeArgumentParser } from './NumberRangeArgumentParser'
import { ObjectiveArgumentParser } from './ObjectiveArgumentParser'
import { ObjectiveCriterionArgumentParser } from './ObjectiveCriterionArgumentParser'
import { ParticleArgumentParser } from './ParticleArgumentParser'
import { ScoreboardSlotArgumentParser } from './ScoreboardSlotArgumentParser'
import { StringArgumentParser } from './StringArgumentParser'
import { TagArgumentParser } from './TagArgumentParser'
import { TeamArgumentParser } from './TeamArgumentParser'
import { TextComponentArgumentParser } from './TextComponentArgumentParser'
import { TimeArgumentParser } from './TimeArgumentParser'
import { UuidArgumentParser } from './UuidArgumentParser'
import { VectorArgumentParser } from './VectorArgumentParser'

export namespace Parsers {
    export const Block = BlockArgumentParser
    export const DefinitionDescription = DefinitionDescriptionArgumentParser
    export const DefinitionID = DefinitionIDArgumentParser
    export const Entity = EntityArgumentParser
    export const Item = ItemArgumentParser
    export const ItemSlot = ItemSlotArgumentParser
    export const Literal = LiteralArgumentParser
    export const Message = MessageArgumentParser
    export const Identity = IdentityArgumentParser
    export const NbtPath = NbtPathArgumentParser
    export const Nbt = NbtArgumentParser
    export const Number = NumberArgumentParser
    export const NumberRange = NumberRangeArgumentParser
    export const Objective = ObjectiveArgumentParser
    export const ObjectiveCriterion = ObjectiveCriterionArgumentParser
    export const Particle = ParticleArgumentParser
    export const ScoreboardSlot = ScoreboardSlotArgumentParser
    export const String = StringArgumentParser
    export const Tag = TagArgumentParser
    export const Team = TeamArgumentParser
    export const TextComponent = TextComponentArgumentParser
    export const Time = TimeArgumentParser
    export const Uuid = UuidArgumentParser
    export const Vector = VectorArgumentParser
}
