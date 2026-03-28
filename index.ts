/* Programmed by ~
 .d8888b.  888      d8b Y88b   d88P       d8b d8b 
d88P  Y88b 888      Y8P  Y88b d88P        Y8P Y8P 
Y88b.      888            Y88o88P                 
 "Y888b.   88888b.  888    Y888P  .d88b.  888 888 
    "Y88b. 888 "88b 888     888  d88""88b 888 888 
      "888 888  888 888     888  888  888 888 888 
Y88b  d88P 888  888 888     888  Y88..88P 888 888 
 "Y8888P"  888  888 888     888   "Y88P"  888 888                           
*/

import { Client, Events, GatewayIntentBits, ActivityType, Collection } from "discord.js";
import config from "./config.json" with { type: "json" };
import fs from "fs";

const { TOKEN } = config; // * Used to have 2 properties

const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
	],
});

client.once(Events.ClientReady, (client) => {
	console.log(`${client.user.displayName} is now running !`);
	client.user.setPresence({ activities: [{ name: `Looking out for Danni's Streams`, type: ActivityType.Watching }] });
});

export const commands = new Collection<string, any>();
export const autoResCommands = new Collection<string, any>();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.toString().endsWith(".ts"));
const autoResFiles = fs.readdirSync("./commands/autoresponder").filter((file) => file.toString().endsWith(".ts"));

for (const file of commandFiles) {
	const command = (await import(`./commands/${file}`)).default;
	commands.set(command.name, command);
}

for (const file of autoResFiles) {
	const command = (await import(`./commands/autoresponder/${file}`)).default;
	autoResCommands.set(command.name, command);
}


client.on(Events.MessageCreate, async (message) => {
	let prefixes = ["babygirl", "bbg"];
	let PREFIX = prefixes.find((p) => message.content.toLowerCase().startsWith(p));
	if (message.author.bot) return;

	const Embed = { template: { color: 0xa07276 } }; // * I'm aware of how inconvenient this is

	const whitelisted = ["1484702657091207330", "1484465432298520647"];

	if (whitelisted.includes(message.channel.id)) {
		for (const command of autoResCommands.values()) {
			const names = Array.isArray(command.name) ? command.name : [command.name];
			if (names.some((n: any) => new RegExp(`\\b${n.trim()}\\b`, "i").test(message.content))) {
				await command.execute(message, Embed);
				break;
			}
		}
	}

	if (!PREFIX) return;

	const [cmdName, ...args] = message.content.slice(PREFIX.length).trim().split(/ +/);
	const cmd = commands.get(cmdName.toLowerCase());
	if (!cmd) return;
	await cmd.execute(message, args, client, Embed);
});

export const slashCommands = new Collection<string, any>();
const slashFiles = fs.readdirSync("./slashCommands").filter((f) => f.endsWith(".ts"));

for (const file of slashFiles) {
	const command = (await import(`./slashCommands/${file}`)).default;
	slashCommands.set(command.data.name, command);
}

import './handler/slashCommands.ts'

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const cmd = slashCommands.get(interaction.commandName);
	if (!cmd) return;

	await cmd.execute(interaction);
});

client.login(TOKEN);
