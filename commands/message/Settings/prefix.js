module.exports = {
  name: 'prefix',
  aliases: ['cmd'],
  description: 'changes the prefix or reverts to default',
  run: async (client, message, args) => {
    const {
      config: {
        emoji
      },
      discord: {
        EmbedBuilder
      }
    } = client;

    let prefix = args[0] || client.config.prefix; // get the prefix if specified, or revert to default
    // try saving or send a note upon failure
    try {
      await client.db.model('guild').updateOne({ id: message.guildId }, { prefix: prefix });
      client.prefixes.set(message.guildId, prefix); // IMPORTANT: save in data!
    }
    catch {
      try {
        await message.reply({
          embeds: [
            new EmbedBuilder()
            .setTitle(`${emoji.cross} Failed to update`)
            .setFooter({
              text: 'Note: report the dev if this error persists'
            })
          ]
        });
      }
      catch {}
      finally {
        return;
      };
    };
    try {
      await message.reply({
        embeds: [
          new EmbedBuilder()
          .setTitle(`${emoji.tick} Updated the prefix`)
          .setFooter({
            text: 'Note: you can always use the bot\'s mention as a prefix'
          })
        ]
      });
    }
    catch {};
  }
}
