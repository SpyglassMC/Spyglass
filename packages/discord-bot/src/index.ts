import type { ColorToken, ColorTokenType, LanguageError } from '@spyglassmc/core'
import {
	CompletionItem,
	ErrorSeverity,
	FileNode,
	fileUtil,
	ProfilerFactory,
	Range,
	Service,
} from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as je from '@spyglassmc/java-edition'
import * as mcdoc from '@spyglassmc/mcdoc'
import { webcrypto } from 'crypto'
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Client,
	ComponentType,
	EmbedBuilder,
	GatewayIntentBits,
	REST,
	Routes,
	SlashCommandBooleanOption,
	SlashCommandBuilder,
	SlashCommandStringOption,
} from 'discord.js'
import type {
	APIActionRowComponent,
	APIEmbed,
	APIMessageActionRowComponent,
	ApplicationCommandOptionChoiceData,
} from 'discord.js'
import { join } from 'path'
import { env } from 'process'
import { pathToFileURL } from 'url'

export declare const __dirname: undefined // Not defined in ES module scope
const MaxCommandLength = 1000
const MaxContentLength = 2000

const ProfilerId = 'discord-bot#startup'
const profilers = new ProfilerFactory(console, [ProfilerId])
const __profiler = profilers.get(ProfilerId)

const rootPath = env.SPYGLASSMC_DISCORD_BOT_DIR
if (!rootPath) {
	throw new Error('Environment variable SPYGLASSMC_DISCORD_BOT_DIR expected.')
}
const cacheRoot = join(rootPath, 'cache')
const projectPath = join(rootPath, 'project-root')
await fileUtil.ensureDir(NodeJsExternals, projectPath)
console.log(`cacheRoot = ${cacheRoot}`)
console.log(`projectPath = ${projectPath}`)

const config = await loadConfig()
const rest = new REST({ version: '10' }).setToken(config.token)
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const service = new Service({
	logger: console,
	profilers,
	project: {
		cacheRoot: fileUtil.ensureEndingSlash(pathToFileURL(cacheRoot).toString()),
		// defaultConfig: ConfigService.merge(VanillaConfig, { env: { dependencies: [] } }),
		externals: NodeJsExternals,
		initializers: [mcdoc.initialize, je.initialize],
		projectRoots: [fileUtil.ensureEndingSlash(pathToFileURL(projectPath).toString())],
	},
})

interface InteractionInfo {
	content: string
	errors: LanguageError[]
	activeErrorIndex: number
	tokens: readonly ColorToken[]
	showRaw: boolean
}

client.on('interactionCreate', async (i) => {
	try {
		if (i.isChatInputCommand()) {
			switch (i.commandName) {
				case 'ping':
					await i.reply({
						content: `Pong! Bot to Discord ping ${client.ws.ping} ms`,
						ephemeral: true,
					})
					break
				case 'spy':
					const command = i.options.getString('command', true)
					const showRaw = i.options.getBoolean('showraw', false) ?? false
					const info = await getInteractionInfo(command, showRaw)
					const reply = await i.reply(getReplyOptions(info))
					const collector = reply.createMessageComponentCollector({
						componentType: ComponentType.Button,
						time: 600_000, // 10 minutes
					})
					collector
						.on('collect', async (bi) => {
							if (bi.user.id !== i.user.id) {
								await bi.reply({
									content:
										'Only the original initiator of this interaction may switch to other diagnostics.',
									ephemeral: true,
								})
								return
							}

							if (bi.customId === 'previous') {
								info.activeErrorIndex--
							} else if (bi.customId === 'next') {
								info.activeErrorIndex++
							}
							await bi.update(getReplyOptions(info))
						})
						.on('end', async () => {
							await i.editReply(getReplyOptions(info, true))
						})
					break
			}
		} else if (i.isAutocomplete()) {
			const content = i.options.getFocused()
			const options = await getAutocomplete(content)
			await i.respond(options)
		}
	} catch (e) {
		console.error('[interactionCreate]', e)
	}
})

await service.project.ready()
__profiler.task('Service Ready')
await service.project.cacheService.save()
__profiler.task('Save Cache')
await client.login(config.token)
__profiler.task('Login Discord Bot')
await registerCommands()
__profiler.task('Register Commands').finalize()

interface Config {
	clientId: string
	guildId: string
	token: string
}

/**
 * @throws
 */
async function loadConfig(): Promise<Config> {
	const path = join(rootPath!, 'config.json')
	const config = (await fileUtil.readJson(NodeJsExternals, path)) as Config
	if (
		!(typeof config.clientId === 'string'
			&& typeof config.guildId === 'string'
			&& typeof config.token === 'string')
	) {
		throw new Error(`Bad config: ${JSON.stringify(config)}`)
	}
	return config
}

/**
 * @throws
 */
async function registerCommands(): Promise<unknown> {
	const pingCommand = new SlashCommandBuilder().setName('ping').setDescription(
		'Ping the Spyglass Bot',
	).toJSON()
	const spyCommand = new SlashCommandBuilder().setName('spy').setDescription(
		'Renders a mcfunction command.',
	).addStringOption(
		new SlashCommandStringOption().setName('command').setDescription(
			'Put a single mcfunction command here',
		).setAutocomplete(true).setMaxLength(MaxCommandLength).setRequired(true),
	).addBooleanOption(
		new SlashCommandBooleanOption().setName('showraw').setDescription(
			'Whether to show the result ANSI code in raw code blocks',
		).setRequired(false),
	).toJSON()

	return rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
		body: [pingCommand, spyCommand],
	})
}

function generateRandomUri(): string {
	const uuid = webcrypto.randomUUID()
	return pathToFileURL(`${rootPath}/virtual/file-${uuid}.mcfunction`).toString()
}

async function getAutocomplete(
	content: string,
): Promise<readonly ApplicationCommandOptionChoiceData<string>[]> {
	const uri = generateRandomUri()
	await service.project.onDidOpen(uri, 'mcfunction', 0, content)
	const docAndNode = await service.project.ensureClientManagedChecked(uri)
	service.project.onDidClose(uri)
	if (!docAndNode) {
		throw new Error('docAndNode is undefined')
	}

	const { node, doc } = docAndNode

	return service.complete(node, doc, content.length)
		.sort((a, b) => (a.sortText ?? a.label).localeCompare(b.sortText ?? b.label))
		// Convert autocomplete options into full text options
		.map((i) => {
			const insertText = i.insertText ?? i.label
			return `${content.slice(0, i.range.start)}${insertText}${content.slice(i.range.end)}`
		})
		// Filter to the texts starting with the user input
		.filter((v) => v.startsWith(content))
		.map((v) => ({ name: v, value: v }))
		// Limit to a maximum of 25 options
		.slice(0, 25)
}

async function getInteractionInfo(content: string, showRaw: boolean): Promise<InteractionInfo> {
	const uri = generateRandomUri()
	await service.project.onDidOpen(uri, 'mcfunction', 0, content)
	const docAndNode = await service.project.ensureClientManagedChecked(uri)
	service.project.onDidClose(uri)
	if (!docAndNode) {
		throw new Error('docAndNode is undefined')
	}

	const { node, doc } = docAndNode
	const errors = FileNode.getErrors(node)
	const tokens = service.colorize(node, doc)
	const activeErrorIndex = errors.length ? 0 : -1

	return { content, errors, activeErrorIndex, tokens, showRaw }
}

function getReplyOptions(
	info: InteractionInfo,
	expired = false,
): {
	content: string
	components: APIActionRowComponent<APIMessageActionRowComponent>[]
	embeds: APIEmbed[]
	fetchReply: true
} {
	const content = getReplyContent(info)
	return {
		content: content.length > MaxContentLength
			? `Skipped colorizing due to Discord length limit.\n\`\`\`\n${info.content}\n\`\`\``
			: content,
		components: !expired && info.errors.length > 1
			? [
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder().setCustomId('previous').setLabel('Previous Error').setStyle(
						ButtonStyle.Primary,
					).setDisabled(info.activeErrorIndex <= 0),
					new ButtonBuilder().setCustomId('next').setLabel('Next Error').setStyle(
						ButtonStyle.Primary,
					).setDisabled(info.activeErrorIndex >= info.errors.length - 1),
				).toJSON(),
			]
			: [],
		embeds: expired
			? [
				new EmbedBuilder({ description: 'The interaction has expired.' }).data,
			]
			: [],
		fetchReply: true,
	}
}

type RenderFormat =
	| 'background_orange'
	| 'foreground_blue'
	| 'foreground_cyan'
	| 'foreground_green'
	| 'foreground_pink'
	| 'foreground_red'
	| 'foreground_yellow'
	| 'foreground_white'
	| 'reset'
	| 'underline'
interface RenderToken {
	formats: Set<RenderFormat>
	range: Range
}
const AnsiCodeMap: Record<RenderFormat, number> = {
	background_orange: 41,
	foreground_blue: 34,
	foreground_cyan: 36,
	foreground_green: 32,
	foreground_pink: 35,
	foreground_red: 31,
	foreground_white: 37,
	foreground_yellow: 33,
	reset: 0,
	underline: 4,
}

const ColorTokenTypeLegend: Record<ColorTokenType, Set<RenderFormat>> = {
	comment: new Set(['foreground_green']),
	enum: new Set(['foreground_white']),
	enumMember: new Set(['foreground_white']),
	error: new Set(['foreground_red', 'underline']),
	escape: new Set(['foreground_green']),
	function: new Set(['foreground_yellow']),
	keyword: new Set(['foreground_pink']),
	literal: new Set(['foreground_blue']),
	modifier: new Set(['foreground_pink']),
	number: new Set(['foreground_green']),
	operator: new Set(['reset']),
	property: new Set(['foreground_cyan']),
	resourceLocation: new Set(['foreground_yellow']),
	string: new Set(['foreground_green']),
	struct: new Set(['foreground_white']),
	type: new Set(['foreground_white']),
	vector: new Set(['foreground_green', 'underline']),
	variable: new Set(['foreground_white']),
}

function getReplyContent(info: InteractionInfo): string {
	const { content, errors, activeErrorIndex } = info
	const ansiCode = getAnsiCode(content, toRenderTokens(info))

	const activeError: LanguageError | undefined = errors[activeErrorIndex]

	return `\`\`\`${info.showRaw ? '' : 'ansi'}\n${ansiCode}\n\`\`\`${activeError
			? `\n\`${errorSeverityToChar(activeError.severity)} ${Range.toString(activeError.range)
			} ${activeError.message}\``
			: ''
		}`
}

/**
 * @returns Unsorted tokens.
 */
function toRenderTokens({ tokens, errors, activeErrorIndex }: InteractionInfo): RenderToken[] {
	const ans: RenderToken[] = tokens.map((t) => ({
		formats: ColorTokenTypeLegend[t.type],
		range: t.range,
	}))
	const activeError: LanguageError | undefined = errors[activeErrorIndex]
	if (activeError) {
		ans.push({
			formats: new Set(['background_orange', 'foreground_white']),
			range: activeError.range,
		})
	}
	return ans
}

function getAnsiCode(content: string, tokens: RenderToken[]): string {
	let ans: string = toAnsiEscapeCode(['reset'])
	tokens = tokens.map((t) =>
		t.range.end - t.range.start === 0
			? { range: { start: t.range.start, end: t.range.start + 1 }, formats: t.formats }
			: t
	).sort((a, b) => a.range.start - b.range.start)

	for (let i = 0; i < tokens.length - 1; i++) {
		const current = tokens[i]
		const next = tokens[i + 1]

		// Handle overlapped render tokens.
		if (next.range.start < current.range.end) {
			// [current]  |  [current]  |  [current]     |  [current ]  |  [current]  |  [current]
			// [next]     |  [next   ]  |  [next      ]  |    [next]    |    [next ]  |    [next   ]
			// [    ][ ]  |  [       ]  |  [       ][ ]  |  [][    ][]  |  [][     ]  |  [][     ][]
			const insertedTokens: RenderToken[] = []
			if (current.range.start < next.range.start) {
				insertedTokens.push({
					formats: current.formats,
					range: { start: current.range.start, end: current.range.end },
				})
			}
			insertedTokens.push({
				formats: new Set([...current.formats, ...next.formats]),
				range: { start: next.range.start, end: Math.min(current.range.end, next.range.end) },
			})
			if (current.range.end !== next.range.end) {
				insertedTokens.push({
					formats: current.range.end < next.range.end ? next.formats : current.formats,
					range: {
						start: Math.min(current.range.end, next.range.end),
						end: Math.max(current.range.end, next.range.end),
					},
				})
			}
			tokens.splice(i, 2, ...insertedTokens)
		}
	}

	let lastOffset = 0
	for (const token of tokens) {
		ans += content.slice(lastOffset, token.range.start)
		ans += toAnsiEscapeCode(token.formats)
		ans += content.slice(token.range.start, token.range.end)
		ans += toAnsiEscapeCode(['reset'])
		lastOffset = token.range.end
	}
	ans += content.slice(lastOffset)
	return ans
}

function toAnsiEscapeCode(formats: Iterable<RenderFormat>): `\u001b[${string}m` {
	return `\u001b[${[...formats].map((v) => AnsiCodeMap[v]).join(';')}m`
}

function errorSeverityToChar(severity: ErrorSeverity): string {
	switch (severity) {
		case ErrorSeverity.Hint:
			return 'H'
		case ErrorSeverity.Information:
			return 'I'
		case ErrorSeverity.Warning:
			return 'W'
		case ErrorSeverity.Error:
			return 'E'
	}
}
