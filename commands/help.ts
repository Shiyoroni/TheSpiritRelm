import { commands } from "../index.ts";
import { autoResCommands } from "../index.ts";
import { slashCommands } from "../handler/slashCommands.ts";

export default {
	name: "help",
	description: "Lists all available commands for use",
	async execute(message: any, args: string, Embed: any) {
		const list = [...commands.values()].map((cmd) => `**${cmd.name}** - *${cmd.description}*`).join("\n");
		const arList = [...autoResCommands.values()]
			.flatMap((cmd) => {
				const names = Array.isArray(cmd.name) ? cmd.name : [cmd.name];
				return names.map((n: string) => `**${n}** - *${cmd.description}*`);
			})
			.join("\n");
		const sList = [...slashCommands.values()].map((cmd) => `**/${cmd.name}** - *${cmd.description}*`).join("\n");
		message.reply({
			embeds: [
				{
					title: "List of all commands!",
					fields: [
						{ name: "Commands ↷", value: `${list}` },
						{ name: "Autoresponder Commands ↷", value: `${arList}`, inline: true },
						{ name: "Slash Commands ↷", value: `${sList}` },
					],
					color: 0xa07276,
					image: { url: "https://i.pinimg.com/1200x/60/4b/e5/604be5cbe755f1b2ffbc87772c1dc55b.jpg" },
				},
			],
		});
	},
};
