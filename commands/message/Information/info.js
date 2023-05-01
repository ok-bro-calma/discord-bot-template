module.exports = {
  name: 'info',
  aliases: ['about'],
  usage: 'info',
  description: 'Bot info',
  
  run: async (client, message) => {
    const {
      application,
      discord: {
        EmbedBuilder
      }
    } = client;

    try {
      const time = Date.now(); // storing the time for calculating the client ms later (not ws ms)
      // client ms = current time (in ms before sending the message) - time (in ms after sending the message)
      // ws ms = client.ws.ms
      message = await message.reply({
        embeds: [
          new EmbedBuilder()
          .setColor('DarkButNotBlack')
          .setAuthor({
            url: `https://discord.com/users/${client.user.id}`,
            name: 'About Me',
            iconURL: client.user.displayAvatarURL()
          })
          .setThumbnail(
            client.config.owners.length > 1
            ? application.owner.members.owner.displayAvatarURL()
            : application.owner.displayAvatarURL()
          )
          .addFields(
            {
              name: client.config.owners.length > 1 ? 'Team Members' : 'Owner',
              value: `\`\`\`\n${
                client.config.owners.length > 1
                ? application.owner.members.map(o => o.user.username).join(', ')
                : application.owner.username
              }\`\`\``
            },
            {
              name: 'Privacy',
              value: `\`\`\`\n${application.botPublic ? 'Public' : 'Private'}\`\`\``
            },
            {
              name: 'Created',
              value: `\`\`\`\n${application.createdAt.toGMTString().slice(0, application.createdAt.toGMTString().indexOf('G'))}\`\`\``,
              inline: true
            },
            {
              name: 'Uptime',
              value: `\`\`\`\n${client.util.time(Math.floor(client.uptime/1e3))}\`\`\``,
              inline: true
            },
            {
              name: 'Node.js',
              value: `\`\`\`\n${process.version}\`\`\``,
              inline: true
            },
            {
              name: 'Discord.js',
              value: `\`\`\`\nv${client.discord.version}\`\`\``,
              inline: true
            },
            {
              name: 'WebSocket',
              value: `\`\`\`\n${client.ws.ping}ms\`\`\``,
              inline: true
            },
            {
              name: `${client.user.username} Client`,
              value: `\`\`\`\nCalculating...\`\`\``,
              inline: true
            }
          )
        ]
      });
      await message.edit({
        embeds: [
          EmbedBuilder.from(message.embeds[0])
          .spliceFields(7, 1, { // edit the embed for client ms
            name: `${client.user.username} Client`,
            value: `\`\`\`\n${message.createdTimestamp - time}ms\`\`\``,
            inline: true
          })
        ]
      });
    }
    catch {};
  }
};
