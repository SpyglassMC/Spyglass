import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import type { ColorToken, ColorTokenType, LanguageError } from '@spyglassmc/core'
import { ErrorSeverity, FileNode, fileUtil, ProfilerFactory, Range, Service } from '@spyglassmc/core'
import * as je from '@spyglassmc/java-edition'
import * as nbtdoc from '@spyglassmc/nbtdoc'
import { Routes } from 'discord-api-types/rest/v9'
import type { Snowflake } from 'discord.js'
import { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

export declare const __dirname: undefined // Not defined in ES module scope

const ProfilerId = 'discord-bot#startup'
const profilers = new ProfilerFactory(console, [ProfilerId])
const __profiler = profilers.get(ProfilerId)

const parentPath = dirname(fileURLToPath(import.meta.url))
const cacheRoot = join(parentPath, 'cache')
const projectPath = join(parentPath, 'project-root')
await fileUtil.ensureDir(projectPath)
console.log(`cacheRoot = ${cacheRoot}`)
console.log(`projectPath = ${projectPath}`)

const config = await loadConfig()
const rest = new REST({ version: '9' }).setToken(config.token)
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
	],
})
const service = new Service({
	cacheRoot,
	initializers: [
		nbtdoc.initialize,
		je.initialize,
	],
	logger: console,
	projectPath,
	profilers,
})
const DocumentUri = 'spyglassmc://discord-bot/file.mcfunction'

interface InteractionInfo {
	content: string,
	errors: LanguageError[],
	activeErrorIndex: number,
	tokens: readonly ColorToken[],
}
const activeInteractions = new Map<Snowflake, InteractionInfo>()

client.on('interactionCreate', async i => {
	try {
		if (i.isButton()) {
			const info = activeInteractions.get(i.message.id)
			if (!info) {
				await i.update({
					embeds: [new MessageEmbed().setDescription('The interaction has expired!')],
					components: [],
				})
				return
			}

			if (i.customId === 'p') {
				info.activeErrorIndex--
			} else if (i.customId === 'n') {
				info.activeErrorIndex++
			}
			await i.update(getReplyOptions(info))
		} else if (i.isCommand()) {
			switch (i.commandName) {
				case 'ping':
					await i.reply({ content: `Pong! Bot to Discord ping ${client.ws.ping} ms`, ephemeral: true })
					break
				case 'spy':
					const command = i.options.getString('command', true)
					const info = await getInteractionInfo(command)
					const reply = await i.reply(getReplyOptions(info))
					activeInteractions.set(reply.id, info)
					break
			}
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
	clientId: string,
	guildId: string,
	token: string,
}

/**
 * @throws
 */
async function loadConfig(): Promise<Config> {
	const path = join(parentPath, 'config.json')
	const config = await fileUtil.readJson<Config>(path)
	if (!(typeof config.clientId === 'string' &&
		typeof config.guildId === 'string' &&
		typeof config.token === 'string')) {
		throw new Error(`Bad config: ${JSON.stringify(config)}`)
	}
	return config
}

/**
 * @throws
 */
async function registerCommands(): Promise<unknown> {
	const pingCommand = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping the Spyglass Bot')
		.toJSON()
	const spyCommand = new SlashCommandBuilder()
		.setName('spy')
		.setDescription('Renders a mcfunction command. Error reporting coming soon™')
		.addStringOption(new SlashCommandStringOption()
			.setName('command')
			.setDescription('Put a single mcfunction command here')
			.setRequired(true)
		)
		.toJSON()

	return rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [pingCommand, spyCommand] })
}

async function getInteractionInfo(content: string): Promise<InteractionInfo> {
	if (activeInteractions.has(content)) {
		return activeInteractions.get(content)!
	}

	service.project.onDidOpen(DocumentUri, 'mcfunction', 0, content)
	const docAndNode = await service.project.ensureParsedAndChecked(DocumentUri)
	service.project.onDidClose(DocumentUri)
	if (!docAndNode) {
		throw new Error('docAndNode is undefined')
	}

	const { node, doc } = docAndNode
	const errors = FileNode.getErrors(node)
	const tokens = service.colorize(node, doc)
	const activeErrorIndex = errors.length ? 0 : -1

	return {
		content,
		errors,
		activeErrorIndex,
		tokens,
	}
}

function getReplyOptions(info: InteractionInfo): { content: string, components: MessageActionRow[], fetchReply: true } {
	return {
		content: getReplyContent(info),
		components: info.errors.length > 1 ? [new MessageActionRow().addComponents(
			new MessageButton().setCustomId('p').setLabel('Previous Error').setStyle('PRIMARY').setDisabled(info.activeErrorIndex <= 0),
			new MessageButton().setCustomId('n').setLabel('Next Error').setStyle('PRIMARY').setDisabled(info.activeErrorIndex >= info.errors.length - 1)
		)] : [],
		fetchReply: true,
	}
}

const AnsiColorMap: Record<ColorTokenType, `${number}`> = {
	comment: '32',
	enum: '37',
	enumMember: '37',
	error: '31',
	function: '33',
	keyword: '35',
	literal: '34',
	modifier: '35',
	number: '32',
	operator: '0',
	property: '36',
	resourceLocation: '33',
	string: '32',
	struct: '37',
	type: '37',
	variable: '37',
}
function getReplyContent({ content, tokens, errors, activeErrorIndex }: InteractionInfo): string {
	let ansiCode = ''
	let lastOffset = 0
	for (const { type, range } of tokens) {
		ansiCode += `${content.slice(lastOffset, range.start)}\u001b[${AnsiColorMap[type]}m${content.slice(range.start, range.end)}\u001b[0m`
		lastOffset = range.end
	}
	ansiCode += content.slice(lastOffset)

	const activeError: LanguageError | undefined = errors[activeErrorIndex]

	return `\`\`\`ansi\n${ansiCode}\n\`\`\`${activeError
		? `\n\`${errorSeverityToChar(activeError.severity)} ${Range.toString(activeError.range)} ${activeError.message}\``
		: ''}`
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
