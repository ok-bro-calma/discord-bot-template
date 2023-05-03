module.exports = {
  name: 'eval',
  aliases: ['e', 'ev'],
  usage: 'eval <script>',
  description: '[dev only util] Runs a script',
  
  run: async (client, message, args) => {
    if (!client.config.owners.includes(message.author.id)) return;
    args = args.join(' ');
    if (args.startsWith('```')) {
      args = args.split(`\n`);
      args.shift();
      if (args[args.length - 1] === '```') args.pop();
      args = args.join(`\n`);
    };
    try {
      args = eval(args);
      args = await client.util.clean(args);
      await message.reply({
        embeds: [
          new client.discord.EmbedBuilder()
          .setColor('DarkButNotBlack')
          .setDescription(`\`\`\`js\n${args}\`\`\``)
        ]
      });
    }
    catch(e) {
      try {
        await message.reply({
          content: `\`\`\`\n${e}\`\`\``
        });
      }
      catch {};
    };
  }
}
