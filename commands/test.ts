import fs from "fs/promises";

export default {
	name: "test",
	description: "Validates the bot's handler function",
	async execute(message: any, args: any, Embed: any) {
		const data = JSON.parse(await fs.readFile("./extra/testCounts.json", "utf-8"));
		data.counter = (data.counter ?? 0) + 1;
		await fs.writeFile("./extra/testCounts.json", JSON.stringify(data, null, 2));

		message.reply({
			embeds: [
				{
					...Embed.template,
					title: `Test completed. #${data.counter}`,
					description: "This command is primarily intended for Shiyo to test a specific mechanic in the code.",
				},
			],
		});
	},
};
