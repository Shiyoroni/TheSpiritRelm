const { Client, Events, GatewayIntentBits, ActivityType } = require("discord.js");

const config = require('./config.json')

const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
	],
});

client.once(Events.ClientReady, (self) => {
	console.log(`${self.user.username} is starting...`);
	client.user.setPresence({
		activities: [{ name: "Looking out for Danni's Streams...", type: ActivityType.Watching }],
		status: "dnd",
	});
});

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) return;
	if (message.channelId !== "1484702657091207330") return;
	if (message.content.startsWith("https://")) return;
	if (message.content.toLowerCase().includes("jojo")) {
		try {
			const res = await fetch(
				`https://api.giphy.com/v1/gifs/search?api_key=${config.GIPHYTOKEN}&q=jojo+bizarre+adventure&limit=100&rating=pg&lang=en`,
			);

			if (!res.ok) {
				return message.channel.send("Giphy API returned an error, try again later.");
			}

			const data = await res.json();

			if (!data.data || data.data.length === 0) {
				return message.channel.send("No gifs found, try again later.");
			}

			const gif = data.data[Math.floor(Math.random() * data.data.length)];
			const url = gif.images.original.url;
			message.channel.send(url);
		} catch (err) {
			console.error(err);
			message.channel.send("Something went wrong while fetching a gif.");
		}
	}
});

client.login(config.TOKEN);
