export default {
	name: "ping",
	description: "Checks the bot's latency.",
	async execute(message: any, Embed: any) {
		const sent = await message.channel.send("Pinging...");
		const latency = sent.createdTimestamp - message.createdTimestamp;

		sent.edit({
			embeds: [
				{
					title: "Pong!",
					description: `Latency: ${latency / 1000} seconds \nRunning on [Shiyo's Laptop]`,
					thumbnail: { url: `${message.author.displayAvatarURL()}` },
					footer: { text: "Metallica !!" },
					color: 0xa07276,

				},
			],
		});
	},
};
