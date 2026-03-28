import fs from "fs";
import config from "../../config.json" with { type: "json" };

const { GIPHYTOKEN } = config;

export default {
	name: "jojo",
	description: "Randomly sends JJBA gifs",
	async execute(message: any, Embed: any) {
		if (message.content.toLowerCase().includes("jojo")) {
			try {
				let commonSchemes = ["https://", "http://"];
				let arr = commonSchemes.find((s) => message.content.toLowerCase().includes(s));
				if (message.content.toLowerCase().includes(`${arr}`)) return;

				function loadCounts(): Record<string, number> {
					if (!fs.existsSync("./extra/gifCounts.json")) return {};
					return JSON.parse(fs.readFileSync("./extra/gifCounts.json", "utf-8"));
				}

				function saveCounts(counts: Record<string, number>) {
					fs.writeFileSync("./extra/gifCounts.json", JSON.stringify(counts, null, 2));
				}

				let giphyConfig = "jojo+bizarre+adventure&limit=100&rating=pg&lang=en";
				const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHYTOKEN}&q=${giphyConfig}`);

				if (!res.ok) {
					return message.channel.send("Giphy API returned an error, try again later.");
				}

				const data = await res.json();

				if (!data.data || data.data.length === 0) {
					return message.channel.send("No gifs found, try again later.");
				}

				const gif = data.data[Math.floor(Math.random() * data.data.length)];
				const url = gif.images.original.url;
				const urlID = url.split("/").at(-2);

				const counts = loadCounts();
				counts[urlID] = (counts[urlID] ?? 0) + 1;
				saveCounts(counts);

				let blacklist = (id: string) => {
					if (id === "urlID") return message.reply("Blacklisted GIF was sent. You're welcome :)");
				};

				blacklist("z9BO0C1vf1SuWmhWjB");

				message.channel.send({
					embeds: [
						{
							...Embed.template,
							image: { url: `${config.gifURL}${urlID}/giphy.gif` },
							description: `Amount of times this gif appeared: **${counts[urlID]}**`,
						},
					],
				});
			} catch (err) {
				console.error(err);
				message.channel.send("Something went wrong while fetching a gif.");
			}
		}
	},
};
