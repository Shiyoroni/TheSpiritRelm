export default {
	name: "say",
	description: "Make the bot say anything",
	async execute(message: any, args: any) {
		if (args.length == 0) return;
		message.delete();
		message.channel.send(`${args.join(' ')}`);
	},
};
