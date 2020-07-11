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
import { CodeSnippetArgumentParser } from './CodeSnippetArgumentParser'

export class ParserCollection {
    readonly Block = BlockArgumentParser
    readonly CodeSnippet = CodeSnippetArgumentParser
    readonly DefinitionDescription = DefinitionDescriptionArgumentParser
    readonly DefinitionID = DefinitionIDArgumentParser
    readonly Entity = EntityArgumentParser
    readonly Item = ItemArgumentParser
    readonly ItemSlot = ItemSlotArgumentParser
    readonly Literal = LiteralArgumentParser
    readonly Message = MessageArgumentParser
    readonly Identity = IdentityArgumentParser
    readonly NbtPath = NbtPathArgumentParser
    readonly Nbt = NbtArgumentParser
    readonly Number = NumberArgumentParser
    readonly NumberRange = NumberRangeArgumentParser
    readonly Objective = ObjectiveArgumentParser
    readonly ObjectiveCriterion = ObjectiveCriterionArgumentParser
    readonly Particle = ParticleArgumentParser
    readonly ScoreboardSlot = ScoreboardSlotArgumentParser
    readonly String = StringArgumentParser
    readonly Tag = TagArgumentParser
    readonly Team = TeamArgumentParser
    readonly TextComponent = TextComponentArgumentParser
    readonly Time = TimeArgumentParser
    readonly Uuid = UuidArgumentParser
    readonly Vector = VectorArgumentParser
}
