import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import type { ColorToken, ColorTokenType, DocAndNode } from '@spyglassmc/core'
import { fileUtil, ProfilerFactory, Service } from '@spyglassmc/core'
import * as je from '@spyglassmc/java-edition'
import * as nbtdoc from '@spyglassmc/nbtdoc'
import { Routes } from 'discord-api-types/rest/v9'
import { Client, Intents } from 'discord.js'
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

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) {
		return
	}

	try {
		switch (interaction.commandName) {
			case 'ping':
				await interaction.reply({ content: `Pong! Bot to Discord ping ${client.ws.ping} ms`, ephemeral: true })
				break
			case 'spy':
				const command = interaction.options.getString('command', true)
				const docAndNode = await getDocAndNode(command)
				if (docAndNode) {
					const { node, doc } = docAndNode
					const tokens = service.colorize(node, doc)
					await interaction.reply({ content: getAnsiCodeBlock(command, tokens) })
				}
				break
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

async function getDocAndNode(content: string): Promise<DocAndNode | undefined> {
	const uri = 'spyglassmc://discord-bot/file.mcfunction'
	service.project.onDidOpen(uri, 'mcfunction', 0, content)
	const docAndNode = await service.project.ensureParsedAndChecked(uri)
	service.project.onDidClose(uri)
	return docAndNode
}

const AnsiColorMap: Record<ColorTokenType, `${number}`> = {
	comment: '32',
	enum: '36',
	enumMember: '36',
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
	struct: '36',
	type: '36',
	variable: '36',
}
function getAnsiCodeBlock(content: string, tokens: readonly ColorToken[]): string {
	let ansiCode = ''
	let lastOffset = 0
	for (const { type, range } of tokens) {
		ansiCode += `${content.slice(lastOffset, range.start)}\u001b[${AnsiColorMap[type]}m${content.slice(range.start, range.end)}\u001b[0m`
		lastOffset = range.end
	}
	ansiCode += content.slice(lastOffset)

	return `\`\`\`ansi\n${ansiCode}\n\`\`\``
}
