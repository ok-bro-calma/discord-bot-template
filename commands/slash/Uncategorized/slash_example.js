module.exports = {
  // command data
  data: ({ SlashCommandBuilder }) => new SlashCommandBuilder() // destructure the discord package for your commands
  .setName('slash')
  .setDescription('sample command file'),

  run: async (client, i) => {
    const {
      config: {
        emoji
      },
      discord: {
        EmbedBuilder
      }
    } = client;

    await i.reply({
      embeds: [
        new EmbedBuilder()
        .setColor('DarkButNotBlack')
        .setTitle(`${emoji.tick} You just ran a slash command!`)
      ]
    });
  }
}
