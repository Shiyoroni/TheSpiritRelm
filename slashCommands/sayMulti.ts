import { SlashCommandBuilder, WebhookClient, MessageFlags } from "discord.js";
import config from "../config.json" with { type: "json" };
import avatar from "../extra/webhookPfp.json" with { type: "json" };

const avatars: Record<string, string> = {
	jolyne: avatar.jolyne,
	pucci: avatar.pucci,
	gyro: avatar.gyro,
	risotto: avatar.risotto,
	caesar: avatar.caesar,
	jotaro: avatar.jotaro,
	abbacchio: avatar.abbacchio,
};

const names: Record<string, string> = {
	jolyne: "Jolyne Cujoh",
	pucci: "Enrico Pucci",
	gyro: "Gyro Zepelli",
	risotto: "Risotto Nero",
	caesar: "Caesar Zeppeli",
	jotaro: "Jotaro Kujo",
	abbacchio: "Leone Abbacchio",
};

export default {
	name: "say",
	description: "You can choose any provided JoJo character to talk as",
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Talk as any provided character to send messages as them")
		.addStringOption((option) =>
			option
				.setName("character")
				.setDescription("Choose the character you want to speak as")
				.setRequired(true)
				.addChoices(
					{ name: "Jolyne", value: "jolyne" },
					{ name: "Pucci", value: "pucci" },
					{ name: "Gyro", value: "gyro" },
					{ name: "Risotto", value: "risotto" },
					{ name: "Caesar", value: "caesar" },
					{ name: "Jotaro", value: "jotaro" },
					{ name: "Abbacchio", value: "abbacchio" },
				),
		)
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("input anything you want the character to say")
				.setRequired(true)
				.setMaxLength(2000),
		),
	async execute(interaction: any) {
		const character = interaction.options.getString("character");
		const args = interaction.options.getString("message");

		const webhookClient = new WebhookClient({ url: config.webhook });

		try {
			await webhookClient.send({ content: args!, username: names[character!], avatarURL: avatars[character!] });
			await interaction.reply({ content: "Sent! :)", flags: MessageFlags.Ephemeral });
		} catch (err) {
			console.error(err);
			await interaction.reply("There was a problem with the command. Please notify Shiyo");
		}
	},
};
