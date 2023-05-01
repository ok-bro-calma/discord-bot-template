module.exports = {
  name: 'eval',
  aliases: ['e', 'ev'],
  usage: 'eval <script>',
  description: '[dev only util] Runs a script',
  
  run: async (client, message, args) => {
    if (!client.config.owners.includes(message.author.id)) return; // owners/team members only
    
    // formatting
    args = args.join(' ');
    if (args.startsWith('```')) {
      args = args.split(`\n`);
      args.shift();
      args = args.join(`\n`);
      if (args.endsWith('```')) args = args.slice(0, -3);
    };
    
    // run and send errors (if any)
    // don't worry, detailed error is not sent, you can customize and change it though
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
          content: `\`\`\`\n${e.toString()}\`\`\``
        });
      }
      catch {};
    };
  }
}
