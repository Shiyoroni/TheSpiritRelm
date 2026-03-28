import { Collection, REST, Routes } from "discord.js";
import fs from "fs";
import config from "../config.json" with { type: "json" };

const { TOKEN, CLIENT_ID, GUILD_ID } = config

export const slashCommands = new Collection<string, any>()
const commandFiles = fs.readdirSync("./slashCommands").filter((files: any) => files.endsWith(".ts"));

for (const file of commandFiles) {
	const command = (await import(`../slashCommands/${file}`)).default;
	slashCommands.set(command.data.name, command);
}

const rest = new REST().setToken(TOKEN);

await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { 
    body: [...slashCommands.values()].map(cmd => cmd.data.toJSON())
});

console.log("Commands refreshed!");
